(() => {
  const body = document.body;
  const base = body.dataset.base || "./";
  const page = body.dataset.page || "home";
  const I18N = window.SR_I18N;
  const t = (key) => (I18N ? I18N.t(key) : key);
  const navItems = [
    ["dashboard", "▦", "nav.dashboard", "pages/dashboard.html"],
    ["lessons", "▤", "nav.lessons", "pages/lessons.html"],
    ["practice", "◉", "nav.practice", "pages/practice.html"],
    ["assessment", "✓", "nav.assessment", "pages/assessment.html"],
    ["progress", "↗", "nav.progress", "pages/progress.html"],
    ["resources", "⌘", "nav.resources", "pages/resources.html"],
  ];

  const header = document.getElementById("site-header");
  if (header) {
    const languages = I18N?.languages || [
      { code: "en", name: "English" },
      { code: "fil", name: "Filipino" },
    ];
    header.innerHTML = `
      <header class="site-header">
        <button class="menu-toggle" id="menu-toggle" type="button" data-i18n-aria-label="common.openNav" aria-label="${t("common.openNav")}" aria-expanded="false" aria-controls="sidebar">☰</button>
        <a class="header-brand" href="${base}index.html" data-i18n-aria-label="common.home" aria-label="${t("common.home")}"><span class="brand-mark">S</span><span class="brand-word">Speak<span>Ready</span></span></a>
        <div class="header-right">
          <a class="header-link" href="${base}pages/resources.html" data-i18n="header.howTo">${t("header.howTo")}</a>
          <label class="language-control">
            <span class="sr-only" data-i18n="common.chooseLanguage">${t("common.chooseLanguage")}</span>
            <select id="language-switcher" data-i18n-aria-label="common.chooseLanguage" aria-label="${t("common.chooseLanguage")}" aria-describedby="language-hint">${languages.map((lang) => `<option value="${lang.code}">${lang.name}</option>`).join("")}</select>
            <span class="sr-only" id="language-hint" data-i18n="common.moreLanguages">${t("common.moreLanguages")}</span>
          </label>
          <button class="theme-toggle" id="theme-toggle" type="button" aria-label="${t("common.switchDark")}" title="${t("common.switchDark")}" aria-pressed="false"><span aria-hidden="true">☾</span><span class="control-text">Dark</span></button>
          <a class="header-cta" href="${base}pages/practice.html"><span data-i18n="header.practiceNow">${t("header.practiceNow")}</span> <span aria-hidden="true">→</span></a>
        </div>
      </header>`;
  }

  if (page !== "home") {
    const frame = document.querySelector(".app-frame");
    if (frame) {
      const sidebar = document.createElement("aside");
      sidebar.className = "sidebar";
      sidebar.id = "sidebar";
      sidebar.setAttribute("aria-label", t("common.learningSpace"));
      sidebar.innerHTML = `
        <div>
          <div class="side-label">${t("common.learningSpace")}</div>
          <nav class="side-nav" aria-label="${t("common.learningSpace")}">
            ${navItems.map(([id, icon, label, path]) => `<a class="side-link ${page === id ? "active" : ""}" href="${base}${path}" ${page === id ? 'aria-current="page"' : ""}><span class="side-icon" aria-hidden="true">${icon}</span><span>${t(label)}</span></a>`).join("")}
          </nav>
        </div>
        <div class="sidebar-bottom">
          <strong>${t("common.keepGoing")}</strong>
          <p>${t("common.keepGoingText")}</p>
          <a href="${base}pages/practice.html">${t("common.tryPrompt")}</a>
        </div>`;
      frame.prepend(sidebar);
      const backdrop = document.createElement("button");
      backdrop.className = "sidebar-backdrop";
      backdrop.id = "sidebar-backdrop";
      backdrop.type = "button";
      backdrop.setAttribute("aria-label", t("common.closeNav"));
      document.body.append(backdrop);
    }
  }

  const menu = document.getElementById("menu-toggle");
  const side = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const mobileNavQuery = window.matchMedia("(max-width: 760px)");
  function syncSidebarAccessibility() {
    if (side)
      side.inert = mobileNavQuery.matches && !side.classList.contains("open");
  }
  function closeMenu() {
    side?.classList.remove("open");
    syncSidebarAccessibility();
    backdrop?.classList.remove("show");
    menu?.setAttribute("aria-expanded", "false");
    menu?.setAttribute("aria-label", t("common.openNav"));
  }
  syncSidebarAccessibility();
  mobileNavQuery.addEventListener?.("change", syncSidebarAccessibility);
  menu?.addEventListener("click", () => {
    const open = !side?.classList.contains("open");
    side?.classList.toggle("open", open);
    syncSidebarAccessibility();
    backdrop?.classList.toggle("show", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      t(open ? "common.closeNav" : "common.openNav"),
    );
    if (open) side?.querySelector("a")?.focus();
  });
  backdrop?.addEventListener("click", closeMenu);
  side
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = year;
  });

  window.SpeakReady = window.SpeakReady || {};
  window.SpeakReady.base = base;
  window.SpeakReady.keys = {
    completed: "sr_completed_modules",
    quiz: "sr_latest_quiz",
    practice: "sr_practice_sessions",
    ratings: "sr_last_ratings",
    language: "sr_language",
    theme: "sr_theme",
  };
  window.SpeakReady.get = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_) {
      return fallback;
    }
  };
  window.SpeakReady.set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  };
  window.SpeakReady.toast = (message) => {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.append(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(window.__srToast);
    window.__srToast = setTimeout(() => el.classList.remove("show"), 2600);
  };

  const languageSwitch = document.getElementById("language-switcher");
  languageSwitch?.addEventListener("change", (event) =>
    I18N?.setLanguage(event.target.value),
  );

  const themeButton = document.getElementById("theme-toggle");
  themeButton?.addEventListener("click", () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("sr_theme", next);
    } catch (_) {}
    I18N?.updateThemeButton(themeButton);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#0b1220" : "#17243b");
  });

  I18N?.apply(document);
  I18N?.updateThemeButton(themeButton);
  document.addEventListener("sr:languagechange", () => {
    // Navigation is shared markup, so refresh its labels without changing the current route.
    const nav = side?.querySelector(".side-nav");
    if (nav)
      nav.innerHTML = navItems
        .map(
          ([id, icon, label, path]) =>
            `<a class="side-link ${page === id ? "active" : ""}" href="${base}${path}" ${page === id ? 'aria-current="page"' : ""}><span class="side-icon" aria-hidden="true">${icon}</span><span>${t(label)}</span></a>`,
        )
        .join("");
    if (side) {
      side.setAttribute("aria-label", t("common.learningSpace"));
      const label = side.querySelector(".side-label");
      if (label) label.textContent = t("common.learningSpace");
      const strong = side.querySelector(".sidebar-bottom strong");
      if (strong) strong.textContent = t("common.keepGoing");
      const p = side.querySelector(".sidebar-bottom p");
      if (p) p.textContent = t("common.keepGoingText");
      const a = side.querySelector(".sidebar-bottom a");
      if (a) a.textContent = t("common.tryPrompt");
      side
        .querySelectorAll("a")
        .forEach((link) => link.addEventListener("click", closeMenu));
    }
    menu?.setAttribute(
      "aria-label",
      side?.classList.contains("open")
        ? t("common.closeNav")
        : t("common.openNav"),
    );
    backdrop?.setAttribute("aria-label", t("common.closeNav"));
  });
})();
