/**
 * ============================================================================
 * INCA PILATES & MINDFUL MOVEMENT - CLOUD DATABASE API (GOOGLE APPS SCRIPT)
 * ============================================================================
 * Skrip ini dipasang pada Google Spreadsheet Database INCA:
 * "INCA_DATABASE_MASTER_GOOGLE_SHEETS"
 * 
 * CARA MEMASANG (HANYA 2 MENIT):
 * 1. Buka Google Drive Anda (akun Toko Mas Putu).
 * 2. Upload file "INCA_DATABASE_MASTER_GOOGLE_SHEETS.xlsx", lalu buka sebagai Google Sheets.
 * 3. Di Google Sheets, klik menu: "Ekstensi" (Extensions) > "Apps Script".
 * 4. Hapus semua kode default di Apps Script, lalu PASTE SELURUH KODE DI BAWAH INI.
 * 5. Klik tombol "Simpan" (ikon disket), beri nama project: "INCA Database API".
 * 6. Klik tombol biru di kanan atas: "Terapkan" (Deploy) > "Penerapan baru" (New deployment).
 * 7. Pada ikon gear ⚙️ di kiri, pilih: "Aplikasi web" (Web app).
 * 8. Atur konfigurasinya:
 *    - Deskripsi : INCA Database API v1.0
 *    - Jalankan sebagai (Execute as) : Saya (akun Google Anda)
 *    - Siapa yang memiliki akses (Who has access) : Siapa saja (Anyone) -> WAJIB agar sistem browser bisa simpan data
 * 9. Klik "Terapkan" (Deploy), lalu setujui izin akses Google (Authorize access).
 * 10. Salin "URL Aplikasi Web" (Web app URL) yang dihasilkan (contoh: https://script.google.com/macros/s/.../exec).
 * 11. Masukkan URL tersebut ke menu Pengaturan Database Cloud di Sistem INCA. SELESAI!
 * ============================================================================
 */

function doGet(e) {
  var params = e ? e.parameter : {};
  var action = params.action || 'ping';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'ping') {
    return jsonResponse({
      status: 'success',
      code: 200,
      message: 'INCA Google Sheets Database API is Online & Active!',
      spreadsheetTitle: ss.getName(),
      sheets: ss.getSheets().map(function(s) { return s.getName(); }),
      timestamp: new Date().toISOString()
    });
  }
  
  if (action === 'getAll') {
    var result = {
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {}
    };
    var sheets = ['DB_Member', 'DB_Pembelian', 'DB_Presensi', 'DB_Jadwal', 'DB_Kelas', 'DB_Paket', 'DB_Coach', 'DB_Leads', 'DB_Keuangan_Jurnal', 'DB_Pengguna'];
    sheets.forEach(function(shName) {
      result.data[shName] = readSheetData(ss, shName);
    });
    return jsonResponse(result);
  }
  
  if (action === 'getTable') {
    var tableName = params.table;
    if (!tableName) return jsonResponse({ status: 'error', message: 'Parameter table tidak disertakan.' });
    return jsonResponse({
      status: 'success',
      table: tableName,
      rows: readSheetData(ss, tableName)
    });
  }
  
  return jsonResponse({ status: 'error', message: 'Action tidak dikenali.' });
}

function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : '';
    if (!contents) {
      return jsonResponse({ status: 'error', message: 'Payload data kosong.' });
    }
    
    var payload = JSON.parse(contents);
    var action = payload.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. TAMBAH MEMBER BARU
    if (action === 'addMember') {
      var m = payload.data;
      var sh = getOrCreateSheet(ss, 'DB_Member');
      sh.appendRow([
        m.id || 'mem-' + new Date().getTime(),
        m.memberCode || '',
        m.name || '',
        m.phone || '',
        m.email || '',
        m.joinedDate || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMM yyyy'),
        m.packageName || '',
        m.remainingSessions || 0,
        m.totalSessions || 0,
        m.status || 'Aktif',
        m.source || 'Sistem Web',
        m.notes || ''
      ]);
      return jsonResponse({ status: 'success', message: 'Member berhasil disimpan ke Google Sheets' });
    }
    
    // 2. TAMBAH PEMBELIAN PAKET BARU
    if (action === 'addPurchase') {
      var p = payload.data;
      var shPur = getOrCreateSheet(ss, 'DB_Pembelian');
      shPur.appendRow([
        p.id || 'pur-' + new Date().getTime(),
        p.invoiceNo || '',
        p.date || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd'),
        p.memberId || '',
        p.memberName || '',
        p.packageId || '',
        p.packageName || '',
        p.sessions || 0,
        p.normalPrice || 0,
        p.discount || 0,
        p.price || 0,
        p.paymentMethod || 'Transfer Bank',
        p.paymentStatus || 'Lunas',
        p.startDate || '',
        p.expireDate || '',
        p.usedSessions || 0,
        p.remainingSessions || 0,
        p.status || 'Aktif'
      ]);
      return jsonResponse({ status: 'success', message: 'Transaksi paket berhasil disimpan ke Google Sheets' });
    }
    
    // 3. TAMBAH PRESENSI / CHECK-IN
    if (action === 'addAttendance') {
      var a = payload.data;
      var shAtt = getOrCreateSheet(ss, 'DB_Presensi');
      shAtt.appendRow([
        a.id || 'att-' + new Date().getTime(),
        a.classDate || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd'),
        a.classTime || '',
        a.className || '',
        a.coachName || '',
        a.memberId || '',
        a.memberName || '',
        a.memberPhone || '',
        a.paymentType || '',
        a.packageName || '',
        a.checkInStatus || 'Sudah Check-In',
        a.checkInTime || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'HH:mm:ss'),
        a.sessionsDeducted || 1,
        a.attendanceStatus || 'Hadir',
        a.notes || ''
      ]);
      return jsonResponse({ status: 'success', message: 'Data presensi berhasil disimpan ke Google Sheets' });
    }
    
    // 4. TAMBAH TRANSAKSI JURNAL FINANCE
    if (action === 'addFinanceEntry') {
      var f = payload.data;
      var shFin = getOrCreateSheet(ss, 'DB_Keuangan_Jurnal');
      shFin.appendRow([
        f.id || 'inca-bb-' + new Date().getTime(),
        f.date || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd'),
        f.memo || '',
        f.party || '',
        f.debit || '',
        f.debitName || '',
        f.credit || '',
        f.creditName || '',
        f.amount || 0
      ]);
      return jsonResponse({ status: 'success', message: 'Jurnal keuangan berhasil dicatat ke Google Sheets' });
    }
    
    // 5. UPDATE SISA KUOTA MEMBER SETELAH CHECK-IN
    if (action === 'updateMemberQuota') {
      var memberId = payload.memberId;
      var remaining = payload.remainingSessions;
      var shMem = getOrCreateSheet(ss, 'DB_Member');
      var values = shMem.getDataRange().getValues();
      for (var r = 1; r < values.length; r++) {
        if (values[r][0] === memberId) {
          shMem.getRange(r + 1, 8).setValue(remaining); // Kolom 8 = Sisa Sesi
          break;
        }
      }
      return jsonResponse({ status: 'success', message: 'Sisa kuota member diperbarui' });
    }
    
    // 6. SINKRONISASI MASAL (BULK SYNC DARI LOKAL KE CLOUD)
    if (action === 'syncAll') {
      var fullData = payload.data;
      if (fullData.members && fullData.members.length > 0) {
        syncTableData(ss, 'DB_Member', fullData.members, ['id', 'memberCode', 'name', 'phone', 'email', 'joinedDate', 'packageName', 'remainingSessions', 'totalSessions', 'status', 'source', 'notes']);
      }
      if (fullData.packagePurchases && fullData.packagePurchases.length > 0) {
        syncTableData(ss, 'DB_Pembelian', fullData.packagePurchases, ['id', 'invoiceNo', 'date', 'memberId', 'memberName', 'packageId', 'packageName', 'sessions', 'normalPrice', 'discount', 'price', 'paymentMethod', 'paymentStatus', 'startDate', 'expireDate', 'usedSessions', 'remainingSessions', 'status']);
      }
      if (fullData.classAttendances && fullData.classAttendances.length > 0) {
        syncTableData(ss, 'DB_Presensi', fullData.classAttendances, ['id', 'classDate', 'classTime', 'className', 'coachName', 'memberId', 'memberName', 'memberPhone', 'paymentType', 'packageName', 'checkInStatus', 'checkInTime', 'sessionsDeducted', 'attendanceStatus', 'notes']);
      }
      return jsonResponse({ status: 'success', message: 'Sinkronisasi masal berhasil disimpan ke Google Sheets' });
    }
    
    return jsonResponse({ status: 'error', message: 'Aksi (' + action + ') tidak dikenali' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// ================= HELPER FUNCTIONS =================

function readSheetData(ss, sheetName) {
  var sh = ss.getSheetByName(sheetName);
  if (!sh) return [];
  var vals = sh.getDataRange().getValues();
  if (vals.length <= 1) return [];
  var headers = vals[0];
  var rows = [];
  for (var i = 1; i < vals.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = vals[i][j];
    }
    rows.push(obj);
  }
  return rows;
}

function getOrCreateSheet(ss, sheetName) {
  var sh = ss.getSheetByName(sheetName);
  if (!sh) {
    sh = ss.insertSheet(sheetName);
  }
  return sh;
}

function syncTableData(ss, sheetName, items, keyOrder) {
  var sh = getOrCreateSheet(ss, sheetName);
  var lastRow = sh.getLastRow();
  var existingIds = {};
  if (lastRow > 1) {
    var idCol = sh.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < idCol.length; i++) {
      existingIds[idCol[i][0]] = true;
    }
  }
  
  var newRows = [];
  items.forEach(function(item) {
    if (!existingIds[item.id]) {
      var row = [];
      keyOrder.forEach(function(k) {
        row.push(item[k] !== undefined ? item[k] : '');
      });
      newRows.append(row);
      existingIds[item.id] = true;
    }
  });
  
  if (newRows.length > 0) {
    sh.getRange(lastRow + 1, 1, newRows.length, keyOrder.length).setValues(newRows);
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
