import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NoticeBoard } from './components/NoticeBoard';
import { AdminPanel } from './components/AdminPanel';
import { ChatWidget } from './components/ChatWidget';
import { LogIn, Bell, LayoutDashboard, Loader2, Search, User, LogOut, Code, Camera, Music, BookOpen, Dumbbell, Heart, GraduationCap, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

function Header() {
  const { user, profile, login, logout, isLoggingIn } = useAuth();

  return (
    <header className="bg-heritage-dark border-b border-heritage-gold/10 px-8 py-4 sticky top-0 z-50 backdrop-blur-md bg-heritage-dark/90">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 border border-heritage-gold/30 flex items-center justify-center rotate-45 group hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <GraduationCap className="-rotate-45 group-hover:rotate-0 transition-transform duration-500 text-heritage-gold" size={20} />
           </div>
           <div>
              <h1 className="font-display text-xl gold-text leading-none tracking-tighter">HERITAGE</h1>
              <p className="font-display text-[8px] tracking-[0.4em] text-heritage-gold/30 uppercase">College</p>
           </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
           <a href="#" className="nav-link text-heritage-gold">Home</a>
           <a href="#board" className="nav-link">Notices</a>
           <a href="#events" className="nav-link">Events</a>
           <a href="#clubs" className="nav-link">Clubs</a>
        </nav>

        <div className="flex items-center gap-6">
           <button className="text-heritage-gold/30 hover:text-heritage-gold transition-colors">
              <Search size={18} />
           </button>
           
           {user && (
             <div className="flex items-center gap-4 pl-6 border-l border-heritage-gold/10">
                <div className="text-right hidden sm:block">
                   <p className="font-display text-[9px] text-heritage-gold uppercase tracking-widest">{profile?.display_name}</p>
                   <p className="text-[7px] text-heritage-gold/40 uppercase tracking-tighter">{profile?.role}</p>
                </div>
                <button 
                  onClick={logout}
                  className="w-8 h-8 rounded-full border border-heritage-gold/20 p-0.5 hover:border-heritage-gold transition-colors"
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-heritage-gold/10 flex items-center justify-center">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={14} className="text-heritage-gold" />
                    )}
                  </div>
                </button>
             </div>
           )}
        </div>
      </div>
    </header>
  );
}

function ClubBar() {
  const clubs = [
    { name: "Coding Club", icon: Code, color: "bg-blue-500/20 text-blue-400" },
    { name: "Photography Club", icon: Camera, color: "bg-orange-500/20 text-orange-400" },
    { name: "Drama Club", icon: Heart, color: "bg-red-500/20 text-red-400" },
    { name: "Literary Club", icon: BookOpen, color: "bg-green-500/20 text-green-400" },
    { name: "Music Club", icon: Music, color: "bg-purple-500/20 text-purple-400" },
    { name: "Sports Club", icon: Dumbbell, color: "bg-teal-500/20 text-teal-400" },
    { name: "Social Service", icon: Heart, color: "bg-pink-500/20 text-pink-400" },
  ];

  return (
    <div id="clubs" className="bg-heritage-dark/50 border-t border-heritage-gold/5 py-12 px-8 mt-24">
      <div className="max-w-7xl mx-auto">
         <div className="flex items-center justify-between mb-12">
            <h3 className="font-display text-sm gold-text tracking-[0.3em] uppercase">STUDENT CLUBS</h3>
            <button className="text-[10px] font-bold text-heritage-gold/30 uppercase hover:text-heritage-gold transition-colors">View All Archive</button>
         </div>
         
         <div className="flex flex-wrap justify-center gap-10">
            {clubs.map((club, i) => (
              <motion.div 
                key={club.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-4 group cursor-pointer"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full border border-heritage-gold/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-heritage-gold/50 shadow-xl group-hover:shadow-heritage-gold/10",
                  club.color
                )}>
                  <club.icon size={20} />
                </div>
                <span className="text-[9px] font-bold text-heritage-gold/30 uppercase tracking-widest group-hover:text-heritage-gold transition-colors">{club.name}</span>
              </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}

function LandingPage() {
  const { login, isLoggingIn, loginError } = useAuth();

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.5,
        filter: "blur(20px)",
        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } 
      }}
      className="fixed inset-0 z-[100] bg-heritage-dark flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-heritage-gold/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-heritage-gold/10 rounded-full blur-[120px]" />
         <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="text-center relative z-10 max-w-4xl"
      >
        <div className="mb-12 inline-flex items-center gap-3 px-4 py-1.5 border border-heritage-gold/20 rounded-full bg-heritage-gold/5">
           <Sparkles size={12} className="text-heritage-gold" />
           <span className="text-[10px] font-display text-heritage-gold uppercase tracking-[0.4em]">Campus Archives v1.0</span>
        </div>

        <h1 className="font-display text-[12vw] sm:text-9xl gold-text leading-none mb-8 select-none tracking-tighter">
          NOTICE<br />BOARD
        </h1>

        <p className="font-serif italic text-heritage-gold/40 text-xl md:text-2xl mb-16 max-w-2xl mx-auto leading-relaxed">
          The heritage of learning, preserved and broadcasted for the students of today.
        </p>

        <div className="flex flex-col items-center gap-6">
           <button
             onClick={login}
             disabled={isLoggingIn}
             className="group relative inline-flex items-center gap-4 px-12 py-5 bg-heritage-gold text-black rounded-full font-display text-sm font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
           >
             <span className="relative z-10">{isLoggingIn ? "ARCHIVING..." : "AUTHORIZE ACCESS"}</span>
             <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
           </button>

           {loginError && (
             <motion.p 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="text-red-400 font-display text-[10px] uppercase tracking-widest"
             >
               Access Denied: {loginError}
             </motion.p>
           )}
        </div>
      </motion.div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
         <div className="w-px h-12 bg-gradient-to-b from-heritage-gold to-transparent" />
         <span className="text-[8px] font-display text-heritage-gold uppercase tracking-[0.5em]">Scroll to Discover</span>
      </div>
    </motion.div>
  );
}

function MainDashboard() {
  const { profile } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="flex min-h-screen flex-col"
    >
      <Header />
      <div className="flex-1 flex flex-col pt-12">
        <main id="board" className="max-w-7xl mx-auto w-full px-8">
           <div className="grid lg:grid-cols-12 gap-16">
              <div className={cn("space-y-12", profile?.role === 'Student' ? "lg:col-span-12" : "lg:col-span-8")}>
                 <NoticeBoard />
              </div>
              
              {profile?.role !== 'Student' && (
                <aside className="lg:col-span-4 space-y-12">
                   <div className="sticky top-32">
                      <AdminPanel />
                      <div className="mt-8 p-6 border border-heritage-gold/10 bg-white/5 rounded-sm">
                         <h3 className="font-display text-xs gold-text mb-4 uppercase tracking-widest">Protocol</h3>
                         <ul className="space-y-3 font-serif italic text-sm text-heritage-gold/50">
                            <li>• Ensure announcements are dignified</li>
                            <li>• Use academic language</li>
                            <li>• AI will assist in summarizing</li>
                         </ul>
                      </div>
                   </div>
                </aside>
              )}
           </div>
        </main>
        <ClubBar />
        <ChatWidget />
      </div>
      <footer className="bg-heritage-dark border-t border-heritage-gold/5 py-12 px-8 text-center mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
             <GraduationCap className="text-heritage-gold/20" size={20} />
             <span className="font-display text-[9px] text-heritage-gold/20 tracking-[0.4em] uppercase">© 2026 Heritage College</span>
          </div>
          <div className="flex gap-10">
             <a href="#" className="text-[9px] font-bold text-heritage-gold/20 hover:text-heritage-gold transition-colors uppercase tracking-widest">Privacy</a>
             <a href="#" className="text-[9px] font-bold text-heritage-gold/20 hover:text-heritage-gold transition-colors uppercase tracking-widest">Terms</a>
          </div>
          <div className="text-[9px] font-bold text-heritage-gold/20 uppercase tracking-[0.2em]">
             Heritage.AI Archive
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
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-heritage-dark">
        <div className="relative">
           <Loader2 className="animate-spin text-heritage-gold" size={48} strokeWidth={1} />
        </div>
        <p className="font-display text-[9px] text-heritage-gold tracking-[0.5em] uppercase">Checking Permissions</p>
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
