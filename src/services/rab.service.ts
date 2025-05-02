
import { supabase } from '../lib/supabase';
import { RAB, RABFormData, RABWithPondok } from '../types/rab.types';

export async function getRABsByPeriodeId(periodeId: string): Promise<RABWithPondok[]> {
  const { data, error } = await supabase
    .from('rab')
    .select(`
      *,
      pondok:pondok_id (
        name
      )
    `)
    .eq('periode_id', periodeId);
  
  if (error) {
    console.error("Error fetching RAB list:", error);
    return [];
  }
  
  return data || [];
}

export async function getRABsByPondokId(pondokId: string): Promise<RAB[]> {
  const { data, error } = await supabase
    .from('rab')
    .select('*')
    .eq('pondok_id', pondokId)
    .order('periode_id', { ascending: false });
  
  if (error) {
    console.error("Error fetching RAB list:", error);
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
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error("Error fetching RAB:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function getRABById(id: string): Promise<RAB | null> {
  const { data, error } = await supabase
    .from('rab')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching RAB:", error);
    return null;
  }
  
  return data;
}

export async function createRAB(pondokId: string, periodeId: string, rabData: RABFormData, buktiUrl: string | null): Promise<RAB | null> {
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
      bukti_url: buktiUrl
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error creating RAB:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateRABStatus(id: string, status: 'revisi' | 'diterima', pesanRevisi?: string): Promise<RAB | null> {
  const updates: any = {
    status,
  };
  
  if (status === 'diterima') {
    updates.accepted_at = new Date().toISOString();
  } else if (status === 'revisi') {
    updates.pesan_revisi = pesanRevisi;
  }
  
  const { data, error } = await supabase
    .from('rab')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating RAB status:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateRAB(id: string, rabData: RABFormData, buktiUrl: string | null): Promise<RAB | null> {
  const { data, error } = await supabase
    .from('rab')
    .update({
      status: 'diajukan',
      submit_at: new Date().toISOString(),
      saldo_awal: rabData.saldo_awal,
      total_pemasukan: rabData.total_pemasukan,
      total_pengeluaran: rabData.total_pengeluaran,
      bukti_url: buktiUrl || undefined,
      pesan_revisi: null
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating RAB:", error);
    throw new Error(error.message);
  }
  
  return data;
}
