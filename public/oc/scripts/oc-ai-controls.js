/* Load with defer, after the early theme initializer. */
(() => {
  const syncTheme = () => {
    document.querySelectorAll('[data-oc-theme]').forEach((select) => {
      select.value = window.OCAITheme.get();
    });
  };
  syncTheme();
  window.addEventListener('oc-ai-theme-change', syncTheme);
  document.addEventListener('change', (event) => {
    if (event.target.matches('select[data-oc-theme]')) window.OCAITheme.set(event.target.value);
  });

  // Native dialogs handle focus containment, Escape, and return to the opener.
  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-oc-dialog]');
    if (!opener) return;
    const panel = document.getElementById(opener.dataset.ocDialog);
    if (panel instanceof HTMLDialogElement && !panel.open) panel.showModal();
  });

  // The browser handles popover dismissal and focus. Only position the open panel.
  function positionHelp(opener, panel) {
    const margin = 12;
    const gap = 6;
    const anchor = opener.getBoundingClientRect();
    const { width, height } = panel.getBoundingClientRect();
    const viewport = document.documentElement;
    const left = Math.max(margin, Math.min(anchor.left, viewport.clientWidth - width - margin));
    const below = anchor.bottom + gap;
    const above = anchor.top - height - gap;
    const top = below + height <= viewport.clientHeight - margin ? below : Math.max(margin, above);
    panel.style.inset = top + 'px auto auto ' + left + 'px';
    panel.style.margin = '0';
  }
  document.addEventListener(
    'toggle',
    (event) => {
      const panel = event.target;
      if (!panel.matches('.oc-popover') || event.newState !== 'open') return;
      const opener =
        event.source || document.querySelector('[popovertarget="' + CSS.escape(panel.id) + '"]');
      if (!opener) return;
      positionHelp(opener, panel);
      const reposition = () => positionHelp(opener, panel);
      window.addEventListener('resize', reposition);
      window.addEventListener('scroll', reposition, true);
      panel.addEventListener(
        'toggle',
        () => {
          window.removeEventListener('resize', reposition);
          window.removeEventListener('scroll', reposition, true);
        },
        { once: true },
      );
    },
    true,
  );
})();
