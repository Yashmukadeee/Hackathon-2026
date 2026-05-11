import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, Loader2, Image as ImageIcon, Mic } from 'lucide-react';
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
      setError("TITLE AND CONTENT ARE MANDATORY.");
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
      setError("SYSTEM ERROR: UNABLE TO BROADCAST.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-8 flex items-center justify-between border-b-2 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-black p-2 text-white">
            <Sparkles size={20} strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Dispatch</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bulletin Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPosting}
            placeholder="SUBJECT HEADING..."
            className="w-full border-2 border-black bg-white px-4 py-3 text-sm font-bold uppercase outline-none focus:bg-yellow-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Channel</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoticeCategory)}
              disabled={isPosting}
              className="w-full border-2 border-black bg-white px-4 py-3 text-sm font-bold uppercase outline-none focus:bg-yellow-50"
            >
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="Administrative">Administrative</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Authorization</label>
            <div className="flex h-[50px] items-center px-4 text-xs font-black uppercase tracking-tight text-white bg-black">
              Verified {profile?.role}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Notice content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPosting}
            rows={5}
            placeholder="ENTER FULL DATASET..."
            className="w-full resize-none border-2 border-black bg-white px-4 py-3 text-sm font-bold outline-none focus:bg-yellow-50"
          />
        </div>

        {error && (
          <div className="bg-red-600 p-3 text-[10px] font-black uppercase tracking-widest text-white">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between border-t-2 border-black pt-4">
          <div className="flex gap-2">
            <button
              type="button"
              className="border-2 border-black p-2 text-black hover:bg-black hover:text-white transition-colors"
            >
              <ImageIcon size={20} strokeWidth={3} />
            </button>
            <button
              type="button"
              className="border-2 border-black p-2 text-black hover:bg-black hover:text-white transition-colors"
            >
              <Mic size={20} strokeWidth={3} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isPosting}
            className="flex items-center gap-3 border-4 border-black bg-black px-8 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] transition-all hover:bg-yellow-400 hover:text-black active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
          >
            {isPosting ? (
              <>
                <Loader2 className="animate-spin" size={20} strokeWidth={3} />
                Analysing...
              </>
            ) : (
              <>
                Broadcast
                <Send size={20} strokeWidth={3} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
