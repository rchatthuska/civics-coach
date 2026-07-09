import { useCallback, useRef, useState } from "react";

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

  const start = useCallback(
    async (onDone) => {
      if (!SR) {
        setBlocked(true);
        onDone(null);
        return;
      }
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const s = await navigator.mediaDevices.getUserMedia({ audio: true });
          s.getTracks().forEach((t) => t.stop());
        }
      } catch (err) {
        setBlocked(true);
        setListening(false);
        onDone(null);
        return;
      }
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
        rec.onend = () => {
          setListening(false);
          setInterim("");
          const cb = cbRef.current;
          cbRef.current = null;
          if (cb) cb(finalRef.current.trim());
        };
        rec.onerror = (e) => {
          if (
            e &&
            (e.error === "not-allowed" ||
              e.error === "service-not-allowed" ||
              e.error === "audio-capture" ||
              e.error === "network")
          )
            setBlocked(true);
          setListening(false);
          setInterim("");
          const cb = cbRef.current;
          cbRef.current = null;
          if (cb) cb(null);
        };
        recRef.current = rec;
        setListening(true);
        rec.start();
      } catch (e) {
        setBlocked(true);
        setListening(false);
        onDone(null);
      }
    },
    [SR],
  );

  const stop = useCallback(() => {
    try {
      recRef.current && recRef.current.stop();
    } catch (e) {}
  }, []);
  return { supported: !!SR, blocked, listening, interim, start, stop };
}
