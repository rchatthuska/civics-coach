import { useEffect, useState } from "react";
import { matchAnswer } from "../lib/textMatch";
import { speak } from "../lib/speech";
import { VisualCard } from "./VisualCard";
import { AnswerInput } from "./AnswerInput";
import { AnswerList } from "./AnswerList";

export function LearnCard({ q, onMastered, mic, onPrev, onForward, answered }) {
  const [reps, setReps] = useState(0); // 0..3 successful repetitions
  const [phase, setPhase] = useState("repeat"); // repeat | answer | wrong | right
  const [feedback, setFeedback] = useState("");

  const clean = (s) =>
    s
      .replace(/\(.*?\)/g, " ")
      .replace(/\[.*?\]/g, " ")
      .replace(/["“”]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const need = q.r || 1;
  const drill = q.a.slice(0, need).map(clean); // the answer(s) we teach
  const answerText = drill.join(", ");
  const teach = () => speak(q.q + " ... Remember this answer: " + answerText);
  useEffect(() => {
    setReps(0);
    setPhase("repeat");
    setFeedback("");
    teach();
  }, [q]);

  const handleRepeat = (text) => {
    if (text === null) {
      return;
    }
    if (matchAnswer(q, text)) {
      const nr = reps + 1;
      setReps(nr);
      setFeedback("");
      if (nr >= 3) {
        setPhase("answer");
        speak("Great. Now answer from memory. " + q.q);
      } else speak("Good. Once more: " + answerText);
    } else {
      setFeedback("That didn't match — say this answer: " + answerText);
      speak("The answer is: " + answerText);
    }
  };
  const forceCount = () => {
    const nr = reps + 1;
    setReps(nr);
    setFeedback("");
    if (nr >= 3) {
      setPhase("answer");
      speak("Now answer from memory. " + q.q);
    }
  };

  const handleAnswer = (text) => {
    if (text === null) return;
    if (matchAnswer(q, text)) {
      setPhase("right");
      speak("Correct!");
    } else {
      setPhase("wrong");
      speak("Not quite. The answer is: " + answerText);
    }
  };

  return (
    <div className="card">
      <div className="q-head">
        <span className="q-num">Question {q.n}</span>
        <div className="pips">
          {[0, 1, 2].map((i) => (
            <span key={i} className={"pip" + (reps > i ? " full" : "")} />
          ))}
        </div>
      </div>
      {(onPrev || onForward || answered) && (
        <div className="nav-row">
          {onPrev && (
            <button className="ghost small" onClick={onPrev}>
              ← Previous
            </button>
          )}
          {answered && (
            <span className="answered-badge">✓ Answered — you can retry</span>
          )}
          {onForward && (
            <button className="ghost small fwd" onClick={onForward}>
              Next unanswered →
            </button>
          )}
        </div>
      )}
      <VisualCard q={q} />
      <h2 className="q-text">{q.q}</h2>
      {phase === "repeat" && (
        <>
          <div className="drill">
            <div className="ans-title">
              Learn this answer{need > 1 ? "s" : ""}
            </div>
            <div className="drill-ans">{drill.join("  ·  ")}</div>
            {q.a.length > need && (
              <details className="alt">
                <summary>Other accepted answers ({q.a.length - need})</summary>
                <ul>
                  {q.a.slice(need).map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
          <button className="ghost small" onClick={teach}>
            🔊 Hear question &amp; answer again
          </button>
          <p className="step-label">
            Step 1 — Say the <b>answer</b> aloud {3 - reps} more time
            {3 - reps > 1 ? "s" : ""} ({reps}/3)
          </p>
          {feedback && <p className="warn">{feedback}</p>}
          <AnswerInput
            mic={mic}
            onSubmit={handleRepeat}
            prompt="Tap and speak the answer"
          />
          <button className="ghost small" onClick={forceCount}>
            Mic trouble? Count this repetition
          </button>
        </>
      )}

      {phase === "answer" && (
        <>
          <button className="ghost small" onClick={() => speak(q.q)}>
            🔊 Hear the question again
          </button>
          <p className="step-label">
            Step 2 — Answer it from memory (answer hidden)
          </p>
          <AnswerInput
            mic={mic}
            onSubmit={handleAnswer}
            prompt="Tap and say your answer"
          />
        </>
      )}

      {phase === "right" && (
        <div className="result ok">
          <div className="result-mark">✓ Correct</div>
          <AnswerList q={q} />
          <button className="primary" onClick={onMastered}>
            Next question →
          </button>
        </div>
      )}

      {phase === "wrong" && (
        <div className="result bad">
          <div className="result-mark">✗ Not yet — study the answer</div>
          <AnswerList q={q} />
          <button
            className="primary"
            onClick={() => {
              setReps(0);
              setPhase("repeat");
              teach();
            }}
          >
            Practice this question again
          </button>
        </div>
      )}
    </div>
  );
}
