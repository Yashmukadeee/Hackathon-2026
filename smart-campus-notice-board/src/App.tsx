import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import { NoticeBoard } from './components/NoticeBoard';
import { AdminPanel } from './components/AdminPanel';
import { ArchivePage } from './components/ArchivePage';
import { supabase } from './lib/supabase';
import {
  Search, User, LogOut, GraduationCap, Sparkles,
  Bell, HelpCircle, Archive, Loader2,
  Bookmark, Shield, History, X, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// ─────────────────────────────────────────────────────────────
// Seed data — inserted on every login automatically
// ─────────────────────────────────────────────────────────────
const DEMO_NOTICES = (userId: string, displayName: string) => [
  {
    title: "BREAKTHROUGH: The End of Gravity",
    content: "Heritage Institute's Advanced Physics Lab has achieved a stable Gravitational Flux Displacement. By utilizing rotating superconductors to trigger the Podkletnov Effect, we have successfully warped the local space-time metric. Floating Lecture Halls are scheduled for installation in the North Quad by next semester.",
    summary: "Antigravity Propulsion achieved via Gravitational Flux Displacement.",
    category: "Academic", urgency: "Critical",
    author_id: userId, author_name: "Dr. Alistair Heritage", department: "Advanced Physics Lab",
    links: [{ label: "Technical Summary", url: "#" }, { label: "Lab Registration", url: "#" }]
  },
  {
    title: "Heritage Music Gala — Registration Open",
    content: "Join us for an evening of neoclassical fusion at the Grand Hall. The Scriptorium Quartet and three guest virtuosos will perform. Seats are limited to 200. Register now and choose your dietary preference.",
    summary: "Annual Heritage Music Gala — register before seats run out.",
    category: "Event", urgency: "Important",
    author_id: userId, author_name: "Arts & Culture Dept",
    links: [{ label: "Reserve Seat", url: "#" }, { label: "Gala Programme", url: "#" }]
  },
  {
    title: "POLL: Preferred Hackathon Tech Stack",
    content: "We are conducting a live consensus on the preferred technologies for this year's hackathon builds. Cast your vote to influence the mentor pool distribution.",
    summary: "Vote for the preferred hackathon tech stack.",
    category: "Event", urgency: "Normal",
    author_id: userId, author_name: displayName,
    poll: {
      question: "Which primary stack are you using?",
      options: [
        { id: '1', text: 'React + Supabase', votes: 120 },
        { id: '2', text: 'Next.js + Prisma', votes: 85 },
        { id: '3', text: 'SvelteKit + Go', votes: 42 }
      ]
    }
  },
  {
    title: "Advanced Robotics: Induction Resources",
    content: "New lab protocols for the Robotics Wing have been published. All Tier-2 researchers must review the safety documentation regarding Autonomous Agent safety boundaries before their next session.",
    summary: "Updated safety protocols for Robotics Lab researchers.",
    category: "Academic", urgency: "Important",
    author_id: userId, author_name: "Robotics Faculty", department: "Engineering",
    links: [{ label: "Safety Docs", url: "#" }, { label: "Schedule Induction", url: "#" }]
  },
  {
    title: "SURVEY: Exam Season Canteen Hours",
    content: "The Student Council is gauging interest in 24/7 canteen access during finals. This proposal requires a 75% consensus to move to the Faculty Board.",
    summary: "Vote on the 24/7 canteen access proposal.",
    category: "Administrative", urgency: "Info",
    author_id: userId, author_name: "Student Council",
    is_survey: true,
    poll: {
      question: "Approve 24/7 Canteen Access?",
      options: [
        { id: '1', text: 'Approve', votes: 450 },
        { id: '2', text: 'Deny', votes: 21 }
      ]
    }
  },
  {
    title: "Digital Scriptorium Library Updated",
    content: "The digital archives have been updated with 240 new entries covering Quantum Cryptography, Agentic AI Architectures, and Heritage Preservation Law. Faculty must review the new archival standards.",
    summary: "240 new academic resources added to the digital library.",
    category: "Academic", urgency: "Normal",
    author_id: userId, author_name: "Library Council",
    links: [{ label: "Browse Library", url: "#" }, { label: "Faculty Portal", url: "#" }]
  },
  {
    title: "POLL: Best Campus Study Spot?",
    content: "Help us understand where students concentrate best. The top two locations will receive premium furniture upgrades and 24/7 keycard access from next semester.",
    summary: "Vote for your favourite campus study location.",
    category: "General", urgency: "Info",
    author_id: userId, author_name: "Campus Welfare",
    poll: {
      question: "Where do you study best?",
      options: [
        { id: '1', text: 'The Scriptorium (Library)', votes: 310 },
        { id: '2', text: 'North Quad Courtyard', votes: 190 },
        { id: '3', text: 'Lab 4B After Hours', votes: 87 },
        { id: '4', text: 'Canteen Corner', votes: 55 }
      ]
    }
  },
  {
    title: "TEDx Heritage 2026 — Speaker Applications",
    content: "We are accepting speaker applications for TEDx Heritage 2026 under the theme 'The Archaeology of Tomorrow'. Applications close June 1st. All disciplines welcome.",
    summary: "Apply to speak at TEDx Heritage 2026 — closing June 1st.",
    category: "Event", urgency: "Important",
    author_id: userId, author_name: "TEDx Committee",
    links: [{ label: "Apply Now", url: "#" }, { label: "Speaker Guide", url: "#" }]
  },
  {
    title: "SURVEY: Curriculum Feedback 2025–26",
    content: "The Academic Senate is collecting structured feedback on course content, teaching methods, and assessment formats for the 2025–26 academic year. All responses are anonymous.",
    summary: "Anonymous curriculum feedback survey — takes 5 minutes.",
    category: "Academic", urgency: "Normal",
    author_id: userId, author_name: "Academic Senate",
    is_survey: true,
    poll: {
      question: "Overall satisfaction with 2025–26 curriculum?",
      options: [
        { id: '1', text: 'Excellent', votes: 98 },
        { id: '2', text: 'Good', votes: 210 },
        { id: '3', text: 'Needs Improvement', votes: 67 },
        { id: '4', text: 'Poor', votes: 14 }
      ]
    }
  },
  {
    title: "URGENT: Heritage Portal Maintenance",
    content: "The Heritage Student Portal will be offline from 2:00 AM to 6:00 AM on Saturday for critical infrastructure upgrades. Please submit all pending assignments before midnight Friday.",
    summary: "Portal offline Sat 2–6 AM. Submit assignments before midnight Friday.",
    category: "Administrative", urgency: "Critical",
    author_id: userId, author_name: "IT Infrastructure Team",
    links: [{ label: "Status Page", url: "#" }]
  },
];

// ─────────────────────────────────────────────────────────────
// Auto-seed hook — runs once on login if board is empty
// ─────────────────────────────────────────────────────────────
function useAutoSeed() {
  const { user, profile } = useAuth();
  useEffect(() => {
    if (!user || !profile) return;
    const seed = async () => {
      try {
        const { count, error: countError } = await supabase
          .from('notices')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;

        if ((count ?? 0) === 0) {
          const { error: insertError } = await supabase
            .from('notices')
            .insert(DEMO_NOTICES(user.id, profile.display_name));
            
          if (insertError) throw insertError;
          console.log('Heritage Archives seeded.');
        }
      } catch (error) {
        console.error('Failed to auto-seed notices. Please ensure add-interactive-columns.sql has been run in Supabase:', error);
      }
    };
    seed();
  }, [user, profile]);
}

// ─────────────────────────────────────────────────────────────
// Overlays
// ─────────────────────────────────────────────────────────────
function CinematicOverlays() {
  return (
    <>
      <div className="film-grain" />
      <div className="vignette" />
      <div className="floating-dust" />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Quick-access sidebar icons
// ─────────────────────────────────────────────────────────────
function QuickAccessMenu({ onAction }: { onAction: (action: string) => void }) {
  const items = [
    { icon: Bell,         label: "Bulletins",        action: "scroll-notices" },
    { icon: Archive,      label: "Scriptorium",       action: "scroll-archives" },
    { icon: History,      label: "Timeline",          action: "open-timeline" },
    { icon: HelpCircle,   label: "Heritage Support",  action: "open-support" },
  ];
  return (
    <div className="fixed right-10 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-6">
      {items.map((item, i) => (
        <motion.button
          key={item.label}
          onClick={() => onAction(item.action)}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.15, x: -10 }}
          className="group relative w-12 h-12 rounded-full glass-panel flex items-center justify-center text-heritage-gold/60 hover:text-heritage-gold transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute inset-0 rounded-full bg-heritage-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <item.icon size={18} strokeWidth={1} />
          <span className="absolute right-full mr-6 px-4 py-1.5 bg-heritage-gold text-heritage-dark text-[9px] font-display font-black uppercase tracking-[0.3em] rounded-sm opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-2xl">
            {item.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Landing Page
// ─────────────────────────────────────────────────────────────
function LandingPage() {
  const { login, isLoggingIn } = useAuth();
  return (
    <motion.div
      key="landing"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(40px)" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8 overflow-hidden bg-heritage-dark"
    >
      <CinematicOverlays />
      <div className="volumetric-light" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[1500px] h-[90vh] chalkboard rounded-sm p-12 flex flex-col items-center justify-center"
      >
        <div className="absolute inset-2 border border-white/5 pointer-events-none" />
        <div className="relative z-10 text-center space-y-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <span className="text-[12px] sm:text-[14px] font-serif uppercase tracking-[1em] text-white/50 ml-[1em]">
              The
            </span>
            <h1 className="text-[10vw] sm:text-[6rem] md:text-[8rem] font-serif uppercase leading-none text-white tracking-[0.1em] px-4 drop-shadow-2xl font-normal">
              HERITAGE BOARD
            </h1>
          </div>

          <p className="max-w-xl mx-auto font-serif text-sm sm:text-lg italic text-white/40 leading-relaxed tracking-wider">
            "Where the weight of tradition meets the speed of light."
          </p>

          <motion.button
            onClick={login}
            disabled={isLoggingIn}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
            whileTap={{ scale: 0.98 }}
            className="mt-12 px-16 py-5 bg-transparent border border-white text-white font-serif text-[12px] font-normal uppercase tracking-[0.4em] transition-all duration-500 overflow-hidden"
          >
            {isLoggingIn ? "DECRYPTING..." : "ENTER THE SCRIPTORIUM"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Navigation & Branding
// ─────────────────────────────────────────────────────────────
function Navigation({ onAction }: { onAction: (action: string) => void }) {
  const { logout, profile } = useAuth();
  return (
    <>
      {/* Main Navigation Pill - Centered */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 w-full max-w-4xl z-[150] px-8 pointer-events-none">
        <div className="glass-panel rounded-full px-8 py-4 flex items-center justify-between pointer-events-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10">
          <div className="flex items-center gap-4 group">
            <h2 className="hidden sm:block font-display text-sm font-black gold-text tracking-widest uppercase ml-2">Heritage</h2>
          </div>

        <nav className="hidden lg:flex items-center gap-10">
          {['Notices', 'Events', 'Guilds', 'Campus'].map(item => (
            <button 
              key={item} 
              onClick={() => {
                if (item === 'Notices') onAction('scroll-notices');
                else onAction(`open-${item.toLowerCase()}`);
              }}
              className="text-[9px] font-display font-black uppercase tracking-[0.3em] text-white/30 hover:text-heritage-gold transition-all"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => onAction('open-search')}
            className="text-white/20 hover:text-heritage-gold transition-colors"
          >
            <Search size={18} />
          </button>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
            <div className="w-8 h-8 rounded-full border border-heritage-gold/20 p-0.5 overflow-hidden">
              <div className="w-full h-full rounded-full bg-heritage-gold/10 flex items-center justify-center">
                <User size={14} className="text-heritage-gold" />
              </div>
            </div>
            <button 
              onClick={logout} 
              className="text-[9px] font-display font-black uppercase tracking-[0.2em] text-white/30 hover:text-red-400 transition-colors flex items-center gap-2"
            >
              LOGOUT <LogOut size={12} />
            </button>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Video Bulletin
// ─────────────────────────────────────────────────────────────
function VideoBulletin() {
  const [videoUrl, setVideoUrl] = useState(() => localStorage.getItem('heritage_video_url') || '/video-bulletin.mp4');

  useEffect(() => {
    const handleUpdate = () => {
      setVideoUrl(localStorage.getItem('heritage_video_url') || '/video-bulletin.mp4');
    };
    window.addEventListener('videoUpdate', handleUpdate);
    return () => window.removeEventListener('videoUpdate', handleUpdate);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="glass-panel rounded-sm border border-white/10 p-12 space-y-8 mt-16"
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
          <h3 className="font-display text-[11px] font-black uppercase tracking-[0.5em] text-heritage-gold">Live Campus Broadcast</h3>
        </div>
        <span className="font-serif italic text-white/30 text-sm">Signal Active</span>
      </div>
      
      <div className="relative aspect-video rounded-sm overflow-hidden bg-black/80 border border-white/5 group shadow-2xl">
        <video 
          key={videoUrl}
          className="w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
          controls
          src={videoUrl}
          poster="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1600"
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Placeholder overlay to look good even before they upload the video */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-500">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-black/50 backdrop-blur-md">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white/50 border-b-[8px] border-b-transparent ml-1" />
            </div>
            <p className="font-display text-[9px] font-black uppercase tracking-[0.4em] text-white/40 bg-black/60 px-6 py-2 rounded-full backdrop-blur-md">
              Awaiting Video File ({videoUrl})
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────
function MainDashboard() {
  const { profile } = useAuth();
  const [showArchives, setShowArchives] = useState(false);
  const [modalContent, setModalContent] = useState<{title: string, subtitle: string, message: string} | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Auto-seed fires on login if board is empty
  useAutoSeed();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        boardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        boardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAction = (action: string) => {
    if (action === "scroll-archives") setShowArchives(true);
    else if (action === "scroll-notices") window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (action === "open-timeline") setModalContent({
      title: "Heritage Timeline",
      subtitle: "Archival Compilation",
      message: "The chronological timeline of the institute is currently being digitized by the head archivists. Check back tomorrow."
    });
    else if (action === "open-support") setModalContent({
      title: "Heritage Support",
      subtitle: "Emergency Channel",
      message: "Direct line to administration established.\n\nSupport Email: ymukade3@gmail.com\n\nDispatching campus security to your exact coordinates. Stand by."
    });
    else if (action === "open-search") setModalContent({
      title: "Archive Query",
      subtitle: "Clearance Required",
      message: "Your current clearance level does not permit unrestricted queries into the global archives. Please authenticate your credentials via the main terminal."
    });
    else if (action.startsWith("open-")) {
      const item = action.split("-")[1];
      const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1);
      setModalContent({ 
        title: `${capitalizedItem} Directory`, 
        subtitle: "Area Restricted", 
        message: `The ${capitalizedItem} sector is currently undergoing architectural synthesis by the Academic Senate.\n\nFull access will be granted in the next iteration of the Heritage protocol.` 
      });
    }
  };

  const ADMIN_EMAIL = "ymukade3@gmail.com"; // Admin restricted email
  const isAdmin = profile?.email === ADMIN_EMAIL;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-48 pb-32 px-12 bg-heritage-dark"
    >
      <CinematicOverlays />
      <Navigation onAction={handleAction} />
      <QuickAccessMenu onAction={handleAction} />

      <main className="max-w-[1200px] mx-auto relative z-10 block">
        {isAdmin && (
          <div className="w-full relative z-20">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-heritage-gold" size={18} />
              <h3 className="font-display text-sm font-black gold-text uppercase tracking-[0.4em]">Chief Archivist Protocol</h3>
            </div>
            <AdminPanel />
          </div>
        )}

        <div className="space-y-12">
          <div ref={boardRef} className="group relative chalkboard p-20 min-h-[900px] rounded-sm overflow-hidden mt-8">
            <div className="card-spotlight pointer-events-none" />
            <NoticeBoard />
          </div>
          
          {/* New Video Bulletin Section */}
          <VideoBulletin />
        </div>
      </main>

      <AnimatePresence>
        {showArchives && <ArchivePage onBack={() => setShowArchives(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {modalContent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-heritage-dark/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-panel p-10 max-w-lg w-full rounded-sm border border-heritage-gold/20 relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
            >
              <button 
                onClick={() => setModalContent(null)}
                className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full border border-heritage-gold/20 flex items-center justify-center bg-heritage-gold/5 text-heritage-gold">
                  <Shield size={28} strokeWidth={1.5} />
                </div>
                
                <div>
                  <h2 className="font-serif italic text-3xl gold-text mb-2">{modalContent.title}</h2>
                  <p className="font-display text-[10px] uppercase tracking-[0.4em] text-white/40">{modalContent.subtitle}</p>
                </div>
                
                <p className="font-serif text-lg text-heritage-paper/60 leading-relaxed whitespace-pre-wrap">
                  {modalContent.message}
                </p>
                
                <button 
                  onClick={() => setModalContent(null)}
                  className="mt-4 px-8 py-3 bg-heritage-gold/10 text-heritage-gold border border-heritage-gold/20 rounded-sm font-display text-[10px] uppercase tracking-widest hover:bg-heritage-gold hover:text-heritage-dark transition-all"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────
export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-heritage-dark overflow-hidden">
        <CinematicOverlays />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center border border-heritage-gold/20">
            <GraduationCap className="text-heritage-gold animate-pulse" size={32} />
          </div>
          <p className="font-display text-[11px] text-heritage-gold font-black tracking-[1em] uppercase animate-pulse">
            Authenticating Heritage
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-heritage-dark min-h-screen text-white selection:bg-heritage-gold selection:text-black scroll-smooth">
      <AnimatePresence mode="wait">
        {!user ? <LandingPage key="landing" /> : <MainDashboard key="dashboard" />}
      </AnimatePresence>
    </div>
  );
}
