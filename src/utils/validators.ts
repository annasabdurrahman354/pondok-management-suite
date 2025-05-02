
import { z } from "zod";

// Common validation schemas
export const phoneSchema = z.string().regex(/^[0-9+()-\s]+$/, "Nomor telepon tidak valid");

export const emailSchema = z.string().email("Email tidak valid");

export const requiredString = z.string().min(1, "Field ini wajib diisi");

export const nonEmptyArray = <T>(schema: z.ZodType<T>) =>
  z.array(schema).min(1, "Minimal harus ada 1 item");

// User form validations
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password minimal 6 karakter")
});

// Pondok form validations
export const pondokFormSchema = z.object({
  name: requiredString,
  phone: phoneSchema.optional().nullable(),
  address: requiredString,
  provinsi_id: z.number().int().positive("Provinsi harus dipilih"),
  kota_id: z.number().int().positive("Kota/Kabupaten harus dipilih"),
  kecamatan_id: z.number().int().positive("Kecamatan harus dipilih"),
  kelurahan_id: z.number().int().positive("Kelurahan/Desa harus dipilih"),
  kode_pos: z.string().regex(/^\d{5}$/, "Kode pos harus 5 digit angka"),
  daerah_sambung_id: z.number().int().positive("Daerah sambung harus dipilih")
});

// Pengurus form validations
export const pengurusFormSchema = z.object({
  name: requiredString,
  phone: phoneSchema.optional().nullable(),
  jabatan: z.enum([
    "ketua_pondok", 
    "wakil_ketua_pondok", 
    "pinisepuh_pondok", 
    "bendahara", 
    "sekretaris", 
    "guru_pondok"
  ], {
    errorMap: () => ({ message: "Jabatan harus dipilih" })
  })
});

// Periode form validations
export const periodeFormSchema = z.object({
  year: z.number().int().min(2020).max(2100),
  month: z.number().int().min(1).max(12),
  rab_start: z.string(),
  rab_end: z.string(),
  lpj_start: z.string(),
  lpj_end: z.string()
}).refine(data => {
  const rabStart = new Date(data.rab_start);
  const rabEnd = new Date(data.rab_end);
  return rabEnd > rabStart;
}, {
  message: "Tanggal akhir RAB harus setelah tanggal mulai",
  path: ["rab_end"]
}).refine(data => {
  const lpjStart = new Date(data.lpj_start);
  const lpjEnd = new Date(data.lpj_end);
  return lpjEnd > lpjStart;
}, {
  message: "Tanggal akhir LPJ harus setelah tanggal mulai",
  path: ["lpj_end"]
});

// RAB form validations
export const rabFormSchema = z.object({
  saldo_awal: z.number().nonnegative("Saldo awal tidak boleh negatif"),
  total_pemasukan: z.number().nonnegative("Total pemasukan tidak boleh negatif"),
  total_pengeluaran: z.number().nonnegative("Total pengeluaran tidak boleh negatif"),
  bukti_url: z.string().optional().nullable()
});

export const rabItemFormSchema = z.object({
  kategori: requiredString,
  deskripsi: requiredString,
  jumlah: z.number().nonnegative("Jumlah tidak boleh negatif")
});

export const rabRevisionFormSchema = z.object({
  pesan_revisi: requiredString
});

// LPJ form validations
export const lpjFormSchema = z.object({
  saldo_awal: z.number().nonnegative("Saldo awal tidak boleh negatif"),
  total_pemasukan: z.number().nonnegative("Total pemasukan tidak boleh negatif"),
  total_pengeluaran: z.number().nonnegative("Total pengeluaran tidak boleh negatif"),
  sisa_saldo: z.number(),
  bukti_url: z.string().optional().nullable()
});

export const lpjItemFormSchema = z.object({
  kategori: requiredString,
  deskripsi: requiredString,
  anggaran: z.number().nonnegative("Anggaran tidak boleh negatif"),
  realisasi: z.number().nonnegative("Realisasi tidak boleh negatif")
});

export const lpjRevisionFormSchema = z.object({
  pesan_revisi: requiredString
});
