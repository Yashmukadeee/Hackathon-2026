import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { CampusUser, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: CampusUser | null;
  loading: boolean;
  isLoggingIn: boolean;
  loginError: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CampusUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Fetch or create user profile
  async function fetchOrCreateProfile(authUser: User) {
    try {
      // Try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (existingProfile) {
        setProfile(existingProfile as CampusUser);
        return;
      }

      // Create new profile if it doesn't exist
      const newProfile: Omit<CampusUser, 'id'> & { id: string } = {
        id: authUser.id,
        email: authUser.email || '',
        display_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Campus User',
        role: 'Student' as UserRole,
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('users')
        .insert(newProfile)
        .select()
        .single();

      if (createError) {
        // Profile might have been created by a trigger, try fetching again
        const { data: retryProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (retryProfile) {
          setProfile(retryProfile as CampusUser);
        } else {
          console.error('Failed to create or fetch profile:', createError);
        }
      } else if (createdProfile) {
        setProfile(createdProfile as CampusUser);
      }
    } catch (error) {
      console.error('Profile fetch/create error:', error);
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchOrCreateProfile(session.user).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchOrCreateProfile(session.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        setLoginError(error.message);
      }
    } catch (error: any) {
      setLoginError(error.message || 'An unexpected error occurred.');
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setLoginError(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, isLoggingIn, loginError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
