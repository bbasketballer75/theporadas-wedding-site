import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('Please create site/.env.local with:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_project_url');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  throw new Error('Missing Supabase environment variables');
}

/**
 * Supabase client for wedding photo uploads
 * - No authentication required (anonymous uploads)
 * - Public read access for all guests
 * - Configured for static export compatibility
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No login required
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-wedding-upload': 'theporadas-2025',
    },
  },
});
