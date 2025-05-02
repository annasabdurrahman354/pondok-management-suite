
export interface Periode {
  id: string; // Format: YYYYMM
  year: number;
  month: number;
  rab_start: string;
  rab_end: string;
  lpj_start: string;
  lpj_end: string;
  created_at: string;
}

export interface PeriodeFormData {
  year: number;
  month: number;
  rab_start: string;
  rab_end: string;
  lpj_start: string;
  lpj_end: string;
}
