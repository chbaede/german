/**
 * German Federal States (16 Bundesländer) & Postal Code (PLZ) Reference Data
 */
const GERMAN_STATES = [
  {
    code: "BW",
    nameDe: "Baden-Württemberg",
    nameEn: "Baden-Württemberg",
    nameKo: "바덴뷔르템베르크",
    capital: "Stuttgart",
    population: "11.3M",
    majorCities: ["Stuttgart", "Karlsruhe", "Mannheim", "Freiburg", "Heidelberg", "Ulm"],
    plzRanges: ["68xxx", "69xxx", "70xxx - 79xxx", "88xxx", "89xxx"],
    churchTaxRate: 0.08,
    flagEmoji: "🖤💛"
  },
  {
    code: "BY",
    nameDe: "Bayern",
    nameEn: "Bavaria",
    nameKo: "바이에른",
    capital: "München",
    population: "13.4M",
    majorCities: ["München", "Nürnberg", "Augsburg", "Regensburg", "Ingolstadt", "Würzburg"],
    plzRanges: ["80xxx - 87xxx", "89xxx - 97xxx"],
    churchTaxRate: 0.08,
    flagEmoji: "🤍💙"
  },
  {
    code: "BE",
    nameDe: "Berlin",
    nameEn: "Berlin",
    nameKo: "베를린",
    capital: "Berlin",
    population: "3.75M",
    majorCities: ["Berlin"],
    plzRanges: ["10xxx - 14xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "🐻"
  },
  {
    code: "BB",
    nameDe: "Brandenburg",
    nameEn: "Brandenburg",
    nameKo: "브란덴부르크",
    capital: "Potsdam",
    population: "2.57M",
    majorCities: ["Potsdam", "Cottbus", "Brandenburg an der Havel", "Frankfurt (Oder)"],
    plzRanges: ["03xxx", "14xxx - 16xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "🦅"
  },
  {
    code: "HB",
    nameDe: "Bremen",
    nameEn: "Bremen",
    nameKo: "브레멘",
    capital: "Bremen",
    population: "0.68M",
    majorCities: ["Bremen", "Bremerhaven"],
    plzRanges: ["27xxx - 28xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "🗝️"
  },
  {
    code: "HH",
    nameDe: "Hamburg",
    nameEn: "Hamburg",
    nameKo: "함부르크",
    capital: "Hamburg",
    population: "1.9M",
    majorCities: ["Hamburg"],
    plzRanges: ["20xxx - 22xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "⚓"
  },
  {
    code: "HE",
    nameDe: "Hessen",
    nameEn: "Hesse",
    nameKo: "헤센",
    capital: "Wiesbaden",
    population: "6.4M",
    majorCities: ["Frankfurt am Main", "Wiesbaden", "Kassel", "Darmstadt", "Offenbach", "Gießen"],
    plzRanges: ["34xxx - 36xxx", "60xxx - 65xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "🦁"
  },
  {
    code: "MV",
    nameDe: "Mecklenburg-Vorpommern",
    nameEn: "Mecklenburg-Western Pomerania",
    nameKo: "메클렌부르크포어포메른",
    capital: "Schwerin",
    population: "1.63M",
    majorCities: ["Rostock", "Schwerin", "Neubrandenburg", "Stralsund", "Greifswald"],
    plzRanges: ["17xxx - 19xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "🐂"
  },
  {
    code: "NI",
    nameDe: "Niedersachsen",
    nameEn: "Lower Saxony",
    nameKo: "니더작센",
    capital: "Hannover",
    population: "8.14M",
    majorCities: ["Hannover", "Braunschweig", "Oldenburg", "Osnabrück", "Wolfsburg", "Göttingen"],
    plzRanges: ["26xxx - 31xxx", "37xxx", "38xxx", "49xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "🐎"
  },
  {
    code: "NW",
    nameDe: "Nordrhein-Westfalen",
    nameEn: "North Rhine-Westphalia",
    nameKo: "노르트라인베스트팔렌",
    capital: "Düsseldorf",
    population: "18.1M",
    majorCities: ["Köln", "Düsseldorf", "Dortmund", "Essen", "Bonn", "Münster", "Aachen"],
    plzRanges: ["32xxx - 33xxx", "40xxx - 48xxx", "50xxx - 53xxx", "57xxx - 59xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "🌊"
  },
  {
    code: "RP",
    nameDe: "Rheinland-Pfalz",
    nameEn: "Rhineland-Palatinate",
    nameKo: "라인란트팔츠",
    capital: "Mainz",
    population: "4.16M",
    majorCities: ["Mainz", "Ludwigshafen", "Koblenz", "Trier", "Kaiserslautern", "Worms"],
    plzRanges: ["54xxx - 56xxx", "66xxx - 67xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "🍇"
  },
  {
    code: "SL",
    nameDe: "Saarland",
    nameEn: "Saarland",
    nameKo: "자를란트",
    capital: "Saarbrücken",
    population: "0.99M",
    majorCities: ["Saarbrücken", "Neunkirchen", "Homburg", "Völklingen", "Saarlouis"],
    plzRanges: ["66xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "⚒️"
  },
  {
    code: "SN",
    nameDe: "Sachsen",
    nameEn: "Saxony",
    nameKo: "작센",
    capital: "Dresden",
    population: "4.08M",
    majorCities: ["Leipzig", "Dresden", "Chemnitz", "Zwickau", "Plauen", "Görlitz"],
    plzRanges: ["01xxx - 04xxx", "08xxx - 09xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "🏰"
  },
  {
    code: "ST",
    nameDe: "Sachsen-Anhalt",
    nameEn: "Saxony-Anhalt",
    nameKo: "작센안할트",
    capital: "Magdeburg",
    population: "2.18M",
    majorCities: ["Halle (Saale)", "Magdeburg", "Dessau-Roßlau", "Wittenberg", "Halberstadt"],
    plzRanges: ["06xxx", "38xxx - 39xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "🐻‍❄️"
  },
  {
    code: "SH",
    nameDe: "Schleswig-Holstein",
    nameEn: "Schleswig-Holstein",
    nameKo: "슐레스비히홀슈타인",
    capital: "Kiel",
    population: "2.95M",
    majorCities: ["Kiel", "Lübeck", "Flensburg", "Neumünster", "Norderstedt"],
    plzRanges: ["23xxx - 25xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "⛵"
  },
  {
    code: "TH",
    nameDe: "Thüringen",
    nameEn: "Thuringia",
    nameKo: "튀링겐",
    capital: "Erfurt",
    population: "2.12M",
    majorCities: ["Erfurt", "Jena", "Gera", "Weimar", "Eisenach", "Suhl"],
    plzRanges: ["07xxx", "36xxx", "98xxx - 99xxx"],
    churchTaxRate: 0.09,
    flagEmoji: "🌲"
  }
];

