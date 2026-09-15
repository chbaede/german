/**
 * Centralized Bilingual Internationalization (i18n) Catalog
 * English (default) and Korean
 */
const I18N = {
  en: {
    // Brand & Header
    appTitle: "German Life Toolkit",
    appSubtitle: "Smart tools for everyday life in Germany",
    navHome: "Home",
    navMoney: "Money",
    navHousing: "Housing",
    navTransport: "Transport",
    navCalendar: "Calendar",
    navFamily: "Family",
    navEveryday: "Everyday",
    navReference: "Reference",
    toggleTheme: "Toggle dark mode",
    toggleLanguage: "Switch language",
    yoctoPortal: "Yocto Portal",
    backToDashboard: "← Back to Tools",
    privacyBanner: "100% Client-Side. Your financial and personal data never leaves your browser.",

    // Dashboard & Home
    heroTitle: "German Life Toolkit",
    heroDesc: "Practical calculators, converters, and reference tools for expats, professionals, families, and residents living in Germany.",
    searchPlaceholder: "Search tools (e.g. salary, rent, car, holidays, Anmeldung...)",
    allCategories: "All Categories",
    popularTools: "Popular Tools",
    recentlyUsed: "Recently Used",
    noResults: "No matching tools found. Try searching for other terms.",
    openTool: "Open Tool",
    categoryLabel: "Category",

    // Common Calculator Actions
    calculate: "Calculate",
    reset: "Reset Defaults",
    copied: "Copied to clipboard!",
    copyResult: "Copy Summary",
    estimatedNotice: "Estimated Calculation",
    taxDisclaimer: "Actual payroll deductions and taxes may differ based on your specific tax filing, deductions, and insurer.",
    infoHeading: "How this calculation works",
    faqHeading: "Frequently Asked Questions",
    resultsHeading: "Results & Breakdown",

    // Salary Calculator (1)
    salaryTitle: "German Salary Calculator (Brutto → Netto)",
    salaryDesc: "Estimate your monthly and annual take-home salary after taxes and statutory social security deductions.",
    grossSalaryMonthly: "Gross Salary (Brutto)",
    salaryPeriod: "Period",
    monthly: "Monthly",
    annual: "Annual",
    taxClass: "Tax Class (Steuerklasse)",
    bundesland: "Federal State (Bundesland)",
    churchTax: "Church Tax (Kirchensteuer)",
    yes: "Yes",
    no: "No",
    numChildren: "Number of Children",
    healthInsurance: "Health Insurance (Krankenversicherung)",
    statutoryHealth: "Statutory GKV (Standard 14.6% + 2.5% avg Zusatz)",
    privateHealth: "Private PKV (Flat rate entered separately)",
    pkvMonthlyAmount: "Private Health Ins. Premium (€/month)",
    careInsurance: "Long-term Care Ins. (Pflegeversicherung)",
    pensionInsurance: "Pension Ins. (Rentenversicherung)",
    unemploymentInsurance: "Unemployment Ins. (Arbeitslosenversicherung)",
    netMonthly: "Estimated Monthly Net Pay",
    netAnnual: "Estimated Annual Net Pay",
    grossSalary: "Gross Salary",
    incomeTax: "Income Tax (Lohnsteuer)",
    solz: "Solidarity Surcharge (SolZ)",
    churchTaxAmount: "Church Tax",
    healthContribution: "Health Insurance (GKV)",
    pensionContribution: "Pension Insurance (RV)",
    unemploymentContribution: "Unemployment Insurance (AV)",
    careContribution: "Care Insurance (PV)",
    totalDeductions: "Total Deductions & Taxes",
    effectiveDeductionRate: "Effective Deduction Rate",

    // Net to Gross Calculator (2)
    netToGrossTitle: "Net → Gross Calculator (Reverse Salary)",
    netToGrossDesc: "Find out the required gross salary (Brutto) needed to achieve your desired take-home pay (Netto).",
    desiredNet: "Desired Net Salary (€/month)",
    requiredGross: "Estimated Required Gross (Brutto)",
    requiredGrossAnnual: "Estimated Required Annual Gross",
    reverseExplain: "Uses an iterative binary-search method against standard German income tax brackets and social ceilings.",

    // Annual Compensation Calculator (3)
    annualSalaryTitle: "Annual Compensation & Bonus Calculator",
    annualSalaryDesc: "Calculate your full annual compensation including monthly base pay, 13th/14th salary, and bonus percentage.",
    monthlyGross: "Monthly Gross Base Pay (€)",
    bonusPercentage: "Annual Bonus Percentage (%)",
    bonusPaymentsCount: "Fixed Bonus Payments (e.g. 13th month / Christmas)",
    baseAnnual: "Base Annual Salary",
    bonusFromPercent: "Performance Bonus",
    bonusFromFixed: "Special Fixed Payments",
    totalAnnualComp: "Total Annual Compensation",
    monthlyAverageComp: "True Monthly Gross Equivalent",

    // Tax Class Comparison (4)
    taxClassTitle: "German Tax Classes Comparison Guide",
    taxClassDesc: "Compare Steuerklassen I through VI to understand how marital status and salary disparities affect monthly withholdings.",
    classCol: "Tax Class",
    useCaseCol: "Typical Use Case",
    featuresCol: "Key Characteristics & Allowances",
    limitationsCol: "Limitations & Annual Filing",
    marriedGuideTitle: "Guide for Married Couples: 3/5 vs 4/4 vs 4 with Factor",
    marriedGuideText: "In Germany, married couples automatically receive Class 4/4 upon marriage. If one partner earns 60%+ of the household income, switching to Class 3/5 maximizes monthly take-home pay, but triggers mandatory annual tax return filing (Steuererklärung) where any underpaid taxes are reconciled.",

    // Rent Calculator (5)
    rentTitle: "German Rent & Housing Cost Calculator",
    rentDesc: "Understand the true cost of renting an apartment in Germany: Kaltmiete, Nebenkosten, heating, electricity, and GEZ.",
    kaltmiete: "Cold Rent (Kaltmiete - base rent)",
    nebenkosten: "Advance Operating Costs (Nebenkosten)",
    heatingIncluded: "Is heating included in Nebenkosten?",
    extraHeating: "Extra Heating / Hot Water (€/month)",
    electricity: "Electricity (€/month)",
    internet: "Internet / Broadband (€/month)",
    gezFee: "Public Broadcasting Fee (GEZ / Rundfunkbeitrag)",
    otherHousing: "Other Monthly Housing Costs",
    netMonthlyIncome: "Your Monthly Net Income (optional, to check budget)",
    warmmiete: "Warm Rent (Warmmiete)",
    totalHousingMonthly: "Total Monthly Housing Cost",
    totalHousingAnnual: "Total Annual Housing Cost",
    rentIncomeRatio: "Housing Cost as % of Net Income",
    rentHealthyNote: "German financial rule of thumb: Total housing cost should ideally not exceed 30% to 35% of monthly net income.",
    kaltmieteExplainTitle: "Understanding German Rent Terms",
    kaltmieteExplain: "• <b>Kaltmiete (Cold Rent):</b> The bare price for the living space alone.<br>• <b>Nebenkosten (Operating costs):</b> Prepayments for building insurance, trash collection, stairwell cleaning, and water.<br>• <b>Warmmiete:</b> Kaltmiete + Nebenkosten (and heating if included).<br>• <b>Electricity & Internet:</b> Almost always contracted separately by the tenant.",

    // Rental Deposit Calculator (6)
    depositTitle: "Rental Deposit Calculator (Mietkaution)",
    depositDesc: "Calculate the legal deposit limit (capped at 3 net cold rents) and statutory 3-month installment schedule.",
    maxKaution: "Legal Maximum Deposit (3 × Kaltmiete)",
    firstMonthLiquidity: "Total Liquidity Needed for Move-in",
    installment1: "1st Installment (Due on move-in day with 1st month rent)",
    installment2: "2nd Installment (Due in 2nd month)",
    installment3: "3rd Installment (Due in 3rd month)",
    kautionLegalNote: "Under German Civil Code (BGB § 551), landlords cannot demand more than 3 months of Kaltmiete (excluding Nebenkosten), and tenants have the legal right to pay the Kaution in 3 equal monthly installments.",

    // Moving Cost Calculator (7)
    movingTitle: "Moving Cost Calculator (Umzugskosten)",
    movingDesc: "Estimate the comprehensive budget needed when relocating to or within Germany.",
    movingCompany: "Moving Company / Movers (€)",
    truckRental: "Van / Truck Rental (Sixt, Miles, CarlundCarla)",
    boxesPacking: "Moving Boxes & Packing Supplies",
    cleaningRenovation: "Cleaning / Painting (Schönheitsreparaturen)",
    depositAmount: "Security Deposit (Kaution)",
    newFurniture: "New Furniture / Einbauküche (Fitted Kitchen)",
    mailForwarding: "Mail Forwarding (Deutsche Post Nachsendeauftrag)",
    totalMovingCost: "Estimated Total Moving Budget",

    // Car Cost Calculator (8)
    carTitle: "Car Total Cost of Ownership (TCO)",
    carDesc: "Calculate the true monthly and per-kilometer cost of owning and driving a car in Germany.",
    carPurchasePrice: "Vehicle Purchase Price (€)",
    monthlyFinancing: "Monthly Loan / Lease / Depreciation (€)",
    annualKm: "Annual Driving Distance (km/year)",
    powertrain: "Powertrain Type",
    petrol: "Gasoline / Petrol (Benzin)",
    diesel: "Diesel",
    hybrid: "Hybrid (PHEV / HEV)",
    ev: "Electric Vehicle (BEV)",
    fuelConsumption: "Fuel Consumption (L/100km or kWh/100km)",
    fuelPricePerUnit: "Fuel / Electricity Price (€/L or €/kWh)",
    carInsurance: "Annual Insurance (Haftpflicht + Vollkasko)",
    carTax: "Annual Vehicle Tax (Kfz-Steuer)",
    carMaintenance: "Annual Maintenance & TÜV (HU/AU)",
    carParking: "Monthly Parking / Resident Permit (€)",
    carTires: "Annual Tire Cost (Summer/Winter Wechsel)",
    monthlyCarCost: "Total Monthly Car Cost",
    annualCarCost: "Total Annual Car Cost",
    costPerKm: "Total Cost per Kilometer",
    threeYearCost: "3-Year Total Cost",
    fiveYearCost: "5-Year Total Cost",
    tcoComparisonTitle: "Powertrain TCO Benchmark",

    // Fuel Cost Calculator (9)
    fuelTitle: "Fuel Cost Calculator",
    fuelDesc: "Calculate trip fuel expense and fuel economy across metric units.",
    tripDistance: "Trip Distance (km)",
    fuelUnit: "Consumption Format",
    literPer100Km: "Liters per 100 km (L/100km)",
    kmPerLiter: "Kilometers per Liter (km/L)",
    fuelRequired: "Fuel Required",
    totalFuelCost: "Total Fuel Cost",
    costPer100km: "Cost per 100 km",

    // EV Charging Cost Calculator (10)
    evTitle: "EV Charging Cost Calculator",
    evDesc: "Simulate electric vehicle charging sessions, compare home vs public fast charging, and evaluate per-km running costs.",
    batteryCapacity: "Battery Pack Usable Capacity (kWh)",
    chargeStartPct: "Starting Battery (%)",
    chargeTargetPct: "Target Battery (%)",
    chargerType: "Charging Location / Tariff",
    homeWallbox: "Home Wallbox (~€0.32/kWh)",
    publicAC: "Public AC 11-22 kW (~€0.45/kWh)",
    publicDC: "Public DC High-Power / Ionity (~€0.65/kWh)",
    customTariff: "Custom Electricity Rate (€/kWh)",
    evConsumption: "Vehicle Consumption (kWh/100km)",
    energyAdded: "Energy Added to Battery",
    sessionCost: "Charging Session Cost",
    costPer100KmEV: "Cost per 100 km (Electric)",
    combustionCompare: "Compared to standard 7L/100km gasoline (€1.75/L = €12.25/100km)",

    // Holidays (11)
    holidaysTitle: "German Public Holidays (Gesetzliche Feiertage)",
    holidaysDesc: "Explore nationwide and federal state public holidays. Automatically calculates Easter-dependent holidays for any year.",
    selectYear: "Select Year",
    selectState: "Select Federal State",
    allStatesOption: "All States (Compare Nationwide & Regional)",
    nationwideBadge: "Nationwide (Bundesweit)",
    stateSpecificBadge: "State Specific",
    upcomingHolidays: "Upcoming Holidays",

    // Working Days (12)
    workingDaysTitle: "German Working Days Calculator (Arbeitstage)",
    workingDaysDesc: "Calculate exact working days between two dates, accurately excluding weekends and state-specific public holidays.",
    startDate: "Start Date",
    endDate: "End Date",
    excludeHolidays: "Exclude Public Holidays from count?",
    calendarDays: "Total Calendar Days",
    weekendDays: "Weekend Days (Saturday & Sunday)",
    holidaysCount: "Public Holidays on Weekdays",
    netWorkingDays: "Net Working Days",

    // Vacation Days (13)
    vacationTitle: "Vacation Days & Bridge Day (Brückentage) Planner",
    vacationDesc: "Manage your annual leave balance and find smart bridge-day opportunities around German public holidays.",
    annualEntitlement: "Annual Paid Leave Entitlement (Days)",
    daysAlreadyUsed: "Vacation Days Already Taken",
    plannedLeaveStart: "Planned Vacation Start Date",
    plannedLeaveEnd: "Planned Vacation End Date",
    daysNeededForTrip: "Vacation Days Required for Trip",
    remainingLeave: "Remaining Vacation Days",
    bridgeDayTipTitle: "German Brückentage Strategy",
    bridgeDayTipText: "In Germany, 'Brückentage' (bridge days) are single work days sandwiched between a public holiday (such as Christi Himmelfahrt on Thursday) and the weekend. Taking that single Friday off grants 4 consecutive days of leisure with only 1 vacation day used.",

    // Child Benefit (14)
    kindergeldTitle: "German Child Benefit Reference (Kindergeld)",
    kindergeldDesc: "Understand monthly payments (€250/month per child), age limits, and tax allowance interactions.",
    kindergeldAmountCard: "€250 per month",
    perChildMonthly: "Per eligible child, regardless of birth order or parents' income",
    kindergeldEligibilityTitle: "Eligibility & Age Limits",
    kindergeldEligibilityText: "• <b>Birth to Age 18:</b> All children residing in Germany.<br>• <b>Ages 18 to 21:</b> Eligible if registered as job-seeking.<br>• <b>Ages 18 to 25:</b> Eligible if pursuing university studies, an apprenticeship (Ausbildung), or volunteer service (FSJ/BFD).<br>• <b>Disabled children:</b> Can be eligible beyond age 25 if unable to support themselves.",
    kindergeldVsFreibetrag: "Kindergeld vs Kinderfreibetrag: The tax office automatically performs a check ('Günstigerprüfung') on your annual tax return to determine whether the monthly Kindergeld payout or the income tax deduction (Kinderfreibetrag) provides a greater financial benefit.",
    numKidsInput: "Number of Eligible Children",
    monthlyKindergeldTotal: "Total Monthly Kindergeld",
    annualKindergeldTotal: "Total Annual Kindergeld Benefit",

    // School Holidays (15)
    schoolHolidaysTitle: "German School Holidays Finder (Schulferien)",
    schoolHolidaysDesc: "Search official school vacation dates by federal state and year (KMK schedule) to plan family travels.",
    holidayPeriod: "Vacation Period",
    dates: "Dates",
    duration: "Duration",

    // Date Diff (16)
    dateDiffTitle: "Date Difference & Duration Calculator",
    dateDiffDesc: "Find exact days, weeks, months, and years between any two dates.",
    dateOne: "From Date",
    dateTwo: "To Date",
    totalDays: "Total Days",
    totalWeeks: "Weeks & Days",
    totalMonths: "Months & Days",
    totalYears: "Years, Months & Days",

    // Age Calculator (17)
    ageTitle: "Exact Age Calculator",
    ageDesc: "Calculate your exact age in years, months, and days, total days lived, and days until next birthday.",
    birthDate: "Date of Birth",
    exactAge: "Exact Age",
    totalDaysLived: "Total Days Lived",
    nextBirthday: "Next Birthday",
    bornOnDay: "Day of Week Born",

    // Percentage Calculator (18)
    percentageTitle: "Percentage Calculator",
    percentageDesc: "Fast everyday percentage calculations: discounts, proportions, and increases.",
    mode1Title: "What is X% of Y?",
    mode2Title: "X is what % of Y?",
    mode3Title: "Percentage Increase or Decrease",
    mode4Title: "Percentage Difference",

    // Unit Converter (19)
    unitTitle: "German & Expat Unit Converter",
    unitDesc: "Instantly convert distance, weight, temperature, volume, and apartment floor areas.",
    lengthDist: "Length & Distance (km ↔ miles)",
    weightMass: "Weight (kg ↔ lb)",
    temperature: "Temperature (°C ↔ °F)",
    volume: "Volume (Liters ↔ US Gallons)",
    areaApartment: "Floor Area (m² ↔ sq ft)",

    // Address & PLZ (20)
    addressTitle: "German Address & Postal Code (PLZ) Guide",
    addressDesc: "Directory of 16 Bundesländer, capitals, PLZ ranges, and standard German postal address structure.",
    addressGuideTitle: "How to Address Mail in Germany",
    addressGuideText: "In Germany, the house number ALWAYS comes after the street name, followed by the 5-digit PLZ and city on the next line:<br><pre class='code-block'>Herr/Frau Max Mustermann\nMusterstraße 42\n10115 Berlin\nDEUTSCHLAND</pre>",
    stateCol: "Bundesland",
    capitalCol: "Capital",
    popCol: "Population",
    majorCitiesCol: "Major Cities",
    plzRangeCol: "PLZ 2-Digit Ranges",

    // Glossary (21)
    glossaryTitle: "German Expat Glossary & Abbreviations",
    glossaryDesc: "Searchable dictionary of 40+ essential bureaucratic, legal, tax, housing, and everyday terms in Germany.",
    searchGlossary: "Filter terms (e.g. Anmeldung, Schufa, TÜV, GEZ...)",
    allGlossaryCats: "All Categories",
    catBureaucracy: "Bureaucracy & Residence",
    catHousing: "Housing & Rent",
    catTax: "Taxes & Finance",
    catWork: "Work & Employment",
    catHealth: "Health & Insurance",
    catTransport: "Transport & Driving",
    catEveryday: "Everyday Life",

    // Footer
    footerBrand: "German Life Toolkit",
    footerTagline: "Smart tools for everyday life in Germany",
    footerPartOf: "Part of the yocto.co.kr ecosystem",
    footerLegal: "Tools are provided for informational purposes only. Calculations are estimates and may not reflect individual circumstances or legal/tax advice.",
    footerPrivacy: "Privacy Policy",
    footerDisclaimer: "Disclaimer",
    footerEcosystem: "Yocto Ecosystem",
    footerGithub: "GitHub Repository",
    footerLinkedIn: "LinkedIn"
  },

  ko: {
    // Brand & Header
    appTitle: "독일 생활 툴킷 (German Life Toolkit)",
    appSubtitle: "독일 일상생활 및 직장인을 위한 스마트 유틸리티",
    navHome: "홈",
    navMoney: "급여/세금",
    navHousing: "주거/월세",
    navTransport: "교통/차량",
    navCalendar: "달력/근무",
    navFamily: "가족/학교",
    navEveryday: "일상도구",
    navReference: "독일백과",
    toggleTheme: "다크 모드 전환",
    toggleLanguage: "언어 변경 (EN/KO)",
    yoctoPortal: "Yocto 포털",
    backToDashboard: "← 툴 목록으로 돌아가기",
    privacyBanner: "100% 클라이언트 사이드. 입력하신 금융 정보와 개인정보는 브라우저 외부로 절대 전송되지 않습니다.",

    // Dashboard & Home
    heroTitle: "독일 생활 툴킷 (German Life Toolkit)",
    heroDesc: "독일 거주 한인, 주재원, 유학생, 직장인 및 가족을 위한 실용적인 계산기, 변환기 및 행정 레퍼런스 플랫폼입니다.",
    searchPlaceholder: "도구 검색 (예: 월급, 실수령액, 월세, 공휴일, 안멜둥, 차 유지비...)",
    allCategories: "전체 카테고리",
    popularTools: "인기 도구",
    recentlyUsed: "최근 사용한 도구",
    noResults: "검색 결과가 없습니다. 다른 검색어를 입력해 보세요.",
    openTool: "도구 열기",
    categoryLabel: "분류",

    // Common Calculator Actions
    calculate: "계산하기",
    reset: "기본값 초기화",
    copied: "결과가 클립보드에 복사되었습니다!",
    copyResult: "결과 복사하기",
    estimatedNotice: "예상 계산 결과",
    taxDisclaimer: "본 결과는 추정치이며, 실제 급여 공제액은 개인 세무 환경, 소득공제 및 보험사 추가요율에 따라 달라질 수 있습니다.",
    infoHeading: "계산 기준 및 원리",
    faqHeading: "자주 묻는 질문 (FAQ)",
    resultsHeading: "계산 결과 및 상세 내역",

    // Salary Calculator (1)
    salaryTitle: "독일 월급 실수령액 계산기 (세전 → 세후)",
    salaryDesc: "독일 소득세 등급(1~6등급), 4대 사회보험, 종교세를 반영하여 월 및 연간 세후 실수령액을 계산합니다.",
    grossSalaryMonthly: "세전 급여 (Brutto)",
    salaryPeriod: "급여 기준",
    monthly: "월급 기준",
    annual: "연봉 기준",
    taxClass: "소득세 등급 (Steuerklasse)",
    bundesland: "거주 연방주 (Bundesland)",
    churchTax: "종교세 납부 여부 (Kirchensteuer)",
    yes: "납부함 (예)",
    no: "납부 안 함 (아니오)",
    numChildren: "자녀 수",
    healthInsurance: "건강보험 유형 (Krankenversicherung)",
    statutoryHealth: "법정 공보험 GKV (기본 14.6% + 평균 추가요율 2.5%)",
    privateHealth: "사보험 PKV (월 납입 보험료 직접 입력)",
    pkvMonthlyAmount: "사보험 월 납입료 (€/월)",
    careInsurance: "장기요양보험 (Pflegeversicherung)",
    pensionInsurance: "연금보험 (Rentenversicherung)",
    unemploymentInsurance: "실업보험 (Arbeitslosenversicherung)",
    netMonthly: "예상 월 실수령액 (Netto)",
    netAnnual: "예상 연간 실수령액 (Netto)",
    grossSalary: "세전 총급여 (Brutto)",
    incomeTax: "근로소득세 (Lohnsteuer)",
    solz: "연대특별세 / 통일세 (SolZ)",
    churchTaxAmount: "종교세 (Kirchensteuer)",
    healthContribution: "건강보험 본인부담금 (GKV)",
    pensionContribution: "연금보험 본인부담금 (RV)",
    unemploymentContribution: "실업보험 본인부담금 (AV)",
    careContribution: "요양보험 본인부담금 (PV)",
    totalDeductions: "총 공제액 (세금 + 4대 보험)",
    effectiveDeductionRate: "실효 공제율 (총 공제 비율)",

    // Net to Gross Calculator (2)
    netToGrossTitle: "역산 급여 계산기 (목표 세후 → 필요 세전)",
    netToGrossDesc: "희망하는 목표 월 실수령액(Netto)을 받기 위해 연봉 협상 시 요구해야 하는 세전 총급여(Brutto)를 역산합니다.",
    desiredNet: "희망 월 실수령액 (€/월)",
    requiredGross: "필요 예상 월 세전급여 (Brutto)",
    requiredGrossAnnual: "필요 예상 연봉 (Brutto)",
    reverseExplain: "독일 누진 소득세율 구간 및 사회보험 부과상한선(BBG)을 바탕으로 이진 탐색 알고리즘을 통해 역산합니다.",

    // Annual Compensation Calculator (3)
    annualSalaryTitle: "연봉 및 보너스 합산 계산기",
    annualSalaryDesc: "기본 월급, 13월의 보너스, 성과급 및 인센티브를 합산하여 연간 총소득과 실질 월급을 계산합니다.",
    monthlyGross: "기본 세전 월급 (€)",
    bonusPercentage: "연간 성과급 비율 (%)",
    bonusPaymentsCount: "고정 상여금 횟수 (예: 13월 급여, 크리스마스 상여 등)",
    baseAnnual: "기본 연간 급여",
    bonusFromPercent: "성과 기반 보너스",
    bonusFromFixed: "고정 특별 상여금",
    totalAnnualComp: "연간 총 보수 (Total Compensation)",
    monthlyAverageComp: "실질 월평균 세전 상당액",

    // Tax Class Comparison (4)
    taxClassTitle: "독일 세금 등급 비교 가이드 (1~6등급)",
    taxClassDesc: "1등급부터 6등급까지의 대상, 특징, 공제 혜택 및 맞벌이 부부의 세금 등급 조합을 비교합니다.",
    classCol: "세금 등급",
    useCaseCol: "주요 적용 대상",
    featuresCol: "기본 공제 및 특징",
    limitationsCol: "제약 및 연말정산 의무",
    marriedGuideTitle: "독일 기혼 부부 등급 선택 가이드: 3/5 vs 4/4 vs 4 팩터",
    marriedGuideText: "독일에서 혼인신고를 하면 부부는 기본 4/4등급으로 자동 지정됩니다. 한쪽 배우자가 가구 소득의 60% 이상을 차지할 경우 3/5등급으로 변경하면 고소득자의 월 실수령액을 극대화할 수 있으나, 이 경우 연말정산(Steuererklärung) 제출이 법적 의무가 됩니다.",

    // Rent Calculator (5)
    rentTitle: "독일 월세 & 주거비 총비용 계산기",
    rentDesc: "기본 월세(Kaltmiete), 관리비(Nebenkosten), 난방, 전기세, 인터넷 및 방송수신료를 종합한 실제 주거비를 계산합니다.",
    kaltmiete: "순수 기본 월세 (Kaltmiete)",
    nebenkosten: "선납 관리비 (Nebenkosten)",
    heatingIncluded: "난방비가 관리비에 포함되어 있나요?",
    extraHeating: "추가 난방/온수비 (€/월)",
    electricity: "전기요금 (€/월)",
    internet: "인터넷/통신비 (€/월)",
    gezFee: "공영방송 수신료 (GEZ / Rundfunkbeitrag)",
    otherHousing: "기타 월 주거비용",
    netMonthlyIncome: "월 순수령 소득 (선택 사항, 주거비 비중 점검용)",
    warmmiete: "관리비 포함 월세 (Warmmiete)",
    totalHousingMonthly: "월 총 주거비용 (Total Housing)",
    totalHousingAnnual: "연간 총 주거비용",
    rentIncomeRatio: "소득 대비 주거비 비율",
    rentHealthyNote: "독일 권장 주거비 가이드라인: 총 주거비용은 월 순소득의 30%~35% 이내로 유지하는 것이 이상적입니다.",
    kaltmieteExplainTitle: "독일 임대 용어 핵심 요약",
    kaltmieteExplain: "• <b>Kaltmiete (칼트미테):</b> 순수 주거 공간에 대한 기본 임대료.<br>• <b>Nebenkosten (네벤코스텐):</b> 건물 보험, 쓰레기 수거, 계단 청소 등 관리비 선수금 (연말 정산).<br>• <b>Warmmiete (밤미테):</b> 칼트미테 + 네벤코스텐 (난방비 포함 시).<br>• <b>전기 및 인터넷:</b> 세입자가 공급업체와 직접 개별 계약하는 것이 일반적입니다.",

    // Rental Deposit Calculator (6)
    depositTitle: "보증금(Kaution) 및 입주 초기비용 계산기",
    depositDesc: "독일 민법(BGB § 551)상 최대 3개월치 기본월세 보증금 한도와 3회 분할 납부 일정을 계산합니다.",
    maxKaution: "법정 최대 보증금 한도 (3 × Kaltmiete)",
    firstMonthLiquidity: "첫 달 입주 시 필요 총 자금",
    installment1: "보증금 1회차 (입주일 당일 첫 달 월세와 함께 납부)",
    installment2: "보증금 2회차 (거주 2개월차 납부)",
    installment3: "보증금 3회차 (거주 3개월차 납부)",
    kautionLegalNote: "독일 민법(BGB § 551)에 따라 집주인은 순수 월세(Kaltmiete, 관리비 제외)의 최대 3개월분을 초과하여 보증금을 요구할 수 없으며, 세입자는 법적으로 보증금을 3회 균등 분할 납부할 권리가 있습니다.",

    // Moving Cost Calculator (7)
    movingTitle: "독일 이사 비용 견적 계산기 (Umzugskosten)",
    movingDesc: "트럭 대여, 포장이사, 이사 박스, 퇴거 청소, 보증금 및 주방 가구(EBK) 설치비를 종합 산출합니다.",
    movingCompany: "이사 업체 비용 (€)",
    truckRental: "렌트카 트럭/밴 대여료 (Sixt, Miles, CarlundCarla 등)",
    boxesPacking: "이사 박스 및 포장 부자재",
    cleaningRenovation: "퇴거 청소 및 페인트칠 (Schönheitsreparaturen)",
    depositAmount: "새집 보증금 (Kaution)",
    newFurniture: "새 가구 및 빌트인 주방 (Einbauküche - EBK)",
    mailForwarding: "우편물 이전 배송 서비스 (Deutsche Post)",
    totalMovingCost: "예상 총 이사 예산",

    // Car Cost Calculator (8)
    carTitle: "독일 자동차 총 유지비 계산기 (TCO)",
    carDesc: "독일 내 차량 감가상각, 할부금, 자동차세, 보험, 유류비, 정기검사(TÜV)를 합산하여 실질 유지비를 계산합니다.",
    carPurchasePrice: "차량 구매 가격 (€)",
    monthlyFinancing: "월 할부금 / 리스료 / 감가상각 (€)",
    annualKm: "연간 주행 거리 (km/년)",
    powertrain: "엔진 및 구동 방식",
    petrol: "가솔린 (휘발유 Benzin)",
    diesel: "디젤 (경유 Diesel)",
    hybrid: "하이브리드 (PHEV / HEV)",
    ev: "순수 전기차 (BEV)",
    fuelConsumption: "연비 / 전비 (L/100km 또는 kWh/100km)",
    fuelPricePerUnit: "유가 / 충전요금 (€/L 또는 €/kWh)",
    carInsurance: "연간 자동차 보험료 (책임보험 + 자차)",
    carTax: "연간 자동차세 (Kfz-Steuer)",
    carMaintenance: "연간 정비비 및 TÜV 검사비 (HU/AU)",
    carParking: "월 주차비 / 거주자 우선주차권 (€)",
    carTires: "연간 타이어 교체/보관비 (서머/윈터 타이어)",
    monthlyCarCost: "월간 총 차량 유지비",
    annualCarCost: "연간 총 차량 유지비",
    costPerKm: "1km 주행당 실질 유지비",
    threeYearCost: "3년 누적 총비용",
    fiveYearCost: "5년 누적 총비용",
    tcoComparisonTitle: "구동 방식별 유지비 비교 벤치마크",

    // Fuel Cost Calculator (9)
    fuelTitle: "유류비 & 주행 연비 계산기",
    fuelDesc: "이동 거리와 연비에 따른 필요 유류량, 총 주유비 및 100km당 주행 비용을 계산합니다.",
    tripDistance: "주행 거리 (km)",
    fuelUnit: "연비 단위 표기",
    literPer100Km: "100km당 리터 (L/100km, 유럽 표준)",
    kmPerLiter: "리터당 킬로미터 (km/L, 한국 표준)",
    fuelRequired: "필요 주유량",
    totalFuelCost: "총 예상 주유비",
    costPer100km: "100km 주행당 유류비",

    // EV Charging Cost Calculator (10)
    evTitle: "전기차 충전 요금 계산기",
    evDesc: "가정용 완속 충전과 공용 급속 충전 요금을 비교하고, 100km 주행당 충전 비용을 산출합니다.",
    batteryCapacity: "배터리 가용 용량 (kWh)",
    chargeStartPct: "충전 시작 잔량 (%)",
    chargeTargetPct: "목표 충전 잔량 (%)",
    chargerType: "충전 장소 및 요금제",
    homeWallbox: "가정용 월박스 (~€0.32/kWh)",
    publicAC: "공용 완속 AC 11-22 kW (~€0.45/kWh)",
    publicDC: "공용 초급속 DC / Ionity (~€0.65/kWh)",
    customTariff: "직접 입력 요금 (€/kWh)",
    evConsumption: "차량 전비 (kWh/100km)",
    energyAdded: "충전 배터리 전력량",
    sessionCost: "1회 충전 요금",
    costPer100KmEV: "전기차 100km 주행당 비용",
    combustionCompare: "동급 가솔린 차량(7L/100km, €1.75/L = €12.25/100km) 대비 비용 절감",

    // Holidays (11)
    holidaysTitle: "독일 법정 공휴일 조회기 (Gesetzliche Feiertage)",
    holidaysDesc: "16개 연방주별 법정 공휴일을 조회합니다. 부활절을 기준으로 가변 공휴일을 연도별로 정확히 자동 계산합니다.",
    selectYear: "조회 연도 선택",
    selectState: "거주 연방주 선택",
    allStatesOption: "전국 전체 공휴일 비교",
    nationwideBadge: "전국 공통 공휴일",
    stateSpecificBadge: "주별 지정 공휴일",
    upcomingHolidays: "다가오는 휴일",

    // Working Days (12)
    workingDaysTitle: "독일 근무일수 계산기 (Arbeitstage)",
    workingDaysDesc: "두 날짜 사이의 총 일수, 주말, 그리고 해당 연방주의 법정 공휴일을 제외한 순수 근무일수를 계산합니다.",
    startDate: "시작일",
    endDate: "종료일",
    excludeHolidays: "공휴일을 근무일에서 제외할까요?",
    calendarDays: "총 달력 일수",
    weekendDays: "주말 일수 (토요일/일요일)",
    holidaysCount: "평일과 겹치는 공휴일 수",
    netWorkingDays: "순수 근무일수 (영업일)",

    // Vacation Days (13)
    vacationTitle: "연차 일수 & 징검다리 휴가(Brückentage) 플래너",
    vacationDesc: "부여받은 유급 휴가 잔여 일수를 관리하고, 공휴일 전후 징검다리 연휴를 찾아 휴가를 극대화하세요.",
    annualEntitlement: "연간 법정/계약 유급 휴가 일수",
    daysAlreadyUsed: "이미 사용한 휴가 일수",
    plannedLeaveStart: "계획 중인 휴가 시작일",
    plannedLeaveEnd: "계획 중인 휴가 종료일",
    daysNeededForTrip: "휴가에 소요되는 순수 연차 일수",
    remainingLeave: "사용 후 잔여 연차 일수",
    bridgeDayTipTitle: "독일 직장인의 지혜: 브뤼켄타크 (Brückentage)",
    bridgeDayTipText: "독일에서는 목요일 공휴일(예: 예수승천일)과 주말 사이 낀 금요일을 '다리(Brücke)'라고 부릅니다. 이 금요일 하루만 연차를 신청하면 단 1일의 연차 소모로 4일 연속 황금연휴를 즐길 수 있습니다.",

    // Child Benefit (14)
    kindergeldTitle: "독일 아동수당(킨더겔트) 계산 & 가이드",
    kindergeldDesc: "자녀 1인당 월 250유로의 아동수당 총액, 수급 자격 연령 및 연말정산 공제와의 차이를 안내합니다.",
    kindergeldAmountCard: "자녀 1인당 월 250 €",
    perChildMonthly: "부모 소득이나 출생 순서와 무관하게 모든 자녀에게 동일 지급",
    kindergeldEligibilityTitle: "지급 대상 및 연령 기준",
    kindergeldEligibilityText: "• <b>출생 ~ 만 18세:</b> 독일 거주 모든 자녀 기본 수급.<br>• <b>만 18세 ~ 21세:</b> 구직 등록 중인 경우 수급 가능.<br>• <b>만 18세 ~ 25세:</b> 대학 재학, 아우스빌둥(직업교육), 자원봉사(FSJ/BFD) 중인 경우 연장 지급.<br>• <b>장애 아동:</b> 자립이 불가능한 경우 25세 이후에도 수급 가능.",
    kindergeldVsFreibetrag: "킨더겔트 vs 자녀소득공제(Kinderfreibetrag): 연말정산(Steuererklärung) 제출 시 국세청이 '유리성 심사(Günstigerprüfung)'를 자동 진행하여, 매월 받은 킨더겔트와 소득공제 세금 절감액 중 세입자에게 더 이득인 방식을 자동 적용해 줍니다.",
    numKidsInput: "수급 대상 자녀 수",
    monthlyKindergeldTotal: "월 아동수당 총 수령액",
    annualKindergeldTotal: "연간 아동수당 총 지원액",

    // School Holidays (15)
    schoolHolidaysTitle: "독일 학교 방학 일정 조회기 (Schulferien)",
    schoolHolidaysDesc: "연방주별 봄, 부활절, 여름, 가을, 크리스마스 방학 일정을 조회하여 가족 여행 및 휴가를 계획하세요.",
    holidayPeriod: "방학 명칭",
    dates: "방학 기간",
    duration: "기간 (일)",

    // Date Diff (16)
    dateDiffTitle: "두 날짜 간격 계산기 (D-Day & 기간)",
    dateDiffDesc: "두 날짜 사이의 일, 주, 개월, 연 단위 간격과 D-Day를 정밀하게 계산합니다.",
    dateOne: "시작일",
    dateTwo: "종료일",
    totalDays: "총 일수 (Days)",
    totalWeeks: "주 및 일수 (Weeks)",
    totalMonths: "개월 및 일수 (Months)",
    totalYears: "년, 개월 및 일수",

    // Age Calculator (17)
    ageTitle: "만 나이 & 생애 일수 계산기",
    ageDesc: "출생일을 기준으로 정확한 만 나이, 개월, 일수, 총 살아온 날들과 다음 생일까지 남은 날을 계산합니다.",
    birthDate: "생년월일 입력",
    exactAge: "정확한 만 나이",
    totalDaysLived: "태어난 지 지난 총 일수",
    nextBirthday: "다음 생일까지 남은 일수",
    bornOnDay: "태어난 요일",

    // Percentage Calculator (18)
    percentageTitle: "퍼센트 & 비율 만능 계산기",
    percentageDesc: "일상생활에서 자주 쓰이는 4가지 퍼센트 계산 모드를 한곳에서 즉시 계산합니다.",
    mode1Title: "Y의 X%는 얼마인가요?",
    mode2Title: "X는 Y의 몇 %인가요?",
    mode3Title: "값의 증가율 및 감소율",
    mode4Title: "두 값의 백분율 차이",

    // Unit Converter (19)
    unitTitle: "독일 생활 필수 단위 변환기",
    unitDesc: "거리, 무게, 온도, 부피 및 독일 아파트 면적(m² ↔ 평 / sq ft)을 상호 변환합니다.",
    lengthDist: "길이 및 거리 (km ↔ 마일)",
    weightMass: "무게 및 질량 (kg ↔ 파운드)",
    temperature: "온도 (°C 섭씨 ↔ °F 화씨)",
    volume: "부피 및 액체 (리터 ↔ 갤런)",
    areaApartment: "아파트 면적 (m² 평방미터 ↔ 평 / sq ft)",

    // Address & PLZ (20)
    addressTitle: "독일 주소 표기법 & 우편번호(PLZ) 가이드",
    addressDesc: "16개 연방주 정보, 주도, 인구수, PLZ 2자리 대역과 독일식 우편 주소 작성 규칙을 안내합니다.",
    addressGuideTitle: "독일 우편 주소 작성법 (표준 양식)",
    addressGuideText: "독일에서는 도로명 뒤에 건물 번호(번지)가 위치하며, 그 다음 줄에 5자리 우편번호(PLZ)와 도시명이 옵니다:<br><pre class='code-block'>Herr/Frau Max Mustermann\nMusterstraße 42\n10115 Berlin\nDEUTSCHLAND</pre>",
    stateCol: "연방주",
    capitalCol: "주도 (수도)",
    popCol: "인구",
    majorCitiesCol: "주요 도시",
    plzRangeCol: "PLZ 2자리 대역",

    // Glossary (21)
    glossaryTitle: "독일 생활 & 행정 필수 용어 사전",
    glossaryDesc: "전입신고, 슈파, 방송수신료, 튀프, 밤미테, 수습기간 등 독일 거주에 필수적인 40개 이상의 핵심 행정/법률 용어 해설집입니다.",
    searchGlossary: "용어 검색 (예: Anmeldung, Schufa, TÜV, GEZ...)",
    allGlossaryCats: "전체 카테고리",
    catBureaucracy: "행정 및 거주 등록",
    catHousing: "주거 및 임대차",
    catTax: "세금 및 금융",
    catWork: "직장 및 노동법",
    catHealth: "의료 및 사회보험",
    catTransport: "교통 및 자동차",
    catEveryday: "일상생활 상식",

    // Footer
    footerBrand: "German Life Toolkit",
    footerTagline: "독일 생활 및 직장인을 위한 스마트 유틸리티",
    footerPartOf: "yocto.co.kr 패밀리 서비스",
    footerLegal: "본 사이트의 도구들은 정보 제공 목적으로만 제공됩니다. 계산 결과는 추정치이며 개별 법률, 세무 또는 재정적 조언을 대신할 수 없습니다.",
    footerPrivacy: "개인정보 보호 정책",
    footerDisclaimer: "면책 조항",
    footerEcosystem: "Yocto 생태계",
    footerGithub: "GitHub 저장소",
    footerLinkedIn: "링크드인"
  }
};

let currentLang = localStorage.getItem('glt_lang') || 'en';

function t(key) {
  if (I18N[currentLang] && I18N[currentLang][key]) {
    return I18N[currentLang][key];
  }
  if (I18N.en && I18N.en[key]) {
    return I18N.en[key];
  }
  return key;
}

function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'ko') lang = 'en';
  currentLang = lang;
  localStorage.setItem('glt_lang', lang);
  document.documentElement.lang = lang;
  
  // Update toggle button text if exists
  const langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.textContent = lang === 'en' ? 'KO' : 'EN';
    langToggleBtn.setAttribute('title', lang === 'en' ? '한국어로 전환' : 'Switch to English');
  }

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search')) {
      el.placeholder = translated;
    } else {
      el.innerHTML = translated;
    }
  });

  // Trigger app re-render for dynamic content
  if (window.onLanguageChanged) {
    window.onLanguageChanged(lang);
  }
}
