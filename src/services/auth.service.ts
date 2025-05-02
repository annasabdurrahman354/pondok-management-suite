
import { supabase } from '../lib/supabase';
import { User, LoginCredentials } from '../types/auth.types';

export async function login({ email, password }: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  
  if (!sessionData.session) return null;
  
  // Get the user profile
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', sessionData.session.user.id)
    .single();
    
  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  
  return data as User;
}
