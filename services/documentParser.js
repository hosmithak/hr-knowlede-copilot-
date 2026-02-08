import fs from "fs";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function extractText(filePath) {
  try {
    const extension = filePath.split(".").pop().toLowerCase();

    // -------- PDF --------
    if (extension === "pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return cleanText(data.text);
    }

    // -------- DOCX --------
    if (extension === "docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      return cleanText(result.value);
    }

    throw new Error(`Unsupported file type: .${extension}`);
  } catch (error) {
    console.error("Document parsing failed:", error.message);
    throw error;
  }
}

/* -------- Text normalization -------- */
function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .trim();
}
