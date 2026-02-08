import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

/* Health check */
app.get("/", (req, res) => {
  res.send("HR Knowledge Copilot Backend is running");
});

/* Start server after DB connection */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
