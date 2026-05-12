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
    console.log("Auth: Fetching profile for", authUser.id);
    try {
      // 1. Try to fetch existing profile (Safer than .single())
      const { data: profiles, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id);

      if (fetchError) {
        console.error("Auth: Profile fetch error", fetchError);
      }

      if (profiles && profiles.length > 0) {
        console.log("Auth: Existing profile found", profiles[0]);
        setProfile(profiles[0] as CampusUser);
        return;
      }

      console.log("Auth: No profile found in DB, creating one...");
      // 2. Create new profile if it doesn't exist
      const newProfile = {
        id: authUser.id,
        email: authUser.email || '',
        display_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Campus User',
        role: 'Student' as UserRole,
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('users')
        .insert(newProfile)
        .select()
        .maybeSingle();

      if (createError) {
        console.warn("Auth: Profile insert failed (likely already exists), retrying fetch...", createError);
        const { data: retryProfiles } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id);
        
        if (retryProfiles && retryProfiles.length > 0) {
          setProfile(retryProfiles[0] as CampusUser);
        } else {
          console.error('Auth: Final profile fetch failed');
        }
      } else if (createdProfile) {
        console.log("Auth: Profile created successfully", createdProfile);
        setProfile(createdProfile as CampusUser);
      }
    } catch (error) {
      console.error('Auth: Catch-all profile error:', error);
    }
  }

  useEffect(() => {
    console.log("Auth: Initializing...");
    
    // Safety Timeout: Force loading to false after 5 seconds if DB hangs
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn("Auth: Safety timeout reached. Forcing loading to false.");
        setLoading(false);
      }
    }, 5000);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Auth: Initial session check completed", session?.user?.email || "No user");
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchOrCreateProfile(session.user).finally(() => {
          clearTimeout(safetyTimer);
          setLoading(false);
        });
      } else {
        clearTimeout(safetyTimer);
        setLoading(false);
      }
    }).catch(err => {
      console.error("Auth: GetSession error", err);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth: State change event", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        try {
          if (session?.user) {
            await fetchOrCreateProfile(session.user);
          } else {
            setProfile(null);
          }
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
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
    // Force immediate local UI update in case the database connection hangs
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoginError(null);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Network error during logout:", error);
    }
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
