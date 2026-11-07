@echo off
title Membuat Shortcut Desktop Sistem Terpadu INCA
cd /d "%~dp0"

echo ===================================================================
echo       MEMBUAT SHORTCUT DESKTOP SISTEM TERPADU INCA (ALL-IN-ONE)
echo ===================================================================
echo.

powershell -NoProfile -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$desktop = [Environment]::GetFolderPath('Desktop'); " ^
  "$s = $ws.CreateShortcut((Join-Path $desktop 'Sistem Terpadu INCA.lnk')); " ^
  "$s.TargetPath = (Join-Path '%~dp0' 'index.html'); " ^
  "$s.WorkingDirectory = '%~dp0'; " ^
  "$s.Description = 'Website Terpadu INCA - Portal Booking, Operasional Studio & Keuangan Finance'; " ^
  "$iconPath = (Join-Path '%~dp0' 'favicon.png'); " ^
  "if (Test-Path $iconPath) { $s.IconLocation = $iconPath; } " ^
  "$s.Save(); " ^
  "Write-Host '[BERHASIL] Shortcut Sistem Terpadu INCA telah dibuat di Desktop Anda!' -ForegroundColor Green"

echo.
pause
