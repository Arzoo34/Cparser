/**
 * Theme toggle with SVG icons (no emoji — avoids encoding/font issues).
 */
(function () {
  const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
  const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`;

  function setThemeIcon(el, theme) {
    if (!el) return;
    el.innerHTML = theme === "dark" ? MOON_SVG : SUN_SVG;
  }

  window.CParserTheme = {
    apply(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("cparser-theme", theme);
      document.querySelectorAll(".theme-toggle-icon, #theme-icon").forEach((el) => {
        setThemeIcon(el, theme);
      });
    },
    init() {
      const saved = localStorage.getItem("cparser-theme") || "dark";
      this.apply(saved);
      document.querySelectorAll("#theme-toggle, .theme-toggle").forEach((btn) => {
        btn.addEventListener("click", () => {
          const next =
            document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
          this.apply(next);
        });
      });
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.CParserTheme.init());
  } else {
    window.CParserTheme.init();
  }
})();
