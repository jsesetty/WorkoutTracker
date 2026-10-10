import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase (compatible with both Vite ESM and Jest test runners)
let rawUrl = '';
let rawAnon = '';

try {
  if (typeof process !== 'undefined' && process.env) {
    rawUrl = process.env.VITE_SUPABASE_URL || '';
    rawAnon = process.env.VITE_SUPABASE_ANON_KEY || '';
  }
  const meta = Function('try { return import.meta; } catch(e) { return null; }')();
  if (meta?.env) {
    rawUrl = meta.env.VITE_SUPABASE_URL || rawUrl;
    rawAnon = meta.env.VITE_SUPABASE_ANON_KEY || rawAnon;
  }
} catch {
  // Fallback for non-ESM environments
}

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

