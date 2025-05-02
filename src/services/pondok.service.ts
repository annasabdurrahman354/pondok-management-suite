
import { supabase } from '../lib/supabase';
import { Pondok, PondokFormData } from '../types/pondok.types';

export async function getPondokById(id: string): Promise<Pondok | null> {
  const { data, error } = await supabase
    .from('pondok')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching pondok:", error);
    return null;
  }
  
  return data;
}

export async function getAllPondok(): Promise<Pondok[]> {
  const { data, error } = await supabase
    .from('pondok')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching pondok list:", error);
    return [];
  }
  
  return data || [];
}

export async function updatePondok(id: string, pondokData: PondokFormData): Promise<Pondok | null> {
  const { data, error } = await supabase
    .from('pondok')
    .update({
      ...pondokData,
      updated_at: new Date().toISOString(),
      accepted_at: null
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating pondok:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function approvePondokSync(id: string): Promise<Pondok | null> {
  const { data, error } = await supabase
    .from('pondok')
    .update({
      accepted_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error approving pondok sync:", error);
    throw new Error(error.message);
  }
  
  return data;
}
