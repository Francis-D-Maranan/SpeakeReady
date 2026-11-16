/* Apply the saved theme before the stylesheet is painted to avoid a theme flash. */
(() => {
  const preference = () => {
    try {
      return localStorage.getItem("sr_theme");
    } catch (_) {
      return null;
    }
  };
  const systemPreference = window.matchMedia?.("(prefers-color-scheme: dark)");
  const saved = preference();
  const theme =
    saved === "light" || saved === "dark"
      ? saved
      : systemPreference?.matches
        ? "dark"
        : "light";
  document.documentElement.dataset.theme = theme;
  if (systemPreference?.addEventListener && !saved) {
    systemPreference.addEventListener("change", (event) => {
      if (!preference())
        document.documentElement.dataset.theme = event.matches
          ? "dark"
          : "light";
    });
  }
})();
