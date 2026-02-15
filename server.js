import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import { connectDB } from "./db.js";
import { extractText } from "./services/documentParser.js";
import { generateAnswer } from "./services/ragEngine.js";
import { getEmbedding } from "./services/embeddingService.js";
import { cosineSimilarity } from "./services/similarity.js";

const app = express();
app.use(express.json());

const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

const db = await connectDB();

app.get("/", (req, res) => {
  res.send("HR Knowledge Copilot Backend is running");
});

app.get("/test-db", async (req, res) => {
  try {
    await db.collection("test").insertOne({
      message: "Mongo is working",
      createdAt: new Date(),
    });
    res.send("✅ Inserted into DB successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("❌ DB Insert failed");
  }
});

app.post("/admin/upload-policy", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const extractedText = await extractText(req.file.path, req.file.originalname);
    console.log("Extracted text:", extractedText.slice(0, 200));

    const embedding = await getEmbedding(extractedText);
    console.log("Embedding length:", embedding.length);

    await db.collection("documents").insertOne({
      filename: req.file.originalname,
      content: extractedText,
      embedding,
      uploadedAt: new Date(),
      type: "HR_POLICY",
    });

    res.json({ message: "Policy document uploaded and indexed successfully" });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Document processing failed" });
  }
});

app.post("/user/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const questionEmbedding = await getEmbedding(question);

    const documents = await db.collection("documents").find({ type: "HR_POLICY" }).toArray();
    if (documents.length === 0)
      return res.json({ question, answer: "No HR policy documents found." });

    const rankedDocs = documents
      .map((doc) => ({
        ...doc,
        score: cosineSimilarity(questionEmbedding, doc.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const context = rankedDocs.map((d) => d.content).join("\n");
    const answer = await generateAnswer(`Context: ${context}\nQuestion: ${question}`);

    res.json({ question, answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
