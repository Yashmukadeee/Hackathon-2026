import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Loader2, Sparkles, User, Bot, GraduationCap, Feather, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatAboutNotices } from '../services/aiService';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWidgetProps {
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ChatWidget({ forceOpen, onOpenChange }: ChatWidgetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = forceOpen !== undefined ? forceOpen : internalOpen;
  
  const setIsOpen = (val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    setInternalOpen(val);
  };

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Greetings, seeker of knowledge. I am the Archive Scribe. How may I assist your inquiries into the college records today?' }
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
      const { data: noticesData } = await supabase
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
    } catch (error: any) {
      console.error("Chat widget error:", error);
      const errorMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: `I encounter difficulty reaching the records. Error: ${error.message || 'Unknown Uplink Failure'}` 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[1001]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, rotate: 2 }}
            className="mb-8 flex h-[650px] w-[450px] flex-col overflow-hidden wood-frame shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative"
          >
            {/* Parchment Background */}
            <div className="absolute inset-0 bg-[#f4e4bc] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-100 pointer-events-none" />
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.2)] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-black/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black/5 border border-black/10 flex items-center justify-center">
                  <Feather className="text-black/60" size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-black leading-none">The Archive AI</h3>
                  <p className="font-display text-[8px] uppercase tracking-[0.4em] text-black/40 mt-1 italic">Vocalized Scriptorium</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-10 h-10 flex items-center justify-center text-black/40 hover:text-black hover:bg-black/5 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id} 
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                     <span className="font-display text-[8px] uppercase tracking-widest text-black/30">
                        {msg.role === 'user' ? 'Inquirer' : 'The Scribe'}
                     </span>
                  </div>
                  <div className={cn(
                    "px-6 py-4 text-sm leading-relaxed font-serif shadow-sm prose prose-sm max-w-full",
                    msg.role === 'user' 
                      ? "bg-black/5 text-black italic rounded-l-2xl rounded-tr-2xl border-r-4 border-black/20" 
                      : "bg-white/40 text-black rounded-r-2xl rounded-tl-2xl border-l-4 border-black/10 prose-p:my-1 prose-strong:text-black"
                  )}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2 bg-white/20 px-6 py-4 rounded-full">
                    <div className="w-1 h-1 bg-black/40 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-black/40 rounded-full animate-bounce delay-100" />
                    <div className="w-1 h-1 bg-black/40 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="relative z-10 p-8 pt-0">
              <div className="flex items-center gap-4 bg-white/40 border border-black/10 rounded-full pl-6 pr-2 py-2 focus-within:bg-white/60 transition-all shadow-inner">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inquire within the records..."
                  className="flex-1 bg-transparent py-2 font-serif text-black outline-none placeholder:text-black/30 italic"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-30"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-20 h-20 flex items-center justify-center rounded-full bg-heritage-dark wood-frame shadow-2xl transition-all hover:scale-110 hover:shadow-heritage-gold/30 active:scale-95 border-2 border-heritage-gold/40"
      >
        <div className="absolute inset-0 rounded-full border-2 border-heritage-gold animate-ping opacity-10" />
        {isOpen ? (
          <X size={28} className="text-heritage-gold" />
        ) : (
          <div className="relative">
             <MessageSquare size={28} className="text-heritage-gold" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-heritage-dark" />
          </div>
        )}
        
        {!isOpen && (
          <div className="absolute right-full mr-6 px-4 py-2 bg-heritage-gold text-heritage-dark font-display text-[10px] uppercase tracking-[0.3em] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl">
            Consult the Scribe
          </div>
        )}
      </button>
    </div>
  );
}
