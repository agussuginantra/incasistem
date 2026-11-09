/**
 * ============================================================================
 * INCA PILATES & MINDFUL MOVEMENT
 * Google Sheets Cloud Database Connector & Universal Sync Engine (v2.0)
 * ============================================================================
 * Features:
 * - Real-time cloud sync with Google Sheets (10 Master Tables)
 * - Automatic hooks for Manual Input (Users, Members, Purchases, Check-in, Schedules, etc.)
 * - Automatic hooks for Excel Uploads (Master Studio, Buku Besar, Petty Cash)
 * - Offline fallback (LocalStorage first, background cloud push)
 * - Connection status indicator (🟢 Cloud DB: Aktif / 🟡 Database: Lokal)
 */

(function() {
  const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxDTJURVmOluphpJjTxZYGPymW5TBHLNFtnJAQByBaVTdEWUUG1HOPwQeCDu_MiiQ0W/exec';
  const OLD_WEB_APP_URLS = [
    'https://script.google.com/macros/s/AKfycbzTyexsJv5vGvWYMcjN9uydLBdUJ5WHEPLmKBLpE7CFZvgOmSXU3tOJPt4953SZuYFV/exec',
    'https://script.google.com/macros/s/AKfycbwaF2-bVnUdG6e3lj9Vm9OcHd0ivTgpKzkeQdJJhtNDq1mEnbAX_rgLdpy1bZM14pBi/exec'
  ];
  const STORAGE_KEY_URL = 'INCA_GOOGLE_SHEETS_URL';
  const STORAGE_KEY_AUTO = 'INCA_GOOGLE_SHEETS_AUTO_SYNC';

  // Otomatis migrasikan URL lama jika tersimpan di LocalStorage browser user ke URL v2.0 terbaru
  try {
    const existingUrl = localStorage.getItem(STORAGE_KEY_URL);
    if (!existingUrl || OLD_WEB_APP_URLS.includes(existingUrl.trim()) || existingUrl.trim() !== DEFAULT_WEB_APP_URL) {
      localStorage.setItem(STORAGE_KEY_URL, DEFAULT_WEB_APP_URL);
    }
  } catch (e) {}

  window.GoogleSheetsSync = {
    getUrl: function() {
      let stored = localStorage.getItem(STORAGE_KEY_URL);
      if (!stored || OLD_WEB_APP_URLS.includes(stored.trim()) || stored.trim() !== DEFAULT_WEB_APP_URL) {
        stored = DEFAULT_WEB_APP_URL;
        try { localStorage.setItem(STORAGE_KEY_URL, DEFAULT_WEB_APP_URL); } catch (e) {}
      }
      return stored || DEFAULT_WEB_APP_URL;
    },
    setUrl: function(url) {
      if (url && url.trim().length > 0) {
        localStorage.setItem(STORAGE_KEY_URL, url.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_URL);
      }
      this.updateIndicator();
    },
    isAutoSync: function() {
      return localStorage.getItem(STORAGE_KEY_AUTO) !== 'false'; // default true
    },
    setAutoSync: function(val) {
      localStorage.setItem(STORAGE_KEY_AUTO, val ? 'true' : 'false');
    },

    // Check connection with ping
    testConnection: async function(overrideUrl) {
      const url = overrideUrl || this.getUrl();
      if (!url) {
        return { success: false, message: 'URL Google Apps Script belum diisi.' };
      }
      try {
        const pingUrl = url + (url.includes('?') ? '&' : '?') + 'action=ping&t=' + Date.now();
        const res = await fetch(pingUrl, { method: 'GET' });
        if (!res.ok) throw new Error('HTTP Status: ' + res.status);
        const data = await res.json();
        return { success: true, data: data };
      } catch (err) {
        return { success: false, message: 'Gagal terhubung: ' + err.message + '. Pastikan hak akses Web App disetel ke "Siapa saja (Anyone)".' };
      }
    },

    // Universal Background Push
    pushRecord: async function(action, recordData) {
      const url = this.getUrl();
      if (!url || !this.isAutoSync()) return;

      try {
        const payload = {
          action: action,
          data: recordData,
          timestamp: new Date().toISOString()
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        
        if (res.ok) {
          const json = await res.json();
          console.log(`[Cloud DB Sync: ${action}]`, json.message || 'Tersimpan');
          return json;
        }
      } catch (e) {
        console.warn(`[Cloud DB Notice: ${action}] Data aman di lokal, sync tertunda:`, e);
      }
    },

    // Convenience Handlers for Specific Entities
    pushUser: function(action, userData) {
      return this.pushRecord(action || 'saveUser', userData);
    },
    pushMember: function(action, memberData) {
      return this.pushRecord(action || 'saveMember', memberData);
    },
    pushPurchase: function(purchaseData) {
      return this.pushRecord('savePurchase', purchaseData);
    },
    pushAttendance: function(attendanceData) {
      return this.pushRecord('saveAttendance', attendanceData);
    },
    pushSchedule: function(action, scheduleData) {
      return this.pushRecord(action || 'saveSchedule', scheduleData);
    },
    pushClass: function(action, classData) {
      return this.pushRecord(action || 'saveClass', classData);
    },
    pushPackage: function(action, packageData) {
      return this.pushRecord(action || 'savePackage', packageData);
    },
    pushCoach: function(action, coachData) {
      return this.pushRecord(action || 'saveCoach', coachData);
    },
    pushLead: function(action, leadData) {
      return this.pushRecord(action || 'saveLead', leadData);
    },
    pushFinance: function(entryData) {
      return this.pushRecord('saveFinanceEntry', entryData);
    },

    // Excel Studio Upload Sync
    syncExcelStudioData: async function(studioData) {
      const url = this.getUrl();
      if (!url || !this.isAutoSync()) return;

      if (typeof showToast === 'function') {
        showToast('Menyinkronkan data Excel ke Google Sheets Cloud DB...', 'info');
      }

      try {
        const payload = {
          action: 'syncExcelStudio',
          data: {
            members: studioData.members || [],
            packagePurchases: studioData.packagePurchases || [],
            classAttendances: studioData.classAttendances || [],
            schedules: studioData.schedules || []
          },
          timestamp: new Date().toISOString()
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const json = await res.json();
          if (typeof showToast === 'function') {
            showToast('✅ Berhasil menyinkronkan seluruh data Excel ke Google Sheets!', 'success');
          }
          return json;
        }
      } catch (err) {
        console.warn('Gagal sync Excel ke Google Sheets (tetap aman di browser):', err);
      }
    },

    // Excel Finance Upload Sync
    syncExcelFinanceData: async function(entries) {
      const url = this.getUrl();
      if (!url || !this.isAutoSync()) return;

      if (typeof showToast === 'function') {
        showToast('Menyinkronkan transaksi keuangan Excel ke Google Sheets...', 'info');
      }

      try {
        const payload = {
          action: 'syncExcelFinance',
          data: entries || [],
          timestamp: new Date().toISOString()
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const json = await res.json();
          if (typeof showToast === 'function') {
            showToast('✅ Transaksi Excel berhasil disimpan ke Google Sheets!', 'success');
          }
          return json;
        }
      } catch (err) {
        console.warn('Gagal sync Finance Excel ke Google Sheets:', err);
      }
    },

    // Bulk Sync All 10 Tables
    syncAllToCloud: async function() {
      const url = this.getUrl();
      if (!url) throw new Error('URL Google Apps Script belum diisi.');

      const state = (typeof appState !== 'undefined') ? appState : (window.appState || {});
      
      // Get users from user-management
      const users = (typeof getSystemAppState === 'function') 
        ? (getSystemAppState().users || []) 
        : (state.users || window.DEFAULT_SYSTEM_USERS || []);

      // Get finance entries
      let financeEntries = [];
      try {
        if (typeof state !== 'undefined' && state.entries) {
          financeEntries = state.entries;
        } else {
          const rawFin = localStorage.getItem('inca_finance_state_v1');
          if (rawFin) {
            const parsedFin = JSON.parse(rawFin);
            financeEntries = parsedFin.entries || [];
          }
        }
      } catch (e) {}

      const payload = {
        action: 'syncAll',
        data: {
          users: users,
          members: state.members || [],
          packagePurchases: state.packagePurchases || [],
          classAttendances: state.classAttendances || [],
          schedules: state.schedules || [],
          classes: state.classes || [],
          packages: state.packages || [],
          coaches: state.coaches || [],
          leads: state.leads || [],
          financeEntries: financeEntries
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    },

    // Pull All Tables from Cloud
    pullFromCloud: async function() {
      const url = this.getUrl();
      if (!url) throw new Error('URL Google Apps Script belum diisi.');

      const getAllUrl = url + (url.includes('?') ? '&' : '?') + 'action=getAll&t=' + Date.now();
      const res = await fetch(getAllUrl, { method: 'GET' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    },

    // Update Header Status Indicator
    updateIndicator: function() {
      const el = document.getElementById('cloudDbIndicator');
      if (!el) return;
      const url = this.getUrl();
      if (url) {
        el.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[10.5px] font-medium cursor-pointer hover:bg-emerald-900/80 transition whitespace-nowrap';
        el.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span>Cloud DB: Aktif</span>';
        el.title = 'Terhubung ke Google Sheets Database. Klik untuk pengaturan.';
      } else {
        el.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 text-[10.5px] font-medium cursor-pointer hover:bg-gray-800 transition whitespace-nowrap';
        el.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>Database: Lokal</span>';
        el.title = 'Berjalan 100% Offline (Lokal). Klik untuk menghubungkan ke Google Sheets.';
      }
    }
  };

  // UI Modal Handlers
  window.openCloudDbModal = function() {
    const modal = document.getElementById('cloudDbModal');
    if (!modal) return;
    const urlInput = document.getElementById('cloudDbUrl');
    const autoSyncCheckbox = document.getElementById('cloudDbAutoSync');
    if (urlInput) urlInput.value = window.GoogleSheetsSync.getUrl();
    if (autoSyncCheckbox) autoSyncCheckbox.checked = window.GoogleSheetsSync.isAutoSync();
    
    const statusMsg = document.getElementById('cloudDbStatusMsg');
    if (statusMsg) statusMsg.innerHTML = '';
    modal.classList.remove('hidden');
  };

  window.closeCloudDbModal = function() {
    const modal = document.getElementById('cloudDbModal');
    if (modal) modal.classList.add('hidden');
  };

  window.handleSaveCloudDbConfig = async function(e) {
    if (e) e.preventDefault();
    const urlInput = document.getElementById('cloudDbUrl');
    const autoSyncCheckbox = document.getElementById('cloudDbAutoSync');
    const statusMsg = document.getElementById('cloudDbStatusMsg');
    const url = urlInput ? urlInput.value.trim() : '';

    if (!url) {
      window.GoogleSheetsSync.setUrl('');
      if (statusMsg) {
        statusMsg.innerHTML = '<div class="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs">Pengaturan disimpan: Sistem beroperasi dalam mode <b>Offline (Lokal)</b>.</div>';
      }
      setTimeout(closeCloudDbModal, 1500);
      return;
    }

    if (statusMsg) {
      statusMsg.innerHTML = '<div class="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 text-xs flex items-center gap-2"><span class="animate-spin inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></span> Menguji koneksi ke Google Sheets API...</div>';
    }

    const test = await window.GoogleSheetsSync.testConnection(url);
    if (test.success) {
      window.GoogleSheetsSync.setUrl(url);
      window.GoogleSheetsSync.setAutoSync(autoSyncCheckbox ? autoSyncCheckbox.checked : true);
      if (statusMsg) {
        statusMsg.innerHTML = `<div class="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs">
          <strong>✅ Berhasil Terhubung!</strong><br>
          Spreadsheet: <b>${test.data.spreadsheetTitle || 'INCA Database'}</b> (${test.data.sheets ? test.data.sheets.length : 0} sheets terdeteksi).
        </div>`;
      }
      if (typeof showToast === 'function') showToast('Google Sheets Database terhubung!', 'success');
      setTimeout(closeCloudDbModal, 1800);
    } else {
      if (statusMsg) {
        statusMsg.innerHTML = `<div class="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs">
          <strong>❌ Gagal Terhubung:</strong> ${test.message}
        </div>`;
      }
    }
  };

  window.handleBulkSyncToGoogleSheets = async function() {
    const btn = document.getElementById('btnBulkSyncCloud');
    const statusMsg = document.getElementById('cloudDbStatusMsg');
    if (btn) btn.disabled = true;
    if (statusMsg) {
      statusMsg.innerHTML = '<div class="p-3 bg-purple-50 text-purple-700 rounded-xl border border-purple-200 text-xs flex items-center gap-2"><span class="animate-spin inline-block w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"></span> Mengunggah seluruh 10 Tabel Database ke Google Sheets...</div>';
    }

    try {
      const res = await window.GoogleSheetsSync.syncAllToCloud();
      if (statusMsg) {
        statusMsg.innerHTML = '<div class="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs"><b>✅ Berhasil!</b> Seluruh 10 tabel data lokal telah tersinkronisasi ke Google Sheets.</div>';
      }
      if (typeof showToast === 'function') showToast('Sinkronisasi Google Sheets Berhasil!', 'success');
    } catch (e) {
      if (statusMsg) {
        statusMsg.innerHTML = `<div class="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs"><b>Gagal Sinkronisasi:</b> ${e.message}</div>`;
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  };

  window.handlePullAllFromCloud = async function() {
    if (typeof showToast === 'function') showToast('Mengunduh seluruh database dari Google Sheets...', 'info');
    try {
      const res = await window.GoogleSheetsSync.pullFromCloud();
      if (res && res.status === 'success' && res.data) {
        if (typeof appState !== 'undefined') {
          // 1. Members (hanya yang valid, abaikan baris rumus kosong)
          if (Array.isArray(res.data.DB_Member) && res.data.DB_Member.length > 0) {
            const validMembers = res.data.DB_Member.filter(r => (r['Nama Lengkap'] || r['Nama Member']) && String(r['Nama Lengkap'] || r['Nama Member']).trim() !== '');
            if (validMembers.length > 0) {
              appState.members = validMembers.map(r => ({
                id: r['ID Member'] || r['Kode Member'],
                memberCode: r['Kode Member'] || r['ID Member'],
                name: r['Nama Lengkap'] || r['Nama Member'] || '',
                phone: r['Nomor WhatsApp'] || '',
                email: r['Email'] || '',
                joinedDate: r['Tanggal Bergabung'] || '',
                packageName: r['Nama Paket'] || r['Paket Aktif'] || 'Belum Ada Paket',
                remainingSessions: Number(r['Sisa Sesi'] !== undefined ? r['Sisa Sesi'] : r['Sisa Kuota Sesi']) || 0,
                totalSessions: Number(r['Total Sesi'] !== undefined ? r['Total Sesi'] : r['Total Kuota Sesi']) || 0,
                status: r['Status'] || r['Status Akun'] || 'active',
                source: r['Sumber'] || r['Sumber Data'] || 'Sistem Web',
                notes: r['Catatan'] || ''
              }));
            }
          }
          // 2. Purchases (hanya yang memiliki ID Member valid)
          if (Array.isArray(res.data.DB_Pembelian) && res.data.DB_Pembelian.length > 0) {
            const validPurchases = res.data.DB_Pembelian.filter(r => (r['ID Member'] || r['Nama Member']) && String(r['ID Member'] || r['Nama Member']).trim() !== '');
            if (validPurchases.length > 0) {
              appState.packagePurchases = validPurchases.map(r => ({
                id: r['ID Transaksi'],
                invoiceNo: r['Nomor Invoice'] || r['ID Transaksi'],
                date: r['Tanggal'],
                memberId: r['ID Member'],
                memberName: r['Nama Member'],
                packageId: r['ID Paket'] || 'pkg-custom',
                packageName: r['Nama Paket'],
                sessions: Number(r['Jumlah Sesi']) || 0,
                normalPrice: Number(r['Harga Normal (Rp)']) || 0,
                discount: Number(r['Diskon (Rp)']) || 0,
                price: Number(r['Total Bayar (Rp)']) || 0,
                paymentMethod: r['Metode Pembayaran'] || 'Transfer BCA',
                paymentStatus: r['Status Pembayaran'] || 'Lunas',
                startDate: r['Mulai Aktif'] || '',
                expireDate: r['Berlaku Sampai'] || '',
                usedSessions: Number(r['Sesi Terpakai']) || 0,
                remainingSessions: Number(r['Sisa Sesi']) || 0,
                status: r['Status'] || r['Status Transaksi'] || 'Aktif'
              }));
            }
          }
          // 3. Jadwal Ploting Sesi (DB_Jadwal)
          if (Array.isArray(res.data.DB_Jadwal) && res.data.DB_Jadwal.length > 0) {
            const validSchedules = res.data.DB_Jadwal.filter(r => (r['Tanggal'] || r['Format Tgl'] || r['ID Jadwal']) && String(r['Tanggal'] || r['Format Tgl'] || r['ID Jadwal']).trim() !== '');
            if (validSchedules.length > 0) {
              appState.schedules = validSchedules.map((r, idx) => {
                let d = r['Tanggal'] || r['Format Tgl'] || '';
                if (typeof d === 'number' || (!isNaN(d) && !isNaN(parseFloat(d)) && String(d).length === 5)) {
                  const serial = parseFloat(d);
                  const utc_days = Math.floor(serial - 25569);
                  const date_info = new Date(utc_days * 86400 * 1000);
                  d = date_info.toISOString().split('T')[0];
                } else if (typeof d === 'string') {
                  const m = d.match(/^\d{4}-\d{2}-\d{2}/);
                  if (m) d = m[0];
                }

                let startTime = '09:00';
                const rawStart = String(r['Jam Mulai'] || r['Jam Sesi'] || '').trim();
                const mStart = rawStart.match(/T(\d{2}):(\d{2})/);
                if (mStart) {
                  startTime = `${mStart[1]}:${mStart[2]}`;
                } else if (/^\d{1,2}:\d{2}/.test(rawStart)) {
                  startTime = rawStart.slice(0, 5).padStart(5, '0');
                }

                let endTime = '10:00';
                const rawEnd = String(r['Jam Selesai'] || '').trim();
                const mEnd = rawEnd.match(/T(\d{2}):(\d{2})/);
                if (mEnd) {
                  endTime = `${mEnd[1]}:${mEnd[2]}`;
                } else if (/^\d{1,2}:\d{2}/.test(rawEnd)) {
                  endTime = rawEnd.slice(0, 5).padStart(5, '0');
                } else {
                  const [sh, sm] = startTime.split(':').map(Number);
                  endTime = `${String(sh + 1).padStart(2, '0')}:${String(sm || 0).padStart(2, '0')}`;
                }

                return {
                  id: r['ID Jadwal'] || ('sch-' + (idx + 1)),
                  date: d,
                  displayDate: d,
                  startTime: startTime,
                  endTime: endTime,
                  classId: r['ID Kelas'] || 'cls-reformer',
                  className: r['Nama Kelas'] || 'Reformer',
                  category: r['Kategori'] || '',
                  coachId: r['ID Coach'] || 'c-1',
                  coachName: r['Nama Coach'] || r['Instruktur'] || 'Coach Yuli',
                  room: r['Ruangan'] || 'Main Pilates Studio (Apparatus Room)',
                  capacity: Number(r['Kapasitas Kuota'] || r['Kapasitas']) || 4,
                  bookedCount: Number(r['Jumlah Terdaftar'] || r['Terdaftar']) || 0,
                  status: r['Status'] || (d < new Date().toISOString().slice(0, 10) ? 'completed' : 'scheduled'),
                  notes: r['Catatan'] || ''
                };
              });
            }
          }

          // 4. Presensi (normalisasi format tanggal nomor serial dan jam)
          if (Array.isArray(res.data.DB_Presensi) && res.data.DB_Presensi.length > 0) {
            const validPresensi = res.data.DB_Presensi.filter(r => (r['Nama Member'] || r['ID Member']) && String(r['Nama Member'] || r['ID Member']).trim() !== '');
            if (validPresensi.length > 0) {
              appState.classAttendances = validPresensi.map((r, idx) => {
                let d = r['Tanggal Sesi'] || r['Tanggal Kelas'] || r['Tanggal'] || '';
                if (typeof d === 'number' || (!isNaN(d) && !isNaN(parseFloat(d)) && String(d).length === 5)) {
                  const serial = parseFloat(d);
                  const utc_days = Math.floor(serial - 25569);
                  const date_info = new Date(utc_days * 86400 * 1000);
                  d = date_info.toISOString().split('T')[0];
                } else if (typeof d === 'string') {
                  const m = d.match(/^\d{4}-\d{2}-\d{2}/);
                  if (m) d = m[0];
                }

                let timeStr = '09:00';
                const rawTime = String(r['Jam Sesi'] || r['Jam Kelas'] || '').trim();
                const mTime = rawTime.match(/T(\d{2}):(\d{2})/);
                if (mTime) {
                  timeStr = `${mTime[1]}:${mTime[2]}`;
                } else if (/^\d{1,2}:\d{2}/.test(rawTime)) {
                  timeStr = rawTime.slice(0, 5).padStart(5, '0');
                } else if (rawTime && !rawTime.includes(':')) {
                  const hr = parseInt(rawTime, 10);
                  if (!isNaN(hr)) timeStr = String(hr).padStart(2, '0') + ':00';
                }

                const st = r['Status Kehadiran'] || 'Hadir';
                const isNoShow = String(st).toLowerCase().includes('no show');
                const rawCheckIn = r['Status Check-In'] || '';
                const checkInStatus = isNoShow ? 'no_show' : (rawCheckIn || (String(st).toLowerCase().includes('menunggu') ? 'booked' : 'checked_in'));

                const clsName = r['Nama Kelas'] || r['Jenis Kelas'] || 'Reformer';
                const coachName = r['Instruktur / Coach'] || r['Instruktur'] || 'Coach Yuli';

                // Tautkan scheduleId ke jadwal yang ada jika belum tersedia
                let schedId = r['ID Jadwal'] || r['scheduleId'] || '';
                if (!schedId && Array.isArray(appState.schedules)) {
                  const matchedSch = appState.schedules.find(s => {
                    const sDate = (s.date || '').slice(0, 10);
                    const sTime = (s.startTime || '').slice(0, 5);
                    return sDate === d && sTime === timeStr;
                  });
                  if (matchedSch) schedId = matchedSch.id;
                }

                return {
                  id: r['ID Presensi'] || ('att-' + (idx + 1)),
                  scheduleId: schedId,
                  date: d,
                  classDate: d,
                  time: timeStr,
                  classTime: timeStr,
                  className: clsName,
                  coachName: coachName,
                  memberId: r['ID Member'] || '',
                  memberName: r['Nama Member'] || '',
                  memberPhone: r['Nomor WhatsApp'] || '',
                  paymentType: r['Tipe Pembayaran'] || 'package',
                  packageName: r['Paket Digunakan'] || 'Paket Pilates',
                  checkInStatus: checkInStatus,
                  checkInTime: r['Waktu Check-In'] || (checkInStatus === 'checked_in' ? timeStr : ''),
                  sessionsDeducted: Number(r['Potong Sesi']) || 1,
                  attendanceStatus: st,
                  notes: r['Catatan'] || ''
                };
              });

              // Pastikan semua presensi memiliki sesi di kalender
              if (typeof window.ensureSchedulesFromAttendances === 'function') {
                window.ensureSchedulesFromAttendances();
              }
            }
          }
        }
        // 4. Users
        if (typeof window.fetchUsersFromCloudDb === 'function') {
          await window.fetchUsersFromCloudDb();
        }
        if (typeof saveState === 'function') saveState();
        if (typeof renderAdminCurrentTab === 'function') renderAdminCurrentTab();
        if (typeof updateAdminStats === 'function') updateAdminStats();
        if (typeof showToast === 'function') showToast(`✅ Sinkronisasi Berhasil: ${appState.members.length} Member, ${appState.packagePurchases.length} Pembelian aktif.`, 'success');
      }
    } catch (e) {
      if (typeof showToast === 'function') showToast('Gagal sinkronisasi dari Cloud: ' + e.message, 'error');
    }
  };

  // Init indicator when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    window.GoogleSheetsSync.updateIndicator();
  });
})();
