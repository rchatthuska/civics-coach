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

// q.r counts distinct keyword hits required, which usually means "pick r
// separate items from q.a" (e.g. name 2 of these 6 rights). But for
// questions where q.a holds alternate whole phrasings of one full answer
// (e.g. "Legislative, executive, and judicial" vs "Congress, president,
// and the courts"), a single a[] entry already contains all r keywords.
// Detect that case so callers don't force-combine or demand r separate
// picks when one accepted answer already suffices.
export function neededAnswerCount(q) {
  const r = q.r || 1;
  if (r <= 1) return 1;
  return matchAnswer(q, q.a[0]) ? 1 : r;
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
