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
      ['Windows / Desktop', 'Windows / Desktop'],
      ['iOS / iPadOS', 'iOS / iPadOS'],
      ['（付费）', '(Paid)'],
      ['（免费）', '(Free)'],
      ['（已停更）', '(Archived)'],
      ['NekoRay / Nekoray', 'NekoRay']
    ],
    'zh-Hant-TW': [
      ['Windows / Desktop', 'Windows / 桌面端'],
      ['（付费）', '（付費）'],
      ['（免费）', '（免費）'],
      ['（已停更）', '（已停更）']
    ],
    'zh-Hans': []
  };

  const replaceText = (text, localeKey) => {
    return (navReplacements[localeKey] || []).reduce(
      (acc, [from, to]) => acc.split(from).join(to),
      text
    );
  };

  const applyExplicitBlocks = () => {
    const article = document.querySelector('article.md-content__inner.md-typeset');
    if (!article) return;

    const langHeaders = Array.from(article.querySelectorAll('h3')).filter((h) => {
      const t = (h.textContent || '').trim();
      return t === '[zh-Hans]' || t === '[zh-Hant-TW]' || t === '[en]';
    });

    if (!langHeaders.length) return;

    const groups = [];
    langHeaders.forEach((header, idx) => {
      const lang = (header.textContent || '').trim().slice(1, -1);
      const endNode = idx + 1 < langHeaders.length ? langHeaders[idx + 1] : null;
      const nodes = [];
      let cur = header;
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
        } else {
          n.style.display = visible ? '' : 'none';
        }
      });
    });
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
      'zh-Hans': '代理客户端导航',
      'zh-Hant-TW': '代理客戶端導覽',
      en: 'Proxy Client Guide'
    };
    title.textContent = map[locale] || map.en;
  };

  applyExplicitBlocks();
  localizeNav();
  localizeTitle();
});
