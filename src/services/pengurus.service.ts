
import { supabase } from '../lib/supabase';
import { Pengurus, PengurusFormData } from '../types/pengurus.types';

export async function getPengurusByPondokId(pondokId: string): Promise<Pengurus[]> {
  const { data, error } = await supabase
    .from('pengurus')
    .select('*')
    .eq('pondok_id', pondokId)
    .order('jabatan');
  
  if (error) {
    console.error("Error fetching pengurus list:", error);
    return [];
  }
  
  return data || [];
}

export async function createPengurus(pondokId: string, pengurusData: PengurusFormData): Promise<Pengurus | null> {
  const { data, error } = await supabase
    .from('pengurus')
    .insert({
      pondok_id: pondokId,
      name: pengurusData.name,
      phone: pengurusData.phone || null,
      jabatan: pengurusData.jabatan
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error creating pengurus:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updatePengurus(id: string, pengurusData: PengurusFormData): Promise<Pengurus | null> {
  const { data, error } = await supabase
    .from('pengurus')
    .update({
      name: pengurusData.name,
      phone: pengurusData.phone || null,
      jabatan: pengurusData.jabatan
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating pengurus:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deletePengurus(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('pengurus')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting pengurus:", error);
    throw new Error(error.message);
  }
  
  return true;
}
