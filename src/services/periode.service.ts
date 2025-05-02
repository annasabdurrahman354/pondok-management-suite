
import { supabase } from '../lib/supabase';
import { Periode, PeriodeFormData } from '../types/periode.types';

export async function getAllPeriode(): Promise<Periode[]> {
  const { data, error } = await supabase
    .from('periode')
    .select('*')
    .order('id', { ascending: false });
  
  if (error) {
    console.error("Error fetching periode list:", error);
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
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  
  // Format: YYYYMM
  const currentPeriodeId = `${year}${month.toString().padStart(2, '0')}`;
  
  const { data, error } = await supabase
    .from('periode')
    .select('*')
    .eq('id', currentPeriodeId)
    .single();
  
  if (error) {
    // If current period doesn't exist, get the latest period
    const { data: latestData, error: latestError } = await supabase
      .from('periode')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();
    
    if (latestError) {
      console.error("Error fetching periode:", latestError);
      return null;
    }
    
    return latestData;
  }
  
  return data;
}

export async function createPeriode(periodeData: PeriodeFormData): Promise<Periode | null> {
  // Format: YYYYMM
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
