export function chunkText(text, chunkSize = 800, overlap = 150) {
  if (!text || typeof text !== "string") return [];

  text = text.replace(/\s+/g, " ").trim();

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    if (end >= text.length) {
      chunks.push(text.slice(start).trim());
      break;
    }

    const chunk = text.slice(start, end).trim();
    chunks.push(chunk);

    // 🔥 GUARANTEE forward movement
    start = start + (chunkSize - overlap);

    if (start <= 0 || start >= text.length) break;
  }

  return chunks;
}
