import { neededAnswerCount } from "../lib/textMatch";

export function AnswerList({ q }) {
  const need = neededAnswerCount(q);
  return (
    <div className="ans-list">
      <div className="ans-title">Accepted answers</div>
      <ul>
        {q.a.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
      {need > 1 && <div className="ans-note">You must give {need} of these.</div>}
    </div>
  );
}
