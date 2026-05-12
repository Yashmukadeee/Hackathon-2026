import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { CampusNotice } from '../types';
import { NoticeCard } from './NoticeCard';
import { Book, Search, Filter, ArrowLeft, Sparkles, History, Landmark, Scroll, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { FALLBACK_NOTICES } from './NoticeBoard';

interface ArchivePageProps {
  onBack: () => void;
}

export function ArchivePage({ onBack }: ArchivePageProps) {
  const [notices, setNotices] = useState<CampusNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    let loaded = false;
    const timeout = setTimeout(() => {
      if (!loaded) {
        console.warn('Supabase fetch timed out, using fallbacks for archives');
        setNotices(FALLBACK_NOTICES);
        setLoading(false);
      }
    }, 3000);

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      loaded = true;
      if (error) throw error;
      
      if (!data || data.length === 0) {
        setNotices(FALLBACK_NOTICES);
      } else {
        setNotices(data);
      }
    } catch (err) {
      console.error("Error fetching archives:", err);
      if (!loaded) setNotices(FALLBACK_NOTICES);
    } finally {
      loaded = true;
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const filteredArchives = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-heritage-dark overflow-y-auto scrollbar-hide"
    >
      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.05),transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
          <div className="flex items-center gap-8">
            <button 
              onClick={onBack}
              className="w-14 h-14 rounded-full border border-heritage-gold/20 flex items-center justify-center text-heritage-gold/40 hover:text-heritage-gold hover:border-heritage-gold transition-all group"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Scroll className="text-heritage-gold/40" size={16} />
                <h1 className="font-display text-4xl gold-text tracking-[0.3em] uppercase">The Scriptorium Ledger</h1>
              </div>
              <p className="font-display text-[10px] text-heritage-gold/30 uppercase tracking-[0.5em]">Central Repositories of Heritage Institutions • Established 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/40 p-2 rounded-full border border-heritage-gold/10 backdrop-blur-2xl">
            <div className="flex items-center gap-3 px-6 border-r border-heritage-gold/10">
              <Search size={16} className="text-heritage-gold/30" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH THE RECORDS..."
                className="bg-transparent border-none outline-none font-display text-[10px] tracking-widest text-heritage-gold placeholder:text-heritage-gold/10 w-48"
              />
            </div>
            <div className="flex gap-2 px-4">
              {['All', 'Academic', 'Event', 'General'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full font-display text-[9px] uppercase tracking-widest transition-all",
                    selectedCategory === cat 
                      ? "bg-heritage-gold text-heritage-dark" 
                      : "text-heritage-gold/30 hover:text-heritage-gold"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border border-heritage-gold/10 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <History className="text-heritage-gold/20 animate-pulse" size={32} />
              </div>
            </div>
            <p className="font-display text-[10px] text-heritage-gold/20 uppercase tracking-[0.8em]">Unsealing the Archives</p>
          </div>
        ) : filteredArchives.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center gap-8 text-center">
            <Landmark className="text-heritage-gold/5" size={100} strokeWidth={0.5} />
            <div className="space-y-4">
              <h2 className="font-serif italic text-3xl text-heritage-gold/30">The scrolls have not yet been written.</h2>
              <p className="font-display text-[9px] text-heritage-gold/10 uppercase tracking-widest leading-loose">No records match your current inquiry in the heritage database.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 auto-rows-fr">
            <AnimatePresence>
              {filteredArchives.map((notice, i) => (
                <NoticeCard key={notice.id} notice={notice} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Floating Ambient Info */}
        <div className="mt-32 border-t border-heritage-gold/5 pt-12 flex flex-col items-center gap-8 opacity-20">
           <ShieldCheck size={40} strokeWidth={0.5} className="text-heritage-gold" />
           <p className="font-display text-[9px] text-center max-w-md uppercase tracking-[0.3em] leading-loose">
             Access to the Scriptorium Ledger is restricted to authorized personnel. 
             Every entry is digitally signed and preserved for perpetuity under the 
             Heritage Privacy Charter of 2026.
           </p>
        </div>
      </div>
    </motion.div>
  );
}
