import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase (compatible with both Vite ESM and Jest test runners)
const rawUrl =
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  '';

const rawAnon =
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  '';

const supabaseUrl = rawUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = rawAnon || 'placeholder-anon-key';

export const isSupabaseConfigured =
  Boolean(rawUrl) &&
  Boolean(rawAnon) &&
  rawUrl !== 'https://placeholder.supabase.co';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

