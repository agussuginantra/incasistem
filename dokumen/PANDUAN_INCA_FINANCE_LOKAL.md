# PANDUAN PENGGUNAAN INCA FINANCE - WEBSITE LOKAL

Website **INCA Finance** (`https://incafinance.ttiswidya.chatgpt.site/`) telah diubah menjadi **website lokal** mandiri yang tersimpan di PC/Laptop Anda.

Tidak ada file executable (.exe), tidak memerlukan instalasi aplikasi, dan tidak membutuhkan koneksi internet.

---

## 🌐 Cara Membuka Website Lokal

Anda dapat membuka website ini dengan cara yang sangat mudah:

### Cara 1: Langsung Buka File HTML (Paling Sederhana)
1. Buka folder [**`IncaFinance`**](file:///d:/OneDrive%20-%20PT.%20Indonesia%20Comnets%20Plus/Folder%20Latihan%20AI/IncaFinance).
2. Klik ganda (**double-click**) pada file:
   ```text
   index.html
   ```
3. Website INCA Finance akan langsung terbuka di peramban (browser) favorit Anda (Google Chrome, Microsoft Edge, Firefox, dll.).

---

### Cara 2: Klik File Batch Cepat
Di folder utama, Anda cukup klik ganda file:
```text
Buka_IncaFinance.bat
```
File ini akan otomatis memerintahkan peramban bawaan Windows Anda untuk membuka website INCA Finance lokal.

---

### Cara 3: Buat Shortcut di Desktop (1-Klik dari Layar Depan)
1. Klik ganda file:
   ```text
   Buat_Shortcut_Desktop.bat
   ```
2. Shortcut bernama **INCA Finance** akan muncul di Desktop komputer Anda. Setiap kali diklik, website langsung terbuka di browser.

---

## 🔒 Privasi & Keamanan (Hanya Bisa Diakses di PC/Laptop Ini)

- **Penyimpanan Lokal**: Seluruh data transaksi, mutasi kas, dan pembukuan tersimpan di penyimpanan lokal (*Local Storage*) peramban di PC/Laptop ini saja.
- **Tidak Terkoneksi ke Internet**: Tidak ada data yang dikirim ke server luar atau internet.
- **Tidak Dapat Diakses Komputer Lain**: Karena berkas berada di media penyimpanan lokal (`file:///`), perangkat lain di jaringan Wi-Fi/kantor sama sekali tidak memiliki akses ke halaman pembukuan Anda.
- **100% Offline**: Tipografi/font (*DM Sans* & *Manrope*), gaya visual, logika akuntansi, dan berkas data telah terintegrasi di folder lokal, sehingga tetap berjalan lancar saat laptop tidak terhubung ke internet.

---

## 📁 Struktur Berkas Website

```text
Folder Latihan AI/
├── IncaFinance/                  <-- Direktori Website Lokal
│   ├── index.html                <-- Buka file ini untuk membuka website
│   ├── style.css                 <-- File stylesheet & desain visual
│   ├── app.js                    <-- Logika pembukuan, transaksi & neraca
│   ├── lpj.js                    <-- Modul pembuka data LPJ
│   ├── lpj-data.js               <-- Data LPJ terenkripsi (format skrip lokal)
│   ├── lpj.enc.json              <-- Salinan cadangan basis data terenkripsi
│   ├── favicon.svg               <-- Ikon website
│   └── fonts/                    <-- Font lokal (DM Sans & Manrope)
│
├── Buka_IncaFinance.bat          <-- Tombol cepat pembuka website
├── Buat_Shortcut_Desktop.bat     <-- Pembuat shortcut website di Desktop
└── PANDUAN_INCA_FINANCE_LOKAL.md <-- Panduan penggunaan ini
```

---

## 💡 Fitur-Fitur Utama di Website

1. **Ringkasan Keuangan**: Saldo kas & bank, pendapatan, beban operasional, dan laba rugi.
2. **Catat Transaksi**: Form pencatatan jurnal umum dengan akun debit dan kredit seimbang.
3. **Buku Besar & Neraca**: Laporan laba rugi, neraca, dan neraca saldo otomatis.
4. **Modal Owner**: Pelacakan setoran modal masing-masing owner (Indah, Nanda, Camelia).
5. **Data & Backup**:
   - **Unduh backup JSON**: Simpan berkas cadangan data keuangan ke disk.
   - **Ekspor CSV**: Ekspor transaksi agar dapat dibuka di Microsoft Excel.
   - **Pulihkan backup JSON**: Memulihkan data dari berkas cadangan.
6. **Buka Dashboard Terenkripsi (LPJ)**: Masukkan kode akses LPJ Anda untuk membuka rincian data awal studio.
