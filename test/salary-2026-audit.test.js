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

// 4. Church Tax Rates: BY (8%) vs NW (9%) vs None (0%)
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
