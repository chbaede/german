/**
 * German School Holidays (Schulferien) Data
 * Source: Kultusministerkonferenz (KMK)
 * Covers: 2024, 2025, 2026, 2027 across German Bundesländer
 */
const GERMAN_SCHOOL_HOLIDAYS = {
  years: [2024, 2025, 2026, 2027],

  // Sample official schedules by year and state
  data: {
    2024: {
      BW: [
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2024-03-25", end: "2024-04-05" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2024-05-21", end: "2024-05-31" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2024-07-25", end: "2024-09-07" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2024-10-28", end: "2024-10-30" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2024-12-23", end: "2025-01-04" }
      ],
      BY: [
        { type: "winter", nameDe: "Frühjahrsferien", nameEn: "Winter/Spring Holidays", start: "2024-02-12", end: "2024-02-16" },
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2024-03-25", end: "2024-04-06" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2024-05-21", end: "2024-06-01" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2024-07-29", end: "2024-09-09" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2024-10-28", end: "2024-10-31" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2024-12-23", end: "2025-01-03" }
      ],
      BE: [
        { type: "winter", nameDe: "Winterferien", nameEn: "Winter Holidays", start: "2024-02-05", end: "2024-02-10" },
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2024-03-25", end: "2024-04-05" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2024-05-10", end: "2024-05-10" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2024-07-18", end: "2024-08-30" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2024-10-21", end: "2024-11-02" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2024-12-23", end: "2024-12-31" }
      ],
      NW: [
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2024-03-25", end: "2024-04-06" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2024-05-21", end: "2024-05-21" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2024-07-08", end: "2024-08-20" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2024-10-14", end: "2024-10-26" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2024-12-23", end: "2025-01-06" }
      ],
      HE: [
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2024-03-25", end: "2024-04-13" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2024-07-15", end: "2024-08-23" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2024-10-14", end: "2024-10-25" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2024-12-23", end: "2025-01-10" }
      ]
    },
    2025: {
      BW: [
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2025-04-14", end: "2025-04-25" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2025-06-10", end: "2025-06-20" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2025-07-31", end: "2025-09-13" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2025-10-27", end: "2025-10-30" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2025-12-22", end: "2026-01-05" }
      ],
      BY: [
        { type: "winter", nameDe: "Frühjahrsferien", nameEn: "Winter/Spring Holidays", start: "2025-03-03", end: "2025-03-07" },
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2025-04-14", end: "2025-04-25" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2025-06-10", end: "2025-06-20" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2025-08-01", end: "2025-09-15" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2025-11-03", end: "2025-11-07" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2025-12-22", end: "2026-01-05" }
      ],
      BE: [
        { type: "winter", nameDe: "Winterferien", nameEn: "Winter Holidays", start: "2025-02-03", end: "2025-02-08" },
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2025-04-14", end: "2025-04-25" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2025-06-10", end: "2025-06-10" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2025-07-24", end: "2025-09-06" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2025-10-20", end: "2025-11-01" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2025-12-22", end: "2026-01-02" }
      ],
      NW: [
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2025-04-14", end: "2025-04-26" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2025-06-10", end: "2025-06-10" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2025-07-14", end: "2025-08-26" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2025-10-13", end: "2025-10-25" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2025-12-22", end: "2026-01-06" }
      ],
      HE: [
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2025-04-07", end: "2025-04-21" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2025-07-07", end: "2025-08-15" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2025-10-06", end: "2025-10-18" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2025-12-22", end: "2026-01-10" }
      ],
      HH: [
        { type: "winter", nameDe: "Frühjahrsferien", nameEn: "Spring Holidays", start: "2025-03-10", end: "2025-03-21" },
        { type: "easter", nameDe: "Maiferien", nameEn: "May Holidays", start: "2025-05-02", end: "2025-05-02" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2025-07-24", end: "2025-09-03" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2025-10-20", end: "2025-10-31" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2025-12-17", end: "2026-01-02" }
      ],
      SN: [
        { type: "winter", nameDe: "Winterferien", nameEn: "Winter Holidays", start: "2025-02-17", end: "2025-03-01" },
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2025-04-18", end: "2025-04-26" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2025-06-28", end: "2025-08-08" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2025-10-06", end: "2025-10-18" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2025-12-22", end: "2026-01-02" }
      ]
    },
    2026: {
      BW: [
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2026-03-30", end: "2026-04-10" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2026-05-26", end: "2026-06-05" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2026-07-30", end: "2026-09-12" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2026-10-26", end: "2026-10-30" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2026-12-23", end: "2027-01-09" }
      ],
      BY: [
        { type: "winter", nameDe: "Frühjahrsferien", nameEn: "Winter/Spring Holidays", start: "2026-02-16", end: "2026-02-20" },
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2026-03-30", end: "2026-04-10" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2026-05-26", end: "2026-06-05" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2026-08-03", end: "2026-09-14" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2026-11-02", end: "2026-11-06" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2026-12-24", end: "2027-01-08" }
      ],
      BE: [
        { type: "winter", nameDe: "Winterferien", nameEn: "Winter Holidays", start: "2026-02-02", end: "2026-02-07" },
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2026-03-30", end: "2026-04-10" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2026-07-09", end: "2026-08-22" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2026-10-19", end: "2026-10-31" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2026-12-23", end: "2027-01-02" }
      ],
      NW: [
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2026-03-30", end: "2026-04-11" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2026-07-20", end: "2026-09-01" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2026-10-12", end: "2026-10-24" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2026-12-23", end: "2027-01-06" }
      ],
      HE: [
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2026-03-30", end: "2026-04-10" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2026-06-29", end: "2026-08-07" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2026-10-05", end: "2026-10-17" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2026-12-23", end: "2027-01-13" }
      ]
    },
    2027: {
      BW: [
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2027-03-30", end: "2027-04-09" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2027-05-18", end: "2027-05-28" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2027-07-29", end: "2027-09-11" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2027-11-02", end: "2027-11-05" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2027-12-23", end: "2028-01-08" }
      ],
      BY: [
        { type: "winter", nameDe: "Frühjahrsferien", nameEn: "Winter/Spring Holidays", start: "2027-02-08", end: "2027-02-12" },
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2027-03-22", end: "2027-04-03" },
        { type: "pentecost", nameDe: "Pfingstferien", nameEn: "Whitsun Holidays", start: "2027-05-18", end: "2027-05-29" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2027-08-02", end: "2027-09-13" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2027-11-02", end: "2027-11-05" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2027-12-24", end: "2028-01-08" }
      ],
      BE: [
        { type: "winter", nameDe: "Winterferien", nameEn: "Winter Holidays", start: "2027-02-01", end: "2027-02-06" },
        { type: "easter", nameDe: "Osterferien", nameEn: "Easter Holidays", start: "2027-03-22", end: "2027-04-03" },
        { type: "summer", nameDe: "Sommerferien", nameEn: "Summer Holidays", start: "2027-07-01", end: "2027-08-14" },
        { type: "autumn", nameDe: "Herbstferien", nameEn: "Autumn Holidays", start: "2027-10-11", end: "2027-10-23" },
        { type: "christmas", nameDe: "Weihnachtsferien", nameEn: "Christmas Holidays", start: "2027-12-22", end: "2027-12-31" }
      ]
    }
  },

  getSchoolHolidays(year, stateCode) {
    const yearData = this.data[year] || this.data[2025];
    if (yearData[stateCode]) {
      return yearData[stateCode];
    }
    // Fallback to BW or NW as representative German state if specific state not listed in future year
    return yearData["BW"] || yearData["BY"] || yearData["NW"];
  }
};
