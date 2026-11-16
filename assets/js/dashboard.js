document.addEventListener("DOMContentLoaded", () => {
  const S = window.SpeakReady,
    modules = window.SR_MODULES || [];
  if (!S) return;
  const completed = S.get(S.keys.completed, []),
    practice = S.get(S.keys.practice, []),
    quiz = S.get(S.keys.quiz, null);
  document.getElementById("stat-lessons").textContent =
    `${completed.length} / ${modules.length}`;
  document.getElementById("stat-practice").textContent = practice.length;
  document.getElementById("stat-quiz").textContent = quiz
    ? `${quiz.score}%`
    : "—";
  const date = document.getElementById("today-date");
  if (date)
    date.textContent = new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date());
  const holder = document.getElementById("dashboard-modules");
  holder.innerHTML = modules
    .slice(0, 3)
    .map((m) => {
      const done = completed.includes(m.id);
      return `<a class="module-card" href="lesson.html?id=${m.id}"><div class="module-top"><span class="module-number">MODULE ${String(m.id).padStart(2, "0")}</span><span class="module-symbol" style="background:${m.color};color:${m.ink}">${m.symbol}</span></div><h3>${m.title}</h3><p>${m.short}</p><div class="module-card-footer"><span class="module-duration">${m.duration} · ${m.tag}</span><span class="tag">${done ? "Completed" : "Open lesson"}</span></div><div class="progress-track"><div class="progress-fill" style="width:${done ? 100 : 0}%"></div></div></a>`;
    })
    .join("");
});
