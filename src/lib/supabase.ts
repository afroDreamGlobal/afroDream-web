import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id')
);

// Public client for client components and unauthenticated access
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side service role client for privileged admin operations
export const supabaseAdmin = Boolean(isSupabaseConfigured && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
