document.addEventListener("DOMContentLoaded", () => {
  const S = window.SpeakReady;
  if (!S) return;
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
  const topic = document.getElementById("practice-topic"),
    language = document.getElementById("practice-language"),
    prompt = document.getElementById("prompt-text");
  function updatePrompt() {
    prompt.textContent =
      prompts[Number(topic.value)][language.value === "English" ? 0 : 1];
  }
  topic.addEventListener("change", updatePrompt);
  language.addEventListener("change", updatePrompt);
  const prep = document.getElementById("prep-duration"),
    speak = document.getElementById("speak-duration"),
    display = document.getElementById("timer-display"),
    caption = document.getElementById("timer-caption"),
    start = document.getElementById("timer-start");
  let remain = 60,
    interval = null,
    mode = "prep";
  function fmt(n) {
    return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
  }
  function setMode(m) {
    mode = m;
    remain = Number(m === "prep" ? prep.value : speak.value);
    display.textContent = fmt(remain);
    caption.textContent = m === "prep" ? "Preparation time" : "Speaking time";
    start.textContent =
      m === "prep" ? "Start preparation" : "Start speaking timer";
  }
  function stopTimer() {
    clearInterval(interval);
    interval = null;
    start.disabled = false;
  }
  prep.addEventListener("change", () => {
    if (!interval) setMode("prep");
  });
  speak.addEventListener("change", () => {
    if (!interval && mode === "speak") setMode("speak");
  });
  start.addEventListener("click", () => {
    if (interval) {
      stopTimer();
      start.textContent = "Resume timer";
      return;
    }
    start.disabled = false;
    start.textContent = "Pause timer";
    interval = setInterval(() => {
      remain--;
      display.textContent = fmt(remain);
      if (remain <= 0) {
        stopTimer();
        caption.textContent =
          mode === "prep" ? "Preparation complete" : "Speaking time complete";
        start.textContent =
          mode === "prep" ? "Start speaking timer" : "Start again";
        if (mode === "prep") setMode("speak");
        S.toast(
          mode === "prep"
            ? "Preparation time is complete."
            : "Speaking timer complete.",
        );
      }
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
  const recStart = document.getElementById("record-start"),
    recStop = document.getElementById("record-stop"),
    audio = document.getElementById("audio-playback"),
    status = document.getElementById("recording-status"),
    notice = document.getElementById("recording-notice");
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    recStart.disabled = true;
    notice.textContent =
      "Voice recording is not supported in this browser or context. You can still complete the speaking activity without recording.";
  }
  recStart.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: recorder.mimeType || "audio/webm",
        });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        audioUrl = URL.createObjectURL(blob);
        audio.src = audioUrl;
        audio.hidden = false;
        stream.getTracks().forEach((t) => t.stop());
        status.textContent =
          "Recording ready. Use the player to listen to your practice.";
      };
      recorder.start();
      recStart.disabled = true;
      recStop.disabled = false;
      status.textContent = "Recording… speak clearly and take your time.";
    } catch (err) {
      status.textContent =
        "Microphone access was not granted or is unavailable. You can continue without recording.";
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
    const list = S.get(S.keys.practice, []);
    list.push({
      date: new Date().toISOString(),
      topic: topic.options[topic.selectedIndex].text,
      language: language.value,
      reflection: document.getElementById("practice-reflection").value.trim(),
    });
    S.set(S.keys.practice, list);
    S.toast("Practice session saved on this device.");
    document.getElementById("practice-reflection").value = "";
  });
  window.addEventListener("beforeunload", () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  });
});
