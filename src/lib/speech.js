// getVoices() loads asynchronously and can return a different "default"
// voice on each call until it settles — different voices have different
// inherent loudness/pitch, which sounds like the volume randomly jumping
// between sentences. Pick one English voice once and reuse it every time.
let cachedVoice = null;

function pickVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => v.lang === "en-US" && v.localService) ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0]
  );
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  cachedVoice = pickVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickVoice();
  };
}

export function speak(text) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    u.volume = 1;
    u.pitch = 1;
    if (cachedVoice) u.voice = cachedVoice;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

export function stopSpeaking() {
  try {
    window.speechSynthesis.cancel();
  } catch (e) {}
}
