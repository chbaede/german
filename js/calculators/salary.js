/**
 * German Salary & Tax Calculation Engine (Brutto → Netto, Netto → Brutto, Annual + Bonus)
 * Architecture: Year-Aware Engine with Statutory Estimation Model
 *
 * Supported Calendar Years: 2025, 2026, 2027
 * Default Tax Year: 2026
 *
 * Statutory Legal Bases:
 * - § 32a EStG (Einkommensteuertarif 2026 / BMF Lohnsteuer-Handbuch)
 * - § 39b EStG (Lohnsteuerabzug und Vorsorgepauschale)
 * - SGB VI (Gesetzliche Rentenversicherung - RV)
 * - SGB III (Arbeitslosenversicherung - AV)
 * - SGB V (Gesetzliche Krankenversicherung - GKV)
 * - SGB XI (Soziale Pflegeversicherung - PV / PUEG Reform)
 * - SolzG 1995 (Solidaritätszuschlaggesetz)
 */

const SalaryCalculator = {
  /**
   * Evaluates the statutory German Einkommensteuertarif (§ 32a EStG)
   * Calculates annual income tax for a given taxable income (zvE) based on year configuration.
   *
   * @param {number} zve - Taxable income (zu versteuerndes Einkommen) in Euro
   * @param {object} yearConfig - Year-specific tax configuration from GERMAN_TAX_CONFIG
   * @returns {number} Annual tax amount in Euro
   */
  calcStatutoryTariff(zve, yearConfig) {
    const x = Math.floor(Math.max(0, zve));
    const t = yearConfig.tariff;

    // Zone 1: Zero-tax zone (Grundfreibetrag)
    if (x <= t.zone1Limit) {
      return 0;
    }

    // Zone 2: First progressive zone
    if (x <= t.zone2Limit) {
      const y = (x - t.zone1Limit) / 10000;
      return Math.floor((t.zone2A * y + t.zone2B) * y);
    }

    // Zone 3: Second progressive zone
    if (x <= t.zone3Limit) {
      const z = (x - t.zone2Limit) / 10000;
      return Math.floor((t.zone3A * z + t.zone3B) * z + t.zone3C);
    }

    // Zone 4: Proportional zone (42% Spitzensteuersatz)
    if (x <= t.zone4Limit) {
      return Math.floor(t.zone4Rate * x - t.zone4Sub);
    }

    // Zone 5: Top tax bracket (45% Reichensteuer)
    return Math.floor(t.zone5Rate * x - t.zone5Sub);
  },

  /**
   * Evaluates the progressive tariff without the basic allowance (Grundfreibetrag = 0)
   * Used for Tax Class V (where basic allowance was transferred to Class III spouse)
   * and Tax Class VI (secondary employment taxed from the very first euro).
   *
   * @param {number} income - Income base in Euro
   * @param {object} yearConfig - Year-specific tax configuration
   * @returns {number} Annual tax amount in Euro
   */
  calcTariffWithoutGrundfreibetrag(income, yearConfig) {
    const x = Math.floor(Math.max(0, income));
    if (x <= 0) return 0;
    // Mathematically shifts income into the progressive curve directly above Grundfreibetrag
    // so taxation starts immediately at the entry progressive marginal rate (~14%)
    const shiftedX = x + yearConfig.basicAllowance;
    return this.calcStatutoryTariff(shiftedX, yearConfig);
  },

  /**
   * Main Gross to Net Calculator
   * Computes social insurances, statutory taxable income, wage tax, SolZ, and church tax.
   *
   * @param {object} params
   * @param {number|string} params.grossMonthly - Monthly gross salary
   * @param {number|string} [params.taxYear=2026] - Tax year (2025, 2026, 2027)
   * @param {string} [params.taxClass="1"] - Steuerklasse (1, 2, 3, 4, 5, 6)
   * @param {string} [params.stateCode="BE"] - Bundesland 2-letter code (e.g. BE, BY, NW, SN)
   * @param {boolean} [params.hasChurchTax=false] - Whether subject to church tax
   * @param {number} [params.numChildren=0] - Number of eligible children under age 25
   * @param {string} [params.healthType="gkv"] - "gkv" (statutory) or "pkv" (private)
   * @param {number} [params.pkvAmount=0] - Monthly PKV premium if healthType is "pkv"
   */
  calculateNetSalary(params) {
    const grossMonthly = Math.max(0, GLTUtils.parseNumber(params.grossMonthly, 0));
    const grossAnnual = grossMonthly * 12;

    // Resolve active tax year configuration
    const cfg = GERMAN_TAX_CONFIG;
    const requestedYear = parseInt(params.taxYear || cfg.defaultYear, 10);
    const taxYear = cfg.years[requestedYear] ? requestedYear : cfg.defaultYear;
    const yCfg = cfg.years[taxYear];

    const taxClass = String(params.taxClass || "1");
    const stateCode = params.stateCode || "BE";
    const hasChurchTax = Boolean(params.hasChurchTax);
    const numChildren = Math.max(0, parseInt(params.numChildren || 0, 10));
    const healthType = params.healthType || "gkv";
    const pkvAmount = healthType === "pkv" ? Math.max(0, GLTUtils.parseNumber(params.pkvAmount, 0)) : 0;

    // ========================================================================
    // 1. STATUTORY SOCIAL INSURANCE (Sozialversicherungsbeiträge)
    // ========================================================================

    // A. Pension Insurance (Gesetzliche Rentenversicherung - RV)
    // Contribution assessment ceiling: €8,450/month in 2026 (€101,400/year)
    const rvAssessmentMonthly = Math.min(grossMonthly, yCfg.pension.bbgMonthly);
    const rvMonthly = rvAssessmentMonthly * yCfg.pension.employeeRate;
    const rvAnnual = rvMonthly * 12;

    // B. Unemployment Insurance (Arbeitslosenversicherung - AV)
    // Contribution assessment ceiling: €8,450/month in 2026 (€101,400/year)
    const avAssessmentMonthly = Math.min(grossMonthly, yCfg.unemployment.bbgMonthly);
    const avMonthly = avAssessmentMonthly * yCfg.unemployment.employeeRate;
    const avAnnual = avMonthly * 12;

    // C. Health Insurance (Gesetzliche Krankenversicherung - GKV)
    // Contribution assessment ceiling: €5,812.50/month in 2026 (€69,750/year)
    // Note: Compulsory threshold (JAEG) is €77,400/year (€6,450/mo), but contributions cap at BBG.
    let gkvAssessmentMonthly = 0;
    let gkvMonthly = 0;
    if (healthType === "gkv") {
      gkvAssessmentMonthly = Math.min(grossMonthly, yCfg.health.bbgMonthly);
      gkvMonthly = gkvAssessmentMonthly * yCfg.health.totalEmployeeRate;
    } else {
      gkvMonthly = pkvAmount;
      gkvAssessmentMonthly = 0;
    }
    const gkvAnnual = gkvMonthly * 12;

    // D. Long-Term Care Insurance (Soziale Pflegeversicherung - PV)
    // Contribution assessment ceiling: €5,812.50/month in 2026 (€69,750/year)
    // PUEG Reform child-dependent rate scale:
    // - 0 children: Base employee rate + 0.6% childless surcharge
    // - 1 child: Base employee rate (surcharge eliminated for life)
    // - 2-5 children under 25: Graduated reduction of 0.25% per child from 2nd to 5th child
    // - 5+ children: Statutory rate floor (0.80% non-Saxony, 1.30% in Saxony)
    let pvAssessmentMonthly = 0;
    let pvEmployeeRate = 0;
    let pvMonthly = 0;
    if (healthType === "gkv") {
      pvAssessmentMonthly = Math.min(grossMonthly, yCfg.care.bbgMonthly);
      const isSaxony = (stateCode === "SN");
      const baseEmployeeRate = isSaxony ? yCfg.care.employeeBaseRateSachsen : yCfg.care.employeeBaseRate;

      if (numChildren === 0) {
        pvEmployeeRate = baseEmployeeRate + yCfg.care.childlessSurcharge;
      } else if (numChildren === 1) {
        pvEmployeeRate = baseEmployeeRate;
      } else {
        const discountCount = Math.min(numChildren - 1, 4); // max 4 child discounts (from 2nd to 5th)
        const discount = discountCount * yCfg.care.childDiscountPerChild;
        const minFloor = isSaxony ? yCfg.care.minEmployeeRateSachsen : yCfg.care.minEmployeeRate;
        pvEmployeeRate = Math.max(minFloor, baseEmployeeRate - discount);
      }
      pvMonthly = pvAssessmentMonthly * pvEmployeeRate;
    }
    const pvAnnual = pvMonthly * 12;

    const totalSocialMonthly = rvMonthly + avMonthly + gkvMonthly + pvMonthly;
    const totalSocialAnnual = totalSocialMonthly * 12;

    // ========================================================================
    // 2. STATUTORY TAXABLE INCOME (Zu versteuerndes Einkommen - zvE)
    // ========================================================================
    // Computed in accordance with § 39b EStG (Lohnsteuer-Berechnungsgrundlagen):
    // Deductions from annual gross:
    // - Arbeitnehmer-Pauschbetrag (§ 9a EStG): €1,230/yr (Classes I–V; €0 for VI)
    // - Sonderausgaben-Pauschbetrag (§ 10c EStG): €36/yr (Classes I, II, IV, V; €72 for III; €0 for VI)
    // - Vorsorgepauschale (§ 39b Abs. 2 Satz 5 Nr. 3 EStG):
    //   a) 100% Pension contribution (capped at RV BBG)
    //   b) Health insurance basic coverage (8.75% * 0.96 = 8.40% capped at GKV BBG)
    //   c) Long-term care basic coverage (capped at PV BBG)
    // - Entlastungsbetrag für Alleinerziehende (§ 24b EStG for Class II): €4,260 1st child + €852/add'l child
    let werbungskosten = 0;
    let sonderausgaben = 0;
    let singleParentRelief = 0;
    let annualVorsorge = 0;

    if (taxClass !== "6") {
      werbungskosten = yCfg.lumpSums.werbungskosten;
      sonderausgaben = (taxClass === "3") ? yCfg.lumpSums.sonderausgabenMarried : yCfg.lumpSums.sonderausgabenSingle;

      // Statutory Vorsorgepauschale
      const deductibleRvAnnual = Math.min(grossAnnual, yCfg.pension.bbgAnnual) * yCfg.pension.employeeRate;
      const deductibleGkvAnnual = Math.min(grossAnnual, yCfg.health.bbgAnnual) * (yCfg.health.totalEmployeeRate * 0.96);
      const deductiblePvAnnual = Math.min(grossAnnual, yCfg.care.bbgAnnual) * pvEmployeeRate;
      annualVorsorge = deductibleRvAnnual + deductibleGkvAnnual + deductiblePvAnnual;

      if (taxClass === "2") {
        singleParentRelief = yCfg.lumpSums.singleParentRelief;
        if (numChildren > 1) {
          singleParentRelief += (numChildren - 1) * yCfg.lumpSums.singleParentAdditionalChild;
        }
      }
    }

    const totalStatutoryDeductions = werbungskosten + sonderausgaben + singleParentRelief + annualVorsorge;
    const approximateZvE = Math.max(0, grossAnnual - totalStatutoryDeductions);

    // ========================================================================
    // 3. WAGE TAX (Lohnsteuer) COMPUTATION
    // ========================================================================
    let incomeTaxAnnual = 0;

    if (taxClass === "3") {
      // Class III (Splitting method):
      // In accordance with § 39b Abs. 2 Satz 5 EStG, tax on half zvE doubled
      incomeTaxAnnual = this.calcStatutoryTariff(approximateZvE / 2, yCfg) * 2;
    } else if (taxClass === "5") {
      // Class V (Partner in Class III):
      // Basic tax allowance is transferred to Class III spouse. Class V has Grundfreibetrag = 0.
      incomeTaxAnnual = this.calcTariffWithoutGrundfreibetrag(approximateZvE, yCfg);
    } else if (taxClass === "6") {
      // Class VI (Secondary employment):
      // Zero basic allowance, no lump sums, taxed from the very first euro earned.
      incomeTaxAnnual = this.calcTariffWithoutGrundfreibetrag(grossAnnual, yCfg);
    } else {
      // Class I, II, IV:
      // Standard individual tariff applied to zvE
      incomeTaxAnnual = this.calcStatutoryTariff(approximateZvE, yCfg);
    }

    const incomeTaxMonthly = Math.max(0, incomeTaxAnnual / 12);

    // ========================================================================
    // 4. SOLIDARITY SURCHARGE (Solidaritätszuschlag)
    // ========================================================================
    // 2026 Exemption threshold: €19,950 tax liability (Single) / €39,900 (Married Class III)
    // Milderungszone: 11.9% of excess over threshold, capped at 5.5% of total income tax.
    let solzAnnual = 0;
    const solzThreshold = (taxClass === "3") ? yCfg.solz.thresholdMarried : yCfg.solz.thresholdSingle;

    if (incomeTaxAnnual > solzThreshold) {
      const excess = incomeTaxAnnual - solzThreshold;
      solzAnnual = Math.min(incomeTaxAnnual * yCfg.solz.rate, excess * yCfg.solz.milderungRate);
    }
    const solzMonthly = solzAnnual / 12;

    // ========================================================================
    // 5. CHURCH TAX (Kirchensteuer)
    // ========================================================================
    // 8% in Bayern (BY) and Baden-Württemberg (BW); 9% in all other 14 states (including Berlin).
    let churchTaxAnnual = 0;
    if (hasChurchTax && incomeTaxAnnual > 0) {
      const churchRate = (stateCode === "BY" || stateCode === "BW")
        ? cfg.churchTaxRates.BY
        : cfg.churchTaxRates.DEFAULT;
      churchTaxAnnual = incomeTaxAnnual * churchRate;
    }
    const churchTaxMonthly = churchTaxAnnual / 12;

    // ========================================================================
    // 6. TOTALS & AGGREGATIONS
    // ========================================================================
    const totalTaxesMonthly = incomeTaxMonthly + solzMonthly + churchTaxMonthly;
    const totalTaxesAnnual = totalTaxesMonthly * 12;
    const totalDeductionsMonthly = totalTaxesMonthly + totalSocialMonthly;
    const totalDeductionsAnnual = totalDeductionsMonthly * 12;
    const netMonthly = Math.max(0, grossMonthly - totalDeductionsMonthly);
    const netAnnual = netMonthly * 12;
    const effectiveDeductionRate = grossMonthly > 0 ? (totalDeductionsMonthly / grossMonthly) * 100 : 0;

    return {
      // Primary Output Parameters
      taxYear,
      grossMonthly,
      grossAnnual,
      netMonthly,
      netAnnual,

      // Taxes
      incomeTaxMonthly,
      incomeTaxAnnual,
      solzMonthly,
      solzAnnual,
      churchTaxMonthly,
      churchTaxAnnual,
      totalTaxesMonthly,
      totalTaxesAnnual,

      // Social Insurances
      rvMonthly,
      rvAnnual,
      avMonthly,
      avAnnual,
      gkvMonthly,
      gkvAnnual,
      pvMonthly,
      pvAnnual,
      pvEmployeeRate,
      totalSocialMonthly,
      totalSocialAnnual,

      // Totals
      totalDeductionsMonthly,
      totalDeductionsAnnual,
      effectiveDeductionRate,

      // Calculation Internals & Transparency
      zvE: approximateZvE,
      annualVorsorge,
      rvAssessmentMonthly,
      gkvAssessmentMonthly,
      pvAssessmentMonthly,

      // Metadata & Disclaimers
      parameters: {
        basicAllowance: yCfg.basicAllowance,
        rvBbgMonthly: yCfg.pension.bbgMonthly,
        gkvBbgMonthly: yCfg.health.bbgMonthly,
        jaegMonthly: yCfg.health.jaegMonthly,
        gkvEmployeeRate: yCfg.health.totalEmployeeRate,
        solzThreshold: solzThreshold,
        modelDescription: "Statutory estimation model based on BMF Lohnsteuer-Handbuch and § 32a EStG",
        disclaimerEn: "Estimated result. Actual payroll withholding may differ based on individual health insurance additional contribution and employer parameters.",
        disclaimerKo: "추정 계산 결과입니다. 실제 급여 명세서 원천징수액은 가입 건강보험사 추가보험료 및 사업장 설정에 따라 약간의 차이가 있을 수 있습니다."
      }
    };
  },

  /**
   * Reverse calculation: Net to Gross (binary search solver)
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
   * Annual salary with bonuses calculation
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
