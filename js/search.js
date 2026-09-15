/**
 * Instant Search and Category Filtering Module
 */
const ToolSearch = {
  currentCategory: "all",
  searchQuery: "",

  init() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (clearBtn) {
          clearBtn.style.display = this.searchQuery ? 'block' : 'none';
        }
        this.renderFilteredTools();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          this.searchQuery = '';
          clearBtn.style.display = 'none';
          this.renderFilteredTools();
          searchInput.focus();
        }
      });
    }
  },

  setCategory(catId) {
    this.currentCategory = catId;
    // Update active pill UI
    document.querySelectorAll('.category-pill').forEach(pill => {
      if (pill.getAttribute('data-cat') === catId) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
    this.renderFilteredTools();
  },

  filterTools() {
    const query = this.searchQuery;
    const cat = this.currentCategory;
    const lang = currentLang;

    return TOOLS_DATA.filter(tool => {
      // Category match
      if (cat !== "all" && tool.category !== cat) {
        return false;
      }

      // Query match
      if (!query) return true;

      const titleEn = (tool.title.en || "").toLowerCase();
      const titleKo = (tool.title.ko || "").toLowerCase();
      const descEn = (tool.desc.en || "").toLowerCase();
      const descKo = (tool.desc.ko || "").toLowerCase();
      const tagsEn = (tool.tags.en || []).join(" ").toLowerCase();
      const tagsKo = (tool.tags.ko || []).join(" ").toLowerCase();
      const catName = (tool.category || "").toLowerCase();

      return titleEn.includes(query) ||
             titleKo.includes(query) ||
             descEn.includes(query) ||
             descKo.includes(query) ||
             tagsEn.includes(query) ||
             tagsKo.includes(query) ||
             catName.includes(query);
    });
  },

  renderFilteredTools() {
    const grid = document.getElementById('tools-grid');
    const noResults = document.getElementById('no-results-msg');
    const sectionTitle = document.getElementById('tools-section-title');
    if (!grid) return;

    const filtered = this.filterTools();

    if (sectionTitle) {
      if (this.currentCategory !== "all") {
        const catObj = CATEGORIES_DATA.find(c => c.id === this.currentCategory);
        sectionTitle.innerHTML = catObj ? `${catObj.icon} ${catObj.title[currentLang]}` : t('popularTools');
      } else if (this.searchQuery) {
        sectionTitle.textContent = `${t('resultsHeading')} (${filtered.length})`;
      } else {
        sectionTitle.innerHTML = `⭐ ${t('popularTools')}`;
      }
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (noResults) noResults.style.display = 'block';
      return;
    }

    if (noResults) noResults.style.display = 'none';

    const lang = currentLang;
    grid.innerHTML = filtered.map(tool => {
      const catObj = CATEGORIES_DATA.find(c => c.id === tool.category);
      const catTitle = catObj ? catObj.title[lang] : tool.category;
      const popularBadge = tool.popular ? `<span class="badge badge-popular">${lang === 'ko' ? '인기' : 'Popular'}</span>` : '';

      return `
        <div class="tool-card" onclick="location.hash='#${tool.id}'" role="button" tabindex="0">
          <div>
            <div class="tool-header">
              <div class="tool-icon-wrapper">${tool.icon}</div>
              <div class="tool-badges">
                ${popularBadge}
                <span class="badge badge-category">${catTitle}</span>
              </div>
            </div>
            <h3 class="tool-title">${tool.title[lang]}</h3>
            <p class="tool-desc">${tool.desc[lang]}</p>
          </div>
          <div class="tool-footer">
            <div class="tool-tags">${tool.tags[lang].slice(0, 3).join(' • ')}</div>
            <span class="btn-open">${t('openTool')} →</span>
          </div>
        </div>
      `;
    }).join('');
  }
};
