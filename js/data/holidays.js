/**
 * German Public Holidays (Gesetzliche Feiertage) Calculation & Reference
 * 
 * Statutory Hierarchy:
 * 1. "nationwide" (Bundesweit): Applies to all 16 German federal states (e.g. Neujahr, Karfreitag, Tag der Arbeit)
 * 2. "state" (Landesweit): Applies to an entire federal state (e.g. Buß- und Bettag in SN, Frauentag in BE, Allerheiligen in NW/BY)
 * 3. "regional" (Regional): Applies only in certain districts or municipalities based on confessional or statutory conditions
 *    (e.g. Mariä Himmelfahrt in BY only in Catholic-majority municipalities; Fronleichnam in SN in LK Bautzen)
 * 4. "municipal" (Städtisch / Kommunal): Applies exclusively within a single municipality
 *    (e.g. Augsburger Hohes Friedensfest exclusively in Stadt Augsburg)
 */

const LOCALITY_SCOPES = {
  NATIONWIDE: "nationwide",
  STATE: "state",
  REGIONAL: "regional",
  MUNICIPAL: "municipal"
};

const GERMAN_HOLIDAYS = {
  LOCALITY_SCOPES,

  /**
   * Official statutory sources for holiday legislation
   */
  officialSources: {
    federal: {
      name: "Grundgesetz für die Bundesrepublik Deutschland (GG) Art. 74 Abs. 1 Nr. 12",
      url: "https://www.gesetze-im-internet.de/gg/art_74.html",
      note: "State competence for public holiday legislation under German constitutional law."
    },
    bavaria: {
      name: "Bayerisches Gesetz über den Schutz der Sonn- und Feiertage (Feiertagsgesetz - FTG)",
      url: "https://www.gesetze-bayern.de/Content/Document/BayFTG",
      note: "Art. 1 Abs. 1 (general holidays & Mariä Himmelfahrt in predominantly Catholic municipalities); Art. 1 Abs. 2 (Augsburger Friedensfest)."
    },
    saxony: {
      name: "Sächsisches Gesetz über die Sonn- und Feiertage (SächsSFG)",
      url: "https://revosax.sachsen.de/vorschrift/4484",
      note: "§ 1 Abs. 1 (state holidays including Buß- und Bettag); § 1 Abs. 2 (Fronleichnam in designated Sorbian municipalities)."
    },
    berlin: {
      name: "Gesetz über die Sonn- und Feiertage (Feiertagsgesetz - FeiertG BE)",
      url: "https://gesetze.berlin.de/bsbe/document/jlr-FeiertGBErahmen",
      note: "§ 1 (state holidays including Internationaler Frauentag am 8. März)."
    },
    nrw: {
      name: "Gesetz über die Sonn- und Feiertage (Feiertagsgesetz NW)",
      url: "https://recht.nrw.de/lmi/owa/br_text_anzeigen?v_id=5720021008103445982",
      note: "§ 2 (statewide holidays including Fronleichnam and Allerheiligen)."
    },
    saarland: {
      name: "Saarländisches Feiertagsgesetz (SFG)",
      url: "https://recht.saarland.de/",
      note: "§ 2 Abs. 1 Nr. 7 (Mariä Himmelfahrt as a statewide holiday across all of Saarland)."
    },
    thuringia: {
      name: "Thüringer Feiertagsgesetz (ThürFtG)",
      url: "https://landesrecht.thueringen.de/",
      note: "§ 2 Abs. 1 (Weltkindertag); § 2 Abs. 2 (Fronleichnam in Landkreis Eichsfeld and designated Catholic municipalities)."
    }
  },

  // Compute Easter Sunday for any Gregorian year (Anonymous Gregorian Algorithm)
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
   * Generates master list of all holidays for a given year with exact hierarchy, scopes, and regional metadata
   * @param {number} year
   */
  getAllHolidaysForYear(year) {
    const easter = this.getEasterSunday(year);
    const goodFriday = this.addDays(easter, -2);
    const easterMonday = this.addDays(easter, 1);
    const ascension = this.addDays(easter, 39); // Christi Himmelfahrt
    const whitMonday = this.addDays(easter, 50); // Pfingstmontag
    const corpusChristi = this.addDays(easter, 60); // Fronleichnam
    const bussUndBettag = this.getBussUndBettag(year);

    const ALL_16_STATES = ["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"];

    return [
      // ==========================================
      // 1. NATIONWIDE HOLIDAYS (9)
      // ==========================================
      {
        id: "neujahr",
        nameDe: "Neujahr",
        nameEn: "New Year's Day",
        nameKo: "신정 (새해 첫날)",
        date: `${year}-01-01`,
        localityScope: LOCALITY_SCOPES.NATIONWIDE,
        nationwide: true,
        states: [...ALL_16_STATES],
        legalBasis: "Art. 74 Abs. 1 Nr. 12 GG & Landesfeiertagsgesetze",
        notesDe: "Bundesweiter gesetzlicher Feiertag.",
        notesEn: "Statutory public holiday nationwide across all 16 states."
      },
      {
        id: "karfreitag",
        nameDe: "Karfreitag",
        nameEn: "Good Friday",
        nameKo: "성금요일 (부활절 전 금요일)",
        date: this.formatDate(goodFriday),
        localityScope: LOCALITY_SCOPES.NATIONWIDE,
        nationwide: true,
        states: [...ALL_16_STATES],
        legalBasis: "Landesfeiertagsgesetze aller 16 Länder",
        notesDe: "Bundesweiter gesetzlicher Feiertag (stiller Feiertag).",
        notesEn: "Statutory public holiday nationwide across all 16 states."
      },
      {
        id: "ostermontag",
        nameDe: "Ostermontag",
        nameEn: "Easter Monday",
        nameKo: "부활절 월요일",
        date: this.formatDate(easterMonday),
        localityScope: LOCALITY_SCOPES.NATIONWIDE,
        nationwide: true,
        states: [...ALL_16_STATES],
        legalBasis: "Landesfeiertagsgesetze aller 16 Länder",
        notesDe: "Bundesweiter gesetzlicher Feiertag.",
        notesEn: "Statutory public holiday nationwide across all 16 states."
      },
      {
        id: "tag_der_arbeit",
        nameDe: "Tag der Arbeit",
        nameEn: "Labour Day",
        nameKo: "노동절 (근로자의 날)",
        date: `${year}-05-01`,
        localityScope: LOCALITY_SCOPES.NATIONWIDE,
        nationwide: true,
        states: [...ALL_16_STATES],
        legalBasis: "Landesfeiertagsgesetze aller 16 Länder",
        notesDe: "Bundesweiter gesetzlicher Feiertag.",
        notesEn: "Statutory public holiday nationwide across all 16 states."
      },
      {
        id: "christi_himmelfahrt",
        nameDe: "Christi Himmelfahrt",
        nameEn: "Ascension Day (Father's Day)",
        nameKo: "예수 승천일",
        date: this.formatDate(ascension),
        localityScope: LOCALITY_SCOPES.NATIONWIDE,
        nationwide: true,
        states: [...ALL_16_STATES],
        legalBasis: "Landesfeiertagsgesetze aller 16 Länder",
        notesDe: "Bundesweiter gesetzlicher Feiertag (39 Tage nach Ostersonntag).",
        notesEn: "Statutory public holiday nationwide across all 16 states (39 days after Easter Sunday)."
      },
      {
        id: "pfingstmontag",
        nameDe: "Pfingstmontag",
        nameEn: "Whit Monday",
        nameKo: "성령강림절 월요일",
        date: this.formatDate(whitMonday),
        localityScope: LOCALITY_SCOPES.NATIONWIDE,
        nationwide: true,
        states: [...ALL_16_STATES],
        legalBasis: "Landesfeiertagsgesetze aller 16 Länder",
        notesDe: "Bundesweiter gesetzlicher Feiertag (50 Tage nach Ostersonntag).",
        notesEn: "Statutory public holiday nationwide across all 16 states (50 days after Easter Sunday)."
      },
      {
        id: "tag_der_deutschen_einheit",
        nameDe: "Tag der Deutschen Einheit",
        nameEn: "German Unity Day",
        nameKo: "독일 통일의 날 (국경일)",
        date: `${year}-10-03`,
        localityScope: LOCALITY_SCOPES.NATIONWIDE,
        nationwide: true,
        states: [...ALL_16_STATES],
        legalBasis: "Einigungsvertrag Art. 2 Abs. 2",
        notesDe: "Einziger durch Bundesrecht festgelegter Nationalfeiertag.",
        notesEn: "The sole federal statutory public holiday established by the Unification Treaty."
      },
      {
        id: "weihnachtstag_1",
        nameDe: "1. Weihnachtstag",
        nameEn: "Christmas Day",
        nameKo: "성탄절 제1일 (크리스마스)",
        date: `${year}-12-25`,
        localityScope: LOCALITY_SCOPES.NATIONWIDE,
        nationwide: true,
        states: [...ALL_16_STATES],
        legalBasis: "Landesfeiertagsgesetze aller 16 Länder",
        notesDe: "Bundesweiter gesetzlicher Feiertag.",
        notesEn: "Statutory public holiday nationwide across all 16 states."
      },
      {
        id: "weihnachtstag_2",
        nameDe: "2. Weihnachtstag",
        nameEn: "St. Stephen's Day / Boxing Day",
        nameKo: "성탄절 제2일 (박싱데이)",
        date: `${year}-12-26`,
        localityScope: LOCALITY_SCOPES.NATIONWIDE,
        nationwide: true,
        states: [...ALL_16_STATES],
        legalBasis: "Landesfeiertagsgesetze aller 16 Länder",
        notesDe: "Bundesweiter gesetzlicher Feiertag.",
        notesEn: "Statutory public holiday nationwide across all 16 states."
      },

      // ==========================================
      // 2. STATE-LEVEL HOLIDAYS ("state")
      // ==========================================
      {
        id: "heilige_drei_koenige",
        nameDe: "Heilige Drei Könige",
        nameEn: "Epiphany",
        nameKo: "주님 공현 대축일 (동방박사의 날)",
        date: `${year}-01-06`,
        localityScope: LOCALITY_SCOPES.STATE,
        nationwide: false,
        states: ["BW", "BY", "ST"],
        legalBasis: "BayFTG Art. 1 Abs. 1; FTG BW § 1 Abs. 1; FeiertG LSA § 2 Abs. 1",
        notesDe: "Landesweiter gesetzlicher Feiertag in Baden-Württemberg, Bayern und Sachsen-Anhalt.",
        notesEn: "Statewide statutory public holiday in Baden-Württemberg, Bavaria, and Saxony-Anhalt."
      },
      {
        id: "frauentag",
        nameDe: "Internationaler Frauentag",
        nameEn: "International Women's Day",
        nameKo: "세계 여성의 날",
        date: `${year}-03-08`,
        localityScope: LOCALITY_SCOPES.STATE,
        nationwide: false,
        states: ["BE", "MV"],
        legalBasis: "FeiertG BE § 1; FTG M-V § 2 Abs. 1",
        notesDe: "Landesweiter Feiertag in Berlin (seit 2019) und Mecklenburg-Vorpommern (seit 2023).",
        notesEn: "Statewide statutory public holiday in Berlin (since 2019) and Mecklenburg-Western Pomerania (since 2023)."
      },
      {
        id: "fronleichnam",
        nameDe: "Fronleichnam",
        nameEn: "Corpus Christi",
        nameKo: "그리스도의 성체 성혈 대축일",
        date: this.formatDate(corpusChristi),
        localityScope: LOCALITY_SCOPES.STATE,
        nationwide: false,
        states: ["BW", "BY", "HE", "NW", "RP", "SL"],
        legalBasis: "Feiertagsgesetze in BW, BY, HE, NW, RP, SL",
        notesDe: "Landesweiter gesetzlicher Feiertag in 6 Bundesländern (BW, BY, HE, NW, RP, SL). In Sachsen und Thüringen nur regional.",
        notesEn: "Statewide statutory public holiday in 6 federal states (BW, BY, HE, NW, RP, SL). Only regional in Saxony and Thuringia."
      },
      {
        id: "mariae_himmelfahrt_sl",
        nameDe: "Mariä Himmelfahrt (Saarland)",
        nameEn: "Assumption Day (Saarland)",
        nameKo: "성모 승천 대축일 (자를란트주 전역)",
        date: `${year}-08-15`,
        localityScope: LOCALITY_SCOPES.STATE,
        nationwide: false,
        states: ["SL"],
        legalBasis: "Saarländisches Feiertagsgesetz (SFG) § 2 Abs. 1 Nr. 7",
        notesDe: "Landesweiter gesetzlicher Feiertag im gesamten Saarland.",
        notesEn: "Statewide statutory public holiday across the entire state of Saarland."
      },
      {
        id: "weltkindertag",
        nameDe: "Weltkindertag",
        nameEn: "World Children's Day",
        nameKo: "세계 어린이의 날",
        date: `${year}-09-20`,
        localityScope: LOCALITY_SCOPES.STATE,
        nationwide: false,
        states: ["TH"],
        legalBasis: "Thüringer Feiertagsgesetz (ThürFtG) § 2 Abs. 1",
        notesDe: "Landesweiter gesetzlicher Feiertag in Thüringen (seit 2019).",
        notesEn: "Statewide statutory public holiday in Thuringia (introduced in 2019)."
      },
      {
        id: "reformationstag",
        nameDe: "Reformationstag",
        nameEn: "Reformation Day",
        nameKo: "종교개혁의 날",
        date: `${year}-10-31`,
        localityScope: LOCALITY_SCOPES.STATE,
        nationwide: false,
        states: ["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"],
        legalBasis: "Landesfeiertagsgesetze der 9 nord- und ostdeutschen Bundesländer",
        notesDe: "Landesweiter gesetzlicher Feiertag in 9 Bundesländern.",
        notesEn: "Statewide statutory public holiday in 9 northern and eastern federal states."
      },
      {
        id: "allerheiligen",
        nameDe: "Allerheiligen",
        nameEn: "All Saints' Day",
        nameKo: "모든 성인 대축일 (만성절)",
        date: `${year}-11-01`,
        localityScope: LOCALITY_SCOPES.STATE,
        nationwide: false,
        states: ["BW", "BY", "NW", "RP", "SL"],
        legalBasis: "Feiertagsgesetze in BW, BY, NW, RP, SL",
        notesDe: "Landesweiter gesetzlicher Feiertag in 5 katholisch geprägten Bundesländern (stiller Feiertag).",
        notesEn: "Statewide statutory public holiday in 5 traditionally Catholic federal states."
      },
      {
        id: "buss_und_bettag",
        nameDe: "Buß- und Bettag",
        nameEn: "Repentance and Prayer Day",
        nameKo: "속죄와 기도의 날",
        date: this.formatDate(bussUndBettag),
        localityScope: LOCALITY_SCOPES.STATE,
        nationwide: false,
        states: ["SN"],
        legalBasis: "Sächsisches Gesetz über die Sonn- und Feiertage (SächsSFG) § 1 Abs. 1",
        notesDe: "Landesweiter gesetzlicher Feiertag ausschließlich in Sachsen. Hinweis: Arbeitnehmer in Sachsen zahlen zum Ausgleich einen um 0,5 Prozentpunkte höheren Arbeitnehmeranteil zur Pflegeversicherung.",
        notesEn: "Statewide statutory public holiday solely in Saxony. Note: Employees in Saxony pay an additional 0.5 percentage points for statutory long-term care insurance (Pflegeversicherung) to finance this holiday."
      },

      // ==========================================
      // 3. REGIONAL HOLIDAYS ("regional")
      // ==========================================
      {
        id: "mariae_himmelfahrt_by",
        nameDe: "Mariä Himmelfahrt (Bayern, kath. Gemeinden)",
        nameEn: "Assumption Day (Bavaria, Catholic municipalities)",
        nameKo: "성모 승천 대축일 (바이에른주 가톨릭 다수 지자체)",
        date: `${year}-08-15`,
        localityScope: LOCALITY_SCOPES.REGIONAL,
        nationwide: false,
        states: ["BY"],
        regionalState: "BY",
        regionalCondition: "catholic_majority_municipalities",
        legalBasis: "Bayerisches Feiertagsgesetz (FTG) Art. 1 Abs. 1 Nr. 2",
        applicableScopeDe: "Bayerische Gemeinden mit überwiegend katholischer Bevölkerung (~1.704 von 2.056 Gemeinden)",
        applicableScopeEn: "Bavarian municipalities with a predominantly Catholic population (~1,704 of 2,056 municipalities)",
        applicableScopeKo: "가톨릭 신자 비율이 다수인 바이에른 지자체 (2,056개 지자체 중 약 1,704곳)",
        notesDe: "Gesetzlicher Feiertag in Bayern NUR in Gemeinden mit überwiegend katholischer Bevölkerung (z.B. München, Augsburg, Regensburg, Würzburg, Ingolstadt). KEIN gesetzlicher Feiertag in überwiegend evangelischen Gemeinden (z.B. Nürnberg, Fürth, Erlangen, Bayreuth, Ansbach).",
        notesEn: "Statutory public holiday in Bavaria ONLY in municipalities with a predominantly Catholic population (e.g. Munich, Augsburg, Regensburg, Würzburg, Ingolstadt). Normal working day in predominantly Protestant areas (e.g. Nuremberg, Fürth, Erlangen, Bayreuth, Ansbach)."
      },
      {
        id: "fronleichnam_sn",
        nameDe: "Fronleichnam (Sachsen, sorbisches Siedlungsgebiet)",
        nameEn: "Corpus Christi (Saxony, Sorbian municipalities)",
        nameKo: "그리스도의 성체 성혈 대축일 (작센주 바우첸 지역 가톨릭 지자체)",
        date: this.formatDate(corpusChristi),
        localityScope: LOCALITY_SCOPES.REGIONAL,
        nationwide: false,
        states: ["SN"],
        regionalState: "SN",
        regionalCondition: "sorbian_catholic_municipalities",
        legalBasis: "Sächsisches Gesetz über die Sonn- und Feiertage (SächsSFG) § 1 Abs. 2",
        applicableScopeDe: "Bestimmte sorbische katholische Gemeinden im Landkreis Bautzen (Bautzen, Crostwitz, Göda, Nebelschütz, Neschwitz, Panschwitz-Kuckau, Puschwitz, Räckelwitz, Radibor, Ralbitz-Rosenthal, Wittichenau)",
        applicableScopeEn: "Designated Sorbian Catholic municipalities in the Bautzen district",
        applicableScopeKo: "작센주 바우첸(Bautzen) 군 내 소르브인 가톨릭 지정 지자체",
        notesDe: "In Sachsen nur in den durch Rechtsverordnung bestimmten katholischen Gemeinden im Landkreis Bautzen ein gesetzlicher Feiertag.",
        notesEn: "Statutory public holiday in Saxony only in legally designated Catholic municipalities in the Bautzen district."
      },
      {
        id: "fronleichnam_th",
        nameDe: "Fronleichnam (Thüringen, kath. Regionen)",
        nameEn: "Corpus Christi (Thuringia, Catholic regions)",
        nameKo: "그리스도의 성체 성혈 대축일 (튀링겐주 아이히스펠트 등 가톨릭 지역)",
        date: this.formatDate(corpusChristi),
        localityScope: LOCALITY_SCOPES.REGIONAL,
        nationwide: false,
        states: ["TH"],
        regionalState: "TH",
        regionalCondition: "eichsfeld_and_catholic_areas",
        legalBasis: "Thüringer Feiertagsgesetz (ThürFtG) § 2 Abs. 2",
        applicableScopeDe: "Gesamter Landkreis Eichsfeld sowie bestimmte katholische Gemeinden im Unstrut-Hainich-Kreis und Wartburgkreis",
        applicableScopeEn: "Entire Eichsfeld district and designated Catholic municipalities in Unstrut-Hainich and Wartburgkreis",
        applicableScopeKo: "아이히스펠트(Eichsfeld) 군 전체 및 운스트루트-하이니히/바르트부르크 일부 지자체",
        notesDe: "In Thüringen nur im katholisch geprägten Landkreis Eichsfeld sowie in ausgewählten Gemeinden im Unstrut-Hainich-Kreis und Wartburgkreis ein gesetzlicher Feiertag.",
        notesEn: "Statutory public holiday in Thuringia only in the Eichsfeld district and selected Catholic municipalities."
      },

      // ==========================================
      // 4. MUNICIPAL HOLIDAYS ("municipal")
      // ==========================================
      {
        id: "augsburger_friedensfest",
        nameDe: "Augsburger Hohes Friedensfest",
        nameEn: "Augsburg Peace Festival",
        nameKo: "아우크스부르크 평화축제 (시 단위)",
        date: `${year}-08-08`,
        localityScope: LOCALITY_SCOPES.MUNICIPAL,
        nationwide: false,
        states: ["BY"],
        locality: "Augsburg",
        legalBasis: "Bayerisches Feiertagsgesetz (FTG) Art. 1 Abs. 2",
        applicableScopeDe: "Ausschließlich im Stadtgebiet der Stadt Augsburg",
        applicableScopeEn: "Strictly within the municipal city borders of Augsburg",
        applicableScopeKo: "바이에른주 아우크스부르크 시(Stadt Augsburg) 관할 구역 한정",
        notesDe: "Deutschlands einziger rein städtischer Feiertag. Gilt nur innerhalb der Stadtgrenzen von Augsburg (nicht im Landkreis Augsburg). Augsburg hat dadurch mit 14 gesetzlichen Feiertagen die meisten Feiertage in ganz Deutschland.",
        notesEn: "Germany's only purely municipal statutory public holiday. Applies exclusively within the municipal city borders of Augsburg (not the surrounding district). With 14 holidays, Augsburg has the highest number of statutory public holidays in Germany."
      }
    ];
  },

  /**
   * Get public holidays for a given year and state / locality
   * 
   * Strict Statutory Logic:
   * - If stateCode === "ALL": Returns all holidays (nationwide, state, regional, municipal) with explicit scope tags
   * - If stateCode is a state (e.g. "BY", "BE", "SN", "NW"):
   *   - Automatically returns STATEWIDE holidays (nationwide + state).
   *   - Does NOT falsely include regional/municipal holidays in the statewide count (e.g. Mariä Himmelfahrt & Friedensfest are excluded from standard BY).
   *   - If options.includeRegional === true: also includes regional/municipal holidays.
   * - If stateCode === "BY-AUG" or "AUGSBURG" or options.locality === "augsburg":
   *   - Returns all 14 statutory holidays applicable in the city of Augsburg!
   * 
   * @param {number} year - e.g. 2025, 2026
   * @param {string} stateCode - e.g. "BY", "BE", "SN", "NW", "AUGSBURG", "BY-AUG", "ALL"
   * @param {Object} [options]
   * @param {string} [options.locality] - e.g. "augsburg"
   * @param {boolean} [options.includeRegional] - whether to include regional/municipal holidays in statewide list
   * @returns {Array<Object>} List of applicable holidays sorted chronologically
   */
  getHolidaysForYear(year, stateCode = "ALL", options = {}) {
    const all = this.getAllHolidaysForYear(year);
    const code = (stateCode || "ALL").toUpperCase();
    const locality = (options.locality || "").toLowerCase();
    const isAugsburg = code === "AUGSBURG" || code === "BY-AUG" || (code === "BY" && locality === "augsburg");

    // Case 1: All German Holidays (Comparison mode)
    if (code === "ALL") {
      all.sort((a, b) => a.date.localeCompare(b.date));
      return all;
    }

    // Case 2: Augsburg City (Special municipal case: 14 holidays)
    if (isAugsburg) {
      const augsburgList = all.filter(h => {
        // Nationwide holidays apply
        if (h.localityScope === LOCALITY_SCOPES.NATIONWIDE) return true;
        // Bavaria state-level holidays apply (Heilige Drei Könige, Fronleichnam, Allerheiligen)
        if (h.localityScope === LOCALITY_SCOPES.STATE && h.states.includes("BY")) return true;
        // Mariä Himmelfahrt applies in Augsburg (predominantly Catholic municipality)
        if (h.id === "mariae_himmelfahrt_by") return true;
        // Augsburger Friedensfest applies in Augsburg
        if (h.id === "augsburger_friedensfest") return true;
        return false;
      });
      augsburgList.sort((a, b) => a.date.localeCompare(b.date));
      return augsburgList;
    }

    // Case 3: Federal State (e.g. "BE", "BY", "SN", "NW")
    const standardStateCode = code.startsWith("BY") ? "BY" : code;

    const list = all.filter(h => {
      // Nationwide holidays always apply
      if (h.localityScope === LOCALITY_SCOPES.NATIONWIDE) return true;

      // State-level holidays apply statewide in this state
      if (h.localityScope === LOCALITY_SCOPES.STATE && h.states.includes(standardStateCode)) {
        return true;
      }

      // If caller explicitly requested regional/municipal inclusion:
      if (options.includeRegional) {
        if (h.localityScope === LOCALITY_SCOPES.REGIONAL && h.states.includes(standardStateCode)) {
          return true;
        }
        if (h.localityScope === LOCALITY_SCOPES.MUNICIPAL && h.states.includes(standardStateCode)) {
          return true;
        }
      }

      return false;
    });

    list.sort((a, b) => a.date.localeCompare(b.date));
    return list;
  },

  /**
   * Get additional regional / municipal holidays for a given state that do NOT apply statewide.
   * Shown separately in the UI so users are not misled into assuming universal coverage.
   * 
   * @param {number} year
   * @param {string} stateCode - e.g. "BY", "SN", "TH"
   * @returns {Array<Object>}
   */
  getAdditionalLocalHolidays(year, stateCode) {
    if (!stateCode || stateCode === "ALL") return [];
    const code = stateCode.toUpperCase();
    const standardStateCode = code.startsWith("BY") ? "BY" : code;

    // If querying Augsburg specifically, municipal/regional holidays are already in the main list
    if (code === "AUGSBURG" || code === "BY-AUG") return [];

    const all = this.getAllHolidaysForYear(year);
    const localList = all.filter(h => {
      return (h.localityScope === LOCALITY_SCOPES.REGIONAL || h.localityScope === LOCALITY_SCOPES.MUNICIPAL)
        && h.states.includes(standardStateCode);
    });

    localList.sort((a, b) => a.date.localeCompare(b.date));
    return localList;
  },

  /**
   * Get a structured breakdown of holidays for UI display & audit checks
   * Separates statewide legal holidays from municipal/regional exceptions.
   * 
   * @param {number} year
   * @param {string} stateCode
   * @param {Object} [options]
   */
  getHolidaysBreakdown(year, stateCode = "ALL", options = {}) {
    const code = (stateCode || "ALL").toUpperCase();
    const locality = (options.locality || "").toLowerCase();
    const isAugsburg = code === "AUGSBURG" || code === "BY-AUG" || (code === "BY" && locality === "augsburg");

    const statewideHolidays = this.getHolidaysForYear(year, isAugsburg ? "BY-AUG" : code, { includeRegional: false });
    const additionalLocalHolidays = isAugsburg ? [] : this.getAdditionalLocalHolidays(year, code);

    return {
      year,
      stateCode: code,
      isAugsburg,
      statewideHolidays,
      additionalLocalHolidays,
      totalStatewideCount: statewideHolidays.length,
      additionalLocalCount: additionalLocalHolidays.length,
      hasLocalExceptions: additionalLocalHolidays.length > 0,
      explanation: "Some holidays apply only in certain municipalities or regions.",
      explanationDe: "Einige Feiertage gelten nur in bestimmten Gemeinden oder Regionen.",
      explanationKo: "일부 공휴일은 특정 지자체(Gemeinde) 또는 지역에만 적용됩니다.",
      officialSources: this.officialSources
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GERMAN_HOLIDAYS;
}
if (typeof window !== 'undefined') {
  window.GERMAN_HOLIDAYS = GERMAN_HOLIDAYS;
}
if (typeof global !== 'undefined') {
  global.GERMAN_HOLIDAYS = GERMAN_HOLIDAYS;
}
