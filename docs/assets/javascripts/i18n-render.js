document.addEventListener('DOMContentLoaded', async () => {
  const getLocale = () => {
    const lang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    const l = lang.toLowerCase();
    if (!l.startsWith('zh')) return 'en';
    if (l.includes('tw') || l.includes('hk') || l.includes('mo') || l.includes('hant')) return 'zh-Hant';
    return 'zh-Hans';
  };

  const locale = getLocale();
  const main = document.querySelector('main.md-main') || document.body;

  const hasCJK = (s) => /[\u3400-\u9fff]/.test(s);
  const hasLatin = (s) => /[A-Za-z]/.test(s);

  const normalizeHeading = (text) => {
    if (!text.includes(' / ')) return text;
    const [left, right] = text.split(' / ');
    if (!left || !right) return text;
    if (locale === 'en' && hasCJK(left) && hasLatin(right)) return right.trim();
    if (locale !== 'en' && hasCJK(left) && hasLatin(right)) return left.trim();
    return text;
  };

  main.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
    h.textContent = normalizeHeading(h.textContent || '');
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

  const enButtonText = (text) => text
    .replace('*安装版', '*Installer')
    .replace('便携版', 'Portable')
    .replace('*M系列架构版', '*Apple Silicon')
    .replace('Intel 版', 'Intel')
    .replace('按钮（', '(')
    .replace('）', ')');

  main.querySelectorAll('a.md-button').forEach((btn) => {
    if (locale === 'en') {
      btn.textContent = enButtonText((btn.textContent || '').trim());
    }
  });

  if (locale === 'en') {
    document.querySelectorAll('.md-nav__link, .md-tabs__link').forEach((el) => {
      el.textContent = (el.textContent || '')
        .replace('（付费）', '(Paid)')
        .replace('（免费）', '(Free)')
        .replace('（已停更）', '(Archived)');
    });
    return;
  }

  if (locale !== 'zh-Hant') return;

  try {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js';
    script.async = true;

    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    if (!window.OpenCC || !window.OpenCC.Converter) return;
    const converter = window.OpenCC.Converter({ from: 'cn', to: 'tw' });

    const convertTextNodes = (root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      const texts = [];
      while (walker.nextNode()) texts.push(walker.currentNode);
      texts.forEach((t) => {
        t.nodeValue = converter(t.nodeValue);
      });
    };

    convertTextNodes(main);
    document.querySelectorAll('.md-nav, .md-tabs').forEach(convertTextNodes);
  } catch {
    // fallback to zh-Hans
  }
});