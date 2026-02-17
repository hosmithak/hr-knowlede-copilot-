
export function chunkText(text, chunkSize = 800, overlap = 150) {
  // ✅ Safety check (production-ready guard)
  if (!text || typeof text !== "string") {
    return [];
  }

  const chunks = [];
  let start = 0;

  // Normalize whitespace
  text = text.replace(/\s+/g, " ").trim();

  while (start < text.length) {
    let end = start + chunkSize;

    // Prevent cutting in middle of sentence
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf(".", end);
      if (lastPeriod > start) {
        end = lastPeriod + 1;
      }
    }

    const chunk = text.slice(start, end).trim();
    chunks.push(chunk);

    // Apply overlap
    start = end - overlap;

    // Prevent infinite loop edge case
    if (start < 0) start = 0;
  }

  return chunks;
}
