import fs from "fs";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function extractText(filePath, originalName) {
  const extension = originalName.split(".").pop().toLowerCase();

  if (extension === "pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return cleanText(data.text);
  }

  if (extension === "docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return cleanText(result.value);
  }

  throw new Error(`Unsupported file type: .${extension}`);
}

function cleanText(text) {
  return text.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();
}
