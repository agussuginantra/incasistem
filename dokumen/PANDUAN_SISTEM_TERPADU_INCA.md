# PANDUAN PENGGUNAAN SISTEM TERPADU INCA
## INCA PILATES & MINDFUL MOVEMENT (WEBSITE ADMIN STUDIO & FINANCE)

---

## 📋 Ringkasan Sistem Terpadu & Integrasi Excel

Sistem ini menggabungkan seluruh operasional dan akuntansi studio **INCA Pilates & Mindful Movement** ke dalam **SATU WEBSITE TERPADU** di dalam folder `INCA Sistem`.

Modul **Admin Studio** kini telah terintegrasi penuh dengan dataset asli dari berkas **`INCA_PILATES_Administrasi_Member_dan_Paket.xlsx`** / **`Data_Admin_Studio_INCA.xlsx`**:
- **234 Member Aktif** (kode unik `INC001` s/d `INC236`, kontak WhatsApp, email, tanggal lahir, domisili Depok/Grand Dahlia, dll).
- **279 Transaksi Pembelian Paket** (kode transaksi `ID001` s/d `ID226`, sesi terpakai, sisa sesi, harga total, metode transfer/lunas).
- **222 Log Presensi Absensi Kelas** (sesi Reformer, Cadillac, Tower, Chair, Yoga Wheel, Mat dengan status Hadir dan No Show).
- **18 Paket Tarif Bawaan Studio** (1x, 3x, 6x, 10x, Promo 100 pertama, Triall New Member, Private Cadillac, Group Class, Yoga Wheel).
- **250 Database Leads & Penawaran** (calon prospek dari Sheet1 dengan tautan WhatsApp dan aksi 1-klik konversi jadi member).
- **Modul INCA Finance Tidak Dirubah 100%**: Seluruh pembukuan, buku besar 219 transaksi historis, petty cash, LPJ terenkripsi, dan laporan keuangan tetap utuh, terlindungi, dan dapat diakses setiap saat.

Sistem beroperasi **100% Offline** tanpa memerlukan koneksi internet, tanpa server lokal yang rumit, dan dapat langsung dibuka di peramban (Google Chrome, Microsoft Edge, Mozilla Firefox).

---

## 🚀 Cara Membuka Sistem

Anda dapat membuka sistem terpadu ini dengan salah satu cara berikut:

### Cara 1: Menggunakan File Batch (Rekomendasi Cepat)
Cukup klik ganda (**double-click**) pada file:
```text
Buka_Sistem_INCA.bat
```
Website akan otomatis terbuka di peramban komputer Anda.

### Cara 2: Langsung Buka File HTML
Buka folder `INCA Sistem`, lalu klik ganda file:
```text
index.html
```

### Cara 3: Pasang Shortcut di Desktop Komputer
Klik ganda file:
```text
Buat_Shortcut_Desktop.bat
```
Shortcut bernama **"Sistem Terpadu INCA"** dengan ikon logo studio akan otomatis dibuat di Desktop komputer Anda.

---

## 🎛️ Navigasi Bilah Atas (*Master Header*)

Di bagian paling atas layar (*Master Header*), terdapat:
- **Logo & Status Aktif**: Menampilkan nama modul yang sedang aktif.
- **Statistik Cepat Live**:
  - `Kas & Bank`: Saldo kas & bank real-time dari INCA Finance (`Rp 17.518.721`).
  - `Presensi Kelas`: Jumlah total riwayat absensi kelas studio (`222 Presensi Kelas`).
- **Tombol Pengalih Ruang Kerja**:
  - `[ 📋 Admin Studio ]`: Menuju ruang kerja operasional studio.
  - `[ 💼 INCA Finance ]`: Menuju ruang kerja akuntansi dan pembukuan studio.

---

## 🏢 Bagian 1: Alur Kerja Admin Studio (9 Menu Operasional)

### 1. 📅 Dashboard & Kalender Bulanan (Halaman Utama Saat Buka)
- **Halaman Pembuka Standar**: Saat website pertama kali dibuka, layar langsung menampilkan **Dashboard Singkat & Kalender Bulanan Interaktif** tanpa perlu mengklik menu terlebih dahulu.
- **Ringkasan Operasional Cepat (4 Indikator Utama)**:
  - `Total Member`: **234 Member**
  - `Paket Terjual`: **279 Transaksi Pembelian**
  - `Sesi Terjadwal`: **63 Sesi Kelas**
  - `Check-In Hadir`: **220 Presensi Selesai**
- **Tombol Aksi Cepat**: Akses instan 1-klik untuk `+ Ploting Sesi Baru`, `+ Member Baru`, dan `+ Beli Paket`.
- **Visualisasi Kalender Bulanan Interaktif (Gaya Kalender Laptop / Desktop Grid)**:
  - Format 7 kolom hari (`SENIN`, `SELASA`, `RABU`, `KAMIS`, `JUMAT`, `SABTU`, `MINGGU`).
  - Penanda hari ini otomatis dengan lingkaran warna hijau sage.
  - Kartu sesi kelas terplot rapi di setiap tanggal dengan jam pelaksanaan (`08:00`, `10:00`, `16:00`), nama kelas, coach pengajar, dan rasio kuota peserta (`4/6`, `6/6 Penuh`).
  - **Palet Warna Kelas Studio**:
    - 🟢 *Sage Green*: **Reformer**
    - 🟣 *Purple*: **Cadillac**
    - 🟡 *Amber*: **Tower**
    - 🔵 *Blue*: **Chair**
    - 🔴 *Rose Pink*: **Yoga Wheel**
    - 🟢 *Emerald*: **Mat**
    - 🔵 *Indigo*: **Yoga Props**
    - 🌊 *Teal*: **Yoga**
- **Navigasi & Loncat Periode**:
  - Tombol `<` (Bulan Sebelumnya) dan `>` (Bulan Berikutnya).
  - Tombol `Hari Ini` untuk kembali ke bulan berjalan.
  - Tombol pintas bulan database: `[Okt 2026]` (46 sesi) dan `[Nov 2026]` (17 sesi).
- **Filter Fleksibel**:
  - Filter Coach: Coach Yuli, Coach Febri, Coach Icha, Coach Kaifa.
  - Filter Kelas: Reformer, Cadillac, Tower, Chair, Yoga Wheel, Yoga, Mat, Yoga Props.
- **Modal Interaktif Detail Sesi & Roster Peserta (`scheduleDetailModal`)**:
  - Klik kartu kelas di kalender untuk membuka pop-up daftar member yang terdaftar di sesi tersebut.
  - Menampilkan kontak direct WhatsApp member.
  - Status presensi live (`✓ Hadir` / `Belum Check-in`).
  - Aksi instan: `Check-In`, `Batal Hadir`, dan `+ Daftarkan Peserta ke Sesi Ini`.
- **Pengalih Tampilan**: Tombol pengalih antara mode `📅 Kalender Bulanan` dan `📋 Daftar Tabel`.

### 2. 👥 Pengelolaan Member (Database Member)
- **Data Excel**: Memuat 234 member dari lembar kerja `DATA MEMBER` (`INC001` - `INC236`).
- **Data Lengkap**: Kode Member, Nama Lengkap, Nomor WhatsApp (tautan direct chat WhatsApp), Alamat Email, Tanggal Lahir, Domisili (Depok, Permata Depok Regency, Grand Dahlia, dsb.), Paket Terakhir, Sisa Kuota Sesi, dan Catatan Medis/Postur.
- **Aksi Cepat**:
  - Tombol `+ Tambah Member Baru`.
  - Pencarian instan berdasarkan nama, kode member, alamat, atau nomor WhatsApp.
  - Tombol `Beli Paket`: Langsung mendaftarkan paket baru untuk member yang dipilih.
  - Tombol `Ubah (Edit)` dan `Hapus (Delete)`.

### 3. 🛒 Pendaftaran Pembelian Paket Member
- **Data Excel**: Memuat 279 transaksi pembelian paket dari lembar kerja `PEMBELIAN PAKET` (`ID001` - `ID226`).
- **Kolom Tabel Lengkap**: No. Invoice, Tanggal Beli, Member (ID & Nama), Paket Dipilih, Sesi & Sisa Kuota, Total Nominal (Rp), Metode & Status Bayar (Transfer - Lunas), Status Paket (Aktif / Habis), Status Keuangan.
- **Fitur Auto-Sync Finance**: Saat pembelian baru dicatat, admin dapat mencentang opsi *"Otomatis catat pendapatan ke INCA Finance"* untuk membukukan transaksi kas masuk secara otomatis.

### 4. 🏷️ Tarif Paket Studio
- **Data Excel**: Memuat 18 varian paket dari lembar kerja `TARIF PAKET`:
  - Paket Reguler: 1x (Rp 160.000), 3x (Rp 365.000), 6x (Rp 745.000), 10x (Rp 1.225.000), 4x (Rp 540.000), 8x (Rp 1.044.000).
  - Paket Promo: Promo 100 pertama (Rp 99.000), Triall New Member (Rp 110.000), Triall Nov (Rp 108.000).
  - Kelas Khusus: Yoga Wheel (Rp 100.000), Yoga Props (Rp 100.000), Yoga (Rp 85.000), Mat (Rp 85.000).
  - Private & Group Cadillac: Group Class Cadillac (Rp 325.000), 1x Private Cadillac (Rp 525.000), 3x Private Cadillac (Rp 1.426.000).
- **Pengaturan**: Admin dapat menambah varian paket baru, mengubah tarif promo, atau menonaktifkan paket.

### 5. 🧘 Jenis Kelas Studio (100% Otentik Database Excel)
- **Penamaan Kelas Sesuai Excel**:
  1. **`Reformer`**: 50 Menit · Kapasitas 6 Alat · Rp 160.000
  2. **`Cadillac`**: 55 Menit · Kapasitas 4 Alat · Rp 325.000
  3. **`Tower`**: 50 Menit · Kapasitas 6 Alat · Rp 160.000
  4. **`Chair`**: 50 Menit · Kapasitas 6 Alat · Rp 160.000
  5. **`Yoga Wheel`**: 60 Menit · Kapasitas 8 Alat/Mat · Rp 100.000
  6. **`Yoga`**: 60 Menit · Kapasitas 10 Mat · Rp 85.000
  7. **`Mat`**: 50 Menit · Kapasitas 10 Mat · Rp 85.000
  8. **`Yoga Props`**: 60 Menit · Kapasitas 10 Mat · Rp 100.000
- **Pengelolaan Master Kelas**: Tambah jenis kelas baru, sesuaikan durasi sesi, atur kapasitas maksimal peserta, dan tentukan tarif drop-in.

### 6. 🏆 Daftar Coach & Instruktur
- **Master Coach**:
  - Coach Yuli (Lead Reformer & Cadillac Specialist)
  - Coach Febri (Cadillac & Posture Alignment Specialist)
  - Coach Icha (Pilates Mat, Chair & Reformer)
  - Coach Kaifa (Yoga Wheel & Vinyasa Yoga Specialist)
- **Profil**: Menampilkan kontak instruktur, sertifikasi keahlian, dan rekam jejak mengajar.

### 7. ☑️ Presensi & Check-In Kelas
- **Dua Tampilan Fleksibel**:
  1. **Sesi Terjadwal & Presensi**: Memilih sesi kelas tertentu, melihat daftar member yang terdaftar, melakukan Check-In kedatangan 1-klik, atau mendaftarkan member baru (*potong kuota paket* / *drop-in*).
  2. **Log Seluruh Absensi (222 Sesi dari Excel)**: Menampilkan seluruh 222 baris data kehadiran historis dari lembar kerja `ABSENSI KELAS` lengkap dengan filter Coach (Coach Yuli, Febri, Icha, Kaifa), filter Status (Hadir, No Show potong sesi), dan kotak pencarian member.

### 8. 🎯 Leads Penawaran (Sheet1 Excel)
- **Database 250 Calon Member**: Diambil langsung dari lembar `Sheet1` Excel penawaran.
- **Tautan WhatsApp**: Klik nomor telepon langsung membuka obrolan WhatsApp calon member.
- **Konversi 1-Klik**: Tombol `+ Jadikan Member` langsung mengisi formulir pendaftaran member baru dengan nama, nomor telepon, dan sumber penawaran prospek.

### 9. 📊 Master Excel & Backup Data
- **Unduh Master Excel Studio (`.xlsx`)**: Ekspor data live studio (Members, Purchases, Attendances, Packages, Leads, Dashboard) langsung ke berkas Excel `Data_Admin_Studio_INCA.xlsx` menggunakan library SheetJS.
- **Unggah / Sinkronisasi Berkas Excel (`.xlsx`)**: Membaca file `.xlsx` dari komputer dan menyinkronkan seluruh database studio secara instan.
- **Cadangan Lengkap JSON**: Unduh dan pulihkan data format JSON.
- **Reset ke Master Excel Otentik**: Mengembalikan database ke 234 member, 279 transaksi paket, dan 222 absensi otentik kapan saja.

---

## 💼 Bagian 2: Modul INCA Finance (Terlindungi & Dilengkapi Login Akses)

Modul akuntansi studio kini **dilindungi oleh sistem autentikasi login (Username & Password)** sebelum dapat diakses:

### 🔐 Sistem Login Akses INCA Finance
- **Perlindungan Modul**: Setiap kali staf atau pengguna menekan tombol `[ 💼 INCA Finance ]`, sistem akan secara otomatis memunculkan jendela dialog **Login Akses INCA Finance**. Modul keuangan tidak dapat dilihat sebelum login berhasil.
- **Daftar Akun Pengguna Bawaan (Default Credentials)**:
  - **Akun Finance**: Username: `finance` | Password: `finance123`
  - **Akun Admin**: Username: `admin` | Password: `admin123` (atau sesuai password yang diubah di menu Pengaturan)
  - **Akun Owner**: Username: `owner` | Password: `123456`
- **Fitur Kunci / Logout Kapan Saja**:
  - Tombol **`[ 🔒 Kunci Finance ]`** di bilah atas (*top bar*).
  - Tombol **`[ 🔒 Kunci / Logout ]`** di bagian bawah menu samping (*sidebar* finance).
  - Sekali dikunci, akses ke pembukuan langsung ditutup dan layar otomatis dialihkan kembali ke Dashboard Admin Studio.

### 📊 Fitur Akuntansi yang Tetap Utuh & Mandiri
1. **Ringkasan Finansial**: Posisi kas kecil, rekening bank, pendapatan diterima di muka, dan rekonsiliasi.
2. **Transaksi Jurnal**: 219 transaksi historis lengkap dengan debit dan kredit seimbang.
3. **Kas & Bank**: Rekening operasional BCA, QRIS, dan petty cash.
4. **Buku Besar Terverifikasi**: Seluruh akun 1001 (Kas), 1002 (Bank BCA), 2001 (Utang), 3001 (Modal Owner), 4001 (Pendapatan), 5001-5099 (Beban).
5. **Petty Cash Admin**: Pencatatan kas kecil harian, bukti kuitansi, dan rekonsiliasi sisa saldo.
6. **Laporan Keuangan**: Laba Rugi, Neraca, Perubahan Ekuitas, Arus Kas bulanan dan tahunan.
7. **Dashboard LPJ Terenkripsi**: Pembukaan laporan khusus owner dengan kode keamanan (`123456` / `admin123`).

---

## 💾 Struktur Folder & Berkas yang Rapi (`INCA Sistem`)

Seluruh berkas telah dirapikan secara modular berdasarkan ekstensi dan fungsinya sehingga folder utama bersih dan terstruktur:

```text
INCA Sistem/
├── Buka_Sistem_INCA.bat                            # [1-KLIK] Launcher peramban sistem terpadu
├── Buat_Shortcut_Desktop.bat                       # Pembuat shortcut desktop otomatis
├── index.html                                      # Halaman utama aplikasi website INCA
├── PANDUAN_SISTEM_TERPADU_INCA.md                  # Panduan lengkap penggunaan sistem
│
├── database/                                       # FOLDER DATABASE & SPREADSHEET UTAMA
│   ├── INCA_PILATES_Administrasi_Member_dan_Paket.xlsx # Master Excel data member & paket asli
│   ├── Data_Admin_Studio_INCA.xlsx                 # Database Excel master admin studio
│   ├── Petty_Cash_Admin_INCA.xlsx                  # Database kas kecil operasional
│   ├── LPJ_INCA_Revisi.xlsx                        # Laporan pertanggungjawaban studio
│   ├── PAYROLL INCA PILATES NOVEMBER 2026.xlsx     # Data penggajian instruktur & staf
│   ├── buku_besar_dana_initial.json                # Database saldo awal buku besar
│   ├── verified_journal_entries.json               # 219 entri jurnal historis terverifikasi
│   └── lpj.enc.json                                # Berkas LPJ terenkripsi
│
├── template/                                       # FOLDER TEMPLATE EXCEL
│   ├── Template_Import_Transaksi_INCA.xlsx         # Template standar impor jurnal buku besar
│   └── Template_Petty_Cash_Admin.xlsx              # Template standar impor kas kecil admin
│
├── dokumen/                                        # FOLDER DOKUMENTASI & PANDUAN KERJA
│   ├── PANDUAN_PENGGUNAAN_INCA_STUDIO.docx         # Dokumen panduan Word Admin Studio
│   ├── PANDUAN_PENGGUNAAN_INCA_FINANCE.docx        # Dokumen panduan Word INCA Finance
│   ├── PANDUAN_INCA_FINANCE_LOKAL.md               # Panduan teknis finance lokal
│   ├── PETUNJUK_KODE_AKUN_LPJ.md                   # Kamus kode akun akuntansi
│   └── PANDUAN_SISTEM_TERPADU_INCA.md              # Salinan panduan sistem terpadu
│
├── js/                                             # FOLDER JAVASCRIPT LOGIC & CONTROLLER
│   ├── studio-app.js                               # Controller kalender & admin studio
│   ├── studio-data.js                              # Master dataset inisial studio
│   ├── finance-app.js                              # Controller pembukuan INCA Finance
│   ├── buku-besar-data.js                          # Dataset buku besar live
│   ├── petty-cash-data.js                          # Dataset petty cash live
│   ├── lpj-data.js & lpj.js                        # Controller dashboard LPJ owner
│   └── xlsx.full.min.js                            # Mesin parser SheetJS offline
│
├── css/                                            # FOLDER STYLESHEET DESAIN
│   ├── styles.css                                  # Gaya antarmuka admin studio & kalender
│   └── finance-style.css                           # Gaya antarmuka INCA Finance
│
├── assets/                                         # FOLDER LOGO & GAMBAR
│   ├── logo.png & logo.jpg                         # Logo resmi studio INCA Pilates
│   └── favicon.png & favicon.svg                   # Ikon favicon & ikon shortcut desktop
│
└── fonts/                                          # FOLDER FONT TIPOGRAFI OFFLINE
    ├── dmsans-400.ttf s/d dmsans-700.ttf
    └── manrope-400.ttf s/d manrope-800.ttf
```

> **Catatan Pembersihan**: Folder lama `Aplikasi Sistem Pilates` dan `INCAFinance Sistem` telah dihapus karena kedua sistem telah 100% digabungkan ke dalam sistem terpadu ini. Seluruh berkas berharga (seperti `PAYROLL...xlsx` dan dokumen panduan) telah diamankan ke dalam folder `database/` dan `dokumen/`.

Sistem siap digunakan untuk operasional harian studio dan pembukuan keuangan yang akurat, cepat, dan 100% offline!
