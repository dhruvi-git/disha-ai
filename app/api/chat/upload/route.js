import { auth } from "@clerk/nextjs/server";
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_CHARS = 12000; // keeps prompts within Groq free-tier limits

const TEXT_EXTENSIONS = ["txt", "md", "csv", "json", "tex", "rtf", "html", "xml"];

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Please sign in first." }, { status: 401 });
  }

  let file;
  try {
    const form = await req.formData();
    file = form.get("file");
  } catch {
    return Response.json({ error: "Could not read the upload." }, { status: 400 });
  }

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File is larger than 5 MB." }, { status: 413 });
  }

  const name = file.name || "file";
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const buffer = Buffer.from(await file.arrayBuffer());

  let text = "";
  try {
    if (ext === "pdf" || file.type === "application/pdf") {
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      text = (await extractText(pdf, { mergePages: true })).text;
    } else if (ext === "docx") {
      text = (await mammoth.extractRawText({ buffer })).value;
    } else if (TEXT_EXTENSIONS.includes(ext) || file.type.startsWith("text/")) {
      text = buffer.toString("utf8");
    } else {
      return Response.json(
        { error: "Unsupported file type. Use PDF, DOCX, TXT, MD or CSV." },
        { status: 415 }
      );
    }
  } catch (err) {
    console.error("Upload parse error:", err);
    return Response.json({ error: "Could not read text from this file." }, { status: 422 });
  }

  text = text.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
  if (!text) {
    return Response.json(
      { error: "No readable text found (scanned PDFs and images aren't supported)." },
      { status: 422 }
    );
  }

  const truncated = text.length > MAX_CHARS;
  return Response.json({
    name,
    size: file.size,
    text: truncated ? text.slice(0, MAX_CHARS) : text,
    truncated,
  });
}
