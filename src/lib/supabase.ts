
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These environment variables are needed - make sure to set them through the Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please connect your Lovable project to Supabase.");
}

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey
);
