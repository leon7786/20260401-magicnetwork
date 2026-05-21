     1|document.addEventListener('DOMContentLoaded', async () => {
     2|  const buttons = document.querySelectorAll('a.download-latest[data-repo]');
     3|  const allButtons = document.querySelectorAll('.md-typeset a.md-button');
     4|  const cache = new Map();
     5|  const proxyPrefix = 'https://p.etime.vip/';
     6|
     7|  const detectLocale = () => {
     8|    const lang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
     9|    const l = lang.toLowerCase();
    10|    if (!l.startsWith('zh')) return 'en';
    11|    if (l.includes('tw') || l.includes('hk') || l.includes('mo') || l.includes('hant')) return 'zh-Hant-TW';
    12|    return 'zh-Hans';
    13|  };
    14|
    15|  const locale = detectLocale();
    16|  const labels = {
    17|    'zh-Hans': { download: '下载地址：', source: '来源信息：' },
    18|    'zh-Hant-TW': { download: '下載地址：', source: '來源資訊：' },
    19|    en: { download: 'Download:', source: 'Sources:' }
    20|  };
    21|  const labelSet = labels[locale] || labels.en;
    22|
    23|  const firstButtons = [];
    24|
    25|  allButtons.forEach((btn) => {
    26|    const prev = btn.previousElementSibling;
    27|    if (prev && (prev.matches('a.md-button') || prev.classList.contains('download-label'))) {
    28|      return;
    29|    }
    30|
    31|    const label = document.createElement('p');
    32|    label.className = 'download-label';
    33|    label.textContent = labelSet.download;
    34|    btn.parentNode.insertBefore(label, btn);
    35|    firstButtons.push(btn);
    36|  });
    37|
    38|  const processedInfoLists = new Set();
    39|
    40|  firstButtons.forEach((btn) => {
    41|    const listContainer = btn.closest('ul');
    42|    const buttonBlock = btn.closest('p') || btn.parentElement;
    43|
    44|    let infoList = null;
    45|    if (listContainer && listContainer.querySelector('a.md-button')) {
    46|      infoList = listContainer;
    47|    } else if (buttonBlock) {
    48|      infoList = buttonBlock.previousElementSibling;
    49|      if (infoList && infoList.classList.contains('source-label')) {
    50|        infoList = infoList.previousElementSibling;
    51|      }
    52|    }
    53|
    54|    if (!infoList || infoList.tagName !== 'UL' || processedInfoLists.has(infoList)) return;
    55|    processedInfoLists.add(infoList);
    56|
    57|    const hasSourceContent = Boolean(infoList.textContent && infoList.textContent.trim());
    58|    if (!hasSourceContent) return;
    59|
    60|    const sourceItems = [];
    61|    infoList.querySelectorAll(':scope > li').forEach((item) => {
    62|      const clone = item.cloneNode(true);
    63|      clone.querySelectorAll('.download-label, a.md-button').forEach((node) => node.remove());
    64|      if ((clone.textContent || '').trim()) {
    65|        sourceItems.push(clone);
    66|      }
    67|    });
    68|
    69|    if (!sourceItems.length) return;
    70|
    71|    const buttonNodes = Array.from(infoList.querySelectorAll('a.md-button'));
    72|    if (!buttonNodes.length && buttonBlock) {
    73|      buttonNodes.push(...Array.from(buttonBlock.querySelectorAll('a.md-button')));
    74|    }
    75|
    76|    if (!buttonNodes.length) return;
    77|
    78|    let downloadLabel = buttonNodes[0].previousElementSibling;
    79|    if (!downloadLabel || !downloadLabel.classList.contains('download-label')) {
    80|      downloadLabel = document.createElement('p');
    81|      downloadLabel.className = 'download-label';
    82|      downloadLabel.textContent = labelSet.download;
    83|    }
    84|
    85|    const downloadGroup = document.createElement('div');
    86|    downloadGroup.className = 'download-group';
    87|    downloadGroup.appendChild(downloadLabel);
    88|    buttonNodes.forEach((node) => downloadGroup.appendChild(node));
    89|
    90|    const sourceList = document.createElement('ul');
    91|    sourceItems.forEach((item) => sourceList.appendChild(item));
    92|
    93|    const prev = infoList.previousElementSibling;
    94|    const hasSectionTitle = prev && (prev.classList.contains('source-label') || prev.tagName === 'H2' || prev.tagName === 'H3');
    95|
    96|    let sourceLabel = prev && prev.classList.contains('source-label') ? prev : null;
    97|    if (!sourceLabel && !hasSectionTitle) {
    98|      sourceLabel = document.createElement('p');
    99|      sourceLabel.className = 'source-label';
   100|      sourceLabel.textContent = labelSet.source;
   101|    }
   102|
   103|    infoList.insertAdjacentElement('beforebegin', downloadGroup);
   104|    if (sourceLabel) {
   105|      downloadGroup.insertAdjacentElement('afterend', sourceLabel);
   106|      sourceLabel.insertAdjacentElement('afterend', sourceList);
   107|    } else {
   108|      downloadGroup.insertAdjacentElement('afterend', sourceList);
   109|    }
   110|
   111|    infoList.remove();
   112|  });
   113|
   114|  const proxify = (url) => {
   115|    if (!url) return url;
   116|    if (url.startsWith(proxyPrefix)) return url;
   117|    if (url.startsWith('https://github.com/')) return `${proxyPrefix}${url}`;
   118|    return url;
   119|  };
   120|
   121|  const getLatest = async (repo) => {
   122|    if (cache.has(repo)) return cache.get(repo);
   123|    const url = `https://api.github.com/repos/${repo}/releases/latest`;
   124|    const res = await fetch(url);
   125|    if (!res.ok) throw new Error(`Failed to fetch latest release for ${repo}`);
   126|    const data = await res.json();
   127|    cache.set(repo, data);
   128|    return data;
   129|  };
   130|
   131|  for (const btn of buttons) {
   132|    const repo = btn.dataset.repo;
   133|    const matchExpr = btn.dataset.match || '';
   134|    const fallbackRaw = btn.dataset.fallback || `https://github.com/${repo}/releases/latest`;
   135|    const fallback = proxify(fallbackRaw);
   136|
   137|    if (!repo) continue;
   138|
   139|    btn.href = fallback;
   140|    btn.target = '_blank';
   141|    btn.rel = 'noopener';
   142|
   143|    try {
   144|      const data = await getLatest(repo);
   145|      const assets = data.assets || [];
   146|
   147|      if (!matchExpr) {
   148|        btn.href = proxify(data.html_url || fallbackRaw);
   149|        continue;
   150|      }
   151|
   152|      const regex = new RegExp(matchExpr, 'i');
   153|      const asset = assets.find((a) => regex.test(a.name || ''));
   154|
   155|      if (asset && asset.browser_download_url) {
   156|        btn.href = proxify(asset.browser_download_url);
   157|      } else {
   158|        btn.href = proxify(data.html_url || fallbackRaw);
   159|      }
   160|    } catch {
   161|      btn.href = fallback;
   162|    }
   163|  }
   164|});