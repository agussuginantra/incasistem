@echo off
title Membuka Sistem Terpadu INCA (Admin Studio & Finance)
chcp 65001 >nul
cls
echo ===================================================================
echo               INCA PILATES & MINDFUL MOVEMENT
echo            SISTEM TERPADU WEBSITE STUDIO & FINANCE
echo ===================================================================
echo.
echo [1] Admin Studio:
echo     - Pengelolaan Member
echo     - Pendaftaran Pembelian Paket Member
echo     - Daftar Paket Member
echo     - Daftar Master Kelas
echo     - Daftar Coach / Instruktur
echo     - Jadwal Kelas & Ploting Coach
echo     - Check-In Peserta Kelas
echo.
echo [2] INCA Finance:
echo     - Jurnal Umum Kas & Bank
echo     - Buku Besar (219 Entri Terverifikasi)
echo     - Petty Cash (Kas Kecil Admin)
echo     - Neraca, Laba Rugi, Ekuitas & Rekonsiliasi
echo     - Ekspor/Impor Excel Terpadu
echo.
echo Membuka sistem terpadu di peramban (browser) default Anda...
echo.

start "" "%~dp0index.html"

exit
