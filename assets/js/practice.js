document.addEventListener("DOMContentLoaded", () => {
  const S = window.SpeakReady,
    I = window.SR_I18N;
  if (!S || !I) return;
  const T = (key) => I.t(key);
  const prompts = [
    [
      "Talk about a skill you want to learn and explain why it matters to you.",
      "Pag-usapan ang isang kasanayang nais mong matutuhan at ipaliwanag kung bakit ito mahalaga sa iyo.",
    ],
    [
      "Suggest one improvement that could make your school experience better. Explain your reason.",
      "Magmungkahi ng isang pagbabago na makapagpapabuti sa iyong karanasan sa paaralan. Ipaliwanag ang iyong dahilan.",
    ],
    [
      "Explain why teamwork is important when completing a group task.",
      "Ipaliwanag kung bakit mahalaga ang pagtutulungan sa paggawa ng isang pangkatang gawain.",
    ],
    [
      "Describe a book, game, or story you enjoy and explain what makes it interesting.",
      "Ilarawan ang isang aklat, laro, o kuwentong kinagigiliwan mo at ipaliwanag kung bakit ito kawili-wili.",
    ],
    [
      "How can students use technology responsibly when learning? Give two examples.",
      "Paano magagamit nang responsable ng mga mag-aaral ang teknolohiya sa pag-aaral? Magbigay ng dalawang halimbawa.",
    ],
  ];
  const topicNames = [
    ["A skill I want to learn", "Kasanayang nais kong matutuhan"],
    ["A helpful school improvement", "Pagpapabuting makatutulong sa paaralan"],
    ["Why teamwork matters", "Bakit mahalaga ang pagtutulungan"],
    [
      "A book, game, or story I enjoy",
      "Aklat, laro, o kuwentong kinagigiliwan ko",
    ],
    ["Using technology responsibly", "Responsableng paggamit ng teknolohiya"],
  ];
  const topic = document.getElementById("practice-topic");
  const language = document.getElementById("practice-language");
  const prompt = document.getElementById("prompt-text");
  const prep = document.getElementById("prep-duration");
  const speak = document.getElementById("speak-duration");
  const display = document.getElementById("timer-display");
  const caption = document.getElementById("timer-caption");
  const start = document.getElementById("timer-start");
  let remain = Number(prep.value),
    interval = null,
    mode = "prep",
    paused = false;

  // The activity language is an independent choice; it is preserved when UI language changes.
  language.value = I.language === "fil" ? "Filipino" : "English";
  let practiceLanguageChosenManually = false;
  function updatePrompt() {
    const languageIndex = language.value === "English" ? 0 : 1;
    prompt.textContent = prompts[Number(topic.value)][languageIndex];
    [...topic.options].forEach((option, index) => {
      option.textContent = topicNames[index][I.language === "fil" ? 1 : 0];
    });
  }
  topic.addEventListener("change", updatePrompt);
  language.addEventListener("change", () => {
    practiceLanguageChosenManually = true;
    updatePrompt();
  });
  updatePrompt();

  function fmt(seconds) {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }
  function setMode(nextMode) {
    mode = nextMode;
    remain = Number(mode === "prep" ? prep.value : speak.value);
    display.textContent = fmt(remain);
    caption.textContent = T(
      mode === "prep" ? "common.prepTime" : "common.speakingTime",
    );
    start.textContent = T(
      mode === "prep" ? "common.startPrep" : "common.startSpeaking",
    );
    paused = false;
  }
  function stopTimer() {
    clearInterval(interval);
    interval = null;
    start.disabled = false;
  }
  function onTimerComplete() {
    stopTimer();
    const completedMode = mode;
    caption.textContent = T(
      completedMode === "prep"
        ? "common.prepComplete"
        : "common.speakingComplete",
    );
    if (completedMode === "prep") {
      mode = "speak";
      start.textContent = T("common.startSpeaking");
    } else {
      start.textContent = T("common.startAgain");
    }
    S.toast(
      T(
        completedMode === "prep"
          ? "common.prepDoneToast"
          : "common.speakingDoneToast",
      ),
    );
  }
  prep.addEventListener("change", () => {
    if (!interval && mode === "prep") setMode("prep");
  });
  speak.addEventListener("change", () => {
    if (!interval && mode === "speak") setMode("speak");
  });
  start.addEventListener("click", () => {
    if (interval) {
      stopTimer();
      paused = true;
      start.textContent = T("common.resume");
      return;
    }
    if (remain <= 0) setMode(mode);
    start.disabled = false;
    start.textContent = T("common.pause");
    interval = setInterval(() => {
      remain -= 1;
      display.textContent = fmt(remain);
      if (remain <= 0) onTimerComplete();
    }, 1000);
  });
  document.getElementById("timer-reset").addEventListener("click", () => {
    stopTimer();
    setMode("prep");
  });
  setMode("prep");

  let recorder = null,
    chunks = [],
    audioUrl = null;
  const recStart = document.getElementById("record-start");
  const recStop = document.getElementById("record-stop");
  const audio = document.getElementById("audio-playback");
  const status = document.getElementById("recording-status");
  const notice = document.getElementById("recording-notice");
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    recStart.disabled = true;
    notice.textContent = T("practice.recordUnsupported");
  }
  recStart.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: recorder.mimeType || "audio/webm",
        });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        audioUrl = URL.createObjectURL(blob);
        audio.src = audioUrl;
        audio.hidden = false;
        stream.getTracks().forEach((track) => track.stop());
        status.textContent = T("practice.recordReady");
      };
      recorder.start();
      recStart.disabled = true;
      recStop.disabled = false;
      status.textContent = T("practice.recording");
    } catch (_) {
      status.textContent = T("practice.recordDenied");
    }
  });
  recStop.addEventListener("click", () => {
    if (recorder?.state === "recording") {
      recorder.stop();
      recStop.disabled = true;
      recStart.disabled = false;
    }
  });
  document.getElementById("save-practice").addEventListener("click", () => {
    stopTimer();
    const sessions = S.get(S.keys.practice, []);
    sessions.push({
      date: new Date().toISOString(),
      topicId: Number(topic.value),
      topic:
        topicNames[Number(topic.value)][language.value === "English" ? 0 : 1],
      language: language.value,
      reflection: document.getElementById("practice-reflection").value.trim(),
    });
    S.set(S.keys.practice, sessions);
    S.toast(T("common.practiceSaved"));
    document.getElementById("practice-reflection").value = "";
  });
  document.addEventListener("sr:languagechange", () => {
    I.apply(document);
    if (!practiceLanguageChosenManually)
      language.value = I.language === "fil" ? "Filipino" : "English";
    updatePrompt();
    caption.textContent = T(
      mode === "prep" ? "common.prepTime" : "common.speakingTime",
    );
    start.textContent = T(
      interval
        ? "common.pause"
        : paused
          ? "common.resume"
          : mode === "prep"
            ? "common.startPrep"
            : "common.startSpeaking",
    );
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder)
      notice.textContent = T("practice.recordUnsupported");
    if (recorder?.state === "recording")
      status.textContent = T("practice.recording");
    else if (audio.src) status.textContent = T("practice.recordReady");
  });
  window.addEventListener("beforeunload", () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  });
});
