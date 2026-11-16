document.addEventListener("DOMContentLoaded", () => {
  const id = Number(new URLSearchParams(location.search).get("id") || 1),
    m = (window.SR_MODULES || []).find((x) => x.id === id),
    S = window.SpeakReady,
    holder = document.getElementById("lesson-detail");
  if (!m) {
    holder.innerHTML =
      '<div class="empty-note">This lesson could not be found. <a class="text-link" href="lessons.html">Return to learning modules</a>.</div>';
    return;
  }
  const done = S.get(S.keys.completed, []).includes(m.id);
  holder.innerHTML = `<section class="lesson-hero"><div class="lesson-meta"><span>MODULE ${String(m.id).padStart(2, "0")}</span><span class="tag">${m.tag}</span><span>${m.duration}</span>${done ? '<span class="status-pill done">Completed</span>' : ""}</div><h1>${m.title}</h1><p>${m.short}</p></section><section class="lesson-content-card"><h2>What you will learn</h2><p>${m.objective}</p></section><section class="lesson-content-card"><h2>Lesson overview</h2><p>${m.intro}</p></section><section class="lesson-content-card"><h2>Key points to remember</h2><ul>${m.points.map((p) => `<li>${p}</li>`).join("")}</ul><div class="tip-box"><strong>Practice reminder</strong><br>${m.tip}</div></section><section class="lesson-content-card"><h2>Try it: put the lesson into practice</h2><p>${m.activity}</p><a class="button button-outline" href="practice.html">Go to Practice Studio →</a></section><div class="lesson-actions"><a class="button button-quiet" href="lessons.html">← Back to modules</a><button class="button button-primary" id="complete-lesson">${done ? "Mark as not completed" : "Mark lesson as complete"} ✓</button></div>`;
  document.getElementById("complete-lesson").addEventListener("click", () => {
    let list = S.get(S.keys.completed, []);
    const isDone = list.includes(m.id);
    list = isDone ? list.filter((x) => x !== m.id) : [...list, m.id];
    S.set(S.keys.completed, list);
    S.toast(
      isDone ? "Lesson completion removed." : "Lesson marked as complete.",
    );
    setTimeout(() => location.reload(), 450);
  });
});
