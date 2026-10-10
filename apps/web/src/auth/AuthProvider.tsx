import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { queryClient } from '../lib/queryClient';

export interface AuthContextValue {
  readonly user: User | null;
  readonly session: Session | null;
  readonly isLoading: boolean;
  readonly isConfigured: boolean;
  readonly error: AuthError | null;
  readonly signInWithEmail: (email: string, pass: string) => Promise<{ error: AuthError | null }>;
  readonly signUpWithEmail: (email: string, pass: string) => Promise<{ error: AuthError | null }>;
  readonly signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Fetch initial active session
    supabase.auth.getSession().then(({ data, error: sessionErr }) => {
      if (!isMounted) return;
      if (sessionErr) setError(sessionErr);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    // Listen to real-time auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);

      if (event === 'SIGNED_OUT') {
        queryClient.clear();
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        queryClient.invalidateQueries();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (signInErr) setError(signInErr);
    return { error: signInErr };
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    const { error: signUpErr } = await supabase.auth.signUp({
      email,
      password: pass,
    });
    if (signUpErr) setError(signUpErr);
    return { error: signUpErr };
  };

  const signOut = async () => {
    queryClient.clear();
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      return { error: null };
    }
    const { error: signOutErr } = await supabase.auth.signOut();
    if (signOutErr) setError(signOutErr);
    setUser(null);
    setSession(null);
    return { error: signOutErr };
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isLoading,
      isConfigured: isSupabaseConfigured,
      error,
      signInWithEmail,
      signUpWithEmail,
      signOut,
    }),
    [user, session, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
