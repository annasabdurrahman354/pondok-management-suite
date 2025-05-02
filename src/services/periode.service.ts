
import { supabase } from '../lib/supabase';
import { Periode, PeriodeFormData } from '../types/periode.types';

export async function getAllPeriodes(): Promise<Periode[]> {
  const { data, error } = await supabase
    .from('periode')
    .select('*')
    .order('id', { ascending: false });
  
  if (error) {
    console.error("Error fetching periodes:", error);
    return [];
  }
  
  return data || [];
}

export async function getPeriodeById(id: string): Promise<Periode | null> {
  const { data, error } = await supabase
    .from('periode')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching periode:", error);
    return null;
  }
  
  return data;
}

export async function getCurrentPeriode(): Promise<Periode | null> {
  // Get the latest periode
  const { data, error } = await supabase
    .from('periode')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    if (error.code !== 'PGRST116') { // Not found error
      console.error("Error fetching current periode:", error);
    }
    return null;
  }
  
  return data;
}

export async function createPeriode(periodeData: PeriodeFormData): Promise<Periode | null> {
  // Format id as YYYYMM
  const id = `${periodeData.year}${periodeData.month.toString().padStart(2, '0')}`;
  
  const { data, error } = await supabase
    .from('periode')
    .insert({
      id,
      year: periodeData.year,
      month: periodeData.month,
      rab_start: periodeData.rab_start,
      rab_end: periodeData.rab_end,
      lpj_start: periodeData.lpj_start,
      lpj_end: periodeData.lpj_end
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error creating periode:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updatePeriode(id: string, periodeData: PeriodeFormData): Promise<Periode | null> {
  const { data, error } = await supabase
    .from('periode')
    .update({
      year: periodeData.year,
      month: periodeData.month,
      rab_start: periodeData.rab_start,
      rab_end: periodeData.rab_end,
      lpj_start: periodeData.lpj_start,
      lpj_end: periodeData.lpj_end
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating periode:", error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function checkIsWithinRABPeriod(periodeId: string, currentDate: Date = new Date()): Promise<boolean> {
  const periode = await getPeriodeById(periodeId);
  if (!periode) return false;
  
  const currentTimestamp = currentDate.getTime();
  const rabStartTimestamp = new Date(periode.rab_start).getTime();
  const rabEndTimestamp = new Date(periode.rab_end).setHours(23, 59, 59, 999);
  
  return currentTimestamp >= rabStartTimestamp && currentTimestamp <= rabEndTimestamp;
}

export async function checkIsWithinLPJPeriod(periodeId: string, currentDate: Date = new Date()): Promise<boolean> {
  const periode = await getPeriodeById(periodeId);
  if (!periode) return false;
  
  const currentTimestamp = currentDate.getTime();
  const lpjStartTimestamp = new Date(periode.lpj_start).getTime();
  const lpjEndTimestamp = new Date(periode.lpj_end).setHours(23, 59, 59, 999);
  
  return currentTimestamp >= lpjStartTimestamp && currentTimestamp <= lpjEndTimestamp;
}
