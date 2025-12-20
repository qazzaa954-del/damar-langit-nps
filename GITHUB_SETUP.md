# Instruksi Upload ke GitHub

## ✅ Langkah 1: Buat Repository di GitHub

1. Buka [GitHub.com](https://github.com) dan login
2. Klik tombol **"+"** di kanan atas → **"New repository"**
3. Isi:
   - **Repository name**: `ham-app` (atau nama lain yang Anda inginkan)
   - **Description**: "Multi-outlet NPS System with Barcode Support"
   - Pilih **Public** atau **Private**
   - **JANGAN** centang "Initialize with README" (karena sudah ada)
4. Klik **"Create repository"**

## ✅ Langkah 2: Hubungkan ke GitHub

Setelah repository dibuat, GitHub akan menampilkan instruksi. Jalankan command berikut di terminal:

```bash
# Ganti YOUR_USERNAME dengan username GitHub Anda
# Ganti REPO_NAME dengan nama repository yang Anda buat

git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**Contoh:**
```bash
git remote add origin https://github.com/username/ham-app.git
git branch -M main
git push -u origin main
```

## ✅ Langkah 3: Verifikasi

Setelah push berhasil, refresh halaman repository di GitHub. Semua file Anda seharusnya sudah ter-upload.

## 📝 Catatan

- Jika menggunakan **SSH** (bukan HTTPS), gunakan format:
  ```bash
  git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
  ```

- Jika diminta **username/password**, gunakan:
  - Username: username GitHub Anda
  - Password: **Personal Access Token** (bukan password GitHub)
  - Cara membuat token: GitHub Settings → Developer settings → Personal access tokens → Generate new token

## 🔄 Update di Masa Depan

Setelah setup pertama kali, untuk update berikutnya cukup jalankan:
```bash
git add .
git commit -m "Update: deskripsi perubahan"
git push
```

