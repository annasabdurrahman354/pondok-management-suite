
import { StatusType } from './rab.types';

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
}

export interface LPJWithPondok extends LPJ {
  pondok: {
    name: string;
  };
}

export interface LPJFormData {
  saldo_awal: number; // From approved RAB
  total_pemasukan: number;
  total_pengeluaran: number;
  sisa_saldo: number;
  bukti_file?: File;
}
