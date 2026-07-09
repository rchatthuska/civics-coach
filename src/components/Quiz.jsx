import { useEffect, useState } from "react";
import { matchAnswer } from "../lib/textMatch";
import { speak } from "../lib/speech";
import { AnswerInput } from "./AnswerInput";
import { AnswerList } from "./AnswerList";

export function Quiz({ questions, title, mic, onFinish, onCorrect }) {
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [reveal, setReveal] = useState(null); // {correct, said}
  const q = questions[idx];

  useEffect(() => {
    setIdx(0);
    setResults([]);
    setReveal(null);
  }, [questions]);
  useEffect(() => {
    if (q) speak(q.q);
  }, [idx, questions]);

  const submit = (text) => {
    const ok = matchAnswer(q, text);
    setReveal({ correct: ok, said: text });
    speak(ok ? "Correct." : "Incorrect.");
    if (ok && onCorrect) onCorrect(q);
  };
  const next = () => {
    const newResults = [...results, { q, correct: reveal.correct }];
    setReveal(null);
    if (idx + 1 < questions.length) {
      setResults(newResults);
      setIdx(idx + 1);
    } else onFinish(newResults);
  };

  return (
    <div className="card">
      <div className="q-head">
        <span className="q-num">
          {title} — {idx + 1} of {questions.length}
        </span>
        <div className="quiz-dots">
          {questions.map((_, i) => {
            const r = results[i];
            return (
              <span
                key={i}
                className={
                  "dot" +
                  (r ? (r.correct ? " ok" : " bad") : i === idx ? " cur" : "")
                }
              />
            );
          })}
        </div>
      </div>
      <h2 className="q-text">{q.q}</h2>
      <button className="ghost small" onClick={() => speak(q.q)}>
        🔊 Hear it again
      </button>
      {!reveal && (
        <AnswerInput
          mic={mic}
          onSubmit={submit}
          prompt="Tap and say your answer"
        />
      )}
      {reveal && (
        <div className={"result " + (reveal.correct ? "ok" : "bad")}>
          <div className="result-mark">
            {reveal.correct ? "✓ Correct" : "✗ Incorrect"}
          </div>
          <div className="said">You said: “{reveal.said}”</div>
          <AnswerList q={q} />
          <button className="primary" onClick={next}>
            {idx + 1 < questions.length ? "Next question →" : "See results"}
          </button>
        </div>
      )}
    </div>
  );
}
