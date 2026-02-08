import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

/* Health check API */
app.get("/", (req, res) => {
  res.send("HR Knowledge Copilot Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
