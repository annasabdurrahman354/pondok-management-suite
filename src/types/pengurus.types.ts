
export type JabatanType = 'ketua_pondok' | 'wakil_ketua_pondok' | 'pinisepuh_pondok' | 'bendahara' | 'sekretaris' | 'guru_pondok';

export interface Pengurus {
  id: string;
  pondok_id: string;
  name: string;
  phone: string | null;
  jabatan: JabatanType;
  created_at: string;
}

export interface PengurusFormData {
  name: string;
  phone: string | null;
  jabatan: JabatanType;
}

export const JabatanLabels: Record<JabatanType, string> = {
  'ketua_pondok': 'Ketua Pondok',
  'wakil_ketua_pondok': 'Wakil Ketua Pondok',
  'pinisepuh_pondok': 'Pinisepuh Pondok',
  'bendahara': 'Bendahara',
  'sekretaris': 'Sekretaris',
  'guru_pondok': 'Guru Pondok'
};
