import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { NoticeCard } from './NoticeCard';
import { CampusNotice } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Search, Loader2, BookOpen, Sparkles, ScrollText } from 'lucide-react';
import { cn } from '../lib/utils';

export const FALLBACK_NOTICES: CampusNotice[] = [
  {
    id: 'fb1',
    title: "BREAKTHROUGH: The End of Gravity",
    content: "Heritage Institute's Advanced Physics Lab has achieved a stable Gravitational Flux Displacement. By utilizing rotating superconductors to trigger the Podkletnov Effect, we have successfully warped the local space-time metric. Floating Lecture Halls are scheduled for installation in the North Quad by next semester.",
    summary: "Antigravity Propulsion achieved via Gravitational Flux Displacement.",
    category: "Academic", urgency: "Critical",
    author_id: 'sys', author_name: "Dr. Alistair Heritage", department: "Advanced Physics Lab",
    links: [{ label: "Technical Summary", url: "#" }, { label: "Lab Registration", url: "#" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fb2',
    title: "Heritage Music Gala — Registration Open",
    content: "Join us for an evening of neoclassical fusion at the Grand Hall. The Scriptorium Quartet and three guest virtuosos will perform. Seats are limited to 200. Register now and choose your dietary preference.",
    summary: "Annual Heritage Music Gala — register before seats run out.",
    category: "Event", urgency: "Important",
    author_id: 'sys', author_name: "Arts & Culture Dept",
    links: [{ label: "Reserve Seat", url: "#" }, { label: "Gala Programme", url: "#" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fb3',
    title: "POLL: Preferred Hackathon Tech Stack",
    content: "We are conducting a live consensus on the preferred technologies for this year's hackathon builds. Cast your vote to influence the mentor pool distribution.",
    summary: "Vote for the preferred hackathon tech stack.",
    category: "Event", urgency: "Normal",
    author_id: 'sys', author_name: "Hackathon Org",
    poll: {
      question: "Which primary stack are you using?",
      options: [
        { id: '1', text: 'React + Supabase', votes: 120 },
        { id: '2', text: 'Next.js + Prisma', votes: 85 },
        { id: '3', text: 'SvelteKit + Go', votes: 42 }
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fb4',
    title: "Advanced Robotics: Induction Resources",
    content: "New lab protocols for the Robotics Wing have been published. All Tier-2 researchers must review the safety documentation regarding Autonomous Agent safety boundaries before their next session.",
    summary: "Updated safety protocols for Robotics Lab researchers.",
    category: "Academic", urgency: "Important",
    author_id: 'sys', author_name: "Robotics Faculty", department: "Engineering",
    links: [{ label: "Safety Docs", url: "#" }, { label: "Schedule Induction", url: "#" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fb5',
    title: "SURVEY: Exam Season Canteen Hours",
    content: "The Student Council is gauging interest in 24/7 canteen access during finals. This proposal requires a 75% consensus to move to the Faculty Board.",
    summary: "Vote on the 24/7 canteen access proposal.",
    category: "Administrative", urgency: "Info",
    author_id: 'sys', author_name: "Student Council",
    is_survey: true,
    poll: {
      question: "Approve 24/7 Canteen Access?",
      options: [
        { id: '1', text: 'Approve', votes: 450 },
        { id: '2', text: 'Deny', votes: 21 }
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fb6',
    title: "Digital Scriptorium Library Updated",
    content: "The digital archives have been updated with 240 new entries covering Quantum Cryptography, Agentic AI Architectures, and Heritage Preservation Law. Faculty must review the new archival standards.",
    summary: "240 new academic resources added to the digital library.",
    category: "Academic", urgency: "Normal",
    author_id: 'sys', author_name: "Library Council",
    links: [{ label: "Browse Library", url: "#" }, { label: "Faculty Portal", url: "#" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fb7',
    title: "POLL: Best Campus Study Spot?",
    content: "Help us understand where students concentrate best. The top two locations will receive premium furniture upgrades and 24/7 keycard access from next semester.",
    summary: "Vote for your favourite campus study location.",
    category: "General", urgency: "Info",
    author_id: 'sys', author_name: "Campus Welfare",
    poll: {
      question: "Where do you study best?",
      options: [
        { id: '1', text: 'The Scriptorium (Library)', votes: 310 },
        { id: '2', text: 'North Quad Courtyard', votes: 190 },
        { id: '3', text: 'Lab 4B After Hours', votes: 87 },
        { id: '4', text: 'Canteen Corner', votes: 55 }
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fb8',
    title: "TEDx Heritage 2026 — Speaker Applications",
    content: "We are accepting speaker applications for TEDx Heritage 2026 under the theme 'The Archaeology of Tomorrow'. Applications close June 1st. All disciplines welcome.",
    summary: "Apply to speak at TEDx Heritage 2026 — closing June 1st.",
    category: "Event", urgency: "Important",
    author_id: 'sys', author_name: "TEDx Committee",
    links: [{ label: "Apply Now", url: "#" }, { label: "Speaker Guide", url: "#" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fb9',
    title: "SURVEY: Curriculum Feedback 2025–26",
    content: "The Academic Senate is collecting structured feedback on course content, teaching methods, and assessment formats for the 2025–26 academic year. All responses are anonymous.",
    summary: "Anonymous curriculum feedback survey — takes 5 minutes.",
    category: "Academic", urgency: "Normal",
    author_id: 'sys', author_name: "Academic Senate",
    is_survey: true,
    poll: {
      question: "Overall satisfaction with 2025–26 curriculum?",
      options: [
        { id: '1', text: 'Excellent', votes: 98 },
        { id: '2', text: 'Good', votes: 210 },
        { id: '3', text: 'Needs Improvement', votes: 67 },
        { id: '4', text: 'Poor', votes: 14 }
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fb10',
    title: "URGENT: Heritage Portal Maintenance",
    content: "The Heritage Student Portal will be offline from 2:00 AM to 6:00 AM on Saturday for critical infrastructure upgrades. Please submit all pending assignments before midnight Friday.",
    summary: "Portal offline Sat 2–6 AM. Submit assignments before midnight Friday.",
    category: "Administrative", urgency: "Critical",
    author_id: 'sys', author_name: "IT Infrastructure Team",
    links: [{ label: "Status Page", url: "#" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function NoticeBoard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<CampusNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');

  useEffect(() => {
    fetchNotices(); // fetch immediately — RLS is off, no auth needed

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
  }, [user]);                           // ← re-run when user auth state is known

  const fetchNotices = async () => {
    let loaded = false;
    const timeout = setTimeout(() => {
      if (!loaded) {
        console.warn('Supabase fetch timed out, using fallbacks');
        setNotices(FALLBACK_NOTICES);
        setLoading(false);
      }
    }, 3000); // reduced timeout to 3s

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
    } catch (error) {
      console.error('Error fetching notices:', error);
      if (!loaded) setNotices(FALLBACK_NOTICES);
    } finally {
      loaded = true;
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const filteredNotices = category === 'All' 
    ? notices 
    : notices.filter(n => n.category === category);

  if (loading) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center gap-12">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border border-heritage-gold/5 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <ScrollText className="text-heritage-gold/20 animate-pulse" size={40} strokeWidth={0.5} />
          </div>
        </div>
        <p className="font-display text-[11px] text-heritage-gold/20 uppercase tracking-[1em] ml-4">Unsealing Archive</p>
      </div>
    );
  }

  return (
    <div className="space-y-24 relative pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-12 border-b border-white/5 pb-16">
        <div className="space-y-4">
           <div className="flex items-center gap-4 text-heritage-gold">
              <div className="h-px w-12 bg-heritage-gold/20" />
              <span className="font-display text-[10px] font-black uppercase tracking-[0.6em]">The Dispatch</span>
           </div>
           <h2 className="font-serif text-7xl font-black italic gold-text tracking-tighter">The Ledger.</h2>
           <p className="font-serif text-xl italic text-heritage-paper/30">"A collection of the institution's most vital broadcasts."</p>
        </div>

        <div className="flex items-center gap-3 glass-panel p-1.5 rounded-full border border-white/5 shadow-2xl">
          {['All', 'Academic', 'Event', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-8 py-3 rounded-full font-display text-[9px] font-black uppercase tracking-widest transition-all duration-700",
                category === cat 
                  ? "bg-heritage-gold text-heritage-dark shadow-[0_10px_30px_rgba(212,175,55,0.3)]" 
                  : "text-white/20 hover:text-white hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asymmetrical Notice Grid */}
      <div className="relative z-10">
        {filteredNotices.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[600px] flex flex-col items-center justify-center gap-12 text-center"
          >
            <BookOpen className="text-heritage-gold/5" size={120} strokeWidth={0.3} />
            <div className="space-y-4">
              <p className="font-serif italic text-3xl text-heritage-gold/20">The parchment remains blank.</p>
              <p className="font-display text-[10px] text-heritage-gold/10 uppercase tracking-[0.5em]">No bulletins recorded in this sector</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
            <AnimatePresence>
              {filteredNotices.map((notice, i) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "relative",
                    i % 2 === 0 ? "md:translate-y-16" : "md:-translate-y-16"
                  )}
                >
                  <NoticeCard notice={notice} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}
