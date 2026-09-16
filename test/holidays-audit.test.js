/**
 * Comprehensive Statutory German Public Holidays Audit Test Suite
 * 
 * Verifies regional edge cases, strict hierarchy, and statutory accuracy:
 * - Hierarchy: nationwide | state | regional | municipal
 * - Mariä Himmelfahrt in Bavaria (regional, Catholic municipalities only, NOT statewide)
 * - Augsburger Hohes Friedensfest (municipal, Stadt Augsburg only, NOT statewide)
 * - Buß- und Bettag in Saxony (statewide legal holiday)
 * - Augsburg 14 holidays total
 * - Berlin 10 statewide holidays
 * - Saxony 11 statewide holidays + regional Fronleichnam
 * - North Rhine-Westphalia 11 statewide holidays
 */

const assert = require('assert');
const GERMAN_HOLIDAYS = require('../js/data/holidays.js');
const CalendarTools = require('../js/calculators/calendar-tools.js');

console.log('=== COMPREHENSIVE GERMAN PUBLIC HOLIDAYS AUDIT & VERIFICATION ===\n');

// 1. Hierarchy & Locality Scope Metadata Validation
console.log('--- 1. Hierarchy & Locality Scopes ---');
const scopes = GERMAN_HOLIDAYS.LOCALITY_SCOPES;
assert.strictEqual(scopes.NATIONWIDE, 'nationwide');
assert.strictEqual(scopes.STATE, 'state');
assert.strictEqual(scopes.REGIONAL, 'regional');
assert.strictEqual(scopes.MUNICIPAL, 'municipal');

const all2026 = GERMAN_HOLIDAYS.getAllHolidaysForYear(2026);
assert(all2026.length >= 17, 'Master holiday catalog should include all nationwide, state, regional, and municipal holidays');

all2026.forEach(h => {
  assert(['nationwide', 'state', 'regional', 'municipal'].includes(h.localityScope),
    `Holiday ${h.id} has invalid localityScope: ${h.localityScope}`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(h.date), `Holiday ${h.id} date format must be YYYY-MM-DD`);
  assert(h.nameDe && h.nameEn && h.nameKo, `Holiday ${h.id} must have multilingual names`);
});
console.log('[PASS] Locality Scopes & ISO format verified across all cataloged holidays.');

// 2. Statutory Sources Metadata Validation
console.log('\n--- 2. Statutory Sources Metadata ---');
const sources = GERMAN_HOLIDAYS.officialSources;
assert(sources.federal && sources.federal.name.includes('Art. 74'), 'Federal GG Art. 74 competence cited');
assert(sources.bavaria && sources.bavaria.name.includes('FTG'), 'Bavarian FTG cited');
assert(sources.saxony && sources.saxony.name.includes('SächsSFG'), 'Saxony SächsSFG cited');
assert(sources.berlin && sources.berlin.name.includes('FeiertG BE'), 'Berlin FeiertG BE cited');
assert(sources.nrw && sources.nrw.name.includes('Feiertagsgesetz NW'), 'NRW Feiertagsgesetz NW cited');
assert(sources.saarland && sources.saarland.name.includes('SFG'), 'Saarland SFG cited');
console.log('[PASS] Statutory source metadata verified for Federal and State legislation.');

// 3. Berlin (BE) Audit
console.log('\n--- 3. Berlin (BE) Audit ---');
const berlinBreakdown = GERMAN_HOLIDAYS.getHolidaysBreakdown(2026, 'BE');
assert.strictEqual(berlinBreakdown.totalStatewideCount, 10, 'Berlin must have exactly 10 statewide public holidays');
assert.strictEqual(berlinBreakdown.additionalLocalHolidays.length, 0, 'Berlin has zero municipal/regional public holidays');
assert.strictEqual(berlinBreakdown.hasLocalExceptions, false, 'Berlin hasLocalExceptions should be false');

const frauentagBE = berlinBreakdown.statewideHolidays.find(h => h.id === 'frauentag');
assert(frauentagBE, 'Frauentag (08.03.) must be present in Berlin');
assert.strictEqual(frauentagBE.localityScope, 'state', 'Frauentag has state scope');
assert.strictEqual(frauentagBE.date, '2026-03-08');
console.log('[PASS] Berlin: 10 statewide holidays verified (9 nationwide + Frauentag), 0 local exceptions.');

// 4. Bavaria (BY) Statewide Audit (Excluding regional/municipal exceptions from statewide total)
console.log('\n--- 4. Bavaria (BY) Audit ---');
const bavariaBreakdown = GERMAN_HOLIDAYS.getHolidaysBreakdown(2026, 'BY');
assert.strictEqual(bavariaBreakdown.totalStatewideCount, 12, 'Bavaria must have exactly 12 statewide public holidays');

// Crucial: Mariä Himmelfahrt and Augsburger Friedensfest must NOT be in the statewide total!
const byStateIds = bavariaBreakdown.statewideHolidays.map(h => h.id);
assert(!byStateIds.includes('mariae_himmelfahrt_by'), 'CRITICAL: Mariä Himmelfahrt must NOT be in Bavaria statewide total');
assert(!byStateIds.includes('augsburger_friedensfest'), 'CRITICAL: Augsburger Friedensfest must NOT be in Bavaria statewide total');

// State-level holidays in Bavaria: Heilige Drei Könige, Fronleichnam, Allerheiligen
assert(byStateIds.includes('heilige_drei_koenige'), 'Heilige Drei Könige is statewide in BY');
assert(byStateIds.includes('fronleichnam'), 'Fronleichnam is statewide in BY');
assert(byStateIds.includes('allerheiligen'), 'Allerheiligen is statewide in BY');

// Additional local holidays in Bavaria: exactly 2
assert.strictEqual(bavariaBreakdown.additionalLocalHolidays.length, 2, 'Bavaria has exactly 2 additional local holidays');
assert.strictEqual(bavariaBreakdown.hasLocalExceptions, true, 'Bavaria hasLocalExceptions must be true');
assert.strictEqual(bavariaBreakdown.explanation, 'Some holidays apply only in certain municipalities or regions.');

const friedensfestBY = bavariaBreakdown.additionalLocalHolidays.find(h => h.id === 'augsburger_friedensfest');
assert(friedensfestBY, 'Augsburger Friedensfest must be listed in additional local holidays');
assert.strictEqual(friedensfestBY.localityScope, 'municipal', 'Augsburger Friedensfest must have municipal scope');
assert.strictEqual(friedensfestBY.date, '2026-08-08');

const mariaeHimmelfahrtBY = bavariaBreakdown.additionalLocalHolidays.find(h => h.id === 'mariae_himmelfahrt_by');
assert(mariaeHimmelfahrtBY, 'Mariä Himmelfahrt must be listed in additional local holidays for BY');
assert.strictEqual(mariaeHimmelfahrtBY.localityScope, 'regional', 'Mariä Himmelfahrt must have regional scope in BY');
assert.strictEqual(mariaeHimmelfahrtBY.date, '2026-08-15');
assert(mariaeHimmelfahrtBY.notesEn.includes('Nuremberg'), 'Notes explain that Nuremberg is Protestant and does not observe it');
console.log('[PASS] Bavaria: 12 statewide holidays verified; Mariä Himmelfahrt (regional) and Friedensfest (municipal) separated.');

// 5. Augsburg (BY-AUG / Stadt Augsburg) Audit
console.log('\n--- 5. Augsburg Audit ---');
const augsburgBreakdown = GERMAN_HOLIDAYS.getHolidaysBreakdown(2026, 'BY-AUG');
assert.strictEqual(augsburgBreakdown.isAugsburg, true);
assert.strictEqual(augsburgBreakdown.totalStatewideCount, 14, 'Augsburg must have exactly 14 public holidays (highest in Germany)');
assert.strictEqual(augsburgBreakdown.additionalLocalHolidays.length, 0, 'All 14 holidays are directly applicable in Augsburg');

const augIds = augsburgBreakdown.statewideHolidays.map(h => h.id);
assert(augIds.includes('neujahr'), 'Neujahr in Augsburg');
assert(augIds.includes('heilige_drei_koenige'), 'Heilige Drei Könige in Augsburg');
assert(augIds.includes('karfreitag'), 'Karfreitag in Augsburg');
assert(augIds.includes('ostermontag'), 'Ostermontag in Augsburg');
assert(augIds.includes('tag_der_arbeit'), 'Tag der Arbeit in Augsburg');
assert(augIds.includes('christi_himmelfahrt'), 'Christi Himmelfahrt in Augsburg');
assert(augIds.includes('pfingstmontag'), 'Pfingstmontag in Augsburg');
assert(augIds.includes('fronleichnam'), 'Fronleichnam in Augsburg');
assert(augIds.includes('augsburger_friedensfest'), 'Augsburger Friedensfest in Augsburg (Aug 8)');
assert(augIds.includes('mariae_himmelfahrt_by'), 'Mariä Himmelfahrt in Augsburg (Aug 15)');
assert(augIds.includes('tag_der_deutschen_einheit'), 'Tag der Deutschen Einheit in Augsburg');
assert(augIds.includes('allerheiligen'), 'Allerheiligen in Augsburg');
assert(augIds.includes('weihnachtstag_1'), '1. Weihnachtstag in Augsburg');
assert(augIds.includes('weihnachtstag_2'), '2. Weihnachtstag in Augsburg');

// Also verify querying via options.locality = 'augsburg'
const augViaOptions = GERMAN_HOLIDAYS.getHolidaysForYear(2026, 'BY', { locality: 'augsburg' });
assert.strictEqual(augViaOptions.length, 14, 'getHolidaysForYear with locality augsburg returns 14 holidays');
console.log('[PASS] Augsburg: Exactly 14 public holidays verified (9 nationwide + 3 state + 1 regional + 1 municipal).');

// 6. Saxony (SN) Audit
console.log('\n--- 6. Saxony (SN) Audit ---');
const saxonyBreakdown = GERMAN_HOLIDAYS.getHolidaysBreakdown(2026, 'SN');
assert.strictEqual(saxonyBreakdown.totalStatewideCount, 11, 'Saxony must have exactly 11 statewide public holidays');

const snIds = saxonyBreakdown.statewideHolidays.map(h => h.id);
assert(snIds.includes('reformationstag'), 'Reformationstag is statewide in Saxony');
assert(snIds.includes('buss_und_bettag'), 'Buß- und Bettag is statewide in Saxony');

const bussUndBettagSN = saxonyBreakdown.statewideHolidays.find(h => h.id === 'buss_und_bettag');
assert.strictEqual(bussUndBettagSN.localityScope, 'state');
assert.strictEqual(bussUndBettagSN.date, '2026-11-18', '2026 Buß- und Bettag is 2026-11-18');
assert(bussUndBettagSN.notesEn.includes('0.5 percentage points'), 'Explains 0.5% Pflegeversicherung employee surcharge');

// Fronleichnam is regional in Saxony (only in Landkreis Bautzen Sorbian municipalities)
assert(!snIds.includes('fronleichnam'), 'Fronleichnam is NOT statewide in Saxony');
assert.strictEqual(saxonyBreakdown.additionalLocalHolidays.length, 1);
const fronleichnamSN = saxonyBreakdown.additionalLocalHolidays[0];
assert.strictEqual(fronleichnamSN.id, 'fronleichnam_sn');
assert.strictEqual(fronleichnamSN.localityScope, 'regional');
assert.strictEqual(fronleichnamSN.date, '2026-06-04');
console.log('[PASS] Saxony: 11 statewide holidays verified (including Buß- und Bettag); Fronleichnam separated as regional (Bautzen).');

// 7. North Rhine-Westphalia (NW) Audit
console.log('\n--- 7. North Rhine-Westphalia (NW) Audit ---');
const nrwBreakdown = GERMAN_HOLIDAYS.getHolidaysBreakdown(2026, 'NW');
assert.strictEqual(nrwBreakdown.totalStatewideCount, 11, 'NRW must have exactly 11 statewide public holidays');
assert.strictEqual(nrwBreakdown.additionalLocalHolidays.length, 0, 'NRW has zero municipal/regional exceptions');

const nwIds = nrwBreakdown.statewideHolidays.map(h => h.id);
assert(nwIds.includes('fronleichnam'), 'Fronleichnam is statewide in NRW');
assert(nwIds.includes('allerheiligen'), 'Allerheiligen is statewide in NRW');
assert(!nwIds.includes('heilige_drei_koenige'), 'Heilige Drei Könige is NOT a holiday in NRW');
assert(!nwIds.includes('reformationstag'), 'Reformationstag is NOT a holiday in NRW');
console.log('[PASS] North Rhine-Westphalia: 11 statewide holidays verified (9 nationwide + Fronleichnam + Allerheiligen), 0 local exceptions.');

// 8. Saarland (SL) vs Bavaria (BY) for Mariä Himmelfahrt
console.log('\n--- 8. Saarland (SL) Statewide vs Bavaria (BY) Regional Comparison ---');
const slBreakdown = GERMAN_HOLIDAYS.getHolidaysBreakdown(2026, 'SL');
assert.strictEqual(slBreakdown.totalStatewideCount, 12, 'Saarland has 12 statewide holidays');
const slHimmelfahrt = slBreakdown.statewideHolidays.find(h => h.id === 'mariae_himmelfahrt_sl');
assert(slHimmelfahrt, 'Mariä Himmelfahrt IS statewide in Saarland (§ 2 Abs. 1 Nr. 7 SFG)');
assert.strictEqual(slHimmelfahrt.localityScope, 'state');

const byStateHimmelfahrt = bavariaBreakdown.statewideHolidays.find(h => h.id.startsWith('mariae_himmelfahrt'));
assert.strictEqual(byStateHimmelfahrt, undefined, 'Mariä Himmelfahrt is NOT statewide in Bavaria');
console.log('[PASS] Legal distinction confirmed: Mariä Himmelfahrt is statewide in Saarland, but regional in Bavaria.');

// 9. Multi-Year Dynamic Algorithms (Easter & Buß- und Bettag)
console.log('\n--- 9. Multi-Year Dynamic Calculations ---');
const easterTests = [
  { year: 2024, easter: '2024-03-31', buss: '2024-11-20' },
  { year: 2025, easter: '2025-04-20', buss: '2025-11-19' },
  { year: 2026, easter: '2026-04-05', buss: '2026-11-18' },
  { year: 2027, easter: '2027-03-28', buss: '2027-11-17' },
  { year: 2028, easter: '2028-04-16', buss: '2028-11-22' }
];

easterTests.forEach(t => {
  const easterDate = GERMAN_HOLIDAYS.formatDate(GERMAN_HOLIDAYS.getEasterSunday(t.year));
  const bussDate = GERMAN_HOLIDAYS.formatDate(GERMAN_HOLIDAYS.getBussUndBettag(t.year));
  assert.strictEqual(easterDate, t.easter, `Easter for ${t.year} must be ${t.easter}`);
  assert.strictEqual(bussDate, t.buss, `Buß- und Bettag for ${t.year} must be ${t.buss}`);
});
console.log('[PASS] Dynamic Easter algorithm and Buß- und Bettag verified across 2024-2028.');

// 10. Working Days Calculation Integration with Regional Scopes
console.log('\n--- 10. Working Days Integration with Regional Scopes ---');
// In 2025, Aug 8 was Friday and Aug 15 was Friday:
const workBYAug8_2025 = CalendarTools.calculateWorkingDays('2025-08-08', '2025-08-08', 'BY');
assert.strictEqual(workBYAug8_2025.weekdayHolidayDays, 0, 'Augsburg Friedensfest is NOT a statewide holiday in BY');
assert.strictEqual(workBYAug8_2025.workingDays, 1);

const workAugsburgAug8_2025 = CalendarTools.calculateWorkingDays('2025-08-08', '2025-08-08', 'BY-AUG');
assert.strictEqual(workAugsburgAug8_2025.weekdayHolidayDays, 1, 'Augsburg Friedensfest IS a municipal holiday in Augsburg');
assert.strictEqual(workAugsburgAug8_2025.workingDays, 0);

const workBYAug15_2025 = CalendarTools.calculateWorkingDays('2025-08-15', '2025-08-15', 'BY');
assert.strictEqual(workBYAug15_2025.weekdayHolidayDays, 0, 'Mariä Himmelfahrt is NOT a statewide holiday in BY');
assert.strictEqual(workBYAug15_2025.workingDays, 1);

const workSLAug15_2025 = CalendarTools.calculateWorkingDays('2025-08-15', '2025-08-15', 'SL');
assert.strictEqual(workSLAug15_2025.weekdayHolidayDays, 1, 'Mariä Himmelfahrt IS a statewide holiday in Saarland');
assert.strictEqual(workSLAug15_2025.workingDays, 0);

console.log('[PASS] Regional and municipal working days adjustments verified for 2025 baseline.');

// 11. Rigorous 2026 Working Days Separation & Double-Deduction Audit
console.log('\n--- 11. Known 2026 Working Days & Separate Concepts Audit ---');

// A. Full Year 2026 across German States:
// 2026: 365 calendar days, 52 Saturdays, 52 Sundays, 104 weekend days, 261 total weekdays (Mon-Fri)
const full2026_BE = CalendarTools.calculateWorkingDays('2026-01-01', '2026-12-31', 'BE');
assert.strictEqual(full2026_BE.calendarDays, 365);
assert.strictEqual(full2026_BE.saturdayDays, 52);
assert.strictEqual(full2026_BE.sundayDays, 52);
assert.strictEqual(full2026_BE.weekendDays, 104);
assert.strictEqual(full2026_BE.publicHolidayDays, 10);
assert.strictEqual(full2026_BE.weekdayHolidayDays, 7); // Jan 1, Apr 3, Apr 6, May 1, May 14, May 25, Dec 25
assert.strictEqual(full2026_BE.weekendHolidayDays, 3); // Mar 8 (Sun), Oct 3 (Sat), Dec 26 (Sat)
assert.strictEqual(full2026_BE.workingDays, 254); // 261 weekdays - 7 weekday holidays = 254
// Verify that naive formula (365 - (104 + 10) = 251) was NOT used!
assert(full2026_BE.workingDays > 251, 'Weekend holidays must not be double deducted');
console.log('[PASS] Berlin 2026: 365 cal, 52 Sat, 52 Sun, 10 pub holidays (7 weekday, 3 weekend), exactly 254 working days.');

const full2026_BY = CalendarTools.calculateWorkingDays('2026-01-01', '2026-12-31', 'BY');
assert.strictEqual(full2026_BY.calendarDays, 365);
assert.strictEqual(full2026_BY.saturdayDays, 52);
assert.strictEqual(full2026_BY.sundayDays, 52);
assert.strictEqual(full2026_BY.weekendDays, 104);
assert.strictEqual(full2026_BY.publicHolidayDays, 12);
assert.strictEqual(full2026_BY.weekdayHolidayDays, 9); // Jan 1, Jan 6, Apr 3, Apr 6, May 1, May 14, May 25, Jun 4, Dec 25
assert.strictEqual(full2026_BY.weekendHolidayDays, 3); // Oct 3 (Sat), Nov 1 (Sun), Dec 26 (Sat)
assert.strictEqual(full2026_BY.workingDays, 252); // 261 - 9 = 252
console.log('[PASS] Bavaria 2026: 365 cal, 52 Sat, 52 Sun, 12 pub holidays (9 weekday, 3 weekend), exactly 252 working days.');

const full2026_AUG = CalendarTools.calculateWorkingDays('2026-01-01', '2026-12-31', 'BY-AUG');
assert.strictEqual(full2026_AUG.calendarDays, 365);
assert.strictEqual(full2026_AUG.publicHolidayDays, 14); // 14 statutory holidays in Augsburg!
assert.strictEqual(full2026_AUG.weekdayHolidayDays, 9);
assert.strictEqual(full2026_AUG.weekendHolidayDays, 5); // Aug 8 (Sat), Aug 15 (Sat), Oct 3 (Sat), Nov 1 (Sun), Dec 26 (Sat)
assert.strictEqual(full2026_AUG.workingDays, 252);
console.log('[PASS] Augsburg 2026: 14 public holidays (5 on weekend: Aug 8 Sat, Aug 15 Sat, Oct 3 Sat, Nov 1 Sun, Dec 26 Sat).');

const full2026_SN = CalendarTools.calculateWorkingDays('2026-01-01', '2026-12-31', 'SN');
assert.strictEqual(full2026_SN.publicHolidayDays, 11);
assert.strictEqual(full2026_SN.weekdayHolidayDays, 8); // Jan 1, Apr 3, Apr 6, May 1, May 14, May 25, Nov 18, Dec 25
assert.strictEqual(full2026_SN.weekendHolidayDays, 3); // Oct 3 (Sat), Oct 31 (Sat), Dec 26 (Sat)
assert.strictEqual(full2026_SN.workingDays, 253); // 261 - 8 = 253
console.log('[PASS] Saxony 2026: 11 public holidays (8 weekday, 3 weekend), exactly 253 working days.');

const full2026_NW = CalendarTools.calculateWorkingDays('2026-01-01', '2026-12-31', 'NW');
assert.strictEqual(full2026_NW.publicHolidayDays, 11);
assert.strictEqual(full2026_NW.weekdayHolidayDays, 8); // Jan 1, Apr 3, Apr 6, May 1, May 14, May 25, Jun 4, Dec 25
assert.strictEqual(full2026_NW.weekendHolidayDays, 3); // Oct 3 (Sat), Nov 1 (Sun), Dec 26 (Sat)
assert.strictEqual(full2026_NW.workingDays, 253);
console.log('[PASS] NRW 2026: 11 public holidays (8 weekday, 3 weekend), exactly 253 working days.');

// B. October 2026 (Tag der Deutschen Einheit on Saturday Oct 3):
// 2026-10-01 (Thu) to 2026-10-31 (Sat): 31 calendar days, 5 Saturdays, 4 Sundays = 9 weekend days, 22 weekdays
const oct2026_NW = CalendarTools.calculateWorkingDays('2026-10-01', '2026-10-31', 'NW');
assert.strictEqual(oct2026_NW.calendarDays, 31);
assert.strictEqual(oct2026_NW.saturdayDays, 5);
assert.strictEqual(oct2026_NW.sundayDays, 4);
assert.strictEqual(oct2026_NW.weekendDays, 9);
assert.strictEqual(oct2026_NW.publicHolidayDays, 1); // Oct 3
assert.strictEqual(oct2026_NW.weekdayHolidayDays, 0); // Oct 3 is Saturday!
assert.strictEqual(oct2026_NW.weekendHolidayDays, 1);
assert.strictEqual(oct2026_NW.workingDays, 22, 'Oct 2026 in NRW must have 22 working days (Oct 3 Sat does NOT reduce working days)');

// In Saxony, Reformationstag (Oct 31) is ALSO a Saturday:
const oct2026_SN = CalendarTools.calculateWorkingDays('2026-10-01', '2026-10-31', 'SN');
assert.strictEqual(oct2026_SN.publicHolidayDays, 2); // Oct 3 (Sat) & Oct 31 (Sat)
assert.strictEqual(oct2026_SN.weekdayHolidayDays, 0);
assert.strictEqual(oct2026_SN.weekendHolidayDays, 2);
assert.strictEqual(oct2026_SN.workingDays, 22, 'Oct 2026 in SN must have 22 working days (both holidays fall on Saturdays)');
console.log('[PASS] October 2026: Saturday holidays (Oct 3 & Oct 31) verified not reducing working days.');

// C. March 2026 in Berlin (Frauentag on Sunday Mar 8):
// 2026-03-01 (Sun) to 2026-03-31 (Tue): 31 calendar days, 4 Saturdays, 5 Sundays = 9 weekend days, 22 weekdays
const mar2026_BE = CalendarTools.calculateWorkingDays('2026-03-01', '2026-03-31', 'BE');
assert.strictEqual(mar2026_BE.calendarDays, 31);
assert.strictEqual(mar2026_BE.saturdayDays, 4);
assert.strictEqual(mar2026_BE.sundayDays, 5);
assert.strictEqual(mar2026_BE.weekendDays, 9);
assert.strictEqual(mar2026_BE.publicHolidayDays, 1); // Mar 8 (Sunday)
assert.strictEqual(mar2026_BE.weekdayHolidayDays, 0); // None on weekdays!
assert.strictEqual(mar2026_BE.weekendHolidayDays, 1);
assert.strictEqual(mar2026_BE.workingDays, 22, 'March 2026 in Berlin has 22 working days (Mar 8 is Sunday)');
console.log('[PASS] March 2026: Sunday holiday (Frauentag Mar 8) in Berlin verified not reducing working days.');

// D. December 2026 (Dec 25 is Friday, Dec 26 is Saturday):
// 2026-12-01 (Tue) to 2026-12-31 (Thu): 31 calendar days, 4 Saturdays, 4 Sundays = 8 weekend days, 23 weekdays
const dec2026 = CalendarTools.calculateWorkingDays('2026-12-01', '2026-12-31', 'NW');
assert.strictEqual(dec2026.calendarDays, 31);
assert.strictEqual(dec2026.saturdayDays, 4);
assert.strictEqual(dec2026.sundayDays, 4);
assert.strictEqual(dec2026.weekendDays, 8);
assert.strictEqual(dec2026.publicHolidayDays, 2); // Dec 25 & Dec 26
assert.strictEqual(dec2026.weekdayHolidayDays, 1); // Only Dec 25 (Friday)
assert.strictEqual(dec2026.weekendHolidayDays, 1); // Dec 26 (Saturday)
assert.strictEqual(dec2026.workingDays, 22); // 23 weekdays - 1 weekday holiday = 22 working days
console.log('[PASS] December 2026: Dec 25 (Friday) deducted, Dec 26 (Saturday) not double-deducted (22 working days).');

// E. Single-day boundary tests:
const satHol = CalendarTools.calculateWorkingDays('2026-10-03', '2026-10-03', 'BE');
assert.strictEqual(satHol.calendarDays, 1);
assert.strictEqual(satHol.saturdayDays, 1);
assert.strictEqual(satHol.sundayDays, 0);
assert.strictEqual(satHol.weekendDays, 1);
assert.strictEqual(satHol.publicHolidayDays, 1);
assert.strictEqual(satHol.weekdayHolidayDays, 0);
assert.strictEqual(satHol.workingDays, 0);

const friHol = CalendarTools.calculateWorkingDays('2026-05-01', '2026-05-01', 'BE');
assert.strictEqual(friHol.calendarDays, 1);
assert.strictEqual(friHol.saturdayDays, 0);
assert.strictEqual(friHol.weekendDays, 0);
assert.strictEqual(friHol.publicHolidayDays, 1);
assert.strictEqual(friHol.weekdayHolidayDays, 1);
assert.strictEqual(friHol.workingDays, 0);

const friHolIncluded = CalendarTools.calculateWorkingDays('2026-05-01', '2026-05-01', 'BE', false);
assert.strictEqual(friHolIncluded.workingDays, 1, 'When excludeHolidays is false, workingDays includes the weekday holiday');
console.log('[PASS] Single-day boundary conditions and excludeHolidays flag verified.');

console.log('\n🎉 ALL GERMAN PUBLIC HOLIDAYS & WORKING DAYS AUDIT TESTS PASSED WITHOUT EXCEPTION!');


