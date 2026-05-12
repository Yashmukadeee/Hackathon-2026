import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle, Clock, User, ArrowRight, X,
  Link as LinkIcon, BarChart3, CheckCircle2,
  Bookmark, ExternalLink, Vote
} from 'lucide-react';
import { CampusNotice } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface NoticeCardProps {
  notice: CampusNotice;
  index: number;
}

// ─── Inline Mini Poll ──────────────────────────────────────────
function MiniPoll({ poll, isSurvey }: { poll: NonNullable<CampusNotice['poll']>; isSurvey?: boolean }) {
  const [voted, setVoted] = useState<string | null>(null);
  const total = poll.options.reduce((s, o) => s + o.votes, 0);

  return (
    <div
      className="mt-4 space-y-2 p-4 rounded-sm bg-black/30 border border-heritage-gold/10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 mb-3">
        {isSurvey
          ? <Vote size={12} className="text-purple-400" />
          : <BarChart3 size={12} className="text-heritage-gold" />}
        <p className="font-display text-[9px] font-black uppercase tracking-[0.3em] text-heritage-gold/60">
          {isSurvey ? 'Survey' : 'Live Poll'} · {poll.question}
        </p>
      </div>

      <div className="space-y-2">
        {poll.options.map((opt) => {
          const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
          const isChosen = voted === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setVoted(opt.id)}
              disabled={!!voted}
              className={cn(
                "relative w-full h-9 rounded-sm overflow-hidden text-left transition-all",
                voted ? "cursor-default" : "hover:border-heritage-gold/40",
                isChosen ? "border border-heritage-gold/50" : "border border-white/5"
              )}
            >
              {/* progress bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: voted ? `${pct}%` : '0%' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "absolute inset-y-0 left-0",
                  isSurvey ? "bg-purple-900/40" : "bg-heritage-gold/10"
                )}
              />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <span className="font-display text-[9px] font-black uppercase tracking-widest text-heritage-paper/80">
                  {opt.text}
                </span>
                {voted && (
                  <span className={cn(
                    "font-display text-[10px] font-black",
                    isChosen ? "text-heritage-gold" : "text-white/30"
                  )}>
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {voted && (
        <p className="text-[8px] font-display uppercase tracking-[0.3em] text-heritage-gold/20 text-center pt-1">
          ✓ Consensus recorded in Heritage Archive
        </p>
      )}
    </div>
  );
}

// ─── Inline Nexus Links ────────────────────────────────────────
function NexusLinks({ links }: { links: NonNullable<CampusNotice['links']> }) {
  return (
    <div
      className="mt-4 flex flex-wrap gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-950/40 border border-blue-800/30 rounded-full hover:bg-blue-900/50 hover:border-blue-500/40 transition-all group/link"
        >
          <ExternalLink size={10} className="text-blue-400" />
          <span className="font-display text-[8px] font-black uppercase tracking-widest text-blue-300">
            {link.label}
          </span>
          <ArrowRight size={9} className="text-blue-400/50 group-hover/link:translate-x-0.5 transition-transform" />
        </a>
      ))}
    </div>
  );
}

// ─── Main Notice Card ──────────────────────────────────────────
export function NoticeCard({ notice, index }: NoticeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const urgencyStyles: Record<string, string> = {
    Critical: 'border-l-red-600 shadow-[0_20px_60px_-12px_rgba(153,27,27,0.4)]',
    Important: 'border-l-heritage-gold shadow-[0_20px_60px_-12px_rgba(212,175,55,0.2)]',
    Normal:   'border-l-white/10',
    Info:     'border-l-blue-600',
  };

  const rotations = [-1.5, 1.2, -0.8, 1.4, -1.2, 0.8];
  const rotation = rotations[index % rotations.length];

  return (
    <>
      {/* ── Card ── */}
      <motion.div
        layoutId={`card-${notice.id}`}
        initial={{ opacity: 0, y: 30, rotate: rotation + 4 }}
        animate={{ opacity: 1, y: 0, rotate: rotation }}
        whileHover={{ y: -12, rotate: 0, scale: 1.01 }}
        className={cn(
          "relative glass-panel border-l-2 rounded-sm p-8 cursor-pointer group",
          "transition-all duration-700",
          urgencyStyles[notice.urgency] ?? urgencyStyles.Normal
        )}
        onClick={() => setIsExpanded(true)}
      >
        {/* brass pin */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-heritage-gold to-heritage-bronze shadow-lg z-20 border-2 border-heritage-dark" />

        <div className="space-y-5">
          {/* category + urgency */}
          <div className="flex items-center justify-between">
            <span className="font-display text-[8px] font-black uppercase tracking-[0.6em] text-heritage-gold/40">
              {notice.category}
            </span>
            {notice.urgency === 'Critical' && (
              <AlertCircle className="text-red-500 animate-pulse" size={16} />
            )}
          </div>

          {/* title */}
          <h3 className="font-serif text-2xl font-black leading-tight gold-text">{notice.title}</h3>

          {/* summary */}
          <p className="font-serif italic text-heritage-paper/50 text-base line-clamp-2">
            "{notice.summary || notice.content.slice(0, 120)}"
          </p>

          {/* ── INLINE POLL / SURVEY ── */}
          {notice.poll && (
            <MiniPoll poll={notice.poll} isSurvey={notice.is_survey} />
          )}

          {/* ── INLINE LINKS ── */}
          {notice.links && notice.links.length > 0 && (
            <NexusLinks links={notice.links} />
          )}

          {/* footer */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full glass-panel border border-white/10 flex items-center justify-center">
                <User size={11} className="text-heritage-gold/40" />
              </div>
              <span className="text-[9px] font-display font-black uppercase tracking-widest text-white/25">
                {notice.author_name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/20">
              <Clock size={10} />
              <span className="text-[8px] font-display font-black uppercase tracking-widest">
                {format(new Date(notice.created_at), 'MMM d')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Full-screen Modal ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              layoutId={`card-${notice.id}`}
              className="max-w-2xl w-full glass-panel border border-white/10 rounded-sm p-12 overflow-y-auto max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>

              <div className="space-y-10">
                {/* record id */}
                <div className="flex items-center gap-3 text-heritage-gold/30 font-display text-[9px] font-black uppercase tracking-[0.8em]">
                  <Bookmark size={12} />
                  Heritage Archive · {notice.id.slice(0, 8)}
                </div>

                {/* title */}
                <h2 className="font-serif text-5xl font-black leading-tight gold-text">{notice.title}</h2>

                {/* blockquote summary */}
                {notice.summary && (
                  <blockquote className="border-l-2 border-heritage-gold/30 pl-6 font-serif italic text-2xl text-heritage-paper/60">
                    "{notice.summary}"
                  </blockquote>
                )}

                {/* body */}
                <p className="font-serif text-xl leading-relaxed text-heritage-paper/70 whitespace-pre-wrap">
                  {notice.content}
                </p>

                {/* links */}
                {notice.links && notice.links.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-display text-[9px] font-black uppercase tracking-[0.4em] text-heritage-gold/30">Nexus Links</h4>
                    <div className="flex flex-wrap gap-3">
                      {notice.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-6 py-3 glass-panel border border-heritage-gold/20 rounded-full hover:border-heritage-gold hover:bg-heritage-gold/10 transition-all"
                        >
                          <ExternalLink size={13} className="text-heritage-gold" />
                          <span className="font-display text-[10px] font-black uppercase tracking-widest text-heritage-paper">
                            {link.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* poll (full-size) */}
                {notice.poll && (
                  <div className="space-y-4">
                    <h4 className="font-display text-[9px] font-black uppercase tracking-[0.4em] text-heritage-gold/30">
                      {notice.is_survey ? 'Survey' : 'Live Consensus Poll'}
                    </h4>
                    <MiniPoll poll={notice.poll} isSurvey={notice.is_survey} />
                  </div>
                )}

                {/* author seal */}
                <div className="pt-8 border-t border-white/5">
                  <p className="font-display text-[9px] uppercase tracking-[0.4em] text-heritage-gold/20 mb-2">Authenticity Seal</p>
                  <p className="font-serif text-3xl font-black gold-text">{notice.author_name}</p>
                  {notice.department && (
                    <p className="font-display text-[9px] uppercase tracking-[0.3em] text-heritage-gold/20 mt-1">{notice.department}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
