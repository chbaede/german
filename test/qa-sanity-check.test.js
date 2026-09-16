/**
 * Comprehensive Final QA / Sanity Check for German Life Toolkit
 * Executes all 16 verification suites across:
 * 1. Realistic Salary Scenario Matrix (3,168 combinations)
 * 2. Strict Salary Sanity & Range Invariants
 * 3. Monotonicity across Gross Salary Progression
 * 4. Social Insurance BBG Boundary Ceiling Tests (2025 & 2026)
 * 5. Pflegeversicherung Scale Matrix (NW & SN, 0 to 6 children)
 * 6. Solidaritätszuschlag Boundary & Milderung Tests (2025 & 2026)
 * 7. Statutory § 32a EStG Tariff Boundaries (2025 & 2026)
 * 8. Tax Class Relationship Sanity (Classes I to VI)
 * 9. Single-Parent Relief (§ 24b EStG, 0 to 4 children)
 * 10. GKV vs PKV / PPV Sanity
 * 11. Reverse Net -> Gross Solver Convergence
 * 12. Annual Compensation Calculator Combinations (A to F)
 * 13. Kindergeld Multi-Year QA (2021 to 2030)
 * 14. KMK School Holidays Integrity (16 states x 5 school years)
 * 15. Public Holidays & Working Days Concept Separation (2026)
 * 16. Rundfunkbeitrag Statutory Dwelling Coverage
 */

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

const GERMAN_HOLIDAYS = require('../js/data/holidays.js');
global.GERMAN_HOLIDAYS = GERMAN_HOLIDAYS;
const GERMAN_SCHOOL_HOLIDAYS = require('../js/data/school-holidays.js');
global.GERMAN_SCHOOL_HOLIDAYS = GERMAN_SCHOOL_HOLIDAYS;
const CalendarTools = require('../js/calculators/calendar-tools.js');
global.CalendarTools = CalendarTools;

vm.runInThisContext(fs.readFileSync('./js/data/tax-config.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('./js/calculators/salary.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('./js/calculators/family-tools.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('./js/calculators/rent.js', 'utf8'));
vm.runInThisContext(fs.readFileSync('./js/data/glossary.js', 'utf8'));

console.log("================================================================");
console.log("      GERMAN LIFE TOOLKIT — FINAL PRODUCTION QA / SANITY CHECK   ");
console.log("================================================================\n");

let totalScenariosExecuted = 0;
let salaryMatrixCount = 0;

// ============================================================================
// SUITE 1 & 2 & 3: SALARY CALCULATOR MATRIX, SANITY & MONOTONICITY
// ============================================================================
console.log("--- Suite 1, 2, 3: Salary Scenario Matrix, Sanity & Monotonicity ---");

const salaryGrossLevels = [3000, 4000, 5000, 6000, 7000, 8000, 8450, 10000, 12000, 15000, 20000];
const taxClasses = ["1", "2", "3", "4", "5", "6"];
const testStates = ["BE", "NW", "SN"];
const taxYears = [2025, 2026];
const insuranceModes = ["gkv", "pkv"];
const childrenCounts = [0, 1, 2, 3];

let monotonicityChecksPassed = 0;

for (const year of taxYears) {
  for (const tc of taxClasses) {
    for (const st of testStates) {
      for (const ins of insuranceModes) {
        for (const numKids of childrenCounts) {
          let prevGross = 0;
          let prevNet = 0;

          for (const gross of salaryGrossLevels) {
            salaryMatrixCount++;
            totalScenariosExecuted++;

            const params = {
              grossMonthly: gross,
              taxClass: tc,
              stateCode: st,
              taxYear: year,
              healthType: ins,
              numChildren: numKids,
              hasChurchTax: false,
              pkvMonthlyPremium: 600,
              ppvMonthlyPremium: 80,
              hasEmployerSubsidy: true
            };

            const res = SalaryCalculator.calculateNetSalary(params);

            // Sanity Invariants
            assert.strictEqual(typeof res, 'object', `Result must be an object for gross ${gross}`);
            assert.strictEqual(res.unavailable, undefined, `Valid year ${year} must not return unavailable`);
            assert.ok(res.grossMonthly > 0, `grossMonthly must be > 0, got ${res.grossMonthly}`);
            assert.ok(res.netMonthly >= 0, `netMonthly must be >= 0, got ${res.netMonthly}`);
            assert.ok(res.netMonthly <= res.grossMonthly, `netMonthly (${res.netMonthly}) must not exceed grossMonthly (${res.grossMonthly})`);
            assert.ok(res.incomeTaxAnnual >= 0, `incomeTaxAnnual must be >= 0, got ${res.incomeTaxAnnual}`);
            assert.ok(res.incomeTaxMonthly >= 0, `incomeTaxMonthly must be >= 0, got ${res.incomeTaxMonthly}`);
            assert.ok(res.totalSocialMonthly >= 0, `totalSocialMonthly must be >= 0, got ${res.totalSocialMonthly}`);
            assert.ok(res.totalDeductionsMonthly >= 0, `totalDeductionsMonthly must be >= 0, got ${res.totalDeductionsMonthly}`);

            // No NaN / Infinity / null
            for (const key of ['grossMonthly', 'netMonthly', 'incomeTaxMonthly', 'solzMonthly', 'churchTaxMonthly', 'rvMonthly', 'avMonthly', 'gkvMonthly', 'pvMonthly', 'totalDeductionsMonthly']) {
              const val = res[key];
              assert.ok(Number.isFinite(val), `Key ${key} must be finite, got ${val} in scenario: year=${year}, tc=${tc}, gross=${gross}`);
              assert.ok(val >= 0, `Key ${key} must be >= 0, got ${val}`);
            }

            // Monotonicity check
            if (prevGross > 0) {
              assert.ok(
                res.netMonthly >= prevNet - 0.01,
                `Monotonicity violation: gross increased from ${prevGross} to ${gross}, but net decreased from ${prevNet} to ${res.netMonthly} (year=${year}, tc=${tc}, st=${st}, ins=${ins}, kids=${numKids})`
              );
              monotonicityChecksPassed++;
            }

            prevGross = gross;
            prevNet = res.netMonthly;
          }
        }
      }
    }
  }
}

console.log(`[PASS] Executed ${salaryMatrixCount} realistic salary scenarios across all tax classes, states, years, insurance modes, and child counts.`);
console.log(`[PASS] Verified ${monotonicityChecksPassed} salary progression monotonicity transitions with zero unexpected net drops.`);


// ============================================================================
// SUITE 4: SOCIAL INSURANCE BBG CEILING TESTS (2025 & 2026)
// ============================================================================
console.log("\n--- Suite 4: Social Insurance BBG Ceiling Tests ---");

const bbgCases = [
  // 2026 GKV/PV: €5,812.50
  { year: 2026, type: "health", ceiling: 5812.50, delta: 0.01 },
  // 2026 RV/AV: €8,450.00
  { year: 2026, type: "pension", ceiling: 8450.00, delta: 0.01 },
  // 2025 GKV/PV: €5,512.50
  { year: 2025, type: "health", ceiling: 5512.50, delta: 0.01 },
  // 2025 RV/AV: €8,050.00
  { year: 2025, type: "pension", ceiling: 8050.00, delta: 0.01 }
];

for (const b of bbgCases) {
  totalScenariosExecuted += 3;
  const below = b.ceiling - b.delta;
  const exact = b.ceiling;
  const above = b.ceiling + b.delta;

  const resBelow = SalaryCalculator.calculateNetSalary({ grossMonthly: below, taxYear: b.year, healthType: "gkv" });
  const resExact = SalaryCalculator.calculateNetSalary({ grossMonthly: exact, taxYear: b.year, healthType: "gkv" });
  const resAbove = SalaryCalculator.calculateNetSalary({ grossMonthly: above, taxYear: b.year, healthType: "gkv" });

  const key = b.type === "health" ? "gkvMonthly" : "rvMonthly";

  // Increases below/to BBG
  assert.ok(resExact[key] > resBelow[key], `${key} must increase up to BBG for year ${b.year}`);
  // Caps at BBG: resAbove contribution must equal resExact contribution
  assert.strictEqual(
    Number(resAbove[key].toFixed(2)),
    Number(resExact[key].toFixed(2)),
    `${key} must cap at exact ceiling ${b.ceiling} for year ${b.year}`
  );
  // Does not suddenly decrease
  assert.ok(resAbove[key] >= resExact[key] - 0.001, `${key} must not drop above BBG`);
}
console.log("[PASS] Social Insurance BBG boundary ceilings verified for 2025 and 2026 (GKV/PV and RV/AV).");


// ============================================================================
// SUITE 5: PFLEGEVERSICHERUNG TEST MATRIX (NW & SN, 0 to 6 CHILDREN)
// ============================================================================
console.log("\n--- Suite 5: Pflegeversicherung Child Scale Matrix (NW vs SN) ---");

const nwExpectedRates = [0.024, 0.018, 0.0155, 0.013, 0.0105, 0.008, 0.008];
const snExpectedRates = [0.029, 0.023, 0.0205, 0.018, 0.0155, 0.013, 0.013];

for (let k = 0; k <= 6; k++) {
  totalScenariosExecuted += 2;
  const nwRate = SalaryCalculator.getEmployeeCareInsuranceRate({
    stateCode: "NW",
    numberOfQualifyingChildren: k,
    isChildless: (k === 0)
  });
  const snRate = SalaryCalculator.getEmployeeCareInsuranceRate({
    stateCode: "SN",
    numberOfQualifyingChildren: k,
    isChildless: (k === 0)
  });

  assert.strictEqual(Number(nwRate.toFixed(4)), nwExpectedRates[k], `NW PV rate mismatch for ${k} children`);
  assert.strictEqual(Number(snRate.toFixed(4)), snExpectedRates[k], `SN PV rate mismatch for ${k} children`);
}
// Check 5 and 6 produce the exact same statutory rate
assert.strictEqual(
  SalaryCalculator.getEmployeeCareInsuranceRate({ stateCode: "NW", numberOfQualifyingChildren: 5, isChildless: false }),
  SalaryCalculator.getEmployeeCareInsuranceRate({ stateCode: "NW", numberOfQualifyingChildren: 6, isChildless: false })
);
assert.strictEqual(
  SalaryCalculator.getEmployeeCareInsuranceRate({ stateCode: "SN", numberOfQualifyingChildren: 5, isChildless: false }),
  SalaryCalculator.getEmployeeCareInsuranceRate({ stateCode: "SN", numberOfQualifyingChildren: 6, isChildless: false })
);
console.log("[PASS] Pflegeversicherung PUEG child scale verified for non-Saxony (NW) and Saxony (SN) across 0-6 children.");


// ============================================================================
// SUITE 6: SOLIDARITÄTSZUSCHLAG BOUNDARY TESTS (2025 & 2026)
// ============================================================================
console.log("\n--- Suite 6: Solidaritätszuschlag Boundary Tests ---");

const solzTests = [
  // 2025 Single threshold €19,950
  { year: 2025, isJoint: false, thresh: 19950 },
  // 2025 Married splitting threshold €39,900
  { year: 2025, isJoint: true, thresh: 39900 },
  // 2026 Single threshold €20,350
  { year: 2026, isJoint: false, thresh: 20350 },
  // 2026 Married splitting threshold €40,700
  { year: 2026, isJoint: true, thresh: 40700 }
];

for (const st of solzTests) {
  totalScenariosExecuted += 5;
  const cfg = GERMAN_TAX_CONFIG.years[st.year];

  // At or below threshold: SolZ = 0
  const solzBelow = SalaryCalculator.calculateSolidaritySurcharge({
    annualIncomeTax: st.thresh - 1,
    isJointAssessment: st.isJoint,
    taxYear: st.year
  });
  const solzExact = SalaryCalculator.calculateSolidaritySurcharge({
    annualIncomeTax: st.thresh,
    isJointAssessment: st.isJoint,
    taxYear: st.year
  });
  assert.strictEqual(solzBelow, 0, `SolZ must be 0 below threshold (${st.thresh - 1}) for year ${st.year}`);
  assert.strictEqual(solzExact, 0, `SolZ must be 0 at exact threshold (${st.thresh}) for year ${st.year}`);

  // Transition zone: immediately above threshold, SolZ > 0 and gradual
  const solzAbove1 = SalaryCalculator.calculateSolidaritySurcharge({
    annualIncomeTax: st.thresh + 1,
    isJointAssessment: st.isJoint,
    taxYear: st.year
  });
  assert.ok(solzAbove1 > 0, `SolZ must be > 0 at threshold + 1`);
  assert.ok(solzAbove1 <= 0.12, `SolZ must start with small amount (11.9% of excess), got ${solzAbove1}`);

  // Transition zone middle: check 11.9% milderungszone
  const testMid = st.thresh + 1000;
  const solzMid = SalaryCalculator.calculateSolidaritySurcharge({
    annualIncomeTax: testMid,
    isJointAssessment: st.isJoint,
    taxYear: st.year
  });
  assert.strictEqual(Number(solzMid.toFixed(2)), 119.00, `SolZ Milderung mismatch at +1000 tax`);

  // High income zone: capped at exactly 5.5% of income tax
  const highTax = 500000;
  const solzHigh = SalaryCalculator.calculateSolidaritySurcharge({
    annualIncomeTax: highTax,
    isJointAssessment: st.isJoint,
    taxYear: st.year
  });
  assert.strictEqual(Number(solzHigh.toFixed(2)), Number((highTax * 0.055).toFixed(2)), `SolZ must be capped at 5.5%`);
}
console.log("[PASS] Solidaritätszuschlag statutory thresholds and 11.9% Milderungszone verified for 2025 and 2026.");


// ============================================================================
// SUITE 7: STATUTORY § 32a EStG TARIFF BOUNDARY TESTS (2025 & 2026)
// ============================================================================
console.log("\n--- Suite 7: Statutory § 32a EStG Tariff Boundaries ---");

const tariffBoundaries = [
  // 2025 boundaries: 12096, 17443, 68480, 277825
  { year: 2025, bounds: [12096, 17443, 68480, 277825] },
  // 2026 boundaries: 12348, 17799, 69878, 277825
  { year: 2026, bounds: [12348, 17799, 69878, 277825] }
];

for (const tb of tariffBoundaries) {
  const cfg = GERMAN_TAX_CONFIG.years[tb.year];
  for (const b of tb.bounds) {
    totalScenariosExecuted += 3;
    const tBelow = SalaryCalculator.calcStatutoryTariff(b - 1, cfg);
    const tExact = SalaryCalculator.calcStatutoryTariff(b, cfg);
    const tAbove = SalaryCalculator.calcStatutoryTariff(b + 1, cfg);

    assert.ok(tBelow >= 0, `Tax at ${b - 1} must be >= 0`);
    assert.ok(tExact >= 0, `Tax at ${b} must be >= 0`);
    assert.ok(tAbove >= 0, `Tax at ${b + 1} must be >= 0`);
    assert.ok(tExact >= tBelow, `Tax must be non-decreasing around ${b}`);
    assert.ok(tAbove >= tExact, `Tax must be non-decreasing around ${b}`);
    assert.ok(Number.isFinite(tBelow) && Number.isFinite(tExact) && Number.isFinite(tAbove));
  }
}
console.log("[PASS] § 32a EStG tariff boundaries verified for 2025 and 2026 without NaN, negative values, or drops.");


// ============================================================================
// SUITE 8: TAX CLASS RELATIONSHIP SANITY (CLASSES I TO VI)
// ============================================================================
console.log("\n--- Suite 8: Tax Class Relationship Sanity ---");

const grossTest = 5000;
const resultsByClass = {};

for (const tc of ["1", "2", "3", "4", "5", "6"]) {
  totalScenariosExecuted++;
  resultsByClass[tc] = SalaryCalculator.calculateNetSalary({
    grossMonthly: grossTest,
    taxClass: tc,
    taxYear: 2026,
    stateCode: "BE",
    numChildren: (tc === "2" ? 1 : 0)
  });
}

// 1. Social security contributions are invariant to tax class
for (const tc of ["2", "3", "4", "5", "6"]) {
  assert.strictEqual(
    resultsByClass[tc].rvMonthly,
    resultsByClass["1"].rvMonthly,
    `Pension contribution must not change between tax class 1 and ${tc}`
  );
  assert.strictEqual(
    resultsByClass[tc].avMonthly,
    resultsByClass["1"].avMonthly,
    `Unemployment contribution must not change between tax class 1 and ${tc}`
  );
  assert.strictEqual(
    resultsByClass[tc].gkvMonthly,
    resultsByClass["1"].gkvMonthly,
    `Health contribution must not change between tax class 1 and ${tc}`
  );
}

// 2. Class III net > Class I net (married splitting advantage)
assert.ok(resultsByClass["3"].netMonthly > resultsByClass["1"].netMonthly, "Class III net must be higher than Class I net");

// 3. Class II (1 child) net > Class I net (single-parent relief advantage)
assert.ok(resultsByClass["2"].netMonthly > resultsByClass["1"].netMonthly, "Class II net must be higher than Class I net for 1 child");

// 4. Class IV net equals Class I net (same basic tariff parameters)
assert.strictEqual(
  Number(resultsByClass["4"].netMonthly.toFixed(2)),
  Number(resultsByClass["1"].netMonthly.toFixed(2)),
  "Class IV net must equal Class I net for single childless employee"
);

// 5. Class V and VI net < Class I net (reduced/no allowances)
assert.ok(resultsByClass["5"].netMonthly < resultsByClass["1"].netMonthly, "Class V net must be lower than Class I net");
assert.ok(resultsByClass["6"].netMonthly < resultsByClass["1"].netMonthly, "Class VI net must be lower than Class I net");

console.log("[PASS] Tax class relationships verified (Social security invariant; Class III > Class II > Class I = Class IV > Class V, VI).");


// ============================================================================
// SUITE 9: TAX CLASS II / SINGLE-PARENT RELIEF (§ 24b EStG)
// ============================================================================
console.log("\n--- Suite 9: Tax Class II / Single-Parent Relief (§ 24b EStG) ---");

for (const yr of [2025, 2026]) {
  totalScenariosExecuted += 5;
  const relief0 = SalaryCalculator.calculateSingleParentRelief(0, yr);
  const relief1 = SalaryCalculator.calculateSingleParentRelief(1, yr);
  const relief2 = SalaryCalculator.calculateSingleParentRelief(2, yr);
  const relief3 = SalaryCalculator.calculateSingleParentRelief(3, yr);
  const relief4 = SalaryCalculator.calculateSingleParentRelief(4, yr);

  assert.strictEqual(relief0, 0, "0 children must yield €0 single-parent relief");
  assert.strictEqual(relief1, 4260, "1 child must yield €4,260 relief");
  assert.strictEqual(relief2, 4500, "2 children must yield €4,500 relief (+€240)");
  assert.strictEqual(relief3, 4740, "3 children must yield €4,740 relief (+€240)");
  assert.strictEqual(relief4, 4980, "4 children must yield €4,980 relief (+€240)");

  // Verify in full payroll calculation that 0 children in Class II yields exactly Class I tax base
  const calc0 = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxClass: "2", numChildren: 0, taxYear: yr });
  const calcClass1 = SalaryCalculator.calculateNetSalary({ grossMonthly: 4000, taxClass: "1", numChildren: 0, taxYear: yr });
  assert.strictEqual(
    calc0.estimatedTaxableIncome,
    calcClass1.estimatedTaxableIncome,
    "Class II with 0 children must not receive single-parent relief"
  );
}
console.log("[PASS] § 24b EStG single-parent relief verified (€0 for 0 kids, €4,260 1st kid, +€240/additional kid).");


// ============================================================================
// SUITE 10: GKV / PKV SANITY CHECKS
// ============================================================================
console.log("\n--- Suite 10: GKV / PKV Sanity Checks ---");

const gkvSalaries = [5000, 6000, 8000, 10000];
for (const s of gkvSalaries) {
  totalScenariosExecuted++;
  const res = SalaryCalculator.calculateNetSalary({ grossMonthly: s, healthType: "gkv", taxYear: 2026 });
  assert.ok(res.gkvMonthly <= 5812.50 * 0.0875, "GKV must not exceed statutory BBG cap");
}

// PKV verification: Gross salary does not determine PKV premium
totalScenariosExecuted += 2;
const pkvGross5k = SalaryCalculator.calculateNetSalary({
  grossMonthly: 5000,
  healthType: "pkv",
  pkvMonthlyPremium: 700,
  ppvMonthlyPremium: 90,
  hasEmployerSubsidy: true,
  taxYear: 2026
});
const pkvGross10k = SalaryCalculator.calculateNetSalary({
  grossMonthly: 10000,
  healthType: "pkv",
  pkvMonthlyPremium: 700,
  ppvMonthlyPremium: 90,
  hasEmployerSubsidy: true,
  taxYear: 2026
});
// The employee PKV cost is independent of gross salary
assert.strictEqual(pkvGross5k.pkvDetails.pkvEmployeeCost, pkvGross10k.pkvDetails.pkvEmployeeCost);
assert.strictEqual(pkvGross5k.pkvDetails.ppvEmployeeCost, pkvGross10k.pkvDetails.ppvEmployeeCost);
console.log("[PASS] GKV respects BBG ceiling, and PKV cost is user-input driven and independent of gross.");


// ============================================================================
// SUITE 11: REVERSE NET -> GROSS CONVERGENCE TESTS
// ============================================================================
console.log("\n--- Suite 11: Reverse Net -> Gross Calculator Convergence ---");

const targetNets = [2000, 3000, 4000, 5000, 6000, 7000];
for (const targetNet of targetNets) {
  totalScenariosExecuted++;
  const grossMonthly = SalaryCalculator.calculateNetToGross(targetNet, {
    taxClass: "1",
    stateCode: "BE",
    taxYear: 2026,
    healthType: "gkv"
  });

  assert.ok(grossMonthly > targetNet, "Gross must be greater than target net");
  assert.ok(Number.isFinite(grossMonthly), "Gross must be finite");

  // Forward verify resulting gross
  const fwd = SalaryCalculator.calculateNetSalary({
    grossMonthly,
    taxClass: "1",
    stateCode: "BE",
    taxYear: 2026,
    healthType: "gkv"
  });

  const diff = Math.abs(fwd.netMonthly - targetNet);
  assert.ok(diff < 1.50, `Reverse solver diff too large: ${diff} for target ${targetNet}`);
}
console.log("[PASS] Reverse Net -> Gross solver converged for targets €2k–€7k within integer-rounded tolerance.");


// ============================================================================
// SUITE 12: ANNUAL COMPENSATION CALCULATOR TESTS
// ============================================================================
console.log("\n--- Suite 12: Annual Compensation Calculator Tests ---");

// A: 12 months only
const compA = SalaryCalculator.calculateAnnualCompensation({ monthlyGross: 5000 });
assert.strictEqual(compA.baseAnnual, 60000);
assert.strictEqual(compA.totalComp, 60000);

// B: 12 months + 1 month fixed payment
const compB = SalaryCalculator.calculateAnnualCompensation({ monthlyGross: 5000, additionalMonthlyCount: 1 });
assert.strictEqual(compB.totalComp, 65000);

// C: 12 months + 0.5 month fixed payment
const compC = SalaryCalculator.calculateAnnualCompensation({ monthlyGross: 5000, additionalMonthlyCount: 0.5 });
assert.strictEqual(compC.totalComp, 62500);

// D: 12 months + 20% performance bonus
const compD = SalaryCalculator.calculateAnnualCompensation({ monthlyGross: 5000, performanceBonusPercent: 20 });
assert.strictEqual(compD.performanceBonusAmount, 12000);
assert.strictEqual(compD.totalComp, 72000);

// E: 12 months + €5,000 other annual payment
const compE = SalaryCalculator.calculateAnnualCompensation({ monthlyGross: 5000, fixedAnnualBonus: 5000 });
assert.strictEqual(compE.fixedAnnualAmount, 5000);
assert.strictEqual(compE.totalComp, 65000);

// F: Composite
const compF = SalaryCalculator.calculateAnnualCompensation({
  monthlyGross: 5000,
  additionalMonthlyCount: 1,
  performanceBonusPercent: 10,
  fixedAnnualBonus: 2000
});
assert.strictEqual(compF.totalComp, 73000);
assert.ok(compF.note.includes("are employer/contract dependent and are not statutory entitlements"));

totalScenariosExecuted += 6;
console.log("[PASS] Annual compensation combinations A through F mathematically verified with non-statutory disclaimer.");


// ============================================================================
// SUITE 13: KINDERGELD MULTI-YEAR QA (2021 TO 2030)
// ============================================================================
console.log("\n--- Suite 13: Kindergeld Multi-Year QA ---");

// 2021 & 2022 Tiered: 1: €219, 2: €438, 3: €663, 4: €913, 5: €1163
for (const yr of [2021, 2022]) {
  totalScenariosExecuted += 5;
  assert.strictEqual(FamilyTools.calculateKindergeld(1, yr).monthlyTotal, 219);
  assert.strictEqual(FamilyTools.calculateKindergeld(2, yr).monthlyTotal, 438);
  assert.strictEqual(FamilyTools.calculateKindergeld(3, yr).monthlyTotal, 663);
  assert.strictEqual(FamilyTools.calculateKindergeld(4, yr).monthlyTotal, 913);
  assert.strictEqual(FamilyTools.calculateKindergeld(5, yr).monthlyTotal, 1163);
}

// 2023 & 2024: €250 flat
totalScenariosExecuted += 2;
assert.strictEqual(FamilyTools.calculateKindergeld(2, 2023).monthlyTotal, 500);
assert.strictEqual(FamilyTools.calculateKindergeld(2, 2024).monthlyTotal, 500);

// 2025: €255 enacted
totalScenariosExecuted += 1;
assert.strictEqual(FamilyTools.calculateKindergeld(2, 2025).monthlyTotal, 510);
assert.strictEqual(FamilyTools.calculateKindergeld(2, 2025).isEnacted, true);

// 2026: €259 enacted
totalScenariosExecuted += 1;
assert.strictEqual(FamilyTools.calculateKindergeld(2, 2026).monthlyTotal, 518);
assert.strictEqual(FamilyTools.calculateKindergeld(2, 2026).isEnacted, true);

// 2027: €267 proposal
totalScenariosExecuted += 1;
const kg27 = FamilyTools.calculateKindergeld(2, 2027);
assert.strictEqual(kg27.ratePerChild, 267);
assert.strictEqual(kg27.monthlyTotal, 534);
assert.strictEqual(kg27.status, "government bill / announced proposal / not yet enacted");

// 2028: €272 proposal
totalScenariosExecuted += 1;
const kg28 = FamilyTools.calculateKindergeld(2, 2028);
assert.strictEqual(kg28.ratePerChild, 272);
assert.strictEqual(kg28.monthlyTotal, 544);
assert.strictEqual(kg28.status, "government bill / announced proposal / not yet enacted");

// Unsupported years: 2020, 2029, 2030
for (const unsupp of [2020, 2029, 2030]) {
  totalScenariosExecuted++;
  const un = FamilyTools.calculateKindergeld(1, unsupp);
  assert.strictEqual(un.unavailable, true);
  assert.strictEqual(un.error, "KINDERGELD_DATA_UNAVAILABLE");
}
console.log("[PASS] Kindergeld multi-year verified across 2021–2028, proposals separated, unsupported years rejected.");


// ============================================================================
// SUITE 14: KMK SCHOOL HOLIDAYS INTEGRITY (16 STATES X 5 SCHOOL YEARS)
// ============================================================================
console.log("\n--- Suite 14: KMK School Holidays Integrity ---");

const allStates = GERMAN_SCHOOL_HOLIDAYS.allStateCodes;
const schoolYears = ["2024/2025", "2025/2026", "2026/2027", "2027/2028", "2028/2029"];

for (const sy of schoolYears) {
  for (const st of allStates) {
    totalScenariosExecuted++;
    const periods = GERMAN_SCHOOL_HOLIDAYS.getSchoolHolidays(sy, st);
    assert.ok(Array.isArray(periods), `Periods must be an array for ${st} in ${sy}`);
    assert.ok(periods.length >= 3, `Must have at least 3 vacation periods for ${st} in ${sy}`);

    for (const p of periods) {
      assert.ok(p.start <= p.end, `Vacation period start must be <= end: ${p.nameEn} (${p.start} ~ ${p.end})`);
      assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(p.start), `Start date must be ISO format: ${p.start}`);
      assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(p.end), `End date must be ISO format: ${p.end}`);
    }
  }
}

// Check Bavaria 2025 summer holiday
const by25 = GERMAN_SCHOOL_HOLIDAYS.getSchoolHolidays("2024/2025", "BY");
const bySummer = by25.find(p => p.type === "summer");
assert.strictEqual(bySummer.start, "2025-08-04");
assert.strictEqual(bySummer.end, "2025-09-15");

console.log(`[PASS] KMK school holidays verified across all 16 states and 5 school years (${allStates.length * schoolYears.length} combinations).`);


// ============================================================================
// SUITE 15: PUBLIC HOLIDAYS & WORKING DAYS CONCEPT SEPARATION (2026)
// ============================================================================
console.log("\n--- Suite 15: Public Holidays & Working Days Concept Separation (2026) ---");

const holidayStates2026 = [
  { state: "BE", expectedWorkingDays: 254, expectedPub: 10, expectedWeekdayHol: 7 },
  { state: "BY", expectedWorkingDays: 252, expectedPub: 12, expectedWeekdayHol: 9 },
  { state: "SN", expectedWorkingDays: 253, expectedPub: 11, expectedWeekdayHol: 8 },
  { state: "NW", expectedWorkingDays: 253, expectedPub: 11, expectedWeekdayHol: 8 }
];

for (const hs of holidayStates2026) {
  totalScenariosExecuted++;
  const wd = CalendarTools.calculateWorkingDays(
    "2026-01-01",
    "2026-12-31",
    hs.state,
    true
  );

  assert.strictEqual(wd.calendarDays, 365);
  assert.strictEqual(wd.saturdayDays, 52);
  assert.strictEqual(wd.sundayDays, 52);
  assert.strictEqual(wd.weekendDays, 104);
  assert.strictEqual(wd.publicHolidayDays, hs.expectedPub);
  assert.strictEqual(wd.weekdayHolidayDays, hs.expectedWeekdayHol);
  assert.strictEqual(wd.workingDays, hs.expectedWorkingDays);

  // Invariant: calendarDays = workingDays + weekendDays + weekdayHolidayDays
  assert.strictEqual(
    wd.calendarDays,
    wd.workingDays + wd.weekendDays + wd.weekdayHolidayDays,
    `Days accounting mismatch for ${hs.state} in 2026`
  );
}
console.log("[PASS] 2026 Public holidays & working days verified: weekend holidays not double-deducted; day counts strictly consistent.");


// ============================================================================
// SUITE 16: RUNDFUNKBEITRAG STATUTORY DWELLING COVERAGE
// ============================================================================
console.log("\n--- Suite 16: Rundfunkbeitrag Statutory Dwelling Coverage ---");

totalScenariosExecuted += 3;
// Scenario 1: One person dwelling
const rent1 = RentCalculator.calculateRent({ kaltmiete: 1000, nebenkosten: 150, includeRundfunkbeitrag: true });
assert.strictEqual(rent1.rundfunkbeitrag, 18.36);
assert.strictEqual(rent1.rundfunkbeitragQuarterly, 55.08);
assert.strictEqual(rent1.rundfunkbeitragAnnual, 220.32);

// Scenario 2: Two people dwelling (still single fee of €18.36 for the dwelling)
const rent2 = RentCalculator.calculateRent({ kaltmiete: 1200, nebenkosten: 200, includeRundfunkbeitrag: true, occupants: 2 });
assert.strictEqual(rent2.rundfunkbeitrag, 18.36);

// Scenario 3: Family or roommate dwelling where partner already pays
const rentPartnerPays = RentCalculator.calculateRent({ kaltmiete: 1200, nebenkosten: 200, includeRundfunkbeitrag: false });
assert.strictEqual(rentPartnerPays.rundfunkbeitrag, 0);

console.log("[PASS] Rundfunkbeitrag verified (€18.36/mo per dwelling, not multiplied by number of occupants).");

console.log("\n================================================================");
console.log(`🎉 ALL ${totalScenariosExecuted} QA / SANITY SCENARIOS COMPLETED AND PASSED WITHOUT EXCEPTION!`);
console.log("================================================================\n");
