/**
 * German Family Tools: Kindergeld Reference & School Holiday Finder
 */
const FamilyTools = {
  // Current Kindergeld rate (2026 기준): €259 / month per child
  KINDERGELD_PER_CHILD: 259,

  // Historical and future rates timeline
  RATES_TIMELINE: [
    {
      periodEn: "2021 – 2022",
      periodKo: "2021년 ~ 2022년",
      rateDescEn: "€219 (1st/2nd child), €225 (3rd), €250 (4th+)",
      rateDescKo: "1·2자녀 219 €, 3자녀 225 €, 4자녀 250 €",
      monthlyPerChild: 219,
      statusEn: "Past",
      statusKo: "이전"
    },
    {
      periodEn: "2023 – 2024",
      periodKo: "2023년 ~ 2024년",
      rateDescEn: "€250 per child (Unified rate)",
      rateDescKo: "자녀 1인당 일괄 250 €",
      monthlyPerChild: 250,
      statusEn: "Past",
      statusKo: "이전"
    },
    {
      periodEn: "2025",
      periodKo: "2025년",
      rateDescEn: "€255 per child (+€5 increase)",
      rateDescKo: "자녀 1인당 255 € (+5 € 인상)",
      monthlyPerChild: 255,
      statusEn: "Past",
      statusKo: "이전"
    },
    {
      periodEn: "2026 (Current)",
      periodKo: "2026년 (현재 기준)",
      rateDescEn: "€259 per child (+€4 increase)",
      rateDescKo: "자녀 1인당 259 € (+4 € 추가 인상)",
      monthlyPerChild: 259,
      statusEn: "Current Rate",
      statusKo: "현재 수령액",
      isCurrent: true
    },
    {
      periodEn: "From 2027 (Upcoming)",
      periodKo: "2027년 이후 (인상 확정/예정)",
      rateDescEn: "€263 per child (+€4 planned increase)",
      rateDescKo: "자녀 1인당 263 € (+4 € 추가 인상 예정)",
      monthlyPerChild: 263,
      statusEn: "Upcoming Increase",
      statusKo: "인상 예정",
      isFuture: true
    }
  ],

  calculateKindergeld(numChildren) {
    const count = Math.max(0, parseInt(numChildren || 1, 10));
    const monthlyTotal = count * this.KINDERGELD_PER_CHILD;
    const annualTotal = monthlyTotal * 12;

    const timelineComparison = this.RATES_TIMELINE.map(item => ({
      ...item,
      monthlyFamilyTotal: count * item.monthlyPerChild,
      annualFamilyTotal: count * item.monthlyPerChild * 12
    }));

    return {
      numChildren: count,
      ratePerChild: this.KINDERGELD_PER_CHILD,
      monthlyTotal,
      annualTotal,
      timelineComparison
    };
  },

  getSchoolHolidaysForState(year, stateCode) {
    return GERMAN_SCHOOL_HOLIDAYS.getSchoolHolidays(year, stateCode);
  }
};

