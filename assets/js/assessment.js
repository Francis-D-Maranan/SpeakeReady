document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    {
      q: "What is a useful first step before answering a speaking prompt?",
      a: [
        "Memorize a long script",
        "Identify the main idea you want to express",
        "Speak as quickly as possible",
        "Avoid giving examples",
      ],
      correct: 1,
      why: "Identifying your main idea gives your answer a clear direction.",
    },
    {
      q: "Which statement best describes speaking fluency?",
      a: [
        "Speaking as fast as possible",
        "Using difficult vocabulary in every sentence",
        "Expressing ideas with a natural and understandable flow",
        "Never pausing",
      ],
      correct: 2,
      why: "Fluency is about a natural flow, not speed or avoiding every pause.",
    },
    {
      q: "What can help make a spoken message clearer?",
      a: [
        "Adding unrelated details",
        "Organizing ideas in a logical order",
        "Using the longest words available",
        "Changing the topic often",
      ],
      correct: 1,
      why: "A logical order helps listeners follow the message.",
    },
    {
      q: "What is a constructive way to respond to a speaking mistake?",
      a: [
        "Stop practicing",
        "Assume you cannot improve",
        "Notice the mistake and continue or try again",
        "Avoid speaking in the future",
      ],
      correct: 2,
      why: "Mistakes can be part of practice and provide information about what to improve.",
    },
    {
      q: "What makes an opinion more persuasive?",
      a: [
        "Repeating it without explanation",
        "Supporting it with relevant reasons and examples",
        "Speaking louder than everyone",
        "Ignoring the audience",
      ],
      correct: 1,
      why: "Relevant reasons and examples help listeners understand your position.",
    },
    {
      q: "Which approach is useful during a group discussion?",
      a: [
        "Interrupt before others finish",
        "Ignore earlier points",
        "Listen and respond respectfully to the discussion",
        "Speak without considering the topic",
      ],
      correct: 2,
      why: "Listening to the discussion helps you give a relevant and respectful response.",
    },
  ];
  const holder = document.getElementById("quiz-questions");
  holder.innerHTML = questions
    .map(
      (q, i) =>
        `<section class="quiz-question"><h3>${i + 1}. ${q.q}</h3><div class="choice-list">${q.a.map((a, j) => `<label class="choice"><input type="radio" name="q${i}" value="${j}" required><span>${a}</span></label>`).join("")}</div></section>`,
    )
    .join("");
  document.getElementById("quiz-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let score = 0;
    const explanations = [];
    questions.forEach((q, i) => {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (Number(selected?.value) === q.correct) score++;
      explanations.push({
        question: q.q,
        correct: selected ? Number(selected.value) === q.correct : false,
        explanation: q.why,
      });
    });
    const percent = Math.round((score / questions.length) * 100);
    window.SpeakReady.set(window.SpeakReady.keys.quiz, {
      score: percent,
      correct: score,
      total: questions.length,
      date: new Date().toISOString(),
      explanations,
    });
    document.getElementById("score-value").textContent = `${percent}%`;
    document.getElementById("score-heading").textContent =
      percent >= 80
        ? "Nice work!"
        : percent >= 60
          ? "Good effort!"
          : "Keep practicing";
    document.getElementById("score-message").textContent =
      `You answered ${score} out of ${questions.length} questions correctly. ${percent >= 80 ? "You have a good understanding of these speaking strategies." : "Review the lessons and try the quiz again when you feel ready."}`;
    document.getElementById("quiz-result").hidden = false;
    document
      .getElementById("quiz-result")
      .scrollIntoView({ behavior: "smooth", block: "center" });
    window.SpeakReady.toast("Your quiz result has been saved on this device.");
  });
});
