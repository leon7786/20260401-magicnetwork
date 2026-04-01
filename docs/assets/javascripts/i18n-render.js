document.addEventListener('DOMContentLoaded', () => {
  const detectLocale = () => {
    const lang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    const l = lang.toLowerCase();
    if (!l.startsWith('zh')) return 'en';
    if (l.includes('tw') || l.includes('hk') || l.includes('mo') || l.includes('hant')) return 'zh-Hant-TW';
    return 'zh-Hans';
  };

  const locale = detectLocale();
  const main = document.querySelector('main.md-main') || document.body;
  const hasCJK = (s) => /[\u3400-\u9fff]/.test(s);
  const hasLatin = (s) => /[A-Za-z]/.test(s);

  const twReplacements = [
    ['简介', '簡介'],
    ['官方仓库', '官方倉庫'],
    ['官方项目', '官方專案'],
    ['下载来源', '下載來源'],
    ['下载', '下載'],
    ['安装版', '安裝版'],
    ['便携版', '可攜版'],
    ['架构版', '架構版'],
    ['免费', '免費'],
    ['软件', '軟體'],
    ['客户端', '客戶端'],
    ['页面', '頁面'],
    ['说明', '說明'],
    ['仅保留历史说明', '僅保留歷史說明'],
    ['按钮', '按鈕'],
    ['可在 iOS 上使用', '可在 iOS 上使用'],
    ['平台', '平台'],
    ['规则', '規則'],
    ['适合', '適合'],
    ['轻量', '輕量'],
    ['覆盖', '涵蓋'],
    ['节点', '節點']
  ];

  const applyTwStyle = (text) => {
    let out = text;
    twReplacements.forEach(([from, to]) => {
      out = out.split(from).join(to);
    });
    return out;
  };

  const normalizeHeading = (text) => {
    if (!text.includes(' / ')) return text;
    const [left, right] = text.split(' / ');
    if (!left || !right) return text;
    if (locale === 'en' && hasCJK(left) && hasLatin(right)) return right.trim();
    if (locale !== 'en' && hasCJK(left) && hasLatin(right)) return left.trim();
    return text;
  };

  main.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
    let content = normalizeHeading(h.textContent || '');
    if (locale === 'zh-Hant-TW') content = applyTwStyle(content);
    h.textContent = content;
  });

  const paras = Array.from(main.querySelectorAll('p'));
  for (let i = 0; i < paras.length - 1; i++) {
    const a = paras[i];
    const b = paras[i + 1];
    const ta = (a.textContent || '').trim();
    const tb = (b.textContent || '').trim();
    if (!ta || !tb) continue;
    if (a.parentElement !== b.parentElement) continue;
    if (hasCJK(ta) && !hasLatin(ta) && hasLatin(tb) && !hasCJK(tb)) {
      if (locale === 'en') a.style.display = 'none';
      else b.style.display = 'none';
      i++;
    }
  }

  if (locale === 'en') {
    const enButtonText = (text) => text
      .replace('*安装版', '*Installer')
      .replace('便携版', 'Portable')
      .replace('*M系列架构版', '*Apple Silicon')
      .replace('Intel 版', 'Intel')
      .replace('按钮（', '(')
      .replace('）', ')');

    main.querySelectorAll('a.md-button').forEach((btn) => {
      btn.textContent = enButtonText((btn.textContent || '').trim());
    });

    document.querySelectorAll('.md-nav__link, .md-tabs__link').forEach((el) => {
      el.textContent = (el.textContent || '')
        .replace('（付费）', '(Paid)')
        .replace('（免费）', '(Free)')
        .replace('（已停更）', '(Archived)');
    });
    return;
  }

  if (locale === 'zh-Hant-TW') {
    const convertTextNodes = (root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      const texts = [];
      while (walker.nextNode()) texts.push(walker.currentNode);
      texts.forEach((t) => {
        t.nodeValue = applyTwStyle(t.nodeValue);
      });
    };

    convertTextNodes(main);
    document.querySelectorAll('.md-nav, .md-tabs').forEach(convertTextNodes);
  }
});