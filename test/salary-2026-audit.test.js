const fs = require('fs');
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
if (!item2027.statusEn.includes("announced / proposed for 2027")) {
  throw new Error(`2027 wording must include 'announced / proposed for 2027', got: ${item2027.statusEn}`);
}
if (!item2028.statusEn.includes("announced / proposed for 2028")) {
  throw new Error(`2028 wording must include 'announced / proposed for 2028', got: ${item2028.statusEn}`);
}

// E. Source check
if (kg2026.source !== "BMF / Familienkasse" || FamilyTools.source.institution !== "BMF / Familienkasse") {
  throw new Error("Source must be 'BMF / Familienkasse'");
}
console.log(`[PASS] Kindergeld: 2026 Enacted=€${kg2026.ratePerChild}, 2027 Announced=€${kg2027.ratePerChild}, 2028 Announced=€${kg2028.ratePerChild}, Source: ${kg2026.source}`);

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
  "GEZ / Rundfunkbeitrag",
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

const gez = GERMAN_GLOSSARY.find(g => g.term.startsWith("GEZ"));
if ((gez.classification !== "legal_requirement" && gez.classification !== "informal_term") || !gez.legalBasis.includes("RBStV")) {
  throw new Error("GEZ / Rundfunkbeitrag must cite RBStV legal basis");
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

console.log("\n🎉 ALL 2026 STATUTORY AUDIT TESTS PASSED WITHOUT EXCEPTION!");

