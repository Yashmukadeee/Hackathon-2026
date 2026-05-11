import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Loader2, Sparkles, User, Bot, GraduationCap } from 'lucide-react';
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
    { id: '1', role: 'assistant', content: 'Greetings. I am the Campus Archive Assistant. How may I assist your inquiries today?' }
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
      const { data: noticesData, error } = await supabase
        .from('notices')
        .select('title, category, urgency, content')
        .order('created_at', { ascending: false })
        .limit(20);

      const context = (noticesData || []).map(d => {
        return `Title: ${d.title}\nCategory: ${d.category}\nUrgency: ${d.urgency}\nContent: ${d.content}\n---`;
      }).join('\n');

      const responseText = await chatAboutNotices(input, context);
      
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: responseText };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat widget error:", error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: "I encounter difficulty reaching the records. Pray, try again shortly." };
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
            className="mb-6 flex h-[600px] w-[400px] flex-col overflow-hidden border border-heritage-gold/20 bg-[#121212] shadow-2xl rounded-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-heritage-dark border-b border-heritage-gold/10 p-5 text-heritage-gold">
              <div className="flex items-center gap-3">
                <div className="bg-heritage-gold/10 p-2 rounded-full border border-heritage-gold/30">
                  <GraduationCap size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-display text-sm gold-text tracking-widest uppercase">Archive AI</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-heritage-gold/40 italic">Retrieval Augmented</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-heritage-gold/40 hover:text-heritage-gold transition-colors"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex items-start gap-4",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                    msg.role === 'user' ? "bg-white/5 border-white/10" : "bg-heritage-gold/10 border-heritage-gold/30"
                  )}>
                    {msg.role === 'user' ? <User size={14} className="text-white/40" /> : <Bot size={14} className="text-heritage-gold" />}
                  </div>
                  <div className={cn(
                    "px-4 py-3 text-sm rounded-2xl max-w-[80%]",
                    msg.role === 'user' 
                      ? "bg-white/5 text-white/80 font-serif italic" 
                      : "bg-heritage-gold/5 text-heritage-gold font-serif italic border border-heritage-gold/10"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-heritage-gold/10 border border-heritage-gold/30">
                    <Bot size={14} className="text-heritage-gold" />
                  </div>
                  <div className="bg-heritage-gold/5 border border-heritage-gold/10 px-4 py-3 rounded-2xl">
                    <Loader2 className="animate-spin text-heritage-gold" size={14} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="border-t border-heritage-gold/10 p-6 bg-heritage-dark">
              <div className="flex items-center gap-3 bg-white/5 border border-heritage-gold/10 rounded-full px-4 py-1 focus-within:border-heritage-gold/40 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="INQUIRE WITHIN..."
                  className="flex-1 bg-transparent py-2 text-xs font-display tracking-widest uppercase text-heritage-gold outline-none placeholder:text-heritage-gold/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="text-heritage-gold hover:scale-110 transition-transform active:scale-95 disabled:opacity-30"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-16 h-16 flex items-center justify-center rounded-full bg-heritage-dark border-2 border-heritage-gold shadow-2xl transition-all hover:scale-110 hover:shadow-heritage-gold/20 active:scale-95"
      >
        <div className="absolute inset-0 rounded-full border border-heritage-gold/20 animate-ping opacity-20" />
        {isOpen ? <X size={24} className="text-heritage-gold" /> : <MessageSquare size={24} className="text-heritage-gold" />}
      </button>
    </div>
  );
}
