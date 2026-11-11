/**
 * Comprehensive Test Suite for German Salary Tax Class Comparison
 * and Official BMF PAP Subroutines (MST5_6 / UP5_6 & § 51a EStG)
 */

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

global.window = {};
global.GLTUtils = {
  parseNumber(val, fallback) {
    if (val === null || val === undefined || val === '') return fallback;
    const cleaned = String(val).trim().replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? fallback : parsed;
  },
  formatEuro(val) {
    return `€ ${Number(val).toFixed(2)}`;
  }
};
global.currentLang = 'en';

vm.runInThisContext(fs.readFileSync('./js/data/tax-config.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('./js/calculators/salary.js', 'utf8'));

console.log('=== TEST SUITE: TAX CLASS COMPARISON & BMF PAP VERIFICATION ===\n');

// 1. compareTaxClasses basic functionality
{
  const res = SalaryCalculator.compareTaxClasses({
    grossMonthly: 5000,
    taxYear: 2026,
    taxClass: "1",
    stateCode: "BE",
    numChildren: 0
  });

  assert.strictEqual(res.classes.length, 6, "Must return exactly 6 tax classes");
  assert.strictEqual(res.activeTaxClass, "1", "Active tax class should be 1");
  assert.strictEqual(res.selectedClassResult.taxClass, "1");

  // Net Take-home hierarchy: Class III > Class II (if kids > 0 or base) >= Class I == Class IV > Class V > Class VI
  const c1 = res.classes.find(c => c.taxClass === "1");
  const c2 = res.classes.find(c => c.taxClass === "2");
  const c3 = res.classes.find(c => c.taxClass === "3");
  const c4 = res.classes.find(c => c.taxClass === "4");
  const c5 = res.classes.find(c => c.taxClass === "5");
  const c6 = res.classes.find(c => c.taxClass === "6");

  assert(c3.netMonthly > c1.netMonthly, "Class III net must exceed Class I");
  assert.strictEqual(c1.netMonthly, c4.netMonthly, "Class I and Class IV net must be identical (no kids, standard single splitting)");
  assert(c1.netMonthly > c5.netMonthly, "Class I net must exceed Class V");
  assert(c5.netMonthly > c6.netMonthly, "Class V net must exceed Class VI (Class VI lacks personal allowances)");

  assert.strictEqual(c1.diffMonthlyVsClass1, 0, "Class I diff vs itself must be 0");
  assert(c3.diffMonthlyVsClass1 > 0, "Class III diff vs Class I must be positive");
  assert(c5.diffMonthlyVsClass1 < 0, "Class V diff vs Class I must be negative");

  console.log('[PASS] compareTaxClasses: 6 tax classes returned with correct take-home hierarchy and diff metrics.');
}

// 2. Married Couple Combination Simulation (3/5 vs 4/4 vs 5/3)
{
  const res = SalaryCalculator.compareTaxClasses({
    grossMonthly: 6000,
    partnerGrossMonthly: 3000,
    taxYear: 2026,
    taxClass: "4",
    stateCode: "BE"
  });

  const cc = res.coupleComparison;
  assert(cc, "coupleComparison object must exist");
  assert.strictEqual(cc.userGrossMonthly, 6000);
  assert.strictEqual(cc.partnerGrossMonthly, 3000);
  assert.strictEqual(cc.combinedGrossMonthly, 9000);

  // When primary earns €6,000 and partner earns €3,000 (2:1 ratio):
  // Combination 3/5 gives higher immediate monthly net than 4/4
  assert(cc.combo3_5.combinedNetMonthly > cc.combo4_4.combinedNetMonthly, "Combo 3/5 should yield higher monthly net when partner earns less");
  assert(cc.combo4_4.combinedNetMonthly > cc.combo5_3.combinedNetMonthly, "Combo 5/3 should yield lowest monthly net when higher earner is in 5");

  console.log(`[PASS] Married couple simulation: 3/5 (€${cc.combo3_5.combinedNetMonthly}) > 4/4 (€${cc.combo4_4.combinedNetMonthly}) > 5/3 (€${cc.combo5_3.combinedNetMonthly})`);
}

// 3. Official BMF PAP Subroutine UP5_6 for Class V & VI
{
  const taxClass5 = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxYear: 2026, taxClass: "5" });
  const taxClass6 = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxYear: 2026, taxClass: "6" });

  assert(taxClass5.incomeTaxMonthly > 0, "Class 5 must incur wage tax");
  assert(taxClass6.incomeTaxMonthly > taxClass5.incomeTaxMonthly, "Class 6 must incur higher wage tax than Class 5 due to lack of lump-sums");
  assert(taxClass6.rvMonthly > 0 && taxClass6.gkvMonthly > 0, "Class 6 retains statutory social insurance deductions");

  console.log(`[PASS] BMF PAP MST5_6 / UP5_6: Class 5 wage tax (€${taxClass5.incomeTaxMonthly}) and Class 6 wage tax (€${taxClass6.incomeTaxMonthly}) verified.`);
}

// 4. § 51a Abs. 2a EStG SolZ with Children
{
  // Compare high income single earner in 2026 with 0 children vs 2 children
  const noKids = SalaryCalculator.calculateNetSalary({ grossMonthly: 8000, taxYear: 2026, taxClass: "1", numChildren: 0 });
  const withKids = SalaryCalculator.calculateNetSalary({ grossMonthly: 8000, taxYear: 2026, taxClass: "1", numChildren: 2 });

  // With 0 kids at €8,000/mo, taxable wage tax base exceeds €20,350 Freigrenze, so SolZ is owed
  assert(noKids.solzMonthly > 0, "High earner without children should owe SolZ in transition zone");

  // With 2 kids under § 51a Abs. 2a EStG, Kinderfreibetrag reduces the JBMG tax base below the Freigrenze (€20,350), exempting SolZ!
  assert.strictEqual(withKids.solzMonthly, 0, "With 2 qualifying children, SolZ should be 0 due to § 51a Abs. 2a EStG Kinderfreibetrag deduction");
  assert(withKids.netMonthly > noKids.netMonthly, "Net monthly take-home must be higher with children due to PV child discounts and SolZ relief");

  console.log(`[PASS] § 51a Abs. 2a EStG SolZ reduction with children verified: noKids SolZ=€${noKids.solzMonthly}, withKids SolZ=€${withKids.solzMonthly}.`);
}

console.log('\n🎉 ALL NEW TAX CLASS COMPARISON & BMF PAP TESTS PASSED SUCCESSFULLY!\n');
