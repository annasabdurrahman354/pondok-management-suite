
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Use the project ID from config.toml and the anon key directly
const projectId = 'frxqmecqsebzvxytgrgu';
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyeHFtZWNxc2VienZ4eXRncmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMjUzMTIsImV4cCI6MjA2MTgwMTMxMn0.zOTfE8lzvzawBwQZdZEQHkC3v7FiNyYLkm8m2BptnQI';

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey
);
