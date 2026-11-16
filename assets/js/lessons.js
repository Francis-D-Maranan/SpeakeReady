document.addEventListener("DOMContentLoaded", () => {
  const modules = window.SR_MODULES || [],
    done = window.SpeakReady.get(window.SpeakReady.keys.completed, []);
  document.getElementById("lesson-grid").innerHTML = modules
    .map(
      (m) =>
        `<a class="lesson-card" href="lesson.html?id=${m.id}"><div class="lesson-symbol" style="background:${m.color};color:${m.ink}">${m.symbol}</div><div><div class="lesson-meta"><span>MODULE ${String(m.id).padStart(2, "0")}</span><span class="tag">${m.tag}</span>${done.includes(m.id) ? '<span class="status-pill done">Completed</span>' : ""}</div><h3>${m.title}</h3><p>${m.short}</p><div class="lesson-meta"><span>${m.duration}</span><span>·</span><span>${done.includes(m.id) ? "Review lesson" : "Open lesson →"}</span></div></div></a>`,
    )
    .join("");
});
