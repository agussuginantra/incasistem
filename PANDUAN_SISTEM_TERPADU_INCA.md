# PANDUAN PENGGUNAAN SISTEM TERPADU INCA
## INCA PILATES & MINDFUL MOVEMENT (WEBSITE ADMIN STUDIO & FINANCE)

---

## 📋 Ringkasan Sistem Terpadu & Integrasi Excel

Sistem ini menggabungkan seluruh operasional dan akuntansi studio **INCA Pilates & Mindful Movement** ke dalam **SATU WEBSITE TERPADU** di dalam folder `INCA Sistem`.

Modul **Admin Studio** kini telah terintegrasi penuh dengan dataset asli dari berkas **`INCA_PILATES_Administrasi_Member_dan_Paket.xlsx`** / **`Data_Admin_Studio_INCA.xlsx`**:
- **166 Member Aktif** (kode unik `INC001` s/d `INC166`, kontak WhatsApp, email, tanggal lahir, domisili Depok/Grand Dahlia, dll).
- **230 Transaksi Pembelian Paket** (kode transaksi `ID001` s/d `ID230`, sesi terpakai, sisa sesi, harga total, metode transfer/lunas).
- **230 Log Presensi Absensi Kelas** (sesi Reformer, Cadillac, Tower, Chair, Yoga Wheel, Mat dengan status Hadir dan No Show).
- **65 Jadwal Sesi Kelas** (sesi terploting otomatis dari riwayat kelas 14 Okt s/d 07 Nov 2026).
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
  - `Presensi Kelas`: Jumlah total riwayat absensi kelas studio (`230 Presensi Kelas`).
- **Tombol Pengalih Ruang Kerja**:
  - `[ 📋 Admin Studio ]`: Menuju ruang kerja operasional studio.
  - `[ 💼 INCA Finance ]`: Menuju ruang kerja akuntansi dan pembukuan studio.

---

## 🏢 Bagian 1: Alur Kerja Admin Studio (9 Menu Operasional)

### 1. 📅 Dashboard & Kalender Bulanan (Halaman Utama Saat Buka)
- **Halaman Pembuka Standar**: Saat website pertama kali dibuka, layar langsung menampilkan **Dashboard Singkat & Kalender Bulanan Interaktif** tanpa perlu mengklik menu terlebih dahulu.
- **Ringkasan Operasional Cepat (4 Indikator Utama)**:
  - `Total Member`: **166 Member**
  - `Paket Terjual`: **230 Transaksi Pembelian**
  - `Sesi Terjadwal`: **65 Sesi Kelas**
  - `Check-In Hadir`: **230 Presensi Selesai**
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
- **Data Excel**: Memuat 166 member dari lembar kerja `DATA MEMBER` (`INC001` - `INC166`).
- **Data Lengkap**: Kode Member, Nama Lengkap, Nomor WhatsApp (tautan direct chat WhatsApp), Alamat Email, Tanggal Lahir, Domisili (Depok, Permata Depok Regency, Grand Dahlia, dsb.), Paket Terakhir, Sisa Kuota Sesi, dan Catatan Medis/Postur.
- **Aksi Cepat**:
  - Tombol `+ Tambah Member Baru`.
  - Pencarian instan berdasarkan nama, kode member, alamat, atau nomor WhatsApp.
  - Tombol `Beli Paket`: Langsung mendaftarkan paket baru untuk member yang dipilih.
  - Tombol `Ubah (Edit)` dan `Hapus (Delete)`.

### 3. 🛒 Pendaftaran Pembelian Paket Member
- **Data Excel**: Memuat 230 transaksi pembelian paket dari lembar kerja `PEMBELIAN PAKET` (`ID001` - `ID230`).
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
  2. **Log Seluruh Absensi (230 Sesi dari Excel)**: Menampilkan seluruh 230 baris data kehadiran historis dari lembar kerja `ABSENSI KELAS` lengkap dengan filter Coach (Coach Yuli, Febri, Icha, Kaifa), filter Status (Hadir, No Show potong sesi), dan kotak pencarian member.

### 8. 🎯 Leads Penawaran (Sheet1 Excel)
- **Database 250 Calon Member**: Diambil langsung dari lembar `Sheet1` Excel penawaran.
- **Tautan WhatsApp**: Klik nomor telepon langsung membuka obrolan WhatsApp calon member.
- **Konversi 1-Klik**: Tombol `+ Jadikan Member` langsung mengisi formulir pendaftaran member baru dengan nama, nomor telepon, dan sumber penawaran prospek.

### 9. 📊 Master Excel & Backup Data
- **Unduh Master Excel Studio (`.xlsx`)**: Ekspor data live studio (Members, Purchases, Attendances, Packages, Schedules, Leads, Dashboard) langsung ke berkas Excel `Data_Admin_Studio_INCA.xlsx` menggunakan library SheetJS.
- **Unggah / Sinkronisasi Berkas Excel (`.xlsx`)**: Dilengkapi **Mesin Sinkronisasi Cerdas (*Intelligent Sync Engine*)** dengan deteksi otomatis Full Sync vs Incremental:
  - 🟢 **Mode Sinkronisasi Penuh (Mirror Excel)**: Jika berkas Excel menampilkan semua data, sistem akan menyesuaikan 100% persis dengan Excel. **Data yang dihapus dari Excel otomatis ikut dihapus dari sistem!**
  - 🔵 **Mode Tambah Data Terakhir (Incremental Append)**: Jika berkas Excel hanya berisi data penambahan terbaru (misalnya beberapa baris member/transaksi baru), data lama di sistem **tetap aman dipertahankan** dan data baru ditambahkan langsung ke sistem.
  - 🔍 **Pratinjau & Konfirmasi Interaktif**: Saat file diunggah atau di-*drag & drop*, sistem menampilkan jendela modal rekapitulasi data: jumlah data baru (+), data diperbarui (~), dan rincian data yang dihapus (-). Pengguna dapat memilih mode dan meninjau daftar sebelum menerapkan ke sistem.
- **Cadangan Lengkap JSON**: Unduh dan pulihkan data format JSON.
- **Reset ke Master Excel Otentik**: Mengembalikan database ke 166 member, 230 transaksi paket, dan 230 absensi otentik kapan saja.

---

### 🔍 Fitur Baru: Searchable Dropdown (Ketik Langsung Mencari Data)
Seluruh input pilihan data yang menggunakan menu pilihan (*dropdown*) di **Modul Admin Studio** kini telah ditingkatkan menjadi **Combobox Pencarian Cerdas**:
1. **Ketik untuk Mencari Langsung**: Pengguna tidak perlu lagi menggulir (*scroll*) ratusan daftar nama atau sesi yang panjang. Cukup ketik beberapa huruf nama member, kode member (`INC...`), nomor telepon, nama paket, coach, atau kelas, data yang cocok langsung tersaring secara *real-time*.
2. **Pewarnaan Kata Kunci (*Highlighting*)**: Huruf atau kata yang cocok otomatis diberi penanda warna kuning terang untuk memudahkan penelusuran visual.
3. **Navigasi Keyboard Cepat**: Pengguna dapat menggunakan tombol panah atas/bawah `↑` `↓` pada keyboard untuk berpindah opsi dan menekan `Enter` untuk memilih.
4. **Tombol Hapus Instan `[ ✕ ]`**: Menghapus teks pencarian dengan satu klik untuk mencari data lain dengan cepat.
5. **Cakupan Lengkap ke 15 Input Data**:
   - Pendaftaran Pembelian Paket: Cari Member (`ppmMemberId`), Cari Paket (`ppmPackageId`), Metode Pembayaran (`ppmPaymentMethod`).
   - Ploting Sesi Jadwal: Cari Jenis Kelas (`smClassId`), Cari Coach Pengajar (`smCoachId`).
   - Tambah Peserta Kelas: Cari Member dari 166+ database (`enrollMemberSelect`) lengkap dengan sisa kuota sesi.
   - Presensi & Check-In: Cari Sesi Kelas dari puluhan jadwal aktif (`checkinScheduleSelect`).
   - Data Master: Status Keaktifan Member (`mmStatus`), Kategori Paket (`pmCategory`), Kategori Kelas (`cmCategory`), Level Kelas (`cmLevel`).
   - Filter Pencarian Toolbar: Filter Coach Kalender (`calendarFilterCoach`), Filter Kelas Kalender (`calendarFilterClass`), Filter Coach Presensi (`filterAttendanceCoach`), Filter Status Presensi (`filterAttendanceStatus`).

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

---

## 🛠️ Catatan Pembaruan & Koreksi Data Terakhir (November 2026)

1. **Perbaikan Tampilan "Jumlah Mutasi" (Menghilangkan `RpNaN`)**:
   - Kartu metrik "Jumlah Mutasi" pada modul **Petty Cash Admin** dan **Buku Besar** kini secara pintar mengenali nilai teks hitungan (seperti `21 Catatan` atau `109 Baris`) dan tidak lagi memaksa format mata uang `money()` ke teks non-numerik, sehingga nilai **`RpNaN`** telah diperbaiki 100%.

2. **Perbaikan Pergeseran Tanggal Impor Excel (*Timezone Shift Protection*)**:
   - Ditemukan akar masalah pergeseran tanggal saat impor Excel: fungsi pembaca tanggal sebelumnya menggunakan konversi `.toISOString()` dari waktu lokal (WIB UTC+7) sehingga jam 00:00:00 tanggal 31 terpotong menjadi pukul 17:00:00 tanggal 30 (bergeser mundur 1 hari).
   - Telah diimplementasikan mesin parser `parseExcelDate()` anti-timezone drift yang membaca nomor serial Excel (`46326`), format teks (`31 Oct 2026`, `31/10/2026`, `31-Oct-26`), maupun objek Date secara aman menggunakan komponen UTC/komponen tanggal murni tanpa pemotongan zona waktu.
   - **6 transaksi pada tanggal 31 Oktober 2026** di Buku Besar (Sheet `OKT'26`) telah dipulihkan secara otomatis dan tampil sempurna dengan saldo akhir kas & bank tepat **Rp 17.518.721**.
   - Seluruh impor Excel berikutnya (Buku Besar, Petty Cash, maupun Transaksi Jurnal) terlindungi 100% dari pergeseran tanggal.

3. **Modul Telaah Eksekutif Laba Rugi & Rekomendasi Bisnis (Menu Ringkasan & Laporan)**:
   - Menambahkan panel cerdas **"Analisis Kinerja Laba / Rugi & Rekomendasi Bisnis"** di menu **Ringkasan** dan **Laporan**.
   - **Status Hero Finansial Dinamis**: Otomatis mendeteksi surplus laba bersih (+Rp 18.302.674 pada Oktober 2026 dengan margin 74,5%) atau defisit masa pra-operasional setup (kumulatif Juli–September).
   - **Narasi Penyebab Laba / Rugi**: Mengupas faktor utama keberhasilan (keberhasilan promo soft opening Rp 99k/trial, marjin kotor merchandise >40%, dan kapitalisasi aset modal ruko & alat) maupun faktor defisit masa setup ruko.
   - **Peringkat Kontribusi Beban Terbesar**: Menampilkan bar visual proporsi beban terbesar (Beban lainnya 37%, konsumsi & rapat 31,8%, listrik AC 16%, dll) lengkap dengan catatan evaluasi.
   - **5 Rekomendasi Improvement Konkret**: Memberikan strategi praktis manajemen studio (retensi trial member lewat follow-up WhatsApp, peningkatan kuota okupansi group reformer dari 3-4 menjadi 5-6 orang/sesi, SOP efisiensi pendingin AC, batas pagu kas kecil, dan upselling merchandise).

4. **Format Laporan Eksekutif PDF & Tabel Akuntansi Resmi (Menu Laporan)**:
   - **Header Dokumen Eksekutif Berlogo**: Ditambahkan *letterhead* resmi berlogo INCA Pilates, judul *LAPORAN KEUANGAN EKSEKUTIF*, label *Dokumen Resmi Owner*, periode dinamis, tanggal dokumen, dan status verifikasi pembukuan.
   - **Laporan Laba Rugi Berbentuk Tabel Akuntansi**: Format susunan pendapatan dan beban dirombak dari deretan kartu menjadi format tabel akuntansi standar dengan kolom *Kode Akun*, *Pos Finansial / Keterangan*, dan *Jumlah (Rp)*, dilengkapi subtotal pendapatan, subtotal beban, dan laba bersih operasional berlatar hijau/merah.
   - **Laporan Posisi Keuangan (Neraca) Berbentuk Tabel**: Format neraca disinkronkan menjadi tabel akuntansi dengan rincian Aset Studio dan Liabilitas & Ekuitas Owner serta status neraca seimbang.
   - **Cetak PDF Eksekutif Ringkas & Rapi**: Fitur cetak PDF (`window.print()`) otomatis **menyembunyikan Neraca Saldo** (hanya menyertakan Header Resmi, Tabel Laba Rugi, Tabel Neraca, Telaah Rekomendasi Bisnis, dan Blok Pengesahan Tanda Tangan Owner & Admin). Seluruh tombol, bilah samping, dan bilah atas otomatis disembunyikan saat dicetak sehingga dokumen PDF siap dipresentasikan kepada direksi/owner.
   - Dokumen contoh PDF resmi telah dihasilkan dan tersimpan di folder `dokumen/Laporan_Keuangan_Eksekutif_INCA_Pilates.pdf`.

5. **Modul Cerdas Proyeksi Finansial, Analisis BEP & Alokasi Dividen Owner (Menu Proyeksi & BEP)**:
   - **Analisis Titik Impas Operasional Bulanan (*Monthly Operational BEP*)**: Menghitung ambang batas omzet minimal (Rp 10.024.687/bln) dan kuota peserta (88 sesi/bulan atau cukup ~3,4 peserta/hari) agar studio tidak nombok biaya ruko. Realisasi omzet saat ini (Rp 24,5jt) terbukti 245% di atas ambang batas BEP.
   - **Proyeksi BEP Balik Modal Investasi (*Investment Payback Period*)**: Menghitung estimasi balik modal penuh atas total investasi 3 Owner (Rp 437.004.318) berdasarkan 3 skenario: Konservatif (3,5 tahun), Moderat/Tren Berjalan (2,0 tahun / 23,9 bulan), dan Optimis (1,5 tahun / 17,5 bulan).
   - **Kalkulator Interaktif Dividen 3 Owner & Laba Ditahan (*Interactive Retained Earnings Slider*)**: Fitur slider interaktif (0%–80%) dan tombol preset (20%, 35%, 50%) untuk membagi laba bersih secara tertib antara cadangan kas studio bulan depan (*laba ditahan*) dan dividen tunai yang dibagi rata proporsional 33,33% ke masing-masing owner (Indah, Camelia, Nanda).
   - **Rekomendasi Struktur Harga Paket (*Pricing Sweet-Spot*)**: Tabel benchmark harga 7 varian kelas (Trial, Single Drop-in, Paket 3x, 6x, 10x Best Seller, 20x Loyalty, dan Private Cadillac) terhadap pasaran studio pilates kompetitor dengan kalkulasi HPP dan marjin kotor aman (>50%–70%).
   - **Skor Kelayakan Proyek (*Project Feasibility Score*)**: Evaluasi kesehatan bisnis studio dengan skor **88/100 (Sangat Layak)** berdasarkan struktur modal bebas utang, sewa ruko 3 tahun lunas, validasi minat pasar, dan kapasitas ekspansi grup reformer.
   - **Kalkulasi Selalu Up-to-Date**: Seluruh rumus disinkronkan secara *real-time* ke dataset transaksi jurnal buku besar tanpa perlu input manual ulang.

6. **Fitur Pencarian Dropdown Cerdas (*Searchable Dropdown Select*)**:
   - Seluruh elemen pemilihan dropdown di Modul Admin Studio telah diupgrade menjadi komponen *searchable select* interaktif dengan kotak ketik pencarian cepat (*instant text filter*).
   - Admin tidak perlu lagi menggulir (*scrolling*) daftar panjang data member, varian paket, kategori kelas, atau nama coach; cukup ketik 1-2 huruf awal dan sistem akan langsung memfilter opsi yang cocok secara instan.
   - Diimplementasikan pada 8 form utama: Input Transaksi Pembelian Member & Paket, Ploting Jadwal Kelas, Presensi Check-In Kehadiran, Pendaftaran Member ke Sesi (*Enrollment*), Filter Agenda Kalender, dan Master Data Kelas/Coach.

7. **Sinkronisasi Cerdas Excel Dua Arah (*Smart Excel Sync*)**:
   - Mendukung dua mode pembaruan saat file Excel diunggah:
     * **Mode Cermin Penuh (*Full Mirror Synchronization*)**: Jika file Excel menampilkan seluruh data historis studio, sistem otomatis membandingkan data sistem vs data Excel. Jika ada baris data member, paket, atau jadwal yang dihapus dari Excel, sistem secara otomatis akan menghapus data tersebut di sistem agar 100% identik dan bebas residu usang.
     * **Mode Penambahan Inkremental (*Incremental Append Mode*)**: Jika file Excel hanya berisi data transaksi terbaru / data tambahan, sistem langsung mendeteksi ID baru dan menambahkannya ke sistem tanpa mengubah data sebelumnya.
   - Dilengkapi modal dialog konfirmasi pra-impor yang menampilkan ringkasan jumlah data baru, data yang diperbarui, dan data yang akan dihapus sebelum perubahan diterapkan ke penyimpanan lokal.

8. **Kebijakan Kapasitas Kelas Maksimal 4 Peserta (*Strict 4-Participant Capacity Limit*)**:
   - Seluruh 8 jenis kelas pada Master Data Kelas (Reformer Core, Reformer Full Body, Cadillac Spine, Tower Alignment, Chair Balance, Mat & Props, Private 1-on-1, Semi-Private Duet) telah disetel memiliki kapasitas standar **maksimal 4 peserta** (`defaultCapacity: 4`).
   - Form Tambah / Ubah Kelas (`#classModal`) dan Ploting Sesi Jadwal (`#scheduleModal`) mengunci batas kapasitas dengan `min="1" max="4" value="4"` dan validasi keamanan berlapis `Math.min(4, Math.max(1, capacity))` sehingga tidak ada sesi latihan yang dapat melebihi kuota 4 orang.
   - Tabel Master Kelas kini menampilkan keterangan jelas: `4 Peserta (Maks. 4)`.

9. **Portal Gerbang Login (*Login Gate Screen*) & Modul Manajemen Pengguna RBAC (Tab 10)**:
   - **Portal Login Terpadu Sebelum Masuk Dashboard**: Sebelum pengguna dapat mengakses tampilan dashboard, sistem menampilkan layar gerbang login layar penuh (*Login Gate Portal*) berlatar tema mewah INCA Pilates dengan logo, form input username & password, tombol intip kata sandi, opsi *"Ingat Saya di Perangkat Ini"*, serta tombol *pills* sekali-klik untuk akun demo resmi.
   - **Menu Tab 10 Admin Studio: Kelola Pengguna & Hak Akses**:
     * Menampilkan 5 kartu ringkasan metrik pengguna (Total Akun, Owner, Admin Studio, Keuangan, Coach).
     * Kotak pencarian pengguna (nama, username, telepon) dan filter peran (*role filter*).
     * Tabel pengguna lengkap dengan inisial avatar, status akun aktif/nonaktif, tanggal terdaftar, tag hak akses, dan tombol aksi (Edit Hak Akses, Reset Password, Toggle Aktif, Hapus Pengguna).
   - **Matriks Hak Akses Terperinci (21 Granular Permissions)**:
     * Modal Form `#userModal` menyediakan kontrol granular untuk menentukan menu apa saja yang boleh dibuka oleh setiap pengguna.
     * **10 Menu Admin Studio**: (1) Dashboard & Kalender, (2) Database Member, (3) Transaksi Pembelian, (4) Master Tarif Paket, (5) Master Jenis Kelas, (6) Master Instruktur Coach, (7) Presensi Check-In, (8) Leads Prospek, (9) Master Excel & Backup, (10) Kelola Akun & Akses.
     * **11 Menu INCA Finance**: (F-1) Ringkasan Keuangan, (F-2) Jurnal Transaksi, (F-3) Kas & Bank, (F-4) Buku Besar, (F-5) Kas Kecil Admin, (F-6) Laporan Laba Rugi & Neraca, (F-7) Proyeksi BEP & Dividen, (F-8) Modal Owner, (F-9) Bagan Akun COA, (F-10) Catatan Sumber Data, (F-11) Cadangan Data.
   - **4 Peran Bawaan Sistem (*Out-of-the-Box Accounts*)**:
     * `owner` / `123456`: **Super Admin / Owner** — Akses penuh ke seluruh 21 menu (10 Studio + 11 Finance).
     * `admin` / `admin123`: **Admin Studio (Operasional)** — Akses ke seluruh 10 menu Admin Studio + Kas Kecil Petty Cash.
     * `finance` / `finance123`: **Admin Keuangan (Finance)** — Akses ke seluruh 11 menu INCA Finance + Database Member dan Transaksi Pembelian.
     * `coach` / `coach123`: **Instruktur / Coach** — Akses terbatas khusus agenda kalender kelas dan presensi check-in murid (seluruh menu lain dan finance disembunyikan otomatis).
   - **Header Profil Pengguna & Logout**:
     * Bilah atas menampilkan nama staf yang sedang aktif login, badge peran berwarna, inisial avatar, serta tombol **`[Keluar / Logout]`** untuk mengunci kembali sistem ke gerbang login.

Sistem siap digunakan untuk operasional harian studio dan pembukuan keuangan yang akurat, cepat, aman, dan 100% offline!

---

*Dirancang khusus untuk Studio Pilates, Yoga & Kebugaran Mandiri. Beroperasi 100% Offline.*  
**Trademark PUTI™**  
*Copyright © 2026*
