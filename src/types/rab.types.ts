
export type StatusType = 'diajukan' | 'revisi' | 'diterima';

export interface RAB {
  id: string;
  pondok_id: string;
  periode_id: string;
  status: StatusType;
  submit_at: string | null;
  accepted_at: string | null;
  saldo_awal: number;
  total_pemasukan: number;
  total_pengeluaran: number;
  bukti_url: string | null;
  pesan_revisi: string | null;
}

export interface RABWithPondok extends RAB {
  pondok: {
    name: string;
  };
}

export interface RABFormData {
  saldo_awal: number;
  total_pemasukan: number;
  total_pengeluaran: number;
  bukti_file?: File;
}

export const STATUS_LABELS: Record<StatusType, string> = {
  diajukan: 'Diajukan',
  revisi: 'Perlu Revisi',
  diterima: 'Diterima'
};
