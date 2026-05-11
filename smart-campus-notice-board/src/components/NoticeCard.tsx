import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { CampusNotice } from '../types';
import { cn } from '../lib/utils';

interface NoticeCardProps {
  notice: CampusNotice;
  index: number;
}

export function NoticeCard({ notice, index }: NoticeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Rotate notes slightly for a realistic "pinned" look
  const rotation = (index % 3 - 1) * 2; 

  const noteColors = {
    Critical: "bg-[#ff4d4d] text-white", // Red for critical
    Important: "bg-[#ffd966] text-black", // Yellow
    Normal: "bg-[#e2f0d9] text-black",   // Green
    Info: "bg-[#daeef3] text-black",     // Blue
  };

  const formattedDate = notice.created_at
    ? new Date(notice.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    : "Recently";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
      className={cn(
        "sticky-note w-full sm:w-64 aspect-square flex flex-col justify-between cursor-pointer",
        noteColors[notice.urgency]
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-black/10 pb-1">
          <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider">
            {formattedDate} • {notice.category}
          </span>
          {notice.urgency === 'Critical' && (
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          )}
        </div>
        
        <h3 className={cn(
          "font-handwriting text-xl leading-tight",
          notice.urgency === 'Critical' ? "font-bold" : "font-medium"
        )}>
          {notice.title}
        </h3>
        
        <p className="font-handwriting text-sm opacity-80 line-clamp-3">
          {notice.summary || notice.content}
        </p>
      </div>

      <div className="mt-auto pt-2 flex items-center justify-between border-t border-black/10">
        <span className="text-[9px] font-black uppercase tracking-tighter opacity-50">
          {notice.author_name}
        </span>
        <div className="flex items-center gap-1 opacity-40">
           <span className="text-[9px] font-bold italic">Read more</span>
        </div>
      </div>

      {/* Expanded Modal View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              layoutId={`card-${notice.id}`}
              className={cn(
                "max-w-md w-full p-8 shadow-2xl relative",
                noteColors[notice.urgency]
              )}
            >
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 text-2xl font-black hover:scale-110"
              >
                ×
              </button>
              
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">{notice.category}</span>
                <h2 className="font-handwriting text-4xl mt-2">{notice.title}</h2>
              </div>

              <div className="space-y-4 font-handwriting text-lg leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                {notice.summary && (
                  <div className="bg-black/5 p-4 italic border-l-4 border-black/20">
                    "{notice.summary}"
                  </div>
                )}
                <div className="whitespace-pre-wrap">
                  {notice.content}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-black/10 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-50">Posted By</p>
                  <p className="font-handwriting text-xl">{notice.author_name}</p>
                  <p className="text-[10px] opacity-40 uppercase tracking-widest">{notice.department}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold uppercase opacity-50">{formattedDate}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
