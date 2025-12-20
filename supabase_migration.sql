-- ============================================
-- SQL Migration untuk Multi-Outlet System
-- Jalankan script ini di Supabase SQL Editor
-- ============================================

-- 1. Tambahkan kolom-kolom baru untuk outlet
-- (Jika kolom sudah ada, akan di-skip karena menggunakan IF NOT EXISTS)

ALTER TABLE nps_submissions 
ADD COLUMN IF NOT EXISTS outlet TEXT,
ADD COLUMN IF NOT EXISTS outlet_name TEXT,
ADD COLUMN IF NOT EXISTS barcode TEXT;

-- 2. Buat index untuk performa query yang lebih cepat
CREATE INDEX IF NOT EXISTS idx_nps_submissions_outlet ON nps_submissions(outlet);
CREATE INDEX IF NOT EXISTS idx_nps_submissions_barcode ON nps_submissions(barcode);
CREATE INDEX IF NOT EXISTS idx_nps_submissions_created_at ON nps_submissions(created_at DESC);

-- 3. (Opsional) Update data lama dengan outlet default jika ada data existing
-- Uncomment baris di bawah jika ingin set default outlet untuk data lama
-- UPDATE nps_submissions 
-- SET outlet = 'damar-langit-resort',
--     outlet_name = 'Damar Langit Resort',
--     barcode = 'DLR001'
-- WHERE outlet IS NULL;

-- 4. Verifikasi struktur tabel (optional - untuk check)
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'nps_submissions'
-- ORDER BY ordinal_position;

-- ============================================
-- CATATAN:
-- - Script ini aman dijalankan berulang kali
-- - Menggunakan IF NOT EXISTS untuk menghindari error jika kolom sudah ada
-- - Index akan mempercepat query saat filter berdasarkan outlet
-- ============================================

