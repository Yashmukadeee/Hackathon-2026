import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_AI_KEY;
console.log("AI Scribe Uplink Status:", apiKey ? "CONNECTED" : "DISCONNECTED");

const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function chatAboutNotices(userQuery: string, context: string): Promise<string> {
  if (!apiKey) {
    console.error("AI Scribe: Missing VITE_GOOGLE_AI_KEY in environment archives.");
    return "The neural uplink is missing. Please ensure the VITE_GOOGLE_AI_KEY is set in the archives (env).";
  }

  try {
    const prompt = `
      You are the "Archive Scribe", a wise and slightly academic AI for the Heritage Institutions.
      Your tone is cinematic, intellectual, and helpful.
      
      Below are the current records (notices) from the campus board:
      ---
      ${context}
      ---
      
      The user is asking: "${userQuery}"
      
      Provide an answer based ONLY on the provided records. If the answer isn't in the records, 
      politely inform them that the archives do not yet contain that information, but offer to 
      help with what IS there. Keep your response under 100 words.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // --- Detailed Diagnostic Logging ---
    console.error("AI Scribe Neural Block:", {
      message: error.message,
      stack: error.stack,
      raw: error
    });

    if (error.message?.includes("API_KEY_INVALID")) {
      return "The Archive Key appears to be invalid. Please verify the credentials in the .env file.";
    }
    
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      return "The Scribe has been consulted too many times in this hour. Please allow me a moment to rest my eyes.";
    }

    return `The parchment is clouded. Error: ${error.message?.slice(0, 50)}... Please check the console for the full scroll.`;
  }
}

export async function summarizeNotice(content: string): Promise<string> {
  try {
    const prompt = `Summarize this campus notice into a single, punchy, cinematic sentence for a heritage board: "${content}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Summarization Error:", error);
    return content.slice(0, 100) + "...";
  }
}

export async function classifyUrgency(content: string): Promise<string> {
  try {
    const prompt = `Classify the urgency of this notice as "Critical", "Important", "Normal", or "Info". Return ONLY the word. Content: "${content}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    return ["Critical", "Important", "Normal", "Info"].includes(text) ? text : "Normal";
  } catch (error) {
    console.error("Classification Error:", error);
    return "Normal";
  }
}
