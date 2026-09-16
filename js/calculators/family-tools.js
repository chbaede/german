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
    futureStatus: "government bill / announced proposal / not yet enacted",
    noteEn: "Past rates and the 2026 rate (€259) are legally enacted. Future rates for 2027 (€267) and 2028 (€272) are government bill / announced proposal / not yet enacted.",
    noteKo: "과거 및 2026년 금액(259 €)은 법률로 확정된 법정 수령액입니다. 2027년(267 €) 및 2028년(272 €) 금액은 정부 입법안/발표 추진안(government bill / announced proposal / not yet enacted)이며 최종 입법 완료 전까지는 법적 확정 수치가 아닙니다."
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
      rateDescEn: "€267 per child (government bill / announced proposal / not yet enacted)",
      rateDescKo: "자녀 1인당 267 € (정부 입법안/발표 추진안 — 미확정)",
      monthlyPerChild: 267,
      statusCategory: "announced",
      statusEn: "government bill / announced proposal / not yet enacted",
      statusKo: "정부 입법안 / 발표 추진안 (미확정)",
      isCurrent: false,
      isEnacted: false,
      isFuture: true
    },
    {
      periodEn: "2028",
      periodKo: "2028년",
      rateDescEn: "€272 per child (government bill / announced proposal / not yet enacted)",
      rateDescKo: "자녀 1인당 272 € (정부 입법안/발표 추진안 — 미확정)",
      monthlyPerChild: 272,
      statusCategory: "announced",
      statusEn: "government bill / announced proposal / not yet enacted",
      statusKo: "정부 입법안 / 발표 추진안 (미확정)",
      isCurrent: false,
      isEnacted: false,
      isFuture: true
    }
  ],

  calculateKindergeld(numChildren, year = 2026) {
    const count = Math.max(0, parseInt(numChildren || 1, 10));
    const targetYear = parseInt(year, 10);

    let rate = null;
    let isEnacted = false;
    let isProposal = false;
    let isTiered = false;
    let monthlyTotal = 0;
    let tieredBreakdown = null;

    if (targetYear === 2026) {
      rate = 259;
      monthlyTotal = count * rate;
      isEnacted = true;
    } else if (targetYear === 2025) {
      rate = 255;
      monthlyTotal = count * rate;
      isEnacted = true;
    } else if (targetYear === 2023 || targetYear === 2024) {
      rate = 250;
      monthlyTotal = count * rate;
      isEnacted = true;
    } else if (targetYear === 2021 || targetYear === 2022) {
      isTiered = true;
      isEnacted = true;
      const childRates = [];
      let total = 0;
      for (let i = 1; i <= count; i++) {
        let childRate = 219;
        if (i === 1 || i === 2) childRate = 219;
        else if (i === 3) childRate = 225;
        else childRate = 250;
        childRates.push(childRate);
        total += childRate;
      }
      monthlyTotal = total;
      rate = count > 0 ? Number((monthlyTotal / count).toFixed(2)) : 219;
      tieredBreakdown = childRates;
    } else if (targetYear === 2027) {
      rate = 267;
      monthlyTotal = count * rate;
      isProposal = true;
    } else if (targetYear === 2028) {
      rate = 272;
      monthlyTotal = count * rate;
      isProposal = true;
    } else {
      // Unsupported / unverified year: Return clear structured unavailable result
      return {
        unavailable: true,
        error: "KINDERGELD_DATA_UNAVAILABLE",
        year: targetYear,
        numChildren: count,
        messageEn: `Official Kindergeld benefit rate is not available for ${targetYear}. Verified enacted years: 2021–2026 (with 2027–2028 announced government proposals).`,
        messageKo: `${targetYear}년도 아동수당(Kindergeld) 데이터가 제공되지 않습니다. 공식 지원/검증 연도: 2021년~2026년 (2027~2028년은 정부 발표안).`
      };
    }

    const annualTotal = monthlyTotal * 12;

    const timelineComparison = this.RATES_TIMELINE.map(item => {
      let monthlyFamilyTotal = 0;
      if (item.periodEn === "2021 – 2022") {
        let t = 0;
        for (let i = 1; i <= count; i++) {
          if (i <= 2) t += 219;
          else if (i === 3) t += 225;
          else t += 250;
        }
        monthlyFamilyTotal = t;
      } else {
        monthlyFamilyTotal = count * item.monthlyPerChild;
      }
      return {
        ...item,
        monthlyFamilyTotal,
        annualFamilyTotal: monthlyFamilyTotal * 12
      };
    });

    // Explicitly separate enacted/current rates from announced future changes
    const enactedRates = timelineComparison.filter(item => item.statusCategory === "enacted");
    const announcedRates = timelineComparison.filter(item => item.statusCategory === "announced");

    return {
      year: targetYear,
      numChildren: count,
      ratePerChild: rate,
      monthlyTotal,
      annualTotal,
      isEnacted,
      isProposal,
      isTiered,
      tieredBreakdown,
      status: isEnacted ? "enacted" : "government bill / announced proposal / not yet enacted",
      timelineComparison,
      enactedRates,
      announcedRates,
      source: "BMF / Familienkasse",
      disclaimerEn: isProposal
        ? `Future values for ${targetYear} (€${rate}/child) are a government bill / announced proposal / not yet enacted into statutory law.`
        : "Past and 2026 rates are legally enacted by the German Federal Ministry of Finance (BMF) and Familienkasse.",
      disclaimerKo: isProposal
        ? `${targetYear}년 금액(${rate} €)은 정부 입법안/발표 추진안(government bill / announced proposal / not yet enacted)이며 최종 입법 완료 전까지는 법적 확정 수치가 아닙니다.`
        : "과거 및 2026년 금액은 독일 연방재무부(BMF) 및 연방고용청(Familienkasse) 법령으로 확정된 수치입니다."
    };
  },

  getSchoolHolidaysForState(year, stateCode) {
    return GERMAN_SCHOOL_HOLIDAYS.getSchoolHolidays(year, stateCode);
  }
};

