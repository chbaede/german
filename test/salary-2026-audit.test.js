const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

global.window = {};
global.GLTUtils = {
  parseNumber(val, fallback) {
    if (val === null || val === undefined || val === '') return fallback;
    const cleaned = String(val).trim().replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? fallback : parsed;
  }
};
global.currentLang = 'en';

vm.runInThisContext(fs.readFileSync('./js/data/tax-config.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('./js/calculators/salary.js', 'utf8'));
vm.runInThisContext("global.GERMAN_SCHOOL_HOLIDAYS = { getSchoolHolidays: () => [] };");
vm.runInThisContext(fs.readFileSync('./js/calculators/family-tools.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('./js/calculators/rent.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('./js/data/glossary.js', 'utf8'));

console.log("=== COMPREHENSIVE 2026 SALARY AUDIT VERIFICATION ===");

// 1. BBG and Contribution Ceilings Verification
const salaries = [3000, 5000, 7000, 8450, 10000];
salaries.forEach(gross => {
  const r = SalaryCalculator.calculateNetSalary({ grossMonthly: gross, taxYear: 2026, taxClass: "1", stateCode: "BE" });
  
  // GKV & PV BBG check (€5,812.50)
  if (gross > 5812.50) {
    if (r.gkvAssessmentMonthly !== 5812.50) throw new Error(`GKV BBG not applied at €${gross}`);
    if (r.pvAssessmentMonthly !== 5812.50) throw new Error(`PV BBG not applied at €${gross}`);
    if (Math.abs(r.gkvMonthly - (5812.50 * 0.0875)) > 0.01) throw new Error(`GKV amount capped incorrectly`);
  } else {
    if (r.gkvAssessmentMonthly !== gross) throw new Error(`GKV assessment should be exact gross €${gross}`);
  }

  // RV & AV BBG check (€8,450)
  if (gross > 8450) {
    if (r.rvAssessmentMonthly !== 8450) throw new Error(`RV BBG not applied at €${gross}`);
    if (Math.abs(r.rvMonthly - (8450 * 0.093)) > 0.01) throw new Error(`RV amount capped incorrectly`);
    if (Math.abs(r.avMonthly - (8450 * 0.013)) > 0.01) throw new Error(`AV amount capped incorrectly`);
  } else {
    if (r.rvAssessmentMonthly !== gross) throw new Error(`RV assessment should be exact gross €${gross}`);
  }
  console.log(`[PASS] BBG Verified for €${gross}/mo: RV Assessed=€${r.rvAssessmentMonthly}, GKV Assessed=€${r.gkvAssessmentMonthly}`);
});

// 2. Tax Classes Hierarchy & Withholding (I, III, IV, V, VI)
salaries.forEach(gross => {
  const r1 = SalaryCalculator.calculateNetSalary({ grossMonthly: gross, taxYear: 2026, taxClass: "1", stateCode: "BE" });
  const r3 = SalaryCalculator.calculateNetSalary({ grossMonthly: gross, taxYear: 2026, taxClass: "3", stateCode: "BE" });
  const r4 = SalaryCalculator.calculateNetSalary({ grossMonthly: gross, taxYear: 2026, taxClass: "4", stateCode: "BE" });
  const r5 = SalaryCalculator.calculateNetSalary({ grossMonthly: gross, taxYear: 2026, taxClass: "5", stateCode: "BE" });
  const r6 = SalaryCalculator.calculateNetSalary({ grossMonthly: gross, taxYear: 2026, taxClass: "6", stateCode: "BE" });

  if (r3.netMonthly < r4.netMonthly) throw new Error(`Class 3 net must be >= Class 4 net`);
  if (r4.netMonthly < r5.netMonthly) throw new Error(`Class 4 net must be >= Class 5 net`);
  if (r5.netMonthly < r6.netMonthly) throw new Error(`Class 5 net must be >= Class 6 net`);
  if (Math.abs(r1.netMonthly - r4.netMonthly) > 0.01) throw new Error(`Class 1 and Class 4 should have identical base net`);

  console.log(`[PASS] Tax Class Hierarchy at €${gross}/mo: III(€${r3.netMonthly.toFixed(2)}) >= IV(€${r4.netMonthly.toFixed(2)}) >= V(€${r5.netMonthly.toFixed(2)}) >= VI(€${r6.netMonthly.toFixed(2)})`);
});

// 3. Children / Pflegeversicherung (PUEG) & Saxony Split
// A. Explicit function test: getEmployeeCareInsuranceRate({ stateCode, numberOfQualifyingChildren, isChildless })
const expectedPvRates = {
  NW: { 0: 0.0240, 1: 0.0180, 2: 0.0155, 3: 0.0130, 4: 0.0105, 5: 0.0080 },
  SN: { 0: 0.0290, 1: 0.0230, 2: 0.0205, 3: 0.0180, 4: 0.0155, 5: 0.0130 }
};

['NW', 'SN'].forEach(stateCode => {
  [0, 1, 2, 3, 4, 5].forEach(kids => {
    const expected = expectedPvRates[stateCode][kids];
    const isChildless = (kids === 0);

    const rateCalc = SalaryCalculator.getEmployeeCareInsuranceRate({
      stateCode,
      numberOfQualifyingChildren: kids,
      isChildless
    });

    const rateCfg = GERMAN_TAX_CONFIG.getEmployeeCareInsuranceRate({
      stateCode,
      numberOfQualifyingChildren: kids,
      isChildless
    });

    if (Math.abs(rateCalc - expected) > 1e-6) {
      throw new Error(`SalaryCalculator.getEmployeeCareInsuranceRate mismatch: ${stateCode} kids=${kids}, got ${rateCalc}, expected ${expected}`);
    }
    if (Math.abs(rateCfg - expected) > 1e-6) {
      throw new Error(`GERMAN_TAX_CONFIG.getEmployeeCareInsuranceRate mismatch: ${stateCode} kids=${kids}, got ${rateCfg}, expected ${expected}`);
    }

    console.log(`[PASS] getEmployeeCareInsuranceRate (${stateCode}, ${kids} children): ${(rateCalc * 100).toFixed(2)}%`);
  });
});

// B. Integration with calculateNetSalary
[0, 1, 2, 3, 4, 5].forEach(k => {
  const nw = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: 2026, taxClass: "1", stateCode: "NW", numChildren: k });
  const sn = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: 2026, taxClass: "1", stateCode: "SN", numChildren: k });

  const expNW = expectedPvRates.NW[k];
  const expSN = expectedPvRates.SN[k];

  if (Math.abs(nw.pvEmployeeRate - expNW) > 1e-6) throw new Error(`Net salary PV rate mismatch for NW kids=${k}`);
  if (Math.abs(sn.pvEmployeeRate - expSN) > 1e-6) throw new Error(`Net salary PV rate mismatch for SN kids=${k}`);

  console.log(`[PASS] calculateNetSalary PV Rate for k=${k}: NW=${(nw.pvEmployeeRate*100).toFixed(2)}%, SN=${(sn.pvEmployeeRate*100).toFixed(2)}%`);
});

// 4. Solidaritätszuschlag 2026 Statutory Audit (§§ 3, 4 SolZG)
console.log("\n--- SolZ 2026 Statutory Verification ---");

// Test Cases: [taxLiability, isSplitting, expectedSolz, description]
const solzTestCases = [
  // A. Below threshold (< €20,350 single / < €40,700 splitting)
  { tax: 19000, splitting: false, exp: 0, desc: "€19,000 single (below €20,350 Freigrenze -> 0)" },
  { tax: 19000, splitting: true,  exp: 0, desc: "€19,000 splitting (below €40,700 Freigrenze -> 0)" },

  // B. Exact Freigrenze threshold (€20,350 single / €40,700 splitting)
  { tax: 20350, splitting: false, exp: 0, desc: "€20,350 single (exact Freigrenze -> 0)" },
  { tax: 20350, splitting: true,  exp: 0, desc: "€20,350 splitting (below €40,700 Freigrenze -> 0)" },
  { tax: 40700, splitting: true,  exp: 0, desc: "€40,700 splitting (exact Freigrenze -> 0)" },

  // C. 1 Euro above threshold -> Start of Milderungszone (§ 4 SolZG: (T - F) * 11.9%)
  // Single: (20,351 - 20,350) * 0.119 = 0.119 € -> 0.12 €
  { tax: 20351, splitting: false, exp: 0.12, desc: "€20,351 single (1€ excess in Milderungszone -> 0.12 €)" },
  { tax: 20351, splitting: true,  exp: 0,    desc: "€20,351 splitting (below €40,700 -> 0)" },
  // Splitting: (40,701 - 40,700) * 0.119 = 0.119 € -> 0.12 €
  { tax: 40701, splitting: true,  exp: 0.12, desc: "€40,701 splitting (1€ excess in Milderungszone -> 0.12 €)" },

  // D. Moderate income in transition zone: €25,000
  // Single: (25,000 - 20,350) * 0.119 = 4,650 * 0.119 = 553.35 €
  // (Standard 5.5% would be 1,375.00 €, so 11.9% milderung saves 821.65 €)
  { tax: 25000, splitting: false, exp: 553.35, desc: "€25,000 single (in transition zone -> 553.35 €)" },
  { tax: 25000, splitting: true,  exp: 0,      desc: "€25,000 splitting (below €40,700 -> 0)" },

  // E. Single at €40,700 and €40,701 (Single has crossed into full 5.5% cap zone > €37,838.28)
  // Single €40,700: 40,700 * 0.055 = 2,238.50 € (milderung would be 2,421.65 €, cap wins)
  { tax: 40700, splitting: false, exp: 2238.50, desc: "€40,700 single (5.5% cap active -> 2,238.50 €)" },
  // Single €40,701: 40,701 * 0.055 = 2,238.56 € (milderung would be 2,421.77 €, cap wins)
  { tax: 40701, splitting: false, exp: 2238.56, desc: "€40,701 single (5.5% cap active -> 2,238.56 €)" },

  // F. High-Income Cases
  // Single €50,000: 50,000 * 0.055 = 2,750.00 € (capped)
  { tax: 50000, splitting: false, exp: 2750.00, desc: "€50,000 single (5.5% cap active -> 2,750.00 €)" },
  // Splitting €50,000: (50,000 - 40,700) * 0.119 = 9,300 * 0.119 = 1,106.70 € (transition zone active)
  { tax: 50000, splitting: true,  exp: 1106.70, desc: "€50,000 splitting (in transition zone -> 1,106.70 €)" },
  // Single €100,000: 100,000 * 0.055 = 5,500.00 € (capped)
  { tax: 100000, splitting: false, exp: 5500.00, desc: "€100,000 single (5.5% cap active -> 5,500.00 €)" },
  // Splitting €100,000: 100,000 * 0.055 = 5,500.00 € (milderung would be 7,056.70 €, 5.5% cap active)
  { tax: 100000, splitting: true,  exp: 5500.00, desc: "€100,000 splitting (5.5% cap active -> 5,500.00 €)" }
];

solzTestCases.forEach(({ tax, splitting, exp, desc }) => {
  // Test both SalaryCalculator method and GERMAN_TAX_CONFIG method
  const r1 = SalaryCalculator.calculateSolidaritySurcharge2026(tax, splitting);
  const r2 = GERMAN_TAX_CONFIG.calculateSolidaritySurcharge2026(tax, splitting);
  const r3 = SalaryCalculator.calculateSolidaritySurcharge2026({ incomeTax: tax, isSplitting: splitting });
  const rGlobal = global.calculateSolidaritySurcharge2026 ? global.calculateSolidaritySurcharge2026(tax, splitting) : r1;

  if (Math.abs(r1 - exp) > 0.01) {
    throw new Error(`SalaryCalculator SolZ failure for ${desc}: got ${r1}, expected ${exp}`);
  }
  if (Math.abs(r2 - exp) > 0.01) {
    throw new Error(`GERMAN_TAX_CONFIG SolZ failure for ${desc}: got ${r2}, expected ${exp}`);
  }
  if (Math.abs(r3 - exp) > 0.01) {
    throw new Error(`Object-signature SolZ failure for ${desc}: got ${r3}, expected ${exp}`);
  }
  if (Math.abs(rGlobal - exp) > 0.01) {
    throw new Error(`Global SolZ failure for ${desc}: got ${rGlobal}, expected ${exp}`);
  }

  console.log(`[PASS] SolZ: ${desc} => €${r1.toFixed(2)}`);
});

// G. Verify SolZG Source Metadata in GERMAN_TAX_CONFIG
const solzSource = GERMAN_TAX_CONFIG.officialSources.find(s => s.reference.includes("SolZG"));
if (!solzSource) throw new Error("Missing SolZG source metadata in GERMAN_TAX_CONFIG.officialSources");
if (!solzSource.topicEn.includes("20,350") || !solzSource.topicEn.includes("40,700")) {
  throw new Error("SolZG source metadata does not document 2026 thresholds 20,350 / 40,700");
}
console.log(`[PASS] SolZ Statutory Source Metadata Verified: ${solzSource.reference}`);

// 5. Statutory Health Insurance (GKV) & PKV 2026 Audit (§ 241, § 242, § 242a SGB V)
console.log("\n--- GKV & PKV 2026 Statutory Verification ---");

// A. Standard 2026 Rate (Using national average Zusatzbeitrag of 2.9%)
const defaultHealth = SalaryCalculator.getEmployeeHealthInsuranceRate();
if (defaultHealth.baseRate !== 0.146) throw new Error("General health insurance rate must be 14.6%");
if (defaultHealth.employeeBaseRate !== 0.073) throw new Error("Employee base rate must be 7.3%");
if (defaultHealth.avgZusatzbeitrag !== 0.029) throw new Error("2026 Average Zusatzbeitrag must be 2.9%");
if (Math.abs(defaultHealth.employeeZusatzRate - 0.0145) > 1e-6) throw new Error("Employee Zusatz share must be 1.45%");
if (Math.abs(defaultHealth.totalEmployeeRate - 0.0875) > 1e-6) throw new Error("Total standard employee rate must be 8.75%");
if (defaultHealth.note !== "Using the 2026 average Zusatzbeitrag of 2.9%") {
  throw new Error("Must include exact wording: 'Using the 2026 average Zusatzbeitrag of 2.9%'");
}
console.log(`[PASS] Standard GKV 2026 Rate: Base 7.3% + Avg Zusatz 1.45% = ${(defaultHealth.totalEmployeeRate * 100).toFixed(2)}% ("${defaultHealth.note}")`);

// B. Optional kasseZusatzbeitrag Field Verification
// 1. Custom rate 2.5% (e.g. TK or similar): employee rate = 7.3% + (2.5% / 2) = 8.55%
const custom25 = SalaryCalculator.getEmployeeHealthInsuranceRate({ kasseZusatzbeitrag: 2.5 });
if (Math.abs(custom25.totalEmployeeRate - 0.0855) > 1e-6) throw new Error("Custom 2.5% Zusatz must yield 8.55% employee rate");

// 2. Custom rate 3.4%: employee rate = 7.3% + (3.4% / 2) = 9.00%
const custom34 = SalaryCalculator.getEmployeeHealthInsuranceRate({ kasseZusatzbeitrag: 3.4 });
if (Math.abs(custom34.totalEmployeeRate - 0.0900) > 1e-6) throw new Error("Custom 3.4% Zusatz must yield 9.00% employee rate");

// 3. Decimal format 0.027: employee rate = 7.3% + 1.35% = 8.65%
const customDecimal = SalaryCalculator.getEmployeeHealthInsuranceRate({ kasseZusatzbeitrag: 0.027 });
if (Math.abs(customDecimal.totalEmployeeRate - 0.0865) > 1e-6) throw new Error("Custom 0.027 Zusatz must yield 8.65% employee rate");

console.log(`[PASS] Custom kasseZusatzbeitrag: 2.5% => ${(custom25.totalEmployeeRate*100).toFixed(2)}%, 3.4% => ${(custom34.totalEmployeeRate*100).toFixed(2)}%, 0.027 => ${(customDecimal.totalEmployeeRate*100).toFixed(2)}%`);

// C. Integration in calculateNetSalary with custom and default Zusatzbeitrag
const netDefaultGkv = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxYear: 2026, healthType: "gkv" });
if (Math.abs(netDefaultGkv.gkvMonthly - (4000 * 0.0875)) > 0.01) throw new Error("Default GKV deduction mismatch");

const netCustomGkv = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxYear: 2026, healthType: "gkv", kasseZusatzbeitrag: 2.5 });
if (Math.abs(netCustomGkv.gkvMonthly - (4000 * 0.0855)) > 0.01) throw new Error("Custom GKV deduction mismatch");
console.log(`[PASS] calculateNetSalary GKV Deductions: Default(8.75%)=€${netDefaultGkv.gkvMonthly.toFixed(2)}, Custom(8.55%)=€${netCustomGkv.gkvMonthly.toFixed(2)}`);

// D. GKV Mandatory vs Voluntary Membership Status (§ 6 SGB V vs JAEG €77,400/yr / €6,450/mo)
const mandatoryMember = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: 2026 }); // €60,000/yr <= €77,400
if (mandatoryMember.gkvMembershipStatus !== "mandatory") throw new Error("Gross €5,000/mo must be mandatory GKV member");

const voluntaryMember = SalaryCalculator.calculateNetSalary({ grossMonthly: 7000, taxYear: 2026 }); // €84,000/yr > €77,400
if (voluntaryMember.gkvMembershipStatus !== "voluntary") throw new Error("Gross €7,000/mo must be voluntary GKV member");
if (voluntaryMember.gkvAssessmentMonthly !== 5812.50) throw new Error("Voluntary GKV assessment must be capped at €5,812.50 BBG");
console.log(`[PASS] Membership Status: €5,000/mo => ${mandatoryMember.gkvMembershipStatus}, €7,000/mo => ${voluntaryMember.gkvMembershipStatus} (capped at €${voluntaryMember.gkvAssessmentMonthly})`);

// E. PKV & PPV Estimator Mode Verification
// 1. Direct function calculatePkvCost tests
// Case 1a: Default auto 50% subsidy with PKV €550 and PPV €80 (Total €630, 50% = €315, employee €315)
const pkvRes1 = SalaryCalculator.calculatePkvCost({
  pkvMonthlyPremium: 550,
  ppvMonthlyPremium: 80,
  hasEmployerSubsidy: true
});
if (pkvRes1.totalPremium !== 630) throw new Error(`Total premium mismatch: expected 630, got ${pkvRes1.totalPremium}`);
if (pkvRes1.employerSubsidy !== 315) throw new Error(`Employer subsidy mismatch: expected 315, got ${pkvRes1.employerSubsidy}`);
if (pkvRes1.employeeCost !== 315) throw new Error(`Employee cost mismatch: expected 315, got ${pkvRes1.employeeCost}`);
if (pkvRes1.notice !== "Private insurance premiums are contract-specific and cannot be reliably calculated from salary alone.") {
  throw new Error("calculatePkvCost must contain exact required statutory notice wording");
}

// Case 1b: No employer subsidy (self-employed or not eligible): employee pays 100%
const pkvResNoSub = SalaryCalculator.calculatePkvCost({
  pkvMonthlyPremium: 600,
  ppvMonthlyPremium: 100,
  hasEmployerSubsidy: false
});
if (pkvResNoSub.employerSubsidy !== 0) throw new Error("Employer subsidy must be 0 when hasEmployerSubsidy is false");
if (pkvResNoSub.employeeCost !== 700) throw new Error("Employee cost must be 100% of premium when no subsidy");

// Case 1c: Custom employer subsidy amount
const pkvResCustomSub = SalaryCalculator.calculatePkvCost({
  pkvMonthlyPremium: 700,
  ppvMonthlyPremium: 100,
  hasEmployerSubsidy: true,
  employerSubsidy: 350
});
if (pkvResCustomSub.employerSubsidy !== 350) throw new Error("Custom subsidy amount should be respected");
if (pkvResCustomSub.employeeCost !== 450) throw new Error("Employee cost should be 800 - 350 = 450");

// Case 1d: Global function availability
if (typeof calculatePkvCost !== 'function') throw new Error("calculatePkvCost must be globally exported");
const globalPkv = calculatePkvCost({ pkvMonthlyPremium: 500, ppvMonthlyPremium: 50 });
if (globalPkv.totalPremium !== 550) throw new Error("Global calculatePkvCost failed");

// 2. Integration in calculateNetSalary
// Must not use statutory GKV/PV percentages from salary
const pkvSalaryRun = SalaryCalculator.calculateNetSalary({
  grossMonthly: 8000,
  taxYear: 2026,
  healthType: "pkv",
  pkvMonthlyPremium: 550,
  ppvMonthlyPremium: 80,
  hasEmployerSubsidy: true
});

if (pkvSalaryRun.gkvAssessmentMonthly !== 0) throw new Error("PKV must have 0 GKV assessment from salary");
if (pkvSalaryRun.pvAssessmentMonthly !== 0) throw new Error("PPV must have 0 PV assessment from salary");
if (pkvSalaryRun.gkvEmployeeRate !== 0) throw new Error("PKV must have 0 statutory GKV employee rate");
if (pkvSalaryRun.pvEmployeeRate !== 0) throw new Error("PPV must have 0 statutory PV employee rate");
if (Math.abs(pkvSalaryRun.gkvMonthly + pkvSalaryRun.pvMonthly - 315) > 0.01) {
  throw new Error(`Total PKV+PPV employee cost in salary calculator must equal €315, got €${pkvSalaryRun.gkvMonthly + pkvSalaryRun.pvMonthly}`);
}
if (!pkvSalaryRun.parameters.pkvNotice.includes("Private insurance premiums are contract-specific and cannot be reliably calculated from salary alone.")) {
  throw new Error("Salary parameters must include exact required PKV notice");
}

// Case 2b: Backward compatibility with legacy pkvAmount
const pkvLegacy = SalaryCalculator.calculateNetSalary({
  grossMonthly: 6000,
  taxYear: 2026,
  healthType: "pkv",
  pkvAmount: 450
});
if (pkvLegacy.gkvAssessmentMonthly !== 0) throw new Error("Legacy PKV must not assess from salary");
if (pkvLegacy.gkvMonthly !== 450) throw new Error("Legacy PKV amount should be honored");

console.log(`[PASS] PKV & PPV Estimator Mode Verified: Premium=€630, Subsidy=€315, Employee Out-of-Pocket=€315, GKV/PV Assessment=€0 (No GKV rates used)`);

// F. BMG Official Source Reference Verification
const bmgSource = GERMAN_TAX_CONFIG.officialSources.find(s => s.institution.includes("Gesundheit"));
if (!bmgSource) throw new Error("Missing BMG source metadata in GERMAN_TAX_CONFIG");
if (!bmgSource.reference.includes("Zusatzbeitrag") || !bmgSource.topicEn.includes("2.9%")) {
  throw new Error("BMG source metadata must document 2026 Zusatzbeitrag Bekanntmachung of 2.9%");
}
console.log(`[PASS] BMG Statutory Source Metadata Verified: ${bmgSource.reference}`);

// 6. Church Tax Rates: BY (8%) vs NW (9%) vs None (0%)
const by = SalaryCalculator.calculateNetSalary({ grossMonthly: 6000, taxYear: 2026, taxClass: "1", stateCode: "BY", hasChurchTax: true });
const nw = SalaryCalculator.calculateNetSalary({ grossMonthly: 6000, taxYear: 2026, taxClass: "1", stateCode: "NW", hasChurchTax: true });
const none = SalaryCalculator.calculateNetSalary({ grossMonthly: 6000, taxYear: 2026, taxClass: "1", stateCode: "BE", hasChurchTax: false });

if (none.churchTaxMonthly !== 0) throw new Error("Church tax should be 0 when false");
if (Math.abs((by.churchTaxMonthly / by.incomeTaxMonthly) - 0.08) > 1e-4) throw new Error("BY rate mismatch");
if (Math.abs((nw.churchTaxMonthly / nw.incomeTaxMonthly) - 0.09) > 1e-4) throw new Error("NW rate mismatch");
console.log(`[PASS] Church Tax: None=€0, BY(8%)=€${by.churchTaxMonthly.toFixed(2)}, NW(9%)=€${nw.churchTaxMonthly.toFixed(2)}`);

// 5. Zero-Tax Region & Top Tax Bracket
const zero = SalaryCalculator.calculateNetSalary({ grossMonthly: 1100, taxYear: 2026, taxClass: "1", stateCode: "BE" });
if (zero.incomeTaxAnnual !== 0) throw new Error("Zero tax region failed");
console.log(`[PASS] Zero-tax region verified at €1,100/mo: zvE=€${zero.zvE.toFixed(2)}, Tax=€0`);

const rich = SalaryCalculator.calculateNetSalary({ grossMonthly: 30000, taxYear: 2026, taxClass: "1", stateCode: "BE" });
if (rich.zvE <= 277826) throw new Error("Top tax bracket income should exceed €277,826");
console.log(`[PASS] Top tax bracket (45% Reichensteuer) reached at €30,000/mo: zvE=€${rich.zvE.toFixed(2)}, Annual Tax=€${rich.incomeTaxAnnual.toFixed(2)}`);

// ========================================================================
// 7. KINDERGELD 2026 ENACTED & ANNOUNCED TIMELINE VERIFICATION
// ========================================================================
console.log("\n--- Kindergeld Timeline & Statutory Source Verification ---");

// A. Enacted 2026 rate (€259)
const kg2026 = FamilyTools.calculateKindergeld(2, 2026);
if (kg2026.ratePerChild !== 259) throw new Error(`2026 Kindergeld rate must be €259, got ${kg2026.ratePerChild}`);
if (kg2026.monthlyTotal !== 518) throw new Error(`2026 monthly total for 2 kids must be €518, got ${kg2026.monthlyTotal}`);
if (kg2026.annualTotal !== 6216) throw new Error(`2026 annual total for 2 kids must be €6,216, got ${kg2026.annualTotal}`);

// B. Announced / proposed 2027 rate (€267) and 2028 rate (€272)
const kg2027 = FamilyTools.calculateKindergeld(1, 2027);
if (kg2027.ratePerChild !== 267) throw new Error(`2027 announced rate must be €267, got ${kg2027.ratePerChild}`);

const kg2028 = FamilyTools.calculateKindergeld(1, 2028);
if (kg2028.ratePerChild !== 272) throw new Error(`2028 announced rate must be €272, got ${kg2028.ratePerChild}`);

// C. Separation of enacted/current rates vs announced future changes
if (!Array.isArray(kg2026.enactedRates) || kg2026.enactedRates.length === 0) {
  throw new Error("Must separate and provide enactedRates list");
}
if (!Array.isArray(kg2026.announcedRates) || kg2026.announcedRates.length === 0) {
  throw new Error("Must separate and provide announcedRates list");
}
kg2026.enactedRates.forEach(r => {
  if (r.statusCategory !== "enacted") throw new Error("enactedRates must only contain enacted items");
});
kg2026.announcedRates.forEach(r => {
  if (r.statusCategory !== "announced") throw new Error("announcedRates must only contain announced items");
  if (r.isEnacted !== false) throw new Error("announced items must not be marked as enacted");
});

// D. Wording check for announced rates
const item2027 = FamilyTools.RATES_TIMELINE.find(i => i.periodEn.includes("2027"));
const item2028 = FamilyTools.RATES_TIMELINE.find(i => i.periodEn.includes("2028"));
if (!item2027.statusEn.includes("government bill / announced proposal / not yet enacted")) {
  throw new Error(`2027 wording must include 'government bill / announced proposal / not yet enacted', got: ${item2027.statusEn}`);
}
if (!item2028.statusEn.includes("government bill / announced proposal / not yet enacted")) {
  throw new Error(`2028 wording must include 'government bill / announced proposal / not yet enacted', got: ${item2028.statusEn}`);
}
assert.strictEqual(kg2027.status, "government bill / announced proposal / not yet enacted");
assert.strictEqual(kg2028.status, "government bill / announced proposal / not yet enacted");

// E. Source check
if (kg2026.source !== "BMF / Familienkasse" || FamilyTools.source.institution !== "BMF / Familienkasse") {
  throw new Error("Source must be 'BMF / Familienkasse'");
}
console.log(`[PASS] Kindergeld: 2026 Enacted=€${kg2026.ratePerChild}, 2027 Announced=€${kg2027.ratePerChild}, 2028 Announced=€${kg2028.ratePerChild}, Source: ${kg2026.source}`);

// Enacted 2025 rate check (€255)
const kg2025 = FamilyTools.calculateKindergeld(1, 2025);
assert.strictEqual(kg2025.ratePerChild, 255, "2025 Kindergeld rate must be €255");
assert.strictEqual(kg2025.monthlyTotal, 255);
assert.strictEqual(kg2025.annualTotal, 3060);
assert.strictEqual(kg2025.isEnacted, true, "2025 rate must be marked enacted");

// Tiered Kindergeld 2021 & 2022 verification (1 to 5 children)
// Child 1: €219, Child 2: €219, Child 3: €225, Child 4+: €250 each
const kg2021_1 = FamilyTools.calculateKindergeld(1, 2021);
assert.strictEqual(kg2021_1.monthlyTotal, 219, "2021 1 child must be €219");
assert.strictEqual(kg2021_1.annualTotal, 2628);
assert.strictEqual(kg2021_1.isTiered, true);

const kg2021_2 = FamilyTools.calculateKindergeld(2, 2021);
assert.strictEqual(kg2021_2.monthlyTotal, 438, "2021 2 children must be €438 (219+219)");
assert.strictEqual(kg2021_2.annualTotal, 5256);

const kg2021_3 = FamilyTools.calculateKindergeld(3, 2021);
assert.strictEqual(kg2021_3.monthlyTotal, 663, "2021 3 children must be €663 (219+219+225)");
assert.strictEqual(kg2021_3.annualTotal, 7956);

const kg2021_4 = FamilyTools.calculateKindergeld(4, 2021);
assert.strictEqual(kg2021_4.monthlyTotal, 913, "2021 4 children must be €913 (219+219+225+250)");
assert.strictEqual(kg2021_4.annualTotal, 10956);

const kg2021_5 = FamilyTools.calculateKindergeld(5, 2021);
assert.strictEqual(kg2021_5.monthlyTotal, 1163, "2021 5 children must be €1,163 (219+219+225+250+250)");
assert.strictEqual(kg2021_5.annualTotal, 13956);

// Verify 2022 has exact same statutory tiers
const kg2022_3 = FamilyTools.calculateKindergeld(3, 2022);
assert.strictEqual(kg2022_3.monthlyTotal, 663, "2022 3 children must be €663");
const kg2022_4 = FamilyTools.calculateKindergeld(4, 2022);
assert.strictEqual(kg2022_4.monthlyTotal, 913, "2022 4 children must be €913");
const kg2022_5 = FamilyTools.calculateKindergeld(5, 2022);
assert.strictEqual(kg2022_5.monthlyTotal, 1163, "2022 5 children must be €1,163");

console.log("[PASS] Kindergeld: 2021 & 2022 tiered multi-child calculations verified (1 child: €219, 2: €438, 3: €663, 4: €913, 5: €1,163).");

// Critical: Unsupported years must NOT return fake / guessed numbers (e.g. 2020, 2029, 2030, 2018)
const kg2020 = FamilyTools.calculateKindergeld(1, 2020);
assert.strictEqual(kg2020.unavailable, true, "2020 Kindergeld must return unavailable");
assert.strictEqual(kg2020.error, "KINDERGELD_DATA_UNAVAILABLE");

const kg2029 = FamilyTools.calculateKindergeld(1, 2029);
assert.strictEqual(kg2029.unavailable, true, "2029 Kindergeld must return unavailable");
assert.strictEqual(kg2029.error, "KINDERGELD_DATA_UNAVAILABLE");

const kg2030 = FamilyTools.calculateKindergeld(1, 2030);
assert.strictEqual(kg2030.unavailable, true, "2030 Kindergeld must return unavailable");

const kg2018 = FamilyTools.calculateKindergeld(1, 2018);
assert.strictEqual(kg2018.unavailable, true, "2018 Kindergeld must return unavailable");
console.log("[PASS] Kindergeld: Verified enacted 2025 (€255) and strict rejection of unsupported years (2018, 2020, 2029, 2030).");

// F. Glossary Entry Verification
const kgGlossary = GERMAN_GLOSSARY.find(t => t.term === "Kindergeld");
if (!kgGlossary) throw new Error("Kindergeld glossary entry missing");
if (!kgGlossary.en.includes("2026: €259 per child per month")) {
  throw new Error(`Glossary EN must say '2026: €259 per child per month', got: ${kgGlossary.en}`);
}
if (kgGlossary.en.includes("€250 per child as of 2025/2026")) {
  throw new Error("Glossary must not contain stale €250 wording");
}
console.log(`[PASS] Kindergeld Glossary Entry Verified: "${kgGlossary.en.slice(0, 75)}..."`);

// ==========================================
// 8. FACTUAL AUDIT OF ENTIRE GERMAN_GLOSSARY
// ==========================================
console.log("\n=== 8. GERMAN GLOSSARY FACTUAL AUDIT (2026) ===");

const requiredGlossaryTerms = [
  "Anmeldung",
  "Abmeldung",
  "Steuer-ID",
  "Steuerklasse",
  "ELSTER",
  "Finanzamt",
  "TK",
  "AOK",
  "Rundfunkbeitrag",
  "Kaltmiete",
  "Warmmiete",
  "Nebenkosten",
  "Kaution",
  "Schufa",
  "Haftpflichtversicherung",
  "Kfz",
  "HU",
  "AU",
  "TÜV",
  "Arbeitsvertrag",
  "Probezeit",
  "Kündigung / Kündigungsfrist",
  "Kurzarbeit",
  "Kindergeld",
  "Elterngeld",
  "Kita"
];

const validClassifications = [
  "legal_requirement",
  "statutory_definition",
  "common_practice",
  "recommendation",
  "informal_term"
];

// Verify all required terms exist
requiredGlossaryTerms.forEach(term => {
  const item = GERMAN_GLOSSARY.find(g => 
    g.term === term || 
    g.term.startsWith(term + " ") || 
    g.term.startsWith(term + " /") || 
    g.term.startsWith(term + " (")
  );
  if (!item) {
    throw new Error(`Mandatory glossary term missing: "${term}"`);
  }
});

// Verify metadata schema, sources, dates, and classifications for all entries
GERMAN_GLOSSARY.forEach(item => {
  if (!item.term || !item.category || !item.en || !item.ko) {
    throw new Error(`Glossary entry missing core fields: ${JSON.stringify(item)}`);
  }
  if (!validClassifications.includes(item.classification)) {
    throw new Error(`Invalid classification "${item.classification}" on term "${item.term}"`);
  }
  if (!item.classificationEn || !item.classificationKo) {
    throw new Error(`Missing classification localized labels on term "${item.term}"`);
  }
  if (!item.legalBasis || typeof item.legalBasis !== 'string') {
    throw new Error(`Missing legalBasis on term "${item.term}"`);
  }
  if (!item.source || typeof item.source !== 'string') {
    throw new Error(`Missing source on term "${item.term}"`);
  }
  if (!item.sourceUrl || !item.sourceUrl.startsWith("https://")) {
    throw new Error(`Invalid or missing sourceUrl on term "${item.term}": got ${item.sourceUrl}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.lastVerified)) {
    throw new Error(`Invalid lastVerified date format on term "${item.term}": got ${item.lastVerified}`);
  }
});

// Specific factual verification tests
const anmeldung = GERMAN_GLOSSARY.find(g => g.term.startsWith("Anmeldung"));
if (anmeldung.classification !== "legal_requirement" || !anmeldung.legalBasis.includes("§ 17") || !anmeldung.legalBasis.includes("BMG")) {
  throw new Error("Anmeldung must be classified as legal_requirement under § 17 BMG");
}

const abmeldung = GERMAN_GLOSSARY.find(g => g.term.startsWith("Abmeldung"));
if (!abmeldung.en.includes("giving up a secondary residence") && !abmeldung.en.includes("permanently leaving Germany")) {
  throw new Error("Abmeldung must state it is only required when leaving Germany or giving up secondary home");
}

const rundfunk = GERMAN_GLOSSARY.find(g => g.term.startsWith("Rundfunkbeitrag"));
if (!rundfunk) {
  throw new Error("Rundfunkbeitrag entry missing in glossary");
}
if ((rundfunk.classification !== "legal_requirement" && rundfunk.classification !== "informal_term" && rundfunk.classification !== "statutory_definition") || !rundfunk.legalBasis.includes("RBStV")) {
  throw new Error("Rundfunkbeitrag must cite RBStV legal basis");
}
if (!rundfunk.en.includes("dwelling") || !rundfunk.en.includes("Wohnung")) {
  throw new Error("Rundfunkbeitrag must explain the statutory dwelling (Wohnung) unit");
}

const tuev = GERMAN_GLOSSARY.find(g => g.term.startsWith("TÜV"));
if (tuev.classification !== "informal_term") {
  throw new Error("TÜV must be classified as informal_term");
}

const kaution = GERMAN_GLOSSARY.find(g => g.term.startsWith("Kaution"));
if (!kaution.en.includes("installments") || !kaution.legalBasis.includes("§ 551") || !kaution.legalBasis.includes("BGB")) {
  throw new Error("Kaution must cite § 551 BGB and statutory right to installments");
}

const haftpflicht = GERMAN_GLOSSARY.find(g => g.term.startsWith("Haftpflichtversicherung"));
if (haftpflicht.classification !== "recommendation") {
  throw new Error("Privathaftpflicht must be classified as recommendation (not mandatory)");
}

const probezeit = GERMAN_GLOSSARY.find(g => g.term.startsWith("Probezeit"));
if ((!probezeit.en.includes("two weeks") && !probezeit.en.includes("two-week")) || !probezeit.legalBasis.includes("§ 622")) {
  throw new Error("Probezeit must cite 2-week notice under § 622 Abs. 3 BGB");
}

const kuendigung = GERMAN_GLOSSARY.find(g => g.term.startsWith("Kündigung"));
if (!kuendigung.en.includes("wet") || !kuendigung.legalBasis.includes("§ 623")) {
  throw new Error("Kündigung must cite § 623 BGB strict wet-ink signature requirement");
}

console.log(`[PASS] All ${GERMAN_GLOSSARY.length} Glossary entries audited & validated for 2026 legal correctness and metadata.`);

// === 9. ANNUAL COMPENSATION CALCULATOR AUDIT ===
console.log("\n=== 9. ANNUAL COMPENSATION CALCULATOR AUDIT ===");

// A. Base salary only: €5,000/mo
const annBaseOnly = SalaryCalculator.calculateAnnualCompensation({ monthlyGross: 5000 });
assert.strictEqual(annBaseOnly.baseAnnual, 60000);
assert.strictEqual(annBaseOnly.additionalMonthlyAmount, 0);
assert.strictEqual(annBaseOnly.performanceBonusAmount, 0);
assert.strictEqual(annBaseOnly.fixedAnnualAmount, 0);
assert.strictEqual(annBaseOnly.totalComp, 60000);
assert.strictEqual(annBaseOnly.monthlyEquivalent, 5000);
assert.strictEqual(annBaseOnly.note, "Additional payments are employer/contract dependent and are not statutory entitlements.");
console.log("[PASS] Base salary only: €5,000/mo => Base Annual: €60,000, Total Comp: €60,000");

// B. Contractual additional monthly-equivalent payments (e.g. 1.0 month & 0.5 month)
const annWithMonthlyCount = SalaryCalculator.calculateAnnualCompensation({
  monthlyGross: 5000,
  additionalMonthlyCount: 1.0
});
assert.strictEqual(annWithMonthlyCount.baseAnnual, 60000);
assert.strictEqual(annWithMonthlyCount.additionalMonthlyAmount, 5000);
assert.strictEqual(annWithMonthlyCount.totalComp, 65000);
assert.strictEqual(annWithMonthlyCount.monthlyEquivalent, 65000 / 12);
console.log("[PASS] Contractual additional monthly-equivalent payments: 1.0 month => +€5,000, Total Comp: €65,000");

// C. Performance bonus percentage (10% of base annual):
const annWithBonusPct = SalaryCalculator.calculateAnnualCompensation({
  monthlyGross: 5000,
  performanceBonusPercent: 10
});
assert.strictEqual(annWithBonusPct.performanceBonusAmount, 6000); // 10% of 60,000
assert.strictEqual(annWithBonusPct.totalComp, 66000);
console.log("[PASS] Performance bonus: 10% of €60,000 => +€6,000, Total Comp: €66,000");

// D. Fixed annual bonus lump sum (€3,500):
const annWithLumpSum = SalaryCalculator.calculateAnnualCompensation({
  monthlyGross: 5000,
  fixedAnnualBonus: 3500
});
assert.strictEqual(annWithLumpSum.fixedAnnualAmount, 3500);
assert.strictEqual(annWithLumpSum.totalComp, 63500);
console.log("[PASS] Fixed annual bonus lump sum: +€3,500 => Total Comp: €63,500");

// E. Full composite compensation package:
// €5,000 base + 1.0 additional month (€5,000) + 10% bonus (€6,000) + €2,000 lump sum = €73,000
const annComposite = SalaryCalculator.calculateAnnualCompensation({
  monthlyGross: 5000,
  additionalMonthlyCount: 1.0,
  performanceBonusPercent: 10,
  fixedAnnualBonus: 2000
});
assert.strictEqual(annComposite.baseAnnual, 60000);
assert.strictEqual(annComposite.additionalMonthlyAmount, 5000);
assert.strictEqual(annComposite.performanceBonusAmount, 6000);
assert.strictEqual(annComposite.fixedAnnualAmount, 2000);
assert.strictEqual(annComposite.totalComp, 73000);
assert.strictEqual(Math.round(annComposite.monthlyEquivalent * 100) / 100, 6083.33);
assert.strictEqual(annComposite.note, "Additional payments are employer/contract dependent and are not statutory entitlements.");
console.log("[PASS] Composite compensation package: €5k base + 1x month + 10% perf + €2k lump => Total Comp: €73,000 (€6,083.33/mo)");

// F. Positional parameter backward compatibility:
const annPositional = SalaryCalculator.calculateAnnualCompensation(5000, 10, 1, 2000);
assert.strictEqual(annPositional.totalComp, 73000);
console.log("[PASS] Positional parameter call backward compatibility verified: €73,000");

// === 10. HOUSING & RUNDFUNKBEITRAG STATUTORY AUDIT ===
console.log("\n=== 10. HOUSING & RUNDFUNKBEITRAG STATUTORY AUDIT ===");

// A. Standard dwelling with direct Rundfunkbeitrag (€18.36/mo per dwelling)
const rentWithRundfunk = RentCalculator.calculateRent({
  kaltmiete: 1000,
  nebenkosten: 200,
  electricity: 60,
  internet: 40,
  includeRundfunkbeitrag: true
});
assert.strictEqual(rentWithRundfunk.warmmiete, 1200);
assert.strictEqual(rentWithRundfunk.rundfunkbeitrag, 18.36);
assert.strictEqual(rentWithRundfunk.rundfunkbeitragQuarterly, 55.08);
assert.strictEqual(rentWithRundfunk.rundfunkbeitragAnnual, 220.32);
assert.strictEqual(RentCalculator.RUNDFUNKBEITRAG_STATUTORY.monthly, 18.36);
assert.strictEqual(RentCalculator.RUNDFUNKBEITRAG_STATUTORY.quarterly, 55.08);
assert.strictEqual(RentCalculator.RUNDFUNKBEITRAG_STATUTORY.annual, 220.32);
assert.strictEqual(rentWithRundfunk.gezFee, 18.36); // backward compatibility
assert.strictEqual(rentWithRundfunk.totalHousingMonthly, 1318.36);
assert.strictEqual(rentWithRundfunk.totalHousingAnnual, 1318.36 * 12);
console.log("[PASS] Rent with direct dwelling Rundfunkbeitrag: €1,318.36/mo (Warmmiete €1,200 + €100 utils + €18.36; €55.08/quarter; €220.32/year)");

// B. Shared flat (WG) or spouse/partner covered / statutory exemption: Rundfunkbeitrag = €0
const rentWithoutRundfunk = RentCalculator.calculateRent({
  kaltmiete: 1000,
  nebenkosten: 200,
  electricity: 60,
  internet: 40,
  includeRundfunkbeitrag: false
});
assert.strictEqual(rentWithoutRundfunk.warmmiete, 1200);
assert.strictEqual(rentWithoutRundfunk.rundfunkbeitrag, 0);
assert.strictEqual(rentWithoutRundfunk.gezFee, 0);
assert.strictEqual(rentWithoutRundfunk.totalHousingMonthly, 1300);
console.log("[PASS] Rent with partner/flatmate-covered or exempt Rundfunkbeitrag: €1,300.00/mo (€0 Rundfunkbeitrag)");

// C. Backward compatibility with legacy includeGez flag:
const rentLegacyFalse = RentCalculator.calculateRent({
  kaltmiete: 800,
  nebenkosten: 150,
  includeGez: false
});
assert.strictEqual(rentLegacyFalse.rundfunkbeitrag, 0);
assert.strictEqual(rentLegacyFalse.gezFee, 0);
assert.strictEqual(rentLegacyFalse.totalHousingMonthly, 950);

const rentLegacyTrue = RentCalculator.calculateRent({
  kaltmiete: 800,
  nebenkosten: 150,
  includeGez: true
});
assert.strictEqual(rentLegacyTrue.rundfunkbeitrag, 18.36);
assert.strictEqual(rentLegacyTrue.gezFee, 18.36);
assert.strictEqual(rentLegacyTrue.totalHousingMonthly, 968.36);
console.log("[PASS] Legacy includeGez / gezFee backward compatibility verified.");

// === 11. REMOVAL OF INVENTED 2027 PAYROLL PARAMETERS & DATA_UNAVAILABLE ARCHITECTURE ===
console.log("\n=== 11. REMOVAL OF 2027 PAYROLL PARAMETERS & DATA_UNAVAILABLE ARCHITECTURE ===");

// A. Architecture verification
assert.deepStrictEqual(SUPPORTED_OFFICIAL_SALARY_YEARS, [2025, 2026]);
assert.deepStrictEqual(GERMAN_TAX_CONFIG.supportedYears, [2025, 2026]);
assert.strictEqual(GERMAN_TAX_CONFIG.years[2027], undefined, "2027 must NOT exist in GERMAN_TAX_CONFIG.years");
console.log("[PASS] Architecture: SUPPORTED_OFFICIAL_SALARY_YEARS = [2025, 2026] and GERMAN_TAX_CONFIG.years[2027] is undefined.");

// B. GERMAN_TAX_REFORM_PROPOSALS verification
assert.ok(GERMAN_TAX_REFORM_PROPOSALS["2027"], "Reform proposals for 2027 must exist in separate object");
assert.strictEqual(GERMAN_TAX_REFORM_PROPOSALS["2027"].officialStatus, "government bill / Regierungsentwurf / not enacted");
assert.strictEqual(GERMAN_TAX_REFORM_PROPOSALS["2027"].draftTariff.proposedBasicAllowance, 12564);
assert.strictEqual(GERMAN_TAX_REFORM_PROPOSALS["2027"].draftTariff.proposedArbeitnehmerPauschbetrag, 1430);
assert.strictEqual(GERMAN_TAX_REFORM_PROPOSALS["2027"].draftTariff.proposedProgressionLimit, 70600);
assert.strictEqual(GERMAN_TAX_REFORM_PROPOSALS["2027"].draftTariff.proposedKindergeldMonthly, 267);
assert.strictEqual(GERMAN_TAX_REFORM_PROPOSALS["2027"].draftSocialSecurity.status, "not_yet_official");

assert.ok(GERMAN_TAX_REFORM_PROPOSALS["2028"], "Reform proposals for 2028 must exist in separate object");
assert.strictEqual(GERMAN_TAX_REFORM_PROPOSALS["2028"].officialStatus, "government bill / Regierungsentwurf / not enacted");
assert.strictEqual(GERMAN_TAX_REFORM_PROPOSALS["2028"].draftTariff.proposedBasicAllowance, 12900);
assert.strictEqual(GERMAN_TAX_REFORM_PROPOSALS["2028"].draftTariff.proposedKindergeldMonthly, 272);
assert.strictEqual(GERMAN_TAX_REFORM_PROPOSALS["2028"].draftSocialSecurity.status, "not_yet_official");

assert.ok(GERMAN_TAX_REFORM_PROPOSALS["2027"].officialStatusDisclaimerEn.includes("must NOT be presented or used as official statutory payroll parameters"));
console.log("[PASS] GERMAN_TAX_REFORM_PROPOSALS: clearly labeled 'government bill / Regierungsentwurf / not enacted' for 2027 & 2028 with statutory disclaimer.");

// C. Rejection of 2027 in calculateNetSalary (no silent calculation!)
const res2027 = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: 2027 });
assert.strictEqual(res2027.unavailable, true);
assert.strictEqual(res2027.error, "TAX_DATA_UNAVAILABLE");
assert.strictEqual(res2027.year, 2027);
assert.ok(res2027.messageEn.includes("not legally finalized as of September 2026"));
assert.ok(res2027.messageKo.includes("2026년 9월 현재"));
console.log("[PASS] SalaryCalculator.calculateNetSalary(taxYear=2027) returns structured DATA_UNAVAILABLE without silent calculation.");

// D. Rejection of 2027 string in calculateNetSalary
const res2027Str = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: "2027" });
assert.strictEqual(res2027Str.unavailable, true);
assert.strictEqual(res2027Str.error, "TAX_DATA_UNAVAILABLE");

// E. Rejection of 2027 and 2028 in calculateNetToGross & calculateNetSalary
const rev2027 = SalaryCalculator.calculateNetToGross(3000, { taxYear: 2027 });
assert.strictEqual(rev2027.unavailable, true);
assert.strictEqual(rev2027.error, "TAX_DATA_UNAVAILABLE");
assert.strictEqual(rev2027.year, 2027);

const res2028 = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: 2028 });
assert.strictEqual(res2028.unavailable, true);
assert.strictEqual(res2028.error, "TAX_DATA_UNAVAILABLE");
assert.strictEqual(res2028.year, 2028);

const res2024 = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: 2024 });
assert.strictEqual(res2024.unavailable, true);
assert.strictEqual(res2024.error, "TAX_DATA_UNAVAILABLE");
assert.strictEqual(res2024.year, 2024);
console.log("[PASS] SalaryCalculator: Rejection of draft proposals (2027, 2028) and unsupported years (2024) verified.");

// F. Legitimate years 2025 and 2026 continue to calculate accurately
const res2025 = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: 2025 });
assert.ok(res2025.netMonthly > 0);
assert.strictEqual(res2025.taxYear, 2025);

const res2026 = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: 2026 });
assert.ok(res2026.netMonthly > 0);
assert.strictEqual(res2026.taxYear, 2026);
console.log("[PASS] Enacted official years (2025 & 2026) calculate accurately without regressions.");

// === 12. AUDIT AND CORRECTION OF ALL 2025 PARAMETERS (CARE & SOLZ) ===
console.log("\n=== 12. AUDIT AND CORRECTION OF ALL 2025 PARAMETERS ===");

const cfg2025 = GERMAN_TAX_CONFIG.years[2025];

// A. 2025 Pflegeversicherung Statutory Verification
assert.strictEqual(cfg2025.care.baseRate, 0.036, "2025 PV total general base rate must be 3.6%");
assert.strictEqual(cfg2025.care.childlessTotalRate, 0.042, "2025 PV childless total rate must be 4.2%");
assert.strictEqual(cfg2025.care.employeeBaseRate, 0.018, "2025 PV employee base outside Saxony must be 1.8%");
assert.strictEqual(cfg2025.care.childlessEmployeeRate, 0.024, "2025 PV childless employee rate outside Saxony must be 2.4%");
assert.strictEqual(cfg2025.care.employeeBaseRateSachsen, 0.023, "2025 PV Saxony employee base must be 2.3%");
assert.strictEqual(cfg2025.care.childlessEmployeeRateSachsen, 0.029, "2025 PV Saxony childless employee rate must be 2.9%");

// Child-dependent employee rates mapping (Outside Saxony)
const expectedRatesOutsideSaxony = {
  0: 0.0240,
  1: 0.0180,
  2: 0.0155,
  3: 0.0130,
  4: 0.0105,
  5: 0.0080
};
assert.deepStrictEqual(cfg2025.care.ratesOutsideSaxony, expectedRatesOutsideSaxony);

// Verify Saxony employee surcharge (+0.50%)
assert.strictEqual(cfg2025.care.saxonyAdditionalEmployeeShare, 0.0050);

// B. Negative check: verify NO outdated 2024 Pflegeversicherung values remain in 2025
assert.notStrictEqual(cfg2025.care.baseRate, 0.040, "2025 PV must NOT contain 2024/temporary 4.0% rate");
assert.notStrictEqual(cfg2025.care.employeeBaseRate, 0.022, "2025 PV must NOT contain 2024/temporary 2.2% rate");
assert.notStrictEqual(cfg2025.care.employeeBaseRateSachsen, 0.027, "2025 PV Saxony must NOT contain 2024/temporary 2.7% rate");
console.log("[PASS] 2025 Pflegeversicherung: All rates (3.6% base, 4.2% childless, 1.8% employee, 2.3% Saxony, graduated child rates) verified with zero 2024 values remaining.");

// C. 2025 Solidarity Surcharge (SolZ) Statutory Verification
assert.strictEqual(cfg2025.solz.thresholdSingle, 19950, "2025 SolZ single threshold must be €19,950");
assert.strictEqual(cfg2025.solz.thresholdMarried, 39900, "2025 SolZ married threshold must be €39,900");
assert.strictEqual(cfg2025.solz.rate, 0.055, "2025 SolZ rate must be 5.5%");
assert.strictEqual(cfg2025.solz.milderungRate, 0.119, "2025 SolZ milderung rate must be 11.9%");
assert.strictEqual(cfg2025.solz.capThresholdSingle, 37094.53, "2025 SolZ single cap threshold must be €37,094.53");
assert.strictEqual(cfg2025.solz.capThresholdMarried, 74189.06, "2025 SolZ married cap threshold must be €74,189.06");

// D. Negative check: verify NO outdated 2024 SolZ values remain in 2025
assert.notStrictEqual(cfg2025.solz.thresholdSingle, 18130, "2025 SolZ single must NOT use 2024 €18,130");
assert.notStrictEqual(cfg2025.solz.thresholdMarried, 36260, "2025 SolZ married must NOT use 2024 €36,260");
console.log("[PASS] 2025 Solidarity Surcharge: Statutory thresholds (€19,950 single / €39,900 married, 5.5%, 11.9%) verified with zero 2024 values remaining.");

// E. 2025 SolZ Functional Calculation Tests
// Single / Class I tests:
// 1. Below or equal to €19,950 -> SolZ = 0
assert.strictEqual(SalaryCalculator.calculateSolidaritySurcharge2025(19000, false), 0);
assert.strictEqual(SalaryCalculator.calculateSolidaritySurcharge2025(19950, false), 0);
assert.strictEqual(SalaryCalculator.calculateSolidaritySurcharge({ taxYear: 2025, incomeTax: 19950, isSplitting: false }), 0);

// 2. 1€ above threshold in Milderungszone: (19,951 - 19,950) * 0.119 = 0.119 -> 0.12 €
assert.strictEqual(SalaryCalculator.calculateSolidaritySurcharge2025(19951, false), 0.12);

// 3. Middle transition zone: €25,000 tax -> (25,000 - 19,950) * 0.119 = 5,050 * 0.119 = 600.95 €
assert.strictEqual(SalaryCalculator.calculateSolidaritySurcharge2025(25000, false), 600.95);

// 4. Above transition cap (€37,094.53): standard 5.5% applies -> €40,000 * 0.055 = 2,200.00 €
assert.strictEqual(SalaryCalculator.calculateSolidaritySurcharge2025(40000, false), 2200.00);

// Married Splitting / Class III tests:
// 1. Below or equal to €39,900 -> SolZ = 0
assert.strictEqual(SalaryCalculator.calculateSolidaritySurcharge2025(39000, true), 0);
assert.strictEqual(SalaryCalculator.calculateSolidaritySurcharge2025(39900, true), 0);

// 2. 1€ above splitting threshold: (39,901 - 39,900) * 0.119 = 0.12 €
assert.strictEqual(SalaryCalculator.calculateSolidaritySurcharge2025(39901, true), 0.12);

// 3. Middle splitting transition: €50,000 tax -> (50,000 - 39,900) * 0.119 = 10,100 * 0.119 = 1,201.90 €
assert.strictEqual(SalaryCalculator.calculateSolidaritySurcharge2025(50000, true), 1201.90);

// 4. Above splitting cap (€74,189.06): standard 5.5% applies -> €80,000 * 0.055 = 4,400.00 €
assert.strictEqual(SalaryCalculator.calculateSolidaritySurcharge2025(80000, true), 4400.00);
console.log("[PASS] 2025 SolZ functional calculation verified across all exemption, transition, and capped zones.");

// F. 2025 § 32a EStG Income Tax Tariff Statutory Parameters & Boundary Verification
// Official source: https://esth.bundesfinanzministerium.de/lsth/2025/A-Einkommensteuergesetz/IV-Tarif-31-34b/Paragraf-32a/inhalt.html
assert.strictEqual(cfg2025.tariff.zone1Limit, 12096, "2025 Grundfreibetrag must be €12,096");
assert.strictEqual(cfg2025.tariff.zone2Limit, 17443, "2025 Zone 2 limit must be €17,443");
assert.strictEqual(cfg2025.tariff.zone3Limit, 68480, "2025 Zone 3 limit must be €68,480");
assert.strictEqual(cfg2025.tariff.zone4Limit, 277825, "2025 Zone 4 limit must be €277,825");
assert.strictEqual(cfg2025.tariff.zone2A, 932.30, "2025 Zone 2A coefficient must be 932.30");
assert.strictEqual(cfg2025.tariff.zone2B, 1400, "2025 Zone 2B coefficient must be 1400");
assert.strictEqual(cfg2025.tariff.zone3A, 176.64, "2025 Zone 3A coefficient must be 176.64");
assert.strictEqual(cfg2025.tariff.zone3B, 2397, "2025 Zone 3B coefficient must be 2397");
assert.strictEqual(cfg2025.tariff.zone3C, 1015.13, "2025 Zone 3C coefficient must be 1015.13");
assert.strictEqual(cfg2025.tariff.zone4Rate, 0.42, "2025 Zone 4 rate must be 0.42");
assert.strictEqual(cfg2025.tariff.zone4Sub, 10911.92, "2025 Zone 4 subtraction must be 10911.92");
assert.strictEqual(cfg2025.tariff.zone5Rate, 0.45, "2025 Zone 5 rate must be 0.45");
assert.strictEqual(cfg2025.tariff.zone5Sub, 19246.67, "2025 Zone 5 subtraction must be 19246.67");

// Negative checks against outdated 2025 draft parameters:
assert.notStrictEqual(cfg2025.tariff.zone2Limit, 17005, "Outdated 17005 must NOT be in 2025 config");
assert.notStrictEqual(cfg2025.tariff.zone3Limit, 66760, "Outdated 66760 must NOT be in 2025 config");
assert.notStrictEqual(cfg2025.tariff.zone2A, 995.21, "Outdated 995.21 must NOT be in 2025 config");
assert.notStrictEqual(cfg2025.tariff.zone3A, 208.85, "Outdated 208.85 must NOT be in 2025 config");
assert.notStrictEqual(cfg2025.tariff.zone3C, 1015.51, "Outdated 1015.51 must NOT be in 2025 config");
assert.notStrictEqual(cfg2025.tariff.zone4Sub, 10636.31, "Outdated 10636.31 must NOT be in 2025 config");
assert.notStrictEqual(cfg2025.tariff.zone5Sub, 18971.06, "Outdated 18971.06 must NOT be in 2025 config");

// Boundary Tests for 2025 § 32a Tariff:
// 1. Boundary 12,096 / 12,097 (Grundfreibetrag / Zone 1 -> Zone 2)
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(12096, cfg2025), 0, "Tariff at 12096 must be 0 €");
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(12097, cfg2025), 0, "Tariff at 12097 must floor to 0 € (0.14 € exact)");
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(12103, cfg2025), 0, "Tariff at 12103 must floor to 0 € (0.98 € exact)");
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(12104, cfg2025), 1, "Tariff at 12104 must reach 1 € (1.12 € exact)");

// 2. Boundary 17,443 / 17,444 (Zone 2 -> Zone 3)
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(17443, cfg2025), 1015, "Tariff at 17443 (Zone 2 end) must be 1015 €");
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(17444, cfg2025), 1015, "Tariff at 17444 (Zone 3 start) must be 1015 €");
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(17445, cfg2025), 1015, "Tariff at 17445 must be 1015 €");

// 3. Boundary 68,480 / 68,481 (Zone 3 -> Zone 4 Spitzensteuersatz 42%)
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(68480, cfg2025), 17849, "Tariff at 68480 (Zone 3 end) must be 17849 €");
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(68481, cfg2025), 17850, "Tariff at 68481 (Zone 4 start) must be 17850 €");
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(68482, cfg2025), 17850, "Tariff at 68482 must be 17850 €");

// 4. Boundary 277,825 / 277,826 (Zone 4 -> Zone 5 Reichensteuer 45%)
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(277825, cfg2025), 105774, "Tariff at 277825 (Zone 4 end) must be 105774 €");
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(277826, cfg2025), 105775, "Tariff at 277826 (Zone 5 start) must be 105775 €");
assert.strictEqual(SalaryCalculator.calcStatutoryTariff(277827, cfg2025), 105775, "Tariff at 277827 must be 105775 €");
console.log("[PASS] 2025 § 32a EStG Tariff: All parameters and exact boundaries (12096/12097, 17443/17444, 68480/68481, 277825/277826) verified with zero draft values remaining.");

// G. Full Payroll Integration for 2025
const payroll2025_single = SalaryCalculator.calculateNetSalary({
  grossMonthly: 5000,
  taxYear: 2025,
  taxClass: "1",
  stateCode: "NW",
  numberOfQualifyingChildren: 0
});
assert.strictEqual(payroll2025_single.taxYear, 2025);
assert.strictEqual(payroll2025_single.pvEmployeeRate, 0.024);
assert.strictEqual(payroll2025_single.pvMonthly, Number((5000 * 0.024).toFixed(2))); // €120.00
assert.strictEqual(payroll2025_single.gkvEmployeeRate, 0.0855, "2025 GKV employee rate with 2.5% avg Zusatz must be 8.55%");
assert.strictEqual(payroll2025_single.incomeTaxAnnual, 9570, "2025 annual wage tax for €5k/mo under corrected § 32a tariff must be €9,570");
assert.strictEqual(payroll2025_single.incomeTaxMonthly, 797.50, "2025 monthly wage tax must be €797.50");
assert.strictEqual(payroll2025_single.solzMonthly, 0); // Single income tax is below €19,950

const payroll2025_sn = SalaryCalculator.calculateNetSalary({
  grossMonthly: 5000,
  taxYear: 2025,
  taxClass: "1",
  stateCode: "SN",
  numberOfQualifyingChildren: 0
});
assert.strictEqual(payroll2025_sn.pvEmployeeRate, 0.029);
assert.strictEqual(payroll2025_sn.pvMonthly, Number((5000 * 0.029).toFixed(2))); // €145.00

// Child discount check for 2025 (2 children in NW -> 1.55%, 2 children in SN -> 2.05%)
const payroll2025_kids_nw = SalaryCalculator.calculateNetSalary({
  grossMonthly: 5000,
  taxYear: 2025,
  taxClass: "1",
  stateCode: "NW",
  numberOfQualifyingChildren: 2
});
assert.strictEqual(payroll2025_kids_nw.pvEmployeeRate, 0.0155);

const payroll2025_kids_sn = SalaryCalculator.calculateNetSalary({
  grossMonthly: 5000,
  taxYear: 2025,
  taxClass: "1",
  stateCode: "SN",
  numberOfQualifyingChildren: 2
});
assert.strictEqual(payroll2025_kids_sn.pvEmployeeRate, 0.0205);
console.log("[PASS] 2025 Full payroll integration verified (Care insurance child tiers & Saxony differential, SolZ, § 32a tariff).");

// === 13. BMF 2026 PROGRAMMABLAUFPLAN (PAP) AUDIT & ESTIMATOR VERIFICATION ===
console.log("\n=== 13. BMF 2026 PROGRAMMABLAUFPLAN (PAP) AUDIT & ESTIMATOR VERIFICATION ===");

// A. Verify "Estimated Lohnsteuer" naming and return fields
const resEstimator = SalaryCalculator.calculateNetSalary({ grossMonthly: 3000, taxYear: 2026, taxClass: "1" });
assert.strictEqual(resEstimator.isEstimate, true, "isEstimate flag must be true");
assert.strictEqual(resEstimator.taxCalculationType, "Estimated Lohnsteuer", "taxCalculationType must be 'Estimated Lohnsteuer'");
assert.strictEqual(resEstimator.estimatedLohnsteuerMonthly, resEstimator.incomeTaxMonthly, "estimatedLohnsteuerMonthly must match incomeTaxMonthly");
assert.strictEqual(resEstimator.estimatedLohnsteuerAnnual, resEstimator.incomeTaxAnnual, "estimatedLohnsteuerAnnual must match incomeTaxAnnual");
assert.strictEqual(typeof resEstimator.estimatedTaxableIncome, "number", "estimatedTaxableIncome must be exposed as number");
assert.strictEqual(resEstimator.estimatedTaxBase, resEstimator.estimatedTaxableIncome, "estimatedTaxBase must match estimatedTaxableIncome");
assert.strictEqual(resEstimator.zvE, resEstimator.estimatedTaxableIncome, "legacy zvE alias must match estimatedTaxableIncome");
console.log("[PASS] Output object contains estimatedLohnsteuerMonthly/Annual, estimatedTaxableIncome, isEstimate: true, and taxCalculationType: 'Estimated Lohnsteuer'.");

// B. Verify visible disclaimer
assert.ok(
  resEstimator.parameters.disclaimerEn.includes("This is an estimation model and is NOT the official BMF Lohnsteuer calculation engine") ||
  resEstimator.parameters.disclaimerEn.includes("This is an estimate. Actual employer payroll withholding may differ."),
  "Estimation disclaimer required"
);
assert.ok(
  resEstimator.parameters.disclaimerKo.includes("추정 모델") || resEstimator.parameters.disclaimerKo.includes("추정치"),
  "Korean disclaimer required"
);
console.log("[PASS] Visible disclaimer verified: 'This is an estimation model and is NOT the official BMF Lohnsteuer calculation engine. Actual employer payroll withholding may differ.'");

// C. Verify Class III metadata: no "60/40" ratio requirement
const class3Meta = GERMAN_TAX_CONFIG.taxClasses.find(c => c.id === "3");
assert.ok(!class3Meta.useCaseEn.includes("60/40"), "Class III metadata must NOT contain '60/40'");
assert.ok(!class3Meta.useCaseKo.includes("60:40"), "Class III Korean metadata must NOT contain '60:40'");
assert.ok(!class3Meta.featuresEn.includes("exact statutory"), "Class III must NOT claim exact statutory payroll results");
console.log("[PASS] Class III metadata verified: 60/40 ratio removed, described as estimation model.");

// D. Verify Class VI description:
// "Second and subsequent employment relationships are generally taxed under Class VI."
const class6Meta = GERMAN_TAX_CONFIG.taxClasses.find(c => c.id === "6");
assert.strictEqual(
  class6Meta.useCaseEn,
  "Second and subsequent employment relationships are generally taxed under Class VI."
);
console.log("[PASS] Class VI description verified: 'Second and subsequent employment relationships are generally taxed under Class VI.'");

// E. Verify official BMF PAP source metadata
const bmfPapSource = GERMAN_TAX_CONFIG.officialSources.find(s => s.reference.includes("Programmablaufplan"));
assert.ok(bmfPapSource, "BMF PAP 2026 official source metadata must exist");
assert.strictEqual(bmfPapSource.institution, "Bundesministerium der Finanzen (BMF)");
assert.ok(bmfPapSource.reference.includes("2026"));
console.log("[PASS] Official BMF PAP 2026 source metadata verified in GERMAN_TAX_CONFIG.officialSources.");

// F. Benchmark Test Fixtures comparing Estimator against official BMF PAP reference benchmarks
// Case 1: Class I, single, childless, €3,000 gross monthly in 2026
// Official BMF PAP 2026 benchmark values:
// - Monthly gross: €3,000.00
// - Social security: RV €279.00 (9.3%), AV €39.00 (1.3%), GKV €262.50 (8.75%), PV €72.00 (2.4%) = Total €652.50
// - Lohnsteuer benchmark: ~€290 - €295 / month
// - SolZ: €0.00
// - Net pay benchmark: ~€2,030 - €2,055 / month
const bmfBench1 = SalaryCalculator.calculateNetSalary({
  grossMonthly: 3000,
  taxYear: 2026,
  taxClass: "1",
  stateCode: "BE",
  numberOfQualifyingChildren: 0
});
assert.strictEqual(bmfBench1.rvMonthly, 279.00);
assert.strictEqual(bmfBench1.avMonthly, 39.00);
assert.strictEqual(bmfBench1.gkvMonthly, 262.50);
assert.strictEqual(bmfBench1.pvMonthly, 72.00);
assert.strictEqual(bmfBench1.totalSocialMonthly, 652.50);
assert.strictEqual(bmfBench1.solzMonthly, 0);
assert.ok(bmfBench1.estimatedLohnsteuerMonthly >= 285 && bmfBench1.estimatedLohnsteuerMonthly <= 300, `Estimated Lohnsteuer (${bmfBench1.estimatedLohnsteuerMonthly}) within benchmark range`);
assert.ok(bmfBench1.netMonthly >= 2030 && bmfBench1.netMonthly <= 2060, `Net pay (${bmfBench1.netMonthly}) within benchmark range`);
console.log(`[PASS] BMF PAP Fixture 1 (€3,000/mo Class I): Estimated Lohnsteuer=€${bmfBench1.estimatedLohnsteuerMonthly}, Net=€${bmfBench1.netMonthly} (BMF benchmark ~€2,030–€2,055).`);

// Case 2: Class I, single, childless, €5,000 gross monthly in 2026
// Official BMF PAP 2026 benchmark values:
// - Social security: RV €465.00, AV €65.00, GKV €437.50, PV €120.00 = Total €1,087.50
// - Net pay benchmark: ~€3,100 - €3,150 / month
const bmfBench2 = SalaryCalculator.calculateNetSalary({
  grossMonthly: 5000,
  taxYear: 2026,
  taxClass: "1",
  stateCode: "BE",
  numberOfQualifyingChildren: 0
});
assert.strictEqual(bmfBench2.rvMonthly, 465.00);
assert.strictEqual(bmfBench2.avMonthly, 65.00);
assert.strictEqual(bmfBench2.gkvMonthly, 437.50);
assert.strictEqual(bmfBench2.pvMonthly, 120.00);
assert.strictEqual(bmfBench2.totalSocialMonthly, 1087.50);
assert.strictEqual(bmfBench2.solzMonthly, 0);
assert.ok(bmfBench2.estimatedLohnsteuerMonthly >= 770 && bmfBench2.estimatedLohnsteuerMonthly <= 800, `Estimated Lohnsteuer (${bmfBench2.estimatedLohnsteuerMonthly}) within benchmark range`);
assert.ok(bmfBench2.netMonthly >= 3100 && bmfBench2.netMonthly <= 3150, `Net pay (${bmfBench2.netMonthly}) within benchmark range`);
console.log(`[PASS] BMF PAP Fixture 2 (€5,000/mo Class I): Estimated Lohnsteuer=€${bmfBench2.estimatedLohnsteuerMonthly}, Net=€${bmfBench2.netMonthly} (BMF benchmark ~€3,100–€3,150).`);

// Case 3: Comparison of Class III, V, VI estimation models vs standard Class I
const benchClass3 = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: 2026, taxClass: "3" });
const benchClass5 = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: 2026, taxClass: "5" });
const benchClass6 = SalaryCalculator.calculateNetSalary({ grossMonthly: 5000, taxYear: 2026, taxClass: "6" });

assert.strictEqual(benchClass3.taxCalculationType, "Estimated Lohnsteuer");
assert.strictEqual(benchClass5.taxCalculationType, "Estimated Lohnsteuer");
assert.strictEqual(benchClass6.taxCalculationType, "Estimated Lohnsteuer");
assert.ok(benchClass3.netMonthly > bmfBench2.netMonthly, "Class III net pay must be higher than Class I due to splitting allowance");
assert.ok(benchClass5.netMonthly < bmfBench2.netMonthly, "Class V net pay must be lower than Class I due to shifted allowance");
assert.ok(benchClass6.netMonthly < benchClass5.netMonthly, "Class VI net pay must be lowest due to lack of lump sum deductions");
console.log("[PASS] Class III, V, VI estimation models verified with transparent disclaimers and hierarchy preservation.");

// === 14. SINGLE-PARENT TAX RELIEF REGRESSION AUDIT (§ 24b EStG) ===
console.log("\n=== 14. SINGLE-PARENT TAX RELIEF REGRESSION AUDIT (§ 24b EStG) ===");

// A. Parameter verification in tax config for 2025 and 2026
assert.strictEqual(GERMAN_TAX_CONFIG.years[2025].lumpSums.singleParentRelief, 4260, "2025 singleParentRelief must be 4260");
assert.strictEqual(GERMAN_TAX_CONFIG.years[2025].lumpSums.singleParentAdditionalChild, 240, "2025 singleParentAdditionalChild must be 240");
assert.notStrictEqual(GERMAN_TAX_CONFIG.years[2025].lumpSums.singleParentAdditionalChild, 852, "2025 singleParentAdditionalChild must NOT be 852");

assert.strictEqual(GERMAN_TAX_CONFIG.years[2026].lumpSums.singleParentRelief, 4260, "2026 singleParentRelief must be 4260");
assert.strictEqual(GERMAN_TAX_CONFIG.years[2026].lumpSums.singleParentAdditionalChild, 240, "2026 singleParentAdditionalChild must be 240");
assert.notStrictEqual(GERMAN_TAX_CONFIG.years[2026].lumpSums.singleParentAdditionalChild, 852, "2026 singleParentAdditionalChild must NOT be 852");
console.log("[PASS] 2025 and 2026 § 24b parameters verified: base €4,260, additional child €240 (852 eliminated).");

// B. Regression tests for single parent relief amounts (both 2025 and 2026)
// 1 child -> 4260
// 2 children -> 4500
// 3 children -> 4740
// 4 children -> 4980
[2025, 2026].forEach(yr => {
  assert.strictEqual(SalaryCalculator.calculateSingleParentRelief(1, yr), 4260, `Year ${yr}: 1 child -> 4260`);
  assert.strictEqual(SalaryCalculator.calculateSingleParentRelief(2, yr), 4500, `Year ${yr}: 2 children -> 4500`);
  assert.strictEqual(SalaryCalculator.calculateSingleParentRelief(3, yr), 4740, `Year ${yr}: 3 children -> 4740`);
  assert.strictEqual(SalaryCalculator.calculateSingleParentRelief(4, yr), 4980, `Year ${yr}: 4 children -> 4980`);
});
console.log("[PASS] § 24b EStG relief formula verified: 1 child -> 4260, 2 children -> 4500, 3 children -> 4740, 4 children -> 4980 across both 2025 and 2026.");

// C. Full payroll integration tests for Class II with children
const p2_1 = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxYear: 2026, taxClass: "2", numChildren: 1, stateCode: "BE" });
const p2_2 = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxYear: 2026, taxClass: "2", numChildren: 2, stateCode: "BE" });
const p2_3 = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxYear: 2026, taxClass: "2", numChildren: 3, stateCode: "BE" });
const p2_4 = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxYear: 2026, taxClass: "2", numChildren: 4, stateCode: "BE" });

assert.strictEqual(p2_1.singleParentRelief, 4260);
assert.strictEqual(p2_2.singleParentRelief, 4500);
assert.strictEqual(p2_3.singleParentRelief, 4740);
assert.strictEqual(p2_4.singleParentRelief, 4980);

// Each additional child increases relief by €240
assert.strictEqual(p2_2.singleParentRelief - p2_1.singleParentRelief, 240, "Relief delta between 1 and 2 children must be 240");
assert.strictEqual(p2_3.singleParentRelief - p2_2.singleParentRelief, 240, "Relief delta between 2 and 3 children must be 240");
assert.strictEqual(p2_4.singleParentRelief - p2_3.singleParentRelief, 240, "Relief delta between 3 and 4 children must be 240");

// zvE changes reflect both +€240 single parent relief and -€120 PV deduction due to 0.25% child discount (net €120 reduction)
assert.strictEqual(p2_1.zvE - p2_2.zvE, 120, "zvE difference between 1 and 2 children (+€240 relief, -€120 PV deduction) must be €120");
assert.strictEqual(p2_2.zvE - p2_3.zvE, 120, "zvE difference between 2 and 3 children (+€240 relief, -€120 PV deduction) must be €120");
assert.strictEqual(p2_3.zvE - p2_4.zvE, 120, "zvE difference between 3 and 4 children (+€240 relief, -€120 PV deduction) must be €120");

assert.ok(p2_2.netMonthly > p2_1.netMonthly, "Net monthly must increase with 2nd child");
assert.ok(p2_3.netMonthly > p2_2.netMonthly, "Net monthly must increase with 3rd child");
assert.ok(p2_4.netMonthly > p2_3.netMonthly, "Net monthly must increase with 4th child");

// Verification of § 24b Abs. 1 EStG eligibility condition:
// Single-parent relief requires at least 1 qualifying child belonging to household; numChildren=0 yields €0 relief.
const p2_noKids = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxYear: 2026, taxClass: "2", numChildren: 0, stateCode: "BE" });
assert.strictEqual(p2_noKids.singleParentRelief, 0, "Single parent relief must be €0 if numChildren is 0 (§ 24b Abs. 1 EStG eligibility requirement)");
const p1_noKids = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxYear: 2026, taxClass: "1", numChildren: 0, stateCode: "BE" });
assert.strictEqual(p2_noKids.estimatedTaxableIncome, p1_noKids.estimatedTaxableIncome, "Class II with 0 kids has same tax base as Class I");
console.log("[PASS] Class II full payroll integration verified with exact statutory relief delta of €240 per additional child and strict § 24b Abs. 1 eligibility requirement (0 kids -> €0 relief).");

// D. Statutory sources and metadata
const s24b = GERMAN_TAX_CONFIG.officialSources.find(s => s.reference.includes("§ 24b EStG"));
assert.ok(s24b, "Official source entry for § 24b EStG must exist");
assert.strictEqual(s24b.url, "https://www.gesetze-im-internet.de/estg/__24b.html");
assert.strictEqual(s24b.tableUrl, "https://usth.bundesfinanzministerium.de/lsth/2026/tabellarische-Uebersicht/24b.html");

const class2Meta = GERMAN_TAX_CONFIG.taxClasses.find(c => c.id === "2");
assert.ok(class2Meta.featuresEn.includes("€240"), "Class II metadata featuresEn must state €240");
assert.ok(!class2Meta.featuresEn.includes("€852"), "Class II metadata featuresEn must NOT state €852");
assert.ok(class2Meta.featuresKo.includes("240 €"), "Class II metadata featuresKo must state 240 €");
assert.ok(!class2Meta.featuresKo.includes("852 €"), "Class II metadata featuresKo must NOT state 852 €");
console.log("[PASS] Official sources and Class II metadata for § 24b EStG verified.");

console.log("\n🎉 ALL 2025 & 2026 STATUTORY & BMF PAP AUDIT TESTS PASSED WITHOUT EXCEPTION!");


