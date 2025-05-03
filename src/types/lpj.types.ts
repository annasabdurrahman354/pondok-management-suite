
export type StatusType = 'diajukan' | 'revisi' | 'diterima';

export const STATUS_LABELS: Record<StatusType, string> = {
  'diajukan': 'Diajukan',
  'revisi': 'Revisi',
  'diterima': 'Diterima'
};

export interface LPJ {
  id: string;
  pondok_id: string;
  periode_id: string;
  status: StatusType;
  submit_at: string | null;
  accepted_at: string | null;
  saldo_awal: number;
  total_pemasukan: number;
  total_pengeluaran: number;
  sisa_saldo: number;
  bukti_url: string | null;
  pesan_revisi: string | null;
  pondok?: {
    name: string;
  };
}

export interface LPJFormData {
  saldo_awal: number;
  total_pemasukan: number;
  total_pengeluaran: number;
  sisa_saldo: number;
  bukti_url?: string | null;
}

export interface LPJItem {
  id: string;
  lpj_id: string;
  kategori: string;
  deskripsi: string;
  anggaran: number;
  realisasi: number;
  created_at: string;
}

export interface LPJItemFormData {
  kategori: string;
  deskripsi: string;
  anggaran: number;
  realisasi: number;
}

export interface LPJRevisionData {
  pesan_revisi: string;
}
