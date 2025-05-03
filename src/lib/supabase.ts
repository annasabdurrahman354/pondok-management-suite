
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These environment variables are needed - make sure to set them through the Supabase integration
const supabaseUrl = 'https://biquohtdtkljoejvwgdh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpcXVvaHRkdGtsam9lanZ3Z2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDY5NDEsImV4cCI6MjA2MTc4Mjk0MX0.G0MkO7SZt7Np8J6Oc_iGw1EWVOqXvECK-dLuzPnyyJA';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please connect your Lovable project to Supabase.");
}

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey
);
