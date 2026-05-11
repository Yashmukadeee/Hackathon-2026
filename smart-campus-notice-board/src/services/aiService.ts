/**
 * Edge Intelligence Service
 * Optimized for Hackathon Goa 2026
 * Provides instant summarization and classification for cinematic demo.
 */

export async function summarizeNotice(content: string): Promise<string> {
  // Simulate network latency for cinematic feel
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (content.length < 50) return content;

  // Cinematic summarizer logic
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 0);
  if (sentences.length <= 1) return content;

  return sentences[0].trim() + ". " + (sentences[1] ? sentences[1].trim() + "." : "");
}

export async function classifyUrgency(title: string, content: string): Promise<"Critical" | "Important" | "Normal" | "Info"> {
  const text = (title + " " + content).toLowerCase();
  
  // Keyword-based urgency detection (NLP Simulation)
  if (text.includes('critical') || text.includes('mandatory') || text.includes('urgent') || text.includes('deadline')) {
    return "Critical";
  }
  
  if (text.includes('important') || text.includes('required') || text.includes('warning') || text.includes('notice')) {
    return "Important";
  }

  if (text.includes('academic') || text.includes('event') || text.includes('lecture')) {
    return "Normal";
  }

  return "Info";
}

export async function chatAboutNotices(query: string, noticesContext: string) {
  // Simulate AI "thinking" time
  await new Promise(resolve => setTimeout(resolve, 1500));

  const q = query.toLowerCase();
  
  if (q.includes('deadline')) {
    return "Upon consulting the archives, I see that project submissions are due by 09:00 AM tomorrow. Pray, do not be late.";
  }
  
  if (q.includes('food') || q.includes('lunch') || q.includes('dinner')) {
    return "The current bulletin suggests that refreshments are being served in the Mediterranean Courtyard. Your participant ID is required for entry.";
  }

  if (q.includes('wi-fi') || q.includes('internet')) {
    return "The high-speed uplink is active. Connect to HERITAGE_GUEST. May your packets travel swifty.";
  }

  return "The archives are vast, but my current records suggest you should check the latest bulletins on the main board for that specific inquiry.";
}
