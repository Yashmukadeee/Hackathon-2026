import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { CampusNotice } from '../types';
import { cn } from '../lib/utils';

interface NoticeCardProps {
  notice: CampusNotice;
}

export function NoticeCard({ notice }: NoticeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const urgencyStyles = {
    Critical: "bg-red-600 text-white",
    Important: "bg-yellow-400 text-black",
    Normal: "bg-black text-white",
    Info: "bg-zinc-200 text-zinc-600",
  };

  const formattedDate = notice.created_at
    ? new Date(notice.created_at)
    : new Date();
    
  const month = formattedDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = formattedDate.getDate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative flex gap-6 border-4 border-black bg-white p-6 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        notice.urgency === 'Critical' && "bg-white"
      )}
    >
      {/* Date Sideline */}
      <div className="flex flex-col items-center justify-start border-r-2 border-dashed border-black pr-6 pt-1">
        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">{month}</span>
        <span className="text-4xl font-black leading-none">{day}</span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
                urgencyStyles[notice.urgency]
              )}>
                {notice.urgency}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-500">
                {notice.author_name} • {notice.category}
              </span>
            </div>
            <h3 className="text-3xl font-black uppercase leading-[1.1] tracking-tighter text-black">
              {notice.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {notice.summary && (
            <div className={cn(
              "border-l-4 p-4 text-sm font-bold italic leading-relaxed",
              notice.urgency === 'Critical' ? "border-red-600 bg-red-50" : "border-black bg-zinc-50"
            )}>
              AI Summary: {notice.summary}
            </div>
          )}

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="border-t-2 border-zinc-100 pt-4 text-sm font-medium leading-relaxed text-zinc-700 whitespace-pre-wrap">
                  {notice.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / Expand Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-black"
        >
          {isExpanded ? (
            <>
              Collapse Details <ChevronUp size={14} strokeWidth={3} />
            </>
          ) : (
            <>
              Read Full Bulletin <ChevronDown size={14} strokeWidth={3} />
            </>
          )}
        </button>
      </div>
      
      {/* Absolute Urgency Bar */}
      {notice.urgency === 'Critical' && (
        <div className="absolute top-0 right-0 h-2 w-full bg-red-600" />
      )}
    </motion.div>
  );
}
