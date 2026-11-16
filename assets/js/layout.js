(() => {
  const body = document.body;
  const base = body.dataset.base || "./";
  const page = body.dataset.page || "home";
  const navItems = [
    ["dashboard", "▦", "Dashboard", "pages/dashboard.html"],
    ["lessons", "▤", "Learning modules", "pages/lessons.html"],
    ["practice", "◉", "Practice studio", "pages/practice.html"],
    ["assessment", "✓", "Assessments", "pages/assessment.html"],
    ["progress", "↗", "My progress", "pages/progress.html"],
    ["resources", "⌘", "Learning resources", "pages/resources.html"],
  ];
  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `<header class="site-header"><button class="menu-toggle" id="menu-toggle" aria-label="Open navigation" aria-expanded="false">☰</button><a class="header-brand" href="${base}index.html" aria-label="SpeakReady home"><span class="brand-mark">S</span><span class="brand-word">Speak<span>Ready</span></span></a><div class="header-right"><a class="header-link" href="${base}pages/resources.html">How to use SpeakReady</a><a class="header-cta" href="${base}pages/practice.html">Practice now <span aria-hidden="true">→</span></a></div></header>`;
  }
  if (page !== "home") {
    const frame = document.querySelector(".app-frame");
    if (frame) {
      const sidebar = document.createElement("aside");
      sidebar.className = "sidebar";
      sidebar.id = "sidebar";
      sidebar.setAttribute("aria-label", "Main navigation");
      sidebar.innerHTML = `<div><div class="side-label">LEARNING SPACE</div><nav class="side-nav">${navItems.map(([id, icon, label, path]) => `<a class="side-link ${page === id ? "active" : ""}" href="${base}${path}" ${page === id ? 'aria-current="page"' : ""}><span class="side-icon" aria-hidden="true">${icon}</span>${label}</a>`).join("")}</nav></div><div class="sidebar-bottom"><strong>Keep going, at your pace.</strong><p>Every practice session is a chance to learn something about your speaking.</p><a href="${base}pages/practice.html">Try a speaking prompt →</a></div>`;
      frame.prepend(sidebar);
      const backdrop = document.createElement("div");
      backdrop.className = "sidebar-backdrop";
      backdrop.id = "sidebar-backdrop";
      document.body.append(backdrop);
    }
  }
  const menu = document.getElementById("menu-toggle");
  const side = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  function closeMenu() {
    side?.classList.remove("open");
    backdrop?.classList.remove("show");
    menu?.setAttribute("aria-expanded", "false");
    menu?.setAttribute("aria-label", "Open navigation");
  }
  menu?.addEventListener("click", () => {
    const open = !side.classList.contains("open");
    side.classList.toggle("open", open);
    backdrop.classList.toggle("show", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
  });
  backdrop?.addEventListener("click", closeMenu);
  side
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
  document
    .querySelectorAll("[data-year]")
    .forEach((el) => (el.textContent = new Date().getFullYear()));
  window.SpeakReady = window.SpeakReady || {};
  window.SpeakReady.base = base;
  window.SpeakReady.keys = {
    completed: "sr_completed_modules",
    quiz: "sr_latest_quiz",
    practice: "sr_practice_sessions",
    ratings: "sr_last_ratings",
  };
  window.SpeakReady.get = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };
  window.SpeakReady.set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };
  window.SpeakReady.toast = (message) => {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      document.body.append(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(window.__srToast);
    window.__srToast = setTimeout(() => el.classList.remove("show"), 2600);
  };
})();
