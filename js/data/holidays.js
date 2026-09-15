/**
 * German Public Holidays (Gesetzliche Feiertage) Calculation & Reference
 * Accurately supports all 16 Bundesländer with dynamic Easter calculation (Anonymous Gregorian Algorithm)
 */

const GERMAN_HOLIDAYS = {
  // Compute Easter Sunday for any Gregorian year
  getEasterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(year, month - 1, day));
  },

  // Helper to add days to date in UTC
  addDays(date, days) {
    const res = new Date(date.getTime());
    res.setUTCDate(res.getUTCDate() + days);
    return res;
  },

  formatDate(date) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  // Compute Buß- und Bettag (Wednesday before Nov 23)
  getBussUndBettag(year) {
    const nov23 = new Date(Date.UTC(year, 10, 23));
    const dayOfWeek = nov23.getUTCDay(); // 0 = Sun, 1 = Mon ... 3 = Wed
    // We want Wednesday before Nov 23.
    // If Nov 23 is Wed, it's 7 days earlier.
    const diff = (dayOfWeek + 7 - 3) % 7 || 7;
    return this.addDays(nov23, -diff);
  },

  /**
   * Get all holidays for a given year and state
   * @param {number} year - e.g. 2025, 2026
   * @param {string} stateCode - e.g. "BY", "BE", "ALL"
   */
  getHolidaysForYear(year, stateCode = "ALL") {
    const easter = this.getEasterSunday(year);
    const goodFriday = this.addDays(easter, -2);
    const easterMonday = this.addDays(easter, 1);
    const ascension = this.addDays(easter, 39); // Christi Himmelfahrt
    const whitMonday = this.addDays(easter, 50); // Pfingstmontag
    const corpusChristi = this.addDays(easter, 60); // Fronleichnam
    const bussUndBettag = this.getBussUndBettag(year);

    const allHolidays = [
      // Nationwide Holidays (9)
      {
        id: "neujahr",
        nameDe: "Neujahr",
        nameEn: "New Year's Day",
        nameKo: "신정 (새해 첫날)",
        date: `${year}-01-01`,
        nationwide: true,
        states: ["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"]
      },
      {
        id: "karfreitag",
        nameDe: "Karfreitag",
        nameEn: "Good Friday",
        nameKo: "성금요일 (부활절 전 금요일)",
        date: this.formatDate(goodFriday),
        nationwide: true,
        states: ["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"]
      },
      {
        id: "ostermontag",
        nameDe: "Ostermontag",
        nameEn: "Easter Monday",
        nameKo: "부활절 월요일",
        date: this.formatDate(easterMonday),
        nationwide: true,
        states: ["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"]
      },
      {
        id: "tag_der_arbeit",
        nameDe: "Tag der Arbeit",
        nameEn: "Labour Day",
        nameKo: "노동절 (근로자의 날)",
        date: `${year}-05-01`,
        nationwide: true,
        states: ["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"]
      },
      {
        id: "christi_himmelfahrt",
        nameDe: "Christi Himmelfahrt",
        nameEn: "Ascension Day (Father's Day)",
        nameKo: "예수 승천일",
        date: this.formatDate(ascension),
        nationwide: true,
        states: ["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"]
      },
      {
        id: "pfingstmontag",
        nameDe: "Pfingstmontag",
        nameEn: "Whit Monday",
        nameKo: "성령강림절 월요일",
        date: this.formatDate(whitMonday),
        nationwide: true,
        states: ["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"]
      },
      {
        id: "tag_der_deutschen_einheit",
        nameDe: "Tag der Deutschen Einheit",
        nameEn: "German Unity Day",
        nameKo: "독일 통일의 날 (국경일)",
        date: `${year}-10-03`,
        nationwide: true,
        states: ["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"]
      },
      {
        id: "weihnachtstag_1",
        nameDe: "1. Weihnachtstag",
        nameEn: "Christmas Day",
        nameKo: "크리스마스 제1일",
        date: `${year}-12-25`,
        nationwide: true,
        states: ["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"]
      },
      {
        id: "weihnachtstag_2",
        nameDe: "2. Weihnachtstag",
        nameEn: "St. Stephen's Day / Boxing Day",
        nameKo: "크리스마스 제2일",
        date: `${year}-12-26`,
        nationwide: true,
        states: ["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"]
      },

      // State Specific Holidays
      {
        id: "heilige_drei_koenige",
        nameDe: "Heilige Drei Könige",
        nameEn: "Epiphany",
        nameKo: "주님 공현 대축일 (동방박사의 날)",
        date: `${year}-01-06`,
        nationwide: false,
        states: ["BW", "BY", "ST"]
      },
      {
        id: "frauentag",
        nameDe: "Internationaler Frauentag",
        nameEn: "International Women's Day",
        nameKo: "세계 여성의 날",
        date: `${year}-03-08`,
        nationwide: false,
        states: ["BE", "MV"]
      },
      {
        id: "fronleichnam",
        nameDe: "Fronleichnam",
        nameEn: "Corpus Christi",
        nameKo: "그리스도의 성체 성혈 대축일",
        date: this.formatDate(corpusChristi),
        nationwide: false,
        states: ["BW", "BY", "HE", "NW", "RP", "SL"]
      },
      {
        id: "augsburger_friedensfest",
        nameDe: "Augsburger Friedensfest",
        nameEn: "Augsburg Peace Festival",
        nameKo: "아우크스부르크 평화축제 (시 단위)",
        date: `${year}-08-08`,
        nationwide: false,
        states: ["BY_AUG"] // Augsburg city only
      },
      {
        id: "mariae_himmelfahrt",
        nameDe: "Mariä Himmelfahrt",
        nameEn: "Assumption Day",
        nameKo: "성모 승천 대축일",
        date: `${year}-08-15`,
        nationwide: false,
        states: ["SL", "BY"]
      },
      {
        id: "weltkindertag",
        nameDe: "Weltkindertag",
        nameEn: "World Children's Day",
        nameKo: "세계 어린이의 날",
        date: `${year}-09-20`,
        nationwide: false,
        states: ["TH"]
      },
      {
        id: "reformationstag",
        nameDe: "Reformationstag",
        nameEn: "Reformation Day",
        nameKo: "종교개혁의 날",
        date: `${year}-10-31`,
        nationwide: false,
        states: ["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"]
      },
      {
        id: "allerheiligen",
        nameDe: "Allerheiligen",
        nameEn: "All Saints' Day",
        nameKo: "모든 성인 대축일 (만성절)",
        date: `${year}-11-01`,
        nationwide: false,
        states: ["BW", "BY", "NW", "RP", "SL"]
      },
      {
        id: "buss_und_bettag",
        nameDe: "Buß- und Bettag",
        nameEn: "Repentance and Prayer Day",
        nameKo: "속죄와 기도의 날",
        date: this.formatDate(bussUndBettag),
        nationwide: false,
        states: ["SN"]
      }
    ];

    // Sort chronologically
    allHolidays.sort((a, b) => a.date.localeCompare(b.date));

    if (!stateCode || stateCode === "ALL") {
      return allHolidays;
    }

    return allHolidays.filter(h => h.nationwide || h.states.includes(stateCode));
  }
};

