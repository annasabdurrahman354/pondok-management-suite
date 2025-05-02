
import { supabase } from '../lib/supabase';
import { RAB, RABFormData, RABItem, RABItemFormData, RABRevisionData } from '../types/rab.types';

export async function getRABsByPeriodeId(periodeId: string): Promise<RAB[]> {
  const { data, error } = await supabase
    .from('rab')
    .select('*, pondok(name)')
    .eq('periode_id', periodeId)
    .order('submit_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching RABs:", error);
    return [];
  }
  
  return data || [];
}

export async function getRABByPondokAndPeriode(pondokId: string, periodeId: string): Promise<RAB | null> {
  const { data, error } = await supabase
    .from('rab')
    .select('*')
    .eq('pondok_id', pondokId)
    .eq('periode_id', periodeId)
    .single();
  
  if (error) {
    if (error.code !== 'PGRST116') { // Not found error
      console.error("Error fetching RAB:", error);
    }
    return null;
  }
  
  return data;
}

export async function getRABById(id: string): Promise<RAB | null> {
  const { data, error } = await supabase
    .from('rab')
    .select('*, pondok(name)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching RAB by ID:", error);
    return null;
  }
  
  return data;
}

export async function createRAB(pondokId: string, periodeId: string, rabData: RABFormData): Promise<RAB | null> {
  const { data, error } = await supabase
    .from('rab')
    .insert({
      pondok_id: pondokId,
      periode_id: periodeId,
      status: 'diajukan',
      submit_at: new Date().toISOString(),
      saldo_awal: rabData.saldo_awal,
      total_pemasukan: rabData.total_pemasukan,
      total_pengeluaran: rabData.total_pengeluaran,
      bukti_url: rabData.bukti_url || null
    })
    .select('*')
    .single();
  
  if (error) {
    console.error("Error creating RAB:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateRABStatus(id: string, status: 'diajukan' | 'revisi' | 'diterima', revisionData?: RABRevisionData): Promise<RAB | null> {
  const updateData: any = { status };
  
  if (status === 'diterima') {
    updateData.accepted_at = new Date().toISOString();
    updateData.pesan_revisi = null; // Clear any previous revision message
  } else if (status === 'revisi' && revisionData) {
    updateData.pesan_revisi = revisionData.pesan_revisi;
  } else if (status === 'diajukan') {
    updateData.submit_at = new Date().toISOString();
    updateData.pesan_revisi = null; // Clear any previous revision message
  }
  
  const { data, error } = await supabase
    .from('rab')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating RAB status:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateRAB(id: string, rabData: RABFormData): Promise<RAB | null> {
  const { data, error } = await supabase
    .from('rab')
    .update({
      saldo_awal: rabData.saldo_awal,
      total_pemasukan: rabData.total_pemasukan,
      total_pengeluaran: rabData.total_pengeluaran,
      bukti_url: rabData.bukti_url || null,
      status: 'diajukan', // Reset to diajukan when updated
      submit_at: new Date().toISOString(),
      pesan_revisi: null // Clear revision message
    })
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating RAB:", error);
    throw new Error(error.message);
  }
  
  return data;
}

// RAB Items (Details)

export async function getRABItems(rabId: string): Promise<RABItem[]> {
  const { data, error } = await supabase
    .from('rab_items')
    .select('*')
    .eq('rab_id', rabId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error("Error fetching RAB items:", error);
    return [];
  }
  
  return data || [];
}

export async function createRABItem(rabId: string, itemData: RABItemFormData): Promise<RABItem | null> {
  const { data, error } = await supabase
    .from('rab_items')
    .insert({
      rab_id: rabId,
      kategori: itemData.kategori,
      deskripsi: itemData.deskripsi,
      jumlah: itemData.jumlah
    })
    .select('*')
    .single();
  
  if (error) {
    console.error("Error creating RAB item:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateRABItem(id: string, itemData: RABItemFormData): Promise<RABItem | null> {
  const { data, error } = await supabase
    .from('rab_items')
    .update({
      kategori: itemData.kategori,
      deskripsi: itemData.deskripsi,
      jumlah: itemData.jumlah
    })
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating RAB item:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteRABItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('rab_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting RAB item:", error);
    throw new Error(error.message);
  }
  
  return true;
}
