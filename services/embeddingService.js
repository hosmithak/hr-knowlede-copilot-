import { pipeline } from "@xenova/transformers";

let extractor;

// Load model once
async function loadModel() {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
}

export async function generateEmbedding(text) {
  if (!text || !text.trim()) {
    throw new Error("Cannot embed empty text");
  }

  await loadModel();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}
