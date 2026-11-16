document.addEventListener("DOMContentLoaded", () => {
  const I = window.SR_I18N,
    S = window.SpeakReady,
    modules = window.SR_MODULES || [];
  const id = Number(new URLSearchParams(location.search).get("id") || 1);
  const module = modules.find((item) => item.id === id);
  const holder = document.getElementById("lesson-detail");
  if (!I || !S) return;
  let done = S.get(S.keys.completed, []).includes(id);

  function render() {
    const T = I.t;
    if (!module) {
      holder.innerHTML = `<div class="empty-note">${T("common.lessonMissing")} <a class="text-link" href="lessons.html">${T("common.returnLessons")}</a>.</div>`;
      return;
    }
    const m = module[I.language];
    holder.innerHTML = `
      <section class="lesson-hero"><div class="lesson-meta"><span>${T("common.module")} ${String(module.id).padStart(2, "0")}</span><span class="tag">${m.tag}</span><span>${m.duration}</span>${done ? `<span class="status-pill done">${T("common.completed")}</span>` : ""}</div><h1>${m.title}</h1><p>${m.short}</p></section>
      <section class="lesson-content-card"><h2>${T("lesson.objective")}</h2><p>${m.objective}</p></section>
      <section class="lesson-content-card"><h2>${T("lesson.overview")}</h2><p>${m.intro}</p></section>
      <section class="lesson-content-card"><h2>${T("lesson.points")}</h2><ul>${m.points.map((point) => `<li>${point}</li>`).join("")}</ul><div class="tip-box"><strong>${T("lesson.tip")}</strong><br>${m.tip}</div></section>
      <section class="lesson-content-card"><h2>${T("lesson.try")}</h2><p>${m.activity}</p><a class="button button-outline" href="practice.html">${T("lesson.practiceLink")} →</a></section>
      <div class="lesson-actions"><a class="button button-quiet" href="lessons.html">${T("lesson.back")}</a><button class="button button-primary" id="complete-lesson" type="button">${T(done ? "lesson.markUndone" : "lesson.markDone")} ✓</button></div>`;
    document.getElementById("complete-lesson").addEventListener("click", () => {
      const list = S.get(S.keys.completed, []);
      done = list.includes(module.id);
      const next = done
        ? list.filter((item) => item !== module.id)
        : [...list, module.id];
      S.set(S.keys.completed, next);
      done = !done;
      S.toast(T(done ? "common.lessonComplete" : "common.lessonIncomplete"));
      render();
    });
  }
  render();
  document.addEventListener("sr:languagechange", render);
});
