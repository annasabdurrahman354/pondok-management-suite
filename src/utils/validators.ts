
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter")
});

export const pondokSchema = z.object({
  name: z.string().min(3, "Nama pondok minimal 3 karakter"),
  phone: z.string().min(10, "No. Telepon tidak valid").optional().nullable(),
  address: z.string().min(5, "Alamat minimal 5 karakter").optional().nullable(),
  provinsi_id: z.number().optional().nullable(),
  kota_id: z.number().optional().nullable(),
  kecamatan_id: z.number().optional().nullable(),
  kelurahan_id: z.number().optional().nullable(),
  kode_pos: z.string().optional().nullable(),
  daerah_sambung_id: z.number().optional().nullable()
});

export const pengurusSchema = z.object({
  name: z.string().min(3, "Nama pengurus minimal 3 karakter"),
  phone: z.string().min(10, "No. Telepon tidak valid").optional().nullable(),
  jabatan: z.enum([
    'ketua_pondok',
    'wakil_ketua_pondok',
    'pinisepuh_pondok',
    'bendahara',
    'sekretaris',
    'guru_pondok'
  ])
});

export const periodeSchema = z.object({
  year: z.number().min(2020).max(2100),
  month: z.number().min(1).max(12),
  rab_start: z.string(),
  rab_end: z.string(),
  lpj_start: z.string(),
  lpj_end: z.string()
}).refine(data => new Date(data.rab_end) > new Date(data.rab_start), {
  message: "Tanggal akhir RAB harus setelah tanggal mulai RAB",
  path: ["rab_end"]
}).refine(data => new Date(data.lpj_end) > new Date(data.lpj_start), {
  message: "Tanggal akhir LPJ harus setelah tanggal mulai LPJ",
  path: ["lpj_end"]
});

export const rabSchema = z.object({
  saldo_awal: z.number(),
  total_pemasukan: z.number().min(0, "Total pemasukan tidak boleh negatif"),
  total_pengeluaran: z.number().min(0, "Total pengeluaran tidak boleh negatif"),
  bukti_file: z.instanceof(File).optional()
});

export const lpjSchema = z.object({
  saldo_awal: z.number(),
  total_pemasukan: z.number().min(0, "Total pemasukan tidak boleh negatif"),
  total_pengeluaran: z.number().min(0, "Total pengeluaran tidak boleh negatif"),
  sisa_saldo: z.number(),
  bukti_file: z.instanceof(File).optional()
});
