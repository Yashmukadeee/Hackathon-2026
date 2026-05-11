import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { NoticeCard } from './NoticeCard';
import { CampusNotice } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Search, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export function NoticeBoard() {
  const [notices, setNotices] = useState<CampusNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');

  useEffect(() => {
    fetchNotices();

    const channel = supabase
      .channel('notices-changes')
      .on('postgres_changes', { event: '*', table: 'notices' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotices((prev) => [payload.new as CampusNotice, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setNotices((prev) => prev.filter((n) => n.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setNotices((prev) =>
            prev.map((n) => (n.id === payload.new.id ? (payload.new as CampusNotice) : n))
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = category === 'All' 
    ? notices 
    : notices.filter(n => n.category === category);

  if (loading) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-heritage-gold/20" size={40} strokeWidth={1} />
        <p className="font-display text-[10px] text-heritage-gold/20 uppercase tracking-[0.6em]">Consulting the Archives</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 relative">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pb-12 border-b border-heritage-gold/5 relative z-10">
        <div className="space-y-2 text-center sm:text-left">
           <div className="flex items-center justify-center sm:justify-start gap-3">
              <Sparkles className="text-heritage-gold/40" size={16} />
              <h2 className="font-display text-4xl gold-text tracking-widest uppercase">The Ledger</h2>
           </div>
           <p className="font-display text-[9px] text-heritage-gold/30 uppercase tracking-[0.4em]">Official Broadcast Archives • 2026</p>
        </div>

        <div className="flex items-center gap-4 bg-black/40 p-1.5 rounded-full border border-heritage-gold/10 backdrop-blur-3xl">
          {['All', 'Academic', 'Event', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full font-display text-[10px] uppercase tracking-widest transition-all",
                category === cat 
                  ? "bg-heritage-gold text-heritage-dark shadow-2xl shadow-black" 
                  : "text-heritage-gold/40 hover:text-heritage-gold hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {filteredNotices.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[500px] flex flex-col items-center justify-center gap-6 text-center"
          >
            <BookOpen className="text-heritage-gold/5" size={80} strokeWidth={0.5} />
            <div className="space-y-2">
              <p className="font-serif italic text-heritage-gold/30 text-2xl">The parchment remains blank.</p>
              <p className="font-display text-[9px] text-heritage-gold/10 uppercase tracking-widest">No bulletins recorded in this channel</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 auto-rows-fr">
            <AnimatePresence mode="popLayout">
              {filteredNotices.map((notice, i) => (
                <NoticeCard key={notice.id} notice={notice} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Background Slogans inside the chalkboard frame */}
      <div className="absolute inset-x-0 bottom-0 py-12 text-center pointer-events-none select-none opacity-5 group-hover:opacity-10 transition-opacity">
         <h3 className="font-display text-[6vw] leading-none uppercase tracking-tighter text-white">Notice everything</h3>
         <h3 className="font-display text-[6vw] leading-none uppercase tracking-tighter text-white">Search nothing</h3>
      </div>
    </div>
  );
}
