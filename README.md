# 🇩🇪 German Life Toolkit (`german.yocto.co.kr`)

> **Smart tools for everyday life in Germany.**  
> A 100% static, client-side web application designed for expats, international professionals, families, students, and foreign residents in Germany.

Deployed at: **[https://german.yocto.co.kr](https://german.yocto.co.kr)**  
Repository: **[chbaede/german](https://github.com/chbaede/german)**  
Part of the **[yocto.co.kr](https://main.yocto.co.kr)** web ecosystem.

---

## 🚀 Key Highlights & Philosophy

- **100% Client-Side Privacy**: Zero data sent to any backend server. All calculations happen strictly in the user's browser.
- **No Build Tools or Runtimes Needed**: Clean, modern HTML5, CSS3, and vanilla JavaScript. Zero Node.js or framework bloat.
- **Bilingual (English & Korean)**: Fully localized across all user interfaces, tooltips, validation messages, and legal glossaries.
- **Google SEO Optimized**: Rich JSON-LD Structured Data (`WebApplication`, `FAQPage`, `ItemList`), multilingual `hreflang`, preconnects, dynamic meta title/description routing, and static crawler markup.
- **Google AdSense Integrated**: High-viewability, policy-compliant ad slots (Dashboard Mid, Dashboard Bottom, and Tool Detail View) with CLS layout-shift protection and safe SPA initialization.
- **Production-Quality Design**: Minimalist developer-tool aesthetic with comprehensive Dark and Light mode support.
- **Accurate German Financial & Legal Estimates**: Up-to-date parameters for German tax classes (I to VI), statutory social insurances (GKV, PV, RV, AV), Berlin default (Frauentag, 9% church tax), public holidays, KMK school holidays, and 2026 Kindergeld (€259).

---

## 🧰 Included Tools (All 20 Working Tools)

### 💶 Money & Taxes
1. **Salary Calculator (Brutto → Netto)**: Estimate monthly and annual take-home pay with German tax classes I–VI, Bundesland church tax (8%/9%), children care adjustments, and statutory social insurances.
2. **Net → Gross Calculator (Reverse Salary)**: Iterative binary-search solver to determine the required gross salary for your target net income.
3. **Annual Salary Calculator**: Base pay, 13th month / Christmas bonus, and performance bonus 합산.
4. **Tax Class Comparison Guide**: Interactive reference comparing Steuerklassen I to VI, married couple strategies (3/5 vs 4/4 vs 4 mit Faktor).

### 🏠 Housing & Rent
5. **Rent & Living Cost Calculator**: Kaltmiete, Nebenkosten, heating, electricity, internet, and Rundfunkbeitrag (formerly commonly called GEZ) per dwelling breakdown.
6. **Moving Cost Calculator (Umzugskosten)**: Van rental, moving company, boxes, cleaning/renovation, and fitted kitchen (EBK).

### 🚗 Transport & Driving
7. **Car Total Cost of Ownership (TCO)**: Monthly financing, insurance, vehicle tax (Kfz-Steuer), maintenance (TÜV/HU/AU), parking, and tires, with ICE vs Hybrid vs EV comparison.
8. **Fuel Cost Calculator**: Trip fuel requirements and expenses supporting both `L/100km` and `km/L`.
9. **EV Charging Cost Calculator**: Home wallbox vs public AC vs DC ultra-fast charging costs, plus per-100km savings vs gasoline.

### 📅 Calendar & Work
10. **German Public Holidays (Feiertage)**: Nationwide vs state-specific holidays across all 16 Bundesländer with dynamic Easter calculation.
11. **Working Days Calculator (Arbeitstage)**: Net working days between two dates, accurately excluding weekends and state holidays.
12. **Vacation Days & Bridge Day Planner**: Paid leave tracker and smart "Brückentage" strategy advice.

### 👨‍👩‍👧 Family & School
13. **Child Benefit Reference (Kindergeld)**: Current statutory €259/child/month estimator (enacted for 2026), historical evolution timeline (2021–2025), and announced future changes for 2027 (€267) & 2028 (€272; Source: BMF / Familienkasse).
14. **School Holiday Finder (Schulferien)**: Official school vacation schedules (KMK) by federal state and year (2024–2029 / school years 2024/25–2028/29).

### 🧾 Everyday Utilities
15. **Date Difference Calculator**: Exact days, weeks, months, and years between any two dates.
16. **Exact Age Calculator**: International age in years, months, and days, total days lived, and countdown to next birthday.
17. **Percentage Calculator**: 4 instant modes (X% of Y, proportions, percentage increase/decrease, difference).
18. **German & Expat Unit Converter**: km ↔ miles, kg ↔ lb, °C ↔ °F, liters ↔ gallons, and m² ↔ sq ft / pyeong (평).

### 🇩🇪 Germany Reference
19. **German Address & Postal Code (PLZ) Guide**: 16 federal states directory, capital cities, population, PLZ ranges, and standard mailing address format.
20. **German Expat Glossary & Abbreviations**: Searchable directory of 40+ crucial German terms (Anmeldung, Schufa, Rundfunkbeitrag, TÜV, Probezeit, etc.).

---

## 🛠️ Repository Structure

```
/
├── index.html                  # Single-Page Application root with semantic SEO & JSON-LD
├── CNAME                       # Custom domain routing: german.yocto.co.kr
├── README.md                   # Complete documentation
├── robots.txt                  # Search engine crawler permissions
├── sitemap.xml                 # Canonical XML sitemap
│
├── css/
│   ├── style.css               # Design system tokens (light/dark theme, typography)
│   ├── components.css          # Tool cards, input forms, result panels, badges
│   └── responsive.css          # Breakpoints (390px, 768px, 1024px, 1440px)
│
├── js/
│   ├── app.js                  # Master application controller and routing
│   ├── i18n.js                 # Centralized bilingual translation catalog (EN & KO)
│   ├── theme.js                # Dark/Light mode manager with localStorage persistence
│   ├── search.js               # Instant client-side fuzzy search and category filter
│   ├── utils.js                # Currency/number formatting (DE/KO/EN), clipboard
│   │
│   ├── calculators/
│   │   ├── salary.js           # Gross-to-Net, Net-to-Gross, and annual compensation
│   │   ├── rent.js             # Kaltmiete, Nebenkosten, Warmmiete, Kaution calculator
│   │   ├── moving.js           # Relocation expenses estimator
│   │   ├── car.js              # Car total cost of ownership and ICE vs EV comparison
│   │   ├── fuel-ev.js          # Fuel cost (L/100km & km/L) and EV charging calculator
│   │   ├── calendar-tools.js   # Public holidays, working days, and vacation planner
│   │   ├── family-tools.js     # Kindergeld benefit reference and school holidays
│   │   └── everyday-tools.js   # Date diff, exact age, percentage, unit converter
│   │
│   └── data/
│       ├── tax-config.js       # German tax brackets, contribution ceilings (BBG)
│       ├── states-data.js      # 16 Bundesländer, capitals, PLZ ranges
│       ├── holidays.js         # Public holiday data and Easter algorithm
│       ├── school-holidays.js  # Official KMK school vacation schedules
│       └── glossary.js         # 40+ German expat administrative and housing terms
│
└── assets/
    └── favicon.svg             # Vector shield & German tricolor favicon
```

---

## 🌐 GitHub Pages & Custom Domain Setup

### 1. Repository Setup & Push
```bash
cd /path/to/german
git init
git add .
git commit -m "feat: initial release of German Life Toolkit"
git branch -M main
git remote add origin https://github.com/chbaede/german.git
git push -u origin main
```

### 2. GitHub Pages Configuration
1. Go to your GitHub repository: `https://github.com/chbaede/german`
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` / `root` (`/`).
   - Click **Save**.

### 3. Custom Domain Configuration
1. In **Settings** > **Pages** under **Custom domain**, enter:
   ```
   german.yocto.co.kr
   ```
2. The repository already contains a `CNAME` file with `german.yocto.co.kr`.
3. Check **Enforce HTTPS** once DNS resolves.

### 4. DNS CNAME Configuration
In your DNS provider (e.g., Cloudflare, Route53, Namecheap) for the domain `yocto.co.kr`:

| Type | Name / Host | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `german` | `chbaede.github.io.` | Automatic / 300 |

---

## 🔧 How to Add a New Tool

1. **Register the tool metadata** in `js/data.js`:
   ```javascript
   {
     id: "my-new-tool",
     category: "money",
     icon: "📊",
     popular: false,
     title: { en: "My New Tool", ko: "새로운 도구" },
     desc: { en: "Description here", ko: "설명 입력" },
     tags: { en: ["Tag1"], ko: ["태그1"] }
   }
   ```
2. **Add translations** to `js/i18n.js` under both `en` and `ko`.
3. **Implement calculation logic** in `js/calculators/` or reuse existing helpers.
4. **Add a render method** in `js/app.js`:
   ```javascript
   case 'my-new-tool':
     this.renderMyNewTool(container, tool);
     break;
   ```
5. **Add the anchor URL** to `sitemap.xml`:
   ```xml
   <url>
     <loc>https://german.yocto.co.kr/#my-new-tool</loc>
     <changefreq>monthly</changefreq>
     <priority>0.8</priority>
   </url>
   ```

---

## 📑 How to Update German Tax / Holiday Data

### Updating German Tax Parameters
Edit `js/data/tax-config.js`:
- `basicAllowance`: Update the `Grundfreibetrag` (e.g. 2025: €12,096; 2026: €12,348).
- `pension.bbgWestMonthly`: Update the RV Beitragsbemessungsgrenze.
- `health.avgZusatzbeitrag`: Update the statutory nationwide average Zusatzbeitrag.
- `health.bbgMonthly`: Update GKV Beitragsbemessungsgrenze.

### Updating Holidays & School Holidays
- **Public holidays**: `js/data/holidays.js` uses the Gregorian Easter algorithm, so movable holidays (Good Friday, Easter Monday, Ascension Day, Whit Monday, Corpus Christi) are **computed dynamically for any future year**.
- **School holidays**: Add or update dates in `js/data/school-holidays.js` based on official KMK announcements.

---

## ⚖️ Statutory Data & Estimation Model Principles

### 1. Officially Supported Tax & Payroll Years
- **Enacted Statutory Years**: **2025** and **2026** (statutory § 32a EStG tariffs and enacted social-security contribution parameters).
- **2027 / 2028 Government Reform Draft Notice**: The German Cabinet approved a draft tax reform (*Einkommensteuerreformgesetz 2027*, Kabinettbeschluss vom 02.09.2026), but future years are NOT legally finalized until parliamentary enactment. Proposed/announced draft numbers (e.g. 2027 Grundfreibetrag €12,564, 2028 €12,900; 2027 Kindergeld €267, 2028 €272) are strictly separated as proposals and cannot silently calculate in the payroll engine.

### 2. Salary Calculator Estimation Model Disclaimer
- **Estimation Model**: The salary calculator implements an estimation model based on § 32a EStG and German social insurance legislation. **It is NOT the official BMF Lohnsteuer calculation engine (Programmablaufplan - PAP).**
- **Actual Payroll Differences**: Actual employer payroll withholding may differ due to procedural integer truncation, specialized subroutines (e.g., `MST5_6` for Class V/VI, factor procedures for Class IV), and individual electronic tax card (ELStAM) allowances.
- **Tax Base Transparency**: The internal calculation base is an `estimatedTaxableIncome` (simplified estimation base under § 39b EStG principles), not the official BMF PAP definition of `zvE`.

### 3. Key Statutory Baselines Enforced
| Area | Legal Basis | 2025 Value | 2026 Value | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Grundfreibetrag** | § 32a Abs. 1 EStG | **€12,096** | **€12,348** | Tax-free basic personal allowance |
| **Zone 4 Entry (42%)**| § 32a Abs. 1 EStG | **€68,480** | **€69,878** | Spitzensteuersatz threshold |
| **Pension (RV) BBG** | SV-Rechengrößen-VO | **€8,050/mo** (€96.6k) | **€8,450/mo** (€101.4k) | Contribution assessment ceiling |
| **Health (GKV) BBG** | § 223 SGB V | **€5,512.50/mo** (€66.15k) | **€5,812.50/mo** (€69.75k) | GKV contribution ceiling |
| **Average Zusatzbeitrag**| § 242a SGB V | **2.50%** (1.25% employee) | **2.90%** (1.45% employee) | Statutory national average |
| **Care (PV) Child Scale**| § 55 SGB XI | **2.40% (0) → 0.80% (5+)** | **2.40% (0) → 0.80% (5+)** | Saxony employee +0.50% |
| **SolZ Freigrenze** | §§ 3, 4 SolZG | **€19,950** (Single) / **€39,900** | **€20,350** (Single) / **€40,700** | 11.9% Milderung; 5.5% cap |
| **Single-Parent Relief**| § 24b EStG | **€4,260** (+€240/add'l child) | **€4,260** (+€240/add'l child) | Requires ≥1 child in household |
| **Kindergeld** | BMF / Familienkasse | **€255/child/mo** | **€259/child/mo** | 2027 (€267) & 2028 (€272) government proposal |
| **Rundfunkbeitrag** | RBStV §§ 2, 8 | **€18.36/mo** (€220.32/yr) | **€18.36/mo** (€220.32/yr) | Levied per dwelling, not per person |

---

## 🔒 Privacy & Legal Disclaimer

- **Privacy**: No tracking cookies, no Google Analytics, no third-party telemetry, and zero server-side transmission. All inputs stay exclusively within local browser memory.
- **Disclaimer**: Tools are provided for informational and educational purposes only. Calculations are estimates and do not constitute certified tax, legal, or financial advice.


