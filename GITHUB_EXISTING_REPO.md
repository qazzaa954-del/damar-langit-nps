# Menghubungkan ke Repository GitHub yang Sudah Ada

## ✅ Langkah 1: Tambahkan Remote Repository

Jalankan command berikut (ganti dengan URL repository GitHub Anda):

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

**Contoh:**
```bash
git remote add origin https://github.com/username/ham-app.git
```

**Atau jika menggunakan SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
```

## ✅ Langkah 2: Cek Remote

Verifikasi remote sudah terhubung:
```bash
git remote -v
```

Output seharusnya menampilkan URL repository Anda.

## ✅ Langkah 3: Pull dulu (jika ada file di GitHub)

Jika repository GitHub sudah ada file, pull dulu untuk menghindari konflik:

```bash
git pull origin main --allow-unrelated-histories
```

Atau jika branch di GitHub menggunakan nama lain (misal `master`):
```bash
git pull origin master --allow-unrelated-histories
```

## ✅ Langkah 4: Push ke GitHub

Setelah itu, push semua file:

```bash
git push -u origin main
```

Jika branch di GitHub menggunakan nama `master`:
```bash
git push -u origin main:master
```

## ⚠️ Jika Ada Konflik

Jika ada konflik saat pull, Anda bisa:

**Opsi 1: Force Push (HATI-HATI - akan overwrite semua di GitHub)**
```bash
git push -u origin main --force
```

**Opsi 2: Merge Manual**
- Resolve konflik di file yang bermasalah
- Lalu commit dan push

## 📝 Catatan Penting

- **--allow-unrelated-histories**: Diperlukan jika repository lokal dan GitHub memiliki history yang berbeda
- **--force**: Hanya gunakan jika Anda yakin ingin mengganti semua file di GitHub dengan file lokal
- Jika diminta **username/password**, gunakan Personal Access Token (bukan password GitHub)

