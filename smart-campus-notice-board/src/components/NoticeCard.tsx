import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Clock, MapPin, User, ArrowRight, X } from 'lucide-react';
import { CampusNotice } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface NoticeCardProps {
  notice: CampusNotice;
  index: number;
}

export function NoticeCard({ notice, index }: NoticeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const urgencyStyles = {
    Critical: 'border-red-500/50 bg-red-50/95 text-red-900',
    Important: 'border-amber-500/50 bg-amber-50/95 text-amber-900',
    Normal: 'border-blue-500/30 bg-blue-50/95 text-blue-900',
    Info: 'border-slate-500/20 bg-slate-50/95 text-slate-900',
  };

  const rotations = [-1.5, 1.2, -0.8, 1.5, -1, 0.5];
  const rotation = rotations[index % rotations.length];

  return (
    <>
      <motion.div
        layoutId={`card-${notice.id}`}
        initial={{ opacity: 0, y: 20, rotate: rotation + 5 }}
        whileInView={{ opacity: 1, y: 0, rotate: rotation }}
        whileHover={{ 
          y: -15, 
          rotate: 0, 
          scale: 1.02,
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)"
        }}
        onClick={() => setIsExpanded(true)}
        className={cn(
          "relative p-8 shadow-2xl transition-all duration-500 cursor-pointer group select-none h-full flex flex-col",
          "border-t-[10px] border-black/5",
          urgencyStyles[notice.urgency]
        )}
      >
        {/* Brass Pin */}
        <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-heritage-gold to-yellow-900 shadow-lg z-20 border border-yellow-600/50">
          <div className="absolute inset-0.5 rounded-full bg-white/20 blur-[0.5px]" />
        </div>

        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-40 pointer-events-none" />
        
        <div className="relative z-10 flex-1 flex flex-col space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-display text-[9px] uppercase tracking-[0.3em] opacity-50">
                {notice.category} • {notice.department}
              </span>
              <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-black transition-colors">
                {notice.title}
              </h3>
            </div>
            {notice.urgency === 'Critical' && (
              <AlertCircle className="text-red-600 animate-pulse" size={18} />
            )}
          </div>

          <p className="font-serif italic opacity-70 leading-relaxed line-clamp-3 text-sm flex-1">
            "{notice.summary || notice.content}"
          </p>

          <div className="pt-6 border-t border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 opacity-40">
                  <User size={10} />
                  <span className="text-[9px] font-display uppercase tracking-widest">{notice.author_name}</span>
               </div>
               <div className="flex items-center gap-1.5 opacity-40">
                  <Clock size={10} />
                  <span className="text-[9px] font-display uppercase tracking-widest">
                    {format(new Date(notice.created_at), 'MMM d')}
                  </span>
               </div>
            </div>
            
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </div>
        </div>

        {/* Dog-ear fold */}
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-black/10 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              layoutId={`card-${notice.id}`}
              className={cn(
                "max-w-2xl w-full p-12 shadow-2xl relative border-t-[12px] border-black/10",
                urgencyStyles[notice.urgency]
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-40 pointer-events-none" />
              
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <span className="font-display text-[10px] uppercase tracking-[0.5em] opacity-40">
                    Bulletin Archive #{notice.id.slice(0, 8)}
                  </span>
                  <h2 className="font-serif text-5xl font-black leading-tight text-black">
                    {notice.title}
                  </h2>
                </div>

                <div className="space-y-6 font-serif text-lg leading-relaxed text-black/80 max-h-[50vh] overflow-y-auto pr-6">
                  {notice.summary && (
                    <div className="p-6 bg-black/5 italic border-l-4 border-black/20 text-xl">
                      "{notice.summary}"
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {notice.content}
                  </div>
                </div>

                <div className="pt-12 border-t border-black/10 flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="font-display text-[9px] uppercase tracking-widest opacity-40">Engraved by</p>
                    <p className="font-serif text-2xl font-bold">{notice.author_name}</p>
                    <p className="font-display text-[9px] uppercase tracking-widest opacity-40">{notice.department} Department</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-[10px] uppercase tracking-widest opacity-40">Broadcasted</p>
                    <p className="font-serif text-xl">{format(new Date(notice.created_at), 'MMMM do, yyyy')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
