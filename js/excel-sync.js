/**
 * INCA PILATES & YOGA STUDIO - INTELLIGENT EXCEL SYNCHRONIZATION ENGINE
 * Model Sinkronisasi Master Excel Cerdas:
 * 1. Mode Full Sync (Mirror Excel):
 *    Menyesuaikan sistem 100% dengan Excel. Data yang dihapus dari Excel otomatis dihapus dari sistem.
 * 2. Mode Incremental (Append Data Terakhir):
 *    Menambahkan data terbaru langsung tanpa menghapus data historis yang sudah ada di sistem.
 * 3. Auto-Deteksi Otomatis & Pratinjau Interaktif sebelum menerapkan perubahan.
 */

(function(window, document) {
  'use strict';

  function normalizeKey(str) {
    return String(str || '').trim().toLowerCase();
  }

  function formatIDR(val) {
    return Number(val || 0).toLocaleString('id-ID');
  }

  function findSheet(wb, candidateNames) {
    const sheetNames = wb.SheetNames || [];
    for (const name of candidateNames) {
      const found = sheetNames.find(n => n.trim().toLowerCase() === name.trim().toLowerCase());
      if (found) return found;
    }
    for (const name of candidateNames) {
      const found = sheetNames.find(n => n.toLowerCase().includes(name.toLowerCase()));
      if (found) return found;
    }
    return null;
  }

  let currentSyncAnalysis = null;

  /**
   * Analisis Diff antara Berkas Excel dan Database Sistem
   */
  function analyzeExcelFile(wb, fileName, fileSize) {
    const analysis = {
      fileName: fileName || 'Data_Admin_Studio_INCA.xlsx',
      fileSize: fileSize ? (fileSize > 1024 * 1024 ? (fileSize / (1024 * 1024)).toFixed(1) + ' MB' : Math.round(fileSize / 1024) + ' KB') : 'Berkas Excel',
      sheetsFound: [],
      entities: {},
      selectedMode: 'full', // 'full' or 'incremental'
      autoDetectedMode: 'full',
      summary: {
        totalExcel: 0,
        totalSystem: 0,
        totalAdded: 0,
        totalUpdated: 0,
        totalDeleted: 0,
        totalUnchanged: 0
      }
    };

    // -------------------------------------------------------------
    // 1. DATA MEMBER
    // -------------------------------------------------------------
    const memberSheetName = findSheet(wb, ['DATA MEMBER', 'MEMBER', 'MEMBERS', 'DATA_MEMBER', 'Data Member']);
    if (memberSheetName) {
      analysis.sheetsFound.push(memberSheetName);
      const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[memberSheetName]);
      const validRows = rawRows.filter(r => r['Nama Member'] || r['ID Member'] || r['Nama'] || r['ID']);

      const excelMembers = validRows.map((r, idx) => {
        const code = String(r['ID Member'] || r['ID'] || r['Kode Member'] || ('INC' + String(idx + 1).padStart(3, '0'))).trim();
        const name = String(r['Nama Member'] || r['Nama'] || '').trim();
        const phone = String(r['No WhatsApp'] || r['No Telp'] || r['Telepon'] || r['Phone'] || '').trim();
        return {
          id: code,
          memberCode: code,
          name: name,
          phone: phone,
          email: String(r['Email'] || '').trim(),
          joinedDate: String(r['Tanggal Daftar'] || r['Tgl Daftar'] || '').trim(),
          birthDate: String(r['Tanggal Lahir'] || r['Tgl Lahir'] || '').trim(),
          address: String(r['Alamat'] || '').trim(),
          source: String(r['Sumber Member'] || r['Sumber'] || '').trim(),
          status: String(r['Status'] || 'active').trim(),
          notes: String(r['Catatan'] || '').trim(),
          packageName: 'Paket Terdaftar',
          remainingSessions: 0,
          totalSessions: 0
        };
      });

      const sysMembers = appState.members || [];
      const added = [];
      const updated = [];
      const unchanged = [];
      const matchedSysIds = new Set();

      excelMembers.forEach(eMem => {
        const sMatch = sysMembers.find(sMem => 
          (eMem.memberCode && sMem.memberCode && eMem.memberCode.toLowerCase() === sMem.memberCode.toLowerCase()) ||
          (eMem.phone && sMem.phone && eMem.phone === sMem.phone) ||
          (normalizeKey(eMem.name) && normalizeKey(sMem.name) && normalizeKey(eMem.name) === normalizeKey(sMem.name))
        );

        if (sMatch) {
          matchedSysIds.add(sMatch.id || sMatch.memberCode);
          // Check modification
          const isMod = (eMem.name && eMem.name !== sMatch.name) ||
                        (eMem.phone && eMem.phone !== sMatch.phone) ||
                        (eMem.email && eMem.email !== sMatch.email) ||
                        (eMem.notes && eMem.notes !== sMatch.notes);
          if (isMod) {
            updated.push({ excel: eMem, system: sMatch, label: `${eMem.name} (${eMem.memberCode})` });
          } else {
            unchanged.push({ excel: eMem, system: sMatch, label: `${eMem.name} (${eMem.memberCode})` });
          }
        } else {
          added.push({ excel: eMem, label: `${eMem.name} (${eMem.memberCode})` });
        }
      });

      const deleted = sysMembers.filter(sMem => !matchedSysIds.has(sMem.id || sMem.memberCode)).map(sMem => ({
        system: sMem,
        label: `${sMem.name} (${sMem.memberCode})`
      }));

      analysis.entities.members = {
        name: 'Data Member',
        icon: 'users',
        sheetName: memberSheetName,
        excelData: excelMembers,
        added,
        updated,
        unchanged,
        deleted,
        totalExcel: excelMembers.length,
        totalSystem: sysMembers.length
      };
    }

    // -------------------------------------------------------------
    // 2. PEMBELIAN PAKET (TRANSAKSI)
    // -------------------------------------------------------------
    const purchaseSheetName = findSheet(wb, ['PEMBELIAN PAKET', 'TRANSAKSI', 'PURCHASES', 'PAKET MEMBER', 'Pembelian Paket']);
    if (purchaseSheetName) {
      analysis.sheetsFound.push(purchaseSheetName);
      const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[purchaseSheetName]);
      const validRows = rawRows.filter(r => r['ID Transaksi Paket'] || r['ID Transaksi'] || r['ID Member'] || r['mey'] || r['Nama Member']);

      const excelPurchases = validRows.map((r, idx) => {
        const inv = String(r['ID Transaksi Paket'] || r['ID Transaksi'] || r['Invoice'] || r['No Invoice'] || r['mey'] || ('ID' + String(idx + 1).padStart(3, '0'))).trim();
        const sess = parseInt(r['Total Sesi (otomatis)'] || r['Total Sesi'] || r['Sesi'] || 1, 10);
        const used = parseInt(r['Sesi Terpakai (otomatis)'] || r['Sesi Terpakai'] || 0, 10);
        const rem = parseInt(r['Sisa Sesi (otomatis)'] || r['Sisa Sesi'] || (sess - used), 10);
        const price = parseInt(String(r['Total Bayar (Rp)'] || r['Harga Paket (Rp) otomatis'] || r['Harga'] || 0).replace(/[^0-9]/g, '') || 0, 10);

        return {
          id: inv,
          invoiceNo: inv,
          date: String(r['Tanggal Beli'] || r['Tgl Beli'] || r['Tanggal'] || '').trim(),
          memberId: String(r['ID Member'] || r['ID Member (otomatis)'] || '').trim(),
          memberName: String(r['Nama Member (otomatis)'] || r['Nama Member'] || '').trim(),
          packageName: String(r['Jenis Paket (otomatis)'] || r['Jenis Paket'] || r['Paket'] || '').trim(),
          sessions: sess,
          price: price,
          discount: parseInt(String(r['Diskon (Rp)'] || 0).replace(/[^0-9]/g, '') || 0, 10),
          paymentMethod: String(r['Metode Bayar'] || r['Metode Pembayaran'] || 'Transfer').trim(),
          paymentStatus: String(r['Status Pembayaran'] || 'Lunas').trim(),
          startDate: String(r['Tanggal Mulai'] || '').trim(),
          expireDate: String(r['Tanggal Expired (otomatis)'] || '').trim(),
          usedSessions: used,
          remainingSessions: rem,
          status: String(r['Status Paket (otomatis)'] || (rem <= 0 ? 'Habis' : 'Aktif')).trim(),
          notes: String(r['Catatan'] || '').trim(),
          recordedInFinance: true
        };
      });

      const sysPurchases = appState.packagePurchases || [];
      const added = [];
      const updated = [];
      const unchanged = [];
      const matchedSysIds = new Set();

      excelPurchases.forEach(ePur => {
        const sMatch = sysPurchases.find(sPur => 
          (ePur.invoiceNo && sPur.invoiceNo && ePur.invoiceNo.toLowerCase() === sPur.invoiceNo.toLowerCase()) ||
          (ePur.id && sPur.id && ePur.id.toLowerCase() === sPur.id.toLowerCase()) ||
          (ePur.memberId && sPur.memberId === ePur.memberId && ePur.date === sPur.date && normalizeKey(ePur.packageName) === normalizeKey(sPur.packageName))
        );

        if (sMatch) {
          matchedSysIds.add(sMatch.id || sMatch.invoiceNo);
          const isMod = (ePur.price !== sMatch.price) ||
                        (ePur.sessions !== sMatch.sessions) ||
                        (ePur.remainingSessions !== sMatch.remainingSessions) ||
                        (ePur.status !== sMatch.status);
          if (isMod) {
            updated.push({ excel: ePur, system: sMatch, label: `${ePur.invoiceNo} · ${ePur.memberName} (${ePur.packageName})` });
          } else {
            unchanged.push({ excel: ePur, system: sMatch, label: `${ePur.invoiceNo} · ${ePur.memberName} (${ePur.packageName})` });
          }
        } else {
          added.push({ excel: ePur, label: `${ePur.invoiceNo} · ${ePur.memberName} (${ePur.packageName})` });
        }
      });

      const deleted = sysPurchases.filter(sPur => !matchedSysIds.has(sPur.id || sPur.invoiceNo)).map(sPur => ({
        system: sPur,
        label: `${sPur.invoiceNo} · ${sPur.memberName} (${sPur.packageName})`
      }));

      analysis.entities.purchases = {
        name: 'Pembelian Paket',
        icon: 'credit-card',
        sheetName: purchaseSheetName,
        excelData: excelPurchases,
        added,
        updated,
        unchanged,
        deleted,
        totalExcel: excelPurchases.length,
        totalSystem: sysPurchases.length
      };
    }

    // -------------------------------------------------------------
    // 3. ABSENSI KELAS (PRESENSI)
    // -------------------------------------------------------------
    const attendanceSheetName = findSheet(wb, ['ABSENSI KELAS', 'PRESENSI', 'ATTENDANCES', 'ABSENSI', 'Absensi Kelas']);
    if (attendanceSheetName) {
      analysis.sheetsFound.push(attendanceSheetName);
      const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[attendanceSheetName]);
      const validRows = rawRows.filter(r => r['Tanggal Kelas'] || r['Nama Member'] || r['ID Member']);

      const excelAttendances = validRows.map((r, idx) => {
        const st = String(r['Status Kehadiran'] || 'Hadir').trim();
        const isNoShow = st.toLowerCase().includes('no show');
        return {
          id: String(r['ID Absensi'] || ('att-' + (idx + 1))).trim(),
          transactionId: String(r['ID Transaksi Paket'] || '').trim(),
          memberId: String(r['ID Member (otomatis)'] || r['ID Member'] || '').trim(),
          memberName: String(r['Nama Member (otomatis)'] || r['Nama Member'] || '').trim(),
          className: String(r['Jenis Kelas'] || r['Kelas'] || '').trim(),
          classDate: String(r['Tanggal Kelas'] || r['Tgl Kelas'] || r['Tanggal'] || '').trim(),
          classTime: String(r['Jam Kelas'] || r['Jam'] || '').trim(),
          coachName: String(r['Instruktur'] || r['Coach'] || '').trim(),
          attendanceStatus: st,
          checkInStatus: isNoShow ? 'no_show' : 'checked_in',
          sessionsDeducted: parseInt(r['Sesi Terhitung (otomatis)'] || 1, 10),
          notes: String(r['Catatan'] || '').trim()
        };
      });

      const sysAttendances = appState.classAttendances || [];
      const added = [];
      const updated = [];
      const unchanged = [];
      const matchedSysIds = new Set();

      excelAttendances.forEach(eAtt => {
        const sMatch = sysAttendances.find(sAtt => 
          (eAtt.id && sAtt.id && eAtt.id === sAtt.id) ||
          (eAtt.classDate === sAtt.classDate && eAtt.classTime === sAtt.classTime && eAtt.memberId === sAtt.memberId && normalizeKey(eAtt.className) === normalizeKey(sAtt.className))
        );

        if (sMatch) {
          matchedSysIds.add(sMatch.id);
          const isMod = (eAtt.attendanceStatus !== sMatch.attendanceStatus) || (eAtt.coachName !== sMatch.coachName);
          if (isMod) {
            updated.push({ excel: eAtt, system: sMatch, label: `${eAtt.classDate} · ${eAtt.memberName} (${eAtt.className})` });
          } else {
            unchanged.push({ excel: eAtt, system: sMatch, label: `${eAtt.classDate} · ${eAtt.memberName} (${eAtt.className})` });
          }
        } else {
          added.push({ excel: eAtt, label: `${eAtt.classDate} · ${eAtt.memberName} (${eAtt.className})` });
        }
      });

      const deleted = sysAttendances.filter(sAtt => !matchedSysIds.has(sAtt.id)).map(sAtt => ({
        system: sAtt,
        label: `${sAtt.classDate} · ${sAtt.memberName} (${sAtt.className})`
      }));

      analysis.entities.attendances = {
        name: 'Presensi & Absensi',
        icon: 'clipboard-check',
        sheetName: attendanceSheetName,
        excelData: excelAttendances,
        added,
        updated,
        unchanged,
        deleted,
        totalExcel: excelAttendances.length,
        totalSystem: sysAttendances.length
      };
    }

    // -------------------------------------------------------------
    // 4. TARIF PAKET
    // -------------------------------------------------------------
    const tariffSheetName = findSheet(wb, ['TARIF PAKET', 'PAKET', 'HARGA PAKET', 'PACKAGES', 'Tarif Paket']);
    if (tariffSheetName) {
      analysis.sheetsFound.push(tariffSheetName);
      const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[tariffSheetName]);
      const validRows = rawRows.filter(r => r['Jenis Paket'] || r['Nama Paket']);

      const excelPackages = validRows.map((r, idx) => {
        const name = String(r['Jenis Paket'] || r['Nama Paket'] || ('Paket ' + (idx + 1))).trim();
        const price = parseInt(String(r['Harga Paket (isi admin)'] || r['Harga'] || 0).replace(/[^0-9]/g, '') || 0, 10);
        return {
          id: 'pkg-' + (idx + 1),
          name: name,
          category: name.toLowerCase().includes('cadillac') ? 'cadillac' : name.toLowerCase().includes('yoga') ? 'yoga' : 'reformer',
          sessions: parseInt(r['Jumlah Sesi'] || r['Sesi'] || 1, 10),
          normalPrice: price,
          promoPrice: price,
          validityDays: parseInt(r['Masa Aktif (hari)'] || r['Masa Aktif'] || 7, 10),
          active: true,
          firstTimerOnly: name.toLowerCase().includes('promo') || name.toLowerCase().includes('trial'),
          benefits: String(r['Keterangan'] || '').trim(),
          description: name + ' - ' + String(r['Keterangan'] || '').trim()
        };
      });

      const sysPackages = appState.packages || [];
      const added = [];
      const updated = [];
      const unchanged = [];
      const matchedSysIds = new Set();

      excelPackages.forEach(ePkg => {
        const sMatch = sysPackages.find(sPkg => normalizeKey(ePkg.name) === normalizeKey(sPkg.name));
        if (sMatch) {
          matchedSysIds.add(sMatch.id || sMatch.name);
          const isMod = (ePkg.normalPrice !== sMatch.normalPrice) || (ePkg.sessions !== sMatch.sessions);
          if (isMod) {
            updated.push({ excel: ePkg, system: sMatch, label: `${ePkg.name} (Rp ${formatIDR(ePkg.normalPrice)})` });
          } else {
            unchanged.push({ excel: ePkg, system: sMatch, label: `${ePkg.name} (Rp ${formatIDR(ePkg.normalPrice)})` });
          }
        } else {
          added.push({ excel: ePkg, label: `${ePkg.name} (Rp ${formatIDR(ePkg.normalPrice)})` });
        }
      });

      const deleted = sysPackages.filter(sPkg => !matchedSysIds.has(sPkg.id || sPkg.name)).map(sPkg => ({
        system: sPkg,
        label: `${sPkg.name} (Rp ${formatIDR(sPkg.normalPrice)})`
      }));

      analysis.entities.packages = {
        name: 'Tarif Paket',
        icon: 'tag',
        sheetName: tariffSheetName,
        excelData: excelPackages,
        added,
        updated,
        unchanged,
        deleted,
        totalExcel: excelPackages.length,
        totalSystem: sysPackages.length
      };
    }

    // -------------------------------------------------------------
    // 5. JADWAL KELAS (SCHEDULES)
    // -------------------------------------------------------------
    const scheduleSheetName = findSheet(wb, ['JADWAL KELAS', 'JADWAL', 'SCHEDULES', 'CALENDAR', 'Jadwal Kelas']);
    if (scheduleSheetName) {
      analysis.sheetsFound.push(scheduleSheetName);
      const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[scheduleSheetName]);
      const validRows = rawRows.filter(r => r['Tanggal Sesi'] || r['Tanggal'] || r['Nama Kelas']);

      const excelSchedules = validRows.map((r, idx) => ({
        id: String(r['ID Jadwal'] || r['ID'] || ('sch-' + Date.now() + '-' + idx)).trim(),
        classId: 'cls-auto',
        className: String(r['Nama Kelas'] || r['Kelas'] || 'Reformer').trim(),
        category: String(r['Kategori'] || 'reformer').trim().toLowerCase(),
        date: String(r['Tanggal Sesi'] || r['Tanggal'] || '').trim(),
        startTime: String(r['Jam Mulai'] || '08:00').trim(),
        endTime: String(r['Jam Selesai'] || '08:50').trim(),
        coachId: 'coach-auto',
        coachName: String(r['Coach Instruktur'] || r['Coach'] || r['Instruktur'] || '').trim(),
        room: String(r['Ruangan'] || 'Reformer Studio A').trim(),
        capacity: Number(r['Kapasitas Peserta'] || r['Kapasitas'] || 6),
        bookedCount: 0,
        status: String(r['Status'] || 'active').trim()
      }));

      const sysSchedules = appState.schedules || [];
      const added = [];
      const updated = [];
      const unchanged = [];
      const matchedSysIds = new Set();

      excelSchedules.forEach(eSch => {
        const sMatch = sysSchedules.find(sSch => 
          (eSch.id && sSch.id && eSch.id === sSch.id) ||
          (eSch.date === sSch.date && eSch.startTime === sSch.startTime && normalizeKey(eSch.className) === normalizeKey(sSch.className))
        );

        if (sMatch) {
          matchedSysIds.add(sMatch.id);
          const isMod = (eSch.coachName !== sMatch.coachName) || (eSch.capacity !== sMatch.capacity);
          if (isMod) {
            updated.push({ excel: eSch, system: sMatch, label: `${eSch.date} · ${eSch.startTime} (${eSch.className} - ${eSch.coachName})` });
          } else {
            unchanged.push({ excel: eSch, system: sMatch, label: `${eSch.date} · ${eSch.startTime} (${eSch.className} - ${eSch.coachName})` });
          }
        } else {
          added.push({ excel: eSch, label: `${eSch.date} · ${eSch.startTime} (${eSch.className} - ${eSch.coachName})` });
        }
      });

      const deleted = sysSchedules.filter(sSch => !matchedSysIds.has(sSch.id)).map(sSch => ({
        system: sSch,
        label: `${sSch.date} · ${sSch.startTime} (${sSch.className} - ${sSch.coachName})`
      }));

      analysis.entities.schedules = {
        name: 'Jadwal Sesi Kelas',
        icon: 'calendar',
        sheetName: scheduleSheetName,
        excelData: excelSchedules,
        added,
        updated,
        unchanged,
        deleted,
        totalExcel: excelSchedules.length,
        totalSystem: sysSchedules.length
      };
    }

    // -------------------------------------------------------------
    // HITUNG TOTAL REKAP & DETEKSI MODE SECARA CERDAS
    // -------------------------------------------------------------
    let grandExcel = 0;
    let grandSystem = 0;
    let grandAdded = 0;
    let grandUpdated = 0;
    let grandDeleted = 0;
    let grandUnchanged = 0;

    for (const ent of Object.values(analysis.entities)) {
      grandExcel += ent.totalExcel;
      grandSystem += ent.totalSystem;
      grandAdded += ent.added.length;
      grandUpdated += ent.updated.length;
      grandDeleted += ent.deleted.length;
      grandUnchanged += ent.unchanged.length;
    }

    analysis.summary.totalExcel = grandExcel;
    analysis.summary.totalSystem = grandSystem;
    analysis.summary.totalAdded = grandAdded;
    analysis.summary.totalUpdated = grandUpdated;
    analysis.summary.totalDeleted = grandDeleted;
    analysis.summary.totalUnchanged = grandUnchanged;

    // Logika Pintar Penentuan Mode:
    // Jika jumlah baris di Excel >= 50% data sistem, file mewakili Master Dataset Lengkap -> Full Sync!
    // Jika baris Excel < 50% dan sebagian besar merupakan data baru -> Incremental Append!
    if (grandSystem > 0 && grandExcel < (grandSystem * 0.45) && grandAdded > 0) {
      analysis.autoDetectedMode = 'incremental';
    } else {
      analysis.autoDetectedMode = 'full';
    }
    analysis.selectedMode = analysis.autoDetectedMode;

    return analysis;
  }

  /**
   * Menampilkan Modal Pratinjau Sinkronisasi Excel
   */
  function showExcelSyncModal(analysis) {
    currentSyncAnalysis = analysis;
    const modal = document.getElementById('excelSyncModal');
    if (!modal) return;

    // Subtitle & Header
    const subtitle = document.getElementById('esmFileSubtitle');
    if (subtitle) {
      subtitle.textContent = `Berkas: ${analysis.fileName} (${analysis.fileSize}) · Terbaca ${analysis.sheetsFound.length} Lembar Kerja Excel.`;
    }

    const badge = document.getElementById('esmDetectedModeBadge');
    if (badge) {
      if (analysis.autoDetectedMode === 'full') {
        badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30';
        badge.textContent = 'Terdeteksi: Master Lengkap (Full Sync)';
      } else {
        badge.className = 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30';
        badge.textContent = 'Terdeteksi: Tambahan Baru (Incremental)';
      }
    }

    renderModalBody();
    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }

  /**
   * Render Isi Modal Berdasarkan Mode yang Sedang Dipilih
   */
  function renderModalBody() {
    const container = document.getElementById('esmModalBody');
    if (!container || !currentSyncAnalysis) return;

    const a = currentSyncAnalysis;
    const isFull = a.selectedMode === 'full';

    // Summary numbers based on mode
    const effectiveDeleted = isFull ? a.summary.totalDeleted : 0;

    let html = `
      <!-- Pilihan Mode Sinkronisasi (Radio Cards) -->
      <div>
        <label class="block font-bold text-gray-700 text-xs mb-2">PILIH METODE PENYINKRONAN DATA:</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <!-- Mode 1: Full Sync (Mirror) -->
          <div onclick="window.setExcelSyncMode('full')" class="cursor-pointer p-4 rounded-xl border-2 transition ${isFull ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-500' : 'border-gray-200 bg-white hover:border-gray-300'}">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-2">
                <input type="radio" name="syncModeRadio" value="full" ${isFull ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500 h-4 w-4">
                <span class="font-bold text-gray-900 text-xs">Sinkronisasi Penuh (Mirror Excel)</span>
              </div>
              ${a.autoDetectedMode === 'full' ? '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 uppercase">Rekomendasi</span>' : ''}
            </div>
            <p class="text-[11px] text-gray-600 mt-2 leading-relaxed">
              Sesuaikan data sistem <strong>100% persis</strong> dengan Excel. Jika ada data yang <strong>dihapus dari Excel</strong>, otomatis data di sistem <strong>ikut dihapus</strong>.
            </p>
          </div>

          <!-- Mode 2: Incremental (Append) -->
          <div onclick="window.setExcelSyncMode('incremental')" class="cursor-pointer p-4 rounded-xl border-2 transition ${!isFull ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-500' : 'border-gray-200 bg-white hover:border-gray-300'}">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-2">
                <input type="radio" name="syncModeRadio" value="incremental" ${!isFull ? 'checked' : ''} class="text-blue-600 focus:ring-blue-500 h-4 w-4">
                <span class="font-bold text-gray-900 text-xs">Hanya Tambah / Update Data Terakhir</span>
              </div>
              ${a.autoDetectedMode === 'incremental' ? '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-200 text-blue-900 uppercase">Rekomendasi</span>' : ''}
            </div>
            <p class="text-[11px] text-gray-600 mt-2 leading-relaxed">
              Hanya menambahkan baris data terbaru atau memperbarui data yang cocok. <strong>Data lama di sistem TIDAK dihapus</strong> (aman untuk upload data parsial).
            </p>
          </div>

        </div>
      </div>

      <!-- KPI Summary Pills -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span class="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Data Baru Ditambah</span>
          <span class="text-lg font-bold text-emerald-900 font-mono">+${a.summary.totalAdded}</span>
        </div>
        <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <span class="text-[10px] text-blue-800 font-bold uppercase tracking-wider block">Data Diperbarui</span>
          <span class="text-lg font-bold text-blue-900 font-mono">~${a.summary.totalUpdated}</span>
        </div>
        <div class="p-3 ${effectiveDeleted > 0 ? 'bg-red-50 border-red-200 text-red-900' : 'bg-gray-50 border-gray-200 text-gray-600'} border rounded-xl">
          <span class="text-[10px] ${effectiveDeleted > 0 ? 'text-red-700' : 'text-gray-500'} font-bold uppercase tracking-wider block">Data Dihapus</span>
          <span class="text-lg font-bold ${effectiveDeleted > 0 ? 'text-red-900' : 'text-gray-700'} font-mono">${effectiveDeleted > 0 ? '-' + effectiveDeleted : '0'}</span>
        </div>
        <div class="p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Data Tidak Berubah</span>
          <span class="text-lg font-bold text-gray-800 font-mono">=${a.summary.totalUnchanged}</span>
        </div>
      </div>

      <!-- Detail Per Kategori / Sheet -->
      <div class="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 flex items-center justify-between">
          <span>Rincian Per Lembar Kerja Excel:</span>
          <span class="text-[11px] text-gray-500 font-normal">Excel vs Sistem Saat Ini</span>
        </div>
        <div class="divide-y divide-gray-100">
    `;

    for (const [key, ent] of Object.entries(a.entities)) {
      const delCount = isFull ? ent.deleted.length : 0;
      html += `
        <div class="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50/50 transition">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-7 rounded-lg bg-sage-100 text-sage-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
              ${ent.name.charAt(0)}
            </span>
            <div>
              <div class="font-bold text-gray-900">${ent.name} <span class="text-gray-400 font-normal">(${ent.sheetName})</span></div>
              <div class="text-[11px] text-gray-500">Excel: ${ent.totalExcel} baris · Sistem: ${ent.totalSystem} data</div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap text-[11px] font-mono font-semibold">
            ${ent.added.length > 0 ? `<span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">+${ent.added.length} baru</span>` : ''}
            ${ent.updated.length > 0 ? `<span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800">~${ent.updated.length} ubah</span>` : ''}
            ${delCount > 0 ? `<span class="px-2 py-0.5 rounded bg-red-100 text-red-800">-${delCount} hapus</span>` : ''}
            ${ent.added.length === 0 && ent.updated.length === 0 && delCount === 0 ? `<span class="px-2 py-0.5 rounded bg-gray-100 text-gray-600">Sinkron (sama)</span>` : ''}
          </div>
        </div>
      `;
    }

    html += `
        </div>
      </div>
    `;

    // Jika ada data yang dihapus dan memilih mode Full Sync, tampilkan rincian apa saja yang dihapus
    if (isFull && a.summary.totalDeleted > 0) {
      html += `
        <div class="border border-red-200 bg-red-50/60 rounded-xl p-3.5 space-y-2">
          <div class="flex items-center justify-between text-red-900 font-bold">
            <span class="flex items-center gap-1.5">
              ⚠️ Rincian ${a.summary.totalDeleted} Data di Sistem yang Dihapus dari Excel (Akan Ikut Dihapus):
            </span>
          </div>
          <div class="max-h-36 overflow-y-auto space-y-1 pr-1 text-[11px]">
      `;

      for (const ent of Object.values(a.entities)) {
        if (ent.deleted.length > 0) {
          html += `<div class="font-bold text-red-950 mt-1">${ent.name} (${ent.deleted.length} data):</div>`;
          ent.deleted.forEach(del => {
            html += `<div class="text-red-800 pl-3 flex items-center gap-1.5"><span>•</span> <span class="font-medium">${del.label}</span></div>`;
          });
        }
      }

      html += `
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  /**
   * Ubah Mode Sinkronisasi Secara Dinamis di Modal
   */
  window.setExcelSyncMode = function(mode) {
    if (!currentSyncAnalysis) return;
    currentSyncAnalysis.selectedMode = mode;
    renderModalBody();
  };

  /**
   * Terapkan Sinkronisasi ke Database Sistem
   */
  window.applyPendingExcelSync = function() {
    if (!currentSyncAnalysis) return;

    const a = currentSyncAnalysis;
    const isFull = a.selectedMode === 'full';

    // 1. Members
    if (a.entities.members) {
      const ent = a.entities.members;
      if (isFull) {
        // Full Sync: Mirror Excel data 100%
        appState.members = ent.excelData;
      } else {
        // Incremental Append: Update matched + append new
        ent.updated.forEach(u => {
          const idx = appState.members.findIndex(m => m.id === u.system.id || m.memberCode === u.system.memberCode);
          if (idx !== -1) {
            appState.members[idx] = { ...appState.members[idx], ...u.excel };
          }
        });
        ent.added.forEach(ad => {
          appState.members.push(ad.excel);
        });
      }
    }

    // 2. Purchases
    if (a.entities.purchases) {
      const ent = a.entities.purchases;
      if (isFull) {
        appState.packagePurchases = ent.excelData;
      } else {
        ent.updated.forEach(u => {
          const idx = appState.packagePurchases.findIndex(p => p.id === u.system.id || p.invoiceNo === u.system.invoiceNo);
          if (idx !== -1) {
            appState.packagePurchases[idx] = { ...appState.packagePurchases[idx], ...u.excel };
          }
        });
        ent.added.forEach(ad => {
          appState.packagePurchases.push(ad.excel);
        });
      }
    }

    // 3. Attendances
    if (a.entities.attendances) {
      const ent = a.entities.attendances;
      if (isFull) {
        appState.classAttendances = ent.excelData;
      } else {
        ent.updated.forEach(u => {
          const idx = appState.classAttendances.findIndex(att => att.id === u.system.id);
          if (idx !== -1) {
            appState.classAttendances[idx] = { ...appState.classAttendances[idx], ...u.excel };
          }
        });
        ent.added.forEach(ad => {
          appState.classAttendances.push(ad.excel);
        });
      }
    }

    // 4. Packages
    if (a.entities.packages) {
      const ent = a.entities.packages;
      if (isFull) {
        appState.packages = ent.excelData;
      } else {
        ent.updated.forEach(u => {
          const idx = appState.packages.findIndex(p => normalizeKey(p.name) === normalizeKey(u.system.name));
          if (idx !== -1) {
            appState.packages[idx] = { ...appState.packages[idx], ...u.excel };
          }
        });
        ent.added.forEach(ad => {
          appState.packages.push(ad.excel);
        });
      }
    }

    // 5. Schedules
    if (a.entities.schedules) {
      const ent = a.entities.schedules;
      if (isFull) {
        appState.schedules = ent.excelData;
      } else {
        ent.updated.forEach(u => {
          const idx = appState.schedules.findIndex(s => s.id === u.system.id);
          if (idx !== -1) {
            appState.schedules[idx] = { ...appState.schedules[idx], ...u.excel };
          }
        });
        ent.added.forEach(ad => {
          appState.schedules.push(ad.excel);
        });
      }
    }

    // Rekalkulasi sesi & kuota member
    if (appState.members && appState.packagePurchases) {
      appState.members.forEach(m => {
        const purchases = appState.packagePurchases.filter(p => p.memberId === m.memberCode || p.memberId === m.id);
        if (purchases.length > 0) {
          m.packageName = purchases[purchases.length - 1].packageName;
          m.remainingSessions = purchases.reduce((sum, p) => sum + (p.remainingSessions || 0), 0);
          m.totalSessions = purchases.reduce((sum, p) => sum + (p.sessions || 0), 0);
        } else {
          m.packageName = 'Belum Ada Paket';
          m.remainingSessions = 0;
          m.totalSessions = 0;
        }
      });
    }

    // Simpan & refresh antarmuka
    saveState();
    renderAdminCurrentTab();
    updateAdminStats();
    if (window.updateMasterTopBannerStats) updateMasterTopBannerStats();
    closeExcelSyncModal();

    // Notifikasi hasil sinkronisasi
    if (isFull) {
      const delMsg = a.summary.totalDeleted > 0 ? `, dan -${a.summary.totalDeleted} data dihapus sesuai Excel` : '';
      showToast(`Sinkronisasi Penuh Selesai! (+${a.summary.totalAdded} baru, ~${a.summary.totalUpdated} diperbarui${delMsg}). Data sistem kini 100% identik dengan Excel.`, 'success');
    } else {
      showToast(`Penambahan Data Berhasil! (+${a.summary.totalAdded} data baru berhasil ditambahkan langsung ke sistem tanpa menghapus data lama).`, 'success');
    }
  };

  /**
   * Tutup Modal Sinkronisasi
   */
  window.closeExcelSyncModal = function() {
    const modal = document.getElementById('excelSyncModal');
    if (modal) modal.classList.add('hidden');
    currentSyncAnalysis = null;
  };

  /**
   * Entry Point Utama saat Berkas Excel Dipilih
   */
  window.processMasterExcelUpload = function(file) {
    if (!file) return;

    if (typeof XLSX === 'undefined') {
      alert('Library SheetJS belum terpasang!');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const analysis = analyzeExcelFile(wb, file.name, file.size);
        showExcelSyncModal(analysis);
      } catch (err) {
        console.error(err);
        alert('Gagal membaca berkas Excel: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  /**
   * Inisialisasi Drag & Drop pada Area Upload Excel
   */
  window.initExcelDropzone = function() {
    const dropzone = document.getElementById('studioExcelDropzone');
    if (!dropzone) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('border-sage-600', 'bg-sage-100/80');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('border-sage-600', 'bg-sage-100/80');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        window.processMasterExcelUpload(files[0]);
      }
    }, false);
  };

})(window, document);
