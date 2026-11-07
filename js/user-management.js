/**
 * INCA PILATES & MINDFUL MOVEMENT
 * User Management & Role-Based Access Control (RBAC) Module
 * Features:
 * - Gate Login Screen (Portal Masuk sebelum masuk ke sistem)
 * - Session Management (SessionStorage & Remember Me)
 * - Granular Menu Permissions (Admin Studio + INCA Finance)
 * - User CRUD (Tambah, Edit, Hapus, Reset Password, Toggle Aktif/Nonaktif)
 */

// 1. DAFTAR SELURUH HAK AKSES MENU SISTEM (GRANULAR PERMISSIONS)
const SYSTEM_PERMISSIONS = [
  // Modul Admin Studio
  { id: 'studio_dashboard', module: 'Admin Studio', code: '1. Dashboard', label: 'Dashboard & Kalender Bulanan', desc: 'Akses ringkasan KPI dan agenda kalender kelas interaktif' },
  { id: 'studio_members', module: 'Admin Studio', code: '2. Member', label: 'Pengelolaan Database Member', desc: 'Kelola data member, WhatsApp, sisa sesi, dan riwayat paket' },
  { id: 'studio_purchases', module: 'Admin Studio', code: '3. Pembelian', label: 'Pendaftaran & Transaksi Paket', desc: 'Catat pembelian paket member dan status pembayaran' },
  { id: 'studio_packages', module: 'Admin Studio', code: '4. Tarif', label: 'Master Tarif Paket Studio', desc: 'Atur varian paket latihan, harga, dan masa aktif' },
  { id: 'studio_classes', module: 'Admin Studio', code: '5. Kelas', label: 'Master Jenis Kelas Studio', desc: 'Kelola apparatus mesin, durasi sesi, dan kapasitas maksimal 4 orang' },
  { id: 'studio_coaches', module: 'Admin Studio', code: '6. Coach', label: 'Master Coach & Instruktur', desc: 'Kelola instruktur, kontak, sertifikasi, dan rekam jejak' },
  { id: 'studio_checkin', module: 'Admin Studio', code: '7. Presensi', label: 'Presensi & Check-In Kelas', desc: 'Catat kedatangan member dan potong kuota paket / drop-in' },
  { id: 'studio_leads', module: 'Admin Studio', code: '8. Leads', label: 'Leads & Prospek Penawaran', desc: 'Database calon prospek dari Sheet1 dan aksi 1-klik konversi' },
  { id: 'studio_backup', module: 'Admin Studio', code: '9. Master Excel', label: 'Master Excel & Sinkronisasi Data', desc: 'Ekspor Excel, sinkronisasi cerdas, dan cadangan JSON' },
  { id: 'system_users', module: 'Admin Studio', code: '10. Pengguna', label: 'Kelola Pengguna & Hak Akses', desc: 'Atur akun login staf dan matriks izin menu pengguna' },

  // Modul INCA Finance
  { id: 'finance_ringkasan', module: 'INCA Finance', code: 'F-1. Ringkasan', label: 'Ringkasan & Dashboard Keuangan', desc: 'Kondisi keuangan studio, saldo kas, dan pendapatan' },
  { id: 'finance_transaksi', module: 'INCA Finance', code: 'F-2. Transaksi', label: 'Jurnal / Transaksi Keuangan', desc: 'Catat mutasi kas masuk/keluar dan jurnal umum' },
  { id: 'finance_kas_bank', module: 'INCA Finance', code: 'F-3. Kas & Bank', label: 'Kas & Bank Studio', desc: 'Rincian pergerakan rekening bank dan kas likuid' },
  { id: 'finance_buku_besar', module: 'INCA Finance', code: 'F-4. Buku Besar', label: 'Buku Besar (General Ledger)', desc: 'Kartu akun lengkap dengan mutasi debit/kredit' },
  { id: 'finance_petty_cash', module: 'INCA Finance', code: 'F-5. Kas Kecil', label: 'Kas Kecil (Petty Cash Admin)', desc: 'Pengeluaran operasional ruko dan nota kas kecil' },
  { id: 'finance_laporan', module: 'INCA Finance', code: 'F-6. Laporan', label: 'Laporan Laba Rugi & Neraca', desc: 'Laporan laba rugi, telaah rekomendasi, dan cetak PDF' },
  { id: 'finance_proyeksi', module: 'INCA Finance', code: 'F-7. Proyeksi', label: 'Proyeksi Keuangan, BEP & Dividen', desc: 'Hitung estimasi titik impas (BEP) dan pembagian laba 3 owner' },
  { id: 'finance_modal_owner', module: 'INCA Finance', code: 'F-8. Modal', label: 'Modal Owner & Ekuitas', desc: 'Rekapitulasi setoran modal dan porsi kepemilikan owner' },
  { id: 'finance_daftar_akun', module: 'INCA Finance', code: 'F-9. Akun', label: 'Bagan Akun Pembukuan (COA)', desc: 'Struktur kode akun aktiva, kewajiban, modal, pendapatan, beban' },
  { id: 'finance_catatan_sumber', module: 'INCA Finance', code: 'F-10. Sumber', label: 'Catatan Sumber Data & Audit', desc: 'Audit trail rekonsiliasi berkas LPJ dan bank' },
  { id: 'finance_data_backup', module: 'INCA Finance', code: 'F-11. Backup', label: 'Cadangan & Backup Finance', desc: 'Unduh data JSON pembukuan dan pemulihan sistem' }
];

// 2. TEMPLATE PERAN & HAK AKSES STANDAR (ROLE TEMPLATES)
const ROLE_TEMPLATES = {
  owner: {
    key: 'owner',
    label: 'Super Admin / Owner',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Akses penuh ke seluruh 10 menu Studio dan 11 menu Finance.',
    permissions: SYSTEM_PERMISSIONS.map(p => p.id)
  },
  admin: {
    key: 'admin',
    label: 'Admin Studio (Operasional)',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Akses operasional Studio (Member, Paket, Jadwal, Presensi, Leads, Excel, Pengguna) & Kas Kecil.',
    permissions: [
      'studio_dashboard', 'studio_members', 'studio_purchases', 'studio_packages',
      'studio_classes', 'studio_coaches', 'studio_checkin', 'studio_leads',
      'studio_backup', 'system_users',
      'finance_petty_cash'
    ]
  },
  finance: {
    key: 'finance',
    label: 'Admin Keuangan (Finance)',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Akses seluruh modul INCA Finance & pencatatan paket/member.',
    permissions: [
      'studio_dashboard', 'studio_members', 'studio_purchases',
      'finance_ringkasan', 'finance_transaksi', 'finance_kas_bank', 'finance_buku_besar',
      'finance_petty_cash', 'finance_laporan', 'finance_proyeksi', 'finance_modal_owner',
      'finance_daftar_akun', 'finance_catatan_sumber', 'finance_data_backup'
    ]
  },
  coach: {
    key: 'coach',
    label: 'Instruktur / Coach',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Akses khusus agenda kalender sesi dan presensi murid.',
    permissions: [
      'studio_dashboard', 'studio_checkin'
    ]
  },
  custom: {
    key: 'custom',
    label: 'Kustom (Pilihan Bebas)',
    badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
    description: 'Kombinasi hak akses menu ditentukan secara manual.',
    permissions: []
  }
};

// 3. DAFTAR PENGGUNA BAWAAN OTENTIK SISTEM
const DEFAULT_SYSTEM_USERS = [
  {
    id: 'usr-owner',
    name: 'Owner & Direktur Utama',
    username: 'owner',
    password: '123456',
    role: 'owner',
    roleLabel: 'Super Admin / Owner',
    phone: '0812-8899-0011',
    active: true,
    createdDate: '12 Okt 2026',
    permissions: SYSTEM_PERMISSIONS.map(p => p.id)
  },
  {
    id: 'usr-admin',
    name: 'Admin Studio Operasional',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    roleLabel: 'Admin Studio',
    phone: '0813-2233-4455',
    active: true,
    createdDate: '12 Okt 2026',
    permissions: [
      'studio_dashboard', 'studio_members', 'studio_purchases', 'studio_packages',
      'studio_classes', 'studio_coaches', 'studio_checkin', 'studio_leads',
      'studio_backup', 'system_users',
      'finance_petty_cash'
    ]
  },
  {
    id: 'usr-finance',
    name: 'Staff Akuntansi & Finance',
    username: 'finance',
    password: 'finance123',
    role: 'finance',
    roleLabel: 'Admin Keuangan',
    phone: '0815-6677-8899',
    active: true,
    createdDate: '12 Okt 2026',
    permissions: [
      'studio_dashboard', 'studio_members', 'studio_purchases',
      'finance_ringkasan', 'finance_transaksi', 'finance_kas_bank', 'finance_buku_besar',
      'finance_petty_cash', 'finance_laporan', 'finance_proyeksi', 'finance_modal_owner',
      'finance_daftar_akun', 'finance_catatan_sumber', 'finance_data_backup'
    ]
  },
  {
    id: 'usr-coach',
    name: 'Coach & Instruktur Pilates',
    username: 'coach',
    password: 'coach123',
    role: 'coach',
    roleLabel: 'Instruktur',
    phone: '0812-9988-7711',
    active: true,
    createdDate: '14 Okt 2026',
    permissions: [
      'studio_dashboard', 'studio_checkin'
    ]
  }
];

window.SYSTEM_PERMISSIONS = SYSTEM_PERMISSIONS;
window.ROLE_TEMPLATES = ROLE_TEMPLATES;
window.DEFAULT_SYSTEM_USERS = DEFAULT_SYSTEM_USERS;

// Current logged in user object in memory
window.currentAuthUser = null;

// =========================================================================
// 4. AUTHENTICATION & LOGIN GATE FUNCTIONS
// =========================================================================

function getActiveAuthUser() {
  try {
    const rawSession = sessionStorage.getItem('INCA_AUTH_USER');
    if (rawSession) return JSON.parse(rawSession);
    
    const rawRemember = localStorage.getItem('INCA_AUTH_USER_REMEMBERED');
    if (rawRemember) return JSON.parse(rawRemember);
  } catch (e) {
    console.warn('Error reading auth storage:', e);
  }
  return null;
}

function hasPermission(permId) {
  const u = window.currentAuthUser;
  if (!u) return false;
  if (u.role === 'owner') return true;
  return Array.isArray(u.permissions) && u.permissions.includes(permId);
}
window.hasPermission = hasPermission;

function getSystemAppState() {
  if (typeof window !== 'undefined' && window.appState) return window.appState;
  if (typeof appState !== 'undefined') return appState;
  return { users: [] };
}

function initAuthGate() {
  ensureUsersInitialized();
  const sessionUser = getActiveAuthUser();
  const gateEl = document.getElementById('loginGateScreen');
  
  if (sessionUser && sessionUser.username) {
    // Re-verify that user still exists and active in appState.users
    const freshUser = getSystemAppState().users.find(u => u.username.toLowerCase() === sessionUser.username.toLowerCase());
    if (freshUser && freshUser.active) {
      window.currentAuthUser = freshUser;
      if (gateEl) gateEl.classList.add('hidden');
      applyUserMenuPermissions();
      return true;
    }
  }

  // Not logged in -> Show Login Gate Screen
  window.currentAuthUser = null;
  if (gateEl) {
    gateEl.classList.remove('hidden');
    const uInput = document.getElementById('gateUsername');
    if (uInput) uInput.focus();
    if (window.lucide) lucide.createIcons();
  }
  return false;
}

function handleGateLogin(event) {
  if (event) event.preventDefault();
  const uInput = document.getElementById('gateUsername');
  const pInput = document.getElementById('gatePassword');
  const remInput = document.getElementById('gateRememberMe');
  const alertEl = document.getElementById('gateAlert');
  const alertText = document.getElementById('gateAlertText');

  const username = (uInput?.value || '').trim().toLowerCase();
  const password = (pInput?.value || '').trim();

  if (!username || !password) {
    if (alertEl && alertText) {
      alertText.textContent = 'Harap isi username dan kata sandi.';
      alertEl.classList.remove('hidden');
    }
    return;
  }

  ensureUsersInitialized();
  const user = getSystemAppState().users.find(u => u.username.toLowerCase() === username && u.password === password);

  if (!user) {
    if (alertEl && alertText) {
      alertText.textContent = 'Username atau kata sandi tidak cocok. Silakan coba lagi.';
      alertEl.classList.remove('hidden');
    }
    if (pInput) {
      pInput.focus();
      pInput.select();
    }
    return;
  }

  if (user.active === false) {
    if (alertEl && alertText) {
      alertText.textContent = 'Akun ini sedang dinonaktifkan oleh Administrator. Hubungi Owner.';
      alertEl.classList.remove('hidden');
    }
    return;
  }

  // Login SUCCESS
  window.currentAuthUser = user;
  const userJson = JSON.stringify(user);
  try {
    sessionStorage.setItem('INCA_AUTH_USER', userJson);
    if (remInput && remInput.checked) {
      localStorage.setItem('INCA_AUTH_USER_REMEMBERED', userJson);
    } else {
      localStorage.removeItem('INCA_AUTH_USER_REMEMBERED');
    }
  } catch (e) {}

  if (alertEl) alertEl.classList.add('hidden');

  // Hide Login Gate Screen
  const gateEl = document.getElementById('loginGateScreen');
  if (gateEl) gateEl.classList.add('hidden');

  // Apply Permissions
  applyUserMenuPermissions();

  // Route to the first available module/tab
  const hasStudio = SYSTEM_PERMISSIONS.filter(p => p.module === 'Admin Studio').some(p => hasPermission(p.id));
  const hasFinance = SYSTEM_PERMISSIONS.filter(p => p.module === 'INCA Finance').some(p => hasPermission(p.id));

  if (hasStudio) {
    switchViewMode('admin');
    if (hasPermission('studio_dashboard')) {
      switchAdminTab('dashboard');
    } else {
      const firstStudioTab = ['members', 'purchases', 'packages', 'classes', 'coaches', 'checkin', 'leads', 'backup', 'users']
        .find(t => hasPermission('studio_' + (t === 'checkin' ? 'checkin' : t === 'users' ? 'system_users' : t)));
      if (firstStudioTab) switchAdminTab(firstStudioTab);
    }
  } else if (hasFinance) {
    switchViewMode('finance', true);
  }

  if (window.lucide) lucide.createIcons();
  if (window.initAllStudioSearchableSelects) window.initAllStudioSearchableSelects();
  if (typeof updateMasterTopBannerStats === 'function') updateMasterTopBannerStats();

  showToast(`Selamat datang, ${user.name}! Anda berhasil login sebagai ${user.roleLabel || user.role}.`, 'success');
}

function quickFillGateLogin(username, password) {
  const uInput = document.getElementById('gateUsername');
  const pInput = document.getElementById('gatePassword');
  const alertEl = document.getElementById('gateAlert');
  if (uInput) uInput.value = username;
  if (pInput) pInput.value = password;
  if (alertEl) alertEl.classList.add('hidden');
  const submitBtn = document.getElementById('gateSubmitBtn');
  if (submitBtn) submitBtn.focus();
}

function logoutSystem() {
  window.currentAuthUser = null;
  try {
    sessionStorage.removeItem('INCA_AUTH_USER');
    sessionStorage.removeItem('INCA_FINANCE_SESSION');
    localStorage.removeItem('INCA_AUTH_USER_REMEMBERED');
  } catch (e) {}

  const gateEl = document.getElementById('loginGateScreen');
  if (gateEl) {
    gateEl.classList.remove('hidden');
    const uInput = document.getElementById('gateUsername');
    const pInput = document.getElementById('gatePassword');
    const alertEl = document.getElementById('gateAlert');
    if (uInput) uInput.value = '';
    if (pInput) pInput.value = '';
    if (alertEl) alertEl.classList.add('hidden');
    if (uInput) uInput.focus();
    if (window.lucide) lucide.createIcons();
  }

  showToast('Anda telah keluar dari sesi sistem.', 'info');
}

function applyUserMenuPermissions() {
  const user = window.currentAuthUser;
  if (!user) return;

  // 1. Update Master Header
  const nameEl = document.getElementById('headerUserDisplayName');
  const roleEl = document.getElementById('headerUserRoleBadge');
  const avatarEl = document.getElementById('headerUserAvatar');
  
  if (nameEl) nameEl.textContent = user.name || user.username;
  if (roleEl) {
    const tpl = ROLE_TEMPLATES[user.role] || ROLE_TEMPLATES.custom;
    roleEl.textContent = user.roleLabel || tpl.label;
    roleEl.className = `text-[9.5px] px-2 py-0.5 rounded-full font-bold border ${tpl.badgeClass}`;
  }
  if (avatarEl) {
    const initials = (user.name || user.username || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    avatarEl.textContent = initials;
  }

  // 2. Filter Portal Switchers (Admin Studio vs INCA Finance)
  const hasStudio = SYSTEM_PERMISSIONS.filter(p => p.module === 'Admin Studio').some(p => hasPermission(p.id));
  const hasFinance = SYSTEM_PERMISSIONS.filter(p => p.module === 'INCA Finance').some(p => hasPermission(p.id));

  const btnAdmin = document.getElementById('btnSwitchToAdmin');
  const btnFinance = document.getElementById('btnSwitchToFinance');
  if (btnAdmin) btnAdmin.style.display = hasStudio ? 'inline-flex' : 'none';
  if (btnFinance) btnFinance.style.display = hasFinance ? 'inline-flex' : 'none';

  // 3. Filter Admin Studio Tabs
  const studioTabPermMap = {
    'dashboard': 'studio_dashboard',
    'members': 'studio_members',
    'purchases': 'studio_purchases',
    'packages': 'studio_packages',
    'classes': 'studio_classes',
    'coaches': 'studio_coaches',
    'checkin': 'studio_checkin',
    'leads': 'studio_leads',
    'backup': 'studio_backup',
    'users': 'system_users'
  };

  Object.entries(studioTabPermMap).forEach(([tabKey, permId]) => {
    const btn = document.getElementById('adminTabBtn' + tabKey.charAt(0).toUpperCase() + tabKey.slice(1));
    if (btn) {
      btn.style.display = hasPermission(permId) ? 'inline-flex' : 'none';
    }
  });

  // 4. Filter Finance Navigation sidebar if loaded
  if (typeof window.filterFinanceNavigationByPermissions === 'function') {
    window.filterFinanceNavigationByPermissions();
  }
}

// =========================================================================
// 5. USER MANAGEMENT CRUD & UI CONTROLLER (TAB 10)
// =========================================================================

function ensureUsersInitialized() {
  const state = getSystemAppState();
  const defUsers = window.DEFAULT_SYSTEM_USERS || (typeof DEFAULT_SYSTEM_USERS !== 'undefined' ? DEFAULT_SYSTEM_USERS : []);
  if (!state.users || !Array.isArray(state.users) || state.users.length === 0) {
    state.users = JSON.parse(JSON.stringify(defUsers));
    if (typeof saveState === 'function') saveState();
  }
}

function renderUsersTable() {
  ensureUsersInitialized();
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  const searchVal = (document.getElementById('searchUserInput')?.value || '').toLowerCase();
  const roleFilter = document.getElementById('filterUserRole')?.value || 'all';

  const state = getSystemAppState();
  const filtered = (state.users || []).filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchVal) {
      const matchName = (u.name || '').toLowerCase().includes(searchVal);
      const matchUser = (u.username || '').toLowerCase().includes(searchVal);
      const matchPhone = (u.phone || '').includes(searchVal);
      if (!matchName && !matchUser && !matchPhone) return false;
    }
    return true;
  });

  updateUserStats();

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-gray-400">Tidak ada akun pengguna yang sesuai dengan filter pencarian.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((u, idx) => {
    const tpl = ROLE_TEMPLATES[u.role] || ROLE_TEMPLATES.custom;
    const isOwner = u.role === 'owner';
    const isCurrent = window.currentAuthUser && window.currentAuthUser.id === u.id;
    const totalPerms = Array.isArray(u.permissions) ? u.permissions.length : 0;
    const isAll = totalPerms >= SYSTEM_PERMISSIONS.length || isOwner;
    const studioCount = (u.permissions || []).filter(p => p.startsWith('studio_') || p === 'system_users').length;
    const financeCount = (u.permissions || []).filter(p => p.startsWith('finance_')).length;

    return `
      <tr class="hover:bg-gray-50/80 transition text-xs">
        <td class="py-3 px-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-sage-100 text-sage-800 font-bold flex items-center justify-center shrink-0 border border-sage-200">
              ${(u.name || u.username).substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div class="font-bold text-gray-900 flex items-center gap-1.5">
                ${esc(u.name)}
                ${isCurrent ? '<span class="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.2 rounded font-semibold">Anda</span>' : ''}
              </div>
              <div class="text-[11px] font-mono text-gray-500">@${esc(u.username)}</div>
            </div>
          </div>
        </td>
        <td class="py-3 px-3">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${tpl.badgeClass}">
            ${esc(u.roleLabel || tpl.label)}
          </span>
          <div class="text-[10px] text-gray-400 mt-0.5">${esc(tpl.description || '')}</div>
        </td>
        <td class="py-3 px-3">
          ${isAll ? `
            <span class="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10.5px] inline-flex items-center gap-1">
              <i data-lucide="check-check" class="w-3 h-3 text-emerald-600"></i> Semua Akses (21 Menu)
            </span>
          ` : `
            <div class="flex flex-wrap gap-1">
              <span class="bg-sage-50 text-sage-800 border border-sage-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                ${studioCount} Menu Studio
              </span>
              <span class="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                ${financeCount} Menu Finance
              </span>
            </div>
          `}
        </td>
        <td class="py-3 px-3 font-mono text-gray-600">
          ${esc(u.phone || '-')}
        </td>
        <td class="py-3 px-3">
          <button type="button" onclick="toggleUserStatus('${u.id}')" ${isOwner ? 'disabled title="Akun Owner tidak dapat dinonaktifkan"' : ''} class="cursor-pointer transition">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${u.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}">
              <span class="w-1.5 h-1.5 rounded-full ${u.active !== false ? 'bg-emerald-600' : 'bg-red-600'}"></span>
              ${u.active !== false ? 'Aktif' : 'Nonaktif'}
            </span>
          </button>
        </td>
        <td class="py-3 px-4 text-right space-x-1 whitespace-nowrap">
          <button onclick="openEditUserModal('${u.id}')" class="px-2 py-1 text-xs font-semibold text-sage-700 bg-sage-50 hover:bg-sage-100 border border-sage-200 rounded-lg transition inline-flex items-center gap-1" title="Ubah Profil & Hak Akses">
            <i data-lucide="shield" class="w-3.5 h-3.5"></i> Hak Akses
          </button>
          <button onclick="promptResetPassword('${u.id}')" class="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition inline-flex items-center gap-1" title="Reset Kata Sandi">
            <i data-lucide="key" class="w-3.5 h-3.5"></i> Sandi
          </button>
          ${!isOwner ? `
            <button onclick="deleteUser('${u.id}')" class="px-2 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition inline-flex items-center gap-1" title="Hapus Pengguna">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          ` : ''}
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function updateUserStats() {
  ensureUsersInitialized();
  const totalEl = document.getElementById('statTotalUsers');
  const ownerEl = document.getElementById('statOwnerUsers');
  const adminEl = document.getElementById('statAdminUsers');
  const financeEl = document.getElementById('statFinanceUsers');
  const coachEl = document.getElementById('statCoachUsers');

  const state = getSystemAppState();
  if (totalEl) totalEl.textContent = (state.users || []).length;
  if (ownerEl) ownerEl.textContent = (state.users || []).filter(u => u.role === 'owner').length;
  if (adminEl) adminEl.textContent = (state.users || []).filter(u => u.role === 'admin').length;
  if (financeEl) financeEl.textContent = (state.users || []).filter(u => u.role === 'finance').length;
  if (coachEl) coachEl.textContent = (state.users || []).filter(u => u.role === 'coach').length;
}

function openAddUserModal() {
  const form = document.getElementById('userForm');
  if (form) form.reset();
  
  document.getElementById('umUserId').value = '';
  document.getElementById('umModalTitle').textContent = 'Tambah Pengguna Baru & Hak Akses';
  document.getElementById('umUsername').readOnly = false;
  document.getElementById('umRoleTemplate').value = 'admin';
  document.getElementById('umActive').checked = true;

  // Apply default 'admin' template checkboxes
  applyTemplateToCheckboxes('admin');

  document.getElementById('userModal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function openEditUserModal(userId) {
  ensureUsersInitialized();
  const state = getSystemAppState();
  const user = (state.users || []).find(u => u.id === userId);
  if (!user) return;

  document.getElementById('umUserId').value = user.id;
  document.getElementById('umFullName').value = user.name || '';
  document.getElementById('umUsername').value = user.username || '';
  document.getElementById('umUsername').readOnly = (user.role === 'owner'); // prevent changing owner username
  document.getElementById('umPhone').value = user.phone || '';
  document.getElementById('umPassword').value = user.password || '';
  document.getElementById('umRoleTemplate').value = user.role || 'custom';
  document.getElementById('umActive').checked = (user.active !== false);

  document.getElementById('umModalTitle').textContent = `Ubah Pengguna & Hak Akses: @${user.username}`;

  // Check the checkboxes according to user's permissions
  const perms = Array.isArray(user.permissions) ? user.permissions : [];
  SYSTEM_PERMISSIONS.forEach(p => {
    const cb = document.getElementById('perm_' + p.id);
    if (cb) {
      cb.checked = perms.includes(p.id) || (user.role === 'owner');
    }
  });

  document.getElementById('userModal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeUserModal() {
  const modal = document.getElementById('userModal');
  if (modal) modal.classList.add('hidden');
}

function handleRoleTemplateChange() {
  const tplKey = document.getElementById('umRoleTemplate').value;
  applyTemplateToCheckboxes(tplKey);
}

function applyTemplateToCheckboxes(tplKey) {
  const tpl = ROLE_TEMPLATES[tplKey];
  if (!tpl) return;

  if (tplKey === 'custom') return; // don't touch checkboxes on custom

  SYSTEM_PERMISSIONS.forEach(p => {
    const cb = document.getElementById('perm_' + p.id);
    if (cb) {
      cb.checked = tpl.permissions.includes(p.id);
    }
  });
}

function selectAllPermissions(moduleName) {
  SYSTEM_PERMISSIONS.filter(p => !moduleName || p.module === moduleName).forEach(p => {
    const cb = document.getElementById('perm_' + p.id);
    if (cb) cb.checked = true;
  });
  document.getElementById('umRoleTemplate').value = 'custom';
}

function deselectAllPermissions(moduleName) {
  SYSTEM_PERMISSIONS.filter(p => !moduleName || p.module === moduleName).forEach(p => {
    const cb = document.getElementById('perm_' + p.id);
    if (cb) cb.checked = false;
  });
  document.getElementById('umRoleTemplate').value = 'custom';
}

function saveUser(event) {
  if (event) event.preventDefault();
  ensureUsersInitialized();

  const id = document.getElementById('umUserId').value;
  const name = document.getElementById('umFullName').value.trim();
  const username = document.getElementById('umUsername').value.trim().toLowerCase();
  const password = document.getElementById('umPassword').value.trim();
  const phone = document.getElementById('umPhone').value.trim();
  const role = document.getElementById('umRoleTemplate').value;
  const active = document.getElementById('umActive').checked;

  if (!name || !username || !password) {
    alert('Nama lengkap, username, dan password wajib diisi.');
    return;
  }

  // Collect checked permissions
  const permissions = [];
  SYSTEM_PERMISSIONS.forEach(p => {
    const cb = document.getElementById('perm_' + p.id);
    if (cb && cb.checked) {
      permissions.push(p.id);
    }
  });

  const tpl = ROLE_TEMPLATES[role] || ROLE_TEMPLATES.custom;
  const roleLabel = tpl.label;

  const state = getSystemAppState();
  if (!state.users) state.users = [];

  if (id) {
    // Edit existing user
    const user = state.users.find(u => u.id === id);
    if (user) {
      // Check username duplicate with others
      const dup = state.users.find(u => u.username.toLowerCase() === username && u.id !== id);
      if (dup) {
        alert(`Username "${username}" sudah digunakan pengguna lain. Pilih username lain.`);
        return;
      }

      Object.assign(user, {
        name,
        username,
        password,
        phone,
        role,
        roleLabel,
        active,
        permissions
      });

      // If updating currently logged in user, refresh session
      if (window.currentAuthUser && window.currentAuthUser.id === id) {
        window.currentAuthUser = user;
        try {
          sessionStorage.setItem('INCA_AUTH_USER', JSON.stringify(user));
          if (localStorage.getItem('INCA_AUTH_USER_REMEMBERED')) {
            localStorage.setItem('INCA_AUTH_USER_REMEMBERED', JSON.stringify(user));
          }
        } catch (e) {}
        applyUserMenuPermissions();
      }

      showToast(`Data dan hak akses pengguna @${username} berhasil diperbarui!`, 'success');
      if (window.GoogleSheetsSync) {
        window.GoogleSheetsSync.pushUser('saveUser', user);
      }
    }
  } else {
    // Check username duplicate
    const dup = state.users.find(u => u.username.toLowerCase() === username);
    if (dup) {
      alert(`Username "${username}" sudah terdaftar. Silakan pilih username lain.`);
      return;
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      username,
      password,
      phone,
      role,
      roleLabel,
      active,
      createdDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      permissions
    };
    state.users.push(newUser);
    showToast(`Pengguna baru @${username} berhasil ditambahkan!`, 'success');
    if (window.GoogleSheetsSync) {
      window.GoogleSheetsSync.pushUser('saveUser', newUser);
    }
  }

  saveState();
  closeUserModal();
  renderUsersTable();
}

function promptResetPassword(userId) {
  ensureUsersInitialized();
  const state = getSystemAppState();
  const user = (state.users || []).find(u => u.id === userId);
  if (!user) return;

  const newPass = prompt(`Masukkan kata sandi baru untuk @${user.username} (saat ini: ${user.password}):`, user.password);
  if (newPass !== null && newPass.trim() !== '') {
    user.password = newPass.trim();
    saveState();
    renderUsersTable();
    showToast(`Kata sandi untuk @${user.username} berhasil diubah!`, 'success');
    if (window.GoogleSheetsSync) {
      window.GoogleSheetsSync.pushUser('saveUser', user);
    }
  }
}

function toggleUserStatus(userId) {
  ensureUsersInitialized();
  const state = getSystemAppState();
  const user = (state.users || []).find(u => u.id === userId);
  if (!user) return;
  if (user.role === 'owner') {
    alert('Akun Owner tidak dapat dinonaktifkan.');
    return;
  }
  user.active = (user.active === false);
  saveState();
  renderUsersTable();
  showToast(`Status pengguna @${user.username} kini: ${user.active ? 'Aktif' : 'Nonaktif'}`, 'info');
  if (window.GoogleSheetsSync) {
    window.GoogleSheetsSync.pushUser('saveUser', user);
  }
}

function deleteUser(userId) {
  ensureUsersInitialized();
  const state = getSystemAppState();
  const user = (state.users || []).find(u => u.id === userId);
  if (!user) return;
  if (user.role === 'owner') {
    alert('Akun Super Admin / Owner tidak dapat dihapus.');
    return;
  }
  if (window.currentAuthUser && window.currentAuthUser.id === userId) {
    alert('Anda tidak dapat menghapus akun yang sedang digunakan saat ini.');
    return;
  }

  if (confirm(`Apakah Anda yakin ingin menghapus akun pengguna @${user.username} (${user.name})? Akses masuk akan dicabut secara permanen.`)) {
    const deletedUserCopy = { id: user.id, username: user.username };
    state.users = state.users.filter(u => u.id !== userId);
    saveState();
    renderUsersTable();
    showToast(`Pengguna @${user.username} berhasil dihapus dari sistem.`, 'success');
    if (window.GoogleSheetsSync) {
      window.GoogleSheetsSync.pushUser('deleteUser', deletedUserCopy);
    }
  }
}

// Global expose
window.initAuthGate = initAuthGate;
window.handleGateLogin = handleGateLogin;
window.quickFillGateLogin = quickFillGateLogin;
window.logoutSystem = logoutSystem;
window.applyUserMenuPermissions = applyUserMenuPermissions;
window.renderUsersTable = renderUsersTable;
window.openAddUserModal = openAddUserModal;
window.openEditUserModal = openEditUserModal;
window.closeUserModal = closeUserModal;
window.handleRoleTemplateChange = handleRoleTemplateChange;
window.selectAllPermissions = selectAllPermissions;
window.deselectAllPermissions = deselectAllPermissions;
window.saveUser = saveUser;
window.promptResetPassword = promptResetPassword;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
