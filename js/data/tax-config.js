/**
 * German Tax & Social Security Configuration Parameters
 * Architecture: Year-Aware Multi-Year Configuration System (2025, 2026, 2027)
 * Default Tax Year: 2026
 * Last Updated: 2026-09-16
 *
 * Official Legal Sources:
 * 1. BMF (Bundesfinanzministerium): Lohnsteuer-Handbuch 2026 / § 32a EStG (Einkommensteuertarif)
 * 2. BMG (Bundesministerium für Gesundheit): Sozialversicherungs-Rechengrößen-Verordnung 2026
 * 3. BMAS (Bundesministerium für Arbeit und Soziales): Rechengrößen der Sozialversicherung 2026
 * 4. Deutsche Rentenversicherung: Beitragssätze und Beitragsbemessungsgrenzen 2026
 */

const GERMAN_TAX_CONFIG = {
  lastUpdated: "2026-09-16",
  defaultYear: 2026,
  supportedYears: [2025, 2026, 2027],

  officialSources: [
    {
      institution: "Bundesfinanzministerium (BMF)",
      reference: "BMF Lohnsteuer-Handbuch 2026 / § 32a EStG",
      topicEn: "Income tax brackets, basic allowance (€12,348), SolZ threshold (€19,950)",
      topicKo: "소득세 누진세율표, 기본공제(12,348 €), 연대세 면제한도(19,950 €)"
    },
    {
      institution: "Bundesministerium für Gesundheit (BMG)",
      reference: "Sozialversicherungs-Rechengrößen-Verordnung 2026",
      topicEn: "GKV BBG (€5,812.50/mo), JAEG (€77,400/yr), PV base rate (3.6%)",
      topicKo: "건강보험 상한선(5,812.50 €/월), JAEG(77,400 €/년), 요양보험 요율(3.6%)"
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
      basicAllowance: 12096, // Grundfreibetrag 2025
      tariff: {
        zone1Limit: 12096,
        zone2Limit: 17005,
        zone3Limit: 66760,
        zone4Limit: 277825,
        zone2A: 995.21,
        zone2B: 1400,
        zone3A: 208.85,
        zone3B: 2397,
        zone3C: 1015.51,
        zone4Rate: 0.42,
        zone4Sub: 10636.31,
        zone5Rate: 0.45,
        zone5Sub: 18971.06
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
        baseRate: 0.040,
        employeeBaseRate: 0.022,
        employeeBaseRateSachsen: 0.027,
        childlessSurcharge: 0.006,
        childDiscountPerChild: 0.0025,
        maxChildDiscount: 0.010,
        minEmployeeRate: 0.012,
        minEmployeeRateSachsen: 0.017,
        bbgMonthly: 5512.50,
        bbgAnnual: 66150
      },
      solz: {
        thresholdSingle: 18130,
        thresholdMarried: 36260,
        rate: 0.055,
        milderungRate: 0.119
      },
      lumpSums: {
        werbungskosten: 1230,
        sonderausgabenSingle: 36,
        sonderausgabenMarried: 72,
        singleParentRelief: 4260,
        singleParentAdditionalChild: 852
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
        thresholdSingle: 19950,  // Exemption limit 2026: €19,950 income tax
        thresholdMarried: 39900, // Joint splitting threshold: €39,900 income tax
        rate: 0.055,             // 5.5% standard SolZ rate
        milderungRate: 0.119     // 11.9% transition zone multiplier
      },
      lumpSums: {
        werbungskosten: 1230,    // Employee lump-sum (€1,230/yr)
        sonderausgabenSingle: 36,// Special expenses lump-sum (€36/yr single)
        sonderausgabenMarried: 72,// Special expenses lump-sum (€72/yr married III)
        singleParentRelief: 4260,// Entlastungsbetrag für Alleinerziehende (€4,260 1st child)
        singleParentAdditionalChild: 852 // +€852 for each additional child
      }
    },

    // ------------------------------------------------------------------------
    // CALENDAR YEAR 2027 PARAMETERS (PROJECTED STATUTORY EVOLUTION)
    // ------------------------------------------------------------------------
    2027: {
      year: 2027,
      basicAllowance: 12500, // Projected Grundfreibetrag 2027
      tariff: {
        zone1Limit: 12500,
        zone2Limit: 18000,
        zone3Limit: 70500,
        zone4Limit: 280000,
        zone2A: 910.00,
        zone2B: 1400,
        zone3A: 170.00,
        zone3B: 2397,
        zone3C: 1045.00,
        zone4Rate: 0.42,
        zone4Sub: 11250.00,
        zone5Rate: 0.45,
        zone5Sub: 19650.00
      },
      pension: {
        totalRate: 0.186,
        employeeRate: 0.093,
        bbgMonthly: 8650,
        bbgAnnual: 103800
      },
      unemployment: {
        totalRate: 0.026,
        employeeRate: 0.013,
        bbgMonthly: 8650,
        bbgAnnual: 103800
      },
      health: {
        baseRate: 0.146,
        employeeBaseRate: 0.073,
        avgZusatzbeitrag: 0.030,
        employeeZusatzRate: 0.015,
        totalEmployeeRate: 0.088,
        bbgMonthly: 5950,
        bbgAnnual: 71400,
        jaegMonthly: 6600,
        jaegAnnual: 79200
      },
      care: {
        baseRate: 0.036,
        employeeBaseRate: 0.018,
        employeeBaseRateSachsen: 0.023,
        childlessSurcharge: 0.006,
        childDiscountPerChild: 0.0025,
        maxChildDiscount: 0.010,
        minEmployeeRate: 0.008,
        minEmployeeRateSachsen: 0.013,
        bbgMonthly: 5950,
        bbgAnnual: 71400
      },
      solz: {
        thresholdSingle: 20500,
        thresholdMarried: 41000,
        rate: 0.055,
        milderungRate: 0.119
      },
      lumpSums: {
        werbungskosten: 1230,
        sonderausgabenSingle: 36,
        sonderausgabenMarried: 72,
        singleParentRelief: 4260,
        singleParentAdditionalChild: 852
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
      featuresEn: "Includes single parent relief allowance (Entlastungsbetrag für Alleinerziehende: €4,260/yr + €852 per additional child).",
      featuresKo: "한부모 특별 소득공제(첫째 자녀 연간 4,260 €, 추가 자녀당 852 €) 추가 차감으로 실수령액 증가.",
      limitationsEn: "Must not cohabit with any other adult in the same household.",
      limitationsKo: "다른 성인 동거인이 있는 경우 적용 불가."
    },
    {
      id: "3",
      name: "Class III (Steuerklasse III)",
      useCaseEn: "Married couples / registered civil partnerships where one partner earns significantly more (e.g. 60/40 ratio or sole earner). Partner must take Class V.",
      useCaseKo: "부부 중 한쪽이 현저히 소득이 높은 경우(예: 외벌이 또는 60:40 이상 차이). 배우자는 반드시 5등급을 선택해야 함.",
      featuresEn: "Applies spousal splitting (Splitting-Verfahren): double basic allowance (€24,696) applied to the earner, yielding the lowest monthly tax withholding.",
      featuresKo: "부부 합산 기본공제(24,696 €)가 3등급 근로자에게 전액 몰아 적용되어 월 소득세 원천징수액이 가장 낮음.",
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
      featuresEn: "Enables the high-earner partner in Class III to receive the combined basic tax allowance.",
      featuresKo: "3등급 배우자가 공제를 몰아받을 수 있도록 지원.",
      limitationsEn: "Zero basic allowance (Grundfreibetrag = 0). Taxes apply from the very first euro earned at high progressive rates. Equalized at year-end tax filing.",
      limitationsKo: "기본공제가 0유로이므로 첫 1유로부터 높은 누진세율이 즉시 원천징수됨. 연말정산 시 초과분 정산."
    },
    {
      id: "6",
      name: "Class VI (Steuerklasse VI)",
      useCaseEn: "Secondary or multiple employment contracts (Nebenjob / Zweitjob) exceeding statutory Minijob limits.",
      useCaseKo: "부업, 투잡, 아르바이트 중 미니잡(월 538 €) 한도를 초과하는 두 번째 이상의 직장 근로계약.",
      featuresEn: "Applies strictly to secondary jobs while maintaining primary job benefits in other classes.",
      featuresKo: "기존 본업의 세금 등급을 유지하면서 부차적인 두 번째 일자리에만 적용.",
      limitationsEn: "No basic allowance (€0), no employee lump sums (€0), no Vorsorgepauschale (€0). Maximum initial withholding from €1. Deductions reconciled via annual tax return.",
      limitationsKo: "기본공제, 필요경비, 공제 패키지가 전액 0유로 처리되어 첫 1유로부터 최고 원천징수 적용."
    }
  ]
};
