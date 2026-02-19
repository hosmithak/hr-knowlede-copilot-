import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { parseDocument } from "./services/documentParser.js";
import { chunkText } from "./services/chunker.js";
import { generateEmbedding } from "./services/embeddingService.js";
import { findRelevantChunks } from "./services/vectorSearch.js";
import { generateAnswer } from "./services/ragEngine.js";
import { connectDB } from "./db.js";

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HR Copilot backend is running with Tika!");
});

// ✅ Upload → Tika → Chunk → Embed → Store
app.post("/upload", upload.single("file"), async (req, res) => {
  let filePath = req.file?.path;

  try {
    if (!filePath) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1️⃣ Extract full content using Tika
    const fullText = await parseDocument(filePath);

    if (!fullText || fullText.trim().length === 0) {
      throw new Error("No content extracted from document");
    }

    // 2️⃣ Chunk text
    const chunks = chunkText(fullText);

    // 3️⃣ Generate embeddings
    const chunksWithEmbeddings = [];
    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);
      chunksWithEmbeddings.push({ chunk, embedding });
    }

    // 4️⃣ Store in MongoDB
    const db = await connectDB();
    const collection = db.collection("documents");

    const docs = chunksWithEmbeddings.map(item => ({
      filename: req.file.originalname,
      content: item.chunk,
      embedding: item.embedding,
      uploadedAt: new Date(),
    }));

    if (docs.length > 0) {
      await collection.insertMany(docs);
    }

    res.json({
      message: "Document uploaded and processed successfully",
      chunksStored: docs.length,
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    // cleanup file
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.error("File cleanup failed:", cleanupErr.message);
      }
    }
  }
});

// ✅ Query route unchanged
app.post("/query", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const questionEmbedding = await generateEmbedding(question);

    const topChunks = await findRelevantChunks(questionEmbedding, 3);

    const context = topChunks.map(c => c.content).join("\n\n");

    const answer = await generateAnswer(context, question);

    res.json({ answer });

  } catch (err) {
    console.error("Query Error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
