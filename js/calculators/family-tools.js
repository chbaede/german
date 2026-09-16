/**
 * German Family Tools: Kindergeld Reference & School Holiday Finder
 */
const FamilyTools = {
  // Current Kindergeld rate (2026 기준): €259 / month per child (enacted statutory rate)
  KINDERGELD_PER_CHILD: 259,

  // Official Legal Source & Metadata
  source: {
    institution: "BMF / Familienkasse",
    reference: "Bundesfinanzministerium (BMF) / Bundesagentur für Arbeit (Familienkasse)",
    status2026: "Enacted statutory rate (§ 66 EStG / BKGG)",
    futureStatus: "Announced / proposed government draft amounts, subject to final parliamentary enactment",
    noteEn: "Past rates and the 2026 rate (€259) are legally enacted. Future rates for 2027 and 2028 are announced / proposed figures subject to final parliamentary enactment.",
    noteKo: "과거 및 2026년 금액(259 €)은 법률로 확정된 법정 수령액입니다. 2027년(267 €) 및 2028년(272 €) 금액은 정부 발표/법안 기준 추진안이며 최종 입법 완료 전까지는 법적 확정 수치가 아닙니다."
  },

  // Historical, enacted, and announced future rates timeline
  RATES_TIMELINE: [
    {
      periodEn: "2021 – 2022",
      periodKo: "2021년 ~ 2022년",
      rateDescEn: "€219 (1st/2nd child), €225 (3rd), €250 (4th+)",
      rateDescKo: "1·2자녀 219 €, 3자녀 225 €, 4자녀 250 €",
      monthlyPerChild: 219,
      statusCategory: "enacted",
      statusEn: "Past (Enacted)",
      statusKo: "이전 확정",
      isCurrent: false,
      isEnacted: true,
      isFuture: false
    },
    {
      periodEn: "2023 – 2024",
      periodKo: "2023년 ~ 2024년",
      rateDescEn: "€250 per child (Unified rate)",
      rateDescKo: "자녀 1인당 일괄 250 €",
      monthlyPerChild: 250,
      statusCategory: "enacted",
      statusEn: "Past (Enacted)",
      statusKo: "이전 확정",
      isCurrent: false,
      isEnacted: true,
      isFuture: false
    },
    {
      periodEn: "2025",
      periodKo: "2025년",
      rateDescEn: "€255 per child (+€5 increase)",
      rateDescKo: "자녀 1인당 255 € (+5 € 인상)",
      monthlyPerChild: 255,
      statusCategory: "enacted",
      statusEn: "Past (Enacted)",
      statusKo: "이전 확정",
      isCurrent: false,
      isEnacted: true,
      isFuture: false
    },
    {
      periodEn: "2026 (Current)",
      periodKo: "2026년 (현재 확정)",
      rateDescEn: "€259 per child (+€4 increase)",
      rateDescKo: "자녀 1인당 259 € (+4 € 추가 인상)",
      monthlyPerChild: 259,
      statusCategory: "enacted",
      statusEn: "Enacted / Current Rate",
      statusKo: "법정 확정 / 현재",
      isCurrent: true,
      isEnacted: true,
      isFuture: false
    },
    {
      periodEn: "2027",
      periodKo: "2027년",
      rateDescEn: "€267 per child (announced / proposed for 2027)",
      rateDescKo: "자녀 1인당 267 € (2027년 인상 발표/추진안)",
      monthlyPerChild: 267,
      statusCategory: "announced",
      statusEn: "announced / proposed for 2027",
      statusKo: "2027년 인상 발표/추진안",
      isCurrent: false,
      isEnacted: false,
      isFuture: true
    },
    {
      periodEn: "2028",
      periodKo: "2028년",
      rateDescEn: "€272 per child (announced / proposed for 2028)",
      rateDescKo: "자녀 1인당 272 € (2028년 인상 발표/추진안)",
      monthlyPerChild: 272,
      statusCategory: "announced",
      statusEn: "announced / proposed for 2028",
      statusKo: "2028년 인상 발표/추진안",
      isCurrent: false,
      isEnacted: false,
      isFuture: true
    }
  ],

  calculateKindergeld(numChildren, year = 2026) {
    const count = Math.max(0, parseInt(numChildren || 1, 10));
    let rate = this.KINDERGELD_PER_CHILD;
    if (year === 2025) rate = 255;
    else if (year === 2027) rate = 267;
    else if (year >= 2028) rate = 272;
    else if (year <= 2024 && year >= 2023) rate = 250;

    const monthlyTotal = count * rate;
    const annualTotal = monthlyTotal * 12;

    const timelineComparison = this.RATES_TIMELINE.map(item => ({
      ...item,
      monthlyFamilyTotal: count * item.monthlyPerChild,
      annualFamilyTotal: count * item.monthlyPerChild * 12
    }));

    // Explicitly separate enacted/current rates from announced future changes
    const enactedRates = timelineComparison.filter(item => item.statusCategory === "enacted");
    const announcedRates = timelineComparison.filter(item => item.statusCategory === "announced");

    return {
      year,
      numChildren: count,
      ratePerChild: rate,
      monthlyTotal,
      annualTotal,
      timelineComparison,
      enactedRates,
      announcedRates,
      source: "BMF / Familienkasse",
      disclaimerEn: "Future values for 2027 and 2028 are announced / proposed and not legally final until parliamentary enactment.",
      disclaimerKo: "2027년 및 2028년 금액은 정부 발표/법안 기준 추진안이며 최종 입법 완료 전까지는 법적 확정 수치가 아닙니다."
    };
  },

  getSchoolHolidaysForState(year, stateCode) {
    return GERMAN_SCHOOL_HOLIDAYS.getSchoolHolidays(year, stateCode);
  }
};

