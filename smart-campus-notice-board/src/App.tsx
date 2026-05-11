import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { NoticeBoard } from './components/NoticeBoard';
import { AdminPanel } from './components/AdminPanel';
import { ChatWidget } from './components/ChatWidget';
import { 
  LogIn, Search, User, LogOut, Code, Camera, Music, BookOpen, 
  Dumbbell, Heart, GraduationCap, ChevronRight, Sparkles, 
  Bell, HelpCircle, MessageSquare, Archive, Menu
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { cn } from './lib/utils';

// --- Components ---

function IvyVines() {
  return (
    <div className="absolute top-0 left-0 w-full h-32 pointer-events-none z-20 opacity-40 mix-blend-multiply overflow-hidden">
      <svg viewBox="0 0 1000 100" className="w-full h-full fill-heritage-green">
        <path d="M0,0 Q250,50 500,0 T1000,0 L1000,100 L0,100 Z" />
        {/* Simplified ivy leaf representation */}
        {[...Array(20)].map((_, i) => (
          <motion.path
            key={i}
            d="M0,0 Q10,10 0,20 Q-10,10 0,0"
            className="fill-heritage-green/60"
            initial={{ rotate: i * 20 }}
            style={{ x: i * 50 + 20, y: Math.sin(i) * 20 + 10 }}
          />
        ))}
      </svg>
    </div>
  );
}

function QuickAccessMenu() {
  const items = [
    { icon: Bell, label: "Notices" },
    { icon: Archive, label: "Archives" },
    { icon: MessageSquare, label: "Helpdesk" },
    { icon: HelpCircle, label: "Support" }
  ];

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6">
      {items.map((item, i) => (
        <motion.button
          key={item.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + i * 0.1 }}
          whileHover={{ scale: 1.2, x: -10 }}
          className="group relative w-12 h-12 rounded-full bg-heritage-wood/80 backdrop-blur-md border border-heritage-gold/20 flex items-center justify-center text-heritage-gold hover:border-heritage-gold transition-all shadow-2xl shadow-black/50"
        >
          <item.icon size={20} strokeWidth={1.5} />
          <span className="absolute right-full mr-4 px-3 py-1 bg-heritage-gold text-heritage-dark text-[10px] font-display uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {item.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

function FloatingPaper({ title, color, rotation, x, y, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: y + 50 }}
      animate={{ opacity: 1, y: y }}
      transition={{ delay, duration: 1 }}
      whileHover={{ y: y - 20, rotate: rotation + 5, scale: 1.05 }}
      style={{ left: x, rotate: rotation }}
      className={cn(
        "absolute w-40 h-52 p-4 shadow-2xl shadow-black/60 border-t-4 border-black/10 select-none cursor-pointer group",
        color
      )}
    >
      <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-800 shadow-inner z-10" />
      <div className="w-full h-full border border-black/5 flex flex-col justify-between font-hand">
        <p className="text-[12px] leading-tight text-black/70 italic">{title}</p>
        <div className="text-right">
          <span className="text-[10px] text-black/30 font-display">2026</span>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10" />
    </motion.div>
  );
}

function LandingPage() {
  const { login, isLoggingIn } = useAuth();
  
  return (
    <motion.div
      key="landing"
      exit={{ 
        opacity: 0, 
        scale: 1.1,
        filter: "blur(20px)",
        transition: { duration: 1, ease: "easeInOut" } 
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8 overflow-hidden wood-texture"
    >
      <div className="volumetric-light" />
      <div className="floating-dust absolute inset-0" />
      
      {/* The Massive Board */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full max-w-[1400px] h-[85vh] chalkboard rounded-sm p-12 flex flex-col items-center justify-center"
      >
        <IvyVines />
        
        {/* Central Chalk Typography */}
        <div className="relative z-10 text-center space-y-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="inline-flex items-center gap-4 px-6 py-2 border border-heritage-gold/20 bg-black/40 backdrop-blur-xl rounded-full"
           >
              <Sparkles size={14} className="text-heritage-gold animate-pulse" />
              <span className="text-[10px] font-display text-heritage-gold uppercase tracking-[0.6em]">The Digital Scriptorium</span>
           </motion.div>

           <h1 className="chalk-typography text-[8vw] sm:text-[6rem] leading-[1.1] select-none text-center">
             Notice everything,<br />
             <span className="italic opacity-60">Search nothing.</span>
           </h1>

           <motion.button
             onClick={login}
             disabled={isLoggingIn}
             whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(197, 160, 89, 0.3)" }}
             whileTap={{ scale: 0.95 }}
             className="mt-12 px-16 py-5 bg-heritage-gold text-heritage-dark font-display text-xs font-black uppercase tracking-[0.4em] rounded-sm transition-all shadow-xl shadow-black/40 disabled:opacity-50"
           >
             {isLoggingIn ? "Accessing Vault..." : "Authorize Access"}
           </motion.button>
        </div>

        {/* Scattered Notices */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingPaper title="HACKATHON 2026: The New Era" color="bg-heritage-paper" rotation={-12} x="10%" y="15%" delay={1} />
          <FloatingPaper title="Orientation: Grand Hall" color="bg-blue-100/90" rotation={8} x="82%" y="10%" delay={1.2} />
          <FloatingPaper title="Library: 24/7 Access Granted" color="bg-yellow-50/90" rotation={-5} x="5%" y="65%" delay={1.4} />
          <FloatingPaper title="Sports Tryouts: Field 1" color="bg-green-100/90" rotation={15} x="85%" y="60%" delay={1.6} />
        </div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
         <div className="w-px h-16 bg-gradient-to-b from-heritage-gold to-transparent" />
         <span className="text-[9px] font-display text-heritage-gold uppercase tracking-[0.8em]">Scroll into History</span>
      </div>
    </motion.div>
  );
}

function Navigation() {
  const { logout, profile } = useAuth();
  
  return (
    <header className="fixed top-0 left-0 w-full z-[80] px-12 py-8 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-6 pointer-events-auto">
         <div className="w-12 h-12 wood-texture border border-heritage-gold/30 rounded-sm flex items-center justify-center rotate-45 group hover:rotate-0 transition-transform duration-700">
            <GraduationCap className="-rotate-45 group-hover:rotate-0 transition-transform duration-700 text-heritage-gold" size={24} />
         </div>
         <div className="hidden sm:block">
            <h2 className="font-display text-lg gold-text tracking-widest leading-none">HERITAGE</h2>
            <p className="font-display text-[7px] text-heritage-gold/40 uppercase tracking-[0.5em] mt-1">Institutions of Excellence</p>
         </div>
      </div>

      <nav className="hidden lg:flex items-center gap-12 px-10 py-4 bg-black/40 backdrop-blur-2xl border border-heritage-gold/10 rounded-full pointer-events-auto">
        {['Notices', 'Events', 'Clubs', 'Campus'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-[10px] font-display uppercase tracking-[0.3em] opacity-50 hover:opacity-100 hover:text-heritage-gold transition-all">{item}</a>
        ))}
      </nav>

      <div className="flex items-center gap-6 pointer-events-auto">
        <button className="text-heritage-gold/30 hover:text-heritage-gold transition-colors"><Search size={20} /></button>
        {profile && (
          <div className="flex items-center gap-4 pl-6 border-l border-heritage-gold/10">
            <div className="text-right hidden sm:block">
               <p className="font-display text-[9px] text-heritage-gold uppercase tracking-widest leading-none">{profile.display_name}</p>
               <p className="text-[7px] text-heritage-gold/40 uppercase tracking-tighter mt-1">{profile.role}</p>
            </div>
            <button onClick={logout} className="w-10 h-10 rounded-full border border-heritage-gold/20 p-1 group hover:border-heritage-gold transition-all">
              <div className="w-full h-full rounded-full overflow-hidden bg-heritage-gold/10 flex items-center justify-center relative">
                {profile.role === 'SuperAdmin' ? <Sparkles size={16} className="text-heritage-gold" /> : <User size={16} className="text-heritage-gold" />}
                <div className="absolute inset-0 bg-heritage-gold opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
            </button>
            <button onClick={logout} title="Log Out" className="text-heritage-gold/30 hover:text-heritage-gold transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function MainDashboard() {
  const { profile } = useAuth();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-40 pb-20 px-12 space-y-24"
    >
      <Navigation />
      <QuickAccessMenu />
      
      <main className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-20">
        <div className={cn("space-y-12", !['Publisher', 'SuperAdmin'].includes(profile?.role || '') ? "lg:col-span-12" : "lg:col-span-8")}>
          <div className="relative chalkboard p-16 min-h-[800px] wood-frame">
            <div className="volumetric-light opacity-40" />
            <NoticeBoard />
          </div>
        </div>
        
        {['Publisher', 'SuperAdmin'].includes(profile?.role || '') && (
          <aside className="lg:col-span-4 space-y-12">
             <div className="sticky top-40">
                <AdminPanel />
                <div className="mt-8 p-8 border border-heritage-gold/10 bg-black/40 backdrop-blur-xl rounded-sm wood-frame">
                   <h3 className="font-display text-xs gold-text mb-6 uppercase tracking-widest">Protocol & Conduct</h3>
                   <ul className="space-y-4 font-serif italic text-sm text-heritage-gold/50">
                      <li>• All broadcasts are archived permanently.</li>
                      <li>• Maintain academic dignity in announcements.</li>
                      <li>• AI validation ensures content standard.</li>
                   </ul>
                </div>
             </div>
          </aside>
        )}
      </main>

      {/* Student Clubs Section */}
      <section className="max-w-7xl mx-auto space-y-16">
        <div className="flex items-center justify-between border-b border-heritage-gold/10 pb-8">
           <h3 className="font-display text-xl gold-text tracking-[0.4em] uppercase">Student Guilds</h3>
           <span className="text-[10px] text-heritage-gold/30 uppercase tracking-widest">Discover your heritage</span>
        </div>
        <div className="flex flex-wrap justify-center gap-16">
          {[
            { name: "Coding", icon: Code, color: "text-blue-400" },
            { name: "Photography", icon: Camera, color: "text-orange-400" },
            { name: "Music", icon: Music, color: "text-purple-400" },
            { name: "Literature", icon: BookOpen, color: "text-green-400" },
            { name: "Sports", icon: Dumbbell, color: "text-red-400" },
          ].map((club, i) => (
            <motion.div
              key={club.name}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center gap-6 group cursor-pointer"
            >
              <div className={cn(
                "w-20 h-20 rounded-full border border-heritage-gold/10 flex items-center justify-center transition-all duration-500 bg-black/40 group-hover:border-heritage-gold/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:shadow-heritage-gold/10",
                club.color
              )}>
                <club.icon size={32} strokeWidth={1} />
              </div>
              <span className="text-[10px] font-bold text-heritage-gold/30 uppercase tracking-[0.3em] group-hover:text-heritage-gold transition-colors">{club.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <ChatWidget />
      
      <footer className="max-w-7xl mx-auto pt-20 border-t border-heritage-gold/5 text-center">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-30">
          <div className="flex items-center gap-3">
             <GraduationCap size={18} />
             <span className="font-display text-[9px] uppercase tracking-widest">© 2026 Heritage Institutions</span>
          </div>
          <div className="flex gap-12">
             <a href="#" className="text-[9px] font-display uppercase tracking-widest hover:text-heritage-gold transition-colors">Digital Archive</a>
             <a href="#" className="text-[9px] font-display uppercase tracking-widest hover:text-heritage-gold transition-colors">Privacy Charter</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-heritage-dark overflow-hidden">
        <div className="relative">
           <motion.div 
             animate={{ rotate: 360 }} 
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="w-16 h-16 border-t-2 border-heritage-gold rounded-full" 
           />
           <div className="absolute inset-0 flex items-center justify-center">
             <GraduationCap className="text-heritage-gold/40" size={24} />
           </div>
        </div>
        <p className="font-display text-[10px] text-heritage-gold/40 tracking-[0.8em] uppercase animate-pulse">Checking Clearance</p>
      </div>
    );
  }

  return (
    <div className="bg-heritage-dark min-h-screen text-white selection:bg-heritage-gold selection:text-black">
      <AnimatePresence mode="wait">
        {!user ? (
          <LandingPage key="landing" />
        ) : (
          <MainDashboard key="dashboard" />
        )}
      </AnimatePresence>
    </div>
  );
}
