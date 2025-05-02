
import { supabase } from '../lib/supabase';
import { LPJ, LPJFormData, LPJItem, LPJItemFormData, LPJRevisionData } from '../types/lpj.types';

export async function getLPJsByPeriodeId(periodeId: string): Promise<LPJ[]> {
  const { data, error } = await supabase
    .from('lpj')
    .select('*, pondok(name)')
    .eq('periode_id', periodeId)
    .order('submit_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching LPJs:", error);
    return [];
  }
  
  return data || [];
}

export async function getLPJByPondokAndPeriode(pondokId: string, periodeId: string): Promise<LPJ | null> {
  const { data, error } = await supabase
    .from('lpj')
    .select('*')
    .eq('pondok_id', pondokId)
    .eq('periode_id', periodeId)
    .single();
  
  if (error) {
    if (error.code !== 'PGRST116') { // Not found error
      console.error("Error fetching LPJ:", error);
    }
    return null;
  }
  
  return data;
}

export async function getLPJById(id: string): Promise<LPJ | null> {
  const { data, error } = await supabase
    .from('lpj')
    .select('*, pondok(name)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching LPJ by ID:", error);
    return null;
  }
  
  return data;
}

export async function createLPJ(pondokId: string, periodeId: string, lpjData: LPJFormData): Promise<LPJ | null> {
  const { data, error } = await supabase
    .from('lpj')
    .insert({
      pondok_id: pondokId,
      periode_id: periodeId,
      status: 'diajukan',
      submit_at: new Date().toISOString(),
      saldo_awal: lpjData.saldo_awal,
      total_pemasukan: lpjData.total_pemasukan,
      total_pengeluaran: lpjData.total_pengeluaran,
      sisa_saldo: lpjData.sisa_saldo,
      bukti_url: lpjData.bukti_url || null
    })
    .select('*')
    .single();
  
  if (error) {
    console.error("Error creating LPJ:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateLPJStatus(id: string, status: 'diajukan' | 'revisi' | 'diterima', revisionData?: LPJRevisionData): Promise<LPJ | null> {
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
    .from('lpj')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating LPJ status:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateLPJ(id: string, lpjData: LPJFormData): Promise<LPJ | null> {
  const { data, error } = await supabase
    .from('lpj')
    .update({
      saldo_awal: lpjData.saldo_awal,
      total_pemasukan: lpjData.total_pemasukan,
      total_pengeluaran: lpjData.total_pengeluaran,
      sisa_saldo: lpjData.sisa_saldo,
      bukti_url: lpjData.bukti_url || null,
      status: 'diajukan', // Reset to diajukan when updated
      submit_at: new Date().toISOString(),
      pesan_revisi: null // Clear revision message
    })
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating LPJ:", error);
    throw new Error(error.message);
  }
  
  return data;
}

// LPJ Items (Details)

export async function getLPJItems(lpjId: string): Promise<LPJItem[]> {
  const { data, error } = await supabase
    .from('lpj_items')
    .select('*')
    .eq('lpj_id', lpjId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error("Error fetching LPJ items:", error);
    return [];
  }
  
  return data || [];
}

export async function createLPJItem(lpjId: string, itemData: LPJItemFormData): Promise<LPJItem | null> {
  const { data, error } = await supabase
    .from('lpj_items')
    .insert({
      lpj_id: lpjId,
      kategori: itemData.kategori,
      deskripsi: itemData.deskripsi,
      anggaran: itemData.anggaran,
      realisasi: itemData.realisasi
    })
    .select('*')
    .single();
  
  if (error) {
    console.error("Error creating LPJ item:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateLPJItem(id: string, itemData: LPJItemFormData): Promise<LPJItem | null> {
  const { data, error } = await supabase
    .from('lpj_items')
    .update({
      kategori: itemData.kategori,
      deskripsi: itemData.deskripsi,
      anggaran: itemData.anggaran,
      realisasi: itemData.realisasi
    })
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error("Error updating LPJ item:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteLPJItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('lpj_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting LPJ item:", error);
    throw new Error(error.message);
  }
  
  return true;
}
