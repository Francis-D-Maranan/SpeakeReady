document.addEventListener("DOMContentLoaded", () => {
  const S = window.SpeakReady;
  const I = window.SR_I18N;
  const modules = window.SR_MODULES || [];
  if (!S || !I) return;
  const T = I.t;

  function render() {
    const lang = I.language;
    const locale = lang === "fil" ? "fil-PH" : "en-US";
    const completed = S.get(S.keys.completed, []);
    const practice = S.get(S.keys.practice, []);
    const quiz = S.get(S.keys.quiz, null);
    document.getElementById("stat-lessons").textContent =
      `${completed.length} / ${modules.length}`;
    document.getElementById("stat-practice").textContent = practice.length;
    document.getElementById("stat-quiz").textContent = quiz
      ? `${quiz.score}%`
      : "—";
    const date = document.getElementById("today-date");
    if (date)
      date.textContent = new Intl.DateTimeFormat(locale, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(new Date());
    const holder = document.getElementById("dashboard-modules");
    holder.innerHTML = modules
      .slice(0, 3)
      .map((module) => {
        const m = module[lang];
        const done = completed.includes(module.id);
        return `<a class="module-card" href="lesson.html?id=${module.id}">
        <div class="module-top"><span class="module-number">${T("common.module")} ${String(module.id).padStart(2, "0")}</span><span class="module-symbol" style="background:${module.color};color:${module.ink}" aria-hidden="true">${module.symbol}</span></div>
        <h3>${m.title}</h3><p>${m.short}</p>
        <div class="module-card-footer"><span class="module-duration">${m.duration} · ${m.tag}</span><span class="tag">${T(done ? "common.completed" : "common.openLesson")}</span></div>
        <div class="progress-track" aria-label="${done ? "100%" : "0%"}"><div class="progress-fill" style="width:${done ? 100 : 0}%"></div></div>
      </a>`;
      })
      .join("");
  }
  render();
  document.addEventListener("sr:languagechange", render);
});
