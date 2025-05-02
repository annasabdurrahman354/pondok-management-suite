
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

export interface PondokFormData {
  name: string;
  phone: string | null;
  address: string | null;
  provinsi_id: number | null;
  kota_id: number | null;
  kecamatan_id: number | null;
  kelurahan_id: number | null;
  kode_pos: string | null;
  daerah_sambung_id: number | null;
}

export interface Provinsi {
  id: number;
  name: string;
}

export interface Kota {
  id: number;
  provinsi_id: number;
  name: string;
}

export interface Kecamatan {
  id: number;
  kota_id: number;
  name: string;
}

export interface Kelurahan {
  id: number;
  kecamatan_id: number;
  name: string;
}

export interface DaerahSambung {
  id: number;
  name: string;
}
