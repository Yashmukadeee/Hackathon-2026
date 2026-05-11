import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Loader2, Sparkles, User, Bot } from 'lucide-react';
import { chatAboutNotices } from '../services/aiService';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hi! I\'m your Campus AI Assistant. You can ask me anything about the recent notices on the board!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Fetch relevant notices for context (RAG)
      const { data: noticesData, error } = await supabase
        .from('notices')
        .select('title, category, urgency, content')
        .order('created_at', { ascending: false })
        .limit(20);

      const context = (noticesData || []).map(d => {
        return `Title: ${d.title}\nCategory: ${d.category}\nUrgency: ${d.urgency}\nContent: ${d.content}\n---`;
      }).join('\n');

      // 2. Call AI with context
      const responseText = await chatAboutNotices(input, context);
      
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: responseText };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat widget error:", error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: "I'm having a bit of trouble fetching the board data right now. Please try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-6 flex h-[600px] w-[400px] flex-col overflow-hidden border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-black p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 p-2 text-black">
                  <Sparkles size={20} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Campus AI</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Retrieval Augmented</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="border-2 border-white p-1 hover:bg-white hover:text-black transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex items-start gap-4",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "border-2 border-black p-2 shrink-0",
                    msg.role === 'user' ? "bg-white" : "bg-yellow-400"
                  )}>
                    {msg.role === 'user' ? <User size={18} strokeWidth={3} /> : <Bot size={18} strokeWidth={3} />}
                  </div>
                  <div className={cn(
                    "border-2 border-black px-4 py-3 text-sm font-bold uppercase tracking-tight",
                    msg.role === 'user' 
                      ? "bg-white text-black" 
                      : "bg-black text-white"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-4">
                  <div className="border-2 border-black p-2 bg-yellow-400">
                    <Bot size={18} strokeWidth={3} />
                  </div>
                  <div className="border-2 border-black bg-black px-4 py-3">
                    <Loader2 className="animate-spin text-white" size={18} strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="border-t-4 border-black p-6 bg-white">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ASK THE AI..."
                  className="flex-1 text-sm font-black uppercase outline-none placeholder:text-zinc-300"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="bg-black p-3 text-white transition-all hover:bg-yellow-400 hover:text-black active:translate-x-1 active:translate-y-1 disabled:opacity-30"
                >
                  <Send size={20} strokeWidth={3} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-20 w-20 items-center justify-center border-4 border-black bg-yellow-400 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
      >
        {isOpen ? <X size={32} strokeWidth={4} /> : <MessageSquare size={32} strokeWidth={4} />}
        <div className="absolute -right-2 -top-2 border-2 border-black border-l-0 border-b-0 bg-red-600 px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
          AI
        </div>
      </button>
    </div>
  );
}
