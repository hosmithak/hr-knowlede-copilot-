// services/documentParser.js

import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const LLAMA_PARSE_API = "https://api.llamaindex.ai/api/parsing/upload";

export async function parsePdfWithLlama(filePath) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
      LLAMA_PARSE_API,
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.LLAMA_PARSE_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    const parsedData = response.data;

    // ✅ Null safety check
    if (!parsedData?.documents) {
      throw new Error("Invalid LlamaParse response");
    }

    let fullText = "";

    parsedData.documents.forEach((doc) => {
      doc.blocks?.forEach((block) => {
        if (block.type === "text" && block.text) {
          fullText += block.text + "\n\n";
        }

        if (block.type === "table" && block.table) {
          fullText += formatTable(block.table) + "\n\n";
        }
      });
    });

    return fullText;

  } catch (error) {
    console.error("LlamaParse Error:", error.response?.data || error.message);
    throw new Error("PDF parsing failed");
  } finally {
    // ✅ Always delete uploaded file (even if parsing fails)
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error("File cleanup failed:", cleanupError.message);
    }
  }
}

// Convert table into embedding-friendly text
function formatTable(table) {
  let formatted = "Table Data:\n";

  table.rows?.forEach((row) => {
    const rowText = row.cells
      ?.map((cell) => cell.text?.trim() || "")
      .join(" | ");

    formatted += rowText + "\n";
  });

  return formatted;
}
