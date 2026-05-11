export async function summarizeNotice(content: string) {
  try {
    const response = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    return data.summary || content.substring(0, 100) + "...";
  } catch (error) {
    console.error("Summarization error:", error);
    return content.substring(0, 100) + "...";
  }
}

export async function classifyUrgency(title: string, content: string): Promise<"Critical" | "Important" | "Normal" | "Info"> {
  try {
    const response = await fetch('/api/ai/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    const data = await response.json();
    const result = data.urgency;
    const valid = ["Critical", "Important", "Normal", "Info"];
    return valid.includes(result) ? result : "Normal";
  } catch (error) {
    console.error("Classification error:", error);
    return "Normal";
  }
}

export async function chatAboutNotices(query: string, notices: string) {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, notices }),
    });
    const data = await response.json();
    return data.response || "I'm sorry, I'm having trouble processing that right now.";
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later.";
  }
}
