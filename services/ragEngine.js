// import { pipeline } from "@xenova/transformers";

// let generator;

// async function loadGenerator() {
//   if (!generator) {
//     generator = await pipeline(
//       "text2text-generation",
//       "Xenova/flan-t5-base"
//     );
//   }
//   return generator;
// }

// export async function generateAnswer(prompt) {
//   const model = await loadGenerator();

//   const result = await model(prompt, {
//     max_new_tokens: 200,
//   });

//   return result[0].generated_text;
// }

// import fetch from "node-fetch";

// const HF_API_TOKEN = process.env.HF_API_KEY;
// // const LLM_MODEL = "google/flan-t5-large";
// const LLM_MODEL = "google/flan-t5-base"; 


// export async function generateAnswer(prompt) {
//   try {
//     const response = await fetch(`https://api-inference.huggingface.co/models/${LLM_MODEL}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${HF_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         inputs: prompt,
//         parameters: { max_new_tokens: 200 },
//       }),
//     });

//     if (!response.ok) throw new Error(`HF API error: ${response.statusText}`);

//     const result = await response.json();
//     return Array.isArray(result) && result[0].generated_text
//       ? result[0].generated_text
//       : "❌ Failed to generate answer";
//   } catch (err) {
//     console.error("Answer generation failed:", err.message);
//     throw err;
//   }
// }

// import fetch from "node-fetch";

// const HF_API_TOKEN = process.env.HF_API_KEY;
// // const LLM_MODEL = "google/flan-t5-small"; // lightweight, fast
// const LLM_MODEL = "google/flan-t5-small";


// export async function generateAnswer(prompt) {
//   try {
//     const response = await fetch(`https://api-inference.huggingface.co/models/${LLM_MODEL}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${HF_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         inputs: prompt,
//         parameters: { max_new_tokens: 150 },
//       }),
//     });

//     if (!response.ok) throw new Error(`HF API error: ${response.statusText}`);

//     const result = await response.json();
//     return Array.isArray(result) && result[0].generated_text
//       ? result[0].generated_text
//       : "❌ Failed to generate answer";
//   } catch (err) {
//     console.error("Answer generation failed:", err.message);
//     throw err;
//   }
// }

// import fetch from "node-fetch";

// const HF_API_TOKEN = process.env.HF_API_KEY;
// const LLM_MODEL = "google/flan-t5-small"; // lightweight, hosted HF LLM

// export async function generateAnswer(prompt) {
//   try {
//     const response = await fetch(
//       `https://api-inference.huggingface.co/models/${LLM_MODEL}`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${HF_API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 150 } }),
//       }
//     );

//     if (!response.ok) throw new Error(`HF API error: ${response.statusText}`);

//     const result = await response.json();
//     return Array.isArray(result) && result[0].generated_text
//       ? result[0].generated_text
//       : "❌ Failed to generate answer";
//   } catch (err) {
//     console.error("Answer generation failed:", err.message);
//     throw err;
//   }
// }

// import fetch from "node-fetch";

// const HF_API_TOKEN = process.env.HF_API_KEY;

// // ✅ Lightweight model that works with HF Inference API
// const LLM_MODEL = "google/flan-t5-small";

// export async function generateAnswer(prompt) {
//   try {
//     const response = await fetch(
//       `https://api-inference.huggingface.co/models/${LLM_MODEL}`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${HF_API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           inputs: prompt,
//           parameters: { max_new_tokens: 150 },
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HF API error: ${response.status} ${response.statusText}`);
//     }

//     const result = await response.json();
//     return Array.isArray(result) && result[0].generated_text
//       ? result[0].generated_text
//       : "❌ Failed to generate answer";
//   } catch (err) {
//     console.error("Answer generation failed:", err.message);
//     throw err;
//   }
// }

import fetch from "node-fetch";

const HF_API_TOKEN = process.env.HF_API_KEY;
const LLM_MODEL = "HuggingFaceTB/SmolLM3-3B"; // provider-backed model

export async function generateAnswer(prompt) {
  const response = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [
          { role: "system", content: "You are a helpful HR assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 200,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HF API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}





