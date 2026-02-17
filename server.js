import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";

import { connectDB } from "./db.js";
import { parsePdfWithLlama } from "./services/documentParser.js";
import { chunkText } from "./services/chunker.js";
import { generateEmbedding } from "./services/embeddingService.js";
import { generateAnswer } from "./services/ragEngine.js";
import { findRelevantChunks } from "./services/vectorSearch.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Storage config for multer
const upload = multer({ dest: "uploads/" });

// Health route
app.get("/", (req, res) => {
  res.send("HR Copilot Backend Running 🚀");
});


// ==============================
// 1️⃣ Upload & Index PDF
// ==============================
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const db = await connectDB();
    const collection = db.collection("documents");

    // Parse PDF
    const fullText = await parsePdfWithLlama(req.file.path);

    // Chunk text
    const chunks = chunkText(fullText);

    // Generate embeddings and store
    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);

      await collection.insertOne({
        content: chunk,
        embedding: embedding,
      });
    }

    res.json({ message: "Document uploaded and indexed successfully" });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Upload failed" });
  }
});


// ==============================
// 2️⃣ Ask Question
// ==============================
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // Generate embedding for question
    const questionEmbedding = await generateEmbedding(question);

    // Find relevant chunks
    const relevantDocs = await findRelevantChunks(questionEmbedding);

    const context = relevantDocs
      .map(doc => doc.content)
      .join("\n\n");

    // Generate final answer
    const answer = await generateAnswer(context, question);

    res.json({ answer });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to generate answer" });
  }
});


// ==============================
// Start Server
// ==============================
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
