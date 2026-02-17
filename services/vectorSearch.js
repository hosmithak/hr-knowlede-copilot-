// function cosineSimilarity(a, b) {
//   const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
//   const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
//   const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
//   return dot / (magA * magB);
// }

// export async function findRelevantChunks(questionEmbedding, docs, topK = 3) {
//   return docs
//     .map(doc => ({
//       ...doc,
//       score: cosineSimilarity(questionEmbedding, doc.embedding)
//     }))
//     .sort((a, b) => b.score - a.score)
//     .slice(0, topK);
// }

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

let collection;

async function connectDB() {
  if (!collection) {
    await client.connect();
    const db = client.db("hr_copilot");
    collection = db.collection("documents");
  }
  return collection;
}

export async function findRelevantChunks(questionEmbedding, topK = 3) {
  const collection = await connectDB();

  const results = await collection.aggregate([
    {
      $vectorSearch: {
        index: "vector_index", // your Atlas index name
        path: "embedding",
        queryVector: questionEmbedding,
        numCandidates: 100,
        limit: topK
      }
    },
    {
      $project: {
        content: 1,
        score: { $meta: "vectorSearchScore" }
      }
    }
  ]).toArray();

  return results;
}
