import express from 'express';
import { GoogleGenAI } from "@google/genai";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// Initialize Supabase (service role for server-side operations)
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ──────────── AI Endpoints ────────────

app.post('/api/ai/summarize', async (req, res) => {
  const { content } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Summarize the following campus notice in exactly 2 short sentences suitable for a card preview:\n\n${content}`,
    });
    res.json({ summary: response.text?.trim() });
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({ error: "Summarization failed" });
  }
});

app.post('/api/ai/classify', async (req, res) => {
  const { title, content } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Classify the urgency of the following campus notice. 
      Options: Critical, Important, Normal, Info.
      Critical: Immediate action required, life safety, or major exam changes.
      Important: Deadlines, required meetings, or significant events.
      Normal: General updates or minor events.
      Info: Non-essential or purely informational.
      
      Notice Title: ${title}
      Notice Content: ${content}
      
      Return ONLY one of the four words.`,
      config: {
        responseMimeType: "text/plain",
      }
    });
    const result = response.text?.trim();
    res.json({ urgency: result });
  } catch (error) {
    console.error("Classification error:", error);
    res.status(500).json({ error: "Classification failed" });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  const { query, notices } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are a helpful Campus Notice Board AI Assistant. 
      Answer the student's question based ONLY on the provided context of current notices.
      If the answer is not in the context, say "I couldn't find that specific information in current notices. Please search the feed or contact the relevant department."
      
      Context Notices:
      ${notices}
      
      Question: ${query}`,
    });
    res.json({ response: response.text });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Chat failed" });
  }
});

// ──────────── Supabase Data Endpoints ────────────

// Get all notices
app.get('/api/notices', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

// Create a notice
app.post('/api/notices', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notices')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({ error: "Failed to create notice" });
  }
});

// Delete a notice
app.delete('/api/notices/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ error: "Failed to delete notice" });
  }
});

// Serve static files from the Vite build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
