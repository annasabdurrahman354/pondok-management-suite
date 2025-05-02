
export interface Pondok {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  provinsi_id: number | null;
  kota_id: number | null;
  kecamatan_id: number | null;
  kelurahan_id: number | null;
  kode_pos: string | null;
  daerah_sambung_id: number | null;
  updated_at: string;
  accepted_at: string | null;
}

export interface PondokWithCount extends Pondok {
  pengurus_count: number;
}

export interface PondokFormData {
  name: string;
  phone: string;
  address: string;
  provinsi_id: number;
  kota_id: number;
  kecamatan_id: number;
  kelurahan_id: number;
  kode_pos: string;
  daerah_sambung_id: number;
}

export interface LocationData {
  id: number;
  name: string;
}
