/**
 * German Salary & Tax Calculation Engine (Brutto → Netto, Netto → Brutto, Annual + Bonus)
 * Architecture: Year-Aware Engine with Statutory Estimation Model
 *
 * Supported Calendar Years: 2025, 2026 (Official Enacted)
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
   * Internal Tariff Estimator without Grundfreibetrag
   *
   * Estimation Note vs. Official BMF PAP:
   * This function provides a simplified progressive tariff approximation for Tax Class V
   * (where the basic tax allowance is transferred to the Class III spouse) and Tax Class VI
   * (where second and subsequent employment relationships are taxed without personal allowances).
   *
   * IMPORTANT: This is an estimation model, NOT the official BMF Programmablaufplan (PAP).
   * In official payroll, Class V uses a specialized progressive formula (subroutine MST5_6)
   * and Class VI uses specific withholding rules. Actual employer payroll withholding may differ.
   *
   * @param {number} income - Income base in Euro
   * @param {object} yearConfig - Year-specific tax configuration
   * @returns {number} Estimated annual tax amount in Euro
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
   * Official Statutory Pflegeversicherung (Long-Term Care Insurance) Employee Rate Scale
   * Implements exact statutory rates for 2026:
   * Outside Saxony:
   * - 0 children (childless): 2.40%
   * - 1 child: 1.80%
   * - 2 children: 1.55%
   * - 3 children: 1.30%
   * - 4 children: 1.05%
   * - 5+ children: 0.80%
   *
   * Saxony (SN): Add exactly 0.50 percentage points (+0.0050) to the employee share:
   * - 0 children: 2.90%
   * - 1 child: 2.30%
   * - 2 children: 2.05%
   * - 3 children: 1.80%
   * - 4 children: 1.55%
   * - 5+ children: 1.30%
   *
   * @param {object} params
   * @param {string} [params.stateCode] - Two-letter state code (e.g. "SN", "NW", "BE")
   * @param {number} [params.numberOfQualifyingChildren] - Qualifying children under age 25
   * @param {boolean} [params.isChildless] - Explicit childless flag
   * @returns {number} Statutory employee contribution rate (e.g. 0.024 for 2.40%)
   */
  getEmployeeCareInsuranceRate({ stateCode, numberOfQualifyingChildren, isChildless } = {}) {
    const isSaxony = (stateCode === "SN");
    const kids = Math.max(0, parseInt(numberOfQualifyingChildren || 0, 10));
    const childless = (typeof isChildless === 'boolean') ? isChildless : (kids === 0);

    let rate;
    if (childless || kids === 0) {
      rate = 0.0240;
    } else if (kids === 1) {
      rate = 0.0180;
    } else if (kids === 2) {
      rate = 0.0155;
    } else if (kids === 3) {
      rate = 0.0130;
    } else if (kids === 4) {
      rate = 0.0105;
    } else {
      // 5 or more qualifying children under age 25 (statutory rate floor reached)
      rate = 0.0080;
    }

    if (isSaxony) {
      // Saxony requires employee to pay +0.50 percentage points more of the statutory rate
      rate = Number((rate + 0.0050).toFixed(4));
    }

    return rate;
  },

  /**
   * Official Statutory Solidarity Surcharge (Solidaritätszuschlag - SolZ) Calculation for 2026
   * Statutory Basis: §§ 3, 4 SolZG (Solidaritätszuschlaggesetz 1995 as amended for 2026)
   *
   * 1. Freigrenze (§ 3 Abs. 3 SolZG 2026):
   *    - Single / non-splitting cases (Tax Classes I, II, IV, VI): €20,350 annual income tax liability
   *    - Joint splitting cases (Tax Class III / married filing jointly): €40,700 annual income tax liability
   *    If incomeTax <= threshold, SolZ = 0.
   *
   * 2. Milderungszone (§ 4 Satz 2 SolZG):
   *    To prevent an abrupt jump cliff, SolZ is capped at maximum 11.9% of the difference
   *    between the income tax liability and the statutory Freigrenze:
   *    milderungAmount = (incomeTax - threshold) * 0.119
   *
   * 3. Statutory Cap (§ 3 Abs. 1 SolZG):
   *    The surcharge cannot exceed standard 5.5% of the total income tax liability:
   *    fullAmount = incomeTax * 0.055
   *    solz = Math.min(fullAmount, milderungAmount)
   *
   * Upper transition boundary where 11.9% excess matches 5.5% of total tax:
   * - Single: €20,350 * (0.119 / 0.064) = €37,838.28
   * - Splitting: €40,700 * (0.119 / 0.064) = €75,676.56
   *
   * @param {number|object} paramsOrTax - Income tax liability in Euro, or params object
   * @param {boolean|string|number} [isSplittingOrClass] - Splitting flag or tax class (e.g. "3")
   * @param {object} [options] - Additional options (e.g. { raw: boolean, details: boolean })
   * @returns {number|object} Annual Solidarity Surcharge in Euro
   */
  calculateSolidaritySurcharge2026(paramsOrTax, isSplittingOrClass, options = {}) {
    let incomeTax = 0;
    let isSplitting = false;
    let opt = options;

    if (typeof paramsOrTax === 'object' && paramsOrTax !== null) {
      incomeTax = Number(paramsOrTax.incomeTax ?? paramsOrTax.taxLiability ?? paramsOrTax.incomeTaxAnnual ?? 0);
      isSplitting = Boolean(
        paramsOrTax.isSplitting ??
        (paramsOrTax.taxClass === '3' || paramsOrTax.taxClass === 3 || paramsOrTax.isMarried)
      );
      opt = paramsOrTax;
    } else {
      incomeTax = Number(paramsOrTax || 0);
      if (typeof isSplittingOrClass === 'boolean') {
        isSplitting = isSplittingOrClass;
      } else if (typeof isSplittingOrClass === 'string' || typeof isSplittingOrClass === 'number') {
        isSplitting = (String(isSplittingOrClass) === '3');
      } else if (typeof isSplittingOrClass === 'object' && isSplittingOrClass !== null) {
        opt = isSplittingOrClass;
        isSplitting = Boolean(opt.isSplitting ?? (opt.taxClass === '3' || opt.isMarried));
      }
    }

    // Official 2026 Statutory Parameters (§§ 3, 4 SolZG)
    const threshold = isSplitting ? 40700 : 20350;
    const standardRate = 0.055;
    const milderungRate = 0.119;

    // 1. Below or equal to exemption limit -> Completely exempt (0 €)
    if (incomeTax <= threshold) {
      if (opt && opt.details) {
        return {
          solz: 0,
          threshold,
          inTransitionZone: false,
          isExempt: true,
          isFullRate: false,
          excess: 0,
          milderungAmount: 0,
          fullAmount: Number((incomeTax * standardRate).toFixed(2))
        };
      }
      return 0;
    }

    // 2. Milderungszone: Maximum 11.9% of excess over Freigrenze
    const excess = incomeTax - threshold;
    const milderungAmount = excess * milderungRate;

    // 3. Statutory Cap: 5.5% of total income tax
    const fullAmount = incomeTax * standardRate;

    // 4. Statutory SolZ is the minimum of standard 5.5% and the milderung limit
    const rawSolz = Math.min(fullAmount, milderungAmount);
    const roundedSolz = Number(rawSolz.toFixed(2));

    if (opt && opt.details) {
      return {
        solz: roundedSolz,
        threshold,
        inTransitionZone: milderungAmount < fullAmount,
        isExempt: false,
        isFullRate: milderungAmount >= fullAmount,
        excess,
        milderungAmount: Number(milderungAmount.toFixed(2)),
        fullAmount: Number(fullAmount.toFixed(2))
      };
    }

    if (opt && (opt.raw === true || opt.round === false)) {
      return rawSolz;
    }

    return roundedSolz;
  },

  /**
   * Official Statutory Solidarity Surcharge (Solidaritätszuschlag - SolZ) Calculation for 2025
   * Statutory Basis: §§ 3, 4 SolZG (Solidaritätszuschlaggesetz 1995 as amended for 2025)
   *
   * @param {number|object} paramsOrTax - Income tax liability in Euro, or params object
   * @param {boolean|string|number} [isSplittingOrClass] - Splitting flag or tax class (e.g. "3")
   * @param {object} [options] - Additional options (e.g. { raw: boolean, details: boolean })
   * @returns {number|object} Annual Solidarity Surcharge in Euro
   */
  calculateSolidaritySurcharge2025(paramsOrTax, isSplittingOrClass, options = {}) {
    if (typeof GERMAN_TAX_CONFIG !== 'undefined' && GERMAN_TAX_CONFIG.calculateSolidaritySurcharge2025) {
      return GERMAN_TAX_CONFIG.calculateSolidaritySurcharge2025(paramsOrTax, isSplittingOrClass, options);
    }
    let incomeTax = 0;
    let isSplitting = false;
    let opt = options;

    if (typeof paramsOrTax === 'object' && paramsOrTax !== null) {
      incomeTax = Number(paramsOrTax.incomeTax ?? paramsOrTax.taxLiability ?? paramsOrTax.incomeTaxAnnual ?? 0);
      isSplitting = Boolean(
        paramsOrTax.isSplitting ??
        (paramsOrTax.taxClass === '3' || paramsOrTax.taxClass === 3 || paramsOrTax.isMarried)
      );
      opt = paramsOrTax;
    } else {
      incomeTax = Number(paramsOrTax || 0);
      if (typeof isSplittingOrClass === 'boolean') {
        isSplitting = isSplittingOrClass;
      } else if (typeof isSplittingOrClass === 'string' || typeof isSplittingOrClass === 'number') {
        isSplitting = (String(isSplittingOrClass) === '3');
      } else if (typeof isSplittingOrClass === 'object' && isSplittingOrClass !== null) {
        opt = isSplittingOrClass;
        isSplitting = Boolean(opt.isSplitting ?? (opt.taxClass === '3' || opt.isMarried));
      }
    }

    const threshold = isSplitting ? 39900 : 19950;
    const standardRate = 0.055;
    const milderungRate = 0.119;

    if (incomeTax <= threshold) {
      if (opt && opt.details) {
        return {
          solz: 0,
          threshold,
          inTransitionZone: false,
          isExempt: true,
          isFullRate: false,
          excess: 0,
          milderungAmount: 0,
          fullAmount: Number((incomeTax * standardRate).toFixed(2))
        };
      }
      return 0;
    }

    const excess = incomeTax - threshold;
    const milderungAmount = excess * milderungRate;
    const fullAmount = incomeTax * standardRate;
    const rawSolz = Math.min(fullAmount, milderungAmount);
    const roundedSolz = Number(rawSolz.toFixed(2));

    if (opt && opt.details) {
      return {
        solz: roundedSolz,
        threshold,
        inTransitionZone: milderungAmount < fullAmount,
        isExempt: false,
        isFullRate: milderungAmount >= fullAmount,
        excess,
        milderungAmount: Number(milderungAmount.toFixed(2)),
        fullAmount: Number(fullAmount.toFixed(2))
      };
    }

    if (opt && (opt.raw === true || opt.round === false)) {
      return rawSolz;
    }

    return roundedSolz;
  },

  /**
   * General Solidarity Surcharge Calculation for Supported Years (2025, 2026)
   *
   * @param {number|object} paramsOrTax - Income tax liability or parameter object
   * @param {boolean|string|number} [isSplittingOrClass] - Splitting flag or tax class
   * @param {object} [options] - Additional options ({ taxYear, year, raw, details })
   * @returns {number|object} Annual Solidarity Surcharge
   */
  calculateSolidaritySurcharge(paramsOrTax, isSplittingOrClass, options = {}) {
    let year = 2026;
    if (typeof paramsOrTax === 'object' && paramsOrTax !== null) {
      year = parseInt(paramsOrTax.taxYear ?? paramsOrTax.year ?? 2026, 10);
    } else if (typeof options === 'object' && options !== null) {
      year = parseInt(options.taxYear ?? options.year ?? 2026, 10);
    }
    if (year === 2025) {
      return this.calculateSolidaritySurcharge2025(paramsOrTax, isSplittingOrClass, options);
    }
    return this.calculateSolidaritySurcharge2026(paramsOrTax, isSplittingOrClass, options);
  },

  /**
   * Statutory Health Insurance (GKV) Rate Calculation for Supported Years
   * Statutory Basis: § 241, § 242, § 242a SGB V; BMG Bekanntmachung
   *
   * - General statutory rate: 14.6% (employee base share: 7.3%)
   * - Average Zusatzbeitrag: 2.5% in 2025 (employee share 1.25% -> 8.55% total)
   *                          2.9% in 2026 (employee share 1.45% -> 8.75% total)
   * - Optional custom kasseZusatzbeitrag: employee rate = 7.3% + (kasseZusatzbeitrag / 2)
   *
   * @param {object} [params]
   * @param {number|string} [params.kasseZusatzbeitrag] - Specific health fund additional rate (e.g. 2.5 or 0.025)
   * @param {number|string} [params.taxYear] - Tax year (2025 or 2026)
   * @returns {object} Health insurance calculation details
   */
  getEmployeeHealthInsuranceRate({ kasseZusatzbeitrag, taxYear, year } = {}) {
    const y = parseInt(taxYear ?? year ?? 2026, 10);
    const baseRate = 0.146;
    const employeeBaseRate = 0.073;
    const avgZusatzbeitrag = (y === 2025) ? 0.025 : 0.029;
    let effectiveZusatzbeitrag = avgZusatzbeitrag;
    let isCustom = false;

    if (kasseZusatzbeitrag !== undefined && kasseZusatzbeitrag !== null && String(kasseZusatzbeitrag).trim() !== '') {
      const parsed = typeof kasseZusatzbeitrag === 'number'
        ? kasseZusatzbeitrag
        : parseFloat(String(kasseZusatzbeitrag).replace(',', '.'));
      if (!isNaN(parsed) && parsed >= 0) {
        effectiveZusatzbeitrag = (parsed > 0.20) ? (parsed / 100) : parsed;
        isCustom = true;
      }
    }

    const employeeZusatzRate = Number((effectiveZusatzbeitrag / 2).toFixed(5));
    const totalEmployeeRate = Number((employeeBaseRate + employeeZusatzRate).toFixed(5));

    return {
      baseRate,
      employeeBaseRate,
      avgZusatzbeitrag,
      effectiveZusatzbeitrag,
      employeeZusatzRate,
      totalEmployeeRate,
      isCustom,
      note: y === 2025
        ? "Using the 2025 average Zusatzbeitrag of 2.5%"
        : "Using the 2026 average Zusatzbeitrag of 2.9%"
    };
  },

  /**
   * Private Health & Care Insurance (PKV & PPV) Cost & Subsidy Calculator
   *
   * Statutory & Contractual Principles:
   * 1. Private insurance premiums are contract-specific and cannot be reliably calculated from salary alone.
   * 2. Premiums depend on entry age, underwriting, chosen tariffs, and deductibles (not statutory gross salary).
   * 3. Employers pay a tax-free subsidy (§ 257 SGB V, § 61 SGB XI) up to 50% of the premium, capped at the statutory GKV/PV ceiling.
   *
   * @param {object} params
   * @param {number|string} [params.pkvMonthlyPremium=0] - Monthly PKV health insurance premium
   * @param {number|string} [params.ppvMonthlyPremium=0] - Monthly private Pflegepflichtversicherung premium
   * @param {boolean} [params.hasEmployerSubsidy=true] - Whether employer subsidy is included/applicable
   * @param {number|string} [params.employerSubsidy] - Explicit monthly employer subsidy (or auto 50% up to statutory cap)
   * @returns {object} PKV breakdown: { pkvMonthlyPremium, ppvMonthlyPremium, totalPremium, hasEmployerSubsidy, employerSubsidy, employeeCost, pkvEmployeeCost, ppvEmployeeCost, notice }
   */
  calculatePkvCost({
    pkvMonthlyPremium = 0,
    ppvMonthlyPremium = 0,
    hasEmployerSubsidy = true,
    employerSubsidy = null
  } = {}) {
    const pkvPremium = Math.max(0, GLTUtils.parseNumber(pkvMonthlyPremium, 0));
    const ppvPremium = Math.max(0, GLTUtils.parseNumber(ppvMonthlyPremium, 0));
    const totalPremium = pkvPremium + ppvPremium;
    const subsidyIncluded = (hasEmployerSubsidy !== false && String(hasEmployerSubsidy) !== 'false');

    let finalSubsidy = 0;
    if (subsidyIncluded) {
      if (employerSubsidy !== null && employerSubsidy !== undefined && String(employerSubsidy).trim() !== '') {
        finalSubsidy = Math.max(0, GLTUtils.parseNumber(employerSubsidy, 0));
      } else {
        // Statutory 50% rule under § 257 SGB V and § 61 SGB XI (2026 maximum: ~€613.22/mo)
        const maxStatutorySubsidy2026 = 613.22;
        finalSubsidy = Math.min(totalPremium / 2, maxStatutorySubsidy2026);
      }
    }

    // Employer subsidy cannot exceed the total premium
    finalSubsidy = Math.min(finalSubsidy, totalPremium);
    const employeeCost = Math.max(0, totalPremium - finalSubsidy);

    // Proportionate allocation of subsidy to PKV and PPV for line-item reporting
    const pkvShare = totalPremium > 0 ? (pkvPremium / totalPremium) : 1;
    const ppvShare = totalPremium > 0 ? (ppvPremium / totalPremium) : 0;
    const pkvSubsidy = finalSubsidy * pkvShare;
    const ppvSubsidy = finalSubsidy * ppvShare;
    const pkvEmployeeCost = Math.max(0, pkvPremium - pkvSubsidy);
    const ppvEmployeeCost = Math.max(0, ppvPremium - ppvSubsidy);

    return {
      pkvMonthlyPremium: Number(pkvPremium.toFixed(2)),
      ppvMonthlyPremium: Number(ppvPremium.toFixed(2)),
      totalPremium: Number(totalPremium.toFixed(2)),
      hasEmployerSubsidy: subsidyIncluded,
      employerSubsidy: Number(finalSubsidy.toFixed(2)),
      employeeCost: Number(employeeCost.toFixed(2)),
      pkvEmployeeCost: Number(pkvEmployeeCost.toFixed(2)),
      ppvEmployeeCost: Number(ppvEmployeeCost.toFixed(2)),
      notice: "Private insurance premiums are contract-specific and cannot be reliably calculated from salary alone."
    };
  },

  /**
   * Main Gross to Net Calculator
   * Computes social insurances, statutory taxable income, wage tax, SolZ, and church tax.
   *
   * @param {object} params
   * @param {number|string} params.grossMonthly - Monthly gross salary
   * @param {number|string} [params.taxYear=2026] - Tax year (2025, 2026)
   * @param {string} [params.taxClass="1"] - Steuerklasse (1, 2, 3, 4, 5, 6)
   * @param {string} [params.stateCode="BE"] - Bundesland 2-letter code (e.g. BE, BY, NW, SN)
   * @param {boolean} [params.hasChurchTax=false] - Whether subject to church tax
   * @param {number} [params.numChildren=0] - Number of eligible children under age 25
   * @param {string} [params.healthType="gkv"] - "gkv" (statutory) or "pkv" (private)
   * @param {number|string} [params.kasseZusatzbeitrag] - Specific health fund additional rate (e.g. 2.5)
   * @param {number|string} [params.pkvAmount=0] - Monthly PKV employee premium/cost
   * @param {number|string} [params.pkvTotalPremium] - Optional total PKV premium before employer subsidy
   * @param {number|string} [params.pkvEmployerSubsidy=0] - Optional monthly employer subsidy toward PKV
   */
  calculateNetSalary(params) {
    const grossMonthly = Math.max(0, GLTUtils.parseNumber(params.grossMonthly, 0));
    const grossAnnual = grossMonthly * 12;

    // Resolve active tax year & enforce supported enacted years
    const supportedYears = (typeof SUPPORTED_OFFICIAL_SALARY_YEARS !== 'undefined')
      ? SUPPORTED_OFFICIAL_SALARY_YEARS
      : (typeof GERMAN_TAX_CONFIG !== 'undefined' && GERMAN_TAX_CONFIG.supportedYears ? GERMAN_TAX_CONFIG.supportedYears : [2025, 2026]);

    const hasExplicitYear = (params.taxYear !== undefined && params.taxYear !== null && String(params.taxYear).trim() !== '');
    const requestedYear = hasExplicitYear
      ? parseInt(params.taxYear, 10)
      : (typeof GERMAN_TAX_CONFIG !== 'undefined' ? GERMAN_TAX_CONFIG.defaultYear : 2026);

    // Explicit rejection: Do NOT allow silent calculation of 2027 or unsupported years
    if (requestedYear === 2027 || !supportedYears.includes(requestedYear)) {
      const is2027 = (requestedYear === 2027);
      return {
        unavailable: true,
        error: "TAX_DATA_UNAVAILABLE",
        year: requestedYear,
        messageEn: is2027
          ? "Official statutory payroll parameters for 2027 are not legally finalized as of September 2026. The German federal government has introduced a tax reform draft, but final statutory § 32a EStG tax tariff coefficients and 2027 social-security contribution ceilings (Rechengrößen 2027) have not been enacted. Salary calculation for 2027 is unavailable."
          : `Official statutory payroll parameters for ${requestedYear} are unavailable. Supported official years: ${supportedYears.join(', ')}.`,
        messageKo: is2027
          ? "2026년 9월 현재 2027년도 공식 법정 급여 및 세무 파라미터는 아직 법률로 최종 확정되지 않았습니다. 독일 연방정부의 세제 개편 초안이 발표되었으나, 공식 소득세율(§ 32a EStG) 계수 및 2027년도 사회보험 부과상한선(Rechengrößen 2027)은 법정 입법 전이므로 2027년도 급여 계산을 제공하지 않습니다."
          : `${requestedYear}년도 공식 법정 세무 데이터가 지원되지 않습니다. 지원 연도: ${supportedYears.join(', ')}.`
      };
    }

    const cfg = GERMAN_TAX_CONFIG;
    const taxYear = requestedYear;
    const yCfg = cfg.years[taxYear];

    const taxClass = String(params.taxClass || "1");
    const stateCode = params.stateCode || "BE";
    const hasChurchTax = Boolean(params.hasChurchTax);
    const numChildren = Math.max(0, parseInt(params.numChildren ?? params.numberOfQualifyingChildren ?? 0, 10));
    const healthType = params.healthType || "gkv";

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

    // C. Health Insurance (Gesetzliche Krankenversicherung - GKV) vs PKV
    // 2026 Statutory Parameters (§ 241, § 242, § 242a SGB V; BMG Bekanntmachung):
    // - Contribution assessment ceiling (BBG): €5,812.50/month (€69,750/year)
    // - Compulsory insurance threshold (JAEG): €77,400/year (€6,450/mo)
    //   Gross <= JAEG: Mandatory GKV member (Pflichtversichert)
    //   Gross > JAEG: Voluntary GKV member (Freiwillig versichert)
    let gkvAssessmentMonthly = 0;
    let gkvMonthly = 0;
    let gkvEmployeeRate = 0;
    let healthRateDetails = null;
    let pkvDetails = null;
    const gkvMembershipStatus = (grossAnnual > yCfg.health.jaegAnnual) ? "voluntary" : "mandatory";

    if (healthType === "gkv") {
      gkvAssessmentMonthly = Math.min(grossMonthly, yCfg.health.bbgMonthly);
      healthRateDetails = this.getEmployeeHealthInsuranceRate({
        kasseZusatzbeitrag: params.kasseZusatzbeitrag,
        taxYear
      });
      gkvEmployeeRate = healthRateDetails.totalEmployeeRate;
      gkvMonthly = gkvAssessmentMonthly * gkvEmployeeRate;
    } else {
      // PKV & PPV Estimator Mode:
      // Private health insurance and private Pflegepflichtversicherung premiums are contract-specific
      // and cannot be reliably calculated from salary alone.
      // Gross salary has no bearing on private insurance rates.
      gkvAssessmentMonthly = 0;
      gkvEmployeeRate = 0;

      const hasExplicitPremium = (params.pkvMonthlyPremium !== undefined && params.pkvMonthlyPremium !== null) ||
                                 (params.pkvTotalPremium !== undefined && params.pkvTotalPremium !== null);

      if (!hasExplicitPremium && params.pkvAmount !== undefined && params.pkvAmount !== null) {
        // Legacy compatibility: pkvAmount was entered directly as employee out-of-pocket
        const directCost = Math.max(0, GLTUtils.parseNumber(params.pkvAmount, 0));
        pkvDetails = {
          pkvMonthlyPremium: directCost,
          ppvMonthlyPremium: 0,
          totalPremium: directCost,
          hasEmployerSubsidy: false,
          employerSubsidy: 0,
          employeeCost: directCost,
          pkvEmployeeCost: directCost,
          ppvEmployeeCost: 0,
          notice: "Private insurance premiums are contract-specific and cannot be reliably calculated from salary alone."
        };
      } else {
        pkvDetails = this.calculatePkvCost({
          pkvMonthlyPremium: params.pkvMonthlyPremium ?? params.pkvTotalPremium ?? 0,
          ppvMonthlyPremium: params.ppvMonthlyPremium ?? params.ppvAmount ?? 0,
          hasEmployerSubsidy: (params.hasEmployerSubsidy !== undefined) ? Boolean(params.hasEmployerSubsidy) : true,
          employerSubsidy: params.employerSubsidy ?? params.pkvEmployerSubsidy
        });
      }
      gkvMonthly = pkvDetails.pkvEmployeeCost;
    }
    const gkvAnnual = gkvMonthly * 12;

    // D. Long-Term Care Insurance (Soziale Pflegeversicherung - PV) vs Private PPV
    // Contribution assessment ceiling: €5,812.50/month in 2026 (€69,750/year)
    // PUEG Reform child-dependent rate scale:
    // - 0 children: Base employee rate + 0.6% childless surcharge (2.40% non-SN / 2.90% SN)
    // - 1 child: Base employee rate (1.80% non-SN / 2.30% SN)
    // - 2-5 children under 25: Graduated reduction of 0.25% per child from 2nd to 5th child
    // - 5+ children: Statutory rate floor (0.80% non-Saxony, 1.30% in Saxony)
    let pvAssessmentMonthly = 0;
    let pvEmployeeRate = 0;
    let pvMonthly = 0;
    if (healthType === "gkv") {
      pvAssessmentMonthly = Math.min(grossMonthly, yCfg.care.bbgMonthly);
      pvEmployeeRate = this.getEmployeeCareInsuranceRate({
        stateCode,
        numberOfQualifyingChildren: numChildren,
        isChildless: (numChildren === 0)
      });
      pvMonthly = pvAssessmentMonthly * pvEmployeeRate;
    } else {
      // Private Pflegepflichtversicherung (PPV): employee out-of-pocket cost
      pvAssessmentMonthly = 0;
      pvEmployeeRate = 0;
      pvMonthly = pkvDetails ? pkvDetails.ppvEmployeeCost : 0;
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

      // Statutory Vorsorgepauschale (§ 39b Abs. 2 Satz 5 Nr. 3 EStG)
      const deductibleRvAnnual = Math.min(grossAnnual, yCfg.pension.bbgAnnual) * yCfg.pension.employeeRate;
      let deductibleGkvAnnual = 0;
      let deductiblePvAnnual = 0;

      if (healthType === "gkv") {
        const gkvDeductibleRate = (gkvEmployeeRate > 0) ? (gkvEmployeeRate * 0.96) : (yCfg.health.totalEmployeeRate * 0.96);
        deductibleGkvAnnual = Math.min(grossAnnual, yCfg.health.bbgAnnual) * gkvDeductibleRate;
        deductiblePvAnnual = Math.min(grossAnnual, yCfg.care.bbgAnnual) * pvEmployeeRate;
      } else {
        // PKV / PPV: Do not use GKV statutory rates.
        // Basic coverage portion deductible under § 39b Abs. 2 Satz 5 Nr. 3 Buchst. d EStG:
        // Standard statutory payroll model: ~80% of PKV employee share constitutes basic coverage,
        // and 100% of PPV employee share constitutes basic mandatory care coverage.
        deductibleGkvAnnual = (pkvDetails ? pkvDetails.pkvEmployeeCost : gkvMonthly) * 12 * 0.80;
        deductiblePvAnnual = (pkvDetails ? pkvDetails.ppvEmployeeCost : pvMonthly) * 12;
      }
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
    // 3. ESTIMATED WAGE TAX (Estimated Lohnsteuer)
    // ========================================================================
    // Note on Lohnsteuer Methodology vs. Official BMF PAP 2026:
    // This calculator provides an estimation model based on § 32a EStG and the BMF
    // Lohnsteuer-Handbuch. In official employer payroll withholding, wage tax is computed
    // via the official BMF Programmablaufplan (PAP 2026) containing hundreds of procedural
    // steps, integer rounding, and specialized subroutines for Classes III, V, and VI.
    // The formulas below for Class III, V, and VI are estimation approximations:
    // - Class III: Approximates withholding using the splitting tariff on single earner zvE.
    //   (Note: Official BMF PAP uses specialized procedural steps; mandatory annual tax return
    //   reconciles actual joint liability on combined income under § 46 Abs. 2 Nr. 3a EStG).
    // - Class V: Approximates withholding without Grundfreibetrag and accelerated progression.
    //   (Note: Official BMF PAP uses subroutine MST5_6 rather than a simple bracket shift).
    // - Class VI: Approximates secondary employment taxation where second and subsequent
    //   employment relationships are taxed without basic personal allowances.
    // They are ESTIMATES and must NOT be described as exact statutory payroll results.
    let incomeTaxAnnual = 0;

    if (taxClass === "3") {
      // Class III (Splitting estimation approximation):
      incomeTaxAnnual = this.calcStatutoryTariff(approximateZvE / 2, yCfg) * 2;
    } else if (taxClass === "5") {
      // Class V (Progressive estimation approximation without basic allowance):
      incomeTaxAnnual = this.calcTariffWithoutGrundfreibetrag(approximateZvE, yCfg);
    } else if (taxClass === "6") {
      // Class VI (Secondary employment estimation approximation without personal allowances):
      incomeTaxAnnual = this.calcTariffWithoutGrundfreibetrag(grossAnnual, yCfg);
    } else {
      // Class I, II, IV (Standard statutory tariff estimation applied to estimated zvE):
      incomeTaxAnnual = this.calcStatutoryTariff(approximateZvE, yCfg);
    }

    const incomeTaxMonthly = Math.max(0, incomeTaxAnnual / 12);

    // ========================================================================
    // 4. SOLIDARITY SURCHARGE (Solidaritätszuschlag)
    // ========================================================================
    // Statutory rules under §§ 3, 4 SolZG:
    // 2026 Freigrenze: €20,350 (Single / non-splitting) / €40,700 (Splitting / Class III)
    // Milderungszone: max 11.9% of difference between income tax and Freigrenze
    // Capped at standard 5.5% of total income tax liability
    const isSplitting = (taxClass === "3");
    const solzThreshold = isSplitting ? yCfg.solz.thresholdMarried : yCfg.solz.thresholdSingle;
    let solzAnnual = 0;

    if (taxYear === 2026) {
      solzAnnual = this.calculateSolidaritySurcharge2026({
        incomeTax: incomeTaxAnnual,
        isSplitting
      });
    } else if (taxYear === 2025) {
      solzAnnual = this.calculateSolidaritySurcharge2025({
        incomeTax: incomeTaxAnnual,
        isSplitting
      });
    } else {
      if (incomeTaxAnnual > solzThreshold) {
        const excess = incomeTaxAnnual - solzThreshold;
        solzAnnual = Math.min(incomeTaxAnnual * yCfg.solz.rate, excess * yCfg.solz.milderungRate);
      }
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

      // Taxes & Estimated Lohnsteuer
      incomeTaxMonthly,
      incomeTaxAnnual,
      estimatedLohnsteuerMonthly: incomeTaxMonthly,
      estimatedLohnsteuerAnnual: incomeTaxAnnual,
      isEstimate: true,
      taxCalculationType: "Estimated Lohnsteuer",
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
      gkvEmployeeRate,
      gkvMembershipStatus,
      healthType,
      isCustomZusatzbeitrag: healthRateDetails ? healthRateDetails.isCustom : false,
      effectiveZusatzbeitrag: healthRateDetails ? healthRateDetails.effectiveZusatzbeitrag : null,
      usingAvgZusatzbeitragNote: healthRateDetails ? healthRateDetails.note : (taxYear === 2025 ? "Using the 2025 average Zusatzbeitrag of 2.5%" : "Using the 2026 average Zusatzbeitrag of 2.9%"),

      // Private Health & Care Insurance (PKV & PPV) Line Items
      pkvDetails: pkvDetails || (healthType === 'pkv' ? this.calculatePkvCost({
        pkvMonthlyPremium: params.pkvMonthlyPremium ?? params.pkvTotalPremium ?? params.pkvAmount,
        ppvMonthlyPremium: params.ppvMonthlyPremium ?? params.ppvAmount ?? 0,
        hasEmployerSubsidy: (params.hasEmployerSubsidy !== undefined) ? Boolean(params.hasEmployerSubsidy) : true,
        employerSubsidy: params.employerSubsidy ?? params.pkvEmployerSubsidy
      }) : null),
      pkvMonthlyPremium: pkvDetails ? pkvDetails.pkvMonthlyPremium : 0,
      ppvMonthlyPremium: pkvDetails ? pkvDetails.ppvMonthlyPremium : 0,
      pkvEmployerSubsidy: pkvDetails ? pkvDetails.employerSubsidy : 0,
      pkvEmployeeCost: pkvDetails ? pkvDetails.employeeCost : 0,
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
        gkvEmployeeRate,
        gkvMembershipStatus,
        effectiveZusatzbeitrag: healthRateDetails ? healthRateDetails.effectiveZusatzbeitrag : yCfg.health.avgZusatzbeitrag,
        usingAvgZusatzbeitragWording: healthRateDetails ? healthRateDetails.note : (taxYear === 2025 ? "Using the 2025 average Zusatzbeitrag of 2.5%" : "Using the 2026 average Zusatzbeitrag of 2.9%"),
        solzThreshold: solzThreshold,
        pkvNotice: "Private insurance premiums are contract-specific and cannot be reliably calculated from salary alone.",
        modelDescription: "Estimated Lohnsteuer model based on § 32a EStG and BMF Lohnsteuer principles (Approximating official BMF PAP 2026 payroll withholding)",
        disclaimerEn: "This is an estimate. Actual employer payroll withholding may differ.",
        disclaimerKo: "본 계산 결과는 추정치입니다. 실제 고용주의 급여 원천징수액은 다를 수 있습니다."
      }
    };
  },

  /**
   * Reverse calculation: Net to Gross (binary search solver)
   */
  calculateNetToGross(desiredNetMonthly, params) {
    const targetNet = Math.max(0, GLTUtils.parseNumber(desiredNetMonthly, 0));
    if (targetNet <= 0) return 0;

    // Verify statutory payroll parameters are available for requested year
    const checkRes = this.calculateNetSalary({ ...params, grossMonthly: 1000 });
    if (checkRes && checkRes.unavailable) {
      return checkRes;
    }

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
   * Annual compensation calculation with contract-specific additions
   * 
   * Note: Additional payments (e.g. additional monthly salaries, Urlaubsgeld, Weihnachtsgeld, performance bonus)
   * are employer/contract dependent and are not statutory entitlements under German labour law.
   * 
   * @param {Object|number} paramsOrMonthlyGross
   * @param {number} [bonusPct]
   * @param {number} [fixedBonusCount]
   * @param {number} [fixedAnnualBonus]
   */
  calculateAnnualCompensation(paramsOrMonthlyGross, bonusPct = 0, fixedBonusCount = 0, fixedAnnualBonus = 0) {
    let monthlyGross = 0;
    let performancePercent = 0;
    let additionalMonthlyCount = 0;
    let fixedAnnualAmount = 0;

    if (typeof paramsOrMonthlyGross === 'object' && paramsOrMonthlyGross !== null) {
      monthlyGross = GLTUtils.parseNumber(paramsOrMonthlyGross.monthlyGross || paramsOrMonthlyGross.baseMonthly, 0);
      performancePercent = GLTUtils.parseNumber(paramsOrMonthlyGross.performanceBonusPercent || paramsOrMonthlyGross.bonusPct, 0);
      additionalMonthlyCount = GLTUtils.parseNumber(paramsOrMonthlyGross.additionalMonthlyCount || paramsOrMonthlyGross.fixedBonusCount, 0);
      fixedAnnualAmount = GLTUtils.parseNumber(paramsOrMonthlyGross.fixedAnnualBonus || paramsOrMonthlyGross.otherAnnualAmount || paramsOrMonthlyGross.fixedBonusAmount, 0);
    } else {
      monthlyGross = GLTUtils.parseNumber(paramsOrMonthlyGross, 0);
      performancePercent = GLTUtils.parseNumber(bonusPct, 0);
      additionalMonthlyCount = GLTUtils.parseNumber(fixedBonusCount, 0);
      fixedAnnualAmount = GLTUtils.parseNumber(fixedAnnualBonus, 0);
    }

    const monthly = Math.max(0, monthlyGross);
    const bonusPercent = Math.max(0, performancePercent);
    const monthlyCount = Math.max(0, additionalMonthlyCount);
    const fixedBonus = Math.max(0, fixedAnnualAmount);

    const baseAnnual = monthly * 12;
    const additionalMonthlyAmount = monthly * monthlyCount;
    const performanceBonusAmount = baseAnnual * (bonusPercent / 100);
    const totalComp = baseAnnual + additionalMonthlyAmount + performanceBonusAmount + fixedBonus;
    const monthlyEquivalent = totalComp / 12;

    return {
      monthlyGross: monthly,
      baseAnnual,
      additionalMonthlyCount: monthlyCount,
      additionalMonthlyAmount,
      performanceBonusPercent: bonusPercent,
      performanceBonusAmount,
      fixedAnnualAmount: fixedBonus,
      totalComp,
      monthlyEquivalent,
      // Backward compatibility aliases
      bonusFixed: additionalMonthlyAmount,
      bonusPerformance: performanceBonusAmount,
      note: "Additional payments are employer/contract dependent and are not statutory entitlements."
    };
  }
};

// Global export for direct function calls
if (typeof globalThis !== 'undefined') {
  globalThis.calculateSolidaritySurcharge2026 = SalaryCalculator.calculateSolidaritySurcharge2026.bind(SalaryCalculator);
  globalThis.getEmployeeHealthInsuranceRate = SalaryCalculator.getEmployeeHealthInsuranceRate.bind(SalaryCalculator);
  globalThis.calculatePkvCost = SalaryCalculator.calculatePkvCost.bind(SalaryCalculator);
  globalThis.calculateAnnualCompensation = SalaryCalculator.calculateAnnualCompensation.bind(SalaryCalculator);
} else if (typeof window !== 'undefined') {
  window.calculateSolidaritySurcharge2026 = SalaryCalculator.calculateSolidaritySurcharge2026.bind(SalaryCalculator);
  window.getEmployeeHealthInsuranceRate = SalaryCalculator.getEmployeeHealthInsuranceRate.bind(SalaryCalculator);
  window.calculatePkvCost = SalaryCalculator.calculatePkvCost.bind(SalaryCalculator);
  window.calculateAnnualCompensation = SalaryCalculator.calculateAnnualCompensation.bind(SalaryCalculator);
}
