import axios from "axios";
import fs from "fs";

const TIKA_URL = "http://localhost:9998/tika";

export async function parseDocument(filePath) {
  try {
    const fileStream = fs.createReadStream(filePath);

    const response = await axios({
      method: "put",
      url: TIKA_URL,
      data: fileStream,
      headers: {
        "Content-Type": "application/octet-stream",
      },
      responseType: "stream", // 🔥 IMPORTANT
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return new Promise((resolve, reject) => {
      let extractedText = "";

      response.data.on("data", chunk => {
        extractedText += chunk.toString();
      });

      response.data.on("end", () => {
        resolve(extractedText);
      });

      response.data.on("error", err => {
        reject(err);
      });
    });

  } catch (error) {
    console.error("Tika parsing error:", error.message);
    throw new Error("Failed to parse document using Tika");
  }
}
