export function AnswerList({ q }) {
  return (
    <div className="ans-list">
      <div className="ans-title">Accepted answers</div>
      <ul>
        {q.a.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
      {q.r > 1 && <div className="ans-note">You must give {q.r} of these.</div>}
    </div>
  );
}
