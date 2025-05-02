
export type StatusType = 'diajukan' | 'revisi' | 'diterima';

export const STATUS_LABELS: Record<StatusType, string> = {
  'diajukan': 'Diajukan',
  'revisi': 'Revisi',
  'diterima': 'Diterima'
};

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
  pondok?: {
    name: string;
  };
}

export interface RABFormData {
  saldo_awal: number;
  total_pemasukan: number;
  total_pengeluaran: number;
  bukti_url?: string;
}

export interface RABItem {
  id: string;
  rab_id: string;
  kategori: string;
  deskripsi: string;
  jumlah: number;
  created_at: string;
}

export interface RABItemFormData {
  kategori: string;
  deskripsi: string;
  jumlah: number;
}

export interface RABRevisionData {
  pesan_revisi: string;
}
