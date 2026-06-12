// oc-theme-preload.js
// Simple theme preloader: sets a data attribute on the document based on system preference.
(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
})();
