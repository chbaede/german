/**
 * Tool Registry and Categories Data
 * German Life Toolkit (german.yocto.co.kr)
 */

const CATEGORIES_DATA = [
  {
    id: "money",
    icon: "💶",
    title: { en: "Money & Taxes", ko: "급여 & 세금" },
    desc: { en: "Salary, income tax estimation, tax classes, and bonus planning", ko: "독일 월급 실수령액, 소득세 추산, 세금 등급 비교 및 보너스 계산" }
  },
  {
    id: "housing",
    icon: "🏠",
    title: { en: "Housing & Rent", ko: "주거 & 월세" },
    desc: { en: "Kaltmiete, Nebenkosten, Warmmiete, and moving budget calculators", ko: "기본 월세(Kaltmiete), 관리비(Nebenkosten), 총 주거비 및 이사 예산 계산" }
  },
  {
    id: "transport",
    icon: "🚗",
    title: { en: "Transport & Driving", ko: "교통 & 차량" },
    desc: { en: "Total car ownership costs (ICE vs EV), fuel and EV charging costs", ko: "독일 자동차 유지비 총비용(내연기관 vs 전기차), 주유비 및 충전 요금" }
  },
  {
    id: "calendar",
    icon: "📅",
    title: { en: "Calendar & Work", ko: "달력 & 근무일" },
    desc: { en: "Public holidays by federal state, working days, and vacation planners", ko: "독일 16개 주별 공휴일, 순수 근무일수 계산 및 연차·징검다리 휴가 플래너" }
  },
  {
    id: "family",
    icon: "👨‍👩‍👧",
    title: { en: "Family & School", ko: "가족 & 학교" },
    desc: { en: "Kindergeld child benefits reference and German school vacation finder", ko: "아동수당(킨더겔트) 계산 및 독일 연방주별 초·중·고 방학 일정" }
  },
  {
    id: "everyday",
    icon: "🧾",
    title: { en: "Everyday Utilities", ko: "일상 유틸리티" },
    desc: { en: "Date difference, exact age, percentages, and German unit converters", ko: "날짜 간격, 만 나이, 퍼센트 비율 계산 및 미터법 단위 변환" }
  },
  {
    id: "reference",
    icon: "🇩🇪",
    title: { en: "Germany Reference", ko: "독일 생활 백과" },
    desc: { en: "16 Bundesländer, postal codes (PLZ), and essential expat glossary", ko: "16개 연방주, 우편번호(PLZ) 체계 및 전입·행정 필수 독일어 용어 사전" }
  }
];

const TOOLS_DATA = [
  // 1. Salary Calculator
  {
    id: "salary",
    category: "money",
    icon: "💶",
    popular: true,
    title: {
      en: "Salary Calculator (Brutto → Netto)",
      ko: "독일 월급 실수령액 계산기 (세전 → 세후)"
    },
    desc: {
      en: "Calculate estimated net salary with German tax classes (I-VI), social insurances, and church tax.",
      ko: "독일 소득세 등급(1~6등급), 4대 사회보험 및 종교세를 반영한 세후 월 실수령액을 추산합니다."
    },
    tags: {
      en: ["Salary", "Brutto", "Netto", "Taxes", "Income Tax", "Steuerklasse", "Social Security"],
      ko: ["월급", "급여", "세전", "세후", "소득세", "세금등급", "사회보험", "연봉"]
    }
  },
  // 2. Net -> Gross Calculator
  {
    id: "net-to-gross",
    category: "money",
    icon: "🔄",
    popular: true,
    title: {
      en: "Net → Gross Calculator (Netto → Brutto)",
      ko: "역산 급여 계산기 (목표 세후 → 필요 세전)"
    },
    desc: {
      en: "Find out how much gross salary (Brutto) you need to negotiate to reach your desired take-home pay.",
      ko: "원하는 목표 세후 실수령액을 얻기 위해 연봉 협상 시 요구해야 할 총급여(Brutto)를 역산합니다."
    },
    tags: {
      en: ["Reverse Salary", "Net to Gross", "Target Net", "Salary Negotiation"],
      ko: ["역산", "목표실수령액", "연봉협상", "필요세전급여"]
    }
  },
  // 3. Annual Salary Calculator
  {
    id: "annual-salary",
    category: "money",
    icon: "📈",
    popular: false,
    title: {
      en: "Annual Compensation Calculator",
      ko: "연봉 및 보너스 합산 계산기"
    },
    desc: {
      en: "Calculate total yearly compensation including monthly base pay, 13th month, and bonus payments.",
      ko: "기본 월급에 13월의 보너스, 휴가비(Urlaubsgeld), 성과급을 합산하여 연간 총소득을 계산합니다."
    },
    tags: {
      en: ["Annual Salary", "Bonus", "13th Salary", "Total Compensation"],
      ko: ["연봉", "보너스", "성과급", "13월급여", "총보수"]
    }
  },
  // 4. Tax Class Comparison
  {
    id: "tax-class",
    category: "money",
    icon: "⚖️",
    popular: true,
    title: {
      en: "Tax Class Comparison (Steuerklassen I–VI)",
      ko: "독일 세금 등급 비교 가이드 (1~6등급)"
    },
    desc: {
      en: "Compare German income tax brackets, typical use cases, single-parent perks, and married couple combinations (3/5 vs 4/4).",
      ko: "독일 세금 1~6등급의 적용 대상, 특징, 유의사항 및 맞벌이 부부 조합(3/5 vs 4/4 vs 팩터)을 한눈에 비교합니다."
    },
    tags: {
      en: ["Tax Classes", "Steuerklasse", "Married Couples", "Class 3 and 5", "Class 4"],
      ko: ["세금등급", "슈타이어클라세", "부부세금", "3등급", "5등급", "4등급"]
    }
  },
  // 5. Rent Calculator
  {
    id: "rent",
    category: "housing",
    icon: "🏠",
    popular: true,
    title: {
      en: "Rent & Living Cost Calculator",
      ko: "월세 & 주거비 총비용 계산기"
    },
    desc: {
      en: "Compute total housing expenses including Kaltmiete, Nebenkosten, heating, electricity, internet, and GEZ fee.",
      ko: "순수 월세(Kaltmiete), 관리비, 난방, 전기세, 인터넷 및 공영방송 수신료를 합산한 실제 주거비를 계산합니다."
    },
    tags: {
      en: ["Rent", "Kaltmiete", "Warmmiete", "Nebenkosten", "GEZ", "Apartment"],
      ko: ["월세", "칼트미테", "밤미테", "관리비", "방송수신료", "아파트"]
    }
  },

  // 7. Moving Cost Calculator
  {
    id: "moving",
    category: "housing",
    icon: "📦",
    popular: false,
    title: {
      en: "Moving Cost Calculator (Umzugskosten)",
      ko: "독일 이사 비용 견적 계산기"
    },
    desc: {
      en: "Estimate total relocation costs: van rental, moving company, boxes, cleaning, deposit, and fitted kitchen (EBK).",
      ko: "용달 트럭 대여, 포장이사, 박스, 퇴거 청소, 보증금 및 주방 가구(EBK) 설치비를 종합 산출합니다."
    },
    tags: {
      en: ["Moving", "Umzug", "Truck Rental", "Boxes", "Kitchen", "EBK"],
      ko: ["이사", "이사비용", "움쭉", "트럭렌트", "주방가구", "보증금"]
    }
  },
  // 8. Car Cost Calculator
  {
    id: "car-cost",
    category: "transport",
    icon: "🚗",
    popular: true,
    title: {
      en: "Car Total Cost of Ownership (TCO)",
      ko: "독일 자동차 총 유지비 계산기 (TCO)"
    },
    desc: {
      en: "Calculate monthly, annual, and per-km car expenses with an instant comparison between Gas, Hybrid, and Electric.",
      ko: "월 할부금, 보험료, 자동차세, 유류비, 정기검사(TÜV)를 합산하여 가솔린 vs 하이브리드 vs 전기차 유지비를 비교합니다."
    },
    tags: {
      en: ["Car Costs", "Auto", "Kfz-Steuer", "Insurance", "TCO", "Electric Vehicle"],
      ko: ["자동차", "유지비", "자동차세", "차량보험", "전기차비교", "TCO"]
    }
  },
  // 9. Fuel Cost Calculator
  {
    id: "fuel-cost",
    category: "transport",
    icon: "⛽",
    popular: false,
    title: {
      en: "Fuel Cost Calculator",
      ko: "유류비 & 주행 연비 계산기"
    },
    desc: {
      en: "Calculate fuel required, total trip cost, and cost per 100km. Supports both L/100km and km/L units.",
      ko: "주행 거리, 연비(L/100km 및 km/L 지원), 유가를 바탕으로 총 주유비와 100km당 비용을 계산합니다."
    },
    tags: {
      en: ["Fuel", "Gasoline", "Diesel", "Trip Cost", "L/100km"],
      ko: ["유류비", "기름값", "연비", "휘발유", "디젤", "주행비용"]
    }
  },
  // 10. EV Charging Cost Calculator
  {
    id: "ev-charging",
    category: "transport",
    icon: "⚡",
    popular: false,
    title: {
      en: "EV Charging Cost Calculator",
      ko: "전기차 충전 요금 계산기"
    },
    desc: {
      en: "Compare home charging (€/kWh) vs public AC vs DC high-power charging, with cost per 100km and savings.",
      ko: "가정용 완속 충전과 공용 AC/DC 급속 충전 요금을 비교하고, 100km 주행당 비용을 산출합니다."
    },
    tags: {
      en: ["EV", "Electric Car", "Charging", "kWh", "Ionity", "Home Wallbox"],
      ko: ["전기차", "충전비", "전기요금", "급속충전", "월박스"]
    }
  },
  // 11. German Public Holidays
  {
    id: "holidays",
    category: "calendar",
    icon: "📅",
    popular: true,
    title: {
      en: "German Public Holidays (Feiertage)",
      ko: "독일 법정 공휴일 조회기"
    },
    desc: {
      en: "Explore federal and state-specific public holidays across all 16 Bundesländer with dynamic Easter calculation.",
      ko: "전국 공통 공휴일과 16개 연방주별 특화 공휴일(성체축일, 종교개혁일 등)을 연도별로 조회합니다."
    },
    tags: {
      en: ["Holidays", "Feiertage", "Bundesland", "Vacation", "Long Weekends"],
      ko: ["공휴일", "독일휴일", "빨간날", "파이어탁", "연휴"]
    }
  },
  // 12. Working Days Calculator
  {
    id: "working-days",
    category: "calendar",
    icon: "💼",
    popular: false,
    title: {
      en: "Working Days Calculator (Arbeitstage)",
      ko: "근무일수 & 영업일 계산기"
    },
    desc: {
      en: "Calculate total calendar days, weekends, and net working days between two dates, excluding state holidays.",
      ko: "선택한 두 날짜 사이의 총 일수, 주말, 그리고 해당 연방주의 법정 공휴일을 제외한 순수 근무일수를 계산합니다."
    },
    tags: {
      en: ["Working Days", "Business Days", "Arbeitstage", "Date Range"],
      ko: ["근무일", "영업일", "일수계산", "출근일"]
    }
  },
  // 13. Vacation Days Calculator
  {
    id: "vacation",
    category: "calendar",
    icon: "🏖️",
    popular: true,
    title: {
      en: "Vacation Days & Bridge Day Planner",
      ko: "연차 일수 & 징검다리 휴가(Brückentage) 플래너"
    },
    desc: {
      en: "Track annual paid leave balance and discover smart bridge-day (Brückentage) combos to maximize time off.",
      ko: "연간 부여된 휴가 잔여 일수를 관리하고, 공휴일 전후 징검다리 휴가를 활용해 연휴를 극대화하는 팁을 제공합니다."
    },
    tags: {
      en: ["Vacation", "Urlaub", "Brückentage", "Bridge Days", "Paid Leave"],
      ko: ["휴가", "연차", "브뤼켄타크", "징검다리연휴", "우어라웁"]
    }
  },
  // 14. Child Benefit Reference
  {
    id: "kindergeld",
    category: "family",
    icon: "👶",
    popular: true,
    title: {
      en: "Child Benefit Reference (Kindergeld)",
      ko: "독일 아동수당(킨더겔트) 계산 & 가이드"
    },
    desc: {
      en: "Calculate Kindergeld payments (€259/month per child in 2026), view past historical amounts, and projected 2027 increase.",
      ko: "2026년 기준 자녀 1인당 월 259유로의 아동수당, 이전 수령액 변천사 및 2027년 인상 예정액을 확인하세요."
    },
    tags: {
      en: ["Kindergeld", "Child Benefit", "Familienkasse", "Children", "Kinderfreibetrag"],
      ko: ["킨더겔트", "아동수당", "자녀수당", "가족지원", "패밀리엔카세"]
    }
  },
  // 15. School Holiday Finder
  {
    id: "school-holidays",
    category: "family",
    icon: "🎒",
    popular: false,
    title: {
      en: "School Holiday Finder (Schulferien)",
      ko: "독일 학교 방학 일정 조회기"
    },
    desc: {
      en: "Official school holidays (Easter, Whitsun, Summer, Autumn, Christmas) by federal state for travel and family planning.",
      ko: "연방주별 봄, 부활절, 여름, 가을, 크리스마스 방학 일정을 조회하여 가족 여행 및 휴가를 계획하세요."
    },
    tags: {
      en: ["School Holidays", "Schulferien", "Sommerferien", "KMK", "Family Travel"],
      ko: ["방학", "학교방학", "여름방학", "가족여행", "슐페리엔"]
    }
  },
  // 16. Date Difference Calculator
  {
    id: "date-diff",
    category: "everyday",
    icon: "⏳",
    popular: false,
    title: {
      en: "Date Difference Calculator",
      ko: "두 날짜 간격 계산기 (D-Day & 기간)"
    },
    desc: {
      en: "Accurately compute days, weeks, months, years, and total business days between any two dates.",
      ko: "두 날짜 사이의 정확한 일, 주, 개월, 연 단위 간격과 D-Day 카운트다운을 즉시 계산합니다."
    },
    tags: {
      en: ["Date Diff", "Duration", "Days Between", "D-Day", "Calendar"],
      ko: ["날짜간격", "디데이", "기간계산", "일수계산"]
    }
  },
  // 17. Age Calculator
  {
    id: "age-calc",
    category: "everyday",
    icon: "🎂",
    popular: false,
    title: {
      en: "Exact Age Calculator",
      ko: "만 나이 & 생애 일수 계산기"
    },
    desc: {
      en: "Calculate exact international age in years, months, and days, total days lived, and countdown to your next birthday.",
      ko: "출생일을 기준으로 정확한 만 나이, 개월, 일수, 총 살아온 날들과 다음 생일까지의 남은 일수를 계산합니다."
    },
    tags: {
      en: ["Age", "Birthday", "International Age", "Days Lived"],
      ko: ["만나이", "생일", "나이계산", "생애일수"]
    }
  },
  // 18. Percentage Calculator
  {
    id: "percentage",
    category: "everyday",
    icon: "📊",
    popular: false,
    title: {
      en: "Percentage Calculator",
      ko: "퍼센트 & 비율 만능 계산기"
    },
    desc: {
      en: "4 practical everyday modes: X% of Y, what % is X of Y, percentage increase/decrease, and value differences.",
      ko: "X의 Y%, 비율 계산, 전년/전월 대비 증감률, 두 값의 백분율 차이를 손쉽게 산출합니다."
    },
    tags: {
      en: ["Percentage", "Ratio", "Increase", "Decrease", "Discount"],
      ko: ["퍼센트", "백분율", "할인율", "증감률", "비율"]
    }
  },
  // 19. Unit Converter
  {
    id: "unit-converter",
    category: "everyday",
    icon: "📏",
    popular: false,
    title: {
      en: "German & Metric Unit Converter",
      ko: "독일 생활 필수 단위 변환기"
    },
    desc: {
      en: "Convert km ↔ miles, kg ↔ lb, °C ↔ °F, liters ↔ gallons, and m² ↔ sq ft for German apartment floor plans.",
      ko: "km-마일, kg-파운드, 섭씨-화씨, 리터-갤런 및 독일 아파트 크기 평방미터(m²)-평/sq ft를 변환합니다."
    },
    tags: {
      en: ["Units", "Metric", "Imperial", "m2", "Square Feet", "Temperature", "Weight"],
      ko: ["단위변환", "미터법", "평방미터", "온도", "무게", "아파트평수"]
    }
  },
  // 20. German Address / Postal Code Helper
  {
    id: "address-plz",
    category: "reference",
    icon: "📮",
    popular: true,
    title: {
      en: "German Address & PLZ Postal Code Guide",
      ko: "독일 주소 표기법 & 우편번호(PLZ) 가이드"
    },
    desc: {
      en: "Explore all 16 federal states, capital cities, population, PLZ ranges, and proper German mailing address format.",
      ko: "16개 연방주 수도, 인구, 대표 도시, 우편번호(PLZ) 2자리 대역과 독일식 우편 주소 작성법을 확인하세요."
    },
    tags: {
      en: ["Address", "Postal Code", "PLZ", "Bundesland", "Mail", "Post"],
      ko: ["독일주소", "우편번호", "PLZ", "연방주", "주소작성법"]
    }
  },
  // 21. German Abbreviations & Glossary
  {
    id: "glossary",
    category: "reference",
    icon: "📖",
    popular: true,
    title: {
      en: "German Expat Glossary & Abbreviations",
      ko: "독일 생활 & 행정 필수 용어 사전"
    },
    desc: {
      en: "Searchable glossary of 40+ key terms: Anmeldung, Schufa, Rundfunkbeitrag, TÜV, Kaltmiete, Probezeit, and more.",
      ko: "전입신고, 슈파, 방송수신료, 튀프, 밤미테, 수습기간 등 독일 거주에 필수적인 행정/법률 용어 해설집입니다."
    },
    tags: {
      en: ["Glossary", "Abbreviations", "Anmeldung", "Schufa", "TÜV", "Expats", "German Words"],
      ko: ["용어사전", "약어", "안멜둥", "슈파", "괴츠", "독일어용어", "생활가이드"]
    }
  }
];

