
import { supabase } from '../lib/supabase';
import { LPJ, LPJFormData, LPJWithPondok } from '../types/lpj.types';

export async function getLPJsByPeriodeId(periodeId: string): Promise<LPJWithPondok[]> {
  const { data, error } = await supabase
    .from('lpj')
    .select(`
      *,
      pondok:pondok_id (
        name
      )
    `)
    .eq('periode_id', periodeId);
  
  if (error) {
    console.error("Error fetching LPJ list:", error);
    return [];
  }
  
  return data || [];
}

export async function getLPJsByPondokId(pondokId: string): Promise<LPJ[]> {
  const { data, error } = await supabase
    .from('lpj')
    .select('*')
    .eq('pondok_id', pondokId)
    .order('periode_id', { ascending: false });
  
  if (error) {
    console.error("Error fetching LPJ list:", error);
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
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error("Error fetching LPJ:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function getLPJById(id: string): Promise<LPJ | null> {
  const { data, error } = await supabase
    .from('lpj')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching LPJ:", error);
    return null;
  }
  
  return data;
}

export async function createLPJ(pondokId: string, periodeId: string, lpjData: LPJFormData, buktiUrl: string | null): Promise<LPJ | null> {
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
      bukti_url: buktiUrl
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error creating LPJ:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateLPJStatus(id: string, status: 'revisi' | 'diterima', pesanRevisi?: string): Promise<LPJ | null> {
  const updates: any = {
    status,
  };
  
  if (status === 'diterima') {
    updates.accepted_at = new Date().toISOString();
  } else if (status === 'revisi') {
    updates.pesan_revisi = pesanRevisi;
  }
  
  const { data, error } = await supabase
    .from('lpj')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating LPJ status:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateLPJ(id: string, lpjData: LPJFormData, buktiUrl: string | null): Promise<LPJ | null> {
  const { data, error } = await supabase
    .from('lpj')
    .update({
      status: 'diajukan',
      submit_at: new Date().toISOString(),
      saldo_awal: lpjData.saldo_awal,
      total_pemasukan: lpjData.total_pemasukan,
      total_pengeluaran: lpjData.total_pengeluaran,
      sisa_saldo: lpjData.sisa_saldo,
      bukti_url: buktiUrl || undefined,
      pesan_revisi: null
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating LPJ:", error);
    throw new Error(error.message);
  }
  
  return data;
}
