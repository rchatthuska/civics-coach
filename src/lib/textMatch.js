export const norm = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[-–—]/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function matchAnswer(q, text) {
  const t = " " + norm(text) + " ";
  let hits = 0;
  for (const k of q.k) if (t.includes(k.length < 3 ? " " + k + " " : k)) hits++;
  return hits >= (q.r || 1);
}

export function similarity(target, said) {
  const tw = new Set(
    norm(target)
      .split(" ")
      .filter((w) => w.length > 2),
  );
  const sw = new Set(
    norm(said)
      .split(" ")
      .filter((w) => w.length > 2),
  );
  if (!tw.size) return 0;
  let hit = 0;
  tw.forEach((w) => {
    if (sw.has(w)) hit++;
  });
  return hit / tw.size;
}
