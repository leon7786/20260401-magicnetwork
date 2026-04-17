document.addEventListener('DOMContentLoaded', async () => {
  const buttons = document.querySelectorAll('a.download-latest[data-repo]');
  const allButtons = document.querySelectorAll('.md-typeset a.md-button');
  const cache = new Map();
  const proxyPrefix = 'https://github.xloard.com/';

  const detectLocale = () => {
    const lang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    const l = lang.toLowerCase();
    if (!l.startsWith('zh')) return 'en';
    if (l.includes('tw') || l.includes('hk') || l.includes('mo') || l.includes('hant')) return 'zh-Hant-TW';
    return 'zh-Hans';
  };

  const locale = detectLocale();
  const labels = {
    'zh-Hans': { download: '下载地址：', source: '来源信息：' },
    'zh-Hant-TW': { download: '下載地址：', source: '來源資訊：' },
    en: { download: 'Download:', source: 'Sources:' }
  };
  const labelSet = labels[locale] || labels.en;

  const firstButtons = [];

  allButtons.forEach((btn) => {
    const prev = btn.previousElementSibling;
    if (prev && (prev.matches('a.md-button') || prev.classList.contains('download-label'))) {
      return;
    }

    const label = document.createElement('p');
    label.className = 'download-label';
    label.textContent = labelSet.download;
    btn.parentNode.insertBefore(label, btn);
    firstButtons.push(btn);
  });

  const processedInfoLists = new Set();

  firstButtons.forEach((btn) => {
    const listContainer = btn.closest('ul');
    const buttonBlock = btn.closest('p') || btn.parentElement;

    let infoList = null;
    if (listContainer && listContainer.querySelector('a.md-button')) {
      infoList = listContainer;
    } else if (buttonBlock) {
      infoList = buttonBlock.previousElementSibling;
      if (infoList && infoList.classList.contains('source-label')) {
        infoList = infoList.previousElementSibling;
      }
    }

    if (!infoList || infoList.tagName !== 'UL' || processedInfoLists.has(infoList)) return;
    processedInfoLists.add(infoList);

    const hasSourceContent = Boolean(infoList.textContent && infoList.textContent.trim());
    if (!hasSourceContent) return;

    const sourceItems = [];
    infoList.querySelectorAll(':scope > li').forEach((item) => {
      const clone = item.cloneNode(true);
      clone.querySelectorAll('.download-label, a.md-button').forEach((node) => node.remove());
      if ((clone.textContent || '').trim()) {
        sourceItems.push(clone);
      }
    });

    if (!sourceItems.length) return;

    const buttonNodes = Array.from(infoList.querySelectorAll('a.md-button'));
    if (!buttonNodes.length && buttonBlock) {
      buttonNodes.push(...Array.from(buttonBlock.querySelectorAll('a.md-button')));
    }

    if (!buttonNodes.length) return;

    let downloadLabel = buttonNodes[0].previousElementSibling;
    if (!downloadLabel || !downloadLabel.classList.contains('download-label')) {
      downloadLabel = document.createElement('p');
      downloadLabel.className = 'download-label';
      downloadLabel.textContent = labelSet.download;
    }

    const downloadGroup = document.createElement('div');
    downloadGroup.className = 'download-group';
    downloadGroup.appendChild(downloadLabel);
    buttonNodes.forEach((node) => downloadGroup.appendChild(node));

    const sourceList = document.createElement('ul');
    sourceItems.forEach((item) => sourceList.appendChild(item));

    const prev = infoList.previousElementSibling;
    const hasSectionTitle = prev && (prev.classList.contains('source-label') || prev.tagName === 'H2' || prev.tagName === 'H3');

    let sourceLabel = prev && prev.classList.contains('source-label') ? prev : null;
    if (!sourceLabel && !hasSectionTitle) {
      sourceLabel = document.createElement('p');
      sourceLabel.className = 'source-label';
      sourceLabel.textContent = labelSet.source;
    }

    infoList.insertAdjacentElement('beforebegin', downloadGroup);
    if (sourceLabel) {
      downloadGroup.insertAdjacentElement('afterend', sourceLabel);
      sourceLabel.insertAdjacentElement('afterend', sourceList);
    } else {
      downloadGroup.insertAdjacentElement('afterend', sourceList);
    }

    infoList.remove();
  });

  const proxify = (url) => {
    if (!url) return url;
    if (url.startsWith(proxyPrefix)) return url;
    if (url.startsWith('https://github.com/')) return `${proxyPrefix}${url}`;
    return url;
  };

  const getLatest = async (repo) => {
    if (cache.has(repo)) return cache.get(repo);
    const url = `https://api.github.com/repos/${repo}/releases/latest`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch latest release for ${repo}`);
    const data = await res.json();
    cache.set(repo, data);
    return data;
  };

  for (const btn of buttons) {
    const repo = btn.dataset.repo;
    const matchExpr = btn.dataset.match || '';
    const fallbackRaw = btn.dataset.fallback || `https://github.com/${repo}/releases/latest`;
    const fallback = proxify(fallbackRaw);

    if (!repo) continue;

    btn.href = fallback;
    btn.target = '_blank';
    btn.rel = 'noopener';

    try {
      const data = await getLatest(repo);
      const assets = data.assets || [];

      if (!matchExpr) {
        btn.href = proxify(data.html_url || fallbackRaw);
        continue;
      }

      const regex = new RegExp(matchExpr, 'i');
      const asset = assets.find((a) => regex.test(a.name || ''));

      if (asset && asset.browser_download_url) {
        btn.href = proxify(asset.browser_download_url);
      } else {
        btn.href = proxify(data.html_url || fallbackRaw);
      }
    } catch {
      btn.href = fallback;
    }
  }
});