// import { pipeline } from "@xenova/transformers";

// let extractor;

// async function loadModel() {
//   if (!extractor) {
//     extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
//   }
//   return extractor;
// }

// export async function getEmbedding(text) {
//   try {
//     const model = await loadModel();
//     const output = await model(text, { pooling: "mean", normalize: true });
//     return Array.from(output.data);
//   } catch (err) {
//     console.error("Embedding failed:", err.message);
//     throw err;
//   }
// }


// import fetch from "node-fetch";

// const HF_API_TOKEN = process.env.HF_API_KEY;
// // const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
// // const EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2";
// // const EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5";
// const EMBEDDING_MODEL = "google/embeddinggemma-300m";


// export async function getEmbedding(text) {
//   try {
//     const response = await fetch(`https://api-inference.huggingface.co/models/${EMBEDDING_MODEL}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${HF_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ inputs: text }),
//     });

//     if (!response.ok) throw new Error(`HF API error: ${response.statusText}`);

//     const data = await response.json();
//     // HF API returns embedding as an array of numbers
//     return Array.isArray(data[0]) ? data[0] : data;
//   } catch (err) {
//     console.error("Embedding failed:", err.message);
//     throw err;
//   }
// }

import { pipeline } from "@xenova/transformers";

let extractor;

async function loadModel() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

export async function getEmbedding(text) {
  try {
    const model = await loadModel();

    // Use mean pooling and normalize
    const output = await model(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  } catch (err) {
    console.error("Embedding failed:", err.message);
    throw err;
  }
}

