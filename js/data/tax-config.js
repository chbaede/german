/**
 * German Tax & Social Security Configuration Parameters
 * Architecture: Year-Aware Multi-Year Configuration System (Official Enacted: 2025, 2026)
 * Default Tax Year: 2026
 * Last Updated: 2026-09-16
 *
 * Official Legal Sources:
 * 1. BMF (Bundesfinanzministerium): Lohnsteuer-Handbuch 2026 / § 32a EStG (Einkommensteuertarif)
 * 2. BMG (Bundesministerium für Gesundheit): Sozialversicherungs-Rechengrößen-Verordnung 2026
 * 3. BMAS (Bundesministerium für Arbeit und Soziales): Rechengrößen der Sozialversicherung 2026
 * 4. Deutsche Rentenversicherung: Beitragssätze und Beitragsbemessungsgrenzen 2026
 */

const SUPPORTED_OFFICIAL_SALARY_YEARS = [2025, 2026];

/**
 * Separate Reform Proposals & Draft Values (Not Enacted / Not Statutory Payroll Parameters)
 */
const GERMAN_TAX_REFORM_PROPOSALS = {
  "2027": {
    year: 2027,
    status: "draft_proposed",
    statusLabelEn: "Government bill / Regierungsentwurf (not enacted into statutory law)",
    statusLabelKo: "정부 입법안 / Regierungsentwurf (법정 입법 미확정)",
    officialStatus: "government bill / Regierungsentwurf / not enacted",
    reformAct: "Einkommensteuerreformgesetz 2027",
    cabinetApprovalDate: "2026-09-02",
    officialStatusDisclaimerEn: "Values are from the German government's draft bill 'Einkommensteuerreformgesetz 2027' (Cabinet approval 2026-09-02) and have not been finalized or enacted into statutory law as of September 2026. They must NOT be presented or used as official statutory payroll parameters.",
    officialStatusDisclaimerKo: "본 수치는 2026년 9월 2일 독일 연방내각이 의결한 '소득세 개혁법 2027(Einkommensteuerreformgesetz 2027)' 정부안 기준이며, 의회 법정 입법으로 최종 확정 공포되지 않았습니다. 공식 법정 급여/세무 파라미터로 사용될 수 없습니다.",
    source: "Regierungsentwurf Einkommensteuerreformgesetz 2027 (Kabinettbeschluss vom 02.09.2026)",
    sourceUrl: "https://www.bundesfinanzministerium.de/",
    lastVerified: "2026-09-16",
    draftTariff: {
      proposedBasicAllowance: 12564,
      proposedArbeitnehmerPauschbetrag: 1430,
      proposedProgressionLimit: 70600,
      proposedKindergeldMonthly: 267,
      note: "Draft income tax tariff parameters under the Einkommensteuerreformgesetz 2027 (progression curve up to ~€70,600). Subject to Bundestag/Bundesrat parliamentary approval."
    },
    draftSocialSecurity: {
      status: "not_yet_official",
      note: "2027 social-insurance contribution ceilings are not yet officially enacted."
    }
  },
  "2028": {
    year: 2028,
    status: "draft_proposed",
    statusLabelEn: "Government bill / Regierungsentwurf (not enacted into statutory law)",
    statusLabelKo: "정부 입법안 / Regierungsentwurf (법정 입법 미확정)",
    officialStatus: "government bill / Regierungsentwurf / not enacted",
    reformAct: "Einkommensteuerreformgesetz 2027 (Stufe 2028)",
    cabinetApprovalDate: "2026-09-02",
    officialStatusDisclaimerEn: "Values are from the German government's draft bill for the 2028 tier and have not been enacted into statutory law. They must NOT be presented or used as official statutory payroll parameters.",
    officialStatusDisclaimerKo: "본 수치는 2028년 단계 정부 입법 개혁안 초안 기준이며, 의회 법정 입법으로 최종 확정 공포되지 않았습니다. 공식 법정 파라미터로 사용될 수 없습니다.",
    source: "Regierungsentwurf Einkommensteuerreformgesetz 2027 (Stufe 2028)",
    sourceUrl: "https://www.bundesfinanzministerium.de/",
    lastVerified: "2026-09-16",
    draftTariff: {
      proposedBasicAllowance: 12900,
      proposedKindergeldMonthly: 272,
      note: "Proposed 2028 Grundfreibetrag (€12,900) and Kindergeld (€272) under government draft."
    },
    draftSocialSecurity: {
      status: "not_yet_official",
      note: "2028 social-insurance contribution ceilings are not yet officially enacted."
    }
  }
};

const GERMAN_TAX_CONFIG = {
  lastUpdated: "2026-09-16",
  defaultYear: 2026,
  supportedYears: SUPPORTED_OFFICIAL_SALARY_YEARS,
  reformProposals: GERMAN_TAX_REFORM_PROPOSALS,

  officialSources: [
    {
      institution: "Bundesministerium der Finanzen (BMF)",
      reference: "Programmablaufplan für die maschinelle Berechnung der vom Arbeitslohn einzubehaltenden Lohnsteuer, des Solidaritätszuschlags und der Maßstabsteuer für die Kirchenlohnsteuer für 2026 (BMF PAP 2026)",
      topicEn: "Official procedural flowchart (PAP) for employer wage tax (Lohnsteuer) withholding. Calculator provides an estimation model; actual employer payroll withholding may differ.",
      topicKo: "2026년도 법정 급여원천징수세(Lohnsteuer) 공식 기계계산 절차도(BMF PAP 2026). 본 계산기는 추정 모델을 제공하며, 실제 급여 원천징수세액은 사업장 급여 소프트웨어의 공식 BMF PAP 알고리즘에 의해 산출됩니다."
    },
    {
      institution: "Bundesministerium der Finanzen (BMF)",
      reference: "BMF Amtliches Einkommensteuer-Handbuch 2025 / § 32a EStG (Einkommensteuertarif 2025)",
      url: "https://esth.bundesfinanzministerium.de/lsth/2025/A-Einkommensteuergesetz/IV-Tarif-31-34b/Paragraf-32a/inhalt.html",
      topicEn: "Official statutory 2025 income tax tariff: basic allowance €12,096, zone 2 limit €17,443 (coefficients 932.30 / 1,400), zone 3 limit €68,480 (coefficients 176.64 / 2,397 / 1,015.13), zone 4 top rate 42% (subtraction 10,911.92), zone 5 45% (subtraction 19,246.67)",
      topicKo: "2025년 법정 소득세율표: 기본공제 12,096 €, 2구간 상한 17,443 €(계수 932.30 / 1,400), 3구간 상한 68,480 €(계수 176.64 / 2,397 / 1,015.13), 4구간 최고세율 42%(차감액 10,911.92), 5구간 부유세 45%(차감액 19,246.67)"
    },
    {
      institution: "Bundesfinanzministerium (BMF)",
      reference: "BMF Lohnsteuer-Handbuch 2026 / § 32a EStG",
      topicEn: "Income tax brackets, basic allowance (€12,348), progressive tariff zones",
      topicKo: "소득세 누진세율표, 기본공제(12,348 €), 누진세율 구간"
    },
    {
      institution: "Bundesfinanzministerium (BMF) / Gesetzgeber",
      reference: "§ 24b EStG (Entlastungsbetrag für Alleinerziehende)",
      url: "https://www.gesetze-im-internet.de/estg/__24b.html",
      tableUrl: "https://usth.bundesfinanzministerium.de/lsth/2026/tabellarische-Uebersicht/24b.html",
      topicEn: "Single parent tax relief (Entlastungsbetrag für Alleinerziehende): €4,260 for the first child, plus €240 for each additional child (§ 24b Abs. 2 EStG).",
      topicKo: "한부모 특별 소득공제(Entlastungsbetrag für Alleinerziehende, 2세무등급): 첫째 자녀 연간 4,260 €, 추가 자녀 1인당 240 € (§ 24b Abs. 2 EStG)."
    },
    {
      institution: "Bundesfinanzministerium (BMF) / Gesetzgeber",
      reference: "Solidaritätszuschlaggesetz (SolZG 1995) §§ 3, 4 (Stand 2026)",
      topicEn: "SolZ Freigrenzen 2026: Single/Class I, II, IV, VI €20,350; Married Splitting/Class III €40,700; Milderungszone 11.9%; 5.5% cap",
      topicKo: "2026년 연대특별세(통일세) 면제한도: 1인 20,350 € / 부부합산 40,700 €; 완충구간(Milderungszone) 11.9%; 최고 5.5% 상한"
    },
    {
      institution: "Bundesministerium für Gesundheit (BMG)",
      reference: "Bekanntmachung des durchschnittlichen Zusatzbeitragssatzes in der GKV 2026 (§ 242a Abs. 2 SGB V) & Sozialversicherungs-Rechengrößen-Verordnung 2026",
      topicEn: "Using the 2026 average Zusatzbeitrag of 2.9% (individual Krankenkassen vary); General health insurance rate 14.6% (7.3% employee share + 1.45% avg Zusatz = 8.75% total employee); GKV BBG €5,812.50/mo; JAEG €77,400/yr",
      topicKo: "2026년 법정 평균 추가보험료(Zusatzbeitrag) 2.9% 고시 (§ 242a SGB V, 개별 공보험사별 상이); 일반 건강보험료율 14.6% (근로자 7.3% + 평균 추가분 1.45% = 총 8.75%); 부과상한선(BBG) 5,812.50 €/월; 가입의무상한선(JAEG) 77,400 €/년"
    },
    {
      institution: "Bundesministerium für Arbeit und Soziales (BMAS)",
      reference: "Rechengrößen der Sozialversicherung 2026",
      topicEn: "Pension BBG (€8,450/mo), Unemployment BBG (€8,450/mo)",
      topicKo: "연금보험 상한선(8,450 €/월), 실업보험 상한선(8,450 €/월)"
    },
    {
      institution: "Deutsche Rentenversicherung",
      reference: "Beitragssätze und Grenzwerte 2026",
      topicEn: "Statutory contribution rates: RV (18.6%), AV (2.6%)",
      topicKo: "법정 사회보험 요율: 연금보험(18.6%), 실업보험(2.6%)"
    }
  ],

  years: {
    // ------------------------------------------------------------------------
    // CALENDAR YEAR 2025 PARAMETERS
    // ------------------------------------------------------------------------
    2025: {
      year: 2025,
      basicAllowance: 12096, // Grundfreibetrag 2025 (§ 32a Abs. 1 Satz 2 Nr. 1 EStG)
      tariff: {
        zone1Limit: 12096,
        zone2Limit: 17443,
        zone3Limit: 68480,
        zone4Limit: 277825,
        zone2A: 932.30,
        zone2B: 1400,
        zone3A: 176.64,
        zone3B: 2397,
        zone3C: 1015.13,
        zone4Rate: 0.42,
        zone4Sub: 10911.92,
        zone5Rate: 0.45,
        zone5Sub: 19246.67
      },
      pension: {
        totalRate: 0.186,
        employeeRate: 0.093,
        bbgMonthly: 8050,
        bbgAnnual: 96600
      },
      unemployment: {
        totalRate: 0.026,
        employeeRate: 0.013,
        bbgMonthly: 8050,
        bbgAnnual: 96600
      },
      health: {
        baseRate: 0.146,
        employeeBaseRate: 0.073,
        avgZusatzbeitrag: 0.025,
        employeeZusatzRate: 0.0125,
        totalEmployeeRate: 0.0855,
        bbgMonthly: 5512.50,
        bbgAnnual: 66150,
        jaegMonthly: 6150,
        jaegAnnual: 73800
      },
      care: {
        baseRate: 0.036,         // 3.6% total statutory base
        childlessTotalRate: 0.042,// 4.2% childless total rate (3.6% + 0.6%)
        employeeBaseRate: 0.018, // 1.8% employee base outside Saxony (3.6% / 2)
        employeeBaseRateSachsen: 0.023, // 2.3% employee base in Saxony (+0.50 percentage points)
        childlessSurcharge: 0.006,      // +0.6% childless surcharge
        childlessEmployeeRate: 0.0240,  // 2.40% childless employee rate outside Saxony
        childlessEmployeeRateSachsen: 0.0290, // 2.90% childless in Saxony
        bbgMonthly: 5512.50,            // 2025 Pflegeversicherung ceiling (€5,512.50/mo)
        bbgAnnual: 66150,
        // Statutory employee rate mapping (Outside Saxony):
        // 0 kids (childless): 2.40%
        // 1 kid: 1.80%
        // 2 kids: 1.55%
        // 3 kids: 1.30%
        // 4 kids: 1.05%
        // 5+ kids: 0.80%
        // In Saxony (SN): Add +0.50 percentage points across all tiers
        ratesOutsideSaxony: {
          0: 0.0240,
          1: 0.0180,
          2: 0.0155,
          3: 0.0130,
          4: 0.0105,
          5: 0.0080
        },
        saxonyAdditionalEmployeeShare: 0.0050
      },
      solz: {
        thresholdSingle: 19950,  // Freigrenze 2025 (Single / non-splitting): €19,950
        thresholdMarried: 39900, // Freigrenze 2025 (Joint splitting / Class III): €39,900
        rate: 0.055,             // 5.5% standard statutory SolZ rate (§ 3 Abs. 1 SolZG)
        milderungRate: 0.119,    // 11.9% transition zone multiplier (§ 4 Satz 2 SolZG)
        capThresholdSingle: 37094.53, // Transition zone upper limit for single: 19,950 * (0.119 / 0.064)
        capThresholdMarried: 74189.06 // Transition zone upper limit for married splitting: 39,900 * (0.119 / 0.064)
      },
      lumpSums: {
        werbungskosten: 1230,
        sonderausgabenSingle: 36,
        sonderausgabenMarried: 72,
        singleParentRelief: 4260,
        singleParentAdditionalChild: 240
      }
    },

    // ------------------------------------------------------------------------
    // CALENDAR YEAR 2026 PARAMETERS (OFFICIAL VERIFIED VALUES)
    // ------------------------------------------------------------------------
    2026: {
      year: 2026,
      basicAllowance: 12348, // Grundfreibetrag 2026 (§ 32a EStG)
      tariff: {
        // § 32a EStG 2026 Tariff Parameters:
        // Zone 1: Up to €12,348: 0
        // Zone 2: €12,349 – €17,799: (914.51*y + 1,400)*y with y = (x - 12,348)/10,000
        // Zone 3: €17,800 – €69,878: (173.10*z + 2,397)*z + 1,034.87 with z = (x - 17,799)/10,000
        // Zone 4: €69,879 – €277,825: 0.42*x - 11,135.63
        // Zone 5: €277,826 and above: 0.45*x - 19,470.38
        zone1Limit: 12348,
        zone2Limit: 17799,
        zone3Limit: 69878,
        zone4Limit: 277825,
        zone2A: 914.51,
        zone2B: 1400,
        zone3A: 173.10,
        zone3B: 2397,
        zone3C: 1034.87,
        zone4Rate: 0.42,
        zone4Sub: 11135.63,
        zone5Rate: 0.45,
        zone5Sub: 19470.38
      },
      pension: {
        totalRate: 0.186,        // 18.6% total
        employeeRate: 0.093,     // 9.3% employee share
        bbgMonthly: 8450,        // Monthly contribution ceiling (€8,450/mo)
        bbgAnnual: 101400        // Annual ceiling (€101,400/yr)
      },
      unemployment: {
        totalRate: 0.026,        // 2.6% total
        employeeRate: 0.013,     // 1.3% employee share
        bbgMonthly: 8450,        // Monthly ceiling (€8,450/mo)
        bbgAnnual: 101400        // Annual ceiling (€101,400/yr)
      },
      health: {
        baseRate: 0.146,         // 14.6% statutory base
        employeeBaseRate: 0.073, // 7.3% employee base
        avgZusatzbeitrag: 0.029, // 2.9% average national additional contribution
        employeeZusatzRate: 0.0145, // 1.45% employee Zusatzbeitrag share
        totalEmployeeRate: 0.0875,  // 8.75% combined employee GKV rate
        bbgMonthly: 5812.50,     // GKV contribution assessment ceiling (€5,812.50/mo)
        bbgAnnual: 69750,        // GKV contribution assessment ceiling (€69,750/yr)
        jaegMonthly: 6450,       // Compulsory insurance threshold (€6,450/mo)
        jaegAnnual: 77400        // Compulsory insurance threshold / JAEG (€77,400/yr)
      },
      care: {
        baseRate: 0.036,         // 3.6% total statutory base
        employeeBaseRate: 0.018, // 1.8% employee base outside Saxony (3.6% / 2)
        employeeBaseRateSachsen: 0.023, // 2.3% employee base in Saxony (+0.50 percentage points)
        childlessSurcharge: 0.006,      // +0.6% childless surcharge
        bbgMonthly: 5812.50,            // Pflegeversicherung ceiling matches GKV (€5,812.50/mo)
        bbgAnnual: 69750,
        // Statutory employee rate mapping (Outside Saxony):
        // 0 kids (childless): 2.40%
        // 1 kid: 1.80%
        // 2 kids: 1.55%
        // 3 kids: 1.30%
        // 4 kids: 1.05%
        // 5+ kids: 0.80%
        // In Saxony (SN): Add +0.50 percentage points across all tiers
        ratesOutsideSaxony: {
          0: 0.0240,
          1: 0.0180,
          2: 0.0155,
          3: 0.0130,
          4: 0.0105,
          5: 0.0080
        },
        saxonyAdditionalEmployeeShare: 0.0050
      },
      solz: {
        thresholdSingle: 20350,  // Freigrenze 2026 (Single / non-splitting): €20,350 income tax (§ 3 Abs. 3 Nr. 1 SolZG)
        thresholdMarried: 40700, // Freigrenze 2026 (Joint splitting / Class III): €40,700 income tax (§ 3 Abs. 3 Nr. 2 SolZG)
        rate: 0.055,             // 5.5% standard statutory SolZ rate (§ 3 Abs. 1 SolZG)
        milderungRate: 0.119,    // 11.9% transition zone multiplier (§ 4 Satz 2 SolZG)
        capThresholdSingle: 37838.28, // Transition zone upper limit for single: 20,350 * (0.119 / 0.064)
        capThresholdMarried: 75676.56 // Transition zone upper limit for married splitting: 40,700 * (0.119 / 0.064)
      },
      lumpSums: {
        werbungskosten: 1230,    // Employee lump-sum (€1,230/yr)
        sonderausgabenSingle: 36,// Special expenses lump-sum (€36/yr single)
        sonderausgabenMarried: 72,// Special expenses lump-sum (€72/yr married III)
        singleParentRelief: 4260,// Entlastungsbetrag für Alleinerziehende (§ 24b EStG: €4,260 1st child)
        singleParentAdditionalChild: 240 // § 24b Abs. 2 Satz 2 EStG: +€240 for each additional child
      }
    }
  },

  // Church Tax Rates by Bundesland
  churchTaxRates: {
    BY: 0.08, // Bayern (8%)
    BW: 0.08, // Baden-Württemberg (8%)
    DEFAULT: 0.09 // All other 14 Bundesländer including Berlin (9%)
  },

  /**
   * Statutory Health Insurance (GKV) Rate Calculation for 2026
   * Statutory Basis: § 241, § 242, § 242a SGB V; BMG Bekanntmachung 2026
   *
   * - General statutory rate: 14.6% (employee base share: 7.3%)
   * - Average Zusatzbeitrag 2026: 2.9% (employee average Zusatz share: 1.45%)
   * - Total standard employee rate using national average: 8.75%
   * - Optional custom kasseZusatzbeitrag: employee rate = 7.3% + (kasseZusatzbeitrag / 2)
   *
   * @param {object} [params]
   * @param {number|string} [params.kasseZusatzbeitrag] - Specific health fund additional rate (e.g. 2.5 or 0.025)
   * @returns {object} Health insurance calculation details
   */
  getEmployeeHealthInsuranceRate({ kasseZusatzbeitrag } = {}) {
    const baseRate = 0.146;
    const employeeBaseRate = 0.073;
    const avgZusatzbeitrag = 0.029;
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
      note: "Using the 2026 average Zusatzbeitrag of 2.9%"
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
    const pkvPremium = Math.max(0, typeof GLTUtils !== 'undefined' ? GLTUtils.parseNumber(pkvMonthlyPremium, 0) : (parseFloat(pkvMonthlyPremium) || 0));
    const ppvPremium = Math.max(0, typeof GLTUtils !== 'undefined' ? GLTUtils.parseNumber(ppvMonthlyPremium, 0) : (parseFloat(ppvMonthlyPremium) || 0));
    const totalPremium = pkvPremium + ppvPremium;
    const subsidyIncluded = (hasEmployerSubsidy !== false && String(hasEmployerSubsidy) !== 'false');

    let finalSubsidy = 0;
    if (subsidyIncluded) {
      if (employerSubsidy !== null && employerSubsidy !== undefined && String(employerSubsidy).trim() !== '') {
        const customSub = typeof GLTUtils !== 'undefined' ? GLTUtils.parseNumber(employerSubsidy, 0) : (parseFloat(employerSubsidy) || 0);
        finalSubsidy = Math.max(0, customSub);
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
   * Saxony (SN): Add exactly 0.50 percentage points (+0.0050) to the employee share.
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
      // 5 or more qualifying children under age 25 (statutory floor reached)
      rate = 0.0080;
    }

    if (isSaxony) {
      // Saxony requires employee to pay +0.50 percentage points more
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
   * 1. Freigrenze (§ 3 Abs. 3 SolZG 2025):
   *    - Single / non-splitting cases (Tax Classes I, II, IV, VI): €19,950 annual income tax liability
   *    - Joint splitting cases (Tax Class III / married filing jointly): €39,900 annual income tax liability
   *    If incomeTax <= threshold, SolZ = 0.
   *
   * 2. Milderungszone (§ 4 Satz 2 SolZG):
   *    milderungAmount = (incomeTax - threshold) * 0.119
   *
   * 3. Statutory Cap (§ 3 Abs. 1 SolZG):
   *    The surcharge cannot exceed standard 5.5% of the total income tax liability:
   *    fullAmount = incomeTax * 0.055
   *    solz = Math.min(fullAmount, milderungAmount)
   *
   * Upper transition boundary where 11.9% excess matches 5.5% of total tax:
   * - Single: €19,950 * (0.119 / 0.064) = €37,094.53
   * - Splitting: €39,900 * (0.119 / 0.064) = €74,189.06
   *
   * @param {number|object} paramsOrTax - Income tax liability in Euro, or params object
   * @param {boolean|string|number} [isSplittingOrClass] - Splitting flag or tax class (e.g. "3")
   * @param {object} [options] - Additional options (e.g. { raw: boolean, details: boolean })
   * @returns {number|object} Annual Solidarity Surcharge in Euro
   */
  calculateSolidaritySurcharge2025(paramsOrTax, isSplittingOrClass, options = {}) {
    let incomeTax = 0;
    let isSplitting = false;
    let opt = options;

    if (typeof paramsOrTax === 'object' && paramsOrTax !== null) {
      incomeTax = Number(paramsOrTax.incomeTax ?? paramsOrTax.taxLiability ?? paramsOrTax.incomeTaxAnnual ?? paramsOrTax.annualIncomeTax ?? 0);
      isSplitting = Boolean(
        paramsOrTax.isSplitting ??
        paramsOrTax.isJointAssessment ??
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

  // Comprehensive Tax Class Guidance
  taxClasses: [
    {
      id: "1",
      name: "Class I (Steuerklasse I)",
      useCaseEn: "Single, divorced, or permanently separated employees with no dependent children.",
      useCaseKo: "미혼, 이혼, 별거 중이며 부양 자녀가 없는 1인 단독 근로자.",
      featuresEn: "Full statutory basic allowance (€12,348 in 2026), employee lump sum (€1,230), and Vorsorgepauschale.",
      featuresKo: "2026년 법정 기본공제(12,348 €), 근로자 필요경비 공제(1,230 €) 및 사회보험료 공제 적용.",
      limitationsEn: "No spousal splitting advantages.",
      limitationsKo: "배우자 합산 분할(Splitting) 혜택 없음."
    },
    {
      id: "2",
      name: "Class II (Steuerklasse II)",
      useCaseEn: "Single parents living alone with at least one eligible child receiving Kindergeld.",
      useCaseKo: "만 18세 미만 또는 킨더겔트 수급 자녀와 단독 거주하는 한부모 가정.",
      featuresEn: "Includes single parent relief allowance (Entlastungsbetrag für Alleinerziehende: €4,260/yr + €240 per additional child).",
      featuresKo: "한부모 특별 소득공제(첫째 자녀 연간 4,260 €, 추가 자녀당 240 €) 추가 차감으로 실수령액 증가.",
      limitationsEn: "Must not cohabit with any other adult in the same household.",
      limitationsKo: "다른 성인 동거인이 있는 경우 적용 불가."
    },
    {
      id: "3",
      name: "Class III (Steuerklasse III)",
      useCaseEn: "Married couples / registered civil partnerships where one partner earns more or is the sole earner. Partner must take Class V. (No statutory income ratio required; chosen to maximize monthly net for the primary earner).",
      useCaseKo: "부부/등록 동반자 중 한쪽이 소득이 더 높거나 외벌이인 경우 선택 가능한 세금 등급. 배우자는 5등급을 배정받음. (법정 소득 비율 요건 없음; 연중 주 소득자의 월 실수령액을 극대화하기 위해 주로 선택).",
      featuresEn: "Estimated spousal splitting: double basic allowance (€24,696) applied to the earner, yielding lower monthly tax withholding. Actual employer payroll withholding is governed by official BMF PAP; mandatory annual tax return reconciles combined spousal income.",
      featuresKo: "부부 합산 기본공제(24,696 €)가 반영되어 월 소득세 원천징수 추정액이 낮아짐. 실제 급여 원천징수는 공식 BMF PAP 기준이며, 연말정산(소득세 확정신고) 시 부부 합산 소득으로 최종 정산됨.",
      limitationsEn: "Partner in Class V faces steep progressive deductions. Annual income tax return (Einkommensteuererklärung) is legally mandatory.",
      limitationsKo: "5등급 배우자의 월 원천징수율이 매우 높아짐. 연말정산(소득세 확정신고) 의무 제출 대상."
    },
    {
      id: "4",
      name: "Class IV (Steuerklasse IV)",
      useCaseEn: "Married couples earning similar salaries (e.g. 50/50 split). Default upon registration of marriage.",
      useCaseKo: "부부 양측의 소득이 50:50 정도로 유사한 경우. 혼인신고 시 독일 세무서 기본 지정 등급.",
      featuresEn: "Both partners treated identically to Class I. Simple, neutral, and lowest risk of year-end tax backpayments.",
      featuresKo: "양쪽 모두 1등급과 동일한 1인 기본공제 적용. 연말정산 시 추가 납부 위험이 가장 적음.",
      limitationsEn: "Less tax optimization during the year if salary discrepancy between spouses is large.",
      limitationsKo: "소득 격차가 클 경우 연중 월 실수령액 최적화가 안 됨 (연말정산으로만 환급 정산)."
    },
    {
      id: "5",
      name: "Class V (Steuerklasse V)",
      useCaseEn: "Married spouse whose partner has elected Class III.",
      useCaseKo: "배우자가 3등급을 선택했을 때 상대방 배우자가 자동으로 지정되는 등급.",
      featuresEn: "Enables the higher-earning partner in Class III to receive the combined basic tax allowance.",
      featuresKo: "3등급 배우자가 공제를 몰아받을 수 있도록 지원.",
      limitationsEn: "Estimated progressive tariff without basic allowance (Grundfreibetrag = 0). Taxes apply from the very first euro earned. Reconciled at year-end tax filing.",
      limitationsKo: "기본공제가 0유로이므로 첫 1유로부터 높은 누진세율이 즉시 원천징수됨. 연말정산 시 초과분 정산."
    },
    {
      id: "6",
      name: "Class VI (Steuerklasse VI)",
      useCaseEn: "Second and subsequent employment relationships are generally taxed under Class VI.",
      useCaseKo: "두 번째 및 그 이상의 추가 근로계약(부업/복수 고용 관계)은 일반적으로 6등급으로 과세됩니다.",
      featuresEn: "Applies strictly to secondary jobs while primary employment maintains benefits in another tax class.",
      featuresKo: "본업(주 직장)의 세금 등급과 분리하여, 두 번째 및 그 이상의 추가 일자리에만 적용.",
      limitationsEn: "No basic allowance (€0), no employee lump sums (€0), no Sonderausgaben lump sum (€0). Taxed from the very first euro under the estimation model. Reconciled via mandatory annual tax return.",
      limitationsKo: "기본공제(0 €), 근로자 필요경비(0 €), 특별지출 공제(0 €)가 전액 0유로 처리되어 첫 1유로부터 과세됨. 연말정산 시 연간 총소득으로 합산 정산."
    }
  ]
};

if (typeof globalThis !== 'undefined') {
  globalThis.SUPPORTED_OFFICIAL_SALARY_YEARS = SUPPORTED_OFFICIAL_SALARY_YEARS;
  globalThis.GERMAN_TAX_REFORM_PROPOSALS = GERMAN_TAX_REFORM_PROPOSALS;
  globalThis.GERMAN_TAX_CONFIG = GERMAN_TAX_CONFIG;
}
