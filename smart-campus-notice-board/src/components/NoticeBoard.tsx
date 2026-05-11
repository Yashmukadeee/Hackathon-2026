import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CampusNotice } from '../types';
import { NoticeCard } from './NoticeCard';
import { Loader2, Search } from 'lucide-react';
import { motion } from 'motion/react';

export function NoticeBoard() {
  const [notices, setNotices] = useState<CampusNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchNotices();

    const channel = supabase
      .channel('notices-changes')
      .on(
        'postgres_changes',
        { event: '*', table: 'notices' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotices((prev) => [payload.new as CampusNotice, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setNotices((prev) => prev.filter((n) => n.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setNotices((prev) =>
              prev.map((n) => (n.id === payload.new.id ? (payload.new as CampusNotice) : n))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (err) {
      console.error("Error fetching notices:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(filter.toLowerCase()) ||
    n.content.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin text-heritage-gold" size={32} />
        <span className="font-display text-xs tracking-widest uppercase text-heritage-gold">Consulting the Archives...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Chalkboard Header */}
      <div className="text-center space-y-4">
         <div className="inline-block border-y-2 border-heritage-gold/30 px-12 py-2">
            <h2 className="font-display text-5xl md:text-7xl gold-text tracking-tighter">
              NOTICE BOARD
            </h2>
         </div>
         <p className="font-serif italic text-heritage-gold/60 text-lg">Stay Updated, Stay Inspired</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage-gold/40 group-focus-within:text-heritage-gold transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="SEARCH THE BULLETIN..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-white/5 border border-heritage-gold/20 px-12 py-3 rounded-full font-display text-xs tracking-widest text-heritage-gold outline-none focus:border-heritage-gold/50 focus:bg-white/10 transition-all"
        />
      </div>

      {/* The Chalkboard Frame */}
      <div className="chalkboard rounded-sm p-8 md:p-16 min-h-[600px]">
        {/* Chalk Dust Effect Overlays */}
        <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
           <svg width="200" height="200" viewBox="0 0 200 200" className="text-white fill-current">
              <circle cx="50" cy="50" r="1" />
              <circle cx="150" cy="120" r="1.5" />
              <circle cx="80" cy="160" r="0.5" />
           </svg>
        </div>

        {filteredNotices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-white/20">
             <p className="font-handwriting text-3xl">The board is currently clean...</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-10">
            {filteredNotices.map((notice, i) => (
              <NoticeCard key={notice.id} notice={notice} index={i} />
            ))}
          </div>
        )}

        {/* Chalkboard Slogans */}
        <div className="mt-20 text-center space-y-2 opacity-10 pointer-events-none select-none">
           <h3 className="font-display text-5xl md:text-8xl text-white">Notice everything,</h3>
           <h3 className="font-display text-5xl md:text-8xl text-white">Search nothing.</h3>
        </div>
      </div>
    </div>
  );
}
