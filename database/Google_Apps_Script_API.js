/**
 * ============================================================================
 * INCA PILATES & MINDFUL MOVEMENT - CLOUD DATABASE API (GOOGLE APPS SCRIPT)
 * Versi 2.0 - Universal Sync (Mendukung Seluruh 10 Tabel & Auto-Sync Excel/Manual)
 * ============================================================================
 * Skrip ini dipasang pada Google Spreadsheet Database INCA:
 * "INCA_PILATES_DATABASE_MASTER"
 * 
 * CARA MEMPERBARUI / PASANG KE GOOGLE SHEETS (HANYA 1 MENIT):
 * 1. Buka Google Spreadsheet Database INCA Anda:
 *    https://docs.google.com/spreadsheets/d/1kJ6fRrPtEIPPOm2E8yScJlOXVw3_HcBBXP_T9UiK3Vw/edit
 * 2. Klik menu atas: "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus seluruh isi kode lama di Apps Script, lalu PASTE SELURUH KODE DI FILE INI.
 * 4. Klik ikon Disket (Simpan).
 * 5. Klik tombol biru di kanan atas: "Terapkan" (Deploy) > "Kelola penerapan" (Manage deployments).
 * 6. Klik ikon Pensil (Edit) di samping penerapan Web App Anda.
 * 7. Pada baris "Versi" (Version), pilih: "Versi baru" (New version).
 * 8. Klik tombol "Terapkan" (Deploy).
 * SELESAI! URL Web App tetap sama persis dan langsung mendukung seluruh tabel.
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
      message: 'INCA Google Sheets Database API v2.0 is Online & Ready!',
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
    var sheets = [
      'DB_Member', 'DB_Pembelian', 'DB_Presensi', 'DB_Jadwal', 'DB_Kelas',
      'DB_Paket', 'DB_Coach', 'DB_Leads', 'DB_Keuangan_Jurnal', 'DB_Pengguna'
    ];
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
  
  return jsonResponse({ status: 'error', message: 'Action GET tidak dikenali.' });
}

function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : '';
    if (!contents) {
      return jsonResponse({ status: 'error', message: 'Payload data kosong.' });
    }
    
    var payload = JSON.parse(contents);
    var action = payload.action;
    var data = payload.data || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // ------------------------------------------------------------------------
    // 1. DATA PENGGUNA (DB_Pengguna)
    // ------------------------------------------------------------------------
    if (action === 'saveUser' || action === 'addUser') {
      var sh = getOrCreateSheet(ss, 'DB_Pengguna');
      var u = data;
      var permsCount = Array.isArray(u.permissions) ? u.permissions.length : (u.permissions ? String(u.permissions).split(',').length : 0);
      var permsDesc = u.permissionsDesc || (permsCount >= 21 ? 'Seluruh 21 Menu (10 Admin Studio + 11 INCA Finance)' : permsCount + ' Menu Akses');
      
      var row = [
        u.id || ('usr-' + (u.username || new Date().getTime())),
        u.name || u.fullName || '',
        u.username || '',
        u.password || '',
        u.role || 'custom',
        u.roleLabel || u.role || 'Pengguna',
        u.phone || '',
        (u.active === false || u.active === 'Nonaktif') ? 'Nonaktif' : 'Aktif',
        u.createdDate || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMM yyyy'),
        permsDesc
      ];
      
      var res = upsertByCols(sh, [0, 2], [row[0], row[2]], row); // Cocokkan ID (kol 1) atau Username (kol 3)
      return jsonResponse({ status: 'success', action: res.action, message: 'Data pengguna @' + u.username + ' berhasil disimpan ke Google Sheets' });
    }
    
    if (action === 'deleteUser') {
      var sh = getOrCreateSheet(ss, 'DB_Pengguna');
      var targetId = data.id || payload.id;
      var targetUsername = data.username || payload.username;
      var delRes = deleteByCols(sh, [0, 2], [targetId, targetUsername]);
      return jsonResponse({ status: 'success', action: delRes.action, message: 'Pengguna berhasil dihapus dari Google Sheets' });
    }

    if (action === 'syncUsers') {
      var usersList = data.users || data || [];
      var sh = getOrCreateSheet(ss, 'DB_Pengguna');
      usersList.forEach(function(u) {
        var permsCount = Array.isArray(u.permissions) ? u.permissions.length : 0;
        var permsDesc = u.permissionsDesc || (permsCount >= 21 ? 'Seluruh 21 Menu (10 Admin Studio + 11 INCA Finance)' : permsCount + ' Menu Akses');
        var row = [
          u.id || ('usr-' + (u.username || new Date().getTime())),
          u.name || u.fullName || '',
          u.username || '',
          u.password || '',
          u.role || 'custom',
          u.roleLabel || u.role || 'Pengguna',
          u.phone || '',
          (u.active === false || u.active === 'Nonaktif') ? 'Nonaktif' : 'Aktif',
          u.createdDate || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMM yyyy'),
          permsDesc
        ];
        upsertByCols(sh, [0, 2], [row[0], row[2]], row);
      });
      return jsonResponse({ status: 'success', message: 'Seluruh pengguna berhasil disinkronkan ke Google Sheets' });
    }

    // ------------------------------------------------------------------------
    // 2. DATA MEMBER (DB_Member)
    // ------------------------------------------------------------------------
    if (action === 'saveMember' || action === 'addMember') {
      var sh = getOrCreateSheet(ss, 'DB_Member');
      var m = data;
      var code = m.memberCode || m.id;
      // Format INC + nomor urut mengikuti baris terakhir (misal INC167)
      if (!code || String(code).indexOf('mem-') === 0) {
        var lastRow = sh.getLastRow();
        var maxNum = 0;
        if (lastRow > 1) {
          var colVals = sh.getRange(2, 1, lastRow - 1, 1).getValues();
          for (var i = 0; i < colVals.length; i++) {
            var n = parseInt(String(colVals[i][0]).replace(/\D/g, ''), 10);
            if (!isNaN(n) && n > maxNum) maxNum = n;
          }
        }
        code = 'INC' + ('000' + (maxNum + 1)).slice(-3);
      }
      var row = [
        code,
        code,
        m.name || '',
        m.phone || '',
        m.email || '',
        m.joinedDate || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMM yyyy'),
        m.packageName || 'Belum Ada Paket',
        Number(m.remainingSessions) || 0,
        Number(m.totalSessions) || 0,
        m.status || 'Aktif',
        m.source || 'Sistem Web',
        m.notes || ''
      ];
      var res = upsertByCols(sh, [0, 1], [row[0], row[1]], row);
      return jsonResponse({ status: 'success', action: res.action, memberId: code, message: 'Data member ' + m.name + ' berhasil disimpan ke Google Sheets' });
    }

    if (action === 'deleteMember') {
      var sh = getOrCreateSheet(ss, 'DB_Member');
      var delRes = deleteByCols(sh, [0, 1], [data.id, data.memberCode]);
      return jsonResponse({ status: 'success', action: delRes.action, message: 'Member berhasil dihapus dari Google Sheets' });
    }

    if (action === 'updateMemberQuota') {
      var memberId = payload.memberId || data.memberId;
      var remaining = payload.remainingSessions !== undefined ? payload.remainingSessions : data.remainingSessions;
      var sh = getOrCreateSheet(ss, 'DB_Member');
      var vals = sh.getDataRange().getValues();
      for (var r = 1; r < vals.length; r++) {
        if (String(vals[r][0]).trim() === String(memberId).trim() || String(vals[r][1]).trim() === String(memberId).trim()) {
          sh.getRange(r + 1, 8).setValue(remaining); // Kolom 8 = Sisa Sesi
          break;
        }
      }
      return jsonResponse({ status: 'success', message: 'Sisa kuota member diperbarui' });
    }

    // ------------------------------------------------------------------------
    // 3. DATA PEMBELIAN PAKET (DB_Pembelian)
    // ------------------------------------------------------------------------
    if (action === 'savePurchase' || action === 'addPurchase') {
      var sh = getOrCreateSheet(ss, 'DB_Pembelian');
      var p = data;
      var purId = p.id;
      // Format ID + nomor urut mengikuti baris terakhir (misal ID231)
      if (!purId || String(purId).indexOf('pur-') === 0) {
        var lastRow = sh.getLastRow();
        var maxNum = 0;
        if (lastRow > 1) {
          var colVals = sh.getRange(2, 1, lastRow - 1, 1).getValues();
          for (var i = 0; i < colVals.length; i++) {
            var n = parseInt(String(colVals[i][0]).replace(/\D/g, ''), 10);
            if (!isNaN(n) && n > maxNum) maxNum = n;
          }
        }
        purId = 'ID' + ('000' + (maxNum + 1)).slice(-3);
      }
      var invNo = p.invoiceNo && String(p.invoiceNo).indexOf('INV-') !== 0 ? p.invoiceNo : purId;
      var row = [
        purId,
        invNo,
        p.date || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy'),
        p.memberId || '',
        p.memberName || '',
        p.packageId || '',
        p.packageName || '',
        Number(p.sessions) || 0,
        Number(p.normalPrice) || 0,
        Number(p.discount) || 0,
        Number(p.price) || 0,
        p.paymentMethod || 'Transfer',
        p.paymentStatus || 'Lunas',
        p.startDate || '',
        p.expireDate || '',
        Number(p.usedSessions) || 0,
        Number(p.remainingSessions) || 0,
        p.status || 'Aktif'
      ];
      var res = upsertByCols(sh, [0, 1], [row[0], row[1]], row);
      return jsonResponse({ status: 'success', action: res.action, purchaseId: purId, message: 'Transaksi paket ' + purId + ' berhasil disimpan ke Google Sheets' });
    }

    // ------------------------------------------------------------------------
    // 4. DATA PRESENSI / CHECK-IN (DB_Presensi)
    // ------------------------------------------------------------------------
    if (action === 'saveAttendance' || action === 'addAttendance') {
      var sh = getOrCreateSheet(ss, 'DB_Presensi');
      var a = data;
      var row = [
        a.id || ('att-' + new Date().getTime()),
        a.classDate || a.date || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd'),
        a.classTime || a.time || '',
        a.className || '',
        a.coachName || '',
        a.memberId || '',
        a.memberName || '',
        a.memberPhone || '',
        a.paymentType || '',
        a.packageName || '',
        a.checkInStatus || 'Sudah Check-In',
        a.checkInTime || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'HH:mm:ss'),
        Number(a.sessionsDeducted) || 1,
        a.attendanceStatus || 'Hadir',
        a.notes || ''
      ];
      var res = upsertByCols(sh, [0], [row[0]], row);
      return jsonResponse({ status: 'success', action: res.action, message: 'Presensi member berhasil disimpan ke Google Sheets' });
    }

    // ------------------------------------------------------------------------
    // 5. DATA JADWAL PLOTING (DB_Jadwal)
    // ------------------------------------------------------------------------
    if (action === 'saveSchedule' || action === 'addSchedule') {
      var sh = getOrCreateSheet(ss, 'DB_Jadwal');
      var s = data;
      var row = [
        s.id || ('sch-' + new Date().getTime()),
        s.date || '',
        s.formatDate || s.date || '',
        s.startTime || '',
        s.endTime || '',
        s.classId || '',
        s.className || '',
        s.category || '',
        s.coachId || '',
        s.coachName || '',
        s.room || 'Studio Utama',
        Number(s.capacity) || 4,
        Number(s.bookedCount) || 0,
        s.status || 'active'
      ];
      var res = upsertByCols(sh, [0], [row[0]], row);
      return jsonResponse({ status: 'success', action: res.action, message: 'Jadwal kelas berhasil disimpan ke Google Sheets' });
    }

    if (action === 'deleteSchedule') {
      var sh = getOrCreateSheet(ss, 'DB_Jadwal');
      deleteByCols(sh, [0], [data.id || payload.id]);
      return jsonResponse({ status: 'success', message: 'Jadwal berhasil dihapus dari Google Sheets' });
    }

    // ------------------------------------------------------------------------
    // 6. MASTER JENIS KELAS (DB_Kelas)
    // ------------------------------------------------------------------------
    if (action === 'saveClass' || action === 'addClass') {
      var sh = getOrCreateSheet(ss, 'DB_Kelas');
      var c = data;
      var row = [
        c.id || ('cls-' + new Date().getTime()),
        c.name || '',
        c.category || 'Reformer',
        c.level || 'Semua Level',
        Number(c.duration) || 50,
        Number(c.defaultCapacity) || 4,
        Number(c.dropInPrice) || 0,
        c.description || ''
      ];
      var res = upsertByCols(sh, [0], [row[0]], row);
      return jsonResponse({ status: 'success', action: res.action, message: 'Master kelas berhasil disimpan ke Google Sheets' });
    }

    if (action === 'deleteClass') {
      var sh = getOrCreateSheet(ss, 'DB_Kelas');
      deleteByCols(sh, [0], [data.id || payload.id]);
      return jsonResponse({ status: 'success', message: 'Kelas berhasil dihapus dari Google Sheets' });
    }

    // ------------------------------------------------------------------------
    // 7. MASTER PAKET LATIHAN (DB_Paket)
    // ------------------------------------------------------------------------
    if (action === 'savePackage' || action === 'addPackage') {
      var sh = getOrCreateSheet(ss, 'DB_Paket');
      var pkg = data;
      var row = [
        pkg.id || ('pkg-' + new Date().getTime()),
        pkg.name || '',
        pkg.category || 'Reguler',
        Number(pkg.sessions) || 1,
        Number(pkg.normalPrice) || 0,
        Number(pkg.promoPrice) || 0,
        Number(pkg.validityDays) || 30,
        pkg.active ? 'Aktif' : 'Nonaktif',
        pkg.firstTimerOnly ? 'Ya' : 'Tidak',
        Array.isArray(pkg.benefits) ? pkg.benefits.join('; ') : (pkg.benefits || ''),
        pkg.description || ''
      ];
      var res = upsertByCols(sh, [0], [row[0]], row);
      return jsonResponse({ status: 'success', action: res.action, message: 'Master paket berhasil disimpan ke Google Sheets' });
    }

    if (action === 'deletePackage') {
      var sh = getOrCreateSheet(ss, 'DB_Paket');
      deleteByCols(sh, [0], [data.id || payload.id]);
      return jsonResponse({ status: 'success', message: 'Paket berhasil dihapus dari Google Sheets' });
    }

    // ------------------------------------------------------------------------
    // 8. MASTER COACH / INSTRUKTUR (DB_Coach)
    // ------------------------------------------------------------------------
    if (action === 'saveCoach' || action === 'addCoach') {
      var sh = getOrCreateSheet(ss, 'DB_Coach');
      var cch = data;
      var row = [
        cch.id || ('cch-' + new Date().getTime()),
        cch.name || '',
        cch.specialty || 'Pilates & Reformer',
        cch.phone || '',
        cch.email || '',
        Number(cch.rating) || 5.0,
        cch.active ? 'Aktif' : 'Nonaktif',
        cch.bio || ''
      ];
      var res = upsertByCols(sh, [0], [row[0]], row);
      return jsonResponse({ status: 'success', action: res.action, message: 'Master coach berhasil disimpan ke Google Sheets' });
    }

    if (action === 'deleteCoach') {
      var sh = getOrCreateSheet(ss, 'DB_Coach');
      deleteByCols(sh, [0], [data.id || payload.id]);
      return jsonResponse({ status: 'success', message: 'Coach berhasil dihapus dari Google Sheets' });
    }

    // ------------------------------------------------------------------------
    // 9. DATA LEADS / PROSPEK (DB_Leads)
    // ------------------------------------------------------------------------
    if (action === 'saveLead' || action === 'addLead') {
      var sh = getOrCreateSheet(ss, 'DB_Leads');
      var ld = data;
      var row = [
        ld.id || ('lead-' + new Date().getTime()),
        ld.name || '',
        ld.phone || '',
        ld.offeredDate || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMM yyyy'),
        ld.source || 'Penawaran',
        ld.status || 'Baru'
      ];
      var res = upsertByCols(sh, [0], [row[0]], row);
      return jsonResponse({ status: 'success', action: res.action, message: 'Data leads berhasil disimpan ke Google Sheets' });
    }

    if (action === 'deleteLead') {
      var sh = getOrCreateSheet(ss, 'DB_Leads');
      deleteByCols(sh, [0], [data.id || payload.id]);
      return jsonResponse({ status: 'success', message: 'Lead berhasil dihapus dari Google Sheets' });
    }

    // ------------------------------------------------------------------------
    // 10. JURNAL KEUANGAN / FINANCE (DB_Keuangan_Jurnal)
    // ------------------------------------------------------------------------
    if (action === 'saveFinanceEntry' || action === 'addFinanceEntry') {
      var sh = getOrCreateSheet(ss, 'DB_Keuangan_Jurnal');
      var f = data;
      var row = [
        f.id || ('inca-bb-' + new Date().getTime()),
        f.date || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd'),
        f.memo || '',
        f.party || '',
        f.debit || '',
        f.debitName || '',
        f.credit || '',
        f.creditName || '',
        Number(f.amount) || 0
      ];
      var res = upsertByCols(sh, [0], [row[0]], row);
      return jsonResponse({ status: 'success', action: res.action, message: 'Jurnal keuangan berhasil disimpan ke Google Sheets' });
    }

    // ------------------------------------------------------------------------
    // 11. SINKRONISASI HASIL IMPORT EXCEL (STUDIO & FINANCE)
    // ------------------------------------------------------------------------
    if (action === 'syncExcelStudio') {
      var d = data;
      var stats = { members: 0, purchases: 0, attendances: 0, schedules: 0 };
      
      if (d.members && d.members.length > 0) {
        var shM = getOrCreateSheet(ss, 'DB_Member');
        d.members.forEach(function(m) {
          var code = m.memberCode || m.id;
          var r = [m.id || code, code, m.name || '', m.phone || '', m.email || '', m.joinedDate || '', m.packageName || '', Number(m.remainingSessions) || 0, Number(m.totalSessions) || 0, m.status || 'Aktif', m.source || 'Excel Import', m.notes || ''];
          upsertByCols(shM, [0, 1], [r[0], r[1]], r);
        });
        stats.members = d.members.length;
      }

      if (d.packagePurchases && d.packagePurchases.length > 0) {
        var shP = getOrCreateSheet(ss, 'DB_Pembelian');
        d.packagePurchases.forEach(function(p) {
          var r = [p.id, p.invoiceNo || '', p.date || '', p.memberId || '', p.memberName || '', p.packageId || '', p.packageName || '', Number(p.sessions) || 0, Number(p.normalPrice) || 0, Number(p.discount) || 0, Number(p.price) || 0, p.paymentMethod || '', p.paymentStatus || 'Lunas', p.startDate || '', p.expireDate || '', Number(p.usedSessions) || 0, Number(p.remainingSessions) || 0, p.status || 'Aktif'];
          upsertByCols(shP, [0, 1], [r[0], r[1]], r);
        });
        stats.purchases = d.packagePurchases.length;
      }

      if (d.classAttendances && d.classAttendances.length > 0) {
        var shA = getOrCreateSheet(ss, 'DB_Presensi');
        d.classAttendances.forEach(function(a) {
          var r = [a.id, a.classDate || a.date || '', a.classTime || a.time || '', a.className || '', a.coachName || '', a.memberId || '', a.memberName || '', a.memberPhone || '', a.paymentType || '', a.packageName || '', a.checkInStatus || 'Sudah Check-In', a.checkInTime || '', Number(a.sessionsDeducted) || 1, a.attendanceStatus || 'Hadir', a.notes || ''];
          upsertByCols(shA, [0], [r[0]], r);
        });
        stats.attendances = d.classAttendances.length;
      }

      if (d.schedules && d.schedules.length > 0) {
        var shS = getOrCreateSheet(ss, 'DB_Jadwal');
        d.schedules.forEach(function(s) {
          var r = [s.id, s.date || '', s.formatDate || s.date || '', s.startTime || '', s.endTime || '', s.classId || '', s.className || '', s.category || '', s.coachId || '', s.coachName || '', s.room || 'Studio Utama', Number(s.capacity) || 4, Number(s.bookedCount) || 0, s.status || 'active'];
          upsertByCols(shS, [0], [r[0]], r);
        });
        stats.schedules = d.schedules.length;
      }

      return jsonResponse({
        status: 'success',
        message: 'Import Excel Studio berhasil disinkronkan ke Google Sheets',
        stats: stats
      });
    }

    if (action === 'syncExcelFinance') {
      var entries = data.entries || data || [];
      var shFin = getOrCreateSheet(ss, 'DB_Keuangan_Jurnal');
      entries.forEach(function(f) {
        var r = [
          f.id || ('inca-bb-' + new Date().getTime()),
          f.date || '',
          f.memo || '',
          f.party || '',
          f.debit || '',
          f.debitName || '',
          f.credit || '',
          f.creditName || '',
          Number(f.amount) || 0
        ];
        upsertByCols(shFin, [0], [r[0]], r);
      });
      return jsonResponse({
        status: 'success',
        message: 'Import Excel Finance (' + entries.length + ' transaksi) berhasil disinkronkan ke Google Sheets'
      });
    }

    // ------------------------------------------------------------------------
    // 12. SINKRONISASI TOTAL / SYNC ALL (SELURUH 10 TABEL)
    // ------------------------------------------------------------------------
    if (action === 'syncAll') {
      var d = data;
      // Users
      if (d.users && d.users.length) {
        var shU = getOrCreateSheet(ss, 'DB_Pengguna');
        d.users.forEach(function(u) {
          var permsCount = Array.isArray(u.permissions) ? u.permissions.length : 0;
          var permsDesc = u.permissionsDesc || (permsCount >= 21 ? 'Seluruh 21 Menu (10 Admin Studio + 11 INCA Finance)' : permsCount + ' Menu Akses');
          var r = [u.id, u.name, u.username, u.password, u.role, u.roleLabel, u.phone, u.active ? 'Aktif' : 'Nonaktif', u.createdDate, permsDesc];
          upsertByCols(shU, [0, 2], [r[0], r[2]], r);
        });
      }
      // Members
      if (d.members && d.members.length) {
        var shM = getOrCreateSheet(ss, 'DB_Member');
        d.members.forEach(function(m) {
          var code = m.memberCode || m.id;
          var r = [m.id, code, m.name, m.phone, m.email, m.joinedDate, m.packageName, m.remainingSessions, m.totalSessions, m.status, m.source, m.notes];
          upsertByCols(shM, [0, 1], [r[0], r[1]], r);
        });
      }
      // Purchases
      if (d.packagePurchases && d.packagePurchases.length) {
        var shP = getOrCreateSheet(ss, 'DB_Pembelian');
        d.packagePurchases.forEach(function(p) {
          var r = [p.id, p.invoiceNo, p.date, p.memberId, p.memberName, p.packageId, p.packageName, p.sessions, p.normalPrice, p.discount, p.price, p.paymentMethod, p.paymentStatus, p.startDate, p.expireDate, p.usedSessions, p.remainingSessions, p.status];
          upsertByCols(shP, [0, 1], [r[0], r[1]], r);
        });
      }
      // Presensi
      if (d.classAttendances && d.classAttendances.length) {
        var shA = getOrCreateSheet(ss, 'DB_Presensi');
        d.classAttendances.forEach(function(a) {
          var r = [a.id, a.classDate, a.classTime, a.className, a.coachName, a.memberId, a.memberName, a.memberPhone, a.paymentType, a.packageName, a.checkInStatus, a.checkInTime, a.sessionsDeducted, a.attendanceStatus, a.notes];
          upsertByCols(shA, [0], [r[0]], r);
        });
      }
      // Schedules
      if (d.schedules && d.schedules.length) {
        var shS = getOrCreateSheet(ss, 'DB_Jadwal');
        d.schedules.forEach(function(s) {
          var r = [s.id, s.date, s.formatDate || s.date, s.startTime, s.endTime, s.classId, s.className, s.category, s.coachId, s.coachName, s.room, s.capacity, s.bookedCount, s.status];
          upsertByCols(shS, [0], [r[0]], r);
        });
      }
      // Classes
      if (d.classes && d.classes.length) {
        var shC = getOrCreateSheet(ss, 'DB_Kelas');
        d.classes.forEach(function(c) {
          var r = [c.id, c.name, c.category, c.level, c.duration, c.defaultCapacity, c.dropInPrice, c.description];
          upsertByCols(shC, [0], [r[0]], r);
        });
      }
      // Packages
      if (d.packages && d.packages.length) {
        var shPkg = getOrCreateSheet(ss, 'DB_Paket');
        d.packages.forEach(function(pkg) {
          var r = [pkg.id, pkg.name, pkg.category, pkg.sessions, pkg.normalPrice, pkg.promoPrice, pkg.validityDays, pkg.active ? 'Aktif' : 'Nonaktif', pkg.firstTimerOnly ? 'Ya' : 'Tidak', Array.isArray(pkg.benefits) ? pkg.benefits.join('; ') : (pkg.benefits || ''), pkg.description];
          upsertByCols(shPkg, [0], [r[0]], r);
        });
      }
      // Coaches
      if (d.coaches && d.coaches.length) {
        var shCch = getOrCreateSheet(ss, 'DB_Coach');
        d.coaches.forEach(function(cch) {
          var r = [cch.id, cch.name, cch.specialty, cch.phone, cch.email, cch.rating, cch.active ? 'Aktif' : 'Nonaktif', cch.bio];
          upsertByCols(shCch, [0], [r[0]], r);
        });
      }
      // Leads
      if (d.leads && d.leads.length) {
        var shL = getOrCreateSheet(ss, 'DB_Leads');
        d.leads.forEach(function(ld) {
          var r = [ld.id, ld.name, ld.phone, ld.offeredDate, ld.source, ld.status];
          upsertByCols(shL, [0], [r[0]], r);
        });
      }
      // Finance Entries
      if (d.financeEntries && d.financeEntries.length) {
        var shF = getOrCreateSheet(ss, 'DB_Keuangan_Jurnal');
        d.financeEntries.forEach(function(f) {
          var r = [f.id, f.date, f.memo, f.party, f.debit, f.debitName, f.credit, f.creditName, f.amount];
          upsertByCols(shF, [0], [r[0]], r);
        });
      }

      return jsonResponse({ status: 'success', message: 'Seluruh 10 tabel database berhasil disinkronkan ke Google Sheets' });
    }

    return jsonResponse({ status: 'error', message: 'Aksi (' + action + ') tidak dikenali' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// ============================================================================
// HELPER FUNCTIONS (UPSERT & DELETE CEPAT TANPA DUPLIKAT)
// ============================================================================

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

/**
 * Upsert baris berdasarkan pencocokan satu atau lebih kolom kunci (0-based)
 */
function upsertByCols(sh, colIndices, targetVals, rowValues) {
  var lastRow = sh.getLastRow();
  if (lastRow > 1) {
    var maxCol = 1;
    for (var k = 0; k < colIndices.length; k++) {
      if (colIndices[k] + 1 > maxCol) maxCol = colIndices[k] + 1;
    }
    var keyData = sh.getRange(2, 1, lastRow - 1, maxCol).getValues();
    for (var r = 0; r < keyData.length; r++) {
      var matched = false;
      for (var k = 0; k < colIndices.length; k++) {
        var cIdx = colIndices[k];
        var targetVal = targetVals[k];
        if (targetVal !== undefined && targetVal !== null && String(targetVal).trim() !== '') {
          if (String(keyData[r][cIdx]).trim().toLowerCase() === String(targetVal).trim().toLowerCase()) {
            matched = true;
            break;
          }
        }
      }
      if (matched) {
        sh.getRange(r + 2, 1, 1, rowValues.length).setValues([rowValues]);
        return { action: 'updated', row: r + 2 };
      }
    }
  }
  sh.appendRow(rowValues);
  return { action: 'inserted', row: sh.getLastRow() };
}

/**
 * Hapus baris berdasarkan pencocokan kolom (0-based)
 */
function deleteByCols(sh, colIndices, targetVals) {
  var lastRow = sh.getLastRow();
  if (lastRow > 1) {
    var maxCol = 1;
    for (var k = 0; k < colIndices.length; k++) {
      if (colIndices[k] + 1 > maxCol) maxCol = colIndices[k] + 1;
    }
    var keyData = sh.getRange(2, 1, lastRow - 1, maxCol).getValues();
    for (var r = 0; r < keyData.length; r++) {
      var matched = false;
      for (var k = 0; k < colIndices.length; k++) {
        var cIdx = colIndices[k];
        var targetVal = targetVals[k];
        if (targetVal !== undefined && targetVal !== null && String(targetVal).trim() !== '') {
          if (String(keyData[r][cIdx]).trim().toLowerCase() === String(targetVal).trim().toLowerCase()) {
            matched = true;
            break;
          }
        }
      }
      if (matched) {
        sh.deleteRow(r + 2);
        return { action: 'deleted', row: r + 2 };
      }
    }
  }
  return { action: 'not_found' };
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
