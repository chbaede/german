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

// E. PKV Estimator Mode (Non-statutory contract rate, monthly input & optional employer subsidy)
const pkvDirect = SalaryCalculator.calculateNetSalary({ grossMonthly: 6000, taxYear: 2026, healthType: "pkv", pkvAmount: 450 });
if (pkvDirect.gkvAssessmentMonthly !== 0) throw new Error("PKV must not have statutory GKV assessment");
if (pkvDirect.gkvMonthly !== 450) throw new Error("PKV employee cost must equal inputted €450");

const pkvWithSubsidy = SalaryCalculator.calculateNetSalary({
  grossMonthly: 6000,
  taxYear: 2026,
  healthType: "pkv",
  pkvTotalPremium: 800,
  pkvEmployerSubsidy: 400
});
if (pkvWithSubsidy.gkvMonthly !== 400) throw new Error("PKV net cost must equal total premium - employer subsidy (800 - 400 = 400)");
console.log(`[PASS] PKV Estimator Mode: Direct Cost=€${pkvDirect.gkvMonthly}, Total €800 - Subsidy €400 = €${pkvWithSubsidy.gkvMonthly}`);

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

console.log("\n🎉 ALL 2026 STATUTORY AUDIT TESTS PASSED WITHOUT EXCEPTION!");
