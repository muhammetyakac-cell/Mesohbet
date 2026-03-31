'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const hasSupabaseConfig = Boolean(supabaseUrl) && Boolean(supabaseKey);

if (!hasSupabaseConfig && process.env.NODE_ENV !== 'production') {
  console.warn(
    'Supabase env değişkenleri tanımlı değil. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_KEY ayarlayın.'
  );
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
