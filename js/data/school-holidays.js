/**
 * German School Holidays (Schulferien) Data Engine
 * Source: Ständige Konferenz der Kultusminister der Länder in der Bundesrepublik Deutschland (KMK)
 * Official URLs:
 *   - https://www.kmk.org/service/ferienregelung/ferienkalender.html
 *   - https://www.kmk.org/service/ferienregelung.html
 * Last Verified: 2026-09-16
 *
 * Architecture:
 * - 100% verified against official KMK publication PDFs (FER2024_25, FER2025_26, FER2026_27, FER2027_28, FER2028_29)
 * - Complete coverage for all 16 German Bundesländer
 * - Full distinction between winter, easter/spring, pentecost/ascension, summer, autumn, christmas
 * - Preserves exact first and last vacation days inclusive
 * - Movable days (bewegliche Ferientage) and official single school-free days recorded
 * - Footnotes for special island regulations (Sylt, Föhr, Amrum, Helgoland, Halligen)
 * - Queryable by school year ("2025/2026") or calendar year (2026)
 * - Deterministic error state returned for unsupported years (no fake fallback data)
 */

const GERMAN_SCHOOL_HOLIDAYS = {
  source: "Kultusministerkonferenz (KMK)",
  sourceUrl: "https://www.kmk.org/service/ferienregelung/ferienkalender.html",
  lastVerified: "2026-09-16",
  
  supportedSchoolYears: ["2024/2025", "2025/2026", "2026/2027", "2027/2028", "2028/2029"],
  supportedCalendarYears: [2024, 2025, 2026, 2027, 2028, 2029],
  
  allStateCodes: [
    "BW", "BY", "BE", "BB", "HB", "HH", "HE", "MV",
    "NI", "NW", "RP", "SL", "SN", "ST", "SH", "TH"
  ],

  footnotes: {
    SH_ISLANDS: {
      de: "Auf den Inseln Sylt, Föhr, Amrum und Helgoland sowie auf den Halligen gelten für die Sommer- und Herbstferien Sonderregelungen.",
      en: "Special regulations apply for summer and autumn holidays on the islands of Sylt, Föhr, Amrum, Helgoland, and the Halligen.",
      ko: "질트(Sylt), 푀르(Föhr), 암룸(Amrum), 헬골란트(Helgoland) 섬 및 할리겐(Halligen) 지역은 여름/가을 방학에 특별 규정이 적용됩니다."
    }
  },

  // Raw validated official data by school year
  bySchoolYear: {
  "2024/2025": {
    "BW": {
      "stateCode": "BW",
      "stateNameDe": "Baden-Württemberg",
      "movableDays": 5,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-28",
          "end": "2024-10-30",
          "isSingleDay": false,
          "rawKmk": "28.10. - 30.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2024-10-31",
          "end": "2024-10-31",
          "isSingleDay": true,
          "rawKmk": "31.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-04",
          "isSingleDay": false,
          "rawKmk": "23.12. - 04.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-14",
          "end": "2025-04-26",
          "isSingleDay": false,
          "rawKmk": "14.04. - 26.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2025-06-10",
          "end": "2025-06-20",
          "isSingleDay": false,
          "rawKmk": "10.06. - 20.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-31",
          "end": "2025-09-13",
          "isSingleDay": false,
          "rawKmk": "31.07. - 13.09."
        }
      ]
    },
    "BY": {
      "stateCode": "BY",
      "stateNameDe": "Bayern",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-28",
          "end": "2024-10-31",
          "isSingleDay": false,
          "rawKmk": "28.10. - 31.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-03",
          "isSingleDay": false,
          "rawKmk": "23.12. - 03.01."
        },
        {
          "type": "winter",
          "nameDe": "Frühjahrsferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2025-03-03",
          "end": "2025-03-07",
          "isSingleDay": false,
          "rawKmk": "03.03. - 07.03."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-14",
          "end": "2025-04-25",
          "isSingleDay": false,
          "rawKmk": "14.04. - 25.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2025-06-10",
          "end": "2025-06-20",
          "isSingleDay": false,
          "rawKmk": "10.06. - 20.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien (Schulfreier Tag)",
          "nameEn": "Summer Holidays (School-Free Day)",
          "nameKo": "여름 방학 (단일 휴교일)",
          "start": "2025-08-01",
          "end": "2025-08-01",
          "isSingleDay": true,
          "rawKmk": "01.08."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-08-04",
          "end": "2025-09-15",
          "isSingleDay": false,
          "rawKmk": "04.08. - 15.09."
        }
      ]
    },
    "BE": {
      "stateCode": "BE",
      "stateNameDe": "Berlin",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2024-10-04",
          "end": "2024-10-04",
          "isSingleDay": true,
          "rawKmk": "04.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-21",
          "end": "2024-11-02",
          "isSingleDay": false,
          "rawKmk": "21.10. - 02.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2024-12-31",
          "isSingleDay": false,
          "rawKmk": "23.12. - 31.12."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2025-02-03",
          "end": "2025-02-08",
          "isSingleDay": false,
          "rawKmk": "03.02. - 08.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-14",
          "end": "2025-04-25",
          "isSingleDay": false,
          "rawKmk": "14.04. - 25.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-02",
          "end": "2025-05-02",
          "isSingleDay": true,
          "rawKmk": "02.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-30",
          "end": "2025-05-30",
          "isSingleDay": true,
          "rawKmk": "30.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-06-10",
          "end": "2025-06-10",
          "isSingleDay": true,
          "rawKmk": "10.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-24",
          "end": "2025-09-06",
          "isSingleDay": false,
          "rawKmk": "24.07. - 06.09."
        }
      ]
    },
    "BB": {
      "stateCode": "BB",
      "stateNameDe": "Brandenburg",
      "movableDays": 3,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-21",
          "end": "2024-11-02",
          "isSingleDay": false,
          "rawKmk": "21.10. - 02.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2024-12-31",
          "isSingleDay": false,
          "rawKmk": "23.12. - 31.12."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2025-02-03",
          "end": "2025-02-08",
          "isSingleDay": false,
          "rawKmk": "03.02. - 08.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-14",
          "end": "2025-04-25",
          "isSingleDay": false,
          "rawKmk": "14.04. - 25.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-06-10",
          "end": "2025-06-10",
          "isSingleDay": true,
          "rawKmk": "10.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-24",
          "end": "2025-09-06",
          "isSingleDay": false,
          "rawKmk": "24.07. - 06.09."
        }
      ]
    },
    "HB": {
      "stateCode": "HB",
      "stateNameDe": "Bremen",
      "movableDays": 2,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-04",
          "end": "2024-10-19",
          "isSingleDay": false,
          "rawKmk": "04.10. - 19.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2024-11-01",
          "end": "2024-11-01",
          "isSingleDay": true,
          "rawKmk": "01.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-04",
          "isSingleDay": false,
          "rawKmk": "23.12. - 04.01."
        },
        {
          "type": "winter",
          "nameDe": "Halbjahresferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2025-02-03",
          "end": "2025-02-04",
          "isSingleDay": false,
          "rawKmk": "03.02. - 04.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-07",
          "end": "2025-04-19",
          "isSingleDay": false,
          "rawKmk": "07.04. - 19.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-04-30",
          "end": "2025-04-30",
          "isSingleDay": true,
          "rawKmk": "30.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-02",
          "end": "2025-05-02",
          "isSingleDay": true,
          "rawKmk": "02.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-30",
          "end": "2025-05-30",
          "isSingleDay": true,
          "rawKmk": "30.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-06-10",
          "end": "2025-06-10",
          "isSingleDay": true,
          "rawKmk": "10.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-03",
          "end": "2025-08-13",
          "isSingleDay": false,
          "rawKmk": "03.07. - 13.08."
        }
      ]
    },
    "HH": {
      "stateCode": "HH",
      "stateNameDe": "Hamburg",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2024-10-04",
          "end": "2024-10-04",
          "isSingleDay": true,
          "rawKmk": "04.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-21",
          "end": "2024-11-01",
          "isSingleDay": false,
          "rawKmk": "21.10. - 01.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-20",
          "end": "2025-01-03",
          "isSingleDay": false,
          "rawKmk": "20.12. - 03.01."
        },
        {
          "type": "winter",
          "nameDe": "Halbjahresferien (Schulfreier Tag)",
          "nameEn": "Winter Holidays (School-Free Day)",
          "nameKo": "겨울 방학 (단일 휴교일)",
          "start": "2025-01-31",
          "end": "2025-01-31",
          "isSingleDay": true,
          "rawKmk": "31.01."
        },
        {
          "type": "easter",
          "nameDe": "Frühjahrsferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-03-10",
          "end": "2025-03-21",
          "isSingleDay": false,
          "rawKmk": "10.03. - 21.03."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-02",
          "end": "2025-05-02",
          "isSingleDay": true,
          "rawKmk": "02.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2025-05-26",
          "end": "2025-05-30",
          "isSingleDay": false,
          "rawKmk": "26.05. - 30.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-24",
          "end": "2025-09-03",
          "isSingleDay": false,
          "rawKmk": "24.07. - 03.09."
        }
      ]
    },
    "HE": {
      "stateCode": "HE",
      "stateNameDe": "Hessen",
      "movableDays": 4,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-14",
          "end": "2024-10-25",
          "isSingleDay": false,
          "rawKmk": "14.10. - 25.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-10",
          "isSingleDay": false,
          "rawKmk": "23.12. - 10.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-07",
          "end": "2025-04-21",
          "isSingleDay": false,
          "rawKmk": "07.04. - 21.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-07",
          "end": "2025-08-15",
          "isSingleDay": false,
          "rawKmk": "07.07. - 15.08."
        }
      ]
    },
    "MV": {
      "stateCode": "MV",
      "stateNameDe": "Mecklenburg-Vorpommern",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2024-10-04",
          "end": "2024-10-04",
          "isSingleDay": true,
          "rawKmk": "04.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-21",
          "end": "2024-10-26",
          "isSingleDay": false,
          "rawKmk": "21.10. - 26.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2024-11-01",
          "end": "2024-11-01",
          "isSingleDay": true,
          "rawKmk": "01.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-06",
          "isSingleDay": false,
          "rawKmk": "23.12. - 06.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2025-02-03",
          "end": "2025-02-14",
          "isSingleDay": false,
          "rawKmk": "03.02. - 14.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-14",
          "end": "2025-04-23",
          "isSingleDay": false,
          "rawKmk": "14.04. - 23.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-30",
          "end": "2025-05-30",
          "isSingleDay": true,
          "rawKmk": "30.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2025-06-06",
          "end": "2025-06-10",
          "isSingleDay": false,
          "rawKmk": "06.06. - 10.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-28",
          "end": "2025-09-06",
          "isSingleDay": false,
          "rawKmk": "28.07. - 06.09."
        }
      ]
    },
    "NI": {
      "stateCode": "NI",
      "stateNameDe": "Niedersachsen",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-04",
          "end": "2024-10-19",
          "isSingleDay": false,
          "rawKmk": "04.10. - 19.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2024-11-01",
          "end": "2024-11-01",
          "isSingleDay": true,
          "rawKmk": "01.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-04",
          "isSingleDay": false,
          "rawKmk": "23.12. - 04.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2025-02-03",
          "end": "2025-02-04",
          "isSingleDay": false,
          "rawKmk": "03.02. - 04.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-07",
          "end": "2025-04-19",
          "isSingleDay": false,
          "rawKmk": "07.04. - 19.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-04-30",
          "end": "2025-04-30",
          "isSingleDay": true,
          "rawKmk": "30.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-02",
          "end": "2025-05-02",
          "isSingleDay": true,
          "rawKmk": "02.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-30",
          "end": "2025-05-30",
          "isSingleDay": true,
          "rawKmk": "30.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-06-10",
          "end": "2025-06-10",
          "isSingleDay": true,
          "rawKmk": "10.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-03",
          "end": "2025-08-13",
          "isSingleDay": false,
          "rawKmk": "03.07. - 13.08."
        }
      ]
    },
    "NW": {
      "stateCode": "NW",
      "stateNameDe": "Nordrhein-Westfalen",
      "movableDays": 4,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-14",
          "end": "2024-10-26",
          "isSingleDay": false,
          "rawKmk": "14.10. - 26.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-06",
          "isSingleDay": false,
          "rawKmk": "23.12. - 06.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-14",
          "end": "2025-04-26",
          "isSingleDay": false,
          "rawKmk": "14.04. - 26.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-06-10",
          "end": "2025-06-10",
          "isSingleDay": true,
          "rawKmk": "10.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-14",
          "end": "2025-08-26",
          "isSingleDay": false,
          "rawKmk": "14.07. - 26.08."
        }
      ]
    },
    "RP": {
      "stateCode": "RP",
      "stateNameDe": "Rheinland-Pfalz",
      "movableDays": 6,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-14",
          "end": "2024-10-25",
          "isSingleDay": false,
          "rawKmk": "14.10. - 25.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-08",
          "isSingleDay": false,
          "rawKmk": "23.12. - 08.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-14",
          "end": "2025-04-25",
          "isSingleDay": false,
          "rawKmk": "14.04. - 25.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-07",
          "end": "2025-08-15",
          "isSingleDay": false,
          "rawKmk": "07.07. - 15.08."
        }
      ]
    },
    "SL": {
      "stateCode": "SL",
      "stateNameDe": "Saarland",
      "movableDays": 3,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-14",
          "end": "2024-10-25",
          "isSingleDay": false,
          "rawKmk": "14.10. - 25.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-03",
          "isSingleDay": false,
          "rawKmk": "23.12. - 03.01."
        },
        {
          "type": "winter",
          "nameDe": "Faschingsferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2025-02-24",
          "end": "2025-03-04",
          "isSingleDay": false,
          "rawKmk": "24.02. - 04.03."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-14",
          "end": "2025-04-25",
          "isSingleDay": false,
          "rawKmk": "14.04. - 25.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-07",
          "end": "2025-08-14",
          "isSingleDay": false,
          "rawKmk": "07.07. - 14.08."
        }
      ]
    },
    "SN": {
      "stateCode": "SN",
      "stateNameDe": "Sachsen",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-07",
          "end": "2024-10-19",
          "isSingleDay": false,
          "rawKmk": "07.10. - 19.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-03",
          "isSingleDay": false,
          "rawKmk": "23.12. - 03.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2025-02-17",
          "end": "2025-03-01",
          "isSingleDay": false,
          "rawKmk": "17.02. - 01.03."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-18",
          "end": "2025-04-25",
          "isSingleDay": false,
          "rawKmk": "18.04. - 25.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-30",
          "end": "2025-05-30",
          "isSingleDay": true,
          "rawKmk": "30.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-06-28",
          "end": "2025-08-08",
          "isSingleDay": false,
          "rawKmk": "28.06. - 08.08."
        }
      ]
    },
    "ST": {
      "stateCode": "ST",
      "stateNameDe": "Sachsen-Anhalt",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-09-30",
          "end": "2024-10-12",
          "isSingleDay": false,
          "rawKmk": "30.09. - 12.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2024-11-01",
          "end": "2024-11-01",
          "isSingleDay": true,
          "rawKmk": "01.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-04",
          "isSingleDay": false,
          "rawKmk": "23.12. - 04.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2025-01-27",
          "end": "2025-01-31",
          "isSingleDay": false,
          "rawKmk": "27.01. - 31.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-07",
          "end": "2025-04-19",
          "isSingleDay": false,
          "rawKmk": "07.04. - 19.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-30",
          "end": "2025-05-30",
          "isSingleDay": true,
          "rawKmk": "30.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-06-28",
          "end": "2025-08-08",
          "isSingleDay": false,
          "rawKmk": "28.06. - 08.08."
        }
      ]
    },
    "SH": {
      "stateCode": "SH",
      "stateNameDe": "Schleswig-Holstein",
      "movableDays": 3,
      "footnote": "Auf den Inseln Sylt, Föhr, Amrum und Helgoland sowie auf den Halligen gelten für die Sommer- und Herbstferien Sonderregelungen.",
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-10-21",
          "end": "2024-11-01",
          "isSingleDay": false,
          "rawKmk": "21.10. - 01.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-19",
          "end": "2025-01-07",
          "isSingleDay": false,
          "rawKmk": "19.12. - 07.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-11",
          "end": "2025-04-25",
          "isSingleDay": false,
          "rawKmk": "11.04. - 25.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-30",
          "end": "2025-05-30",
          "isSingleDay": true,
          "rawKmk": "30.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-07-28",
          "end": "2025-09-06",
          "isSingleDay": false,
          "rawKmk": "28.07. - 06.09."
        }
      ]
    },
    "TH": {
      "stateCode": "TH",
      "stateNameDe": "Thüringen",
      "movableDays": 2,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2024-09-30",
          "end": "2024-10-12",
          "isSingleDay": false,
          "rawKmk": "30.09. - 12.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2024-12-23",
          "end": "2025-01-03",
          "isSingleDay": false,
          "rawKmk": "23.12. - 03.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2025-02-03",
          "end": "2025-02-08",
          "isSingleDay": false,
          "rawKmk": "03.02. - 08.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2025-04-07",
          "end": "2025-04-19",
          "isSingleDay": false,
          "rawKmk": "07.04. - 19.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2025-05-30",
          "end": "2025-05-30",
          "isSingleDay": true,
          "rawKmk": "30.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2025-06-28",
          "end": "2025-08-08",
          "isSingleDay": false,
          "rawKmk": "28.06. - 08.08."
        }
      ]
    }
  },
  "2025/2026": {
    "BW": {
      "stateCode": "BW",
      "stateNameDe": "Baden-Württemberg",
      "movableDays": 3,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-27",
          "end": "2025-10-30",
          "isSingleDay": false,
          "rawKmk": "27.10. - 30.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2025-10-31",
          "end": "2025-10-31",
          "isSingleDay": true,
          "rawKmk": "31.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-05",
          "isSingleDay": false,
          "rawKmk": "22.12. - 05.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-30",
          "end": "2026-04-11",
          "isSingleDay": false,
          "rawKmk": "30.03. - 11.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2026-05-26",
          "end": "2026-06-05",
          "isSingleDay": false,
          "rawKmk": "26.05. - 05.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-30",
          "end": "2026-09-12",
          "isSingleDay": false,
          "rawKmk": "30.07. - 12.09."
        }
      ]
    },
    "BY": {
      "stateCode": "BY",
      "stateNameDe": "Bayern",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-11-03",
          "end": "2025-11-07",
          "isSingleDay": false,
          "rawKmk": "03.11. - 07.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-05",
          "isSingleDay": false,
          "rawKmk": "22.12. - 05.01."
        },
        {
          "type": "winter",
          "nameDe": "Frühjahrsferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2026-02-16",
          "end": "2026-02-20",
          "isSingleDay": false,
          "rawKmk": "16.02. - 20.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-30",
          "end": "2026-04-10",
          "isSingleDay": false,
          "rawKmk": "30.03. - 10.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2026-05-26",
          "end": "2026-06-05",
          "isSingleDay": false,
          "rawKmk": "26.05. - 05.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-08-03",
          "end": "2026-09-14",
          "isSingleDay": false,
          "rawKmk": "03.08. - 14.09."
        }
      ]
    },
    "BE": {
      "stateCode": "BE",
      "stateNameDe": "Berlin",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-20",
          "end": "2025-11-01",
          "isSingleDay": false,
          "rawKmk": "20.10. - 01.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-02",
          "isSingleDay": false,
          "rawKmk": "22.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2026-02-02",
          "end": "2026-02-07",
          "isSingleDay": false,
          "rawKmk": "02.02. - 07.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-30",
          "end": "2026-04-10",
          "isSingleDay": false,
          "rawKmk": "30.03. - 10.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-15",
          "end": "2026-05-15",
          "isSingleDay": true,
          "rawKmk": "15.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-26",
          "end": "2026-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-09",
          "end": "2026-08-22",
          "isSingleDay": false,
          "rawKmk": "09.07. - 22.08."
        }
      ]
    },
    "BB": {
      "stateCode": "BB",
      "stateNameDe": "Brandenburg",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-20",
          "end": "2025-11-01",
          "isSingleDay": false,
          "rawKmk": "20.10. - 01.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-02",
          "isSingleDay": false,
          "rawKmk": "22.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2026-02-02",
          "end": "2026-02-07",
          "isSingleDay": false,
          "rawKmk": "02.02. - 07.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-30",
          "end": "2026-04-10",
          "isSingleDay": false,
          "rawKmk": "30.03. - 10.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-26",
          "end": "2026-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-09",
          "end": "2026-08-22",
          "isSingleDay": false,
          "rawKmk": "09.07. - 22.08."
        }
      ]
    },
    "HB": {
      "stateCode": "HB",
      "stateNameDe": "Bremen",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-13",
          "end": "2025-10-25",
          "isSingleDay": false,
          "rawKmk": "13.10. - 25.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-05",
          "isSingleDay": false,
          "rawKmk": "22.12. - 05.01."
        },
        {
          "type": "winter",
          "nameDe": "Halbjahresferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2026-02-02",
          "end": "2026-02-03",
          "isSingleDay": false,
          "rawKmk": "02.02. - 03.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-23",
          "end": "2026-04-07",
          "isSingleDay": false,
          "rawKmk": "23.03. - 07.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-15",
          "end": "2026-05-15",
          "isSingleDay": true,
          "rawKmk": "15.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-26",
          "end": "2026-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-02",
          "end": "2026-08-12",
          "isSingleDay": false,
          "rawKmk": "02.07. - 12.08."
        }
      ]
    },
    "HH": {
      "stateCode": "HH",
      "stateNameDe": "Hamburg",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-20",
          "end": "2025-10-31",
          "isSingleDay": false,
          "rawKmk": "20.10. - 31.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-17",
          "end": "2026-01-02",
          "isSingleDay": false,
          "rawKmk": "17.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Halbjahresferien (Schulfreier Tag)",
          "nameEn": "Winter Holidays (School-Free Day)",
          "nameKo": "겨울 방학 (단일 휴교일)",
          "start": "2026-01-30",
          "end": "2026-01-30",
          "isSingleDay": true,
          "rawKmk": "30.01."
        },
        {
          "type": "easter",
          "nameDe": "Frühjahrsferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-02",
          "end": "2026-03-13",
          "isSingleDay": false,
          "rawKmk": "02.03. - 13.03."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2026-05-11",
          "end": "2026-05-15",
          "isSingleDay": false,
          "rawKmk": "11.05. - 15.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-09",
          "end": "2026-08-19",
          "isSingleDay": false,
          "rawKmk": "09.07. - 19.08."
        }
      ]
    },
    "HE": {
      "stateCode": "HE",
      "stateNameDe": "Hessen",
      "movableDays": 4,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-06",
          "end": "2025-10-18",
          "isSingleDay": false,
          "rawKmk": "06.10. - 18.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-10",
          "isSingleDay": false,
          "rawKmk": "22.12. - 10.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-30",
          "end": "2026-04-10",
          "isSingleDay": false,
          "rawKmk": "30.03. - 10.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-06-29",
          "end": "2026-08-07",
          "isSingleDay": false,
          "rawKmk": "29.06. - 07.08."
        }
      ]
    },
    "MV": {
      "stateCode": "MV",
      "stateNameDe": "Mecklenburg-Vorpommern",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2025-10-02",
          "end": "2025-10-02",
          "isSingleDay": true,
          "rawKmk": "02.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-20",
          "end": "2025-10-24",
          "isSingleDay": false,
          "rawKmk": "20.10. - 24.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2025-11-03",
          "end": "2025-11-03",
          "isSingleDay": true,
          "rawKmk": "03.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-20",
          "end": "2026-01-03",
          "isSingleDay": false,
          "rawKmk": "20.12. - 03.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2026-02-09",
          "end": "2026-02-20",
          "isSingleDay": false,
          "rawKmk": "09.02. - 20.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-30",
          "end": "2026-04-08",
          "isSingleDay": false,
          "rawKmk": "30.03. - 08.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-15",
          "end": "2026-05-15",
          "isSingleDay": true,
          "rawKmk": "15.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2026-05-22",
          "end": "2026-05-26",
          "isSingleDay": false,
          "rawKmk": "22.05. - 26.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-13",
          "end": "2026-08-22",
          "isSingleDay": false,
          "rawKmk": "13.07. - 22.08."
        }
      ]
    },
    "NI": {
      "stateCode": "NI",
      "stateNameDe": "Niedersachsen",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-13",
          "end": "2025-10-25",
          "isSingleDay": false,
          "rawKmk": "13.10. - 25.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-05",
          "isSingleDay": false,
          "rawKmk": "22.12. - 05.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2026-02-02",
          "end": "2026-02-03",
          "isSingleDay": false,
          "rawKmk": "02.02. - 03.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-23",
          "end": "2026-04-07",
          "isSingleDay": false,
          "rawKmk": "23.03. - 07.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-15",
          "end": "2026-05-15",
          "isSingleDay": true,
          "rawKmk": "15.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-26",
          "end": "2026-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-02",
          "end": "2026-08-12",
          "isSingleDay": false,
          "rawKmk": "02.07. - 12.08."
        }
      ]
    },
    "NW": {
      "stateCode": "NW",
      "stateNameDe": "Nordrhein-Westfalen",
      "movableDays": 3,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-13",
          "end": "2025-10-25",
          "isSingleDay": false,
          "rawKmk": "13.10. - 25.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-06",
          "isSingleDay": false,
          "rawKmk": "22.12. - 06.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-30",
          "end": "2026-04-11",
          "isSingleDay": false,
          "rawKmk": "30.03. - 11.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-26",
          "end": "2026-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-20",
          "end": "2026-09-01",
          "isSingleDay": false,
          "rawKmk": "20.07. - 01.09."
        }
      ]
    },
    "RP": {
      "stateCode": "RP",
      "stateNameDe": "Rheinland-Pfalz",
      "movableDays": 6,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-13",
          "end": "2025-10-24",
          "isSingleDay": false,
          "rawKmk": "13.10. - 24.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-07",
          "isSingleDay": false,
          "rawKmk": "22.12. - 07.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-30",
          "end": "2026-04-10",
          "isSingleDay": false,
          "rawKmk": "30.03. - 10.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-06-29",
          "end": "2026-08-07",
          "isSingleDay": false,
          "rawKmk": "29.06. - 07.08."
        }
      ]
    },
    "SL": {
      "stateCode": "SL",
      "stateNameDe": "Saarland",
      "movableDays": 2,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-13",
          "end": "2025-10-24",
          "isSingleDay": false,
          "rawKmk": "13.10. - 24.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-02",
          "isSingleDay": false,
          "rawKmk": "22.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Faschingsferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2026-02-16",
          "end": "2026-02-20",
          "isSingleDay": false,
          "rawKmk": "16.02. - 20.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-04-07",
          "end": "2026-04-17",
          "isSingleDay": false,
          "rawKmk": "07.04. - 17.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-06-29",
          "end": "2026-08-07",
          "isSingleDay": false,
          "rawKmk": "29.06. - 07.08."
        }
      ]
    },
    "SN": {
      "stateCode": "SN",
      "stateNameDe": "Sachsen",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-06",
          "end": "2025-10-18",
          "isSingleDay": false,
          "rawKmk": "06.10. - 18.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-02",
          "isSingleDay": false,
          "rawKmk": "22.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2026-02-09",
          "end": "2026-02-21",
          "isSingleDay": false,
          "rawKmk": "09.02. - 21.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-04-03",
          "end": "2026-04-10",
          "isSingleDay": false,
          "rawKmk": "03.04. - 10.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-15",
          "end": "2026-05-15",
          "isSingleDay": true,
          "rawKmk": "15.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-04",
          "end": "2026-08-14",
          "isSingleDay": false,
          "rawKmk": "04.07. - 14.08."
        }
      ]
    },
    "ST": {
      "stateCode": "ST",
      "stateNameDe": "Sachsen-Anhalt",
      "movableDays": 2,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-13",
          "end": "2025-10-25",
          "isSingleDay": false,
          "rawKmk": "13.10. - 25.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-05",
          "isSingleDay": false,
          "rawKmk": "22.12. - 05.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2026-01-31",
          "end": "2026-02-06",
          "isSingleDay": false,
          "rawKmk": "31.01. - 06.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-30",
          "end": "2026-04-04",
          "isSingleDay": false,
          "rawKmk": "30.03. - 04.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2026-05-26",
          "end": "2026-05-29",
          "isSingleDay": false,
          "rawKmk": "26.05. - 29.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-04",
          "end": "2026-08-14",
          "isSingleDay": false,
          "rawKmk": "04.07. - 14.08."
        }
      ]
    },
    "SH": {
      "stateCode": "SH",
      "stateNameDe": "Schleswig-Holstein",
      "movableDays": 3,
      "footnote": "Auf den Inseln Sylt, Föhr, Amrum und Helgoland sowie auf den Halligen gelten für die Sommer- und Herbstferien Sonderregelungen.",
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-20",
          "end": "2025-10-30",
          "isSingleDay": false,
          "rawKmk": "20.10. - 30.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-19",
          "end": "2026-01-06",
          "isSingleDay": false,
          "rawKmk": "19.12. - 06.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-03-26",
          "end": "2026-04-10",
          "isSingleDay": false,
          "rawKmk": "26.03. - 10.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-15",
          "end": "2026-05-15",
          "isSingleDay": true,
          "rawKmk": "15.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-04",
          "end": "2026-08-15",
          "isSingleDay": false,
          "rawKmk": "04.07. - 15.08."
        }
      ]
    },
    "TH": {
      "stateCode": "TH",
      "stateNameDe": "Thüringen",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2025-10-06",
          "end": "2025-10-18",
          "isSingleDay": false,
          "rawKmk": "06.10. - 18.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2025-12-22",
          "end": "2026-01-03",
          "isSingleDay": false,
          "rawKmk": "22.12. - 03.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2026-02-16",
          "end": "2026-02-21",
          "isSingleDay": false,
          "rawKmk": "16.02. - 21.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2026-04-07",
          "end": "2026-04-17",
          "isSingleDay": false,
          "rawKmk": "07.04. - 17.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2026-05-15",
          "end": "2026-05-15",
          "isSingleDay": true,
          "rawKmk": "15.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2026-07-04",
          "end": "2026-08-14",
          "isSingleDay": false,
          "rawKmk": "04.07. - 14.08."
        }
      ]
    }
  },
  "2026/2027": {
    "BW": {
      "stateCode": "BW",
      "stateNameDe": "Baden-Württemberg",
      "movableDays": 4,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-26",
          "end": "2026-10-30",
          "isSingleDay": false,
          "rawKmk": "26.10. - 30.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2026-10-31",
          "end": "2026-10-31",
          "isSingleDay": true,
          "rawKmk": "31.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-23",
          "end": "2027-01-09",
          "isSingleDay": false,
          "rawKmk": "23.12. - 09.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien (Schulfreier Tag)",
          "nameEn": "Easter Holidays (School-Free Day)",
          "nameKo": "부활절/봄 방학 (단일 휴교일)",
          "start": "2027-03-25",
          "end": "2027-03-25",
          "isSingleDay": true,
          "rawKmk": "25.03."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-30",
          "end": "2027-04-03",
          "isSingleDay": false,
          "rawKmk": "30.03. - 03.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2027-05-18",
          "end": "2027-05-29",
          "isSingleDay": false,
          "rawKmk": "18.05. - 29.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-29",
          "end": "2027-09-11",
          "isSingleDay": false,
          "rawKmk": "29.07. - 11.09."
        }
      ]
    },
    "BY": {
      "stateCode": "BY",
      "stateNameDe": "Bayern",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-11-02",
          "end": "2026-11-06",
          "isSingleDay": false,
          "rawKmk": "02.11. - 06.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-24",
          "end": "2027-01-08",
          "isSingleDay": false,
          "rawKmk": "24.12. - 08.01."
        },
        {
          "type": "winter",
          "nameDe": "Frühjahrsferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2027-02-08",
          "end": "2027-02-12",
          "isSingleDay": false,
          "rawKmk": "08.02. - 12.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-22",
          "end": "2027-04-02",
          "isSingleDay": false,
          "rawKmk": "22.03. - 02.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2027-05-18",
          "end": "2027-05-28",
          "isSingleDay": false,
          "rawKmk": "18.05. - 28.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-08-02",
          "end": "2027-09-13",
          "isSingleDay": false,
          "rawKmk": "02.08. - 13.09."
        }
      ]
    },
    "BE": {
      "stateCode": "BE",
      "stateNameDe": "Berlin",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-19",
          "end": "2026-10-31",
          "isSingleDay": false,
          "rawKmk": "19.10. - 31.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-23",
          "end": "2027-01-02",
          "isSingleDay": false,
          "rawKmk": "23.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2027-02-01",
          "end": "2027-02-06",
          "isSingleDay": false,
          "rawKmk": "01.02. - 06.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-22",
          "end": "2027-04-02",
          "isSingleDay": false,
          "rawKmk": "22.03. - 02.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2027-05-07",
          "end": "2027-05-07",
          "isSingleDay": true,
          "rawKmk": "07.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2027-05-18",
          "end": "2027-05-19",
          "isSingleDay": false,
          "rawKmk": "18.05. - 19.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-01",
          "end": "2027-08-14",
          "isSingleDay": false,
          "rawKmk": "01.07. - 14.08."
        }
      ]
    },
    "BB": {
      "stateCode": "BB",
      "stateNameDe": "Brandenburg",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-19",
          "end": "2026-10-30",
          "isSingleDay": false,
          "rawKmk": "19.10. - 30.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-23",
          "end": "2027-01-02",
          "isSingleDay": false,
          "rawKmk": "23.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2027-02-01",
          "end": "2027-02-06",
          "isSingleDay": false,
          "rawKmk": "01.02. - 06.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-22",
          "end": "2027-04-03",
          "isSingleDay": false,
          "rawKmk": "22.03. - 03.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2027-05-18",
          "end": "2027-05-18",
          "isSingleDay": true,
          "rawKmk": "18.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-01",
          "end": "2027-08-14",
          "isSingleDay": false,
          "rawKmk": "01.07. - 14.08."
        }
      ]
    },
    "HB": {
      "stateCode": "HB",
      "stateNameDe": "Bremen",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-12",
          "end": "2026-10-24",
          "isSingleDay": false,
          "rawKmk": "12.10. - 24.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-23",
          "end": "2027-01-09",
          "isSingleDay": false,
          "rawKmk": "23.12. - 09.01."
        },
        {
          "type": "winter",
          "nameDe": "Halbjahresferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2027-02-01",
          "end": "2027-02-02",
          "isSingleDay": false,
          "rawKmk": "01.02. - 02.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-22",
          "end": "2027-04-03",
          "isSingleDay": false,
          "rawKmk": "22.03. - 03.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2027-05-07",
          "end": "2027-05-07",
          "isSingleDay": true,
          "rawKmk": "07.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2027-05-18",
          "end": "2027-05-18",
          "isSingleDay": true,
          "rawKmk": "18.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-08",
          "end": "2027-08-18",
          "isSingleDay": false,
          "rawKmk": "08.07. - 18.08."
        }
      ]
    },
    "HH": {
      "stateCode": "HH",
      "stateNameDe": "Hamburg",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-19",
          "end": "2026-10-30",
          "isSingleDay": false,
          "rawKmk": "19.10. - 30.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-21",
          "end": "2027-01-01",
          "isSingleDay": false,
          "rawKmk": "21.12. - 01.01."
        },
        {
          "type": "winter",
          "nameDe": "Halbjahresferien (Schulfreier Tag)",
          "nameEn": "Winter Holidays (School-Free Day)",
          "nameKo": "겨울 방학 (단일 휴교일)",
          "start": "2027-01-29",
          "end": "2027-01-29",
          "isSingleDay": true,
          "rawKmk": "29.01."
        },
        {
          "type": "easter",
          "nameDe": "Frühjahrsferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-01",
          "end": "2027-03-12",
          "isSingleDay": false,
          "rawKmk": "01.03. - 12.03."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2027-05-07",
          "end": "2027-05-14",
          "isSingleDay": false,
          "rawKmk": "07.05. - 14.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-01",
          "end": "2027-08-11",
          "isSingleDay": false,
          "rawKmk": "01.07. - 11.08."
        }
      ]
    },
    "HE": {
      "stateCode": "HE",
      "stateNameDe": "Hessen",
      "movableDays": 4,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-05",
          "end": "2026-10-17",
          "isSingleDay": false,
          "rawKmk": "05.10. - 17.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-23",
          "end": "2027-01-12",
          "isSingleDay": false,
          "rawKmk": "23.12. - 12.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-22",
          "end": "2027-04-02",
          "isSingleDay": false,
          "rawKmk": "22.03. - 02.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-06-28",
          "end": "2027-08-06",
          "isSingleDay": false,
          "rawKmk": "28.06. - 06.08."
        }
      ]
    },
    "MV": {
      "stateCode": "MV",
      "stateNameDe": "Mecklenburg-Vorpommern",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-15",
          "end": "2026-10-24",
          "isSingleDay": false,
          "rawKmk": "15.10. - 24.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-21",
          "end": "2027-01-02",
          "isSingleDay": false,
          "rawKmk": "21.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2027-02-08",
          "end": "2027-02-19",
          "isSingleDay": false,
          "rawKmk": "08.02. - 19.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-24",
          "end": "2027-04-02",
          "isSingleDay": false,
          "rawKmk": "24.03. - 02.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2027-05-07",
          "end": "2027-05-07",
          "isSingleDay": true,
          "rawKmk": "07.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2027-05-14",
          "end": "2027-05-18",
          "isSingleDay": false,
          "rawKmk": "14.05. - 18.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-05",
          "end": "2027-08-14",
          "isSingleDay": false,
          "rawKmk": "05.07. - 14.08."
        }
      ]
    },
    "NI": {
      "stateCode": "NI",
      "stateNameDe": "Niedersachsen",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-12",
          "end": "2026-10-24",
          "isSingleDay": false,
          "rawKmk": "12.10. - 24.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-23",
          "end": "2027-01-09",
          "isSingleDay": false,
          "rawKmk": "23.12. - 09.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2027-02-01",
          "end": "2027-02-02",
          "isSingleDay": false,
          "rawKmk": "01.02. - 02.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-22",
          "end": "2027-04-03",
          "isSingleDay": false,
          "rawKmk": "22.03. - 03.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2027-05-07",
          "end": "2027-05-07",
          "isSingleDay": true,
          "rawKmk": "07.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2027-05-18",
          "end": "2027-05-18",
          "isSingleDay": true,
          "rawKmk": "18.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-08",
          "end": "2027-08-18",
          "isSingleDay": false,
          "rawKmk": "08.07. - 18.08."
        }
      ]
    },
    "NW": {
      "stateCode": "NW",
      "stateNameDe": "Nordrhein-Westfalen",
      "movableDays": 3,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-17",
          "end": "2026-10-31",
          "isSingleDay": false,
          "rawKmk": "17.10. - 31.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-23",
          "end": "2027-01-06",
          "isSingleDay": false,
          "rawKmk": "23.12. - 06.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-22",
          "end": "2027-04-03",
          "isSingleDay": false,
          "rawKmk": "22.03. - 03.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2027-05-18",
          "end": "2027-05-18",
          "isSingleDay": true,
          "rawKmk": "18.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-19",
          "end": "2027-08-31",
          "isSingleDay": false,
          "rawKmk": "19.07. - 31.08."
        }
      ]
    },
    "RP": {
      "stateCode": "RP",
      "stateNameDe": "Rheinland-Pfalz",
      "movableDays": 6,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-05",
          "end": "2026-10-16",
          "isSingleDay": false,
          "rawKmk": "05.10. - 16.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-23",
          "end": "2027-01-08",
          "isSingleDay": false,
          "rawKmk": "23.12. - 08.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-22",
          "end": "2027-04-02",
          "isSingleDay": false,
          "rawKmk": "22.03. - 02.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-06-28",
          "end": "2027-08-06",
          "isSingleDay": false,
          "rawKmk": "28.06. - 06.08."
        }
      ]
    },
    "SL": {
      "stateCode": "SL",
      "stateNameDe": "Saarland",
      "movableDays": 2,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-05",
          "end": "2026-10-16",
          "isSingleDay": false,
          "rawKmk": "05.10. - 16.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-21",
          "end": "2026-12-31",
          "isSingleDay": false,
          "rawKmk": "21.12. - 31.12."
        },
        {
          "type": "winter",
          "nameDe": "Faschingsferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2027-02-08",
          "end": "2027-02-12",
          "isSingleDay": false,
          "rawKmk": "08.02. - 12.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-30",
          "end": "2027-04-09",
          "isSingleDay": false,
          "rawKmk": "30.03. - 09.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-06-28",
          "end": "2027-08-06",
          "isSingleDay": false,
          "rawKmk": "28.06. - 06.08."
        }
      ]
    },
    "SN": {
      "stateCode": "SN",
      "stateNameDe": "Sachsen",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-12",
          "end": "2026-10-24",
          "isSingleDay": false,
          "rawKmk": "12.10. - 24.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-23",
          "end": "2027-01-02",
          "isSingleDay": false,
          "rawKmk": "23.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2027-02-08",
          "end": "2027-02-19",
          "isSingleDay": false,
          "rawKmk": "08.02. - 19.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-26",
          "end": "2027-04-02",
          "isSingleDay": false,
          "rawKmk": "26.03. - 02.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2027-05-07",
          "end": "2027-05-07",
          "isSingleDay": true,
          "rawKmk": "07.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2027-05-15",
          "end": "2027-05-18",
          "isSingleDay": false,
          "rawKmk": "15.05. - 18.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-10",
          "end": "2027-08-20",
          "isSingleDay": false,
          "rawKmk": "10.07. - 20.08."
        }
      ]
    },
    "ST": {
      "stateCode": "ST",
      "stateNameDe": "Sachsen-Anhalt",
      "movableDays": 2,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-19",
          "end": "2026-10-30",
          "isSingleDay": false,
          "rawKmk": "19.10. - 30.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-21",
          "end": "2027-01-02",
          "isSingleDay": false,
          "rawKmk": "21.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2027-02-01",
          "end": "2027-02-06",
          "isSingleDay": false,
          "rawKmk": "01.02. - 06.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-22",
          "end": "2027-03-27",
          "isSingleDay": false,
          "rawKmk": "22.03. - 27.03."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2027-05-15",
          "end": "2027-05-22",
          "isSingleDay": false,
          "rawKmk": "15.05. - 22.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-10",
          "end": "2027-08-20",
          "isSingleDay": false,
          "rawKmk": "10.07. - 20.08."
        }
      ]
    },
    "SH": {
      "stateCode": "SH",
      "stateNameDe": "Schleswig-Holstein",
      "movableDays": 2,
      "footnote": "Auf den Inseln Sylt, Föhr, Amrum und Helgoland sowie auf den Halligen gelten für die Sommer- und Herbstferien Sonderregelungen.",
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-12",
          "end": "2026-10-24",
          "isSingleDay": false,
          "rawKmk": "12.10. - 24.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-21",
          "end": "2027-01-06",
          "isSingleDay": false,
          "rawKmk": "21.12. - 06.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-30",
          "end": "2027-04-10",
          "isSingleDay": false,
          "rawKmk": "30.03. - 10.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2027-05-07",
          "end": "2027-05-07",
          "isSingleDay": true,
          "rawKmk": "07.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-03",
          "end": "2027-08-14",
          "isSingleDay": false,
          "rawKmk": "03.07. - 14.08."
        }
      ]
    },
    "TH": {
      "stateCode": "TH",
      "stateNameDe": "Thüringen",
      "movableDays": 2,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2026-10-12",
          "end": "2026-10-24",
          "isSingleDay": false,
          "rawKmk": "12.10. - 24.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2026-12-23",
          "end": "2027-01-02",
          "isSingleDay": false,
          "rawKmk": "23.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2027-02-01",
          "end": "2027-02-06",
          "isSingleDay": false,
          "rawKmk": "01.02. - 06.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2027-03-22",
          "end": "2027-04-03",
          "isSingleDay": false,
          "rawKmk": "22.03. - 03.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2027-05-07",
          "end": "2027-05-07",
          "isSingleDay": true,
          "rawKmk": "07.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2027-07-10",
          "end": "2027-08-20",
          "isSingleDay": false,
          "rawKmk": "10.07. - 20.08."
        }
      ]
    }
  },
  "2027/2028": {
    "BW": {
      "stateCode": "BW",
      "stateNameDe": "Baden-Württemberg",
      "movableDays": 4,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-11-02",
          "end": "2027-11-06",
          "isSingleDay": false,
          "rawKmk": "02.11. - 06.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-23",
          "end": "2028-01-08",
          "isSingleDay": false,
          "rawKmk": "23.12. - 08.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien (Schulfreier Tag)",
          "nameEn": "Easter Holidays (School-Free Day)",
          "nameKo": "부활절/봄 방학 (단일 휴교일)",
          "start": "2028-04-13",
          "end": "2028-04-13",
          "isSingleDay": true,
          "rawKmk": "13.04."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-18",
          "end": "2028-04-22",
          "isSingleDay": false,
          "rawKmk": "18.04. - 22.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2028-06-06",
          "end": "2028-06-17",
          "isSingleDay": false,
          "rawKmk": "06.06. - 17.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-27",
          "end": "2028-09-09",
          "isSingleDay": false,
          "rawKmk": "27.07. - 09.09."
        }
      ]
    },
    "BY": {
      "stateCode": "BY",
      "stateNameDe": "Bayern",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-11-02",
          "end": "2027-11-05",
          "isSingleDay": false,
          "rawKmk": "02.11. - 05.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-24",
          "end": "2028-01-07",
          "isSingleDay": false,
          "rawKmk": "24.12. - 07.01."
        },
        {
          "type": "winter",
          "nameDe": "Frühjahrsferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2028-02-28",
          "end": "2028-03-03",
          "isSingleDay": false,
          "rawKmk": "28.02. - 03.03."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-10",
          "end": "2028-04-21",
          "isSingleDay": false,
          "rawKmk": "10.04. - 21.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2028-06-06",
          "end": "2028-06-16",
          "isSingleDay": false,
          "rawKmk": "06.06. - 16.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-31",
          "end": "2028-09-11",
          "isSingleDay": false,
          "rawKmk": "31.07. - 11.09."
        }
      ]
    },
    "BE": {
      "stateCode": "BE",
      "stateNameDe": "Berlin",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-11",
          "end": "2027-10-23",
          "isSingleDay": false,
          "rawKmk": "11.10. - 23.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-22",
          "end": "2027-12-31",
          "isSingleDay": false,
          "rawKmk": "22.12. - 31.12."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2028-01-31",
          "end": "2028-02-05",
          "isSingleDay": false,
          "rawKmk": "31.01. - 05.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-10",
          "end": "2028-04-22",
          "isSingleDay": false,
          "rawKmk": "10.04. - 22.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2028-05-26",
          "end": "2028-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2028-06-01",
          "end": "2028-06-02",
          "isSingleDay": false,
          "rawKmk": "01.06. - 02.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-01",
          "end": "2028-08-12",
          "isSingleDay": false,
          "rawKmk": "01.07. - 12.08."
        }
      ]
    },
    "BB": {
      "stateCode": "BB",
      "stateNameDe": "Brandenburg",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-11",
          "end": "2027-10-23",
          "isSingleDay": false,
          "rawKmk": "11.10. - 23.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-23",
          "end": "2027-12-31",
          "isSingleDay": false,
          "rawKmk": "23.12. - 31.12."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2028-01-31",
          "end": "2028-02-05",
          "isSingleDay": false,
          "rawKmk": "31.01. - 05.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-10",
          "end": "2028-04-22",
          "isSingleDay": false,
          "rawKmk": "10.04. - 22.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-06-29",
          "end": "2028-08-12",
          "isSingleDay": false,
          "rawKmk": "29.06. - 12.08."
        }
      ]
    },
    "HB": {
      "stateCode": "HB",
      "stateNameDe": "Bremen",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-18",
          "end": "2027-10-30",
          "isSingleDay": false,
          "rawKmk": "18.10. - 30.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-23",
          "end": "2028-01-08",
          "isSingleDay": false,
          "rawKmk": "23.12. - 08.01."
        },
        {
          "type": "winter",
          "nameDe": "Halbjahresferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2028-01-31",
          "end": "2028-02-01",
          "isSingleDay": false,
          "rawKmk": "31.01. - 01.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-10",
          "end": "2028-04-22",
          "isSingleDay": false,
          "rawKmk": "10.04. - 22.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2028-05-26",
          "end": "2028-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2028-06-06",
          "end": "2028-06-06",
          "isSingleDay": true,
          "rawKmk": "06.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-20",
          "end": "2028-08-30",
          "isSingleDay": false,
          "rawKmk": "20.07. - 30.08."
        }
      ]
    },
    "HH": {
      "stateCode": "HH",
      "stateNameDe": "Hamburg",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-11",
          "end": "2027-10-22",
          "isSingleDay": false,
          "rawKmk": "11.10. - 22.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-20",
          "end": "2027-12-31",
          "isSingleDay": false,
          "rawKmk": "20.12. - 31.12."
        },
        {
          "type": "winter",
          "nameDe": "Halbjahresferien (Schulfreier Tag)",
          "nameEn": "Winter Holidays (School-Free Day)",
          "nameKo": "겨울 방학 (단일 휴교일)",
          "start": "2028-01-28",
          "end": "2028-01-28",
          "isSingleDay": true,
          "rawKmk": "28.01."
        },
        {
          "type": "easter",
          "nameDe": "Frühjahrsferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-03-06",
          "end": "2028-03-17",
          "isSingleDay": false,
          "rawKmk": "06.03. - 17.03."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2028-05-22",
          "end": "2028-05-26",
          "isSingleDay": false,
          "rawKmk": "22.05. - 26.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-03",
          "end": "2028-08-11",
          "isSingleDay": false,
          "rawKmk": "03.07. - 11.08."
        }
      ]
    },
    "HE": {
      "stateCode": "HE",
      "stateNameDe": "Hessen",
      "movableDays": 3,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-04",
          "end": "2027-10-16",
          "isSingleDay": false,
          "rawKmk": "04.10. - 16.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-23",
          "end": "2028-01-11",
          "isSingleDay": false,
          "rawKmk": "23.12. - 11.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-03",
          "end": "2028-04-14",
          "isSingleDay": false,
          "rawKmk": "03.04. - 14.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-03",
          "end": "2028-08-11",
          "isSingleDay": false,
          "rawKmk": "03.07. - 11.08."
        }
      ]
    },
    "MV": {
      "stateCode": "MV",
      "stateNameDe": "Mecklenburg-Vorpommern",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-14",
          "end": "2027-10-23",
          "isSingleDay": false,
          "rawKmk": "14.10. - 23.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-22",
          "end": "2028-01-04",
          "isSingleDay": false,
          "rawKmk": "22.12. - 04.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2028-02-05",
          "end": "2028-02-17",
          "isSingleDay": false,
          "rawKmk": "05.02. - 17.02."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien (Schulfreier Tag)",
          "nameEn": "Winter Holidays (School-Free Day)",
          "nameKo": "겨울 방학 (단일 휴교일)",
          "start": "2028-02-18",
          "end": "2028-02-18",
          "isSingleDay": true,
          "rawKmk": "18.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-12",
          "end": "2028-04-21",
          "isSingleDay": false,
          "rawKmk": "12.04. - 21.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2028-05-26",
          "end": "2028-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2028-06-02",
          "end": "2028-06-06",
          "isSingleDay": false,
          "rawKmk": "02.06. - 06.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-06-26",
          "end": "2028-08-05",
          "isSingleDay": false,
          "rawKmk": "26.06. - 05.08."
        }
      ]
    },
    "NI": {
      "stateCode": "NI",
      "stateNameDe": "Niedersachsen",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-16",
          "end": "2027-10-30",
          "isSingleDay": false,
          "rawKmk": "16.10. - 30.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-23",
          "end": "2028-01-08",
          "isSingleDay": false,
          "rawKmk": "23.12. - 08.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2028-01-31",
          "end": "2028-02-01",
          "isSingleDay": false,
          "rawKmk": "31.01. - 01.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-10",
          "end": "2028-04-22",
          "isSingleDay": false,
          "rawKmk": "10.04. - 22.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2028-05-26",
          "end": "2028-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2028-06-06",
          "end": "2028-06-06",
          "isSingleDay": true,
          "rawKmk": "06.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-20",
          "end": "2028-08-30",
          "isSingleDay": false,
          "rawKmk": "20.07. - 30.08."
        }
      ]
    },
    "NW": {
      "stateCode": "NW",
      "stateNameDe": "Nordrhein-Westfalen",
      "movableDays": 3,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-23",
          "end": "2027-11-06",
          "isSingleDay": false,
          "rawKmk": "23.10. - 06.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-24",
          "end": "2028-01-08",
          "isSingleDay": false,
          "rawKmk": "24.12. - 08.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-10",
          "end": "2028-04-22",
          "isSingleDay": false,
          "rawKmk": "10.04. - 22.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-10",
          "end": "2028-08-22",
          "isSingleDay": false,
          "rawKmk": "10.07. - 22.08."
        }
      ]
    },
    "RP": {
      "stateCode": "RP",
      "stateNameDe": "Rheinland-Pfalz",
      "movableDays": 6,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-04",
          "end": "2027-10-15",
          "isSingleDay": false,
          "rawKmk": "04.10. - 15.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-23",
          "end": "2028-01-07",
          "isSingleDay": false,
          "rawKmk": "23.12. - 07.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-10",
          "end": "2028-04-21",
          "isSingleDay": false,
          "rawKmk": "10.04. - 21.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-03",
          "end": "2028-08-11",
          "isSingleDay": false,
          "rawKmk": "03.07. - 11.08."
        }
      ]
    },
    "SL": {
      "stateCode": "SL",
      "stateNameDe": "Saarland",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-04",
          "end": "2027-10-15",
          "isSingleDay": false,
          "rawKmk": "04.10. - 15.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-20",
          "end": "2027-12-31",
          "isSingleDay": false,
          "rawKmk": "20.12. - 31.12."
        },
        {
          "type": "winter",
          "nameDe": "Faschingsferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2028-02-21",
          "end": "2028-02-29",
          "isSingleDay": false,
          "rawKmk": "21.02. - 29.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-12",
          "end": "2028-04-21",
          "isSingleDay": false,
          "rawKmk": "12.04. - 21.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-03",
          "end": "2028-08-11",
          "isSingleDay": false,
          "rawKmk": "03.07. - 11.08."
        }
      ]
    },
    "SN": {
      "stateCode": "SN",
      "stateNameDe": "Sachsen",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-11",
          "end": "2027-10-23",
          "isSingleDay": false,
          "rawKmk": "11.10. - 23.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-23",
          "end": "2028-01-01",
          "isSingleDay": false,
          "rawKmk": "23.12. - 01.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2028-02-14",
          "end": "2028-02-26",
          "isSingleDay": false,
          "rawKmk": "14.02. - 26.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-14",
          "end": "2028-04-22",
          "isSingleDay": false,
          "rawKmk": "14.04. - 22.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2028-05-26",
          "end": "2028-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-22",
          "end": "2028-09-01",
          "isSingleDay": false,
          "rawKmk": "22.07. - 01.09."
        }
      ]
    },
    "ST": {
      "stateCode": "ST",
      "stateNameDe": "Sachsen-Anhalt",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-18",
          "end": "2027-10-23",
          "isSingleDay": false,
          "rawKmk": "18.10. - 23.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-20",
          "end": "2027-12-31",
          "isSingleDay": false,
          "rawKmk": "20.12. - 31.12."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2028-02-07",
          "end": "2028-02-12",
          "isSingleDay": false,
          "rawKmk": "07.02. - 12.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-10",
          "end": "2028-04-22",
          "isSingleDay": false,
          "rawKmk": "10.04. - 22.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2028-06-03",
          "end": "2028-06-10",
          "isSingleDay": false,
          "rawKmk": "03.06. - 10.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-22",
          "end": "2028-09-01",
          "isSingleDay": false,
          "rawKmk": "22.07. - 01.09."
        }
      ]
    },
    "SH": {
      "stateCode": "SH",
      "stateNameDe": "Schleswig-Holstein",
      "movableDays": 1,
      "footnote": "Auf den Inseln Sylt, Föhr, Amrum und Helgoland sowie auf den Halligen gelten für die Sommer- und Herbstferien Sonderregelungen.",
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-11",
          "end": "2027-10-23",
          "isSingleDay": false,
          "rawKmk": "11.10. - 23.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-23",
          "end": "2028-01-08",
          "isSingleDay": false,
          "rawKmk": "23.12. - 08.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-03",
          "end": "2028-04-15",
          "isSingleDay": false,
          "rawKmk": "03.04. - 15.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2028-05-26",
          "end": "2028-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-06-24",
          "end": "2028-08-04",
          "isSingleDay": false,
          "rawKmk": "24.06. - 04.08."
        }
      ]
    },
    "TH": {
      "stateCode": "TH",
      "stateNameDe": "Thüringen",
      "movableDays": 1,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2027-10-09",
          "end": "2027-10-23",
          "isSingleDay": false,
          "rawKmk": "09.10. - 23.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2027-12-23",
          "end": "2027-12-31",
          "isSingleDay": false,
          "rawKmk": "23.12. - 31.12."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2028-02-07",
          "end": "2028-02-12",
          "isSingleDay": false,
          "rawKmk": "07.02. - 12.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2028-04-03",
          "end": "2028-04-15",
          "isSingleDay": false,
          "rawKmk": "03.04. - 15.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2028-05-26",
          "end": "2028-05-26",
          "isSingleDay": true,
          "rawKmk": "26.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2028-07-22",
          "end": "2028-09-01",
          "isSingleDay": false,
          "rawKmk": "22.07. - 01.09."
        }
      ]
    }
  },
  "2028/2029": {
    "BW": {
      "stateCode": "BW",
      "stateNameDe": "Baden-Württemberg",
      "movableDays": 5,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-30",
          "end": "2028-11-03",
          "isSingleDay": false,
          "rawKmk": "30.10. - 03.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-23",
          "end": "2029-01-05",
          "isSingleDay": false,
          "rawKmk": "23.12. - 05.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-26",
          "end": "2029-04-07",
          "isSingleDay": false,
          "rawKmk": "26.03. - 07.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2029-05-22",
          "end": "2029-06-01",
          "isSingleDay": false,
          "rawKmk": "22.05. - 01.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-26",
          "end": "2029-09-08",
          "isSingleDay": false,
          "rawKmk": "26.07. - 08.09."
        }
      ]
    },
    "BY": {
      "stateCode": "BY",
      "stateNameDe": "Bayern",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-30",
          "end": "2028-11-03",
          "isSingleDay": false,
          "rawKmk": "30.10. - 03.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-23",
          "end": "2029-01-05",
          "isSingleDay": false,
          "rawKmk": "23.12. - 05.01."
        },
        {
          "type": "winter",
          "nameDe": "Frühjahrsferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2029-02-12",
          "end": "2029-02-16",
          "isSingleDay": false,
          "rawKmk": "12.02. - 16.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-26",
          "end": "2029-04-06",
          "isSingleDay": false,
          "rawKmk": "26.03. - 06.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2029-05-22",
          "end": "2029-06-01",
          "isSingleDay": false,
          "rawKmk": "22.05. - 01.06."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-30",
          "end": "2029-09-10",
          "isSingleDay": false,
          "rawKmk": "30.07. - 10.09."
        }
      ]
    },
    "BE": {
      "stateCode": "BE",
      "stateNameDe": "Berlin",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-02",
          "end": "2028-10-14",
          "isSingleDay": false,
          "rawKmk": "02.10. - 14.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-22",
          "end": "2029-01-02",
          "isSingleDay": false,
          "rawKmk": "22.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2029-01-29",
          "end": "2029-02-03",
          "isSingleDay": false,
          "rawKmk": "29.01. - 03.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien (Schulfreier Tag)",
          "nameEn": "Easter Holidays (School-Free Day)",
          "nameKo": "부활절/봄 방학 (단일 휴교일)",
          "start": "2029-03-09",
          "end": "2029-03-09",
          "isSingleDay": true,
          "rawKmk": "09.03."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-26",
          "end": "2029-04-06",
          "isSingleDay": false,
          "rawKmk": "26.03. - 06.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-04-30",
          "end": "2029-04-30",
          "isSingleDay": true,
          "rawKmk": "30.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-05-11",
          "end": "2029-05-11",
          "isSingleDay": true,
          "rawKmk": "11.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2029-05-22",
          "end": "2029-05-25",
          "isSingleDay": false,
          "rawKmk": "22.05. - 25.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-01",
          "end": "2029-08-11",
          "isSingleDay": false,
          "rawKmk": "01.07. - 11.08."
        }
      ]
    },
    "BB": {
      "stateCode": "BB",
      "stateNameDe": "Brandenburg",
      "movableDays": 3,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-02",
          "end": "2028-10-14",
          "isSingleDay": false,
          "rawKmk": "02.10. - 14.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-22",
          "end": "2029-01-02",
          "isSingleDay": false,
          "rawKmk": "22.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2029-01-29",
          "end": "2029-02-03",
          "isSingleDay": false,
          "rawKmk": "29.01. - 03.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-26",
          "end": "2029-04-06",
          "isSingleDay": false,
          "rawKmk": "26.03. - 06.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-05-22",
          "end": "2029-05-22",
          "isSingleDay": true,
          "rawKmk": "22.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-06-28",
          "end": "2029-08-11",
          "isSingleDay": false,
          "rawKmk": "28.06. - 11.08."
        }
      ]
    },
    "HB": {
      "stateCode": "HB",
      "stateNameDe": "Bremen",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2028-10-02",
          "end": "2028-10-02",
          "isSingleDay": true,
          "rawKmk": "02.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-23",
          "end": "2028-11-04",
          "isSingleDay": false,
          "rawKmk": "23.10. - 04.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-27",
          "end": "2029-01-06",
          "isSingleDay": false,
          "rawKmk": "27.12. - 06.01."
        },
        {
          "type": "winter",
          "nameDe": "Halbjahresferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2029-02-01",
          "end": "2029-02-02",
          "isSingleDay": false,
          "rawKmk": "01.02. - 02.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-19",
          "end": "2029-04-03",
          "isSingleDay": false,
          "rawKmk": "19.03. - 03.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-04-30",
          "end": "2029-04-30",
          "isSingleDay": true,
          "rawKmk": "30.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-05-11",
          "end": "2029-05-11",
          "isSingleDay": true,
          "rawKmk": "11.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-05-22",
          "end": "2029-05-22",
          "isSingleDay": true,
          "rawKmk": "22.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-19",
          "end": "2029-08-29",
          "isSingleDay": false,
          "rawKmk": "19.07. - 29.08."
        }
      ]
    },
    "HH": {
      "stateCode": "HH",
      "stateNameDe": "Hamburg",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-02",
          "end": "2028-10-13",
          "isSingleDay": false,
          "rawKmk": "02.10. - 13.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2028-10-30",
          "end": "2028-10-30",
          "isSingleDay": true,
          "rawKmk": "30.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-18",
          "end": "2028-12-29",
          "isSingleDay": false,
          "rawKmk": "18.12. - 29.12."
        },
        {
          "type": "winter",
          "nameDe": "Halbjahresferien (Schulfreier Tag)",
          "nameEn": "Winter Holidays (School-Free Day)",
          "nameKo": "겨울 방학 (단일 휴교일)",
          "start": "2029-02-02",
          "end": "2029-02-02",
          "isSingleDay": true,
          "rawKmk": "02.02."
        },
        {
          "type": "easter",
          "nameDe": "Frühjahrsferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-05",
          "end": "2029-03-16",
          "isSingleDay": false,
          "rawKmk": "05.03. - 16.03."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2029-05-11",
          "end": "2029-05-18",
          "isSingleDay": false,
          "rawKmk": "11.05. - 18.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-02",
          "end": "2029-08-10",
          "isSingleDay": false,
          "rawKmk": "02.07. - 10.08."
        }
      ]
    },
    "HE": {
      "stateCode": "HE",
      "stateNameDe": "Hessen",
      "movableDays": 3,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-09",
          "end": "2028-10-20",
          "isSingleDay": false,
          "rawKmk": "09.10. - 20.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-27",
          "end": "2029-01-12",
          "isSingleDay": false,
          "rawKmk": "27.12. - 12.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-29",
          "end": "2029-04-13",
          "isSingleDay": false,
          "rawKmk": "29.03. - 13.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-16",
          "end": "2029-08-24",
          "isSingleDay": false,
          "rawKmk": "16.07. - 24.08."
        }
      ]
    },
    "MV": {
      "stateCode": "MV",
      "stateNameDe": "Mecklenburg-Vorpommern",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2028-10-02",
          "end": "2028-10-02",
          "isSingleDay": true,
          "rawKmk": "02.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-23",
          "end": "2028-10-28",
          "isSingleDay": false,
          "rawKmk": "23.10. - 28.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2028-10-30",
          "end": "2028-10-30",
          "isSingleDay": true,
          "rawKmk": "30.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-22",
          "end": "2029-01-02",
          "isSingleDay": false,
          "rawKmk": "22.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2029-02-05",
          "end": "2029-02-16",
          "isSingleDay": false,
          "rawKmk": "05.02. - 16.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien (Schulfreier Tag)",
          "nameEn": "Easter Holidays (School-Free Day)",
          "nameKo": "부활절/봄 방학 (단일 휴교일)",
          "start": "2029-03-09",
          "end": "2029-03-09",
          "isSingleDay": true,
          "rawKmk": "09.03."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-28",
          "end": "2029-04-06",
          "isSingleDay": false,
          "rawKmk": "28.03. - 06.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-04-30",
          "end": "2029-04-30",
          "isSingleDay": true,
          "rawKmk": "30.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-05-11",
          "end": "2029-05-11",
          "isSingleDay": true,
          "rawKmk": "11.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2029-05-18",
          "end": "2029-05-22",
          "isSingleDay": false,
          "rawKmk": "18.05. - 22.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-06-18",
          "end": "2029-07-28",
          "isSingleDay": false,
          "rawKmk": "18.06. - 28.07."
        }
      ]
    },
    "NI": {
      "stateCode": "NI",
      "stateNameDe": "Niedersachsen",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2028-10-02",
          "end": "2028-10-02",
          "isSingleDay": true,
          "rawKmk": "02.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-23",
          "end": "2028-11-04",
          "isSingleDay": false,
          "rawKmk": "23.10. - 04.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-27",
          "end": "2029-01-06",
          "isSingleDay": false,
          "rawKmk": "27.12. - 06.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2029-02-01",
          "end": "2029-02-02",
          "isSingleDay": false,
          "rawKmk": "01.02. - 02.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-19",
          "end": "2029-04-03",
          "isSingleDay": false,
          "rawKmk": "19.03. - 03.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-04-30",
          "end": "2029-04-30",
          "isSingleDay": true,
          "rawKmk": "30.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-05-11",
          "end": "2029-05-11",
          "isSingleDay": true,
          "rawKmk": "11.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-05-22",
          "end": "2029-05-22",
          "isSingleDay": true,
          "rawKmk": "22.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-19",
          "end": "2029-08-29",
          "isSingleDay": false,
          "rawKmk": "19.07. - 29.08."
        }
      ]
    },
    "NW": {
      "stateCode": "NW",
      "stateNameDe": "Nordrhein-Westfalen",
      "movableDays": 4,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-23",
          "end": "2028-11-04",
          "isSingleDay": false,
          "rawKmk": "23.10. - 04.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-21",
          "end": "2029-01-05",
          "isSingleDay": false,
          "rawKmk": "21.12. - 05.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-26",
          "end": "2029-04-07",
          "isSingleDay": false,
          "rawKmk": "26.03. - 07.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-05-22",
          "end": "2029-05-22",
          "isSingleDay": true,
          "rawKmk": "22.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-02",
          "end": "2029-08-14",
          "isSingleDay": false,
          "rawKmk": "02.07. - 14.08."
        }
      ]
    },
    "RP": {
      "stateCode": "RP",
      "stateNameDe": "Rheinland-Pfalz",
      "movableDays": 6,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-09",
          "end": "2028-10-20",
          "isSingleDay": false,
          "rawKmk": "09.10. - 20.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-21",
          "end": "2029-01-08",
          "isSingleDay": false,
          "rawKmk": "21.12. - 08.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-26",
          "end": "2029-04-06",
          "isSingleDay": false,
          "rawKmk": "26.03. - 06.04."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-16",
          "end": "2029-08-24",
          "isSingleDay": false,
          "rawKmk": "16.07. - 24.08."
        }
      ]
    },
    "SL": {
      "stateCode": "SL",
      "stateNameDe": "Saarland",
      "movableDays": 0,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-09",
          "end": "2028-10-20",
          "isSingleDay": false,
          "rawKmk": "09.10. - 20.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-20",
          "end": "2029-01-02",
          "isSingleDay": false,
          "rawKmk": "20.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Faschingsferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2029-02-12",
          "end": "2029-02-16",
          "isSingleDay": false,
          "rawKmk": "12.02. - 16.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-26",
          "end": "2029-04-06",
          "isSingleDay": false,
          "rawKmk": "26.03. - 06.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2029-05-22",
          "end": "2029-05-25",
          "isSingleDay": false,
          "rawKmk": "22.05. - 25.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-16",
          "end": "2029-08-24",
          "isSingleDay": false,
          "rawKmk": "16.07. - 24.08."
        }
      ]
    },
    "SN": {
      "stateCode": "SN",
      "stateNameDe": "Sachsen",
      "movableDays": 2,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-23",
          "end": "2028-11-03",
          "isSingleDay": false,
          "rawKmk": "23.10. - 03.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-23",
          "end": "2029-01-03",
          "isSingleDay": false,
          "rawKmk": "23.12. - 03.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2029-02-05",
          "end": "2029-02-16",
          "isSingleDay": false,
          "rawKmk": "05.02. - 16.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-29",
          "end": "2029-04-06",
          "isSingleDay": false,
          "rawKmk": "29.03. - 06.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-05-11",
          "end": "2029-05-11",
          "isSingleDay": true,
          "rawKmk": "11.05."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2029-05-19",
          "end": "2029-05-22",
          "isSingleDay": false,
          "rawKmk": "19.05. - 22.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-21",
          "end": "2029-08-31",
          "isSingleDay": false,
          "rawKmk": "21.07. - 31.08."
        }
      ]
    },
    "ST": {
      "stateCode": "ST",
      "stateNameDe": "Sachsen-Anhalt",
      "movableDays": 2,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien (Schulfreier Tag)",
          "nameEn": "Autumn Holidays (School-Free Day)",
          "nameKo": "가을 방학 (단일 휴교일)",
          "start": "2028-10-02",
          "end": "2028-10-02",
          "isSingleDay": true,
          "rawKmk": "02.10."
        },
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-30",
          "end": "2028-11-03",
          "isSingleDay": false,
          "rawKmk": "30.10. - 03.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-21",
          "end": "2029-01-02",
          "isSingleDay": false,
          "rawKmk": "21.12. - 02.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2029-02-05",
          "end": "2029-02-10",
          "isSingleDay": false,
          "rawKmk": "05.02. - 10.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-26",
          "end": "2029-03-31",
          "isSingleDay": false,
          "rawKmk": "26.03. - 31.03."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-04-30",
          "end": "2029-04-30",
          "isSingleDay": true,
          "rawKmk": "30.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten",
          "nameEn": "Whitsun Holidays",
          "nameKo": "오순절/성령강림절 방학",
          "start": "2029-05-11",
          "end": "2029-05-25",
          "isSingleDay": false,
          "rawKmk": "11.05. - 25.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-21",
          "end": "2029-08-31",
          "isSingleDay": false,
          "rawKmk": "21.07. - 31.08."
        }
      ]
    },
    "SH": {
      "stateCode": "SH",
      "stateNameDe": "Schleswig-Holstein",
      "movableDays": 3,
      "footnote": "Auf den Inseln Sylt, Föhr, Amrum und Helgoland sowie auf den Halligen gelten für die Sommer- und Herbstferien Sonderregelungen.",
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-16",
          "end": "2028-10-30",
          "isSingleDay": false,
          "rawKmk": "16.10. - 30.10."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-21",
          "end": "2029-01-05",
          "isSingleDay": false,
          "rawKmk": "21.12. - 05.01."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-23",
          "end": "2029-04-06",
          "isSingleDay": false,
          "rawKmk": "23.03. - 06.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-05-11",
          "end": "2029-05-11",
          "isSingleDay": true,
          "rawKmk": "11.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-06-23",
          "end": "2029-08-03",
          "isSingleDay": false,
          "rawKmk": "23.06. - 03.08."
        }
      ]
    },
    "TH": {
      "stateCode": "TH",
      "stateNameDe": "Thüringen",
      "movableDays": 3,
      "footnote": null,
      "periods": [
        {
          "type": "autumn",
          "nameDe": "Herbstferien",
          "nameEn": "Autumn Holidays",
          "nameKo": "가을 방학",
          "start": "2028-10-23",
          "end": "2028-11-03",
          "isSingleDay": false,
          "rawKmk": "23.10. - 03.11."
        },
        {
          "type": "christmas",
          "nameDe": "Weihnachtsferien",
          "nameEn": "Christmas Holidays",
          "nameKo": "크리스마스 방학",
          "start": "2028-12-23",
          "end": "2029-01-05",
          "isSingleDay": false,
          "rawKmk": "23.12. - 05.01."
        },
        {
          "type": "winter",
          "nameDe": "Winterferien",
          "nameEn": "Winter Holidays",
          "nameKo": "겨울 방학",
          "start": "2029-02-12",
          "end": "2029-02-17",
          "isSingleDay": false,
          "rawKmk": "12.02. - 17.02."
        },
        {
          "type": "easter",
          "nameDe": "Osterferien",
          "nameEn": "Easter Holidays",
          "nameKo": "부활절/봄 방학",
          "start": "2029-03-26",
          "end": "2029-04-07",
          "isSingleDay": false,
          "rawKmk": "26.03. - 07.04."
        },
        {
          "type": "pentecost",
          "nameDe": "Himmelfahrt / Pfingsten (Schulfreier Tag)",
          "nameEn": "Whitsun Holidays (School-Free Day)",
          "nameKo": "오순절/성령강림절 방학 (단일 휴교일)",
          "start": "2029-05-11",
          "end": "2029-05-11",
          "isSingleDay": true,
          "rawKmk": "11.05."
        },
        {
          "type": "summer",
          "nameDe": "Sommerferien",
          "nameEn": "Summer Holidays",
          "nameKo": "여름 방학",
          "start": "2029-07-21",
          "end": "2029-08-31",
          "isSingleDay": false,
          "rawKmk": "21.07. - 31.08."
        }
      ]
    }
  }
},

  /**
   * Returns list of supported school years and calendar years
   */
  getAvailableYears() {
    return {
      schoolYears: [...this.supportedSchoolYears],
      calendarYears: [...this.supportedCalendarYears]
    };
  },

  /**
   * Retrieves official verified school holidays for a given state and year.
   * Supports both school year strings (e.g. "2025/2026", "2026/2027")
   * and calendar year integers/strings (e.g. 2026, "2026").
   * Returns a clear error state object if the year or state is unsupported.
   *
   * @param {string|number} yearOrSchoolYear - Calendar year (2026) or School Year ("2025/2026")
   * @param {string} stateCode - Two-letter German Bundesland code (e.g. "BE", "BY", "NW")
   * @returns {Array|Object} List of vacation periods, or structured error object if unavailable
   */
  getSchoolHolidays(yearOrSchoolYear, stateCode) {
    if (!stateCode) {
      return {
        unavailable: true,
        error: "MISSING_STATE",
        messageEn: "State code is required (e.g., 'BE', 'BY', 'NW').",
        messageKo: "연방 주 코드가 필요합니다 (예: 'BE', 'BY', 'NW')."
      };
    }

    const state = String(stateCode).trim().toUpperCase();
    if (!this.allStateCodes.includes(state)) {
      return {
        unavailable: true,
        error: "INVALID_STATE",
        messageEn: `Invalid state code: "${stateCode}". Must be one of the 16 German Bundesländer.`,
        messageKo: `유효하지 않은 주 코드: "${stateCode}". 독일 16개 연방 주 코드 중 하나여야 합니다.`,
        validStates: [...this.allStateCodes]
      };
    }

    if (yearOrSchoolYear === null || yearOrSchoolYear === undefined || yearOrSchoolYear === "") {
      return {
        unavailable: true,
        error: "MISSING_YEAR",
        messageEn: "Year or school year is required.",
        messageKo: "연도 또는 학년도 정보가 필요합니다."
      };
    }

    const yearStr = String(yearOrSchoolYear).trim();

    // 1. Direct school year lookup: "2025/2026" or "2025-2026"
    const normalizedSy = yearStr.replace("-", "/");
    if (this.supportedSchoolYears.includes(normalizedSy)) {
      const syData = this.bySchoolYear[normalizedSy];
      if (syData && syData[state]) {
        const stateEntry = syData[state];
        const res = stateEntry.periods.map(p => ({ ...p, schoolYear: normalizedSy }));
        res.schoolYear = normalizedSy;
        res.stateCode = state;
        res.stateNameDe = stateEntry.stateNameDe;
        res.movableDays = stateEntry.movableDays;
        res.footnote = stateEntry.footnote;
        return res;
      }
    }

    // 2. Calendar year lookup: 2026 or "2026"
    const calYear = parseInt(yearStr, 10);
    if (!isNaN(calYear) && !yearStr.includes("/")) {
      if (this.supportedCalendarYears.includes(calYear)) {
        const calHolidays = [];
        const seen = new Set();

        this.supportedSchoolYears.forEach(sy => {
          const syData = this.bySchoolYear[sy];
          if (syData && syData[state]) {
            const periods = syData[state].periods;
            periods.forEach(p => {
              const startYear = parseInt(p.start.slice(0, 4), 10);
              const endYear = parseInt(p.end.slice(0, 4), 10);
              if (startYear === calYear || endYear === calYear) {
                const key = `${p.type}_${p.start}_${p.end}`;
                if (!seen.has(key)) {
                  seen.add(key);
                  calHolidays.push({ ...p, schoolYear: sy });
                }
              }
            });
          }
        });

        // Sort chronologically
        calHolidays.sort((a, b) => a.start.localeCompare(b.start));

        const activeSy = `${calYear}/${calYear + 1}`;
        calHolidays.calendarYear = calYear;
        calHolidays.stateCode = state;
        calHolidays.movableDays = this.bySchoolYear[activeSy]?.[state]?.movableDays || 0;
        calHolidays.footnote = state === "SH" ? this.footnotes.SH_ISLANDS.de : null;
        return calHolidays;
      }
    }

    // 3. Unsupported year: Return clear data unavailable state (never return fake data)
    return {
      unavailable: true,
      error: "DATA_UNAVAILABLE",
      yearRequested: yearOrSchoolYear,
      messageEn: `Official KMK school holiday data is unavailable for "${yearOrSchoolYear}".`,
      messageKo: `"${yearOrSchoolYear}" 연도에 대한 공식 KMK 학사일정 방학 데이터를 찾을 수 없습니다.`,
      availableYears: this.getAvailableYears()
    };
  }
};

// Browser and Node.js global attachments
if (typeof window !== "undefined") {
  window.GERMAN_SCHOOL_HOLIDAYS = GERMAN_SCHOOL_HOLIDAYS;
}
if (typeof global !== "undefined") {
  global.GERMAN_SCHOOL_HOLIDAYS = GERMAN_SCHOOL_HOLIDAYS;
}

// Node.js environment export support
if (typeof module !== "undefined" && module.exports) {
  module.exports = GERMAN_SCHOOL_HOLIDAYS;
}
