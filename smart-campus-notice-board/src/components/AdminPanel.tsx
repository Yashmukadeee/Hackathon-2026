import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, Loader2, Image as ImageIcon, Mic, PenTool, Feather, ShieldCheck } from 'lucide-react';
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
    <div className="relative wood-texture p-1 rounded-sm shadow-2xl border border-heritage-gold/20">
      <div className="bg-heritage-dark/95 p-8 border border-heritage-gold/10 relative overflow-hidden">
        {/* Decorative Internal Border */}
        <div className="absolute inset-2 border border-heritage-gold/5 pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between border-b border-heritage-gold/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-heritage-gold/10 flex items-center justify-center border border-heritage-gold/20">
                <Feather className="text-heritage-gold" size={20} />
              </div>
              <div>
                <h2 className="font-display text-xl gold-text tracking-widest uppercase">The Dispatch</h2>
                <p className="font-display text-[8px] text-heritage-gold/30 uppercase tracking-[0.4em] mt-1">Broadcast Authorization</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-heritage-gold/10 border border-heritage-gold/20 rounded-full">
               <ShieldCheck size={12} className="text-heritage-gold" />
               <span className="font-display text-[9px] text-heritage-gold uppercase tracking-widest">Level {profile?.role}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-display text-[10px] uppercase tracking-[0.3em] text-heritage-gold/40 ml-1">Bulletin Heading</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPosting}
                placeholder="SUBJECT OF RECORD..."
                className="w-full bg-black/40 border border-heritage-gold/10 px-4 py-4 font-serif italic text-heritage-gold outline-none focus:border-heritage-gold/40 transition-all placeholder:text-heritage-gold/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-display text-[10px] uppercase tracking-[0.3em] text-heritage-gold/40 ml-1">Classification</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                  disabled={isPosting}
                  className="w-full bg-black/40 border border-heritage-gold/10 px-4 py-4 font-display text-[10px] tracking-widest text-heritage-gold outline-none focus:border-heritage-gold/40 transition-all appearance-none cursor-pointer"
                >
                  <option value="Academic" className="bg-heritage-dark">Academic</option>
                  <option value="Event" className="bg-heritage-dark">Event</option>
                  <option value="Administrative" className="bg-heritage-dark">Administrative</option>
                  <option value="General" className="bg-heritage-dark">General</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-display text-[10px] uppercase tracking-[0.3em] text-heritage-gold/40 ml-1">Station</label>
                <div className="w-full h-[52px] flex items-center px-4 bg-black/20 border border-dashed border-heritage-gold/10 font-display text-[9px] uppercase tracking-widest text-heritage-gold/20">
                   {profile?.department || 'Central Hub'}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-display text-[10px] uppercase tracking-[0.3em] text-heritage-gold/40 ml-1">Broadcast Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isPosting}
                rows={4}
                placeholder="ENGRAVE YOUR MESSAGE INTO THE ARCHIVES..."
                className="w-full resize-none bg-black/40 border border-heritage-gold/10 px-4 py-4 font-serif text-heritage-gold/80 outline-none focus:border-heritage-gold/40 transition-all leading-relaxed placeholder:text-heritage-gold/10"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-900/10 border border-red-900/30 text-[10px] font-display uppercase tracking-widest text-red-400"
              >
                {error}
              </motion.div>
            )}

            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-4">
                <button type="button" className="text-heritage-gold/30 hover:text-heritage-gold transition-all"><ImageIcon size={18} /></button>
                <button type="button" className="text-heritage-gold/30 hover:text-heritage-gold transition-all"><Mic size={18} /></button>
              </div>
              
              <motion.button
                type="submit"
                disabled={isPosting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 bg-heritage-gold px-10 py-4 rounded-full text-heritage-dark font-display text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-black disabled:opacity-50"
              >
                {isPosting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    ENGRAVING...
                  </>
                ) : (
                  <>
                    SEAL & BROADCAST
                    <Send size={16} />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
