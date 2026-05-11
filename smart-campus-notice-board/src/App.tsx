/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NoticeBoard } from './components/NoticeBoard';
import { AdminPanel } from './components/AdminPanel';
import { ChatWidget } from './components/ChatWidget';
import { LogIn, Bell, LayoutDashboard, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './lib/utils';

function Header() {
  const { user, profile, login, logout, isLoggingIn } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <header className="flex h-24 items-center justify-between border-b-4 border-black px-8">
      <div className="flex items-baseline gap-4">
        <h1 className="text-5xl font-black uppercase leading-none tracking-tighter">
          Board.ai
        </h1>
        <span className="bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          AI-Powered v1.0
        </span>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden text-right md:block">
          <p className="text-xs font-black uppercase leading-tight tracking-widest">{today}</p>
          <p className="text-[10px] font-bold uppercase text-zinc-500">Campus Central Board</p>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black uppercase tracking-tight">{profile?.display_name}</p>
              <p className="text-[10px] font-bold uppercase text-zinc-400">{profile?.role} • {profile?.department}</p>
            </div>
            <button 
              onClick={logout}
              className="flex h-12 w-12 items-center justify-center overflow-hidden border-2 border-black bg-yellow-400 font-black italic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                profile?.display_name?.charAt(0).toUpperCase() || 'U'
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            disabled={isLoggingIn}
            className="border-2 border-black bg-white px-6 py-2 text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-50"
          >
            {isLoggingIn ? "Wait..." : "Login"}
          </button>
        )}
      </div>
    </header>
  );
}

function MainContent() {
  const { user, profile, loading, login, isLoggingIn, loginError } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-black" size={48} strokeWidth={3} />
        <p className="text-xs font-black uppercase tracking-[0.2em]">Synchronizing Board...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl border-4 border-black bg-white p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="mb-8 flex h-20 w-20 items-center justify-center border-4 border-black bg-yellow-400 text-black">
            <Bell size={48} strokeWidth={3} />
          </div>
          <h2 className="mb-4 text-5xl font-black uppercase tracking-tighter leading-none">
            Join the<br />Smart Board
          </h2>
          <p className="mb-10 font-bold text-zinc-500 uppercase text-sm tracking-tight">
            Centralized AI-powered feed for campus life. Summaries, urgency detection, and Q&A included.
          </p>
          
          {loginError && (
            <div className="mb-6 border-2 border-black bg-red-600 p-4 text-xs font-black uppercase tracking-widest text-white">
              Error: {loginError}
            </div>
          )}

          <button
            onClick={login}
            disabled={isLoggingIn}
            className="flex w-full items-center justify-center gap-3 border-4 border-black bg-black py-5 text-lg font-black uppercase text-white transition-all hover:bg-yellow-400 hover:text-black active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-75"
          >
            {isLoggingIn ? (
              <Loader2 className="animate-spin" size={24} strokeWidth={3} />
            ) : (
              <LogIn size={24} strokeWidth={3} />
            )}
            {isLoggingIn ? "Authenticating..." : "Authorize Access"}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar */}
      <nav className="hidden w-72 flex-col border-r-4 border-black bg-gray-50 p-8 md:flex">
        <div className="mb-10">
          <h2 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Navigation</h2>
          <ul className="space-y-6">
            <li><a href="#" className="flex items-center gap-3 text-3xl font-black uppercase tracking-tighter hover:text-yellow-600 transition-colors"><LayoutDashboard size={24} strokeWidth={3} /> Feed</a></li>
            <li><a href="#admin" className="text-3xl font-black uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all">Notices</a></li>
            <li><a href="#about" className="text-3xl font-black uppercase tracking-tighter opacity-30 hover:opacity-100 transition-all">Events</a></li>
          </ul>
        </div>
        
        <div className="mt-auto">
          <div className="rounded-xl border-2 border-dashed border-black p-4">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">System Core</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Supabase Active</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Feed Area */}
      <section className="flex flex-1 flex-col overflow-hidden">
        <div className="px-8 pt-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-8xl font-black uppercase leading-none tracking-tighter">
              Latest<br />Notices
            </h2>
            <div className="text-right">
              <p className="text-sm font-black uppercase tracking-widest">Live Updates Only</p>
              <div className="mt-2 flex justify-end gap-1">
                <div className="h-1 w-16 bg-black"></div>
                <div className="h-1 w-6 bg-zinc-300"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-12">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className={cn("space-y-10", profile?.role !== 'Student' ? "lg:col-span-7" : "lg:col-span-12")}>
              <NoticeBoard />
            </div>
            
            {profile?.role !== 'Student' && (
              <aside id="admin" className="space-y-8 lg:col-span-5">
                <AdminPanel />
                <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-black">Posting Rules</h3>
                  <ul className="space-y-2 text-xs font-bold uppercase text-zinc-500">
                    <li className="flex items-start gap-2"><span className="text-black">•</span> Categorize correctly</li>
                    <li className="flex items-start gap-2"><span className="text-black">•</span> Use clear subject lines</li>
                    <li className="flex items-start gap-2"><span className="text-black">•</span> Content length limit 2k chars</li>
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

function Footer() {
  const { profile } = useAuth();
  return (
    <footer className="flex items-center justify-between border-t-4 border-black bg-black px-8 py-4 text-white">
      <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
        <span>Admin Trace: {profile?.display_name || 'Guest'}</span>
        <span className="text-zinc-500">Backend: Supabase</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-2 w-32 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full w-4/5 bg-yellow-400"></div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">Personalization: 85%</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col border-[12px] border-black bg-white">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </AuthProvider>
  );
}
