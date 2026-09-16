/**
 * German Life Toolkit (german.yocto.co.kr)
 * Master Application Controller, Router & Tool Views
 */

const App = {
  activeToolId: null,

  init() {
    // 1. Setup Hash Router
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // 2. Setup Search & Filter
    ToolSearch.init();

    // 3. Register Language Change Listener
    window.onLanguageChanged = (lang) => {
      this.renderCategoryPills();
      this.renderRecentlyUsed();
      if (this.activeToolId) {
        this.renderTool(this.activeToolId);
      } else {
        ToolSearch.renderFilteredTools();
      }
    };

    // 4. Initial Route
    this.renderCategoryPills();
    this.renderRecentlyUsed();
    this.handleRoute();
  },

  renderCategoryPills() {
    const container = document.getElementById('category-pills');
    if (!container) return;

    const lang = currentLang;
    const allPill = `
      <button class="category-pill ${ToolSearch.currentCategory === 'all' ? 'active' : ''}" data-cat="all" onclick="ToolSearch.setCategory('all')">
        🌐 ${t('allCategories')}
      </button>
    `;

    const catPills = CATEGORIES_DATA.map(c => `
      <button class="category-pill ${ToolSearch.currentCategory === c.id ? 'active' : ''}" data-cat="${c.id}" onclick="ToolSearch.setCategory('${c.id}')">
        ${c.icon} ${c.title[lang]}
      </button>
    `).join('');

    container.innerHTML = allPill + catPills;
  },

  renderRecentlyUsed() {
    const section = document.getElementById('recent-section');
    const container = document.getElementById('recent-grid');
    if (!section || !container) return;

    const recentIds = GLTUtils.getRecentTools();
    if (!recentIds || recentIds.length === 0) {
      section.style.display = 'none';
      return;
    }

    const recentTools = recentIds
      .map(id => TOOLS_DATA.find(t => t.id === id))
      .filter(Boolean);

    if (recentTools.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';
    const lang = currentLang;
    container.innerHTML = recentTools.map(tool => `
      <div class="tool-card" onclick="location.hash='#${tool.id}'" role="button" tabindex="0">
        <div class="tool-header">
          <div class="tool-icon-wrapper">${tool.icon}</div>
          <span class="badge badge-category">${tool.category}</span>
        </div>
        <h4 class="tool-title" style="font-size:0.9375rem;">${tool.title[lang]}</h4>
        <p class="tool-desc" style="font-size:0.75rem; margin-bottom:0.5rem;">${tool.desc[lang]}</p>
        <div class="tool-footer">
          <span class="btn-open">${t('openTool')} →</span>
        </div>
      </div>
    `).join('');
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '').trim();
    const dashboard = document.getElementById('dashboard-view');
    const toolView = document.getElementById('tool-view');

    const canonicalEl = document.getElementById('canonical-url');
    const metaDescEl = document.getElementById('meta-description');
    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    const ogDescEl = document.querySelector('meta[property="og:description"]');
    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
    const twitterDescEl = document.querySelector('meta[name="twitter:description"]');
    const twitterUrlEl = document.querySelector('meta[name="twitter:url"]');

    if (!hash) {
      // Show Dashboard
      this.activeToolId = null;
      if (dashboard) dashboard.style.display = 'block';
      if (toolView) toolView.style.display = 'none';

      const homeTitle = `${t('appTitle')} — ${t('appSubtitle')}`;
      const homeDesc = currentLang === 'ko'
        ? "독일 거주자 및 직장인을 위한 100% 클라이언트 사이드 유틸리티: 2026 독일 월급 실수령액(Brutto-Netto), 밤미테 주거비, 킨더겔트(259€), 베를린 및 주별 공휴일, 근무일수, 생활 용어 사전. 서버 전송 없는 완벽한 개인정보 보호."
        : (currentLang === 'de'
          ? "100 % client-seitige Plattform für Alltag und Beruf in Deutschland: Brutto-Netto-Rechner 2026, Warmmiete, Kindergeld (259 €), Feiertage aller Bundesländer, Arbeitstage und Behörden-Glossar. Vollständiger Datenschutz ohne Server-Übertragung."
          : "100% Client-side utility platform for expats, professionals, and residents in Germany. German salary calculator (Brutto-Netto 2026), rent & Nebenkosten, Kindergeld (€259), Berlin & state holidays, working days, and expat glossary.");

      document.title = homeTitle;
      if (metaDescEl) metaDescEl.setAttribute('content', homeDesc);
      if (canonicalEl) canonicalEl.setAttribute('href', 'https://german.yocto.co.kr/');
      if (ogTitleEl) ogTitleEl.setAttribute('content', homeTitle);
      if (ogDescEl) ogDescEl.setAttribute('content', homeDesc);
      if (ogUrlEl) ogUrlEl.setAttribute('content', 'https://german.yocto.co.kr/');
      if (twitterTitleEl) twitterTitleEl.setAttribute('content', homeTitle);
      if (twitterDescEl) twitterDescEl.setAttribute('content', homeDesc);
      if (twitterUrlEl) twitterUrlEl.setAttribute('content', 'https://german.yocto.co.kr/');

      this.renderRecentlyUsed();
      ToolSearch.renderFilteredTools();
      GLTUtils.refreshAds();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check if tool exists
    const tool = TOOLS_DATA.find(t => t.id === hash);
    if (tool) {
      this.activeToolId = hash;
      GLTUtils.saveRecentTool(hash);
      if (dashboard) dashboard.style.display = 'none';
      if (toolView) toolView.style.display = 'block';
      this.renderTool(hash);

      const toolPageTitle = `${tool.title[currentLang]} — ${t('appTitle')}`;
      const toolPageDesc = `${tool.desc[currentLang]} — 100% Client-Side Privacy on German Life Toolkit.`;
      const toolUrl = `https://german.yocto.co.kr/#${tool.id}`;

      document.title = toolPageTitle;
      if (metaDescEl) metaDescEl.setAttribute('content', toolPageDesc);
      if (canonicalEl) canonicalEl.setAttribute('href', toolUrl);
      if (ogTitleEl) ogTitleEl.setAttribute('content', toolPageTitle);
      if (ogDescEl) ogDescEl.setAttribute('content', toolPageDesc);
      if (ogUrlEl) ogUrlEl.setAttribute('content', toolUrl);
      if (twitterTitleEl) twitterTitleEl.setAttribute('content', toolPageTitle);
      if (twitterDescEl) twitterDescEl.setAttribute('content', toolPageDesc);
      if (twitterUrlEl) twitterUrlEl.setAttribute('content', toolUrl);

      GLTUtils.refreshAds();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '';
    }
  },

  // Renders the specific tool layout and attaches event handlers
  renderTool(toolId) {
    const container = document.getElementById('tool-view-content');
    if (!container) return;

    const tool = TOOLS_DATA.find(t => t.id === toolId);
    if (!tool) return;
    const lang = currentLang;

    // Dispatch to specific tool renderer
    switch (toolId) {
      case 'salary':
        this.renderSalaryTool(container, tool);
        break;
      case 'net-to-gross':
        this.renderNetToGrossTool(container, tool);
        break;
      case 'annual-salary':
        this.renderAnnualSalaryTool(container, tool);
        break;
      case 'tax-class':
        this.renderTaxClassTool(container, tool);
        break;
      case 'rent':
        this.renderRentTool(container, tool);
        break;
      case 'moving':
        this.renderMovingTool(container, tool);
        break;
      case 'car-cost':
        this.renderCarCostTool(container, tool);
        break;
      case 'fuel-cost':
        this.renderFuelCostTool(container, tool);
        break;
      case 'ev-charging':
        this.renderEVChargingTool(container, tool);
        break;
      case 'holidays':
        this.renderHolidaysTool(container, tool);
        break;
      case 'working-days':
        this.renderWorkingDaysTool(container, tool);
        break;
      case 'vacation':
        this.renderVacationTool(container, tool);
        break;
      case 'kindergeld':
        this.renderKindergeldTool(container, tool);
        break;
      case 'school-holidays':
        this.renderSchoolHolidaysTool(container, tool);
        break;
      case 'date-diff':
        this.renderDateDiffTool(container, tool);
        break;
      case 'age-calc':
        this.renderAgeCalcTool(container, tool);
        break;
      case 'percentage':
        this.renderPercentageTool(container, tool);
        break;
      case 'unit-converter':
        this.renderUnitConverterTool(container, tool);
        break;
      case 'address-plz':
        this.renderAddressPLZTool(container, tool);
        break;
      case 'glossary':
        this.renderGlossaryTool(container, tool);
        break;
      default:
        container.innerHTML = `<p>${t('noResults')}</p>`;
    }
  },

  // Tool 1: Salary Calculator
  renderSalaryTool(container, tool) {
    const statesOptions = GERMAN_STATES.map(s => `
      <option value="${s.code}" ${s.code === 'BE' ? 'selected' : ''}>${s.nameDe} (${s.code}) - ${s.churchTaxRate * 100}%</option>
    `).join('');

    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
        <div class="badge badge-popular" id="salary-active-year-badge">${t('activeTaxYearBadge')}</div>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <!-- Input Panel -->
        <div class="input-panel">
          <h2 class="panel-title"><span>⚙️ ${t('calculate')}</span></h2>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('grossSalaryMonthly')}</label>
              <div class="input-with-affix">
                <span class="affix affix-left">€</span>
                <input type="number" id="salary-gross" class="form-input input-prefix" value="4500" step="50" min="0">
                <span class="affix affix-right">/mo</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">${t('grossSalaryAnnual')}</label>
              <div class="input-with-affix">
                <span class="affix affix-left">€</span>
                <input type="number" id="salary-gross-annual" class="form-input input-prefix" value="54000" step="500" min="0">
                <span class="affix affix-right">/yr</span>
              </div>
            </div>
          </div>
          <div id="salary-sync-info" class="form-helper" style="margin-top:-0.5rem; margin-bottom:1rem; font-weight:500; color:var(--accent-primary);"></div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('taxYearLabel')}</label>
              <select id="salary-taxyear" class="form-select">
                <option value="2026" selected>2026 (${currentLang === 'ko' ? '현재 법정 기준' : (currentLang === 'de' ? 'Aktuelle gesetzliche Vorgabe' : 'Current Statutory')})</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${t('taxClass')}</label>
              <select id="salary-taxclass" class="form-select">
                <option value="1" selected>${currentLang === 'ko' ? '1등급 (미혼/단독)' : (currentLang === 'de' ? 'Klasse I (Alleinstehend)' : 'Class I (Single)')}</option>
                <option value="2">${currentLang === 'ko' ? '2등급 (한부모)' : (currentLang === 'de' ? 'Klasse II (Alleinerziehend)' : 'Class II (Single Parent)')}</option>
                <option value="3">${currentLang === 'ko' ? '3등급 (기혼 - 주소득자)' : (currentLang === 'de' ? 'Klasse III (Verheiratet - Allein-/Hauptverdiener)' : 'Class III (Married - Primary Earner)')}</option>
                <option value="4">${currentLang === 'ko' ? '4등급 (기혼 - 동등소득)' : (currentLang === 'de' ? 'Klasse IV (Verheiratet - Doppelverdiener)' : 'Class IV (Married - Equal)')}</option>
                <option value="5">${currentLang === 'ko' ? '5등급 (기혼 - 보조소득자)' : (currentLang === 'de' ? 'Klasse V (Verheiratet - Zweitverdiener)' : 'Class V (Married - Secondary Earner)')}</option>
                <option value="6">${currentLang === 'ko' ? '6등급 (부업/이중근로)' : (currentLang === 'de' ? 'Klasse VI (Zweites / Mehrfach-Dienstverhältnis)' : 'Class VI (Second / Multiple Employment)')}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('bundesland')}</label>
              <select id="salary-state" class="form-select">${statesOptions}</select>
            </div>
            <div class="form-group">
              <label class="form-label">${t('churchTax')}</label>
              <select id="salary-church" class="form-select">
                <option value="false" selected>${t('no')}</option>
                <option value="true">${t('yes')} (8-9%)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('numChildren')}</label>
              <input type="number" id="salary-children" class="form-input" value="0" min="0" max="10">
              <div class="form-helper" style="font-size:0.75rem; color:var(--text-muted); margin-top:0.35rem; line-height:1.4;">
                ℹ️ ${t('careChildrenProofNote')}
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">${t('healthInsurance')}</label>
              <select id="salary-health" class="form-select">
                <option value="gkv" selected>${t('statutoryHealth')}</option>
                <option value="pkv">${t('privateHealth')}</option>
              </select>
            </div>
          </div>

          <div id="gkv-zusatz-row" class="form-group">
            <label class="form-label">${t('kasseZusatzbeitragLabel')}</label>
            <div class="input-with-affix">
              <input type="number" id="salary-zusatzbeitrag" class="form-input" placeholder="2.9" step="0.01" min="0" max="10">
              <span class="affix affix-right">%</span>
            </div>
            <div class="form-helper" style="font-size:0.75rem; color:var(--text-muted); margin-top:0.35rem; line-height:1.4;">
              💡 <strong>${t('usingAvgZusatzbeitrag2026')}</strong>. ${t('kasseZusatzbeitragNote')}
            </div>
          </div>

          <div id="pkv-row" class="form-group" style="display:none; background:var(--bg-secondary); padding:1rem; border-radius:8px; border:1px solid var(--border-subtle); margin-bottom:1rem;">
            <div style="font-size:0.875rem; font-weight:600; margin-bottom:0.35rem; color:var(--accent-primary); display:flex; align-items:center; justify-content:space-between;">
              <span>🛡️ ${t('pkvEstimatorTitle')}</span>
              <span id="pkv-live-cost-badge" class="badge badge-outline" style="font-size:0.75rem; font-weight:600;"></span>
            </div>
            <div style="font-size:0.75rem; color:var(--text-secondary); background:rgba(255,193,7,0.1); border-left:3px solid #f59e0b; padding:0.5rem 0.75rem; margin-bottom:0.75rem; border-radius:4px; line-height:1.45;">
              <strong>⚠️ Notice:</strong> ${t('pkvEstimatorNotice')}
            </div>
            <div class="form-row" style="margin-bottom:0.75rem;">
              <div class="form-group" style="margin-bottom:0; flex:1;">
                <label class="form-label" for="salary-pkv-premium">${t('pkvMonthlyPremiumLabel')}</label>
                <div class="input-with-affix">
                  <span class="affix affix-left">€</span>
                  <input type="number" id="salary-pkv-premium" class="form-input input-prefix" value="550" min="0" step="10">
                </div>
              </div>
              <div class="form-group" style="margin-bottom:0; flex:1;">
                <label class="form-label" for="salary-ppv-premium">${t('ppvMonthlyPremiumLabel')}</label>
                <div class="input-with-affix">
                  <span class="affix affix-left">€</span>
                  <input type="number" id="salary-ppv-premium" class="form-input input-prefix" value="80" min="0" step="5">
                </div>
              </div>
            </div>

            <div style="margin-bottom:0.75rem; padding:0.5rem 0; border-top:1px dashed var(--border-subtle);">
              <label class="checkbox-label" style="font-size:0.8125rem; cursor:pointer; display:flex; align-items:center; gap:0.5rem; user-select:none;">
                <input type="checkbox" id="salary-pkv-has-subsidy" checked>
                <strong>${t('pkvHasSubsidyLabel')}</strong>
              </label>
            </div>

            <div id="pkv-subsidy-box" class="form-group" style="margin-bottom:0.5rem;">
              <label class="form-label" for="salary-pkv-subsidy">${t('pkvEmployerSubsidyLabel')}</label>
              <div class="input-with-affix">
                <span class="affix affix-left">€</span>
                <input type="number" id="salary-pkv-subsidy" class="form-input input-prefix" value="" min="0" placeholder="Auto 50% split (capped at ~€613.22/mo)">
              </div>
              <span class="form-hint" style="font-size:0.7rem; color:var(--text-muted); display:block; margin-top:0.25rem;">
                ${t('pkvSubsidyAutoNote')}
              </span>
            </div>

            <div id="pkv-breakdown-card" style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); padding:0.5rem 0.75rem; border-radius:6px; font-size:0.75rem; border:1px solid var(--border-subtle); margin-top:0.5rem;">
              <div><span>Total: </span><strong id="pkv-total-val">€ 630,00</strong></div>
              <div><span>Employer Subsidy: </span><strong id="pkv-subsidy-val" style="color:var(--success, #10b981);">- € 315,00</strong></div>
              <div><span>Employee Cost: </span><strong id="pkv-employee-val" style="color:var(--accent-primary);">€ 315,00</strong></div>
            </div>
          </div>

          <div class="form-actions" style="justify-content: flex-end;">
            <button id="btn-salary-reset" class="btn-secondary">↺ ${t('reset')}</button>
          </div>

          <div class="notice-box">
            <strong>⚠️ ${t('estimatedNotice')}:</strong> ${t('estimatedDisclaimerText')}
          </div>
        </div>

        <!-- Result Panel -->
        <div class="result-panel">
          <div class="panel-title">
            <span>📊 ${t('resultsHeading')}</span>
            <button id="btn-copy-salary" class="btn-secondary" style="padding:0.35rem 0.65rem; font-size:0.75rem;">📋 ${t('copyResult')}</button>
          </div>

          <div class="result-hero">
            <div class="result-hero-label">${t('netMonthly')}</div>
            <div id="res-net-monthly" class="result-hero-amount">€ 0,00</div>
            <div id="res-net-annual" class="result-hero-sub" style="font-size:1rem; font-weight:600; color:var(--text-primary); margin-top:0.3rem;">Annual: € 0,00</div>
          </div>

          <div class="breakdown-list">
            <div class="breakdown-row">
              <span class="breakdown-label">${t('grossSalary')}</span>
              <span id="res-gross" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('incomeTax')}</span>
              <span id="res-incometax" class="breakdown-value negative">- € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('solz')}</span>
              <span id="res-solz" class="breakdown-value negative">- € 0,00</span>
            </div>
            <div class="breakdown-row" id="row-church">
              <span class="breakdown-label">${t('churchTaxAmount')}</span>
              <span id="res-church" class="breakdown-value negative">- € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('pensionContribution')}</span>
              <span id="res-rv" class="breakdown-value negative">- € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('unemploymentContribution')}</span>
              <span id="res-av" class="breakdown-value negative">- € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">
                <span id="label-health-name">${t('healthContribution')}</span>
                <span id="badge-health-status" style="display:block; font-size:0.7rem; color:var(--text-muted); font-weight:normal;"></span>
              </span>
              <span id="res-gkv" class="breakdown-value negative">- € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">
                <span id="label-care-name">${t('careContribution')}</span>
                <span id="badge-care-status" style="display:block; font-size:0.7rem; color:var(--text-muted); font-weight:normal;"></span>
              </span>
              <span id="res-pv" class="breakdown-value negative">- € 0,00</span>
            </div>
            <div class="breakdown-row total-row">
              <span class="breakdown-label">${t('totalDeductions')}</span>
              <span id="res-total-deductions" class="breakdown-value negative">- € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('effectiveDeductionRate')}</span>
              <span id="res-effective-rate" class="breakdown-value">0.0 %</span>
            </div>
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); padding:0.5rem 0.75rem; border-radius:6px; margin-top:0.75rem; line-height:1.45;">
            ℹ️ <strong>${t('payrollDisclaimerTitle')}:</strong> ${t('payrollDisclaimer')}
          </div>
        </div>

        <!-- Explanatory, 2026 Parameters, and Official Sources Section -->
        <div class="info-section">
          <!-- 2026 Statutory Calculation Parameters Card -->
          <div class="info-panel" style="margin-bottom:1.5rem; border-left:4px solid var(--accent-primary);">
            <h3 class="panel-title">⚖️ ${t('statutoryParams2026Title')}</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; margin-top:0.75rem;">
              <div class="param-mini-card">
                <span class="param-mini-label">Grundfreibetrag (2026):</span>
                <strong class="param-mini-val">€ 12.348 / yr</strong>
              </div>
              <div class="param-mini-card">
                <span class="param-mini-label">RV & AV BBG:</span>
                <strong class="param-mini-val">€ 8.450 / mo (€ 101.400 / yr)</strong>
              </div>
              <div class="param-mini-card">
                <span class="param-mini-label">GKV & PV BBG:</span>
                <strong class="param-mini-val">€ 5.812,50 / mo (€ 69.750 / yr)</strong>
              </div>
              <div class="param-mini-card">
                <span class="param-mini-label">JAEG (Pflichtgrenze):</span>
                <strong class="param-mini-val">€ 77.400 / yr (€ 6.450 / mo)</strong>
              </div>
              <div class="param-mini-card">
                <span class="param-mini-label">GKV Employee Rate:</span>
                <strong class="param-mini-val">8,75% (7,3% + 1,45% Zusatz)</strong>
              </div>
              <div class="param-mini-card">
                <span class="param-mini-label">PV Base Employee:</span>
                <strong class="param-mini-val">1,80% (SN: 2,30%) + 0,6% childless</strong>
              </div>
              <div class="param-mini-card">
                <span class="param-mini-label">SolZ Freigrenze (2026):</span>
                <strong class="param-mini-val">€ 20.350 (Single) / € 40.700 (Splitting)</strong>
              </div>
            </div>
            <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.75rem; line-height:1.5;">
              * Note: JAEG (€77.400/yr) is the statutory private health insurance threshold, while social security contributions cap at the GKV contribution ceiling (€5.812,50/mo). SolZ applies above the statutory exemption threshold with an 11.9% transition zone (§ 4 SolZG).
            </p>
          </div>

          <!-- Official Legal Sources & References -->
          <div class="info-panel">
            <h3 class="panel-title">🏛️ ${t('officialSourcesTitle')}</h3>
            <ul style="font-size:0.8125rem; color:var(--text-secondary); line-height:1.6; margin:0.5rem 0 1rem 1.25rem;">
              <li><b>Bundesfinanzministerium (BMF):</b> Programmablaufplan für den Lohnsteuerabzug 2026 (BMF PAP 2026), Lohnsteuer-Handbuch 2026 & § 32a EStG.</li>
              <li><b>Solidaritätszuschlaggesetz (SolZG):</b> §§ 3, 4 SolZG (Freigrenzen: €20.350 / €40.700; Milderungszone 11,9%).</li>
              <li><b>Bundesministerium für Gesundheit (BMG):</b> Sozialversicherungs-Rechengrößen-Verordnung 2026.</li>
              <li><b>Bundesministerium für Arbeit und Soziales (BMAS):</b> Rechengrößen der Sozialversicherung 2026.</li>
              <li><b>Deutsche Rentenversicherung:</b> Gesetzliche Beitragssätze und Grenzwerte 2026.</li>
            </ul>
            <div style="font-size:0.75rem; color:var(--text-muted); border-top:1px solid var(--border-subtle); padding-top:0.5rem;">
              🗓️ <span>${t('lastUpdatedDate')}</span> • <span>Version: 2026.1 Statutory Architecture</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Elements
    const grossEl = document.getElementById('salary-gross');
    const grossAnnualEl = document.getElementById('salary-gross-annual');
    const syncInfoEl = document.getElementById('salary-sync-info');
    const taxYearEl = document.getElementById('salary-taxyear');
    const taxClassEl = document.getElementById('salary-taxclass');
    const stateEl = document.getElementById('salary-state');
    const churchEl = document.getElementById('salary-church');
    const childrenEl = document.getElementById('salary-children');
    const healthEl = document.getElementById('salary-health');
    const gkvZusatzRow = document.getElementById('gkv-zusatz-row');
    const zusatzbeitragEl = document.getElementById('salary-zusatzbeitrag');
    const pkvRow = document.getElementById('pkv-row');
    const pkvPremiumEl = document.getElementById('salary-pkv-premium');
    const ppvPremiumEl = document.getElementById('salary-ppv-premium');
    const pkvHasSubsidyEl = document.getElementById('salary-pkv-has-subsidy');
    const pkvSubsidyEl = document.getElementById('salary-pkv-subsidy');
    const pkvSubsidyBox = document.getElementById('pkv-subsidy-box');
    const yearBadgeEl = document.getElementById('salary-active-year-badge');

    const updateSyncInfo = () => {
      const mVal = GLTUtils.parseNumber(grossEl.value, 0);
      const aVal = GLTUtils.parseNumber(grossAnnualEl.value, 0);
      if (syncInfoEl) {
        syncInfoEl.innerHTML = currentLang === 'ko'
          ? `💡 세전 월급 <b>${GLTUtils.formatEuro(mVal)}</b> ⇄ 세전 연봉 <b>${GLTUtils.formatEuro(aVal)}</b> (월급 × 12)`
          : (currentLang === 'de'
            ? `💡 Monatlich <b>${GLTUtils.formatEuro(mVal)}</b> ⇄ Jährlich <b>${GLTUtils.formatEuro(aVal)}</b> (Monat × 12)`
            : `💡 Monthly <b>${GLTUtils.formatEuro(mVal)}</b> ⇄ Annual <b>${GLTUtils.formatEuro(aVal)}</b> (Monthly × 12)`);
      }
    };

    const updateCalc = () => {
      const isPkv = healthEl.value === 'pkv';
      pkvRow.style.display = isPkv ? 'block' : 'none';
      if (gkvZusatzRow) {
        gkvZusatzRow.style.display = isPkv ? 'none' : 'block';
      }

      if (pkvSubsidyBox && pkvHasSubsidyEl) {
        pkvSubsidyBox.style.display = pkvHasSubsidyEl.checked ? 'block' : 'none';
      }

      const res = SalaryCalculator.calculateNetSalary({
        grossMonthly: grossEl.value,
        taxYear: taxYearEl.value,
        taxClass: taxClassEl.value,
        stateCode: stateEl.value,
        hasChurchTax: churchEl.value === 'true',
        numChildren: childrenEl.value,
        healthType: healthEl.value,
        kasseZusatzbeitrag: zusatzbeitragEl ? zusatzbeitragEl.value : null,
        pkvMonthlyPremium: pkvPremiumEl ? pkvPremiumEl.value : 550,
        ppvMonthlyPremium: ppvPremiumEl ? ppvPremiumEl.value : 80,
        hasEmployerSubsidy: pkvHasSubsidyEl ? pkvHasSubsidyEl.checked : true,
        employerSubsidy: (pkvSubsidyEl && pkvSubsidyEl.value.trim() !== '') ? pkvSubsidyEl.value : null
      });

      if (res && res.unavailable) {
        document.getElementById('res-net-monthly').textContent = 'N/A';
        document.getElementById('res-net-annual').textContent = currentLang === 'ko' ? res.messageKo : (currentLang === 'de' ? (res.messageDe || res.messageEn) : res.messageEn);
        if (yearBadgeEl) {
          yearBadgeEl.textContent = `${currentLang === 'ko' ? '세무 연도' : (currentLang === 'de' ? 'Steuerjahr' : 'Tax year')}: ${res.year}`;
        }
        return;
      }

      if (yearBadgeEl) {
        yearBadgeEl.textContent = `${currentLang === 'ko' ? '세무 연도' : (currentLang === 'de' ? 'Steuerjahr' : 'Tax year')}: ${res.taxYear}`;
      }

      // Update PKV live breakdown card
      if (isPkv && res.pkvDetails) {
        const totalValEl = document.getElementById('pkv-total-val');
        const subValEl = document.getElementById('pkv-subsidy-val');
        const empValEl = document.getElementById('pkv-employee-val');
        const liveBadge = document.getElementById('pkv-live-cost-badge');
        if (totalValEl) totalValEl.textContent = GLTUtils.formatEuro(res.pkvDetails.totalPremium);
        if (subValEl) subValEl.textContent = `- ${GLTUtils.formatEuro(res.pkvDetails.employerSubsidy)}`;
        if (empValEl) empValEl.textContent = GLTUtils.formatEuro(res.pkvDetails.employeeCost);
        if (liveBadge) liveBadge.textContent = `${t('pkvEmployeeCostLabel')}: ${GLTUtils.formatEuro(res.pkvDetails.employeeCost)} / mo`;
      }

      // Dynamic Health Insurance & Care Insurance labels and badges
      const labelHealthEl = document.getElementById('label-health-name');
      const badgeHealthEl = document.getElementById('badge-health-status');
      const labelCareEl = document.getElementById('label-care-name');
      const badgeCareEl = document.getElementById('badge-care-status');

      if (res.healthType === 'gkv') {
        const ratePct = (res.gkvEmployeeRate * 100).toFixed(2);
        if (labelHealthEl) {
          labelHealthEl.textContent = currentLang === 'ko'
            ? `건강보험 (GKV ${ratePct}%)`
            : (currentLang === 'de' ? `Krankenversicherung (GKV ${ratePct} %)` : `Health Insurance (GKV ${ratePct}%)`);
        }
        if (badgeHealthEl) {
          const statusText = (res.gkvMembershipStatus === 'voluntary')
            ? t('gkvVoluntaryBadge')
            : t('gkvMandatoryBadge');
          const noteText = res.isCustomZusatzbeitrag
            ? `Kasse Zusatz: ${(res.effectiveZusatzbeitrag * 100).toFixed(2)}%`
            : t('usingAvgZusatzbeitrag2026');
          badgeHealthEl.textContent = `${statusText} • ${noteText}`;
        }
        if (labelCareEl) {
          labelCareEl.textContent = t('careContribution');
        }
        if (badgeCareEl) {
          badgeCareEl.textContent = `${currentLang === 'de' ? 'Beitragssatz' : 'Rate'}: ${(res.pvEmployeeRate * 100).toFixed(2)}%`;
        }
      } else {
        if (labelHealthEl) {
          labelHealthEl.textContent = currentLang === 'ko'
            ? '민간 건강보험 (PKV 본인부담)'
            : (currentLang === 'de' ? 'Private Krankenversicherung (PKV Eigenanteil)' : 'Private Health Insurance (PKV Out-of-Pocket)');
        }
        if (badgeHealthEl) {
          const pkvPre = res.pkvDetails ? res.pkvDetails.pkvMonthlyPremium : 0;
          badgeHealthEl.textContent = currentLang === 'ko'
            ? `총 계약보험료 ${GLTUtils.formatEuro(pkvPre)} (지원금 차감 후)`
            : (currentLang === 'de' ? `Vertragsbeitrag ${GLTUtils.formatEuro(pkvPre)} (abzgl. Zuschuss)` : `Gross premium ${GLTUtils.formatEuro(pkvPre)} (net of subsidy)`);
        }
        if (labelCareEl) {
          labelCareEl.textContent = currentLang === 'ko'
            ? '민간 요양의무보험 (PPV 본인부담)'
            : (currentLang === 'de' ? 'Pflegepflichtversicherung (PPV Eigenanteil)' : 'Private Care Insurance (PPV Out-of-Pocket)');
        }
        if (badgeCareEl) {
          const ppvPre = res.pkvDetails ? res.pkvDetails.ppvMonthlyPremium : 0;
          badgeCareEl.textContent = currentLang === 'ko'
            ? `총 계약보험료 ${GLTUtils.formatEuro(ppvPre)} (지원금 차감 후)`
            : (currentLang === 'de' ? `Vertragsbeitrag ${GLTUtils.formatEuro(ppvPre)} (abzgl. Zuschuss)` : `Gross premium ${GLTUtils.formatEuro(ppvPre)} (net of subsidy)`);
        }
      }

      document.getElementById('res-net-monthly').textContent = GLTUtils.formatEuro(res.netMonthly);
      document.getElementById('res-net-annual').textContent = `Annual Net: ${GLTUtils.formatEuro(res.netAnnual)}`;
      document.getElementById('res-gross').textContent = `${GLTUtils.formatEuro(res.grossMonthly)} / mo (${GLTUtils.formatEuro(res.grossAnnual)} / yr)`;
      document.getElementById('res-incometax').textContent = `- ${GLTUtils.formatEuro(res.incomeTaxMonthly)}`;
      document.getElementById('res-solz').textContent = `- ${GLTUtils.formatEuro(res.solzMonthly)}`;
      document.getElementById('res-church').textContent = `- ${GLTUtils.formatEuro(res.churchTaxMonthly)}`;
      document.getElementById('res-rv').textContent = `- ${GLTUtils.formatEuro(res.rvMonthly)}`;
      document.getElementById('res-av').textContent = `- ${GLTUtils.formatEuro(res.avMonthly)}`;
      document.getElementById('res-gkv').textContent = `- ${GLTUtils.formatEuro(res.gkvMonthly)}`;
      document.getElementById('res-pv').textContent = `- ${GLTUtils.formatEuro(res.pvMonthly)}`;
      document.getElementById('res-total-deductions').textContent = `- ${GLTUtils.formatEuro(res.totalDeductionsMonthly)}`;
      document.getElementById('res-effective-rate').textContent = `${res.effectiveDeductionRate.toFixed(1)} %`;
    };

    grossEl.addEventListener('input', () => {
      const m = GLTUtils.parseNumber(grossEl.value, 0);
      grossAnnualEl.value = Math.round(m * 12);
      updateSyncInfo();
      updateCalc();
    });

    grossAnnualEl.addEventListener('input', () => {
      const a = GLTUtils.parseNumber(grossAnnualEl.value, 0);
      grossEl.value = Math.round(a / 12);
      updateSyncInfo();
      updateCalc();
    });

    [taxYearEl, taxClassEl, stateEl, churchEl, childrenEl, healthEl, zusatzbeitragEl, pkvPremiumEl, ppvPremiumEl, pkvHasSubsidyEl, pkvSubsidyEl].filter(Boolean).forEach(el => {
      el.addEventListener('input', updateCalc);
      el.addEventListener('change', updateCalc);
    });

    const calcBtn = document.getElementById('btn-salary-calc');
    if (calcBtn) {
      calcBtn.addEventListener('click', updateCalc);
    }
    document.getElementById('btn-salary-reset').addEventListener('click', () => {
      grossEl.value = "4500";
      grossAnnualEl.value = "54000";
      taxYearEl.value = "2026";
      taxClassEl.value = "1";
      stateEl.value = "BE";
      churchEl.value = "false";
      childrenEl.value = "0";
      healthEl.value = "gkv";
      if (zusatzbeitragEl) zusatzbeitragEl.value = "";
      if (pkvPremiumEl) pkvPremiumEl.value = "550";
      if (ppvPremiumEl) ppvPremiumEl.value = "80";
      if (pkvHasSubsidyEl) pkvHasSubsidyEl.checked = true;
      if (pkvSubsidyEl) pkvSubsidyEl.value = "";
      updateSyncInfo();
      updateCalc();
    });

    document.getElementById('btn-copy-salary').addEventListener('click', function() {
      const summary = `German Salary Calculation (${taxYearEl.value} Estimate):\nGross: €${grossEl.value}/mo (€${grossAnnualEl.value}/yr)\nNet: ${document.getElementById('res-net-monthly').textContent} (${document.getElementById('res-net-annual').textContent})\nDeductions: ${document.getElementById('res-total-deductions').textContent} (${document.getElementById('res-effective-rate').textContent})\nhttps://german.yocto.co.kr/#salary`;
      GLTUtils.copyText(summary, this);
    });

    updateSyncInfo();
    updateCalc();
  },

  // Tool 2: Net to Gross Calculator
  renderNetToGrossTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
        <div class="badge badge-popular" id="rev-active-year-badge">${t('activeTaxYearBadge')}</div>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>🎯 ${t('calculate')}</span></h2>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('desiredNet')}</label>
              <div class="input-with-affix">
                <span class="affix affix-left">€</span>
                <input type="number" id="rev-net" class="form-input input-prefix" value="3000" step="50" min="0">
                <span class="affix affix-right">/mo</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">${t('desiredNetAnnual')}</label>
              <div class="input-with-affix">
                <span class="affix affix-left">€</span>
                <input type="number" id="rev-net-annual" class="form-input input-prefix" value="36000" step="500" min="0">
                <span class="affix affix-right">/yr</span>
              </div>
            </div>
          </div>
          <div id="rev-sync-info" class="form-helper" style="margin-top:-0.5rem; margin-bottom:1rem; font-weight:500; color:var(--accent-primary);"></div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('taxYearLabel')}</label>
              <select id="rev-taxyear" class="form-select">
                <option value="2026" selected>2026 (${currentLang === 'ko' ? '법정 기준' : (currentLang === 'de' ? 'Gesetzliche Vorgabe' : 'Statutory')})</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${t('taxClass')}</label>
              <select id="rev-taxclass" class="form-select">
                <option value="1" selected>${currentLang === 'ko' ? '1등급' : (currentLang === 'de' ? 'Klasse I' : 'Class I')}</option>
                <option value="3">${currentLang === 'ko' ? '3등급' : (currentLang === 'de' ? 'Klasse III' : 'Class III')}</option>
                <option value="4">${currentLang === 'ko' ? '4등급' : (currentLang === 'de' ? 'Klasse IV' : 'Class IV')}</option>
                <option value="5">${currentLang === 'ko' ? '5등급' : (currentLang === 'de' ? 'Klasse V' : 'Class V')}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('numChildren')}</label>
              <input type="number" id="rev-children" class="form-input" value="0" min="0">
            </div>
          </div>

          <div class="notice-box">
            <strong>⚠️ ${t('estimatedNotice')}:</strong> ${t('estimatedDisclaimerText')}
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('requiredGross')}</div>
            <div id="res-rev-gross" class="result-hero-amount">€ 0,00</div>
            <div id="res-rev-annual" class="result-hero-sub" style="font-size:1rem; font-weight:600; color:var(--text-primary); margin-top:0.3rem;">Annual: € 0,00</div>
          </div>
          <p id="res-rev-explanation" style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin-top:1rem;">
            To achieve your target net salary, you should negotiate the gross salary shown above with your employer.
          </p>
        </div>
      </div>
    `;

    const netIn = document.getElementById('rev-net');
    const netAnnualIn = document.getElementById('rev-net-annual');
    const syncInfoEl = document.getElementById('rev-sync-info');
    const yearIn = document.getElementById('rev-taxyear');
    const tcIn = document.getElementById('rev-taxclass');
    const chIn = document.getElementById('rev-children');
    const explEl = document.getElementById('res-rev-explanation');
    const revYearBadge = document.getElementById('rev-active-year-badge');

    const updateRevSyncInfo = () => {
      const mVal = GLTUtils.parseNumber(netIn.value, 0);
      const aVal = GLTUtils.parseNumber(netAnnualIn.value, 0);
      if (syncInfoEl) {
        syncInfoEl.innerHTML = currentLang === 'ko'
          ? `💡 목표 실수령 월 <b>${GLTUtils.formatEuro(mVal)}</b> ⇄ 연간 <b>${GLTUtils.formatEuro(aVal)}</b> (월 실수령액 × 12)`
          : (currentLang === 'de'
            ? `💡 Ziel-Netto monatlich <b>${GLTUtils.formatEuro(mVal)}</b> ⇄ jährlich <b>${GLTUtils.formatEuro(aVal)}</b> (Monatsnetto × 12)`
            : `💡 Target Monthly Net <b>${GLTUtils.formatEuro(mVal)}</b> ⇄ Annual Net <b>${GLTUtils.formatEuro(aVal)}</b> (Monthly × 12)`);
      }
    };

    const updateRev = () => {
      const taxYear = yearIn ? yearIn.value : 2026;
      if (revYearBadge) {
        revYearBadge.textContent = `${currentLang === 'ko' ? '세무 연도' : (currentLang === 'de' ? 'Steuerjahr' : 'Tax year')}: ${taxYear}`;
      }
      const gross = SalaryCalculator.calculateNetToGross(netIn.value, {
        taxYear: taxYear,
        taxClass: tcIn.value,
        numChildren: chIn.value,
        stateCode: "BE"
      });

      if (typeof gross === 'object' && gross && gross.unavailable) {
        document.getElementById('res-rev-gross').textContent = 'N/A';
        document.getElementById('res-rev-annual').textContent = currentLang === 'ko' ? gross.messageKo : (currentLang === 'de' ? (gross.messageDe || gross.messageEn) : gross.messageEn);
        if (explEl) {
          explEl.innerHTML = currentLang === 'ko' ? gross.messageKo : (currentLang === 'de' ? (gross.messageDe || gross.messageEn) : gross.messageEn);
        }
        return;
      }

      document.getElementById('res-rev-gross').textContent = `${GLTUtils.formatEuro(gross)} / mo`;
      document.getElementById('res-rev-annual').textContent = `${currentLang === 'de' ? 'Jahresbrutto' : 'Annual Gross'}: ${GLTUtils.formatEuro(gross * 12)} / yr`;

      const targetM = GLTUtils.formatEuro(GLTUtils.parseNumber(netIn.value, 0));
      const targetA = GLTUtils.formatEuro(GLTUtils.parseNumber(netAnnualIn.value, 0));
      const reqM = GLTUtils.formatEuro(gross);
      const reqA = GLTUtils.formatEuro(gross * 12);

      if (explEl) {
        explEl.innerHTML = currentLang === 'ko'
          ? `목표 실수령액 <b>${targetM} / 월</b> (연간 <b>${targetA}</b>)을 받으려면, 연봉 협상 시 <b>필요 세전 월급 약 ${reqM}</b>, <b>필요 세전 연봉 약 ${reqA}</b>를 요구해야 합니다. (세무 연도: ${taxYear}년)`
          : (currentLang === 'de'
            ? `Um ein monatliches Netto von <b>${targetM}</b> (jährlich netto <b>${targetA}</b>) zu erzielen, ist ein Bruttogehalt von ca. <b>${reqM} / Monat</b> (<b>${reqA} / Jahr</b>) erforderlich. (Steuerjahr: ${taxYear})`
            : `To achieve a monthly take-home pay of <b>${targetM}</b> (annual net <b>${targetA}</b>), you should negotiate a gross salary of approximately <b>${reqM} / month</b> (<b>${reqA} / year</b>) with your employer. (Tax year: ${taxYear})`);
      }
    };

    netIn.addEventListener('input', () => {
      const m = GLTUtils.parseNumber(netIn.value, 0);
      netAnnualIn.value = Math.round(m * 12);
      updateRevSyncInfo();
      updateRev();
    });

    netAnnualIn.addEventListener('input', () => {
      const a = GLTUtils.parseNumber(netAnnualIn.value, 0);
      netIn.value = Math.round(a / 12);
      updateRevSyncInfo();
      updateRev();
    });

    [yearIn, tcIn, chIn].forEach(el => {
      if (el) {
        el.addEventListener('input', updateRev);
        el.addEventListener('change', updateRev);
      }
    });

    const revBtn = document.getElementById('btn-rev-calc');
    if (revBtn) {
      revBtn.addEventListener('click', updateRev);
    }

    updateRevSyncInfo();
    updateRev();
  },

  // Tool 3: Annual Salary Calculator
  renderAnnualSalaryTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>💵 Compensation Components</span></h2>

          <!-- 1. Base salary -->
          <div class="form-group" style="margin-bottom:1.25rem;">
            <label class="form-label" style="font-weight:700; color:var(--text-primary);">
              ${t('baseSalarySection') || 'Base salary'}
            </label>
            <div class="input-with-affix">
              <span class="affix affix-left">€</span>
              <input type="number" id="ann-base" class="form-input input-prefix" value="5000" min="0" step="100">
              <span class="affix affix-right">/mo</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;">
              ${t('monthlyGross')}
            </div>
          </div>

          <!-- 2. Fixed additional payments -->
          <div class="form-group" style="margin-bottom:1.25rem;">
            <label class="form-label" style="font-weight:700; color:var(--text-primary);">
              ${t('fixedAdditionalSection') || 'Fixed additional payments'}
            </label>
            <div class="input-with-affix">
              <input type="number" id="ann-monthly-count" class="form-input" value="1" min="0" max="6" step="0.25">
              <span class="affix affix-right">× monthly</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;">
              ${t('additionalMonthlyCountSub')}
            </div>
          </div>

          <!-- 3. Performance bonus -->
          <div class="form-group" style="margin-bottom:1.25rem;">
            <label class="form-label" style="font-weight:700; color:var(--text-primary);">
              ${t('performanceBonusSection') || 'Performance bonus'}
            </label>
            <div class="input-with-affix">
              <input type="number" id="ann-bonus-pct" class="form-input" value="10" min="0" max="200" step="0.5">
              <span class="affix affix-right">%</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;">
              ${t('performanceBonusPctSub')}
            </div>
          </div>

          <!-- 4. Other annual payments -->
          <div class="form-group" style="margin-bottom:0.5rem;">
            <label class="form-label" style="font-weight:700; color:var(--text-primary);">
              ${t('otherAnnualSection') || 'Other annual payments'}
            </label>
            <div class="input-with-affix">
              <span class="affix affix-left">€</span>
              <input type="number" id="ann-fixed-amount" class="form-input input-prefix" value="0" min="0" step="250">
              <span class="affix affix-right">/year</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;">
              ${t('fixedAnnualBonusSub')}
            </div>
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('totalAnnualComp')}</div>
            <div id="res-ann-total" class="result-hero-amount">€ 0,00</div>
            <div id="res-ann-monthly" class="result-hero-sub">${t('monthlyAverageComp')}: € 0,00</div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-row">
              <span class="breakdown-label">${t('baseSalarySection') || 'Base salary'} (12 × Base)</span>
              <span id="res-ann-base" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('fixedAdditionalSection') || 'Fixed additional payments'}</span>
              <span id="res-ann-monthly-add" class="breakdown-value positive">+ € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('performanceBonusSection') || 'Performance bonus'}</span>
              <span id="res-ann-pct" class="breakdown-value positive">+ € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('otherAnnualSection') || 'Other annual payments'}</span>
              <span id="res-ann-fixed-lump" class="breakdown-value positive">+ € 0,00</span>
            </div>
          </div>
        </div>
      </div>

      <div class="info-box" style="margin-top:1.5rem; font-size:0.875rem; color:var(--text-muted); line-height:1.5;">
        ℹ️ <strong>${t('annualCompStatutoryNote')}</strong>
      </div>
    `;

    const baseIn = document.getElementById('ann-base');
    const monthlyCountIn = document.getElementById('ann-monthly-count');
    const pctIn = document.getElementById('ann-bonus-pct');
    const fixedAmountIn = document.getElementById('ann-fixed-amount');

    const updateAnn = () => {
      const res = SalaryCalculator.calculateAnnualCompensation({
        monthlyGross: baseIn.value,
        additionalMonthlyCount: monthlyCountIn.value,
        performanceBonusPercent: pctIn.value,
        fixedAnnualBonus: fixedAmountIn.value
      });

      document.getElementById('res-ann-total').textContent = GLTUtils.formatEuro(res.totalComp);
      document.getElementById('res-ann-monthly').textContent = `${t('monthlyAverageComp')}: ${GLTUtils.formatEuro(res.monthlyEquivalent)}`;
      document.getElementById('res-ann-base').textContent = GLTUtils.formatEuro(res.baseAnnual);
      document.getElementById('res-ann-monthly-add').textContent = `+ ${GLTUtils.formatEuro(res.additionalMonthlyAmount)} (${res.additionalMonthlyCount} × Mo)`;
      document.getElementById('res-ann-pct').textContent = `+ ${GLTUtils.formatEuro(res.performanceBonusAmount)} (${res.performanceBonusPercent}%)`;
      document.getElementById('res-ann-fixed-lump').textContent = `+ ${GLTUtils.formatEuro(res.fixedAnnualAmount)}`;
    };

    [baseIn, monthlyCountIn, pctIn, fixedAmountIn].forEach(el => el.addEventListener('input', updateAnn));
    updateAnn();
  },

  // Tool 4: Tax Class Comparison
  renderTaxClassTool(container, tool) {
    const lang = currentLang;
    const rows = GERMAN_TAX_CONFIG.taxClasses.map(tc => {
      const className = lang === 'ko'
        ? `${tc.id}등급 (Steuerklasse ${['I','II','III','IV','V','VI'][parseInt(tc.id)-1]})`
        : (lang === 'de' ? `Steuerklasse ${['I','II','III','IV','V','VI'][parseInt(tc.id)-1]}` : tc.name);
      return `
      <tr>
        <td style="font-weight:700; color:var(--text-primary);">${className}</td>
        <td>${lang === 'ko' ? tc.useCaseKo : (lang === 'de' ? (tc.useCaseDe || tc.useCaseEn) : tc.useCaseEn)}</td>
        <td>${lang === 'ko' ? tc.featuresKo : (lang === 'de' ? (tc.featuresDe || tc.featuresEn) : tc.featuresEn)}</td>
        <td style="color:var(--warning-color);">${lang === 'ko' ? tc.limitationsKo : (lang === 'de' ? (tc.limitationsDe || tc.limitationsEn) : tc.limitationsEn)}</td>
      </tr>
    `;
    }).join('');

    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="info-panel" style="margin-bottom:1.5rem;">
        <h3 class="panel-title">💑 ${t('marriedGuideTitle')}</h3>
        <p style="font-size:0.9375rem; color:var(--text-secondary); line-height:1.6;">
          ${t('marriedGuideText')}
        </p>
      </div>

      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>${t('classCol')}</th>
              <th>${t('useCaseCol')}</th>
              <th>${t('featuresCol')}</th>
              <th>${t('limitationsCol')}</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  // Tool 5: Rent Calculator
  renderRentTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>🏠 ${t('calculate')}</span></h2>
          <div class="form-group">
            <label class="form-label">${t('kaltmiete')}</label>
            <div class="input-with-affix">
              <span class="affix affix-left">€</span>
              <input type="number" id="rent-kalt" class="form-input input-prefix" value="1100" min="0">
              <span class="affix affix-right">/mo</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('nebenkosten')}</label>
            <div class="input-with-affix">
              <span class="affix affix-left">€</span>
              <input type="number" id="rent-neben" class="form-input input-prefix" value="250" min="0">
              <span class="affix affix-right">/mo</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('heatingIncluded')}</label>
            <select id="rent-heat-inc" class="form-select">
              <option value="true" selected>${t('yes')} (Standard)</option>
              <option value="false">${t('no')} (Separate gas/electric heating)</option>
            </select>
          </div>
          <div id="heat-extra-group" class="form-group" style="display:none;">
            <label class="form-label">${t('extraHeating')}</label>
            <div class="input-with-affix">
              <span class="affix affix-left">€</span>
              <input type="number" id="rent-heat-extra" class="form-input input-prefix" value="80" min="0">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('electricity')}</label>
              <div class="input-with-affix">
                <span class="affix affix-left">€</span>
                <input type="number" id="rent-elec" class="form-input input-prefix" value="75" min="0">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">${t('internet')}</label>
              <div class="input-with-affix">
                <span class="affix affix-left">€</span>
                <input type="number" id="rent-inet" class="form-input input-prefix" value="40" min="0">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('rundfunkbeitragLabel')}</label>
            <select id="rent-rundfunk" class="form-select">
              <option value="true" selected>${t('rundfunkPayDwelling')}</option>
              <option value="false">${t('rundfunkCoveredOrExempt')}</option>
            </select>
            <div class="form-hint" style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.35rem; line-height:1.5;">
              ${t('rundfunkLegalNotice')}
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('netMonthlyIncome')}</label>
            <div class="input-with-affix">
              <span class="affix affix-left">€</span>
              <input type="number" id="rent-net-income" class="form-input input-prefix" value="3800" min="0">
            </div>
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('totalHousingMonthly')}</div>
            <div id="res-rent-monthly" class="result-hero-amount">€ 0,00</div>
            <div id="res-rent-annual" class="result-hero-sub">Annual: € 0,00</div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-row">
              <span class="breakdown-label">${t('kaltmiete')}</span>
              <span id="res-rent-kalt" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('nebenkosten')}</span>
              <span id="res-rent-neben" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row" style="font-weight:600;">
              <span class="breakdown-label">${t('warmmiete')}</span>
              <span id="res-rent-warm" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('electricity')} + ${t('internet')}</span>
              <span id="res-rent-elec-inet" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('rundfunkbeitragBreakdown')}</span>
              <span id="res-rent-rundfunk" class="breakdown-value">€ 18,36</span>
            </div>
            <div class="breakdown-row total-row">
              <span class="breakdown-label">${t('rentIncomeRatio')}</span>
              <span id="res-rent-ratio" class="breakdown-value">0.0 %</span>
            </div>
          </div>
          <div class="notice-box">
            💡 ${t('rentHealthyNote')}
          </div>
        </div>

        <div class="info-section">
          <div class="info-panel">
            <h3 class="panel-title">📖 ${t('kaltmieteExplainTitle')}</h3>
            <div style="font-size:0.875rem; color:var(--text-secondary); line-height:1.7;">
              ${t('kaltmieteExplain')}
            </div>
          </div>
        </div>
      </div>
    `;

    const kaltIn = document.getElementById('rent-kalt');
    const nebenIn = document.getElementById('rent-neben');
    const heatIncIn = document.getElementById('rent-heat-inc');
    const heatExtraGroup = document.getElementById('heat-extra-group');
    const heatExtraIn = document.getElementById('rent-heat-extra');
    const elecIn = document.getElementById('rent-elec');
    const inetIn = document.getElementById('rent-inet');
    const rundfunkIn = document.getElementById('rent-rundfunk');
    const netIncIn = document.getElementById('rent-net-income');

    const updateRent = () => {
      const isHeatingInc = heatIncIn.value === 'true';
      heatExtraGroup.style.display = isHeatingInc ? 'none' : 'block';

      const res = RentCalculator.calculateRent({
        kaltmiete: kaltIn.value,
        nebenkosten: nebenIn.value,
        isHeatingIncluded: isHeatingInc,
        extraHeating: heatExtraIn.value,
        electricity: elecIn.value,
        internet: inetIn.value,
        includeRundfunkbeitrag: rundfunkIn.value === 'true',
        netIncome: netIncIn.value
      });

      document.getElementById('res-rent-monthly').textContent = GLTUtils.formatEuro(res.totalHousingMonthly);
      document.getElementById('res-rent-annual').textContent = `Annual: ${GLTUtils.formatEuro(res.totalHousingAnnual)}`;
      document.getElementById('res-rent-kalt').textContent = GLTUtils.formatEuro(res.kaltmiete);
      document.getElementById('res-rent-neben').textContent = GLTUtils.formatEuro(res.nebenkosten);
      document.getElementById('res-rent-warm').textContent = GLTUtils.formatEuro(res.warmmiete);
      document.getElementById('res-rent-elec-inet').textContent = GLTUtils.formatEuro(res.electricity + res.internet);
      document.getElementById('res-rent-rundfunk').textContent = GLTUtils.formatEuro(res.rundfunkbeitrag);
      document.getElementById('res-rent-ratio').textContent = res.rentRatio ? `${res.rentRatio.toFixed(1)} %` : 'N/A';
    };

    [kaltIn, nebenIn, heatIncIn, heatExtraIn, elecIn, inetIn, rundfunkIn, netIncIn].forEach(el => {
      el.addEventListener('input', updateRent);
      el.addEventListener('change', updateRent);
    });
    updateRent();
  },


  // Tool 7: Moving Cost Calculator
  renderMovingTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>📦 Relocation Expenses</span></h2>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('truckRental')}</label>
              <input type="number" id="mov-truck" class="form-input" value="150">
            </div>
            <div class="form-group">
              <label class="form-label">${t('movingCompany')}</label>
              <input type="number" id="mov-company" class="form-input" value="0">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('boxesPacking')}</label>
              <input type="number" id="mov-boxes" class="form-input" value="90">
            </div>
            <div class="form-group">
              <label class="form-label">${t('cleaningRenovation')}</label>
              <input type="number" id="mov-cleaning" class="form-input" value="200">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('depositAmount')}</label>
            <input type="number" id="mov-deposit" class="form-input" value="3300">
          </div>
          <div class="form-group">
            <label class="form-label">${t('newFurniture')}</label>
            <input type="number" id="mov-furniture" class="form-input" value="1800">
          </div>
          <div class="form-group">
            <label class="form-label">${t('mailForwarding')}</label>
            <input type="number" id="mov-mail" class="form-input" value="38">
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('totalMovingCost')}</div>
            <div id="res-mov-total" class="result-hero-amount">€ 0,00</div>
          </div>
          <div class="breakdown-list" id="res-mov-breakdown"></div>
        </div>
      </div>
    `;

    const inputs = ['mov-truck', 'mov-company', 'mov-boxes', 'mov-cleaning', 'mov-deposit', 'mov-furniture', 'mov-mail'];
    const updateMov = () => {
      const res = MovingCalculator.calculateMovingCost({
        truckRental: document.getElementById('mov-truck').value,
        movingCompany: document.getElementById('mov-company').value,
        boxesPacking: document.getElementById('mov-boxes').value,
        cleaningRenovation: document.getElementById('mov-cleaning').value,
        depositAmount: document.getElementById('mov-deposit').value,
        newFurniture: document.getElementById('mov-furniture').value,
        mailForwarding: document.getElementById('mov-mail').value
      });

      document.getElementById('res-mov-total').textContent = GLTUtils.formatEuro(res.total);
    };

    inputs.forEach(id => document.getElementById(id).addEventListener('input', updateMov));
    updateMov();
  },

  // Tool 8: Car Cost Calculator
  renderCarCostTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>🚗 Vehicle Costs</span></h2>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('monthlyFinancing')}</label>
              <input type="number" id="car-monthly-fin" class="form-input" value="350">
            </div>
            <div class="form-group">
              <label class="form-label">${t('annualKm')}</label>
              <input type="number" id="car-annual-km" class="form-input" value="15000">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('powertrain')}</label>
            <select id="car-powertrain" class="form-select">
              <option value="petrol" selected>${t('petrol')}</option>
              <option value="diesel">${t('diesel')}</option>
              <option value="hybrid">${t('hybrid')}</option>
              <option value="ev">${t('ev')}</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('fuelConsumption')}</label>
              <input type="number" id="car-fuel-cons" class="form-input" value="6.8" step="0.1">
            </div>
            <div class="form-group">
              <label class="form-label">${t('fuelPricePerUnit')}</label>
              <input type="number" id="car-fuel-price" class="form-input" value="1.78" step="0.01">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('carInsurance')}</label>
              <input type="number" id="car-ins" class="form-input" value="700">
            </div>
            <div class="form-group">
              <label class="form-label">${t('carTax')}</label>
              <input type="number" id="car-tax" class="form-input" value="160">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('carMaintenance')}</label>
              <input type="number" id="car-maint" class="form-input" value="450">
            </div>
            <div class="form-group">
              <label class="form-label">${t('carParking')}</label>
              <input type="number" id="car-park" class="form-input" value="40">
            </div>
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('monthlyCarCost')}</div>
            <div id="res-car-monthly" class="result-hero-amount">€ 0,00</div>
            <div id="res-car-km" class="result-hero-sub">Cost per km: € 0,00 / km</div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-row">
              <span class="breakdown-label">${t('annualCarCost')}</span>
              <span id="res-car-annual" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('threeYearCost')}</span>
              <span id="res-car-3yr" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('fiveYearCost')}</span>
              <span id="res-car-5yr" class="breakdown-value">€ 0,00</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <div class="info-panel">
            <h3 class="panel-title">⚖️ ${t('tcoComparisonTitle')}</h3>
            <div class="data-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Monthly TCO</th>
                    <th>Annual TCO</th>
                    <th>Cost per km</th>
                  </tr>
                </thead>
                <tbody id="res-car-comp-table"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    const finIn = document.getElementById('car-monthly-fin');
    const kmIn = document.getElementById('car-annual-km');
    const ptIn = document.getElementById('car-powertrain');
    const consIn = document.getElementById('car-fuel-cons');
    const priceIn = document.getElementById('car-fuel-price');
    const insIn = document.getElementById('car-ins');
    const taxIn = document.getElementById('car-tax');
    const maintIn = document.getElementById('car-maint');
    const parkIn = document.getElementById('car-park');

    ptIn.addEventListener('change', () => {
      if (ptIn.value === 'ev') {
        consIn.value = "17.5";
        priceIn.value = "0.36";
        taxIn.value = "0";
      } else if (ptIn.value === 'diesel') {
        consIn.value = "5.5";
        priceIn.value = "1.65";
        taxIn.value = "240";
      } else if (ptIn.value === 'hybrid') {
        consIn.value = "4.8";
        priceIn.value = "1.78";
        taxIn.value = "90";
      } else {
        consIn.value = "6.8";
        priceIn.value = "1.78";
        taxIn.value = "160";
      }
      updateCar();
    });

    const updateCar = () => {
      const res = CarCalculator.calculateCarCost({
        monthlyFinancing: finIn.value,
        annualKm: kmIn.value,
        powertrain: ptIn.value,
        fuelConsumption: consIn.value,
        fuelPrice: priceIn.value,
        insuranceAnnual: insIn.value,
        taxAnnual: taxIn.value,
        maintenanceAnnual: maintIn.value,
        parkingMonthly: parkIn.value
      });

      document.getElementById('res-car-monthly').textContent = GLTUtils.formatEuro(res.monthlyCost);
      document.getElementById('res-car-km').textContent = `Cost per km: ${GLTUtils.formatEuro(res.costPerKm)} / km`;
      document.getElementById('res-car-annual').textContent = GLTUtils.formatEuro(res.annualCost);
      document.getElementById('res-car-3yr').textContent = GLTUtils.formatEuro(res.threeYearCost);
      document.getElementById('res-car-5yr').textContent = GLTUtils.formatEuro(res.fiveYearCost);

      const compTbody = document.getElementById('res-car-comp-table');
      compTbody.innerHTML = `
        <tr>
          <td>⛽ <b>Gasoline (ICE)</b></td>
          <td>${GLTUtils.formatEuro(res.comparison.ice.monthly)}</td>
          <td>${GLTUtils.formatEuro(res.comparison.ice.annual)}</td>
          <td>${GLTUtils.formatEuro(res.comparison.ice.perKm)}</td>
        </tr>
        <tr>
          <td>🔋 <b>Hybrid (HEV)</b></td>
          <td>${GLTUtils.formatEuro(res.comparison.hybrid.monthly)}</td>
          <td>${GLTUtils.formatEuro(res.comparison.hybrid.annual)}</td>
          <td>${GLTUtils.formatEuro(res.comparison.hybrid.perKm)}</td>
        </tr>
        <tr>
          <td>⚡ <b style="color:var(--success-color);">Electric (EV)</b></td>
          <td><b>${GLTUtils.formatEuro(res.comparison.ev.monthly)}</b></td>
          <td><b>${GLTUtils.formatEuro(res.comparison.ev.annual)}</b></td>
          <td><b>${GLTUtils.formatEuro(res.comparison.ev.perKm)}</b></td>
        </tr>
      `;
    };

    [finIn, kmIn, consIn, priceIn, insIn, taxIn, maintIn, parkIn].forEach(el => el.addEventListener('input', updateCar));
    updateCar();
  },

  // Tool 9: Fuel Cost Calculator
  renderFuelCostTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>⛽ Trip Parameters</span></h2>
          <div class="form-group">
            <label class="form-label">${t('tripDistance')}</label>
            <input type="number" id="fuel-dist" class="form-input" value="450" min="0">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('fuelUnit')}</label>
              <select id="fuel-unit-select" class="form-select">
                <option value="literPer100Km" selected>${t('literPer100Km')}</option>
                <option value="kmPerLiter">${t('kmPerLiter')}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${t('fuelConsumption')}</label>
              <input type="number" id="fuel-consumption" class="form-input" value="6.5" step="0.1">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('fuelPricePerUnit')}</label>
            <div class="input-with-affix">
              <span class="affix affix-left">€</span>
              <input type="number" id="fuel-price" class="form-input input-prefix" value="1.75" step="0.01">
              <span class="affix affix-right">/L</span>
            </div>
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('totalFuelCost')}</div>
            <div id="res-fuel-total" class="result-hero-amount">€ 0,00</div>
            <div id="res-fuel-liters" class="result-hero-sub">0.0 Liters Needed</div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-row">
              <span class="breakdown-label">${t('costPer100km')}</span>
              <span id="res-fuel-100k" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">Cost per km</span>
              <span id="res-fuel-km" class="breakdown-value">€ 0,00</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const distIn = document.getElementById('fuel-dist');
    const unitIn = document.getElementById('fuel-unit-select');
    const consIn = document.getElementById('fuel-consumption');
    const priceIn = document.getElementById('fuel-price');

    const updateFuel = () => {
      const res = FuelAndEVCalculator.calculateFuel(distIn.value, consIn.value, unitIn.value, priceIn.value);
      document.getElementById('res-fuel-total').textContent = GLTUtils.formatEuro(res.totalCost);
      document.getElementById('res-fuel-liters').textContent = `${res.fuelRequiredLiters.toFixed(1)} Liters Required`;
      document.getElementById('res-fuel-100k').textContent = `${GLTUtils.formatEuro(res.costPer100km)} / 100 km`;
      document.getElementById('res-fuel-km').textContent = `${GLTUtils.formatEuro(res.costPerKm)} / km`;
    };

    [distIn, unitIn, consIn, priceIn].forEach(el => {
      el.addEventListener('input', updateFuel);
      el.addEventListener('change', updateFuel);
    });
    updateFuel();
  },

  // Tool 10: EV Charging Cost Calculator
  renderEVChargingTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>⚡ EV Session</span></h2>
          <div class="form-group">
            <label class="form-label">${t('batteryCapacity')}</label>
            <input type="number" id="ev-cap" class="form-input" value="65" min="10">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('chargeStartPct')}</label>
              <input type="number" id="ev-start" class="form-input" value="15" min="0" max="100">
            </div>
            <div class="form-group">
              <label class="form-label">${t('chargeTargetPct')}</label>
              <input type="number" id="ev-target" class="form-input" value="80" min="0" max="100">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('chargerType')}</label>
            <select id="ev-tariff-select" class="form-select">
              <option value="0.32" selected>${t('homeWallbox')}</option>
              <option value="0.45">${t('publicAC')}</option>
              <option value="0.65">${t('publicDC')}</option>
              <option value="custom">${t('customTariff')}</option>
            </select>
          </div>
          <div class="form-group" id="ev-custom-tariff-row" style="display:none;">
            <label class="form-label">${t('customTariff')}</label>
            <input type="number" id="ev-custom-price" class="form-input" value="0.35" step="0.01">
          </div>
          <div class="form-group">
            <label class="form-label">${t('evConsumption')}</label>
            <input type="number" id="ev-cons" class="form-input" value="18" step="0.5">
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('sessionCost')}</div>
            <div id="res-ev-session" class="result-hero-amount">€ 0,00</div>
            <div id="res-ev-energy" class="result-hero-sub">0.0 kWh Added</div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-row">
              <span class="breakdown-label">${t('costPer100KmEV')}</span>
              <span id="res-ev-100k" class="breakdown-value positive">€ 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">Cost per km</span>
              <span id="res-ev-km" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row total-row">
              <span class="breakdown-label">Savings vs Gas per 100km</span>
              <span id="res-ev-savings" class="breakdown-value positive">€ 0,00</span>
            </div>
          </div>
          <div class="notice-box">
            🍃 ${t('combustionCompare')}
          </div>
        </div>
      </div>
    `;

    const capIn = document.getElementById('ev-cap');
    const startIn = document.getElementById('ev-start');
    const targetIn = document.getElementById('ev-target');
    const tariffSelect = document.getElementById('ev-tariff-select');
    const customRow = document.getElementById('ev-custom-tariff-row');
    const customPriceIn = document.getElementById('ev-custom-price');
    const consIn = document.getElementById('ev-cons');

    const updateEV = () => {
      let price = parseFloat(tariffSelect.value);
      if (tariffSelect.value === 'custom') {
        customRow.style.display = 'block';
        price = parseFloat(customPriceIn.value || 0.35);
      } else {
        customRow.style.display = 'none';
      }

      const res = FuelAndEVCalculator.calculateEV(capIn.value, startIn.value, targetIn.value, price, consIn.value);
      document.getElementById('res-ev-session').textContent = GLTUtils.formatEuro(res.sessionCost);
      document.getElementById('res-ev-energy').textContent = `${res.energyAddedKwh.toFixed(1)} kWh Added`;
      document.getElementById('res-ev-100k').textContent = `${GLTUtils.formatEuro(res.costPer100km)} / 100 km`;
      document.getElementById('res-ev-km').textContent = `${GLTUtils.formatEuro(res.costPerKm)} / km`;
      document.getElementById('res-ev-savings').textContent = `${GLTUtils.formatEuro(res.savingsPer100km)} / 100 km`;
    };

    [capIn, startIn, targetIn, tariffSelect, customPriceIn, consIn].forEach(el => {
      el.addEventListener('input', updateEV);
      el.addEventListener('change', updateEV);
    });
    updateEV();
  },

  // Tool 11: Public Holidays (Feiertage)
  renderHolidaysTool(container, tool) {
    const statesOpts = `
      <option value="ALL">${t('allStatesOption')}</option>
      ${GERMAN_STATES.map(s => `
        <option value="${s.code}" ${s.code === 'BE' ? 'selected' : ''}>${s.flagEmoji} ${s.nameDe} (${s.code})</option>
      `).join('')}
      <option value="BY-AUG">🏙️ Bayern - Augsburg (Stadt)</option>
    `;

    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="input-panel" style="margin-bottom:1.5rem;">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">${t('selectYear')}</label>
            <select id="hol-year" class="form-select">
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026" selected>2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">${t('selectState')}</label>
            <select id="hol-state" class="form-select">
              ${statesOpts}
            </select>
          </div>
        </div>
      </div>

      <div id="hol-special-banner" style="display:none; margin-bottom:1.5rem;"></div>

      <div class="card" style="margin-bottom:2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h2 id="hol-section-title" style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin:0;">
            ${t('holidaysTitle')}
          </h2>
          <span id="hol-count-badge" class="badge" style="background-color:var(--accent-light); color:var(--accent-primary); font-size:0.85rem; font-weight:600;"></span>
        </div>
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>German Holiday Name</th>
                <th>English / Korean</th>
                <th>${t('scopeHeader') || 'Scope'}</th>
              </tr>
            </thead>
            <tbody id="hol-table-body"></tbody>
          </table>
        </div>
      </div>

      <div id="hol-local-section" style="display:none; margin-bottom:2rem;">
        <div class="card" style="border:1px solid rgba(217,119,6,0.25); background:rgba(217,119,6,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <h3 style="font-size:1.1rem; font-weight:700; color:#d97706; margin:0 0 0.25rem 0;">
                📍 ${t('additionalLocalHolidaysTitle')}
              </h3>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">
                ${t('additionalLocalHolidaysDesc')}
              </p>
            </div>
            <span class="badge" style="background-color:rgba(217,119,6,0.15); color:#d97706; font-weight:600;">
              ${t('regionalNotice')}
            </span>
          </div>
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Holiday Name</th>
                  <th>${t('scopeHeader') || 'Scope'}</th>
                  <th>${t('applicableAreaHeader') || 'Applicable Area & Legal Basis'}</th>
                </tr>
              </thead>
              <tbody id="hol-local-table-body"></tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="info-box" style="margin-top:1.5rem; font-size:0.85rem; color:var(--text-muted); line-height:1.5;">
        <strong>⚖️ Statutory Basis & Source Reference:</strong>
        German public holidays are governed under state jurisdiction (Art. 74 Abs. 1 Nr. 12 GG) by individual state holiday acts (Landesfeiertagsgesetze, z.B. BayFTG, SächsSFG, FeiertG BE, FeiertagsG NW, SFG).
      </div>
    `;

    const yearSelect = document.getElementById('hol-year');
    const stateSelect = document.getElementById('hol-state');
    const bannerBox = document.getElementById('hol-special-banner');
    const sectionTitle = document.getElementById('hol-section-title');
    const countBadge = document.getElementById('hol-count-badge');
    const tbody = document.getElementById('hol-table-body');
    const localSection = document.getElementById('hol-local-section');
    const localTbody = document.getElementById('hol-local-table-body');

    const updateHolidays = () => {
      const year = parseInt(yearSelect.value, 10);
      const state = stateSelect.value;
      const breakdown = CalendarTools.getHolidaysBreakdown(year, state);
      const lang = currentLang;

      // Augsburg special banner
      if (breakdown.isAugsburg) {
        bannerBox.style.display = 'block';
        bannerBox.innerHTML = `
          <div class="alert-box" style="background:rgba(217, 119, 6, 0.1); border-left:4px solid #d97706; padding:1rem; border-radius:8px;">
            <strong>${t('augsburgSpecialBanner')}</strong>
          </div>
        `;
        sectionTitle.textContent = lang === 'ko'
          ? `아우크스부르크시 적용 공휴일 (${year})`
          : (lang === 'de' ? `Gesetzliche Feiertage in der Stadt Augsburg (${year})` : `Statutory Public Holidays in Augsburg (${year})`);
        countBadge.textContent = lang === 'ko' ? `총 14개 공휴일` : (lang === 'de' ? `14 gesetzliche Feiertage` : `14 Statutory Holidays`);
      } else if (state === 'ALL') {
        bannerBox.style.display = 'none';
        sectionTitle.textContent = lang === 'ko'
          ? `독일 전체 공휴일 및 지역별 현황 (${year})`
          : (lang === 'de' ? `Alle gesetzlichen Feiertage in Deutschland (${year})` : `All German Public Holidays & Regional Scopes (${year})`);
        countBadge.textContent = lang === 'ko' ? `전체 목록` : (lang === 'de' ? `Gesamtübersicht` : `Full Catalog`);
      } else {
        bannerBox.style.display = 'none';
        const stObj = GERMAN_STATES.find(s => s.code === state);
        const stName = stObj ? (lang === 'ko' ? stObj.nameKo : stObj.nameDe) : state;
        sectionTitle.textContent = lang === 'ko'
          ? `${stName} 주 전역 공휴일 (${year})`
          : (lang === 'de' ? `Landesweite gesetzliche Feiertage in ${stName} (${year})` : `Statewide Public Holidays in ${stName} (${year})`);
        countBadge.textContent = lang === 'ko'
          ? `주 전역 ${breakdown.totalStatewideCount}개`
          : (lang === 'de' ? `${breakdown.totalStatewideCount} Feiertage` : `${breakdown.totalStatewideCount} Statewide Holidays`);
      }

      const getScopeBadge = (h) => {
        if (h.localityScope === 'nationwide') {
          return `<span class="badge" style="background-color:rgba(37,99,235,0.15); color:#2563eb; font-weight:600;">🇩🇪 ${t('nationwideBadge')}</span>`;
        }
        if (h.localityScope === 'state') {
          return `<span class="badge" style="background-color:rgba(16,185,129,0.15); color:#10b981; font-weight:600;">🏛️ ${t('statewideBadge')} (${(h.states || []).join(', ')})</span>`;
        }
        if (h.localityScope === 'regional') {
          return `<span class="badge" style="background-color:rgba(245,158,11,0.15); color:#d97706; font-weight:600;">📍 ${t('regionalBadge')}</span>`;
        }
        if (h.localityScope === 'municipal') {
          return `<span class="badge" style="background-color:rgba(139,92,246,0.15); color:#8b5cf6; font-weight:600;">🏙️ ${t('municipalBadge')}</span>`;
        }
        return `<span class="badge" style="background-color:var(--bg-secondary); color:var(--text-muted);">${h.localityScope}</span>`;
      };

      // Populate primary table
      tbody.innerHTML = breakdown.statewideHolidays.map(h => {
        return `
          <tr style="${h.isUpcoming ? 'font-weight:600;' : 'opacity:0.85;'}">
            <td style="font-family:var(--font-mono);">${h.date}</td>
            <td>${h.dayOfWeek}</td>
            <td style="color:var(--text-primary); font-weight:600;">
              ${h.nameDe}
              ${h.localityScope === 'municipal' ? ' <span style="font-size:0.75rem; color:#8b5cf6;">(Augsburg)</span>' : ''}
            </td>
            <td>${lang === 'ko' ? h.nameKo : (lang === 'de' ? (h.nameEn ? `<span style="font-size:0.85rem; color:var(--text-muted);">EN: ${h.nameEn}</span>` : '') : h.nameEn)}</td>
            <td>${getScopeBadge(h)}</td>
          </tr>
        `;
      }).join('');

      // Populate additional local holidays section (if applicable)
      if (breakdown.hasLocalExceptions && breakdown.additionalLocalHolidays.length > 0) {
        localSection.style.display = 'block';
        localTbody.innerHTML = breakdown.additionalLocalHolidays.map(h => {
          const areaNote = lang === 'ko'
            ? (h.applicableScopeKo || h.applicableScopeDe || h.notesEn)
            : (lang === 'de' ? (h.applicableScopeDe || h.notesDe || h.applicableScopeEn) : (h.applicableScopeEn || h.notesEn || h.applicableScopeDe));
          return `
            <tr style="${h.isUpcoming ? 'font-weight:600;' : 'opacity:0.85;'}">
              <td style="font-family:var(--font-mono);">${h.date}</td>
              <td>${h.dayOfWeek}</td>
              <td style="color:var(--text-primary); font-weight:600;">
                ${h.nameDe}
                <div style="font-size:0.8rem; color:var(--text-secondary); font-weight:normal;">
                  ${lang === 'ko' ? h.nameKo : (lang === 'de' ? (h.nameEn ? `<span style="font-size:0.8rem; color:var(--text-muted);">EN: ${h.nameEn}</span>` : '') : h.nameEn)}
                </div>
              </td>
              <td>${getScopeBadge(h)}</td>
              <td style="font-size:0.85rem; color:var(--text-secondary);">
                <div>${areaNote}</div>
                <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.25rem;">⚖️ ${h.legalBasis || ''}</div>
              </td>
            </tr>
          `;
        }).join('');
      } else {
        localSection.style.display = 'none';
        localTbody.innerHTML = '';
      }
    };

    yearSelect.addEventListener('change', updateHolidays);
    stateSelect.addEventListener('change', updateHolidays);
    updateHolidays();
  },

  // Tool 12: Working Days Calculator
  renderWorkingDaysTool(container, tool) {
    const statesOpts = `
      ${GERMAN_STATES.map(s => `
        <option value="${s.code}" ${s.code === 'BE' ? 'selected' : ''}>${s.flagEmoji || ''} ${s.nameDe} (${s.code})</option>
      `).join('')}
      <option value="BY-AUG">🏙️ Bayern - Augsburg (Stadt)</option>
    `;

    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>📅 Date Range & Location</span></h2>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('startDate')}</label>
              <input type="date" id="work-start" class="form-input" value="2026-01-01">
            </div>
            <div class="form-group">
              <label class="form-label">${t('endDate')}</label>
              <input type="date" id="work-end" class="form-input" value="2026-12-31">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">${t('bundesland')}</label>
            <select id="work-state" class="form-select">${statesOpts}</select>
          </div>
          <div class="form-group">
            <label class="form-label" style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" id="work-excl-holidays" checked style="width:1.1rem; height:1.1rem;">
              <span>${t('excludeHolidays')}</span>
            </label>
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('netWorkingDays')}</div>
            <div id="res-work-net" class="result-hero-amount">0</div>
            <div id="res-work-sub" class="result-hero-sub">${t('workingDaysHeroSub') || 'Contractual Working Days (Mo–Fr)'}</div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-row">
              <span class="breakdown-label">${t('calendarDays')}</span>
              <span id="res-work-cal" class="breakdown-value">0</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('weekendDays')}</span>
              <span id="res-work-weekends" class="breakdown-value negative">- 0</span>
            </div>
            <div class="breakdown-row" style="font-size:0.85rem; padding-left:1rem; opacity:0.85;">
              <span class="breakdown-label">↳ ${t('saturdaysCount')}</span>
              <span id="res-work-saturdays" class="breakdown-value">0</span>
            </div>
            <div class="breakdown-row" style="font-size:0.85rem; padding-left:1rem; opacity:0.85;">
              <span class="breakdown-label">↳ ${t('sundaysCount')}</span>
              <span id="res-work-sundays" class="breakdown-value">0</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('weekdayHolidaysCount')}</span>
              <span id="res-work-hol-weekday" class="breakdown-value negative">- 0</span>
            </div>
            <div class="breakdown-row" style="font-size:0.85rem; padding-left:1rem; opacity:0.85;">
              <span class="breakdown-label">↳ ${t('publicHolidaysTotal')}</span>
              <span id="res-work-hol-total" class="breakdown-value">0</span>
            </div>
            <div class="breakdown-row" style="font-size:0.85rem; padding-left:1rem; opacity:0.85;">
              <span class="breakdown-label">↳ ${t('weekendHolidaysCount')}</span>
              <span id="res-work-hol-weekend" class="breakdown-value" style="color:var(--text-muted);">0</span>
            </div>
          </div>
        </div>
      </div>

      <div class="info-box" style="margin-top:1.5rem; font-size:0.85rem; color:var(--text-muted); line-height:1.5;">
        ⚖️ <strong>${t('workingDaysLegalNote')}</strong>
      </div>
    `;

    const startIn = document.getElementById('work-start');
    const endIn = document.getElementById('work-end');
    const stateIn = document.getElementById('work-state');
    const exclIn = document.getElementById('work-excl-holidays');

    const updateWork = () => {
      const res = CalendarTools.calculateWorkingDays(startIn.value, endIn.value, stateIn.value, exclIn.checked);
      document.getElementById('res-work-net').textContent = res.workingDays;
      document.getElementById('res-work-cal').textContent = res.calendarDays;
      document.getElementById('res-work-weekends').textContent = `- ${res.weekendDays}`;
      document.getElementById('res-work-saturdays').textContent = res.saturdayDays;
      document.getElementById('res-work-sundays').textContent = res.sundayDays;
      document.getElementById('res-work-hol-weekday').textContent = exclIn.checked ? `- ${res.weekdayHolidayDays}` : '0';
      document.getElementById('res-work-hol-total').textContent = res.publicHolidayDays;
      document.getElementById('res-work-hol-weekend').textContent = `${res.weekendHolidayDays} (no double deduction)`;
    };

    [startIn, endIn, stateIn, exclIn].forEach(el => {
      el.addEventListener('input', updateWork);
      el.addEventListener('change', updateWork);
    });
    updateWork();
  },

  // Tool 13: Vacation Planner & Brückentage
  renderVacationTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>🏖️ Vacation Balance</span></h2>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('annualEntitlement')}</label>
              <input type="number" id="vac-total" class="form-input" value="30" min="20">
            </div>
            <div class="form-group">
              <label class="form-label">${t('daysAlreadyUsed')}</label>
              <input type="number" id="vac-used" class="form-input" value="12" min="0">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('plannedLeaveStart')}</label>
              <input type="date" id="vac-start" class="form-input" value="2026-05-18">
            </div>
            <div class="form-group">
              <label class="form-label">${t('plannedLeaveEnd')}</label>
              <input type="date" id="vac-end" class="form-input" value="2026-05-22">
            </div>
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('remainingLeave')}</div>
            <div id="res-vac-rem" class="result-hero-amount">0</div>
            <div class="result-hero-sub">Days Remaining</div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-row">
              <span class="breakdown-label">${t('annualEntitlement')}</span>
              <span id="res-vac-total-echo" class="breakdown-value">0</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('daysAlreadyUsed')}</span>
              <span id="res-vac-used-echo" class="breakdown-value negative">- 0</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('daysNeededForTrip')}</span>
              <span id="res-vac-needed" class="breakdown-value negative">- 0</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <div class="info-panel">
            <h3 class="panel-title">💡 ${t('bridgeDayTipTitle')}</h3>
            <p style="font-size:0.9375rem; color:var(--text-secondary); line-height:1.6;">
              ${t('bridgeDayTipText')}
            </p>
          </div>
        </div>
      </div>
    `;

    const totIn = document.getElementById('vac-total');
    const usedIn = document.getElementById('vac-used');
    const startIn = document.getElementById('vac-start');
    const endIn = document.getElementById('vac-end');

    const updateVac = () => {
      const res = CalendarTools.calculateVacation(totIn.value, usedIn.value, startIn.value, endIn.value, "BE");
      document.getElementById('res-vac-rem').textContent = res.remaining;
      document.getElementById('res-vac-total-echo').textContent = res.annualTotal;
      document.getElementById('res-vac-used-echo').textContent = `- ${res.alreadyTaken}`;
      document.getElementById('res-vac-needed').textContent = `- ${res.neededForTrip}`;
    };

    [totIn, usedIn, startIn, endIn].forEach(el => el.addEventListener('input', updateVac));
    updateVac();
  },

  // Tool 14: Child Benefit (Kindergeld)
  renderKindergeldTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>👶 Child Benefit Calculator</span></h2>
          <div class="form-group">
            <label class="form-label">${t('numKidsInput')}</label>
            <input type="number" id="kg-children" class="form-input" value="2" min="1" max="15">
          </div>
          <div class="notice-box" style="background-color:var(--accent-light); border-color:var(--accent-primary);">
            💶 <b>Current 2026 Rate:</b> <span style="font-size:1.125rem; font-weight:800; color:var(--accent-primary);">259 € / month</span> (${t('perChildMonthly')})
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('monthlyKindergeldTotal')}</div>
            <div id="res-kg-monthly" class="result-hero-amount">€ 0,00</div>
            <div id="res-kg-annual" class="result-hero-sub" style="font-size:1rem; font-weight:600; color:var(--text-primary); margin-top:0.3rem;">${t('annualKindergeldTotal')}: € 0,00</div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-row" style="color:var(--text-secondary);">
              <span class="breakdown-label">${currentLang === 'ko' ? '2023–2024년 이전 기준 (250 €/인)' : (currentLang === 'de' ? '2023–2024 Frühere Basis (250 €/Kind)' : '2023–2024 Past Baseline (250 €/child)')}</span>
              <span id="res-kg-past-echo" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row" style="color:var(--text-secondary);">
              <span class="breakdown-label">${currentLang === 'ko' ? '2025년 이전 수령액 (255 €/인)' : (currentLang === 'de' ? '2025 Früherer Betrag (255 €/Kind)' : '2025 Past Amount (255 €/child)')}</span>
              <span id="res-kg-2025-echo" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row" style="font-weight:700; color:var(--success-color);">
              <span class="breakdown-label">${currentLang === 'ko' ? '2026년 법정 확정 수령액 (259 €/인)' : (currentLang === 'de' ? 'Gesetzlicher Satz 2026 (259 €/Kind)' : '2026 Current Enacted Rate (259 €/child)')}</span>
              <span id="res-kg-curr-echo" class="breakdown-value positive">€ 0,00</span>
            </div>
            <div class="breakdown-row" style="color:var(--accent-primary);">
              <span class="breakdown-label">${t('kindergeldAnnounced2027Label')}</span>
              <span id="res-kg-2027-echo" class="breakdown-value" style="color:var(--accent-primary);">€ 0,00</span>
            </div>
            <div class="breakdown-row total-row" style="color:var(--accent-primary);">
              <span class="breakdown-label">${t('kindergeldAnnounced2028Label')}</span>
              <span id="res-kg-2028-echo" class="breakdown-value" style="color:var(--accent-primary);">€ 0,00</span>
            </div>
          </div>
        </div>

        <!-- Timeline & Historical Rates Section -->
        <div class="info-section">
          <div class="info-panel" style="margin-bottom:1.5rem;">
            <h3 class="panel-title">📈 ${t('kindergeldTimelineTitle')}</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin-bottom:0.75rem;">
              ${currentLang === 'ko'
                ? '독일 연방정부(BMF / Familienkasse)에 따른 아동수당(Kindergeld)은 <b>2026년 기준 법정 확정 월 259유로</b>입니다. 향후 일정에 대해 <b>2027년 월 267유로</b> 및 <b>2028년 월 272유로</b> 인상안이 공식 발표/추진 중입니다.'
                : (currentLang === 'de'
                  ? 'Nach offiziellen Vorgaben (BMF / Familienkasse) beträgt das gesetzliche Kindergeld <b>im Jahr 2026 monatlich 259 € pro Kind</b>. Für 2027 ist eine Anhebung auf <b>267 €/Monat</b> und für 2028 auf <b>272 €/Monat</b> geplant (Regierungsentwurf).'
                  : 'According to official guidelines (BMF / Familienkasse), German child benefit (Kindergeld) is legally enacted at <b>€259 per month per child for 2026</b>. Government proposals have announced planned increases to <b>€267/month for 2027</b> and <b>€272/month for 2028</b>.')}
            </p>
            <div class="notice-box" style="margin-bottom:1rem; font-size:0.8125rem;">
              <strong>🏛️ ${currentLang === 'ko' ? '법적 상태 및 출처' : (currentLang === 'de' ? 'Gesetzlicher Status & Quelle' : 'Legal Status & Source')} (BMF / Familienkasse):</strong>
              ${currentLang === 'ko'
                ? '과거 및 2026년 수령액(259 €)은 법률로 확정된(Enacted) 기준입니다. 2027년(267 €) 및 2028년(272 €) 금액은 정부 발표/법안 기준 추진안(announced / proposed)이며, 최종 의회 입법 절차 완료 전까지는 법적 확정 수치가 아닙니다.'
                : (currentLang === 'de'
                  ? 'Die Sätze der Vorjahre sowie für 2026 (259 €) sind gesetzlich beschlossen. Die künftigen Sätze für 2027 (267 €) und 2028 (272 €) sind angekündigte Vorhaben unter Vorbehalt der gesetzgeberischen Verabschiedung.'
                  : 'Past rates and the 2026 rate (€259) are legally enacted. Future rates for 2027 (€267) and 2028 (€272) are announced / proposed figures subject to final parliamentary enactment.')}
            </div>
            <div class="data-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>${currentLang === 'ko' ? '연도 / 기간' : (currentLang === 'de' ? 'Zeitraum' : 'Period')}</th>
                    <th>${currentLang === 'ko' ? '자녀 1인당 월 지급액' : (currentLang === 'de' ? 'Monatlicher Satz pro Kind' : 'Monthly Rate per Child')}</th>
                    <th id="th-kg-family-col">${currentLang === 'ko' ? '우리가구 월 수령액' : (currentLang === 'de' ? 'Auszahlungsbetrag Familie' : 'Monthly Payout for Family')}</th>
                    <th>${currentLang === 'ko' ? '법적 상태' : (currentLang === 'de' ? 'Status' : 'Status')}</th>
                  </tr>
                </thead>
                <tbody id="kg-timeline-tbody"></tbody>
              </table>
            </div>
          </div>

          <div class="info-panel">
            <h3 class="panel-title">📖 ${t('kindergeldEligibilityTitle')}</h3>
            <div style="font-size:0.875rem; color:var(--text-secondary); line-height:1.7; margin-bottom:1rem;">
              ${t('kindergeldEligibilityText')}
            </div>
            <div class="notice-box">
              ⚖️ ${t('kindergeldVsFreibetrag')}
            </div>
          </div>
        </div>
      </div>
    `;

    const kidsIn = document.getElementById('kg-children');
    const updateKG = () => {
      const res = FamilyTools.calculateKindergeld(kidsIn.value);
      const count = res.numChildren;
      const lang = currentLang;

      document.getElementById('res-kg-monthly').textContent = GLTUtils.formatEuro(res.monthlyTotal);
      document.getElementById('res-kg-annual').textContent = `${t('annualKindergeldTotal')}: ${GLTUtils.formatEuro(res.annualTotal)}`;

      document.getElementById('res-kg-past-echo').textContent = `${GLTUtils.formatEuro(count * 250)} / mo`;
      document.getElementById('res-kg-2025-echo').textContent = `${GLTUtils.formatEuro(count * 255)} / mo`;
      document.getElementById('res-kg-curr-echo').textContent = `${GLTUtils.formatEuro(res.monthlyTotal)} / mo`;
      document.getElementById('res-kg-2027-echo').textContent = `${GLTUtils.formatEuro(count * 267)} / mo (+${GLTUtils.formatEuro(count * 8)}/mo)`;
      document.getElementById('res-kg-2028-echo').textContent = `${GLTUtils.formatEuro(count * 272)} / mo (+${GLTUtils.formatEuro(count * 13)}/mo)`;

      const thFam = document.getElementById('th-kg-family-col');
      if (thFam) {
        thFam.textContent = lang === 'ko' ? `자녀 ${count}명 가구 월 수령액` : (lang === 'de' ? `Monatlicher Betrag für ${count} Kind${count > 1 ? 'er' : ''}` : `Monthly Payout for ${count} Child${count > 1 ? 'ren' : ''}`);
      }

      const tbody = document.getElementById('kg-timeline-tbody');
      if (tbody) {
        let lastCategory = null;
        let rowsHtml = '';

        res.timelineComparison.forEach(item => {
          // Insert category separator row if transitioning between enacted and announced
          if (item.statusCategory !== lastCategory) {
            lastCategory = item.statusCategory;
            const categoryTitle = item.statusCategory === 'enacted'
              ? (lang === 'ko' ? '📌 법정 확정 지급액 (Enacted / Current Rates)' : (lang === 'de' ? '📌 Gesetzlich beschlossene Sätze' : '📌 Enacted / Current Rates'))
              : (lang === 'ko' ? '📢 향후 인상 발표/추진안 (Announced Future Changes — Pending Enactment)' : (lang === 'de' ? '📢 Künftige Vorhaben (Regierungsentwurf)' : '📢 Announced Future Changes (Pending Enactment)'));
            rowsHtml += `
              <tr style="background-color:var(--bg-secondary); border-top:2px solid var(--border-subtle); border-bottom:1px solid var(--border-subtle);">
                <td colspan="4" style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted); padding:0.5rem 0.75rem;">
                  ${categoryTitle}
                </td>
              </tr>
            `;
          }

          let rowStyle = "";
          let badge = "";

          if (item.isCurrent) {
            rowStyle = "background-color: rgba(16, 185, 129, 0.08); font-weight:700;";
            badge = `<span class="badge" style="background-color:var(--success-light); color:var(--success-color); font-weight:700;">${lang === 'ko' ? '★ 법정 확정 / 현재 (2026)' : (lang === 'de' ? '★ Gesetzlich gültig (2026)' : '★ Enacted / Current Rate (2026)')}</span>`;
          } else if (item.statusCategory === 'announced') {
            rowStyle = "background-color: rgba(99, 102, 241, 0.08); font-weight:600;";
            badge = `<span class="badge" style="background-color:var(--accent-light); color:var(--accent-primary); font-weight:600;">${lang === 'ko' ? item.statusKo : (lang === 'de' ? (item.statusDe || item.statusEn) : item.statusEn)}</span>`;
          } else {
            badge = `<span class="badge" style="background-color:var(--bg-secondary); color:var(--text-muted);">${lang === 'ko' ? '이전 확정' : (lang === 'de' ? 'Früherer Satz' : 'Past Enacted')}</span>`;
          }

          rowsHtml += `
            <tr style="${rowStyle}">
              <td style="font-weight:600;">${lang === 'ko' ? item.periodKo : (lang === 'de' ? (item.periodDe || item.periodEn) : item.periodEn)}</td>
              <td style="font-family:var(--font-mono);">${lang === 'ko' ? item.rateDescKo : (lang === 'de' ? (item.rateDescDe || item.rateDescEn) : item.rateDescEn)}</td>
              <td style="font-family:var(--font-mono); font-weight:700; ${item.isCurrent ? 'color:var(--success-color);' : item.isFuture ? 'color:var(--accent-primary);' : ''}">
                ${GLTUtils.formatEuro(item.monthlyFamilyTotal)} / mo (${GLTUtils.formatEuro(item.annualFamilyTotal)} / yr)
              </td>
              <td>${badge}</td>
            </tr>
          `;
        });

        tbody.innerHTML = rowsHtml;
      }
    };

    kidsIn.addEventListener('input', updateKG);
    updateKG();
  },

  // Tool 15: School Holidays
  renderSchoolHolidaysTool(container, tool) {
    const statesOpts = GERMAN_STATES.map(s => `
      <option value="${s.code}" ${s.code === 'BE' ? 'selected' : ''}>${s.nameDe}</option>
    `).join('');

    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="input-panel" style="margin-bottom:1.5rem;">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">${t('selectYear')}</label>
            <select id="sch-year" class="form-select">
              <optgroup label="${currentLang === 'ko' ? '달력 연도 (Calendar Year)' : (currentLang === 'de' ? 'Kalenderjahr' : 'Calendar Year')}">
                <option value="2026" selected>2026</option>
                <option value="2025">2025</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </optgroup>
              <optgroup label="${currentLang === 'ko' ? '학사년도 (School Year / Schuljahr)' : (currentLang === 'de' ? 'Schuljahr' : 'School Year (Schuljahr)')}">
                <option value="2025/2026">2025/2026</option>
                <option value="2026/2027">2026/2027</option>
                <option value="2027/2028">2027/2028</option>
                <option value="2024/2025">2024/2025</option>
                <option value="2028/2029">2028/2029</option>
              </optgroup>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">${t('selectState')}</label>
            <select id="sch-state" class="form-select">${statesOpts}</select>
          </div>
        </div>
      </div>

      <div id="sch-meta-banner" style="margin-bottom:1rem; display:none;"></div>

      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>${t('holidayPeriod')}</th>
              <th>${t('dates')}</th>
            </tr>
          </thead>
          <tbody id="sch-table-body"></tbody>
        </table>
      </div>

      <div id="sch-footnotes" style="margin-top:1rem; font-size:0.8125rem; color:var(--text-muted); line-height:1.6;"></div>
    `;

    const yrIn = document.getElementById('sch-year');
    const stIn = document.getElementById('sch-state');
    const metaBanner = document.getElementById('sch-meta-banner');
    const footnotesEl = document.getElementById('sch-footnotes');

    const updateSch = () => {
      const val = yrIn.value;
      const res = FamilyTools.getSchoolHolidaysForState(val, stIn.value);
      const tbody = document.getElementById('sch-table-body');
      const lang = currentLang;

      if (!res || res.unavailable || !Array.isArray(res) || res.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="2" style="text-align:center; padding:2rem; color:var(--text-muted);">
              ⚠️ ${lang === 'ko' 
                ? (res && res.messageKo ? res.messageKo : '선택한 연도의 공식 KMK 방학 데이터가 없습니다.')
                : (lang === 'de'
                  ? (res && res.messageDe ? res.messageDe : 'Für das ausgewählte Jahr liegen keine offiziellen KMK-Feriendaten vor.')
                  : (res && res.messageEn ? res.messageEn : 'Official KMK school holiday data is unavailable for the selected year.'))}
            </td>
          </tr>
        `;
        metaBanner.style.display = 'none';
        footnotesEl.innerHTML = '';
        return;
      }

      metaBanner.style.display = 'flex';
      metaBanner.style.flexWrap = 'wrap';
      metaBanner.style.gap = '0.5rem';
      metaBanner.style.alignItems = 'center';

      let badgesHtml = `<span class="badge" style="background-color:var(--accent-light); color:var(--accent-primary); font-weight:600;">🏛️ KMK Official</span>`;
      if (res.movableDays > 0) {
        badgesHtml += `<span class="badge" style="background-color:var(--bg-secondary); color:var(--text-secondary); border:1px solid var(--border-subtle);">
          ${lang === 'ko' ? `이동식 자율휴교일(Bewegliche Ferientage): ${res.movableDays}일` : (lang === 'de' ? `Bewegliche Ferientage: ${res.movableDays} Tage` : `Movable school-free days: ${res.movableDays}`)}
        </span>`;
      }
      metaBanner.innerHTML = badgesHtml;

      tbody.innerHTML = res.map(h => {
        const title = lang === 'ko' ? (h.nameKo || h.nameEn) : h.nameDe;
        const sub = lang === 'ko' ? ` (${h.nameDe})` : (lang === 'de' ? '' : ` (${h.nameEn})`);
        const singleDayBadge = h.isSingleDay ? ` <span class="badge" style="background-color:var(--bg-secondary); color:var(--text-muted); font-size:0.65rem;">${lang === 'ko' ? '단일 휴교일' : (lang === 'de' ? 'Einzelner Ferientag' : 'Single day')}</span>` : '';
        return `
        <tr>
          <td style="font-weight:600; color:var(--text-primary);">${title}${sub}${singleDayBadge}</td>
          <td style="font-family:var(--font-mono);">${h.start} ~ ${h.end}</td>
        </tr>
      `;
      }).join('');

      let fnText = `
        <div style="border-top:1px solid var(--border-subtle); padding-top:0.75rem; display:flex; flex-direction:column; gap:0.35rem;">
          <div>🏛️ <b>${lang === 'ko' ? '공식 출처' : (lang === 'de' ? 'Offizielle Quelle' : 'Official Source')}:</b> <a href="https://www.kmk.org/service/ferienregelung/ferienkalender.html" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary); text-decoration:underline;">Kultusministerkonferenz (KMK) Ferienkalender</a> • ${lang === 'ko' ? '최종 검증: 2026-09-16' : (lang === 'de' ? 'Zuletzt geprüft: 16.09.2026' : 'Last verified: 2026-09-16')}</div>
          <div>ℹ️ ${lang === 'ko' ? '각 기간의 시작일과 종료일은 모두 방학에 포함되는 첫날과 마지막 날입니다.' : (lang === 'de' ? 'Die angegebenen Termine umfassen jeweils den ersten und letzten Ferientag (einschließlich).' : 'Dates specify the first and last vacation days inclusive.')}</div>
          ${res.footnote ? `<div style="color:var(--warning-color); font-weight:500;">📌 <b>${lang === 'ko' ? '지역 특례' : (lang === 'de' ? 'Besonderer Hinweis' : 'Special Note')}:</b> ${res.footnote}</div>` : ''}
        </div>
      `;
      footnotesEl.innerHTML = fnText;
    };

    yrIn.addEventListener('change', updateSch);
    stIn.addEventListener('change', updateSch);
    updateSch();
  },

  // Tool 16: Date Difference Calculator
  renderDateDiffTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>⏳ Select Dates</span></h2>
          <div class="form-group">
            <label class="form-label">${t('dateOne')}</label>
            <input type="date" id="dd-start" class="form-input" value="2024-01-01">
          </div>
          <div class="form-group">
            <label class="form-label">${t('dateTwo')}</label>
            <input type="date" id="dd-end" class="form-input" value="2025-09-15">
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('totalDays')}</div>
            <div id="res-dd-days" class="result-hero-amount">0</div>
            <div id="res-dd-sub" class="result-hero-sub">0 Years, 0 Months, 0 Days</div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-row">
              <span class="breakdown-label">${t('totalWeeks')}</span>
              <span id="res-dd-weeks" class="breakdown-value">0 weeks</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('totalMonths')}</span>
              <span id="res-dd-months" class="breakdown-value">0 months</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const d1In = document.getElementById('dd-start');
    const d2In = document.getElementById('dd-end');

    const updateDD = () => {
      const res = EverydayTools.calculateDateDiff(d1In.value, d2In.value);
      if (!res) return;
      document.getElementById('res-dd-days').textContent = `${res.totalDays} Days`;
      document.getElementById('res-dd-sub').textContent = `${res.years} Years, ${res.months} Months, ${res.days} Days`;
      document.getElementById('res-dd-weeks').textContent = `${res.totalWeeks} Weeks and ${res.remDaysAfterWeeks} Days`;
      document.getElementById('res-dd-months').textContent = `${res.totalMonthsApprox} Months`;
    };

    d1In.addEventListener('input', updateDD);
    d2In.addEventListener('input', updateDD);
    updateDD();
  },

  // Tool 17: Age Calculator
  renderAgeCalcTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>🎂 Date of Birth</span></h2>
          <div class="form-group">
            <label class="form-label">${t('birthDate')}</label>
            <input type="date" id="age-birth" class="form-input" value="1995-05-15">
          </div>
        </div>

        <div class="result-panel">
          <div class="panel-title"><span>📊 ${t('resultsHeading')}</span></div>
          <div class="result-hero">
            <div class="result-hero-label">${t('exactAge')}</div>
            <div id="res-age-years" class="result-hero-amount">0 Years</div>
            <div id="res-age-sub" class="result-hero-sub">0 Months, 0 Days</div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-row">
              <span class="breakdown-label">${t('totalDaysLived')}</span>
              <span id="res-age-days-lived" class="breakdown-value">0</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('nextBirthday')}</span>
              <span id="res-age-next" class="breakdown-value positive">0 days</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('bornOnDay')}</span>
              <span id="res-age-born-day" class="breakdown-value">-</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const bIn = document.getElementById('age-birth');
    const updateAge = () => {
      const res = EverydayTools.calculateAge(bIn.value);
      if (!res) return;
      document.getElementById('res-age-years').textContent = `${res.years} Years`;
      document.getElementById('res-age-sub').textContent = `${res.months} Months, ${res.days} Days`;
      document.getElementById('res-age-days-lived').textContent = `${res.totalDaysLived.toLocaleString()} Days`;
      document.getElementById('res-age-next').textContent = `In ${res.daysUntilNextBday} Days`;
      document.getElementById('res-age-born-day').textContent = res.dayOfWeek;
    };

    bIn.addEventListener('input', updateAge);
    updateAge();
  },

  // Tool 18: Percentage Calculator
  renderPercentageTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
        <!-- Mode 1 -->
        <div class="input-panel">
          <h3 style="font-size:0.9375rem; font-weight:700; margin-bottom:1rem;">${t('mode1Title')}</h3>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
            <span>What is</span>
            <input type="number" id="p1-x" class="form-input" style="width:80px;" value="19">
            <span>% of</span>
            <input type="number" id="p1-y" class="form-input" style="width:100px;" value="250">
          </div>
          <div class="result-hero" style="padding:0.75rem; margin-bottom:0;">
            <div id="res-p1" class="result-hero-amount" style="font-size:1.5rem;">47.5</div>
          </div>
        </div>

        <!-- Mode 2 -->
        <div class="input-panel">
          <h3 style="font-size:0.9375rem; font-weight:700; margin-bottom:1rem;">${t('mode2Title')}</h3>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
            <input type="number" id="p2-x" class="form-input" style="width:80px;" value="35">
            <span>is what % of</span>
            <input type="number" id="p2-y" class="form-input" style="width:100px;" value="140">
          </div>
          <div class="result-hero" style="padding:0.75rem; margin-bottom:0;">
            <div id="res-p2" class="result-hero-amount" style="font-size:1.5rem;">25 %</div>
          </div>
        </div>

        <!-- Mode 3 -->
        <div class="input-panel">
          <h3 style="font-size:0.9375rem; font-weight:700; margin-bottom:1rem;">${t('mode3Title')}</h3>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
            <span>From</span>
            <input type="number" id="p3-x" class="form-input" style="width:90px;" value="1000">
            <span>to</span>
            <input type="number" id="p3-y" class="form-input" style="width:90px;" value="1250">
          </div>
          <div class="result-hero" style="padding:0.75rem; margin-bottom:0;">
            <div id="res-p3" class="result-hero-amount" style="font-size:1.5rem;">+ 25 %</div>
          </div>
        </div>
      </div>
    `;

    const updateP1 = () => {
      const x = parseFloat(document.getElementById('p1-x').value || 0);
      const y = parseFloat(document.getElementById('p1-y').value || 0);
      document.getElementById('res-p1').textContent = EverydayTools.calcPercentMode1(x, y).toFixed(2);
    };
    const updateP2 = () => {
      const x = parseFloat(document.getElementById('p2-x').value || 0);
      const y = parseFloat(document.getElementById('p2-y').value || 0);
      document.getElementById('res-p2').textContent = `${EverydayTools.calcPercentMode2(x, y).toFixed(2)} %`;
    };
    const updateP3 = () => {
      const x = parseFloat(document.getElementById('p3-x').value || 0);
      const y = parseFloat(document.getElementById('p3-y').value || 0);
      const res = EverydayTools.calcPercentMode3(x, y);
      document.getElementById('res-p3').textContent = `${res >= 0 ? '+' : ''}${res.toFixed(2)} %`;
    };

    ['p1-x', 'p1-y'].forEach(id => document.getElementById(id).addEventListener('input', updateP1));
    ['p2-x', 'p2-y'].forEach(id => document.getElementById(id).addEventListener('input', updateP2));
    ['p3-x', 'p3-y'].forEach(id => document.getElementById(id).addEventListener('input', updateP3));
    updateP1(); updateP2(); updateP3();
  },

  // Tool 19: Unit Converter
  renderUnitConverterTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
        <!-- Area / Apartment -->
        <div class="input-panel">
          <h3 class="panel-title"><span>📐 ${t('areaApartment')}</span></h3>
          <div class="form-group">
            <label class="form-label">Square Meters (m²)</label>
            <input type="number" id="uc-m2" class="form-input" value="75">
          </div>
          <div class="result-hero" style="padding:0.75rem;">
            <div id="res-uc-sqft" style="font-weight:700; color:var(--text-primary); font-size:1.125rem;">807.3 sq ft</div>
            <div id="res-uc-pyeong" style="font-size:0.875rem; color:var(--accent-primary);">22.7 평 (Pyeong)</div>
          </div>
        </div>

        <!-- Distance -->
        <div class="input-panel">
          <h3 class="panel-title"><span>🚗 ${t('lengthDist')}</span></h3>
          <div class="form-group">
            <label class="form-label">Kilometers (km)</label>
            <input type="number" id="uc-km" class="form-input" value="100">
          </div>
          <div class="result-hero" style="padding:0.75rem;">
            <div id="res-uc-miles" style="font-weight:700; color:var(--text-primary); font-size:1.125rem;">62.1 Miles</div>
          </div>
        </div>

        <!-- Temperature -->
        <div class="input-panel">
          <h3 class="panel-title"><span>🌡️ ${t('temperature')}</span></h3>
          <div class="form-group">
            <label class="form-label">Celsius (°C)</label>
            <input type="number" id="uc-c" class="form-input" value="22">
          </div>
          <div class="result-hero" style="padding:0.75rem;">
            <div id="res-uc-f" style="font-weight:700; color:var(--text-primary); font-size:1.125rem;">71.6 °F</div>
          </div>
        </div>
      </div>
    `;

    const m2In = document.getElementById('uc-m2');
    const updateM2 = () => {
      const res = EverydayTools.convertUnit('area', m2In.value, 'm2');
      document.getElementById('res-uc-sqft').textContent = `${res.sqft.toFixed(1)} sq ft`;
      document.getElementById('res-uc-pyeong').textContent = `${res.pyeong.toFixed(1)} 평 (Pyeong)`;
    };
    m2In.addEventListener('input', updateM2);
    updateM2();

    const kmIn = document.getElementById('uc-km');
    const updateKm = () => {
      const res = EverydayTools.convertUnit('length', kmIn.value, 'km');
      document.getElementById('res-uc-miles').textContent = `${res.miles.toFixed(1)} Miles`;
    };
    kmIn.addEventListener('input', updateKm);
    updateKm();

    const cIn = document.getElementById('uc-c');
    const updateC = () => {
      const res = EverydayTools.convertUnit('temperature', cIn.value, 'c');
      document.getElementById('res-uc-f').textContent = `${res.f.toFixed(1)} °F`;
    };
    cIn.addEventListener('input', updateC);
    updateC();
  },

  // Tool 20: Address & PLZ Helper
  renderAddressPLZTool(container, tool) {
    const lang = currentLang;
    const rows = GERMAN_STATES.map(s => `
      <tr>
        <td style="font-weight:700; color:var(--text-primary);">${s.flagEmoji} ${s.nameDe}</td>
        <td>${s.capital}</td>
        <td>${s.population}</td>
        <td>${s.majorCities.slice(0, 3).join(', ')}</td>
        <td style="font-family:var(--font-mono);">${s.plzRanges.join(', ')}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="info-panel" style="margin-bottom:1.5rem;">
        <h3 class="panel-title">📮 ${t('addressGuideTitle')}</h3>
        <div style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6;">
          ${t('addressGuideText')}
        </div>
      </div>

      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>${t('stateCol')}</th>
              <th>${t('capitalCol')}</th>
              <th>${t('popCol')}</th>
              <th>${t('majorCitiesCol')}</th>
              <th>${t('plzRangeCol')}</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  // Tool 21: German Glossary & Abbreviations
  renderGlossaryTool(container, tool) {
    container.innerHTML = `
      <div class="tool-topbar">
        <a href="#" class="btn-back">${t('backToDashboard')}</a>
      </div>
      <div class="tool-headline">
        <h1 class="tool-page-title">${tool.icon} ${tool.title[currentLang]}</h1>
        <p class="tool-page-subtitle">${tool.desc[currentLang]}</p>
      </div>

      <div class="input-panel" style="margin-bottom:1.5rem;">
        <div class="form-row">
          <div class="form-group" style="margin-bottom:0;">
            <input type="text" id="glossary-search" class="form-input" placeholder="${t('searchGlossary')}">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <select id="glossary-cat" class="form-select">
              <option value="all">${t('allGlossaryCats')}</option>
              <option value="bureaucracy">${t('catBureaucracy')}</option>
              <option value="housing">${t('catHousing')}</option>
              <option value="tax">${t('catTax')}</option>
              <option value="work">${t('catWork')}</option>
              <option value="health">${t('catHealth')}</option>
              <option value="transport">${t('catTransport')}</option>
              <option value="everyday">${t('catEveryday')}</option>
            </select>
          </div>
        </div>
      </div>

      <div id="glossary-list" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.25rem;"></div>
    `;

    const searchIn = document.getElementById('glossary-search');
    const catIn = document.getElementById('glossary-cat');
    const listEl = document.getElementById('glossary-list');

    const updateGlossary = () => {
      const q = searchIn.value.trim().toLowerCase();
      const cat = catIn.value;
      const lang = currentLang;

      const filtered = GERMAN_GLOSSARY.filter(item => {
        if (cat !== 'all' && item.category !== cat) return false;
        if (!q) return true;
        return item.term.toLowerCase().includes(q) ||
               item.en.toLowerCase().includes(q) ||
               item.ko.toLowerCase().includes(q);
      });

      if (filtered.length === 0) {
        listEl.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:2rem;">${t('noResults')}</p>`;
        return;
      }

      const getClassificationStyle = (cls) => {
        switch (cls) {
          case 'legal_requirement':
            return 'background-color:rgba(239, 68, 68, 0.12); color:#dc2626; border:1px solid rgba(239, 68, 68, 0.3);';
          case 'statutory_definition':
            return 'background-color:rgba(59, 130, 246, 0.12); color:#2563eb; border:1px solid rgba(59, 130, 246, 0.3);';
          case 'common_practice':
            return 'background-color:rgba(245, 158, 11, 0.12); color:#d97706; border:1px solid rgba(245, 158, 11, 0.3);';
          case 'recommendation':
            return 'background-color:rgba(16, 185, 129, 0.12); color:#059669; border:1px solid rgba(16, 185, 129, 0.3);';
          case 'informal_term':
          default:
            return 'background-color:var(--bg-secondary); color:var(--text-muted); border:1px solid var(--border-subtle);';
        }
      };

      const deClassMap = {
        legal_requirement: 'Gesetzliche Pflicht',
        statutory_definition: 'Gesetzliche Definition',
        common_practice: 'Übliche Praxis',
        recommendation: 'Empfehlung',
        informal_term: 'Umgangssprachlich'
      };

      listEl.innerHTML = filtered.map(item => {
        const classLabel = lang === 'ko'
          ? (item.classificationKo || item.classification)
          : (lang === 'de'
            ? (item.classificationDe || deClassMap[item.classification] || item.classificationEn || item.classification)
            : (item.classificationEn || item.classification));
        const classStyle = getClassificationStyle(item.classification);
        return `
        <div class="input-panel" style="display:flex; flex-direction:column; justify-content:space-between; gap:1rem;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.6rem; flex-wrap:wrap; gap:0.4rem;">
              <h3 style="font-size:1.0625rem; font-weight:700; color:var(--text-primary); margin:0;">${item.term}</h3>
              <div style="display:flex; gap:0.35rem; align-items:center; flex-wrap:wrap;">
                <span class="badge" style="${classStyle} text-transform:none; font-size:0.6875rem; font-weight:600;">${classLabel}</span>
                <span class="badge badge-category">${item.category}</span>
              </div>
            </div>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin-bottom:0.5rem;">
              ${lang === 'ko' ? item.ko : (lang === 'de' ? (item.de || item.en) : item.en)}
            </p>
            <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.5; background:var(--bg-secondary); padding:0.4rem 0.6rem; border-radius:var(--radius-sm, 6px);">
              ${lang === 'ko' ? `<b>EN:</b> ${item.en}` : (lang === 'de' ? `<b>EN:</b> ${item.en} • <b>KO:</b> ${item.ko}` : `<b>KO:</b> ${item.ko}`)}
            </div>
          </div>
          <div style="padding-top:0.6rem; border-top:1px solid var(--border-subtle); font-size:0.75rem; display:flex; flex-direction:column; gap:0.3rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span style="color:var(--text-primary); font-weight:600;">⚖️ ${lang === 'ko' ? '법적 근거' : (lang === 'de' ? 'Rechtsgrundlage' : 'Legal Basis')}: <span style="font-weight:normal; color:var(--text-secondary);">${item.legalBasis || 'N/A'}</span></span>
              <span style="color:var(--text-muted);">🕒 ${lang === 'ko' ? '최종 검증' : (lang === 'de' ? 'Zuletzt geprüft' : 'Last verified')}: ${item.lastVerified || '2026-09-16'}</span>
            </div>
            <div style="color:var(--text-muted);">
              🏛️ ${lang === 'ko' ? '출처' : (lang === 'de' ? 'Quelle' : 'Source')}: <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary); text-decoration:underline;">${item.source}</a>
            </div>
          </div>
        </div>
      `;
      }).join('');
    };

    searchIn.addEventListener('input', updateGlossary);
    catIn.addEventListener('change', updateGlossary);
    updateGlossary();
  }
};

// Initialize App on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

