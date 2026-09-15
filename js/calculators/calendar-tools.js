/**
 * German Calendar Tools (Holidays, Working Days, Vacation & Brückentage Planner)
 */
const CalendarTools = {
  /**
   * Get public holidays formatted for display
   */
  getHolidaysList(year, stateCode) {
    const list = GERMAN_HOLIDAYS.getHolidaysForYear(year, stateCode);
    const now = new Date();
    const todayStr = GERMAN_HOLIDAYS.formatDate(now);

    return list.map(h => {
      const hDate = new Date(h.date + "T00:00:00Z");
      const dayOfWeek = hDate.toLocaleDateString(currentLang === 'ko' ? 'ko-KR' : 'en-US', {
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
   * Calculate working days between two dates
   */
  calculateWorkingDays(startDateStr, endDateStr, stateCode, excludeHolidays = true) {
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
      const holidays = GERMAN_HOLIDAYS.getHolidaysForYear(y, stateCode);
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
  calculateVacation(entitlement, usedDays, startDateStr, endDateStr, stateCode) {
    const annualTotal = Math.max(0, parseInt(entitlement || 30, 10));
    const alreadyTaken = Math.max(0, parseInt(usedDays || 0, 10));
    
    let neededForTrip = 0;
    if (startDateStr && endDateStr) {
      const workDaysRes = this.calculateWorkingDays(startDateStr, endDateStr, stateCode, true);
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

