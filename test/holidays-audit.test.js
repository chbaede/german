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
console.log('\n--- 10. Working Days Integration ---');
// In 2026:
// Aug 8, 2026 is Saturday.
// Aug 15, 2026 is Saturday.
// Let's test a period covering Fronleichnam (Thu 2026-06-04):
// 2026-06-01 (Mon) to 2026-06-05 (Fri): 5 calendar days, 0 weekend days.
// In BE: Fronleichnam is not a holiday -> 5 working days, 0 holiday days.
const workBE = CalendarTools.calculateWorkingDays('2026-06-01', '2026-06-05', 'BE');
assert.strictEqual(workBE.holidayDays, 0, 'Fronleichnam is not a holiday in Berlin');
assert.strictEqual(workBE.netWorkingDays, 5);

// In BY: Fronleichnam is a holiday -> 4 working days, 1 holiday day.
const workBY = CalendarTools.calculateWorkingDays('2026-06-01', '2026-06-05', 'BY');
assert.strictEqual(workBY.holidayDays, 1, 'Fronleichnam is a holiday in Bavaria');
assert.strictEqual(workBY.netWorkingDays, 4);

// In SN: Fronleichnam is regional (LK Bautzen only), so statewide SN has 0 holiday days!
const workSN = CalendarTools.calculateWorkingDays('2026-06-01', '2026-06-05', 'SN');
assert.strictEqual(workSN.holidayDays, 0, 'Fronleichnam is NOT a statewide holiday in Saxony');
assert.strictEqual(workSN.netWorkingDays, 5);

// In 2025:
// Aug 8, 2025 is Friday!
// Aug 15, 2025 is Friday!
// In 2025, 2025-08-08 (Fri):
// In standard BY: Aug 8 is NOT a statewide holiday -> 1 net working day, 0 holidays.
const workBYAug8_2025 = CalendarTools.calculateWorkingDays('2025-08-08', '2025-08-08', 'BY');
assert.strictEqual(workBYAug8_2025.holidayDays, 0, 'Augsburg Friedensfest is NOT a statewide holiday in BY');
assert.strictEqual(workBYAug8_2025.netWorkingDays, 1);

// In Augsburg (BY-AUG): Aug 8 IS a municipal holiday -> 0 net working days, 1 holiday!
const workAugsburgAug8_2025 = CalendarTools.calculateWorkingDays('2025-08-08', '2025-08-08', 'BY-AUG');
assert.strictEqual(workAugsburgAug8_2025.holidayDays, 1, 'Augsburg Friedensfest IS a municipal holiday in Augsburg');
assert.strictEqual(workAugsburgAug8_2025.netWorkingDays, 0);

// In 2025, 2025-08-15 (Fri):
// In standard BY: Mariä Himmelfahrt is NOT in statewide total -> 1 net working day, 0 holidays.
const workBYAug15_2025 = CalendarTools.calculateWorkingDays('2025-08-15', '2025-08-15', 'BY');
assert.strictEqual(workBYAug15_2025.holidayDays, 0, 'Mariä Himmelfahrt is NOT a statewide holiday in BY');
assert.strictEqual(workBYAug15_2025.netWorkingDays, 1);

// In Saarland (SL): Mariä Himmelfahrt IS statewide -> 0 net working days, 1 holiday!
const workSLAug15_2025 = CalendarTools.calculateWorkingDays('2025-08-15', '2025-08-15', 'SL');
assert.strictEqual(workSLAug15_2025.holidayDays, 1, 'Mariä Himmelfahrt IS a statewide holiday in Saarland');
assert.strictEqual(workSLAug15_2025.netWorkingDays, 0);

// In Augsburg (BY-AUG): Mariä Himmelfahrt applies -> 0 net working days, 1 holiday!
const workAugsburgAug15_2025 = CalendarTools.calculateWorkingDays('2025-08-15', '2025-08-15', 'BY-AUG');
assert.strictEqual(workAugsburgAug15_2025.holidayDays, 1, 'Mariä Himmelfahrt applies in Augsburg');
assert.strictEqual(workAugsburgAug15_2025.netWorkingDays, 0);

console.log('[PASS] Working days calculation correctly respects state, regional, and municipal scopes.');

console.log('\n🎉 ALL GERMAN PUBLIC HOLIDAYS AUDIT TESTS PASSED WITHOUT EXCEPTION!');
