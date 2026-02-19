// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function generateAnswer(context, question) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: "You are a helpful HR assistant. Answer only using the provided context.",
//         },
//         {
//           role: "user",
//           content: `Context:\n${context}\n\nQuestion: ${question}`,
//         },
//       ],
//       temperature: 0.2,
//       max_tokens: 400,
//     });

//     return response.choices[0].message.content;
//   } catch (error) {
//     console.error("LLM Error:", error.message);
//     throw error;
//   }
// }


export async function generateAnswer(context, question) {
  return `
Question:
${question}

Based on the most relevant document chunks:

${context}
`;
}
