const fs = require('fs');
const vm = require('vm');

console.log("=== COMPREHENSIVE KMK SCHOOL HOLIDAYS AUDIT & VERIFICATION ===");

// 1. Load school-holidays.js in Node context
const SH = require('../js/data/school-holidays.js');
global.GERMAN_SCHOOL_HOLIDAYS = SH;

// 2. Source Metadata Verification
if (SH.source !== "Kultusministerkonferenz (KMK)") {
  throw new Error(`Invalid source metadata: got "${SH.source}", expected "Kultusministerkonferenz (KMK)"`);
}
if (!SH.sourceUrl || !SH.sourceUrl.startsWith("https://www.kmk.org/")) {
  throw new Error(`Invalid sourceUrl: got "${SH.sourceUrl}", must start with official KMK domain`);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(SH.lastVerified)) {
  throw new Error(`Invalid lastVerified date format: "${SH.lastVerified}"`);
}
console.log(`[PASS] Official KMK Metadata: Source="${SH.source}", URL="${SH.sourceUrl}", Verified=${SH.lastVerified}`);

// 3. Helper: getAvailableYears()
const avail = SH.getAvailableYears();
if (!avail || !Array.isArray(avail.schoolYears) || !Array.isArray(avail.calendarYears)) {
  throw new Error("getAvailableYears() must return object with schoolYears and calendarYears arrays");
}

const requiredSchoolYears = ["2025/2026", "2026/2027", "2027/2028"];
requiredSchoolYears.forEach(sy => {
  if (!avail.schoolYears.includes(sy)) {
    throw new Error(`Mandatory school year missing in getAvailableYears: ${sy}`);
  }
});

console.log(`[PASS] Available Years Helper: School Years=[${avail.schoolYears.join(', ')}], Calendar Years=[${avail.calendarYears.join(', ')}]`);

// 4. Verification of 16 Bundesländer
const ALL_16_STATES = [
  "BW", "BY", "BE", "BB", "HB", "HH", "HE", "MV",
  "NI", "NW", "RP", "SL", "SN", "ST", "SH", "TH"
];

if (SH.allStateCodes.length !== 16) {
  throw new Error(`Must have exactly 16 state codes, got ${SH.allStateCodes.length}`);
}

ALL_16_STATES.forEach(code => {
  if (!SH.allStateCodes.includes(code)) {
    throw new Error(`Missing statutory state code: ${code}`);
  }
});

// 5. Date Validation Helper
function isValidIsoDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  return (
    dateObj.getUTCFullYear() === y &&
    dateObj.getUTCMonth() === m - 1 &&
    dateObj.getUTCDate() === d
  );
}

// 6. Programmatic Audit across all Supported School Years
const validTypes = ["autumn", "christmas", "winter", "easter", "pentecost", "summer"];

avail.schoolYears.forEach(sy => {
  const syData = SH.bySchoolYear[sy];
  if (!syData) {
    throw new Error(`School year dataset missing in bySchoolYear: ${sy}`);
  }

  ALL_16_STATES.forEach(scode => {
    const stateEntry = syData[scode];
    if (!stateEntry) {
      throw new Error(`State ${scode} completely missing from school year ${sy}`);
    }

    if (stateEntry.stateCode !== scode) {
      throw new Error(`Mismatched stateCode in entry: got ${stateEntry.stateCode}, expected ${scode}`);
    }

    if (!stateEntry.stateNameDe || typeof stateEntry.stateNameDe !== 'string') {
      throw new Error(`Missing stateNameDe for ${scode} in ${sy}`);
    }

    if (typeof stateEntry.movableDays !== 'number' || stateEntry.movableDays < 0) {
      throw new Error(`Invalid movableDays for ${scode} in ${sy}: ${stateEntry.movableDays}`);
    }

    // Footnote check: SH must have island footnote
    if (scode === "SH") {
      if (!stateEntry.footnote || !stateEntry.footnote.includes("Sylt, Föhr, Amrum und Helgoland")) {
        throw new Error(`Missing or incomplete Schleswig-Holstein island footnote in ${sy}`);
      }
    }

    if (!Array.isArray(stateEntry.periods) || stateEntry.periods.length === 0) {
      throw new Error(`Periods missing or empty for ${scode} in ${sy}`);
    }

    // Validate periods
    let prevEnd = "0000-00-00";
    stateEntry.periods.forEach((p, pIdx) => {
      // Valid type
      if (!validTypes.includes(p.type)) {
        throw new Error(`Invalid holiday type "${p.type}" in ${scode} ${sy}`);
      }

      // Valid names
      if (!p.nameDe || !p.nameEn || !p.nameKo) {
        throw new Error(`Missing localized names in ${scode} ${sy} period ${pIdx}`);
      }

      // Date format and impossible date check
      if (!isValidIsoDate(p.start)) {
        throw new Error(`Malformed or impossible start date: "${p.start}" in ${scode} ${sy}`);
      }
      if (!isValidIsoDate(p.end)) {
        throw new Error(`Malformed or impossible end date: "${p.end}" in ${scode} ${sy}`);
      }

      // start <= end
      if (p.start > p.end) {
        throw new Error(`Start date "${p.start}" is after end date "${p.end}" in ${scode} ${sy}`);
      }

      // Chronological order & accidental overlap check
      if (p.start <= prevEnd) {
        throw new Error(`Accidental overlap or order violation between periods in ${scode} ${sy}: "${p.start}" <= "${prevEnd}"`);
      }
      prevEnd = p.end;
    });
  });

  console.log(`[PASS] School Year ${sy}: All 16 Bundesländer verified, dates valid, 0 overlaps.`);
});

// 7. Test getSchoolHolidays(year, stateCode) by School Year
const be2026_27 = SH.getSchoolHolidays("2026/2027", "BE");
if (!Array.isArray(be2026_27) || be2026_27.length === 0) {
  throw new Error("getSchoolHolidays('2026/2027', 'BE') failed to return periods");
}
const beSummer27 = be2026_27.find(p => p.type === "summer");
if (!beSummer27 || beSummer27.start !== "2027-07-01" || beSummer27.end !== "2027-08-14") {
  throw new Error(`Berlin 2027 summer vacation mismatch: got ${JSON.stringify(beSummer27)}`);
}
console.log(`[PASS] getSchoolHolidays by school year: Berlin 2026/2027 Summer is ${beSummer27.start} ~ ${beSummer27.end}`);

// 8. Test getSchoolHolidays(year, stateCode) by Calendar Year
const by2026 = SH.getSchoolHolidays(2026, "BY");
if (!Array.isArray(by2026) || by2026.length === 0) {
  throw new Error("getSchoolHolidays(2026, 'BY') failed to return calendar year periods");
}
// In calendar year 2026, Bayern must include Winter (Frühjahr 16.02.-20.02.2026) and Summer (03.08.-14.09.2026)
const byWinter26 = by2026.find(p => p.type === "winter");
if (!byWinter26 || byWinter26.start !== "2026-02-16" || byWinter26.end !== "2026-02-20") {
  throw new Error(`Bayern 2026 winter vacation mismatch: got ${JSON.stringify(byWinter26)}`);
}
console.log(`[PASS] getSchoolHolidays by calendar year: Bayern 2026 Winter is ${byWinter26.start} ~ ${byWinter26.end}`);

// 9. Test Unsupported Year & Invalid State Handling (Never return fake data)
const unsuppYear = SH.getSchoolHolidays(2035, "BE");
if (!unsuppYear || !unsuppYear.unavailable || unsuppYear.error !== "DATA_UNAVAILABLE") {
  throw new Error("Unsupported year 2035 must return structured data unavailable state");
}
console.log(`[PASS] Unsupported Year 2035 handled correctly: "${unsuppYear.messageEn}"`);

const unsuppSy = SH.getSchoolHolidays("2010/2011", "BE");
if (!unsuppSy || !unsuppSy.unavailable || unsuppSy.error !== "DATA_UNAVAILABLE") {
  throw new Error("Unsupported school year 2010/2011 must return structured data unavailable state");
}
console.log(`[PASS] Unsupported School Year 2010/2011 handled correctly: "${unsuppSy.messageEn}"`);

const invalidState = SH.getSchoolHolidays(2026, "XX");
if (!invalidState || !invalidState.unavailable || invalidState.error !== "INVALID_STATE") {
  throw new Error("Invalid state 'XX' must return invalid state error");
}
console.log(`[PASS] Invalid State 'XX' rejected: "${invalidState.messageEn}"`);

console.log("\n🎉 ALL KMK SCHOOL HOLIDAYS AUDIT TESTS PASSED WITHOUT EXCEPTION!");
