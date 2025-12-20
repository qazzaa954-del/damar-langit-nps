# Panduan Update di Vercel

## ✅ Status Auto-Deploy

Jika Vercel sudah terhubung dengan repository GitHub Anda, **Vercel akan otomatis deploy** setiap kali ada push ke branch `main`.

Dari push terakhir yang sudah dilakukan, Vercel seharusnya sudah otomatis memulai proses deploy.

## 🔍 Cara Cek Status Deploy di Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Login dengan akun Anda
3. Pilih project **damar-langit-nps**
4. Lihat tab **"Deployments"** untuk melihat status deploy terbaru

## ⚡ Manual Trigger Deploy (Jika Perlu)

Jika auto-deploy tidak berjalan, Anda bisa trigger manual:

### Opsi 1: Via Vercel Dashboard
1. Buka project di Vercel Dashboard
2. Klik tombol **"Redeploy"** atau **"Deploy"**
3. Pilih branch `main` dan klik **"Deploy"**

### Opsi 2: Via Vercel CLI
```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

### Opsi 3: Push Empty Commit (Trigger Auto-Deploy)
```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

## 🔗 Link Aplikasi

Aplikasi Anda seharusnya tersedia di:
- **Production**: https://damar-langit-nps.vercel.app
- **Admin Dashboard**: https://damar-langit-nps.vercel.app/admin

## 📋 Checklist Verifikasi

- [ ] Cek Vercel Dashboard untuk melihat deploy terbaru
- [ ] Pastikan status deploy adalah "Ready" (hijau)
- [ ] Test aplikasi di production URL
- [ ] Test fitur multi-outlet dengan barcode
- [ ] Test admin dashboard dengan tabs

## ⚠️ Troubleshooting

### Jika Deploy Gagal:
1. Cek **Build Logs** di Vercel Dashboard
2. Pastikan environment variables sudah di-set di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Pastikan semua dependencies terinstall dengan benar

### Cara Set Environment Variables di Vercel:
1. Buka project di Vercel Dashboard
2. Pilih **Settings** → **Environment Variables**
3. Tambahkan variable yang diperlukan
4. Redeploy aplikasi

## 🎯 Fitur yang Harus Ter-deploy

Setelah deploy berhasil, pastikan fitur berikut berfungsi:
- ✅ Home page dengan deteksi barcode dari URL
- ✅ 5 outlet dengan barcode berbeda
- ✅ Admin dashboard dengan tabs per outlet
- ✅ Tabel sortable di admin dashboard
- ✅ Filter berdasarkan outlet dan score

