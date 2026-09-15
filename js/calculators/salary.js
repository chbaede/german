/**
 * German Salary & Tax Calculation Engine (Brutto → Netto, Netto → Brutto, Annual + Bonus)
 * Based on 2025/2026 German Social Security & Income Tax (EStG § 32a) parameters.
 */
const SalaryCalculator = {
  /**
   * Calculate German Net Salary from Gross
   */
  calculateNetSalary(params) {
    const grossMonthly = Math.max(0, GLTUtils.parseNumber(params.grossMonthly, 0));
    const grossAnnual = grossMonthly * 12;
    const taxClass = String(params.taxClass || "1");
    const stateCode = params.stateCode || "NW";
    const hasChurchTax = Boolean(params.hasChurchTax);
    const numChildren = Math.max(0, parseInt(params.numChildren || 0, 10));
    const healthType = params.healthType || "gkv"; // 'gkv' or 'pkv'
    const pkvAmount = healthType === "pkv" ? Math.max(0, GLTUtils.parseNumber(params.pkvAmount, 0)) : 0;

    const cfg = GERMAN_TAX_CONFIG;

    // 1. Social Insurances (Sozialabgaben) - Monthly
    // Pension (RV)
    const rvMonthly = Math.min(grossMonthly, cfg.pension.bbgWestMonthly) * cfg.pension.employeeRate;

    // Unemployment (AV)
    const avMonthly = Math.min(grossMonthly, cfg.unemployment.bbgMonthly) * cfg.unemployment.employeeRate;

    // Health Insurance (GKV)
    let gkvMonthly = 0;
    if (healthType === "gkv") {
      const gkvBase = Math.min(grossMonthly, cfg.health.bbgMonthly);
      // 7.3% base + 1.25% average additional contribution = 8.55%
      const totalEmployeeHealthRate = cfg.health.employeeBaseRate + cfg.health.employeeZusatzRate;
      gkvMonthly = gkvBase * totalEmployeeHealthRate;
    } else {
      gkvMonthly = pkvAmount;
    }

    // Long-Term Care Insurance (PV)
    let pvMonthly = 0;
    if (healthType === "gkv") {
      const pvBase = Math.min(grossMonthly, cfg.care.bbgMonthly);
      let employeePvRate = (stateCode === "SN") ? cfg.care.employeeBaseRateSachsen : cfg.care.employeeBaseRate;

      // Childless surcharge (+0.6%) if no children
      if (numChildren === 0) {
        employeePvRate += cfg.care.childlessSurcharge;
      } else if (numChildren >= 2) {
        // Child discount from 2nd to 5th child (-0.25% per child)
        const discountCount = Math.min(numChildren - 1, 4);
        employeePvRate -= discountCount * cfg.care.childDiscountPerChild;
      }
      pvMonthly = pvBase * Math.max(0.005, employeePvRate);
    }

    const totalSocialMonthly = rvMonthly + avMonthly + gkvMonthly + pvMonthly;
    const totalSocialAnnual = totalSocialMonthly * 12;

    // 2. Taxable Income (Zu versteuerndes Einkommen - zvE) Approximation
    // Deductions: Basic pension & health expense allowances (Vorsorgeaufwand ~85% of social) + standard worker lump sum (€1,230 Werbungskosten)
    const werbungskosten = 1230;
    const deductibleSocialAnnual = totalSocialAnnual * 0.88; // Approximate Vorsorge allowance
    let approximateZvE = Math.max(0, grossAnnual - werbungskosten - deductibleSocialAnnual);

    // Single parent relief (Entlastungsbetrag) for Tax Class II
    if (taxClass === "2") {
      approximateZvE = Math.max(0, approximateZvE - 4260);
    }

    // 3. German Income Tax Formula (EStG § 32a) - Annual Tariff 2025
    let incomeTaxAnnual = 0;

    // German Tariff Function for Single (Grundtarif)
    function calcGrundtarif(zve) {
      if (zve <= 12096) {
        return 0;
      } else if (zve <= 17005) {
        const y = (zve - 12096) / 10000;
        return (995.21 * y + 1400) * y;
      } else if (zve <= 66760) {
        const z = (zve - 17005) / 10000;
        return (208.85 * z + 2397) * z + 1015.51;
      } else if (zve <= 277825) {
        return 0.42 * zve - 10636.31;
      } else {
        return 0.45 * zve - 18971.06;
      }
    }

    if (taxClass === "3") {
      // Class 3: Splitting formula advantage (half taxable income taxed at Grundtarif, then doubled)
      incomeTaxAnnual = calcGrundtarif(approximateZvE / 2) * 2;
    } else if (taxClass === "5") {
      // Class 5: Higher withholding (approximate inverted splitting)
      incomeTaxAnnual = calcGrundtarif(approximateZvE * 1.6) * 0.95;
    } else if (taxClass === "6") {
      // Class 6: Zero basic allowance, higher initial rate
      incomeTaxAnnual = calcGrundtarif(approximateZvE + 12096);
    } else {
      // Class 1, 2, 4
      incomeTaxAnnual = calcGrundtarif(approximateZvE);
    }

    const incomeTaxMonthly = Math.max(0, incomeTaxAnnual / 12);

    // 4. Solidarity Surcharge (Solidaritätszuschlag)
    let solzAnnual = 0;
    const solzThreshold = (taxClass === "3") ? cfg.solzThresholdMarried : cfg.solzThresholdSingle;
    if (incomeTaxAnnual > solzThreshold) {
      // Transition zone (Milderungszone) formula: max 11.9% of excess over threshold, capped at 5.5% of total tax
      const excess = incomeTaxAnnual - solzThreshold;
      solzAnnual = Math.min(incomeTaxAnnual * cfg.solzRate, excess * 0.119);
    }
    const solzMonthly = solzAnnual / 12;

    // 5. Church Tax (Kirchensteuer)
    let churchTaxAnnual = 0;
    if (hasChurchTax && incomeTaxAnnual > 0) {
      const churchRate = (stateCode === "BY" || stateCode === "BW") ? cfg.churchTaxRates.BY : cfg.churchTaxRates.DEFAULT;
      churchTaxAnnual = incomeTaxAnnual * churchRate;
    }
    const churchTaxMonthly = churchTaxAnnual / 12;

    // Totals
    const totalTaxesMonthly = incomeTaxMonthly + solzMonthly + churchTaxMonthly;
    const totalDeductionsMonthly = totalTaxesMonthly + totalSocialMonthly;
    const netMonthly = Math.max(0, grossMonthly - totalDeductionsMonthly);
    const netAnnual = netMonthly * 12;
    const effectiveDeductionRate = grossMonthly > 0 ? (totalDeductionsMonthly / grossMonthly) * 100 : 0;

    return {
      grossMonthly,
      grossAnnual,
      netMonthly,
      netAnnual,
      incomeTaxMonthly,
      incomeTaxAnnual,
      solzMonthly,
      solzAnnual,
      churchTaxMonthly,
      churchTaxAnnual,
      totalTaxesMonthly,
      rvMonthly,
      avMonthly,
      gkvMonthly,
      pvMonthly,
      totalSocialMonthly,
      totalDeductionsMonthly,
      effectiveDeductionRate
    };
  },

  /**
   * Reverse calculation: Net to Gross (binary search)
   */
  calculateNetToGross(desiredNetMonthly, params) {
    const targetNet = Math.max(0, GLTUtils.parseNumber(desiredNetMonthly, 0));
    if (targetNet <= 0) return 0;

    let low = targetNet;
    let high = targetNet * 3.5;
    let iterations = 0;
    let bestGross = targetNet;

    while (low <= high && iterations < 35) {
      iterations++;
      const mid = (low + high) / 2;
      const res = this.calculateNetSalary({ ...params, grossMonthly: mid });

      if (Math.abs(res.netMonthly - targetNet) < 0.5) {
        bestGross = mid;
        break;
      }
      if (res.netMonthly < targetNet) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
      bestGross = mid;
    }

    return Math.round(bestGross);
  },

  /**
   * Annual salary with bonuses
   */
  calculateAnnualCompensation(monthlyGross, bonusPct, fixedBonusCount) {
    const monthly = Math.max(0, GLTUtils.parseNumber(monthlyGross, 0));
    const bonusPercent = Math.max(0, GLTUtils.parseNumber(bonusPct, 0));
    const fixedCount = Math.max(0, GLTUtils.parseNumber(fixedBonusCount, 0));

    const baseAnnual = monthly * 12;
    const bonusFixed = monthly * fixedCount;
    const bonusPerformance = baseAnnual * (bonusPercent / 100);
    const totalComp = baseAnnual + bonusFixed + bonusPerformance;
    const monthlyEquivalent = totalComp / 12;

    return {
      baseAnnual,
      bonusFixed,
      bonusPerformance,
      totalComp,
      monthlyEquivalent
    };
  }
};

