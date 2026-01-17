import { GoogleGenerativeAI } from "@google/generative-ai";
import { safeParseJSON } from "@/lib/utils";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const text = formData.get("text") as string | null;
    const image = formData.get("image") as File | null;

    let promptParts: any[] = [];
    const systemPrompt = `
      Extract job details from the provided text or image.
      Output strictly valid JSON with keys: 
      jobTitle (string), company (string), location (string), 
      description (string, summary), salary (object with min, max, currency),
      techStack (array of strings), applyUrl (string).
    `;

    promptParts.push(systemPrompt);

    if (text) {
      promptParts.push(text);
    }

    if (image) {
      const bytes = await image.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      promptParts.push({
        inlineData: {
          data: base64,
          mimeType: image.type,
        },
      });
    }

    if (promptParts.length === 1) {
       return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    const result = await model.generateContent(promptParts);
    const response = await result.response;
    const responseText = response.text();
    const data = safeParseJSON(responseText);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Extraction failed:", error);
    return NextResponse.json({ error: "Extraction failed" }, { status: 500 });
  }
}
