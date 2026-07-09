import { speak } from "../lib/speech";
import { VisualCard } from "./VisualCard";
import { AnswerList } from "./AnswerList";

export function QuestionView({ q, mastered, onBack }) {
  return (
    <div className="card">
      <div className="q-head">
        <span className="q-num">Question {q.n}</span>
        <span className={"mastered-badge" + (mastered ? "" : " preview")}>
          {mastered ? "✓ Mastered" : "Preview"}
        </span>
      </div>
      <VisualCard q={q} />
      <h2 className="q-text">{q.q}</h2>
      <AnswerList q={q} />
      <button
        className="ghost small"
        onClick={() => speak(q.q + " ... " + q.a[0])}
      >
        🔊 Hear question &amp; answer
      </button>
      <button className="primary" onClick={onBack}>
        ← Back to unit questions
      </button>
    </div>
  );
}
