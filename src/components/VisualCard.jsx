export function VisualCard({ q }) {
  return (
    <div className="visual">
      <div className="visual-emoji" aria-hidden="true">
        {q.v}
      </div>
      <div className="visual-cap">{q.c}</div>
    </div>
  );
}
