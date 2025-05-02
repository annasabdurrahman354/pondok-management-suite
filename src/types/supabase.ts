
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pondok: {
        Row: {
          id: string
          name: string
          phone: string | null
          address: string | null
          provinsi_id: number | null
          kota_id: number | null
          kecamatan_id: number | null
          kelurahan_id: number | null
          kode_pos: string | null
          daerah_sambung_id: number | null
          updated_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          address?: string | null
          provinsi_id?: number | null
          kota_id?: number | null
          kecamatan_id?: number | null
          kelurahan_id?: number | null
          kode_pos?: string | null
          daerah_sambung_id?: number | null
          updated_at?: string
          accepted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          address?: string | null
          provinsi_id?: number | null
          kota_id?: number | null
          kecamatan_id?: number | null
          kelurahan_id?: number | null
          kode_pos?: string | null
          daerah_sambung_id?: number | null
          updated_at?: string
          accepted_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          role: string
          pondok_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          phone?: string | null
          role: string
          pondok_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string | null
          role?: string
          pondok_id?: string | null
          created_at?: string
        }
      }
      pengurus: {
        Row: {
          id: string
          pondok_id: string
          name: string
          phone: string | null
          jabatan: string
          created_at: string
        }
        Insert: {
          id?: string
          pondok_id: string
          name: string
          phone?: string | null
          jabatan: string
          created_at?: string
        }
        Update: {
          id?: string
          pondok_id?: string
          name?: string
          phone?: string | null
          jabatan?: string
          created_at?: string
        }
      }
      periode: {
        Row: {
          id: string
          year: number
          month: number
          rab_start: string
          rab_end: string
          lpj_start: string
          lpj_end: string
          created_at: string
        }
        Insert: {
          id: string
          year: number
          month: number
          rab_start: string
          rab_end: string
          lpj_start: string
          lpj_end: string
          created_at?: string
        }
        Update: {
          id?: string
          year?: number
          month?: number
          rab_start?: string
          rab_end?: string
          lpj_start?: string
          lpj_end?: string
          created_at?: string
        }
      }
      rab: {
        Row: {
          id: string
          pondok_id: string
          periode_id: string
          status: string
          submit_at: string | null
          accepted_at: string | null
          saldo_awal: number
          total_pemasukan: number
          total_pengeluaran: number
          bukti_url: string | null
          pesan_revisi: string | null
        }
        Insert: {
          id?: string
          pondok_id: string
          periode_id: string
          status?: string
          submit_at?: string | null
          accepted_at?: string | null
          saldo_awal?: number
          total_pemasukan?: number
          total_pengeluaran?: number
          bukti_url?: string | null
          pesan_revisi?: string | null
        }
        Update: {
          id?: string
          pondok_id?: string
          periode_id?: string
          status?: string
          submit_at?: string | null
          accepted_at?: string | null
          saldo_awal?: number
          total_pemasukan?: number
          total_pengeluaran?: number
          bukti_url?: string | null
          pesan_revisi?: string | null
        }
      }
      lpj: {
        Row: {
          id: string
          pondok_id: string
          periode_id: string
          status: string
          submit_at: string | null
          accepted_at: string | null
          saldo_awal: number
          total_pemasukan: number
          total_pengeluaran: number
          sisa_saldo: number
          bukti_url: string | null
          pesan_revisi: string | null
        }
        Insert: {
          id?: string
          pondok_id: string
          periode_id: string
          status?: string
          submit_at?: string | null
          accepted_at?: string | null
          saldo_awal?: number
          total_pemasukan?: number
          total_pengeluaran?: number
          sisa_saldo?: number
          bukti_url?: string | null
          pesan_revisi?: string | null
        }
        Update: {
          id?: string
          pondok_id?: string
          periode_id?: string
          status?: string
          submit_at?: string | null
          accepted_at?: string | null
          saldo_awal?: number
          total_pemasukan?: number
          total_pengeluaran?: number
          sisa_saldo?: number
          bukti_url?: string | null
          pesan_revisi?: string | null
        }
      }
      notifikasi: {
        Row: {
          id: string
          user_id: string
          message: string
          type: string
          entity_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          type: string
          entity_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          type?: string
          entity_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
