import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CampusNotice, NoticeCategory } from '../types';
import { NoticeCard } from './NoticeCard';
import { cn } from '../lib/utils';

export function NoticeBoard() {
  const [notices, setNotices] = useState<CampusNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<NoticeCategory | 'All'>('All');

  useEffect(() => {
    // Initial fetch
    async function fetchNotices() {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notices:', error);
      } else {
        setNotices(data as CampusNotice[]);
      }
      setLoading(false);
    }

    fetchNotices();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('notices-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notices' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotices(prev => [payload.new as CampusNotice, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotices(prev =>
              prev.map(n => n.id === (payload.new as CampusNotice).id ? payload.new as CampusNotice : n)
            );
          } else if (payload.eventType === 'DELETE') {
            setNotices(prev => prev.filter(n => n.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || notice.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: (NoticeCategory | 'All')[] = ['All', 'Academic', 'Event', 'Administrative', 'General'];

  return (
    <div className="flex flex-col gap-10">
      {/* Search and Filters */}
      <div className="flex flex-col gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={24} strokeWidth={3} />
          <input
            type="text"
            placeholder="SEARCH THE BOARD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-4 border-black bg-white py-4 pl-14 pr-6 text-xl font-black uppercase tracking-tighter outline-none transition-all focus:bg-yellow-50 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "border-2 border-black px-6 py-2 text-xs font-black uppercase tracking-widest transition-all",
                activeCategory === cat
                  ? "bg-black text-white shadow-none translate-x-0.5 translate-y-0.5"
                  : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-black" size={48} strokeWidth={3} />
          <p className="text-xs font-black uppercase tracking-widest">Refreshing...</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid gap-8">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center border-4 border-dashed border-black py-24 text-center bg-zinc-50"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center border-4 border-black bg-white">
                  <Search size={40} strokeWidth={3} className="text-black" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Zero results</h3>
                <p className="text-sm font-bold uppercase text-zinc-500 mt-2">Adjust your search parameters</p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
