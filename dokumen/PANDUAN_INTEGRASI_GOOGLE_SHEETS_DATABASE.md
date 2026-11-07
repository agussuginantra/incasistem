# PANDUAN LENGKAP INTEGRASI GOOGLE SHEETS CLOUD DATABASE
## INCA Pilates & Mindful Movement Integrated System

Dokumen ini memandu Anda menghubungkan Sistem INCA ke **Google Drive / Google Sheets (Akun Toko Mas Putu)** sehingga seluruh data studio dan pembukuan tersimpan di cloud secara aman, gratis, dan sangat mudah dicek oleh para Owner kapan saja lewat HP.

---

### A. Berkas yang Sudah Disediakan Sistem

Di dalam folder proyek Anda telah disiapkan dua berkas inti:
1. **`INCA_DATABASE_MASTER_GOOGLE_SHEETS.xlsx`**  
   *(Lokasi: `D:\OneDrive - PT. Indonesia Comnets Plus\Folder Latihan AI\INCA_DATABASE_MASTER_GOOGLE_SHEETS.xlsx`)*  
   Spreadsheet database master yang sudah terisi **10 Sheet Lengkap** dengan seluruh data riwayat aktual:
   - `DB_Member` : 166 Member lengkap dengan WhatsApp dan sisa kuota.
   - `DB_Pembelian` : 230 Invoice transaksi pembelian paket.
   - `DB_Presensi` : 230 Catatan kehadiran & check-in member.
   - `DB_Jadwal` : 65 Sesi agenda jadwal kelas studio.
   - `DB_Kelas` : 8 Apparatus kelas studio (kuota maks 4 orang).
   - `DB_Paket` : 18 Varian paket latihan & harga.
   - `DB_Coach` : 4 Instruktur studio.
   - `DB_Leads` : 250 Data prospek penawaran member.
   - `DB_Keuangan_Jurnal` : 219 Jurnal transaksi umum akuntansi LPJ.
   - `DB_Pengguna` : 4 Akun resmi (`owner`, `admin`, `finance`, `coach`).

2. **`Google_Apps_Script_API.js`**  
   *(Lokasi: `INCA Sistem/database/Google_Apps_Script_API.js`)*  
   Skrip serverless gratis untuk bertindak sebagai jembatan (API) otomatis antara sistem browser dan Google Sheets.

---

### B. Langkah 1: Upload Database ke Google Drive

1. Buka browser dan masuk ke **Google Drive** menggunakan akun Anda (**Toko Mas Putu**).
2. Buat folder baru (opsional), misalnya bernama `INCA Pilates Database`.
3. Unggah (*upload*) berkas **`INCA_DATABASE_MASTER_GOOGLE_SHEETS.xlsx`** ke Google Drive Anda.
4. Klik ganda berkas tersebut untuk membukanya di **Google Sheets**.
5. Pastikan seluruh 10 tab sheet di bagian bawah terbaca dengan benar.

---

### C. Langkah 2: Pasang Google Apps Script API (Hanya 2 Menit)

1. Pada tampilan Google Sheets tersebut, klik menu atas:  
   **Ekstensi (*Extensions*)** > **Apps Script**.
2. Anda akan diarahkan ke editor skrip Google.
3. Hapus seluruh baris kode default yang ada di dalam file `Code.gs`.
4. Buka file **`INCA Sistem/database/Google_Apps_Script_API.js`** di komputer Anda, lalu salin (*copy*) seluruh isinya.
5. Tempel (*paste*) ke dalam editor Google Apps Script tadi.
6. Beri nama proyek di kiri atas (misal: `INCA Database API`).
7. Klik ikon **Simpan / Disket** (`Ctrl + S`).

---

### D. Langkah 3: Deploy sebagai Aplikasi Web (*Web App*)

1. Di pojok kanan atas Google Apps Script, klik tombol biru:  
   **Terapkan (*Deploy*)** > **Penerapan baru (*New deployment*)**.
2. Klik ikon gerigi ⚙️ di samping kiri tulisan *"Pilih jenis"*, lalu pilih **Aplikasi web (*Web app*)**.
3. Atur konfigurasi berikut:
   - **Deskripsi**: `INCA Cloud API v1.0`
   - **Jalankan sebagai (*Execute as*)**: **Saya / Akun saya (*Me*)**
   - **Siapa yang memiliki akses (*Who has access*)**: **Siapa saja (*Anyone*)**  
     *(PENTING: Pilih "Anyone" agar sistem lokal di browser studio dapat menyimpan data secara langsung)*.
4. Klik tombol **Terapkan (*Deploy*)**.
5. Google akan meminta izin akses pertama kali:
   - Klik **Beri akses (*Authorize access*)** > Pilih akun Google Anda.
   - Jika muncul peringatan *"Google hasn't verified this app"*, klik **Lanjutan (*Advanced*)** di kiri bawah > Klik **Buka INCA Database API (tidak aman)**.
   - Klik **Izinkan (*Allow*)**.
6. Setelah selesai, Google akan menampilkan kotak dialog dengan **URL Aplikasi Web (*Web App URL*)** yang berakhiran `/exec`.
   *(Contoh URL: `https://script.google.com/macros/s/AKfycbx.../exec`)*.
7. Klik tombol **Salin (*Copy*)** pada URL tersebut.

---

### E. Langkah 4: Sambungkan ke Sistem INCA

1. Buka file **`index.html`** di browser studio Anda.
2. Di bilah atas (*header*) sebelah tombol modul, klik tombol status:  
   `[🟡 Database: Lokal]`
3. Kotak dialog **"Integrasi Google Sheets Database"** akan muncul.
4. Tempel (*paste*) URL Web App tadi ke dalam kolom **URL Google Apps Script Web App**.
5. Pastikan opsi *"Otomatis kirim data ke Google Sheets saat ada transaksi baru"* tercentang.
6. Klik tombol **[Tes & Simpan]**.
7. Sistem akan menguji koneksi secara instan. Begitu berhasil, status bilah atas akan otomatis berubah menjadi:  
   `[🟢 Cloud DB: Aktif]`

---

### F. Fitur & Keunggulan Sistem yang Diterapkan

* **100% Bebas Biaya**: Menggunakan infrastruktur gratis dari Google Cloud & Google Drive pribadi Anda selamanya.
* **Arsitektur Hybrid (Local-First + Auto Cloud Sync)**:
  - Jika internet studio sedang mati, sistem tetap beroperasi cepat secara normal dan menyimpan data di lokal.
  - Saat internet terhubung, setiap kali Admin menambah member, mencatat pembelian, atau melakukan check-in murid, sistem otomatis mengalirkan data ke Google Sheets di latar belakang (*background sync*).
* **Mudah Dipantau Pemilik Usaha**:
  - Ketiga Owner (Indah, Camelia, Nanda) dapat memasang aplikasi **Google Sheets** di smartphone masing-masing dan melihat update data pendaftaran, presensi, serta arus kas secara *live* di mana pun berada.

---
*Trademark PUTI™ · Copyright © 2026 · INCA Pilates Integrated System*
