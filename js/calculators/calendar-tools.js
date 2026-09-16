/**
 * German Calendar Tools (Holidays, Working Days, Vacation & Brückentage Planner)
 */
const CalendarTools = {
  /**
   * Get public holidays formatted for display
   * @param {number} year
   * @param {string} stateCode
   * @param {Object} [options]
   */
  getHolidaysList(year, stateCode, options = {}) {
    const list = GERMAN_HOLIDAYS.getHolidaysForYear(year, stateCode, options);
    const now = new Date();
    const todayStr = GERMAN_HOLIDAYS.formatDate(now);
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';

    return list.map(h => {
      const hDate = new Date(h.date + "T00:00:00Z");
      const dayOfWeek = hDate.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
        weekday: 'short',
        timeZone: 'UTC'
      });
      const isPast = h.date < todayStr;
      const isUpcoming = h.date >= todayStr;

      return {
        ...h,
        dayOfWeek,
        isPast,
        isUpcoming
      };
    });
  },

  /**
   * Get structured holiday breakdown with formatted weekday names and past/upcoming flags
   * @param {number} year
   * @param {string} stateCode
   * @param {Object} [options]
   */
  getHolidaysBreakdown(year, stateCode, options = {}) {
    const rawBreakdown = GERMAN_HOLIDAYS.getHolidaysBreakdown(year, stateCode, options);
    const now = new Date();
    const todayStr = GERMAN_HOLIDAYS.formatDate(now);
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';

    const formatHolidayItem = h => {
      const hDate = new Date(h.date + "T00:00:00Z");
      const dayOfWeek = hDate.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
        weekday: 'short',
        timeZone: 'UTC'
      });
      return {
        ...h,
        dayOfWeek,
        isPast: h.date < todayStr,
        isUpcoming: h.date >= todayStr
      };
    };

    return {
      ...rawBreakdown,
      statewideHolidays: rawBreakdown.statewideHolidays.map(formatHolidayItem),
      additionalLocalHolidays: rawBreakdown.additionalLocalHolidays.map(formatHolidayItem)
    };
  },

  /**
   * Calculate working days between two dates
   * @param {string} startDateStr - YYYY-MM-DD
   * @param {string} endDateStr - YYYY-MM-DD
   * @param {string} stateCode - e.g. "BE", "BY", "BY-AUG", "NW"
   * @param {boolean} [excludeHolidays=true]
   * @param {Object} [options]
   */
  calculateWorkingDays(startDateStr, endDateStr, stateCode, excludeHolidays = true, options = {}) {
    if (!startDateStr || !endDateStr) {
      return { calendarDays: 0, weekendDays: 0, holidayDays: 0, netWorkingDays: 0 };
    }

    let start = new Date(startDateStr + "T00:00:00Z");
    let end = new Date(endDateStr + "T00:00:00Z");

    if (start > end) {
      const tmp = start;
      start = end;
      end = tmp;
    }

    const startYear = start.getUTCFullYear();
    const endYear = end.getUTCFullYear();

    // Collect holiday dates set for relevant years
    const holidayDatesSet = new Set();
    for (let y = startYear; y <= endYear; y++) {
      const holidays = GERMAN_HOLIDAYS.getHolidaysForYear(y, stateCode, options);
      holidays.forEach(h => holidayDatesSet.add(h.date));
    }

    let calendarDays = 0;
    let weekendDays = 0;
    let holidayDays = 0;
    let netWorkingDays = 0;

    let cur = new Date(start.getTime());
    while (cur <= end) {
      calendarDays++;
      const dayOfWeek = cur.getUTCDay(); // 0 = Sun, 6 = Sat
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
      const dateStr = GERMAN_HOLIDAYS.formatDate(cur);
      const isHoliday = holidayDatesSet.has(dateStr);

      if (isWeekend) {
        weekendDays++;
      } else if (isHoliday) {
        holidayDays++;
        if (!excludeHolidays) {
          netWorkingDays++;
        }
      } else {
        netWorkingDays++;
      }

      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    return {
      calendarDays,
      weekendDays,
      holidayDays,
      netWorkingDays
    };
  },

  /**
   * Vacation Days & Bridge-Days Planner
   */
  calculateVacation(entitlement, usedDays, startDateStr, endDateStr, stateCode, options = {}) {
    const annualTotal = Math.max(0, parseInt(entitlement || 30, 10));
    const alreadyTaken = Math.max(0, parseInt(usedDays || 0, 10));
    
    let neededForTrip = 0;
    if (startDateStr && endDateStr) {
      const workDaysRes = this.calculateWorkingDays(startDateStr, endDateStr, stateCode, true, options);
      neededForTrip = workDaysRes.netWorkingDays;
    }

    const remaining = Math.max(0, annualTotal - alreadyTaken - neededForTrip);

    return {
      annualTotal,
      alreadyTaken,
      neededForTrip,
      remaining
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CalendarTools;
}
if (typeof window !== 'undefined') {
  window.CalendarTools = CalendarTools;
}
if (typeof global !== 'undefined') {
  global.CalendarTools = CalendarTools;
}
