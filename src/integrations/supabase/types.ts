export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      lpj: {
        Row: {
          accepted_at: string | null
          bukti_url: string | null
          id: string
          periode_id: string
          pesan_revisi: string | null
          pondok_id: string
          saldo_awal: number | null
          sisa_saldo: number | null
          status: string
          submit_at: string | null
          total_pemasukan: number | null
          total_pengeluaran: number | null
        }
        Insert: {
          accepted_at?: string | null
          bukti_url?: string | null
          id?: string
          periode_id: string
          pesan_revisi?: string | null
          pondok_id: string
          saldo_awal?: number | null
          sisa_saldo?: number | null
          status?: string
          submit_at?: string | null
          total_pemasukan?: number | null
          total_pengeluaran?: number | null
        }
        Update: {
          accepted_at?: string | null
          bukti_url?: string | null
          id?: string
          periode_id?: string
          pesan_revisi?: string | null
          pondok_id?: string
          saldo_awal?: number | null
          sisa_saldo?: number | null
          status?: string
          submit_at?: string | null
          total_pemasukan?: number | null
          total_pengeluaran?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lpj_periode_id_fkey"
            columns: ["periode_id"]
            isOneToOne: false
            referencedRelation: "periode"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lpj_pondok_id_fkey"
            columns: ["pondok_id"]
            isOneToOne: false
            referencedRelation: "pondok"
            referencedColumns: ["id"]
          },
        ]
      }
      notifikasi: {
        Row: {
          created_at: string | null
          entity_id: string | null
          id: string
          is_read: boolean | null
          message: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pengurus: {
        Row: {
          created_at: string | null
          id: string
          jabatan: string
          name: string
          phone: string | null
          pondok_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          jabatan: string
          name: string
          phone?: string | null
          pondok_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          jabatan?: string
          name?: string
          phone?: string | null
          pondok_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pengurus_pondok_id_fkey"
            columns: ["pondok_id"]
            isOneToOne: false
            referencedRelation: "pondok"
            referencedColumns: ["id"]
          },
        ]
      }
      periode: {
        Row: {
          created_at: string | null
          id: string
          lpj_end: string
          lpj_start: string
          month: number
          rab_end: string
          rab_start: string
          year: number
        }
        Insert: {
          created_at?: string | null
          id: string
          lpj_end: string
          lpj_start: string
          month: number
          rab_end: string
          rab_start: string
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          lpj_end?: string
          lpj_start?: string
          month?: number
          rab_end?: string
          rab_start?: string
          year?: number
        }
        Relationships: []
      }
      pondok: {
        Row: {
          accepted_at: string | null
          address: string | null
          daerah_sambung_id: number | null
          id: string
          kecamatan_id: number | null
          kelurahan_id: number | null
          kode_pos: string | null
          kota_id: number | null
          name: string
          phone: string | null
          provinsi_id: number | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          address?: string | null
          daerah_sambung_id?: number | null
          id?: string
          kecamatan_id?: number | null
          kelurahan_id?: number | null
          kode_pos?: string | null
          kota_id?: number | null
          name: string
          phone?: string | null
          provinsi_id?: number | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          address?: string | null
          daerah_sambung_id?: number | null
          id?: string
          kecamatan_id?: number | null
          kelurahan_id?: number | null
          kode_pos?: string | null
          kota_id?: number | null
          name?: string
          phone?: string | null
          provinsi_id?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          phone: string | null
          pondok_id: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          id: string
          name?: string | null
          phone?: string | null
          pondok_id?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          pondok_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_pondok_id_fkey"
            columns: ["pondok_id"]
            isOneToOne: false
            referencedRelation: "pondok"
            referencedColumns: ["id"]
          },
        ]
      }
      rab: {
        Row: {
          accepted_at: string | null
          bukti_url: string | null
          id: string
          periode_id: string
          pesan_revisi: string | null
          pondok_id: string
          saldo_awal: number | null
          status: string
          submit_at: string | null
          total_pemasukan: number | null
          total_pengeluaran: number | null
        }
        Insert: {
          accepted_at?: string | null
          bukti_url?: string | null
          id?: string
          periode_id: string
          pesan_revisi?: string | null
          pondok_id: string
          saldo_awal?: number | null
          status?: string
          submit_at?: string | null
          total_pemasukan?: number | null
          total_pengeluaran?: number | null
        }
        Update: {
          accepted_at?: string | null
          bukti_url?: string | null
          id?: string
          periode_id?: string
          pesan_revisi?: string | null
          pondok_id?: string
          saldo_awal?: number | null
          status?: string
          submit_at?: string | null
          total_pemasukan?: number | null
          total_pengeluaran?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rab_periode_id_fkey"
            columns: ["periode_id"]
            isOneToOne: false
            referencedRelation: "periode"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rab_pondok_id_fkey"
            columns: ["pondok_id"]
            isOneToOne: false
            referencedRelation: "pondok"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
