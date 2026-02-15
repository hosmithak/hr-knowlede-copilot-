export async function getEmbedding(text) {
  const vector = new Array(300).fill(0);

  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/);

  for (const word of words) {
    let hash = 0;

    for (let i = 0; i < word.length; i++) {
      hash += word.charCodeAt(i);
    }

    vector[hash % 300] += 1;
  }

  return normalize(vector);
}

function normalize(vector) {
  const norm = Math.sqrt(
    vector.reduce((sum, v) => sum + v * v, 0)
  );

  return vector.map((v) =>
    norm === 0 ? 0 : v / norm
  );
}
