'use client';

import { createClient } from '@supabase/supabase-js';

// Read env vars (may be undefined during build time)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// Do not initialize Supabase on the server during static build step.
// Initialize only in the browser when window is available and env vars exist.
let supabase = null;
export function getSupabase() {
  if (!supabase && typeof window !== 'undefined' && supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}
