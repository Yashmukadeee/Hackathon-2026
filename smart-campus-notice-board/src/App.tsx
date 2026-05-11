import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NoticeBoard } from './components/NoticeBoard';
import { AdminPanel } from './components/AdminPanel';
import { ChatWidget } from './components/ChatWidget';
import { LogIn, Bell, LayoutDashboard, Loader2, Search, User, LogOut, Code, Camera, Music, BookOpen, Dumbbell, Heart, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './lib/utils';

function Header() {
  const { user, profile, login, logout, isLoggingIn } = useAuth();

  return (
    <header className="bg-heritage-dark border-b border-heritage-gold/20 px-8 py-4 sticky top-0 z-50 backdrop-blur-md bg-heritage-dark/90">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 border-2 border-heritage-gold flex items-center justify-center rotate-45 group hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <GraduationCap className="-rotate-45 group-hover:rotate-0 transition-transform duration-500 text-heritage-gold" size={24} />
           </div>
           <div>
              <h1 className="font-display text-2xl gold-text leading-none">HERITAGE</h1>
              <p className="font-display text-[10px] tracking-[0.4em] text-heritage-gold/50 uppercase">College</p>
           </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
           <a href="#" className="nav-link text-heritage-gold">Home</a>
           <a href="#board" className="nav-link">Notices</a>
           <a href="#events" className="nav-link">Events</a>
           <a href="#clubs" className="nav-link">Clubs</a>
           <a href="#academics" className="nav-link">Academics</a>
        </nav>

        <div className="flex items-center gap-6">
           <button className="text-heritage-gold/50 hover:text-heritage-gold transition-colors">
              <Search size={20} />
           </button>
           
           {user ? (
             <div className="flex items-center gap-4 pl-6 border-l border-heritage-gold/20">
                <div className="text-right">
                   <p className="font-display text-[10px] text-heritage-gold uppercase tracking-widest">{profile?.display_name}</p>
                   <p className="text-[8px] text-heritage-gold/40 uppercase tracking-tighter">{profile?.role}</p>
                </div>
                <button 
                  onClick={logout}
                  className="w-10 h-10 rounded-full border border-heritage-gold/30 p-0.5 hover:border-heritage-gold transition-colors"
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-heritage-gold/10 flex items-center justify-center">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-heritage-gold" />
                    )}
                  </div>
                </button>
             </div>
           ) : (
             <button
               onClick={login}
               disabled={isLoggingIn}
               className="font-display text-xs tracking-widest uppercase px-6 py-2 border border-heritage-gold text-heritage-gold hover:bg-heritage-gold hover:text-black transition-all duration-300 rounded-full"
             >
               {isLoggingIn ? "Wait..." : "Login"}
             </button>
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
    <div id="clubs" className="bg-heritage-dark/50 border-t border-heritage-gold/10 py-12 px-8 mt-24">
      <div className="max-w-7xl mx-auto">
         <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-lg gold-text tracking-widest">STUDENT CLUBS</h3>
            <button className="text-[10px] font-bold text-heritage-gold/50 uppercase hover:text-heritage-gold">View All</button>
         </div>
         
         <div className="flex flex-wrap justify-center gap-12">
            {clubs.map((club, i) => (
              <motion.div 
                key={club.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className={cn(
                  "w-16 h-16 rounded-full border-2 border-heritage-gold/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-heritage-gold shadow-lg group-hover:shadow-heritage-gold/20",
                  club.color
                )}>
                  <club.icon size={24} />
                </div>
                <span className="text-[10px] font-bold text-heritage-gold/40 uppercase tracking-tighter group-hover:text-heritage-gold">{club.name}</span>
              </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}

function MainContent() {
  const { user, loading, login, isLoggingIn, loginError, profile } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <div className="relative">
           <Loader2 className="animate-spin text-heritage-gold" size={64} strokeWidth={1} />
           <GraduationCap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-heritage-gold/30" size={24} />
        </div>
        <p className="font-display text-[10px] text-heritage-gold tracking-[0.5em] uppercase">Opening the Archives</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-heritage-dark relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <img src="https://www.transparenttextures.com/patterns/black-linen.png" alt="" className="w-full h-full object-repeat" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full text-center relative z-10"
        >
          <div className="inline-block w-24 h-24 border-2 border-heritage-gold rounded-full flex items-center justify-center mb-12 mx-auto rotate-12">
            <Bell size={48} className="text-heritage-gold" strokeWidth={1} />
          </div>
          
          <h2 className="font-display text-6xl gold-text mb-6 leading-none tracking-tighter">
            JOIN THE<br />HERITAGE BOARD
          </h2>
          
          <p className="font-serif italic text-heritage-gold/60 text-lg mb-12">
            "The beautiful thing about learning is that no one can take it away from you."
          </p>
          
          {loginError && (
            <div className="mb-8 border border-red-900 bg-red-900/10 p-4 text-xs font-bold uppercase tracking-widest text-red-400">
              {loginError}
            </div>
          )}

          <button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full py-5 rounded-full border-2 border-heritage-gold text-heritage-gold font-display text-sm tracking-[0.3em] uppercase hover:bg-heritage-gold hover:text-black transition-all duration-500 disabled:opacity-50"
          >
            {isLoggingIn ? "Consulting Registry..." : "Authorize Access"}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
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
  );
}

function Footer() {
  return (
    <footer className="bg-heritage-dark border-t border-heritage-gold/10 py-12 px-8 text-center">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
           <GraduationCap className="text-heritage-gold/40" size={20} />
           <span className="font-display text-[10px] text-heritage-gold/40 tracking-[0.4em] uppercase">© 2026 Heritage College</span>
        </div>
        
        <div className="flex gap-10">
           <a href="#" className="text-[10px] font-bold text-heritage-gold/30 hover:text-heritage-gold uppercase tracking-widest">Privacy Policy</a>
           <a href="#" className="text-[10px] font-bold text-heritage-gold/30 hover:text-heritage-gold uppercase tracking-widest">Terms & Conditions</a>
        </div>

        <div className="text-[10px] font-bold text-heritage-gold/30 uppercase tracking-[0.2em]">
           Backend: Supabase • AI: Gemini 2.0
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col selection:bg-heritage-gold selection:text-black">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </AuthProvider>
  );
}
