import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text) {
  // ✅ Production safety check
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Cannot embed empty text");
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;

  } catch (error) {
    console.error("Embedding Error:", error.message);
    throw error;
  }
}
