/**
 * Everyday Utilities: Date Diff, Exact Age, Percentage, Unit Converter
 */
const EverydayTools = {
  /**
   * Date difference breakdown
   */
  calculateDateDiff(d1Str, d2Str) {
    if (!d1Str || !d2Str) return null;
    let d1 = new Date(d1Str + "T00:00:00Z");
    let d2 = new Date(d2Str + "T00:00:00Z");

    if (d1 > d2) {
      const temp = d1;
      d1 = d2;
      d2 = temp;
    }

    const diffMs = d2.getTime() - d1.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remDaysAfterWeeks = totalDays % 7;

    // Detailed years, months, days calculation
    let y1 = d1.getUTCFullYear(), m1 = d1.getUTCMonth(), day1 = d1.getUTCDate();
    let y2 = d2.getUTCFullYear(), m2 = d2.getUTCMonth(), day2 = d2.getUTCDate();

    let years = y2 - y1;
    let months = m2 - m1;
    let days = day2 - day1;

    if (days < 0) {
      // borrow days from previous month
      months--;
      const prevMonthLastDay = new Date(Date.UTC(y2, m2, 0)).getUTCDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMonthsApprox = years * 12 + months;

    return {
      totalDays,
      totalWeeks,
      remDaysAfterWeeks,
      totalMonthsApprox,
      years,
      months,
      days
    };
  },

  /**
   * Exact age calculator
   */
  calculateAge(birthDateStr) {
    if (!birthDateStr) return null;
    const now = new Date();
    const todayUtc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const birth = new Date(birthDateStr + "T00:00:00Z");

    if (birth > todayUtc) return null;

    const diffRes = this.calculateDateDiff(birthDateStr, GERMAN_HOLIDAYS.formatDate(todayUtc));

    // Next birthday countdown
    let nextBdayYear = todayUtc.getUTCFullYear();
    let nextBday = new Date(Date.UTC(nextBdayYear, birth.getUTCMonth(), birth.getUTCDate()));
    if (nextBday < todayUtc) {
      nextBday = new Date(Date.UTC(nextBdayYear + 1, birth.getUTCMonth(), birth.getUTCDate()));
    }
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - todayUtc.getTime()) / (1000 * 60 * 60 * 24));

    // Day of the week born
    const dayOfWeek = birth.toLocaleDateString(currentLang === 'ko' ? 'ko-KR' : 'en-US', {
      weekday: 'long',
      timeZone: 'UTC'
    });

    return {
      years: diffRes.years,
      months: diffRes.months,
      days: diffRes.days,
      totalDaysLived: diffRes.totalDays,
      daysUntilNextBday,
      dayOfWeek
    };
  },

  /**
   * Percentage modes
   */
  calcPercentMode1(x, y) {
    // X% of Y
    return (x / 100) * y;
  },

  calcPercentMode2(x, y) {
    // X is what % of Y
    if (y === 0) return 0;
    return (x / y) * 100;
  },

  calcPercentMode3(x, y) {
    // % increase/decrease from X to Y
    if (x === 0) return 0;
    return ((y - x) / x) * 100;
  },

  calcPercentMode4(x, y) {
    // % difference between X and Y
    const avg = (Math.abs(x) + Math.abs(y)) / 2;
    if (avg === 0) return 0;
    return (Math.abs(x - y) / avg) * 100;
  },

  /**
   * Unit conversions
   */
  convertUnit(type, val, fromUnit) {
    const v = GLTUtils.parseNumber(val, 0);
    switch (type) {
      case "length":
        // km <-> miles
        if (fromUnit === "km") {
          return { miles: v * 0.621371 };
        } else {
          return { km: v / 0.621371 };
        }
      case "weight":
        // kg <-> lb
        if (fromUnit === "kg") {
          return { lb: v * 2.20462 };
        } else {
          return { kg: v / 2.20462 };
        }
      case "temperature":
        // C <-> F
        if (fromUnit === "c") {
          return { f: (v * 9/5) + 32 };
        } else {
          return { c: (v - 32) * 5/9 };
        }
      case "volume":
        // liters <-> gallons (US)
        if (fromUnit === "l") {
          return { gal: v * 0.264172 };
        } else {
          return { l: v / 0.264172 };
        }
      case "area":
        // m2 <-> sqft & Korean pyeong
        if (fromUnit === "m2") {
          return { sqft: v * 10.7639, pyeong: v * 0.3025 };
        } else {
          return { m2: v / 10.7639, pyeong: (v / 10.7639) * 0.3025 };
        }
      default:
        return {};
    }
  }
};
