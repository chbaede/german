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

    if (!hash) {
      // Show Dashboard
      this.activeToolId = null;
      if (dashboard) dashboard.style.display = 'block';
      if (toolView) toolView.style.display = 'none';
      document.title = `${t('appTitle')} — ${t('appSubtitle')}`;
      this.renderRecentlyUsed();
      ToolSearch.renderFilteredTools();
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
      document.title = `${tool.title[currentLang]} | ${t('appTitle')}`;
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
        <div class="badge badge-popular">${t('estimatedNotice')}</div>
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
              <label class="form-label">${t('taxClass')}</label>
              <select id="salary-taxclass" class="form-select">
                <option value="1" selected>Class I (Single)</option>
                <option value="2">Class II (Single Parent)</option>
                <option value="3">Class III (Married High-Earner)</option>
                <option value="4">Class IV (Married Equal)</option>
                <option value="5">Class V (Married Lower-Earner)</option>
                <option value="6">Class VI (Second Job)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${t('bundesland')}</label>
              <select id="salary-state" class="form-select">${statesOptions}</select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('churchTax')}</label>
              <select id="salary-church" class="form-select">
                <option value="false" selected>${t('no')}</option>
                <option value="true">${t('yes')} (8-9%)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${t('numChildren')}</label>
              <input type="number" id="salary-children" class="form-input" value="0" min="0" max="10">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">${t('healthInsurance')}</label>
            <select id="salary-health" class="form-select">
              <option value="gkv" selected>${t('statutoryHealth')}</option>
              <option value="pkv">${t('privateHealth')}</option>
            </select>
          </div>

          <div id="pkv-row" class="form-group" style="display:none;">
            <label class="form-label">${t('pkvMonthlyAmount')}</label>
            <div class="input-with-affix">
              <span class="affix affix-left">€</span>
              <input type="number" id="salary-pkv-val" class="form-input input-prefix" value="450" min="0">
            </div>
          </div>

          <div class="form-actions">
            <button id="btn-salary-calc" class="btn-primary">⚡ ${t('calculate')}</button>
            <button id="btn-salary-reset" class="btn-secondary">↺ ${t('reset')}</button>
          </div>

          <div class="notice-box">
            <strong>⚠️ ${t('estimatedNotice')}:</strong> ${t('taxDisclaimer')}
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
              <span class="breakdown-label">${t('pensionContribution')} (9.3%)</span>
              <span id="res-rv" class="breakdown-value negative">- € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('unemploymentContribution')} (1.3%)</span>
              <span id="res-av" class="breakdown-value negative">- € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('healthContribution')} (~8.55%)</span>
              <span id="res-gkv" class="breakdown-value negative">- € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('careContribution')} (PV)</span>
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
        </div>

        <!-- Explanatory & FAQ Section -->
        <div class="info-section">
          <div class="info-panel">
            <h3 class="panel-title">💡 ${t('infoHeading')}</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin-bottom:1rem;">
              In Germany, statutory deductions consist of two main components: <b>taxes</b> (Lohnsteuer, Solidaritätszuschlag, Kirchensteuer) and <b>mandatory social security contributions</b> (Rentenversicherung, Arbeitslosenversicherung, Krankenversicherung, Pflegeversicherung). Social contributions are generally split 50/50 between employee and employer up to federal income ceilings (Beitragsbemessungsgrenzen).
            </p>
            <div class="faq-item">
              <div class="faq-question">❓ What is the basic tax-free allowance (Grundfreibetrag)?</div>
              <div class="faq-answer">For 2025, every single adult has a basic tax allowance of €12,096 per year (€24,192 for married couples filing jointly). Income earned below this threshold incurs 0% income tax.</div>
            </div>
            <div class="faq-item">
              <div class="faq-question">❓ Who pays the Solidarity Surcharge (Solidaritätszuschlag)?</div>
              <div class="faq-answer">Around 90% of employees in Germany are exempt from SolZ. It only applies if your annual income tax liability exceeds €18,130 for singles or €36,260 for married couples.</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Elements
    const grossEl = document.getElementById('salary-gross');
    const grossAnnualEl = document.getElementById('salary-gross-annual');
    const syncInfoEl = document.getElementById('salary-sync-info');
    const taxClassEl = document.getElementById('salary-taxclass');
    const stateEl = document.getElementById('salary-state');
    const churchEl = document.getElementById('salary-church');
    const childrenEl = document.getElementById('salary-children');
    const healthEl = document.getElementById('salary-health');
    const pkvRow = document.getElementById('pkv-row');
    const pkvValEl = document.getElementById('salary-pkv-val');

    const updateSyncInfo = () => {
      const mVal = GLTUtils.parseNumber(grossEl.value, 0);
      const aVal = GLTUtils.parseNumber(grossAnnualEl.value, 0);
      if (syncInfoEl) {
        syncInfoEl.innerHTML = currentLang === 'ko'
          ? `💡 세전 월급 <b>${GLTUtils.formatEuro(mVal)}</b> ⇄ 세전 연봉 <b>${GLTUtils.formatEuro(aVal)}</b> (월급 × 12)`
          : `💡 Monthly <b>${GLTUtils.formatEuro(mVal)}</b> ⇄ Annual <b>${GLTUtils.formatEuro(aVal)}</b> (Monthly × 12)`;
      }
    };

    const updateCalc = () => {
      const isPkv = healthEl.value === 'pkv';
      pkvRow.style.display = isPkv ? 'block' : 'none';

      const res = SalaryCalculator.calculateNetSalary({
        grossMonthly: grossEl.value,
        taxClass: taxClassEl.value,
        stateCode: stateEl.value,
        hasChurchTax: churchEl.value === 'true',
        numChildren: childrenEl.value,
        healthType: healthEl.value,
        pkvAmount: pkvValEl.value
      });

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

    [taxClassEl, stateEl, churchEl, childrenEl, healthEl, pkvValEl].forEach(el => {
      el.addEventListener('input', updateCalc);
      el.addEventListener('change', updateCalc);
    });

    document.getElementById('btn-salary-calc').addEventListener('click', updateCalc);
    document.getElementById('btn-salary-reset').addEventListener('click', () => {
      grossEl.value = "4500";
      grossAnnualEl.value = "54000";
      taxClassEl.value = "1";
      stateEl.value = "BE";
      churchEl.value = "false";
      childrenEl.value = "0";
      healthEl.value = "gkv";
      pkvValEl.value = "450";
      updateSyncInfo();
      updateCalc();
    });

    document.getElementById('btn-copy-salary').addEventListener('click', function() {
      const summary = `German Salary Calculation Estimate:\nGross: €${grossEl.value}/mo (€${grossAnnualEl.value}/yr)\nNet: ${document.getElementById('res-net-monthly').textContent} (${document.getElementById('res-net-annual').textContent})\nDeductions: ${document.getElementById('res-total-deductions').textContent} (${document.getElementById('res-effective-rate').textContent})\nhttps://german.yocto.co.kr/#salary`;
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
        <div class="badge badge-popular">${t('estimatedNotice')}</div>
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
              <label class="form-label">${t('taxClass')}</label>
              <select id="rev-taxclass" class="form-select">
                <option value="1" selected>Class I</option>
                <option value="3">Class III</option>
                <option value="4">Class IV</option>
                <option value="5">Class V</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${t('numChildren')}</label>
              <input type="number" id="rev-children" class="form-input" value="0" min="0">
            </div>
          </div>

          <div class="form-actions">
            <button id="btn-rev-calc" class="btn-primary">⚡ ${t('calculate')}</button>
          </div>
          <div class="notice-box">
            <strong>ℹ️ Method:</strong> ${t('reverseExplain')}
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
    const tcIn = document.getElementById('rev-taxclass');
    const chIn = document.getElementById('rev-children');
    const explEl = document.getElementById('res-rev-explanation');

    const updateRevSyncInfo = () => {
      const mVal = GLTUtils.parseNumber(netIn.value, 0);
      const aVal = GLTUtils.parseNumber(netAnnualIn.value, 0);
      if (syncInfoEl) {
        syncInfoEl.innerHTML = currentLang === 'ko'
          ? `💡 목표 실수령 월 <b>${GLTUtils.formatEuro(mVal)}</b> ⇄ 연간 <b>${GLTUtils.formatEuro(aVal)}</b> (월 실수령액 × 12)`
          : `💡 Target Monthly Net <b>${GLTUtils.formatEuro(mVal)}</b> ⇄ Annual Net <b>${GLTUtils.formatEuro(aVal)}</b> (Monthly × 12)`;
      }
    };

    const updateRev = () => {
      const gross = SalaryCalculator.calculateNetToGross(netIn.value, {
        taxClass: tcIn.value,
        numChildren: chIn.value,
        stateCode: "BE"
      });
      document.getElementById('res-rev-gross').textContent = `${GLTUtils.formatEuro(gross)} / mo`;
      document.getElementById('res-rev-annual').textContent = `Annual Gross: ${GLTUtils.formatEuro(gross * 12)} / yr`;

      const targetM = GLTUtils.formatEuro(GLTUtils.parseNumber(netIn.value, 0));
      const targetA = GLTUtils.formatEuro(GLTUtils.parseNumber(netAnnualIn.value, 0));
      const reqM = GLTUtils.formatEuro(gross);
      const reqA = GLTUtils.formatEuro(gross * 12);

      if (explEl) {
        explEl.innerHTML = currentLang === 'ko'
          ? `목표 실수령액 <b>${targetM} / 월</b> (연간 <b>${targetA}</b>)을 받으려면, 연봉 협상 시 <b>필요 세전 월급 약 ${reqM}</b>, <b>필요 세전 연봉 약 ${reqA}</b>를 요구해야 합니다.`
          : `To achieve a monthly take-home pay of <b>${targetM}</b> (annual net <b>${targetA}</b>), you should negotiate a gross salary of approximately <b>${reqM} / month</b> (<b>${reqA} / year</b>) with your employer.`;
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

    [tcIn, chIn].forEach(el => el.addEventListener('input', updateRev));
    document.getElementById('btn-rev-calc').addEventListener('click', updateRev);

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
          <h2 class="panel-title"><span>💵 Base & Bonus Inputs</span></h2>
          <div class="form-group">
            <label class="form-label">${t('monthlyGross')}</label>
            <div class="input-with-affix">
              <span class="affix affix-left">€</span>
              <input type="number" id="ann-base" class="form-input input-prefix" value="5000" min="0">
              <span class="affix affix-right">/mo</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('bonusPercentage')}</label>
              <div class="input-with-affix">
                <input type="number" id="ann-bonus-pct" class="form-input" value="10" min="0" max="200">
                <span class="affix affix-right">%</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">${t('bonusPaymentsCount')}</label>
              <input type="number" id="ann-bonus-fixed" class="form-input" value="1" min="0" max="6" step="0.5">
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
              <span class="breakdown-label">${t('baseAnnual')} (12 × Base)</span>
              <span id="res-ann-base" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('bonusFromPercent')}</span>
              <span id="res-ann-pct" class="breakdown-value positive">+ € 0,00</span>
            </div>
            <div class="breakdown-row">
              <span class="breakdown-label">${t('bonusFromFixed')}</span>
              <span id="res-ann-fixed" class="breakdown-value positive">+ € 0,00</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const baseIn = document.getElementById('ann-base');
    const pctIn = document.getElementById('ann-bonus-pct');
    const fixedIn = document.getElementById('ann-bonus-fixed');

    const updateAnn = () => {
      const res = SalaryCalculator.calculateAnnualCompensation(baseIn.value, pctIn.value, fixedIn.value);
      document.getElementById('res-ann-total').textContent = GLTUtils.formatEuro(res.totalComp);
      document.getElementById('res-ann-monthly').textContent = `${t('monthlyAverageComp')}: ${GLTUtils.formatEuro(res.monthlyEquivalent)}`;
      document.getElementById('res-ann-base').textContent = GLTUtils.formatEuro(res.baseAnnual);
      document.getElementById('res-ann-pct').textContent = `+ ${GLTUtils.formatEuro(res.bonusPerformance)}`;
      document.getElementById('res-ann-fixed').textContent = `+ ${GLTUtils.formatEuro(res.bonusFixed)}`;
    };

    [baseIn, pctIn, fixedIn].forEach(el => el.addEventListener('input', updateAnn));
    updateAnn();
  },

  // Tool 4: Tax Class Comparison
  renderTaxClassTool(container, tool) {
    const lang = currentLang;
    const rows = GERMAN_TAX_CONFIG.taxClasses.map(tc => `
      <tr>
        <td style="font-weight:700; color:var(--text-primary);">${tc.name}</td>
        <td>${lang === 'ko' ? tc.useCaseKo : tc.useCaseEn}</td>
        <td>${lang === 'ko' ? tc.featuresKo : tc.featuresEn}</td>
        <td style="color:var(--warning-color);">${lang === 'ko' ? tc.limitationsKo : tc.limitationsEn}</td>
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
              <span class="breakdown-label">${t('gezFee')}</span>
              <span id="res-rent-gez" class="breakdown-value">€ 18,36</span>
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
        netIncome: netIncIn.value
      });

      document.getElementById('res-rent-monthly').textContent = GLTUtils.formatEuro(res.totalHousingMonthly);
      document.getElementById('res-rent-annual').textContent = `Annual: ${GLTUtils.formatEuro(res.totalHousingAnnual)}`;
      document.getElementById('res-rent-kalt').textContent = GLTUtils.formatEuro(res.kaltmiete);
      document.getElementById('res-rent-neben').textContent = GLTUtils.formatEuro(res.nebenkosten);
      document.getElementById('res-rent-warm').textContent = GLTUtils.formatEuro(res.warmmiete);
      document.getElementById('res-rent-elec-inet').textContent = GLTUtils.formatEuro(res.electricity + res.internet);
      document.getElementById('res-rent-ratio').textContent = res.rentRatio ? `${res.rentRatio.toFixed(1)} %` : 'N/A';
    };

    [kaltIn, nebenIn, heatIncIn, heatExtraIn, elecIn, inetIn, netIncIn].forEach(el => {
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
    const statesOpts = GERMAN_STATES.map(s => `
      <option value="${s.code}" ${s.code === 'BE' ? 'selected' : ''}>${s.flagEmoji} ${s.nameDe} (${s.code})</option>
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
            <select id="hol-year" class="form-select">
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026" selected>2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">${t('selectState')}</label>
            <select id="hol-state" class="form-select">
              <option value="ALL">${t('allStatesOption')}</option>
              ${statesOpts}
            </select>
          </div>
        </div>
      </div>

      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>German Holiday Name</th>
              <th>English / Korean</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="hol-table-body"></tbody>
        </table>
      </div>
    `;

    const yearSelect = document.getElementById('hol-year');
    const stateSelect = document.getElementById('hol-state');

    const updateHolidays = () => {
      const year = parseInt(yearSelect.value, 10);
      const state = stateSelect.value;
      const list = CalendarTools.getHolidaysList(year, state);
      const tbody = document.getElementById('hol-table-body');
      const lang = currentLang;

      tbody.innerHTML = list.map(h => {
        const badge = h.nationwide
          ? `<span class="badge" style="background-color:var(--accent-light); color:var(--accent-primary);">${t('nationwideBadge')}</span>`
          : `<span class="badge" style="background-color:var(--bg-secondary); color:var(--text-muted);">${t('stateSpecificBadge')} (${h.states.join(', ')})</span>`;

        return `
          <tr style="${h.isUpcoming ? 'font-weight:600;' : 'opacity:0.8;'}">
            <td style="font-family:var(--font-mono);">${h.date}</td>
            <td>${h.dayOfWeek}</td>
            <td style="color:var(--text-primary); font-weight:600;">${h.nameDe}</td>
            <td>${lang === 'ko' ? h.nameKo : h.nameEn}</td>
            <td>${badge}</td>
          </tr>
        `;
      }).join('');
    };

    yearSelect.addEventListener('change', updateHolidays);
    stateSelect.addEventListener('change', updateHolidays);
    updateHolidays();
  },

  // Tool 12: Working Days Calculator
  renderWorkingDaysTool(container, tool) {
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

      <div class="tool-layout">
        <div class="input-panel">
          <h2 class="panel-title"><span>📅 Date Range</span></h2>
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
            <div id="res-work-sub" class="result-hero-sub">Days</div>
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
            <div class="breakdown-row">
              <span class="breakdown-label">${t('holidaysCount')}</span>
              <span id="res-work-hol" class="breakdown-value negative">- 0</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const startIn = document.getElementById('work-start');
    const endIn = document.getElementById('work-end');
    const stateIn = document.getElementById('work-state');
    const exclIn = document.getElementById('work-excl-holidays');

    const updateWork = () => {
      const res = CalendarTools.calculateWorkingDays(startIn.value, endIn.value, stateIn.value, exclIn.checked);
      document.getElementById('res-work-net').textContent = res.netWorkingDays;
      document.getElementById('res-work-cal').textContent = res.calendarDays;
      document.getElementById('res-work-weekends').textContent = `- ${res.weekendDays}`;
      document.getElementById('res-work-hol').textContent = `- ${res.holidayDays}`;
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
              <span class="breakdown-label">2023–2024 Past Baseline (250 €/child)</span>
              <span id="res-kg-past-echo" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row" style="color:var(--text-secondary);">
              <span class="breakdown-label">2025 Past Amount (255 €/child)</span>
              <span id="res-kg-2025-echo" class="breakdown-value">€ 0,00</span>
            </div>
            <div class="breakdown-row" style="font-weight:700; color:var(--success-color);">
              <span class="breakdown-label">2026 Current Payout (259 €/child)</span>
              <span id="res-kg-curr-echo" class="breakdown-value positive">€ 0,00</span>
            </div>
            <div class="breakdown-row total-row" style="color:var(--accent-primary);">
              <span class="breakdown-label">From 2027 Projected (263 €/child)</span>
              <span id="res-kg-2027-echo" class="breakdown-value" style="color:var(--accent-primary);">€ 0,00</span>
            </div>
          </div>
        </div>

        <!-- Timeline & Historical Rates Section -->
        <div class="info-section">
          <div class="info-panel" style="margin-bottom:1.5rem;">
            <h3 class="panel-title">📈 ${t('kindergeldTimelineTitle')}</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin-bottom:1rem;">
              독일 연방정부(Bundeskabinett)의 세법 개정안(Steuerfortentwicklungsgesetz)에 따라 아동수당(Kindergeld)은 2025년 월 255유로, <b>2026년 기준 월 259유로</b>로 인상되었습니다. <b>2027년부터는 월 263유로</b>로 추가 인상될 예정입니다.
            </p>
            <div class="data-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>연도 / 기간 (Period)</th>
                    <th>자녀 1인당 월 지급액</th>
                    <th id="th-kg-family-col">우리가구 월 수령액</th>
                    <th>구분 (Status)</th>
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
      document.getElementById('res-kg-2027-echo').textContent = `${GLTUtils.formatEuro(count * 263)} / mo (+${GLTUtils.formatEuro(count * 4)}/mo)`;

      const thFam = document.getElementById('th-kg-family-col');
      if (thFam) {
        thFam.textContent = lang === 'ko' ? `자녀 ${count}명 가구 월 수령액` : `Monthly Payout for ${count} Child${count > 1 ? 'ren' : ''}`;
      }

      const tbody = document.getElementById('kg-timeline-tbody');
      if (tbody) {
        tbody.innerHTML = res.timelineComparison.map(item => {
          let rowStyle = "";
          let badge = "";

          if (item.isCurrent) {
            rowStyle = "background-color: rgba(16, 185, 129, 0.08); font-weight:700;";
            badge = `<span class="badge" style="background-color:var(--success-light); color:var(--success-color); font-weight:700;">${lang === 'ko' ? '★ 현재 수령액 (2026)' : '★ Current Rate (2026)'}</span>`;
          } else if (item.isFuture) {
            rowStyle = "background-color: rgba(99, 102, 241, 0.08); font-weight:600;";
            badge = `<span class="badge" style="background-color:var(--accent-light); color:var(--accent-primary); font-weight:700;">${lang === 'ko' ? '🚀 2027년 인상 예정' : '🚀 2027 Upcoming Increase'}</span>`;
          } else {
            badge = `<span class="badge" style="background-color:var(--bg-secondary); color:var(--text-muted);">${lang === 'ko' ? '이전 (과거)' : 'Past'}</span>`;
          }

          return `
            <tr style="${rowStyle}">
              <td style="font-weight:600;">${lang === 'ko' ? item.periodKo : item.periodEn}</td>
              <td style="font-family:var(--font-mono);">${lang === 'ko' ? item.rateDescKo : item.rateDescEn}</td>
              <td style="font-family:var(--font-mono); font-weight:700; ${item.isCurrent ? 'color:var(--success-color);' : item.isFuture ? 'color:var(--accent-primary);' : ''}">
                ${GLTUtils.formatEuro(item.monthlyFamilyTotal)} / mo (${GLTUtils.formatEuro(item.annualFamilyTotal)} / yr)
              </td>
              <td>${badge}</td>
            </tr>
          `;
        }).join('');
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
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026" selected>2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">${t('selectState')}</label>
            <select id="sch-state" class="form-select">${statesOpts}</select>
          </div>
        </div>
      </div>

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
    `;

    const yrIn = document.getElementById('sch-year');
    const stIn = document.getElementById('sch-state');

    const updateSch = () => {
      const list = FamilyTools.getSchoolHolidaysForState(parseInt(yrIn.value, 10), stIn.value);
      const tbody = document.getElementById('sch-table-body');
      const lang = currentLang;

      tbody.innerHTML = list.map(h => `
        <tr>
          <td style="font-weight:600; color:var(--text-primary);">${h.nameDe} (${lang === 'ko' ? h.nameEn : h.nameEn})</td>
          <td style="font-family:var(--font-mono);">${h.start} ~ ${h.end}</td>
        </tr>
      `).join('');
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

      listEl.innerHTML = filtered.map(item => `
        <div class="input-panel" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
              <h3 style="font-size:1.0625rem; font-weight:700; color:var(--text-primary);">${item.term}</h3>
              <span class="badge badge-category">${item.category}</span>
            </div>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6;">
              ${lang === 'ko' ? item.ko : item.en}
            </p>
          </div>
          <div style="margin-top:0.75rem; padding-top:0.5rem; border-top:1px solid var(--border-subtle); font-size:0.75rem; color:var(--text-muted);">
            ${lang === 'ko' ? `<b>EN:</b> ${item.en}` : `<b>KO:</b> ${item.ko}`}
          </div>
        </div>
      `).join('');
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

