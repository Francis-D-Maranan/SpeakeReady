document.addEventListener("DOMContentLoaded", () => {
  const I = window.SR_I18N,
    S = window.SpeakReady,
    modules = window.SR_MODULES || [];
  if (!I || !S) return;
  function render() {
    const T = I.t,
      lang = I.language,
      done = S.get(S.keys.completed, []);
    document.getElementById("lesson-grid").innerHTML = modules
      .map((module) => {
        const m = module[lang],
          complete = done.includes(module.id);
        return `<a class="lesson-card" href="lesson.html?id=${module.id}">
        <div class="lesson-symbol" style="background:${module.color};color:${module.ink}" aria-hidden="true">${module.symbol}</div>
        <div><div class="lesson-meta"><span>${T("common.module")} ${String(module.id).padStart(2, "0")}</span><span class="tag">${m.tag}</span>${complete ? `<span class="status-pill done">${T("common.completed")}</span>` : ""}</div>
        <h3>${m.title}</h3><p>${m.short}</p>
        <div class="lesson-meta"><span>${m.duration}</span><span aria-hidden="true">·</span><span>${T(complete ? "common.reviewLesson" : "common.openLesson")} →</span></div></div>
      </a>`;
      })
      .join("");
  }
  render();
  document.addEventListener("sr:languagechange", render);
});
