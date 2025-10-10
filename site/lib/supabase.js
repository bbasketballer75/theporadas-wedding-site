import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const missingSupabaseConfigMessage =
  'Supabase environment variables are missing. Photo and video upload features are currently disabled. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to site/.env.local.';

let supabaseClient = null;
const missingSupabaseConfig = !supabaseUrl || !supabaseAnonKey;

if (missingSupabaseConfig) {
  const isProductionBuild = process.env.NODE_ENV === 'production';
  const logOnceKey = '__SUPABASE_CONFIG_WARNING_SHOWN__';
  const globalScope = globalThis;

  if (!isProductionBuild && !globalScope[logOnceKey]) {
    globalScope[logOnceKey] = true;
    const log = console.warn;
    log('[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set.');
    log('[Supabase] Create site/.env.local with:');
    log('NEXT_PUBLIC_SUPABASE_URL=your_project_url');
    log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  }
} else {
  /**
   * Supabase client for wedding photo uploads
   * - No authentication required (anonymous uploads)
   * - Public read access for all guests
   * - Configured for static export compatibility
   */
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
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
}

const supabaseFallback = new Proxy(
  {},
  {
    get() {
      throw new Error(missingSupabaseConfigMessage);
    },
    apply() {
      throw new Error(missingSupabaseConfigMessage);
    },
  }
);

export const supabase = supabaseClient ?? supabaseFallback;
export const isSupabaseConfigured = Boolean(supabaseClient);

export function getSupabaseClient() {
  if (!supabaseClient) {
    throw new Error(missingSupabaseConfigMessage);
  }

  return supabaseClient;
}
