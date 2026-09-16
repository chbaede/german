/**
 * Utility functions for German Life Toolkit
 * Formatting, clipboard, math helpers, and recent tools storage.
 */
const GLTUtils = {
  /**
   * Format Euro currency
   * @param {number} amount
   * @param {boolean} showDecimals
   */
  formatEuro(amount, showDecimals = true) {
    if (isNaN(amount) || amount === null || amount === undefined) return "€ 0";
    const isKo = currentLang === 'ko';
    
    // In German / European formatting: 1.234,56 €
    return new Intl.NumberFormat(isKo ? 'ko-KR' : 'de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    }).format(amount);
  },

  /**
   * Format generic number
   */
  formatNumber(num, decimals = 0) {
    if (isNaN(num) || num === null || num === undefined) return "0";
    const isKo = currentLang === 'ko';
    return new Intl.NumberFormat(isKo ? 'ko-KR' : 'de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  },

  /**
   * Copy text to clipboard and show temporary badge/feedback
   */
  async copyText(text, btnElement) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (btnElement) {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = `
          <svg class="w-3.5 h-3.5 inline mr-1 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-emerald-500 font-medium">${t('copied')}</span>
        `;
        btnElement.classList.add('border-emerald-500');
        setTimeout(() => {
          btnElement.innerHTML = originalHtml;
          btnElement.classList.remove('border-emerald-500');
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  },

  /**
   * Parse numeric input safely
   */
  parseNumber(val, fallback = 0) {
    if (typeof val === 'number') return isNaN(val) ? fallback : val;
    if (!val) return fallback;
    // Replace commas if European format is entered
    const cleaned = String(val).trim().replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? fallback : parsed;
  },

  /**
   * Manage recently used tools in localStorage
   */
  saveRecentTool(toolId) {
    try {
      let recent = JSON.parse(localStorage.getItem('glt_recent_tools') || '[]');
      // Remove if already exists to push to front
      recent = recent.filter(id => id !== toolId);
      recent.unshift(toolId);
      // Keep top 6
      if (recent.length > 6) recent = recent.slice(0, 6);
      localStorage.setItem('glt_recent_tools', JSON.stringify(recent));
    } catch (e) {
      console.warn('Failed to save recent tools', e);
    }
  },

  getRecentTools() {
    try {
      return JSON.parse(localStorage.getItem('glt_recent_tools') || '[]');
    } catch (e) {
      return [];
    }
  },

  /**
   * Safe Google AdSense initialization and fill observer for Single Page Applications (SPA).
   * Safely discovers uninitialized ins.adsbygoogle slots, executes push, and only displays
   * the ad container (.ad-filled) when Google actually renders an ad iframe with height > 0.
   * If unfilled or blocked, keeps container collapsed (0px height, hidden).
   */
  refreshAds() {
    try {
      setTimeout(() => {
        try {
          const ads = document.querySelectorAll('ins.adsbygoogle');
          ads.forEach(ad => {
            const adSection = ad.closest('.ad-section');
            if (!ad.getAttribute('data-adsbygoogle-status')) {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
            const checkFilled = () => {
              if (!adSection) return;
              const status = ad.getAttribute('data-ad-status');
              const iframe = ad.querySelector('iframe');
              const isFilled = status === 'filled' || (iframe && (iframe.clientHeight > 0 || iframe.offsetHeight > 0 || parseInt(iframe.getAttribute('height') || '0', 10) > 0));
              if (isFilled) {
                adSection.classList.add('ad-filled');
                adSection.classList.remove('ad-unfilled');
              } else if (status === 'unfilled') {
                adSection.classList.remove('ad-filled');
                adSection.classList.add('ad-unfilled');
              }
            };
            setTimeout(checkFilled, 500);
            setTimeout(checkFilled, 1200);
            setTimeout(checkFilled, 2500);
            setTimeout(() => {
              if (adSection && !adSection.classList.contains('ad-filled')) {
                adSection.classList.add('ad-unfilled');
              }
            }, 4000);
          });
        } catch (slotErr) {
          console.debug('AdSense slot init info:', slotErr);
        }
      }, 50);
    } catch (e) {
      console.debug('AdSense init notice:', e);
    }
  }
};

