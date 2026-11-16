document.addEventListener("DOMContentLoaded", () => {
  const I = window.SR_I18N,
    S = window.SpeakReady;
  if (!I || !S) return;
  const questions = [
    { key: "q1", correct: 1 },
    { key: "q2", correct: 2 },
    { key: "q3", correct: 1 },
    { key: "q4", correct: 2 },
    { key: "q5", correct: 1 },
    { key: "q6", correct: 2 },
  ];
  function renderQuestions() {
    const T = I.t;
    document.getElementById("quiz-questions").innerHTML = questions
      .map((question, i) => {
        const choices = [1, 2, 3, 4]
          .map(
            (n) =>
              `<label class="choice"><input type="radio" name="q${i}" value="${n - 1}" required><span>${T(`quiz.${question.key}a${n}`)}</span></label>`,
          )
          .join("");
        return `<section class="quiz-question"><h3>${i + 1}. ${T(`quiz.${question.key}`)}</h3><div class="choice-list">${choices}</div></section>`;
      })
      .join("");
  }
  function renderResult(result) {
    const T = I.t;
    const percent = result.score;
    document.getElementById("score-value").textContent = `${percent}%`;
    document.getElementById("score-heading").textContent = T(
      percent >= 80
        ? "assessment.nice"
        : percent >= 60
          ? "assessment.good"
          : "assessment.keep",
    );
    document.getElementById("score-message").textContent =
      `${I.language === "fil" ? `Tama ang ${result.correct} sa ${result.total} na tanong.` : `You answered ${result.correct} out of ${result.total} questions correctly.`} ${T(percent >= 80 ? "assessment.resultHigh" : "assessment.resultLow")}`;
    document.getElementById("quiz-result").hidden = false;
  }
  renderQuestions();
  document.getElementById("quiz-form").addEventListener("submit", (event) => {
    event.preventDefault();
    let score = 0;
    const explanations = [];
    questions.forEach((question, i) => {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      const isCorrect = Number(selected?.value) === question.correct;
      if (isCorrect) score += 1;
      explanations.push({
        question: I.t(`quiz.${question.key}`),
        correct: isCorrect,
        explanation: I.t(`quiz.${question.key}why`),
      });
    });
    const result = {
      score: Math.round((score / questions.length) * 100),
      correct: score,
      total: questions.length,
      date: new Date().toISOString(),
      explanations,
    };
    S.set(S.keys.quiz, result);
    renderResult(result);
    document
      .getElementById("quiz-result")
      .scrollIntoView({ behavior: "smooth", block: "center" });
    S.toast(I.t("common.quizSaved"));
  });
  document.addEventListener("sr:languagechange", () => {
    const oldAnswers = questions.map(
      (_, i) =>
        document.querySelector(`input[name="q${i}"]:checked`)?.value ?? null,
    );
    renderQuestions();
    oldAnswers.forEach((value, i) => {
      if (value !== null) {
        const input = document.querySelector(
          `input[name="q${i}"][value="${value}"]`,
        );
        if (input) input.checked = true;
      }
    });
    const saved = S.get(S.keys.quiz, null);
    if (saved) renderResult(saved);
  });
});
