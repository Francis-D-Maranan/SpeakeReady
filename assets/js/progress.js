document.addEventListener("DOMContentLoaded", () => {
  const S = window.SpeakReady,
    mods = window.SR_MODULES || [],
    done = S.get(S.keys.completed, []),
    quiz = S.get(S.keys.quiz, null),
    sessions = S.get(S.keys.practice, []);
  document.getElementById("progress-fraction").textContent =
    `${done.length} / ${mods.length}`;
  document.getElementById("overall-progress").style.width =
    `${(done.length / mods.length) * 100}%`;
  document.getElementById("progress-copy").textContent =
    done.length === mods.length
      ? "You have completed all six learning modules."
      : `${mods.length - done.length} module${mods.length - done.length === 1 ? "" : "s"} remaining.`;
  document.getElementById("progress-quiz").textContent = quiz
    ? `${quiz.score}%`
    : "—";
  document.getElementById("quiz-detail").textContent = quiz
    ? `${quiz.correct} of ${quiz.total} correct · ${new Date(quiz.date).toLocaleDateString()}`
    : "No assessment completed yet.";
  document.getElementById("module-progress-list").innerHTML = mods
    .map(
      (m) =>
        `<div class="progress-module-row"><div><strong>${m.title}</strong><small>Module ${String(m.id).padStart(2, "0")} · ${m.duration}</small></div><span class="status-pill ${done.includes(m.id) ? "done" : ""}">${done.includes(m.id) ? "Completed" : "Not completed"}</span></div>`,
    )
    .join("");
  document.getElementById("practice-count").textContent = sessions.length
    ? `${sessions.length} practice session${sessions.length === 1 ? "" : "s"} recorded.`
    : "No practice sessions recorded yet.";
  document.getElementById("practice-list").innerHTML =
    sessions
      .slice(-5)
      .reverse()
      .map(
        (s) =>
          `<div class="progress-module-row"><div><strong>${s.topic || "Speaking practice"}</strong><small>${s.language || ""} · ${new Date(s.date).toLocaleString()}</small>${s.reflection ? `<small>Reflection: ${escapeHtml(s.reflection)}</small>` : ""}</div><span class="status-pill done">Saved</span></div>`,
      )
      .join("") ||
    '<p class="panel-intro">Your completed practice sessions will appear here.</p>';
  function escapeHtml(t) {
    return String(t).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  document.getElementById("reset-progress").addEventListener("click", () => {
    if (
      confirm(
        "Reset lessons, quiz results, and practice history saved in this browser?",
      )
    ) {
      [S.keys.completed, S.keys.quiz, S.keys.practice, S.keys.ratings].forEach(
        (k) => localStorage.removeItem(k),
      );
      S.toast("Local progress has been reset.");
      setTimeout(() => location.reload(), 400);
    }
  });
});
