/**
 * German Tax & Social Security Configuration Parameters
 * Last Updated: 2025 / 2026 Reference Parameters
 * 
 * Sources: Bundesfinanzministerium (BMF), Bundesministerium für Arbeit und Soziales (BMAS)
 * Note: These parameters are estimates for informational guidance. Actual payroll processing
 * uses precise official BMF formula tables and individual employer/insurer surcharges.
 */
const GERMAN_TAX_CONFIG = {
  version: "2025.1",
  lastUpdated: "2025-01-01",
  
  // Basic Tax Allowance (Grundfreibetrag)
  basicAllowance: {
    2024: 11784,
    2025: 12096,
    2026: 12348
  },

  // Solidarity Surcharge (Solidaritätszuschlag) Exemption Thresholds (Tax liability)
  solzThresholdSingle: 18130, // Above this tax amount, SolZ applies (graduated up to 5.5%)
  solzThresholdMarried: 36260,
  solzRate: 0.055,

  // Church Tax Rates by Bundesland
  churchTaxRates: {
    BY: 0.08, // Bayern (8%)
    BW: 0.08, // Baden-Württemberg (8%)
    DEFAULT: 0.09 // All other states (9%)
  },

  // Statutory Pension Insurance (Gesetzliche Rentenversicherung - RV)
  pension: {
    totalRate: 0.186,      // 18.6%
    employeeRate: 0.093,   // 9.3%
    bbgWestMonthly: 8050,  // Monthly contribution ceiling West (2025)
    bbgEastMonthly: 8050   // Monthly contribution ceiling East (Unified)
  },

  // Statutory Unemployment Insurance (Arbeitslosenversicherung - AV)
  unemployment: {
    totalRate: 0.026,      // 2.6%
    employeeRate: 0.013,   // 1.3%
    bbgMonthly: 8050       // Same ceiling as RV
  },

  // Statutory Health Insurance (Gesetzliche Krankenversicherung - GKV)
  health: {
    baseRate: 0.146,          // 14.6% standard
    employeeBaseRate: 0.073,  // 7.3%
    avgZusatzbeitrag: 0.025,  // 2.5% nationwide average 2025
    employeeZusatzRate: 0.0125, // 50% paid by employee
    bbgMonthly: 5512.50       // Contribution ceiling GKV (2025)
  },

  // Statutory Long-Term Care Insurance (Pflegeversicherung - PV)
  care: {
    baseRate: 0.040,               // 4.0%
    employeeBaseRate: 0.022,       // Standard employee portion (non-Sachsen)
    employeeBaseRateSachsen: 0.027,// Sachsen employee portion (higher)
    childlessSurcharge: 0.006,     // +0.6% for age 23+ without children
    childDiscountPerChild: 0.0025, // -0.25% per child from 2nd to 5th child (under 25)
    maxChildDiscount: 0.010,       // Max 1.0% discount (5 children)
    bbgMonthly: 5512.50
  },

  // Tax Classes Metadata
  taxClasses: [
    {
      id: "1",
      name: "Class I (Steuerklasse I)",
      useCaseEn: "Single, divorced, or permanently separated individuals with no children.",
      useCaseKo: "미혼, 이혼, 별거 중이며 부양 자녀가 없는 1인 가구.",
      featuresEn: "Standard single allowances applied. SolZ threshold at €18,130 tax.",
      featuresKo: "기본 1인 공제 적용. 일반적인 단독 소득자 기본 등급.",
      limitationsEn: "No spousal splitting advantages.",
      limitationsKo: "배우자 합산 분할 혜택 없음."
    },
    {
      id: "2",
      name: "Class II (Steuerklasse II)",
      useCaseEn: "Single parents living alone with at least one eligible child receiving Kindergeld.",
      useCaseKo: "만 18세 미만 또는 킨더겔트 수급 자녀와 단독 거주하는 한부모 가정.",
      featuresEn: "Includes single parent relief allowance (Entlastungsbetrag für Alleinerziehende: €4,260/yr).",
      featuresKo: "한부모 특별 감면 공제(연간 €4,260)가 추가 적용되어 세금 절감.",
      limitationsEn: "Must not live in a shared household with another adult (unless adult child).",
      limitationsKo: "다른 성인 동거인이 있는 경우 적용 불가."
    },
    {
      id: "3",
      name: "Class III (Steuerklasse III)",
      useCaseEn: "Married/registered partners where one spouse earns significantly more (e.g. 60/40 ratio or sole earner). Partner must take Class V.",
      useCaseKo: "부부 중 한쪽이 현저히 소득이 높은 경우(예: 외벌이 또는 60:40 이상 차이). 배우자는 5등급 선택 필수.",
      featuresEn: "Double basic tax allowance applied to the high earner. Maximum monthly net pay for this spouse.",
      featuresKo: "부부 합산 기본공제가 3등급에 몰아 적용되어 고소득자의 월 실수령액 극대화.",
      limitationsEn: "Partner in Class V faces very high monthly withholding. Annual tax declaration (Steuererklärung) is mandatory.",
      limitationsKo: "5등급 배우자의 월 공제율이 매우 높아짐. 연말 정산 소득세 신고 의무 발생."
    },
    {
      id: "4",
      name: "Class IV (Steuerklasse IV)",
      useCaseEn: "Married/registered partners earning similar salaries (e.g. 50/50). Default upon marriage.",
      useCaseKo: "부부 양측의 소득이 50:50 정도로 유사한 경우. 혼인신고 시 독일 세무서 기본 지정 등급.",
      featuresEn: "Both spouses treated identically to Class I. Simple, neutral, no unexpected back-taxes.",
      featuresKo: "양쪽 모두 1등급과 동일한 기본 공제 적용. 연말정산 시 추가 환수 위험이 가장 적음.",
      limitationsEn: "Less tax optimization during the year if salary discrepancy is large.",
      limitationsKo: "소득 격차가 클 경우 연중 월 실수령액 최적화가 안 됨 (연말정산으로 정산)."
    },
    {
      id: "4F",
      name: "Class IV with Factor (Steuerklasse IV mit Faktor)",
      useCaseEn: "Married couples wanting precise monthly withholding matching their exact income ratio.",
      useCaseKo: "소득 격차가 있는 부부가 연말정산 추가 납부 부담 없이 월 급여에서 정확히 비례 분배받길 원하는 경우.",
      featuresEn: "Applies a mathematical factor based on expected total annual income. Fair split, no big year-end shock.",
      featuresKo: "예상 연간 소득에 따른 가중치(Factor)를 곱해 원천징수. 연말 추가 세금 폭탄 방지.",
      limitationsEn: "Must be requested annually or biennially at the Finanzamt via ELSTER.",
      limitationsKo: "매 1~2년마다 세무서(ELSTER)에 팩터 신청 갱신 필요."
    },
    {
      id: "5",
      name: "Class V (Steuerklasse V)",
      useCaseEn: "Married spouse whose partner has selected Class III.",
      useCaseKo: "배우자가 3등급을 선택했을 때 상대방 배우자가 자동으로 지정되는 등급.",
      featuresEn: "Enables partner in Class III to receive double allowance.",
      featuresKo: "3등급 배우자가 공제를 몰아받을 수 있도록 함.",
      limitationsEn: "High deductions from the very first Euro earned. Mandatory annual tax filing.",
      limitationsKo: "기본공제가 없어 첫 유로부터 높은 원천징수율 적용. 연말정산 의무 제출."
    },
    {
      id: "6",
      name: "Class VI (Steuerklasse VI)",
      useCaseEn: "Second or multiple jobs (Nebenjob / secondary employment) exceeding Minijob limits.",
      useCaseKo: "부업, 투잡, 아르바이트 중 미니잡 한도를 초과하는 두 번째 이상의 직장 소득.",
      featuresEn: "Applies only to secondary employment contracts.",
      featuresKo: "부차적인 두 번째 근로계약서에만 적용.",
      limitationsEn: "Zero basic allowance, highest withholding rate from €1. Tax refunded via annual filing if total income permits.",
      limitationsKo: "기본공제 전혀 없음. 첫 1유로부터 최고세율 부과 (연말정산 시 초과분 환급 가능)."
    }
  ]
};
