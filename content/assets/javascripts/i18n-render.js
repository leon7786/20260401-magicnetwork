document.addEventListener('DOMContentLoaded', () => {
  const detectLocale = () => {
    const lang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    const l = lang.toLowerCase();
    if (!l.startsWith('zh')) return 'en';
    if (l.includes('tw') || l.includes('hk') || l.includes('mo') || l.includes('hant')) return 'zh-Hant-TW';
    return 'zh-Hans';
  };

  const locale = detectLocale();

  const navReplacements = {
    en: [
      ['（付费）', '(Paid)'],
      ['（免费）', '(Free)'],
      ['（已停更）', '(Archived)']
    ],
    'zh-Hant-TW': [
      ['Home', '首頁'],
      ['Client index', '客戶端索引'],
      ['Download policy', '下載策略'],
      ['FAQ', '常見問題'],
      ['Troubleshooting', '故障排查'],
      ['（付费）', '（付費）'],
      ['（免费）', '（免費）']
    ],
    'zh-Hans': []
  };

  const replaceText = (text, localeKey) => {
    return (navReplacements[localeKey] || []).reduce(
      (acc, [from, to]) => acc.split(from).join(to),
      text
    );
  };

  const applyDataLangBlocks = (root) => {
    const blocks = Array.from(root.querySelectorAll('[data-lang-block]'));
    if (!blocks.length) return { applied: false, hiddenIds: new Set() };

    const hiddenIds = new Set();
    blocks.forEach((block) => {
      const lang = block.getAttribute('data-lang-block');
      const visible = lang === locale;
      block.style.display = visible ? '' : 'none';
      if (!visible && block.id) hiddenIds.add(block.id);
    });

    return { applied: true, hiddenIds };
  };

  const applyHeadingMarkerBlocks = (root) => {
    const hiddenIds = new Set();
    const markers = Array.from(root.querySelectorAll('h1, h2, h3, h4')).filter((h) => {
      const t = (h.textContent || '').trim();
      return t === '[zh-Hans]' || t === '[zh-Hant-TW]' || t === '[en]';
    });

    if (!markers.length) return { applied: false, hiddenIds };

    const groups = [];
    markers.forEach((marker, idx) => {
      const lang = (marker.textContent || '').trim().slice(1, -1);
      const endNode = idx + 1 < markers.length ? markers[idx + 1] : null;
      const nodes = [];
      let cur = marker;
      while (cur && cur !== endNode) {
        nodes.push(cur);
        cur = cur.nextElementSibling;
      }
      groups.push({ lang, nodes });
    });

    groups.forEach(({ lang, nodes }) => {
      const visible = lang === locale;
      nodes.forEach((n, i) => {
        if (i === 0) {
          n.style.display = 'none';
          return;
        }
        n.style.display = visible ? '' : 'none';
        if (!visible && n.id) hiddenIds.add(n.id);
      });
    });

    return { applied: true, hiddenIds };
  };

  const hideTocEntries = (hiddenIds) => {
    const tocLinks = document.querySelectorAll('.md-nav--secondary a.md-nav__link');
    tocLinks.forEach((link) => {
      const text = (link.textContent || '').trim();
      const href = link.getAttribute('href') || '';
      const hashId = href.startsWith('#') ? href.slice(1) : '';
      const isLangMarker = text === '[zh-Hans]' || text === '[zh-Hant-TW]' || text === '[en]';
      const hideById = hashId && hiddenIds.has(hashId);
      if (isLangMarker || hideById) {
        const li = link.closest('.md-nav__item');
        if (li) li.style.display = 'none';
      }
    });
  };

  const applyExplicitBlocks = () => {
    const root = document.querySelector('.md-content__inner');
    if (!root) return;

    const byDataLang = applyDataLangBlocks(root);
    if (byDataLang.applied) {
      hideTocEntries(byDataLang.hiddenIds);
      return;
    }

    const byMarkers = applyHeadingMarkerBlocks(root);
    if (byMarkers.applied) {
      hideTocEntries(byMarkers.hiddenIds);
    }
  };

  const localizeNav = () => {
    document.querySelectorAll('.md-nav__link, .md-tabs__link').forEach((el) => {
      el.textContent = replaceText((el.textContent || '').trim(), locale);
    });
  };

  const localizeTitle = () => {
    const title = document.querySelector('.md-header__title');
    if (!title) return;
    const map = {
      'zh-Hans': '代理客户端文档',
      'zh-Hant-TW': '代理客戶端文件',
      en: 'Proxy Client Docs'
    };
    title.textContent = map[locale] || map.en;
  };

  const forceExpandNav = () => {
    document.querySelectorAll('.md-nav__toggle').forEach((toggle) => {
      toggle.checked = true;
      toggle.disabled = true;
    });
  };

  applyExplicitBlocks();
  localizeNav();
  localizeTitle();
  forceExpandNav();
});
