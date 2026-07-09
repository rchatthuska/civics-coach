import { useCallback, useRef, useState } from "react";

const WATCHDOG_MS = 12000; // some browsers never fire onend/onerror — force-recover

export function useMic() {
  const SR =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const [listening, setListening] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [interim, setInterim] = useState("");
  const recRef = useRef(null);
  const cbRef = useRef(null);
  const finalRef = useRef("");
  const watchdogRef = useRef(null);

  const finish = useCallback((result) => {
    clearTimeout(watchdogRef.current);
    recRef.current = null;
    setListening(false);
    setInterim("");
    const cb = cbRef.current;
    cbRef.current = null;
    if (cb) cb(result);
  }, []);

  const start = useCallback(
    (onDone) => {
      if (!SR) {
        setBlocked(true);
        onDone(null);
        return;
      }
      if (recRef.current) return; // already listening — ignore re-entrant taps

      // Stop any question/answer being read aloud so the mic doesn't hear it.
      try {
        window.speechSynthesis && window.speechSynthesis.cancel();
      } catch (e) {}

      try {
        const rec = new SR();
        rec.lang = "en-US";
        rec.interimResults = true;
        rec.continuous = false;
        rec.maxAlternatives = 1;
        finalRef.current = "";
        cbRef.current = onDone;
        rec.onresult = (e) => {
          let fin = "",
            inter = "";
          for (let i = 0; i < e.results.length; i++) {
            if (e.results[i].isFinal) fin += e.results[i][0].transcript + " ";
            else inter += e.results[i][0].transcript;
          }
          finalRef.current = fin;
          setInterim(fin + inter);
        };
        rec.onend = () => finish(finalRef.current.trim());
        rec.onerror = (e) => {
          if (
            e &&
            (e.error === "not-allowed" ||
              e.error === "service-not-allowed" ||
              e.error === "audio-capture" ||
              e.error === "network")
          )
            setBlocked(true);
          finish(null);
        };
        recRef.current = rec;
        setListening(true);
        rec.start();
        watchdogRef.current = setTimeout(() => {
          try {
            rec.stop();
          } catch (e) {}
          // Some browsers hang without ever firing onend/onerror after stop().
          if (cbRef.current) finish(null);
        }, WATCHDOG_MS);
      } catch (e) {
        setBlocked(true);
        recRef.current = null;
        setListening(false);
        onDone(null);
      }
    },
    [SR, finish],
  );

  const stop = useCallback(() => {
    try {
      recRef.current && recRef.current.stop();
    } catch (e) {}
  }, []);
  return { supported: !!SR, blocked, listening, interim, start, stop };
}
