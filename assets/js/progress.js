document.addEventListener("DOMContentLoaded", () => {
  const I = window.SR_I18N,
    S = window.SpeakReady,
    modules = window.SR_MODULES || [];
  if (!I || !S) return;
  const escapeHtml = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );

  function render() {
    const T = I.t,
      lang = I.language,
      locale = lang === "fil" ? "fil-PH" : "en-US";
    const completed = S.get(S.keys.completed, []);
    const quiz = S.get(S.keys.quiz, null);
    const sessions = S.get(S.keys.practice, []);
    const percent = modules.length
      ? (completed.length / modules.length) * 100
      : 0;
    document.getElementById("progress-fraction").textContent =
      `${completed.length} / ${modules.length}`;
    document.getElementById("overall-progress").style.width = `${percent}%`;
    document.getElementById("progress-copy").textContent =
      completed.length === modules.length
        ? T("progress.allDone")
        : `${modules.length - completed.length} ${T(modules.length - completed.length === 1 ? "progress.remainingOne" : "progress.remainingMany")}`;
    document.getElementById("progress-quiz").textContent = quiz
      ? `${quiz.score}%`
      : "—";
    document.getElementById("quiz-detail").textContent = quiz
      ? T("progress.quizDetail", {
          correct: quiz.correct,
          total: quiz.total,
          date: new Intl.DateTimeFormat(locale).format(new Date(quiz.date)),
        })
      : T("common.noQuiz");
    document.getElementById("module-progress-list").innerHTML = modules
      .map((module) => {
        const m = module[lang],
          done = completed.includes(module.id);
        return `<div class="progress-module-row"><div><strong>${escapeHtml(m.title)}</strong><small>${T("common.module")} ${String(module.id).padStart(2, "0")} · ${escapeHtml(m.duration)}</small></div><span class="status-pill ${done ? "done" : ""}">${T(done ? "common.completed" : "common.notCompleted")}</span></div>`;
      })
      .join("");
    document.getElementById("practice-count").textContent = sessions.length
      ? T(
          sessions.length === 1
            ? "progress.practiceCountOne"
            : "progress.practiceCountMany",
          { count: sessions.length },
        )
      : T("progress.noPractice");
    document.getElementById("practice-list").innerHTML =
      sessions
        .slice(-5)
        .reverse()
        .map((session) => {
          const topicName = Number.isInteger(session.topicId)
            ? session.language === "Filipino"
              ? [
                  ["Kasanayang nais kong matutuhan"],
                  ["Pagpapabuting makatutulong sa paaralan"],
                  ["Bakit mahalaga ang pagtutulungan"],
                  ["Aklat, laro, o kuwentong kinagigiliwan ko"],
                  ["Responsableng paggamit ng teknolohiya"],
                ][session.topicId]?.[0]
              : [
                  ["A skill I want to learn"],
                  ["A helpful school improvement"],
                  ["Why teamwork matters"],
                  ["A book, game, or story I enjoy"],
                  ["Using technology responsibly"],
                ][session.topicId]?.[0]
            : session.topic || T("practice.title");
          const date = new Intl.DateTimeFormat(locale, {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(session.date));
          return `<div class="progress-module-row"><div><strong>${escapeHtml(topicName || T("practice.title"))}</strong><small>${escapeHtml(session.language || "")} · ${date}</small>${session.reflection ? `<small>${T("common.reflection")}: ${escapeHtml(session.reflection)}</small>` : ""}</div><span class="status-pill done">${T("common.saved")}</span></div>`;
        })
        .join("") || `<p class="panel-intro">${T("common.noSessions")}</p>`;
  }
  render();
  document.addEventListener("sr:languagechange", render);
  document.getElementById("reset-progress").addEventListener("click", () => {
    if (confirm(I.t("common.confirmReset"))) {
      [S.keys.completed, S.keys.quiz, S.keys.practice, S.keys.ratings].forEach(
        (key) => localStorage.removeItem(key),
      );
      S.toast(I.t("common.progressReset"));
      setTimeout(() => location.reload(), 400);
    }
  });
});
