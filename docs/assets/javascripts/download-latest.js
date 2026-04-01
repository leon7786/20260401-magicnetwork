document.addEventListener('DOMContentLoaded', async () => {
  const buttons = document.querySelectorAll('a.download-latest[data-repo]');
  const cache = new Map();

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
    const fallback = btn.dataset.fallback || `https://github.com/${repo}/releases/latest`;

    if (!repo) continue;

    btn.href = fallback;
    btn.target = '_blank';
    btn.rel = 'noopener';

    try {
      const data = await getLatest(repo);
      const assets = data.assets || [];

      if (!matchExpr) {
        btn.href = data.html_url || fallback;
        continue;
      }

      const regex = new RegExp(matchExpr, 'i');
      const asset = assets.find((a) => regex.test(a.name || ''));

      if (asset && asset.browser_download_url) {
        btn.href = asset.browser_download_url;
      } else {
        btn.href = data.html_url || fallback;
      }
    } catch {
      btn.href = fallback;
    }
  }
});