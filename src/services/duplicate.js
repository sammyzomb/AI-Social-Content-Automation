function tokens(text) {
  return new Set(
    String(text ?? "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter(Boolean)
  );
}

export function jaccardSimilarity(a, b) {
  const left = tokens(a);
  const right = tokens(b);
  if (left.size === 0 && right.size === 0) return 1;
  const intersection = [...left].filter((x) => right.has(x)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

export function findNearDuplicate(candidate, history, threshold = 0.72) {
  let best = null;
  for (const item of history) {
    const score = jaccardSimilarity(candidate, item.text);
    if (!best || score > best.score) best = { id: item.id, score };
  }
  return best && best.score >= threshold ? best : null;
}
