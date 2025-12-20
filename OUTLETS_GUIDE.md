# Panduan Multi-Outlet dengan Barcode

## Daftar Outlet dan Barcode

1. **Damar Langit Resort**
   - Barcode: `DLR001`
   - URL: `/?barcode=DLR001` atau `/?outlet=damar-langit-resort`

2. **Damar Langit Dining**
   - Barcode: `DLD002`
   - URL: `/?barcode=DLD002` atau `/?outlet=damar-langit-dining`

3. **The Kedai**
   - Barcode: `TKD003`
   - URL: `/?barcode=TKD003` atau `/?outlet=the-kedai`

4. **Pakis Raja Coffee**
   - Barcode: `PRC004`
   - URL: `/?barcode=PRC004` atau `/?outlet=pakis-raja-coffee`

5. **Damar Tea & Patisserie**
   - Barcode: `DTP005`
   - URL: `/?barcode=DTP005` atau `/?outlet=damar-tea-patisserie`

## Cara Menggunakan

### Untuk Pengguna (Scan Barcode)
1. Scan barcode dengan QR code scanner
2. Akan langsung mengarah ke halaman feedback dengan outlet yang sesuai
3. Isi feedback dan submit

### Untuk Admin Dashboard
1. Buka `/admin`
2. Pilih tab outlet yang ingin dilihat
3. Klik header kolom untuk sorting (Score, Phone, Feedback, Date, Outlet)
4. Filter berdasarkan score menggunakan tombol filter
5. Data dapat di-print

### Untuk Mendapatkan Barcode/QR Code
1. Buka `/barcodes` atau klik tombol **"Barcode Outlet"** di admin dashboard
2. Halaman akan menampilkan semua QR code untuk 5 outlet
3. Setiap QR code bisa di-download sebagai gambar PNG
4. QR code bisa di-print untuk ditempel di setiap outlet
5. Scan QR code dengan smartphone akan langsung mengarah ke halaman feedback outlet tersebut

## Update Database Schema

Pastikan tabel `nps_submissions` di Supabase memiliki kolom berikut:
- `outlet` (text) - ID outlet
- `outlet_name` (text) - Nama display outlet
- `barcode` (text) - Barcode outlet

### Cara Update Database:

1. Buka Supabase Dashboard → SQL Editor
2. Copy dan paste kode SQL dari file `supabase_migration.sql`
3. Klik "Run" untuk menjalankan script

Atau jalankan SQL berikut secara manual:

```sql
-- Tambahkan kolom-kolom baru
ALTER TABLE nps_submissions 
ADD COLUMN IF NOT EXISTS outlet TEXT,
ADD COLUMN IF NOT EXISTS outlet_name TEXT,
ADD COLUMN IF NOT EXISTS barcode TEXT;

-- Buat index untuk performa query
CREATE INDEX IF NOT EXISTS idx_nps_submissions_outlet ON nps_submissions(outlet);
CREATE INDEX IF NOT EXISTS idx_nps_submissions_barcode ON nps_submissions(barcode);
CREATE INDEX IF NOT EXISTS idx_nps_submissions_created_at ON nps_submissions(created_at DESC);
```

**File SQL lengkap tersedia di:** `supabase_migration.sql`

## Fitur yang Tersedia

✅ 5 Outlet dengan barcode unik
✅ Dashboard admin dengan tabs per outlet
✅ Tabel sortable (klik header untuk sort)
✅ Filter berdasarkan outlet dan score
✅ Print functionality
✅ Grafik tren kepuasan per outlet

