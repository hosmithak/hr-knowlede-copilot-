import OpenAI from "openai";
import { getEmbedding } from "./embeddingService.js";
import { findRelevantChunks } from "./vectorSearch.js";

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

export async function generateAnswer(question, documents) {
  const questionEmbedding = await getEmbedding(question);

  const relevantChunks = await findRelevantChunks(
    questionEmbedding,
    documents
  );

  if (relevantChunks.length === 0) {
    return "I could not find relevant information in HR policies.";
  }

  const context = relevantChunks
    .map(d => `Source (${d.source}): ${d.content}`)
    .join("\n");

  const client = getClient();
  const completion = await client.chat.completions.create({

    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Answer only using the provided HR policy context. If not found, say you don't know."
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion:\n${question}`
      }
    ]
  });

  return completion.choices[0].message.content;
}
