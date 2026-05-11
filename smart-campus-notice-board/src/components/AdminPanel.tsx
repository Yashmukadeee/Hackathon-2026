import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, Loader2, Image as ImageIcon, Mic, PenTool } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { summarizeNotice, classifyUrgency } from '../services/aiService';
import { NoticeCategory } from '../types';
import { cn } from '../lib/utils';

export function AdminPanel() {
  const { user, profile } = useAuth();
  const [isPosting, setIsPosting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('General');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    if (!title || !content) {
      setError("Please provide both a subject and content.");
      return;
    }

    setIsPosting(true);
    setError(null);

    try {
      const [summary, urgency] = await Promise.all([
        summarizeNotice(content),
        classifyUrgency(title, content)
      ]);

      const { error: insertError } = await supabase
        .from('notices')
        .insert({
          title,
          content,
          summary,
          category,
          urgency,
          author_id: user.id,
          author_name: profile.display_name,
          department: profile.department || 'General',
        });

      if (insertError) {
        throw insertError;
      }

      setTitle('');
      setContent('');
      setCategory('General');
    } catch (err) {
      console.error("Error posting notice:", err);
      setError("The archives could not be updated. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="border border-heritage-gold/20 bg-[#121212] p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-heritage-gold/40" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-heritage-gold/40" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-heritage-gold/40" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-heritage-gold/40" />

      <div className="mb-8 flex items-center justify-between border-b border-heritage-gold/10 pb-4">
        <div className="flex items-center gap-3">
          <PenTool className="text-heritage-gold" size={20} />
          <h2 className="font-display text-xl gold-text tracking-widest uppercase">DISPATCH</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-display text-[10px] uppercase tracking-[0.2em] text-heritage-gold/40">Bulletin Subject</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPosting}
            placeholder="SUBJECT HEADING..."
            className="w-full bg-white/5 border border-heritage-gold/10 px-4 py-3 font-serif italic text-heritage-gold outline-none focus:border-heritage-gold/40 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-display text-[10px] uppercase tracking-[0.2em] text-heritage-gold/40">Departmental Channel</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoticeCategory)}
              disabled={isPosting}
              className="w-full bg-white/5 border border-heritage-gold/10 px-4 py-3 font-display text-[10px] tracking-widest text-heritage-gold outline-none focus:border-heritage-gold/40 transition-all appearance-none"
            >
              <option value="Academic" className="bg-[#121212]">Academic</option>
              <option value="Event" className="bg-[#121212]">Event</option>
              <option value="Administrative" className="bg-[#121212]">Administrative</option>
              <option value="General" className="bg-[#121212]">General</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-display text-[10px] uppercase tracking-[0.2em] text-heritage-gold/40">Verification</label>
            <div className="flex h-[46px] items-center px-4 font-display text-[9px] uppercase tracking-widest text-heritage-gold/30 bg-white/5 border border-dashed border-heritage-gold/10">
               {profile?.role} Clearance
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-display text-[10px] uppercase tracking-[0.2em] text-heritage-gold/40">Full Bulletin content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPosting}
            rows={5}
            placeholder="ENTER THE FULL DATASET..."
            className="w-full resize-none bg-white/5 border border-heritage-gold/10 px-4 py-3 font-serif text-heritage-gold outline-none focus:border-heritage-gold/40 transition-all leading-relaxed"
          />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/30 p-3 text-[10px] font-bold uppercase tracking-widest text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-heritage-gold/10 pt-6">
          <div className="flex gap-3">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center border border-heritage-gold/10 text-heritage-gold/40 hover:text-heritage-gold hover:border-heritage-gold/30 transition-all rounded-full"
            >
              <ImageIcon size={18} />
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center border border-heritage-gold/10 text-heritage-gold/40 hover:text-heritage-gold hover:border-heritage-gold/30 transition-all rounded-full"
            >
              <Mic size={18} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isPosting}
            className="flex items-center gap-3 bg-heritage-gold px-8 py-3 rounded-full text-black font-display text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
          >
            {isPosting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                ENGRAVING...
              </>
            ) : (
              <>
                BROADCAST
                <Send size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
