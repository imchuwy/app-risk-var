/* Load early in <head>, before themed content is painted. No module dependency.
   Connect an accessible System / Light / Dark control to OCAITheme.set(). */
(() => {
  const key = 'oc-ai-theme';
  const allowed = new Set(['system', 'light', 'dark']);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  try { const saved = localStorage.getItem(key); if (allowed.has(saved)) preference = saved; } catch {}
  function apply() {
    const resolved = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
    window.dispatchEvent(new CustomEvent('oc-ai-theme-change', { detail: { preference, resolved } }));
  }
  window.OCAITheme = {
    get: () => preference,
    set(value) {
      if (!allowed.has(value)) throw new TypeError('Theme must be system, light or dark');
      preference = value;
      try { localStorage.setItem(key, value); } catch {}
      apply();
    }
  };
  media.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = allowed.has(event.newValue) ? event.newValue : 'system';
      apply();
    }
  });
  apply();
})();
