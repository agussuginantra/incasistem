/**
 * INCA PILATES & MINDFUL MOVEMENT - STUDIO MANAGEMENT CONTROLLER
 * Full Admin Back-Office: Members, Packages, Classes, Coaches, Schedules, Ploting & Check-In
 */

const STORAGE_KEY = 'INCA_STUDIO_MANAGEMENT_DATA_V6_EXCEL_SYNC';

// Global Application State
var appState = {
  currentRole: 'admin', // Default role is now 'admin' (client portal removed)
  adminActiveTab: 'dashboard', // Default tab: 'dashboard' (Dashboard & Kalender)
  selectedDate: getTodayString(),
  selectedCategory: 'all',
  attendanceSelectedScheduleId: '',
  calendarYear: 2026,
  calendarMonth: 10, // November (0-indexed: 9=Oct, 10=Nov)
  calendarScheduleViewMode: 'calendar',
  calendarFilterCoach: 'all',
  calendarFilterClass: 'all',
  activeScheduleDetailId: null,
  
  adminAuth: {
    username: 'admin',
    password: 'admin123',
    isLoggedIn: true // Default logged in for smooth local desktop use
  },

  members: [],
  packagePurchases: [],
  packages: [],
  classes: [],
  coaches: [],
  schedules: [],
  classAttendances: [],
  leads: [],
  users: (typeof DEFAULT_SYSTEM_USERS !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_SYSTEM_USERS)) : (typeof window !== 'undefined' && window.DEFAULT_SYSTEM_USERS ? JSON.parse(JSON.stringify(window.DEFAULT_SYSTEM_USERS)) : []),
  indicators: {}
};
window.appState = appState;

// =========================================================================
// 1. DATE UTILITIES & DEFAULT SEED DATA
// =========================================================================

function getTodayString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

function getDefaultStudioData() {
  if (window.INCA_EXCEL_STUDIO_DATA) {
    return JSON.parse(JSON.stringify(window.INCA_EXCEL_STUDIO_DATA));
  }
  const today = getTodayString(0);
  const tomorrow = getTodayString(1);
  const day2 = getTodayString(2);
  const day3 = getTodayString(3);

  // 1. Master Kelas (Sesuai Otentik Database Excel INCA)
  const classes = [
    {
      id: 'cls-1',
      name: 'Reformer',
      category: 'reformer',
      level: 'All Levels',
      durationMinutes: 50,
      defaultCapacity: 6,
      dropinPrice: 200000,
      description: 'Latihan resistance spring mesin Reformer untuk kelenturan, alignment postur, dan core strength.'
    },
    {
      id: 'cls-2',
      name: 'Cadillac',
      category: 'cadillac',
      level: 'All Levels',
      durationMinutes: 50,
      defaultCapacity: 4,
      dropinPrice: 250000,
      description: 'Latihan menggunakan trapeze table / cadillac apparatus untuk stabilitas tingkat tinggi.'
    },
    {
      id: 'cls-3',
      name: 'Tower',
      category: 'tower',
      level: 'All Levels',
      durationMinutes: 50,
      defaultCapacity: 6,
      dropinPrice: 200000,
      description: 'Latihan mesin Tower unit penguatan otot punggung, spinal articulation, dan fleksibilitas.'
    },
    {
      id: 'cls-4',
      name: 'Chair',
      category: 'chair',
      level: 'All Levels',
      durationMinutes: 50,
      defaultCapacity: 6,
      dropinPrice: 200000,
      description: 'Latihan Wunda Chair berfokus pada keseimbangan tubuh bagian atas dan stabilitas panggul.'
    },
    {
      id: 'cls-5',
      name: 'Yoga Wheel',
      category: 'yoga_wheel',
      level: 'All Levels',
      durationMinutes: 60,
      defaultCapacity: 10,
      dropinPrice: 150000,
      description: 'Latihan yoga menggunakan yoga wheel prop untuk membuka rongga dada dan kelenturan tulang belakang.'
    },
    {
      id: 'cls-6',
      name: 'Yoga',
      category: 'yoga',
      level: 'All Levels',
      durationMinutes: 60,
      defaultCapacity: 14,
      dropinPrice: 140000,
      description: 'Sesi yoga mindful flow & deep stretch untuk keseimbangan tubuh dan ketenangan pikiran.'
    },
    {
      id: 'cls-7',
      name: 'Mat',
      category: 'mat',
      level: 'All Levels',
      durationMinutes: 50,
      defaultCapacity: 12,
      dropinPrice: 120000,
      description: 'Pilates matras klasik dengan resistance props untuk kekuatan otot inti dan postur.'
    },
    {
      id: 'cls-8',
      name: 'Yoga Props',
      category: 'yoga_props',
      level: 'All Levels',
      durationMinutes: 60,
      defaultCapacity: 12,
      dropinPrice: 150000,
      description: 'Latihan yoga dengan block, strap, dan bolster untuk modifikasi gerakan dan relaksasi mendalam.'
    }
  ];

  // 2. Master Coach
  const coaches = [
    {
      id: 'cch-1',
      name: 'Coach Jessica Halim',
      role: 'Senior Reformer Pilates Instructor',
      specialties: 'Reformer Flow, Posture Alignment, Prenatal Pilates',
      phone: '081234567891',
      bio: 'Sertifikasi internasional STOTT Pilates dengan 6+ tahun pengalaman mengajar private & group reformer.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      active: true
    },
    {
      id: 'cch-2',
      name: 'Coach Ryan Pratama',
      role: 'Certified Athletic & Reformer Specialist',
      specialties: 'Athletic Conditioning, Core Strength, Rehab Support',
      phone: '081298765432',
      bio: 'Fokus pada biomekanik gerak, pembentukan otot fungsional, dan pemulihan pasca cedera sendi.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
      active: true
    },
    {
      id: 'cch-3',
      name: 'Coach Maya Safitri',
      role: 'Yoga Alliance & Mat Pilates Master',
      specialties: 'Vinyasa Flow, Hip Opening, Breathwork, Yin Yoga',
      phone: '081377889900',
      bio: 'Berpengalaman 8+ tahun memadukan kelembutan yoga dengan kekuatan kontrol tubuh pilates.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      active: true
    }
  ];

  // 3. Master Paket Member
  const packages = [
    {
      id: 'pkg-1',
      name: 'Promo Soft Opening 8 Sesi Reformer',
      category: 'reformer',
      sessions: 8,
      normalPrice: 1600000,
      promoPrice: 1250000,
      validityDays: 45,
      active: true,
      firstTimerOnly: true,
      benefits: '8 Sesi Reformer, Free Grip Socks, Loker & Handuk, Matras',
      description: 'Paket hemat terbaik untuk murid baru yang ingin merasakan manfaat latihan reformer secara intensif.'
    },
    {
      id: 'pkg-2',
      name: 'Reformer Regular 10 Sesi',
      category: 'reformer',
      sessions: 10,
      normalPrice: 2250000,
      promoPrice: 1850000,
      validityDays: 60,
      active: true,
      firstTimerOnly: false,
      benefits: '10 Sesi Reformer, Bebas reschedule 12 jam, Free Loker & Handuk',
      description: 'Pilihan terpopuler member reguler studio dengan masa berlaku fleksibel 60 hari.'
    },
    {
      id: 'pkg-3',
      name: 'Mat Pilates & Yoga 5 Sesi',
      category: 'mat',
      sessions: 5,
      normalPrice: 750000,
      promoPrice: 650000,
      validityDays: 30,
      active: true,
      firstTimerOnly: false,
      benefits: '5 Sesi Mat/Yoga, Free Matras Studio, Loker',
      description: 'Paket fleksibel untuk memperkuat otot perut, memperbaiki postur, dan fleksibilitas.'
    },
    {
      id: 'pkg-4',
      name: 'Single Session Drop-In Reformer',
      category: 'reformer',
      sessions: 1,
      normalPrice: 225000,
      promoPrice: 225000,
      validityDays: 7,
      active: true,
      firstTimerOnly: false,
      benefits: '1 Sesi Kelas Bebas Pilih',
      description: 'Khusus bagi Anda yang ingin mencoba 1 sesi tanpa komitmen paket jangka panjang.'
    }
  ];

  // 4. Data Member
  const members = [
    {
      id: 'mbr-1',
      memberCode: 'MBR-001',
      name: 'Amanda Putri',
      phone: '081234567890',
      email: 'amanda.putri@gmail.com',
      joinedDate: '2026-10-15',
      status: 'active',
      activePackageId: 'pkg-1',
      packageName: 'Promo Soft Opening 8 Sesi Reformer',
      remainingSessions: 5,
      totalSessions: 8,
      notes: 'Pernah ada keluhan nyeri lutut kiri ringan saat fleksi maksimal.'
    },
    {
      id: 'mbr-2',
      memberCode: 'MBR-002',
      name: 'Citra Lestari',
      phone: '081987654321',
      email: 'citra.lestari@yahoo.com',
      joinedDate: '2026-10-18',
      status: 'active',
      activePackageId: 'pkg-2',
      packageName: 'Reformer Regular 10 Sesi',
      remainingSessions: 9,
      totalSessions: 10,
      notes: 'Fokus perbaikan postur bungkuk (upper back).'
    },
    {
      id: 'mbr-3',
      memberCode: 'MBR-003',
      name: 'Dian Sastrowardoyo',
      phone: '081345678912',
      email: 'dian.sastro@gmail.com',
      joinedDate: '2026-10-20',
      status: 'active',
      activePackageId: 'pkg-3',
      packageName: 'Mat Pilates & Yoga 5 Sesi',
      remainingSessions: 3,
      totalSessions: 5,
      notes: 'Suka sesi Yin Yoga & peregangan santai.'
    },
    {
      id: 'mbr-4',
      memberCode: 'MBR-004',
      name: 'Budi Santoso',
      phone: '081122334455',
      email: 'budi.santoso@outlook.com',
      joinedDate: '2026-10-24',
      status: 'active',
      activePackageId: 'pkg-1',
      packageName: 'Promo Soft Opening 8 Sesi Reformer',
      remainingSessions: 2,
      totalSessions: 8,
      notes: 'Latihan penguatan otot pinggang (low back pain support).'
    },
    {
      id: 'mbr-5',
      memberCode: 'MBR-005',
      name: 'Rina Wulandari',
      phone: '081566778899',
      email: 'rina.wulan@gmail.com',
      joinedDate: '2026-10-12',
      status: 'active',
      activePackageId: 'pkg-1',
      packageName: 'Promo Soft Opening 8 Sesi Reformer',
      remainingSessions: 0,
      totalSessions: 8,
      notes: 'Kuota paket habis. Telah diingatkan untuk perpanjang paket.'
    },
    {
      id: 'mbr-6',
      memberCode: 'MBR-006',
      name: 'Maya Kartika',
      phone: '081788990011',
      email: 'maya.kartika@gmail.com',
      joinedDate: '2026-10-27',
      status: 'active',
      activePackageId: 'pkg-2',
      packageName: 'Reformer Regular 10 Sesi',
      remainingSessions: 8,
      totalSessions: 10,
      notes: 'Member aktif pagi hari.'
    }
  ];

  // 5. Riwayat Pembelian Paket
  const packagePurchases = [
    {
      id: 'pur-1',
      invoiceNo: 'INV-202610-001',
      memberId: 'mbr-1',
      memberName: 'Amanda Putri',
      packageId: 'pkg-1',
      packageName: 'Promo Soft Opening 8 Sesi Reformer',
      sessions: 8,
      price: 1250000,
      paymentMethod: 'Transfer BCA',
      date: '2026-10-15',
      recordedInFinance: true,
      notes: 'Promo opening voucher disc'
    },
    {
      id: 'pur-2',
      invoiceNo: 'INV-202610-002',
      memberId: 'mbr-2',
      memberName: 'Citra Lestari',
      packageId: 'pkg-2',
      packageName: 'Reformer Regular 10 Sesi',
      sessions: 10,
      price: 1850000,
      paymentMethod: 'QRIS',
      date: '2026-10-18',
      recordedInFinance: true,
      notes: 'Lunas via QRIS'
    },
    {
      id: 'pur-3',
      invoiceNo: 'INV-202610-003',
      memberId: 'mbr-3',
      memberName: 'Dian Sastrowardoyo',
      packageId: 'pkg-3',
      packageName: 'Mat Pilates & Yoga 5 Sesi',
      sessions: 5,
      price: 650000,
      paymentMethod: 'Transfer Mandiri',
      date: '2026-10-20',
      recordedInFinance: true,
      notes: 'Paket mat & yoga'
    },
    {
      id: 'pur-4',
      invoiceNo: 'INV-202610-004',
      memberId: 'mbr-4',
      memberName: 'Budi Santoso',
      packageId: 'pkg-1',
      packageName: 'Promo Soft Opening 8 Sesi Reformer',
      sessions: 8,
      price: 1250000,
      paymentMethod: 'Tunai / Cash',
      date: '2026-10-24',
      recordedInFinance: true,
      notes: 'Bayar kasir studio'
    },
    {
      id: 'pur-5',
      invoiceNo: 'INV-202610-005',
      memberId: 'mbr-6',
      memberName: 'Maya Kartika',
      packageId: 'pkg-2',
      packageName: 'Reformer Regular 10 Sesi',
      sessions: 10,
      price: 1850000,
      paymentMethod: 'Transfer BCA',
      date: '2026-10-27',
      recordedInFinance: true,
      notes: 'Lunas transfer'
    }
  ];

  // 6. Jadwal & Ploting Sesi Kelas
  const schedules = [
    {
      id: 'sch-1',
      classId: 'cls-1',
      className: 'Reformer Tone & Flow',
      category: 'reformer',
      date: today,
      startTime: '08:00',
      endTime: '08:50',
      coachId: 'cch-1',
      coachName: 'Coach Jessica Halim',
      room: 'Reformer Studio A',
      capacity: 6,
      bookedCount: 4,
      status: 'active'
    },
    {
      id: 'sch-2',
      classId: 'cls-2',
      className: 'Reformer Abs & Glutes Sculpt',
      category: 'reformer',
      date: today,
      startTime: '10:00',
      endTime: '10:50',
      coachId: 'cch-2',
      coachName: 'Coach Ryan Pratama',
      room: 'Reformer Studio A',
      capacity: 6,
      bookedCount: 2,
      status: 'active'
    },
    {
      id: 'sch-3',
      classId: 'cls-3',
      className: 'Mat Pilates Core & Posture',
      category: 'mat',
      date: today,
      startTime: '16:00',
      endTime: '16:55',
      coachId: 'cch-3',
      coachName: 'Coach Maya Safitri',
      room: 'Mat & Yoga Studio B',
      capacity: 12,
      bookedCount: 3,
      status: 'active'
    },
    {
      id: 'sch-4',
      classId: 'cls-4',
      className: 'Mindful Vinyasa Flow Yoga',
      category: 'yoga',
      date: today,
      startTime: '18:30',
      endTime: '19:30',
      coachId: 'cch-3',
      coachName: 'Coach Maya Safitri',
      room: 'Mat & Yoga Studio B',
      capacity: 14,
      bookedCount: 2,
      status: 'active'
    },
    {
      id: 'sch-5',
      classId: 'cls-1',
      className: 'Reformer Tone & Flow',
      category: 'reformer',
      date: tomorrow,
      startTime: '08:00',
      endTime: '08:50',
      coachId: 'cch-1',
      coachName: 'Coach Jessica Halim',
      room: 'Reformer Studio A',
      capacity: 6,
      bookedCount: 3,
      status: 'active'
    },
    {
      id: 'sch-6',
      classId: 'cls-5',
      className: 'Deep Stretch & Yin Yoga',
      category: 'yoga',
      date: tomorrow,
      startTime: '17:00',
      endTime: '18:00',
      coachId: 'cch-3',
      coachName: 'Coach Maya Safitri',
      room: 'Mat & Yoga Studio B',
      capacity: 14,
      bookedCount: 1,
      status: 'active'
    }
  ];

  // 7. Ploting Member ke Kelas & Presensi (Check-in)
  const classAttendances = [
    {
      id: 'att-1',
      scheduleId: 'sch-1',
      memberId: 'mbr-1',
      memberName: 'Amanda Putri',
      memberPhone: '081234567890',
      paymentType: 'package',
      packageName: 'Promo Soft Opening 8 Sesi Reformer',
      amount: 0,
      checkInStatus: 'checked_in', // 'booked' | 'checked_in' | 'cancelled'
      checkInTime: today + ' 07:55',
      notes: 'Hadir tepat waktu'
    },
    {
      id: 'att-2',
      scheduleId: 'sch-1',
      memberId: 'mbr-2',
      memberName: 'Citra Lestari',
      memberPhone: '081987654321',
      paymentType: 'package',
      packageName: 'Reformer Regular 10 Sesi',
      amount: 0,
      checkInStatus: 'checked_in',
      checkInTime: today + ' 07:58',
      notes: 'Bawa grip socks sendiri'
    },
    {
      id: 'att-3',
      scheduleId: 'sch-1',
      memberId: 'mbr-4',
      memberName: 'Budi Santoso',
      memberPhone: '081122334455',
      paymentType: 'package',
      packageName: 'Promo Soft Opening 8 Sesi Reformer',
      amount: 0,
      checkInStatus: 'booked',
      checkInTime: '',
      notes: 'Sudah reservasi'
    },
    {
      id: 'att-4',
      scheduleId: 'sch-1',
      memberId: '',
      memberName: 'Karin Wijaya',
      memberPhone: '081299001122',
      paymentType: 'dropin',
      packageName: 'Single Drop-In Reformer',
      amount: 225000,
      checkInStatus: 'booked',
      checkInTime: '',
      notes: 'Tamu drop-in single class'
    },
    {
      id: 'att-5',
      scheduleId: 'sch-2',
      memberId: 'mbr-6',
      memberName: 'Maya Kartika',
      memberPhone: '081788990011',
      paymentType: 'package',
      packageName: 'Reformer Regular 10 Sesi',
      amount: 0,
      checkInStatus: 'booked',
      checkInTime: '',
      notes: 'Sesi jam 10:00'
    },
    {
      id: 'att-6',
      scheduleId: 'sch-3',
      memberId: 'mbr-3',
      memberName: 'Dian Sastrowardoyo',
      memberPhone: '081345678912',
      paymentType: 'package',
      packageName: 'Mat Pilates & Yoga 5 Sesi',
      amount: 0,
      checkInStatus: 'booked',
      checkInTime: '',
      notes: 'Sesi sore'
    }
  ];

  return {
    classes,
    coaches,
    packages,
    members,
    packagePurchases,
    schedules,
    classAttendances
  };
}

// =========================================================================
// 2. STATE PERSISTENCE (LOCAL STORAGE)
// =========================================================================

function saveState() {
  try {
    window.appState = appState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Gagal menyimpan state ke LocalStorage:', e);
  }
}

function loadState() {
  const defaults = getDefaultStudioData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      appState = {
        ...appState,
        ...parsed,
        adminActiveTab: 'dashboard', // Selalu buka Dashboard Singkat & Kalender Bulanan di halaman utama saat buka
        adminAuth: { ...appState.adminAuth, ...(parsed.adminAuth || {}) },
        classes: (parsed.classes && parsed.classes.length) ? parsed.classes : defaults.classes,
        coaches: (parsed.coaches && parsed.coaches.length) ? parsed.coaches : defaults.coaches,
        packages: (parsed.packages && parsed.packages.length) ? parsed.packages : defaults.packages,
        members: (parsed.members && parsed.members.length) ? parsed.members : defaults.members,
        packagePurchases: (parsed.packagePurchases && parsed.packagePurchases.length) ? parsed.packagePurchases : defaults.packagePurchases,
        schedules: (parsed.schedules && parsed.schedules.length) ? parsed.schedules : defaults.schedules,
        classAttendances: (parsed.classAttendances && parsed.classAttendances.length) ? parsed.classAttendances : defaults.classAttendances,
        leads: (parsed.leads && parsed.leads.length) ? parsed.leads : (defaults.leads || []),
        users: (parsed.users && parsed.users.length) ? parsed.users : (typeof DEFAULT_SYSTEM_USERS !== 'undefined' ? JSON.parse(JSON.stringify(DEFAULT_SYSTEM_USERS)) : []),
        indicators: parsed.indicators || defaults.indicators || {}
      };
    } else {
      appState = {
        ...appState,
        ...defaults,
        leads: defaults.leads || [],
        users: (typeof DEFAULT_SYSTEM_USERS !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_SYSTEM_USERS)) : [],
        indicators: defaults.indicators || {}
      };
      saveState();
    }
  } catch (e) {
    console.warn('Error parsing storage, fallback to defaults:', e);
    appState = { 
      ...appState, 
      ...defaults, 
      leads: defaults.leads || [], 
      users: (typeof DEFAULT_SYSTEM_USERS !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_SYSTEM_USERS)) : [],
      indicators: defaults.indicators || {} 
    };
    saveState();
  }

  // Ketentuan Khusus: Pastikan kapasitas seluruh jenis kelas konsisten maksimal 4 orang sesuai arahan owner
  if (appState.classes && appState.classes.length) {
    appState.classes.forEach(c => {
      c.defaultCapacity = 4;
    });
  }
  if (appState.schedules && appState.schedules.length) {
    appState.schedules.forEach(s => {
      if (!s.capacity || s.capacity > 4) {
        s.capacity = 4;
      }
    });
  }
  const defUsers = (typeof DEFAULT_SYSTEM_USERS !== 'undefined') ? DEFAULT_SYSTEM_USERS : (typeof window !== 'undefined' ? window.DEFAULT_SYSTEM_USERS : null);
  if ((!appState.users || !appState.users.length) && defUsers) {
    appState.users = JSON.parse(JSON.stringify(defUsers));
  }
  window.appState = appState;
}

// =========================================================================
// 3. MASTER ROLE SWITCHING (ADMIN STUDIO vs INCA FINANCE) & TERINTEGRASI PENUH
// =========================================================================

function logoutFinance() {
  switchViewMode('admin');
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  if (btnEl) {
    btnEl.innerHTML = isPass ? '<i data-lucide="eye-off" class="w-4 h-4"></i>' : '<i data-lucide="eye" class="w-4 h-4"></i>';
    if (window.lucide) lucide.createIcons();
  }
}

function switchViewMode(mode, bypassAuth = false) {
  if (mode === 'finance') {
    // Cek izin akses ke modul INCA Finance
    const hasAnyFinancePerm = (typeof SYSTEM_PERMISSIONS !== 'undefined')
      ? SYSTEM_PERMISSIONS.filter(p => p.module === 'INCA Finance').some(p => hasPermission(p.id))
      : true;
    if (typeof window.hasPermission === 'function' && !hasAnyFinancePerm) {
      if (typeof showToast === 'function') {
        showToast('Akses ditolak: Anda tidak memiliki izin untuk membuka modul INCA Finance.', 'error');
      } else {
        alert('Akses ditolak: Anda tidak memiliki izin untuk membuka modul INCA Finance.');
      }
      return;
    }
  }

  if (mode === 'admin') {
    // Cek izin akses ke modul Admin Studio
    const hasAnyStudioPerm = (typeof SYSTEM_PERMISSIONS !== 'undefined')
      ? SYSTEM_PERMISSIONS.filter(p => p.module === 'Admin Studio').some(p => hasPermission(p.id))
      : true;
    if (typeof window.hasPermission === 'function' && !hasAnyStudioPerm) {
      if (typeof showToast === 'function') {
        showToast('Akses ditolak: Anda tidak memiliki izin untuk membuka modul Admin Studio.', 'error');
      } else {
        alert('Akses ditolak: Anda tidak memiliki izin untuk membuka modul Admin Studio.');
      }
      return;
    }
  }

  appState.currentRole = mode;
  
  const adminView = document.getElementById('adminDashboardView');
  const financeView = document.getElementById('financeView');
  const studioNavBar = document.getElementById('studioNavBar');
  const studioFooterContainer = document.getElementById('studioFooterContainer');
  const roleBadge = document.getElementById('currentRoleBadge');
  const btnAdmin = document.getElementById('btnSwitchToAdmin');
  const btnFinance = document.getElementById('btnSwitchToFinance');

  if (mode === 'finance') {
    if (adminView) adminView.classList.add('hidden');
    if (studioNavBar) studioNavBar.classList.add('hidden');
    if (studioFooterContainer) studioFooterContainer.classList.add('hidden');
    if (financeView) financeView.classList.remove('hidden');

    if (roleBadge) {
      roleBadge.textContent = 'INCA Finance';
      roleBadge.className = 'bg-purple-700/90 text-purple-100 px-2 py-0.5 rounded text-[10.5px] font-semibold whitespace-nowrap';
    }
    if (btnFinance) {
      btnFinance.className = 'px-2.5 py-1 rounded-md bg-purple-700 text-white font-medium transition flex items-center gap-1.5 text-xs shadow-xs whitespace-nowrap';
    }
    if (btnAdmin) {
      btnAdmin.className = 'px-2.5 py-1 rounded-md text-gray-400 hover:text-gray-200 font-medium transition flex items-center gap-1.5 text-xs whitespace-nowrap';
    }

    if (typeof window.filterFinanceNavigationByPermissions === 'function') {
      window.filterFinanceNavigationByPermissions();
    }
    if (typeof window.renderFinance === 'function') {
      window.renderFinance();
    }
    showToast('Beralih ke Ruang Kerja INCA Finance', 'info');

  } else {
    // Mode Admin Studio
    if (financeView) financeView.classList.add('hidden');
    if (adminView) adminView.classList.remove('hidden');
    if (studioNavBar) studioNavBar.classList.remove('hidden');
    if (studioFooterContainer) studioFooterContainer.classList.remove('hidden');

    if (roleBadge) {
      roleBadge.textContent = 'Admin Studio';
      roleBadge.className = 'bg-amber-600/90 text-amber-100 px-2 py-0.5 rounded text-[10.5px] font-semibold whitespace-nowrap';
    }
    if (btnAdmin) {
      btnAdmin.className = 'px-2.5 py-1 rounded-md bg-amber-600 text-white font-medium transition flex items-center gap-1.5 text-xs shadow-xs whitespace-nowrap';
    }
    if (btnFinance) {
      btnFinance.className = 'px-2.5 py-1 rounded-md text-gray-400 hover:text-gray-200 font-medium transition flex items-center gap-1.5 text-xs whitespace-nowrap';
    }

    renderAdminCurrentTab();
    showToast('Beralih ke Dashboard Operasional Studio', 'info');
  }

  if (window.lucide) {
    lucide.createIcons();
  }
  updateMasterTopBannerStats();
}

// =========================================================================
// 4. ADMIN SUBTAB NAVIGATION
// =========================================================================

function switchAdminTab(tab) {
  if (tab === 'schedules') tab = 'dashboard';

  // Permission Guard
  const tabPermMap = {
    dashboard: 'studio_dashboard',
    members: 'studio_members',
    purchases: 'studio_purchases',
    packages: 'studio_packages',
    classes: 'studio_classes',
    coaches: 'studio_coaches',
    checkin: 'studio_checkin',
    leads: 'studio_leads',
    backup: 'studio_backup',
    users: 'system_users'
  };

  if (typeof window.hasPermission === 'function' && tabPermMap[tab]) {
    if (!window.hasPermission(tabPermMap[tab])) {
      if (typeof showToast === 'function') {
        showToast('Akses ditolak: Anda tidak memiliki izin untuk membuka menu ini.', 'error');
      } else {
        alert('Akses ditolak: Anda tidak memiliki izin untuk membuka menu ini.');
      }
      return;
    }
  }

  appState.adminActiveTab = tab;
  
  // Update Tab buttons
  const tabButtons = document.querySelectorAll('.admin-tab-btn');
  tabButtons.forEach(btn => {
    btn.classList.remove('active', 'text-sage-800', 'border-b-2', 'border-sage-700', 'font-bold');
    btn.classList.add('text-gray-500');
  });

  const activeBtn = document.getElementById(`adminTabBtn${capitalize(tab)}`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'text-sage-800', 'border-b-2', 'border-sage-700', 'font-bold');
    activeBtn.classList.remove('text-gray-500');
  }

  // Hide all tab containers
  const tabs = ['dashboard', 'members', 'purchases', 'packages', 'classes', 'coaches', 'checkin', 'leads', 'backup', 'users'];
  tabs.forEach(t => {
    const el = document.getElementById(`adminTab${capitalize(t)}`);
    if (el) el.classList.add('hidden');
  });

  const currentTabEl = document.getElementById(`adminTab${capitalize(tab)}`);
  if (currentTabEl) currentTabEl.classList.remove('hidden');

  renderAdminCurrentTab();
  if (window.lucide) lucide.createIcons();
}

function renderAdminCurrentTab() {
  updateAdminStats();
  const tab = appState.adminActiveTab;

  if (tab === 'dashboard' || tab === 'schedules') {
    renderCalendarGrid();
  } else if (tab === 'members') renderMembersTable();
  else if (tab === 'purchases') renderPurchasesTable();
  else if (tab === 'packages') renderPackagesTable();
  else if (tab === 'classes') renderClassesTable();
  else if (tab === 'coaches') renderCoachesGrid();
  else if (tab === 'checkin') renderCheckInView();
  else if (tab === 'leads') renderLeadsTable();
  else if (tab === 'users') {
    if (typeof renderUsersTable === 'function') renderUsersTable();
  }
  
  if (window.lucide) lucide.createIcons();
}

function updateAdminStats() {
  const statMembers = document.getElementById('statTotalMembers');
  const statPurchases = document.getElementById('statTotalPurchases');
  const statSchedules = document.getElementById('statTotalSchedules');
  const statCheckedIn = document.getElementById('statCheckedIn');

  if (statMembers) statMembers.textContent = appState.members.length;
  if (statPurchases) statPurchases.textContent = appState.packagePurchases.length;
  if (statSchedules) statSchedules.textContent = appState.schedules.length;
  
  if (statCheckedIn) {
    const checkedInCount = appState.classAttendances.filter(a => a.checkInStatus === 'checked_in').length;
    statCheckedIn.textContent = checkedInCount;
  }

  const totalAttBadge = document.getElementById('totalAttendanceBadge');
  if (totalAttBadge) totalAttBadge.textContent = appState.classAttendances.length;
  const totalLeadsBadge = document.getElementById('badgeTotalLeads');
  if (totalLeadsBadge) totalLeadsBadge.textContent = (appState.leads ? appState.leads.length : 0) + ' Prospek';

  updateMasterTopBannerStats();
}

function updateMasterTopBannerStats() {
  const statCashEl = document.getElementById('bannerCashStat');
  const statBookingsEl = document.getElementById('bannerBookingsStat');
  
  if (statCashEl && typeof window.getFinanceCashBalance === 'function') {
    statCashEl.textContent = 'Rp ' + (window.getFinanceCashBalance() || 0).toLocaleString('id-ID');
  }
  if (statBookingsEl) {
    const totalAttendances = appState.classAttendances ? appState.classAttendances.length : 0;
    statBookingsEl.textContent = totalAttendances + ' Presensi Kelas';
  }
}

// =========================================================================
// 5. FITUR 1: PENGELOLAAN MEMBER
// =========================================================================

function renderMembersTable() {
  const tbody = document.getElementById('membersTableBody');
  const searchVal = (document.getElementById('searchMemberInput')?.value || '').toLowerCase();
  if (!tbody) return;

  const filtered = appState.members.filter(m => {
    if (!searchVal) return true;
    return (m.name && m.name.toLowerCase().includes(searchVal)) ||
           (m.memberCode && m.memberCode.toLowerCase().includes(searchVal)) ||
           (m.address && m.address.toLowerCase().includes(searchVal)) ||
           (m.phone && m.phone.includes(searchVal));
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">Tidak ada data member yang sesuai.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((m, idx) => {
    const hasRemaining = (m.remainingSessions || 0) > 0;
    const quotaBadge = hasRemaining
      ? `<span class="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[11px]">${m.remainingSessions} / ${m.totalSessions || m.remainingSessions} Sesi</span>`
      : `<span class="bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded-full font-bold text-[11px]">Kuota Habis</span>`;

    return `
      <tr class="hover:bg-gray-50/80 transition text-xs">
        <td class="py-3 px-4 font-mono font-bold text-sage-800">${m.memberCode || m.id || 'INC-' + (idx + 1)}</td>
        <td class="py-3 px-3">
          <div class="font-bold text-gray-900">${esc(m.name)}</div>
          <div class="text-[11px] text-gray-500">${esc(m.email || '-')}</div>
        </td>
        <td class="py-3 px-3 font-mono">
          <a href="https://wa.me/${(m.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '62')}" target="_blank" class="text-emerald-700 hover:underline inline-flex items-center gap-1 font-medium">
            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> ${esc(m.phone || '-')}
          </a>
        </td>
        <td class="py-3 px-3">
          <div class="font-medium text-gray-800">${esc(m.packageName || 'Belum ada paket')}</div>
          ${m.notes ? `<div class="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded inline-block mt-0.5" title="${esc(m.notes)}"><i data-lucide="alert-circle" class="w-2.5 h-2.5 inline"></i> ${esc(m.notes)}</div>` : ''}
        </td>
        <td class="py-3 px-3">${quotaBadge}</td>
        <td class="py-3 px-3 text-gray-600 text-[11px]">
          <div class="font-medium text-gray-800">${esc(m.address || '-')}</div>
          <div class="text-[10px] text-gray-400 mt-0.5">${m.joinedDate || '-'}</div>
        </td>
        <td class="py-3 px-4 text-right space-x-1">
          <button onclick="openPurchaseModalForMember('${m.id}')" class="px-2.5 py-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold transition inline-flex items-center gap-1 text-[11px]" title="Beli Paket Baru untuk Member Ini">
            <i data-lucide="credit-card" class="w-3 h-3"></i> Beli Paket
          </button>
          <button onclick="openEditMemberModal('${m.id}')" class="p-1 rounded text-gray-500 hover:text-sage-700 hover:bg-gray-100" title="Edit Member">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="deleteMember('${m.id}')" class="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50" title="Hapus Member">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddMemberModal() {
  document.getElementById('memberForm').reset();
  document.getElementById('mmMemberId').value = '';
  document.getElementById('mmModalTitle').textContent = 'Tambah Member Baru';
  document.getElementById('mmJoinedDate').value = getTodayString();
  if (document.getElementById('mmBirthDate')) document.getElementById('mmBirthDate').value = '';
  if (document.getElementById('mmAddress')) document.getElementById('mmAddress').value = '';
  if (document.getElementById('mmSource')) document.getElementById('mmSource').value = '';
  document.getElementById('memberModal').classList.remove('hidden');
  if (window.syncSearchableSelect) window.syncSearchableSelect('mmStatus');
  if (window.lucide) lucide.createIcons();
}

function openEditMemberModal(memberId) {
  const m = appState.members.find(x => x.id === memberId || x.memberCode === memberId);
  if (!m) return;

  document.getElementById('mmMemberId').value = m.id;
  document.getElementById('mmName').value = m.name || '';
  document.getElementById('mmPhone').value = m.phone || '';
  document.getElementById('mmEmail').value = m.email || '';
  document.getElementById('mmJoinedDate').value = m.joinedDate || getTodayString();
  document.getElementById('mmNotes').value = m.notes || '';
  document.getElementById('mmStatus').value = m.status || 'active';
  if (document.getElementById('mmBirthDate')) document.getElementById('mmBirthDate').value = m.birthDate || '';
  if (document.getElementById('mmAddress')) document.getElementById('mmAddress').value = m.address || '';
  if (document.getElementById('mmSource')) document.getElementById('mmSource').value = m.source || '';

  document.getElementById('mmModalTitle').textContent = 'Ubah Data Member';
  document.getElementById('memberModal').classList.remove('hidden');
  if (window.syncSearchableSelect) window.syncSearchableSelect('mmStatus');
  if (window.lucide) lucide.createIcons();
}

function closeMemberModal() {
  document.getElementById('memberModal').classList.add('hidden');
}

function saveMember(event) {
  event.preventDefault();
  const id = document.getElementById('mmMemberId').value;
  const name = document.getElementById('mmName').value.trim();
  const phone = document.getElementById('mmPhone').value.trim();
  const email = document.getElementById('mmEmail').value.trim();
  const joinedDate = document.getElementById('mmJoinedDate').value;
  const notes = document.getElementById('mmNotes').value.trim();
  const status = document.getElementById('mmStatus').value;
  const birthDate = document.getElementById('mmBirthDate') ? document.getElementById('mmBirthDate').value.trim() : '';
  const address = document.getElementById('mmAddress') ? document.getElementById('mmAddress').value.trim() : '';
  const source = document.getElementById('mmSource') ? document.getElementById('mmSource').value.trim() : '';

  if (!name || !phone) {
    showToast('Nama dan No. WhatsApp wajib diisi!', 'warning');
    return;
  }

  if (id) {
    // Edit
    const m = appState.members.find(x => x.id === id || x.memberCode === id);
    if (m) {
      m.name = name;
      m.phone = phone;
      m.email = email;
      m.joinedDate = joinedDate;
      m.notes = notes;
      m.status = status;
      m.birthDate = birthDate;
      m.address = address;
      m.source = source;
      if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushMember('saveMember', m);
    }
    showToast('Data member berhasil diperbarui!', 'success');
  } else {
    // Tambah baru
    const newCode = 'INC' + String(appState.members.length + 1).padStart(3, '0');
    const newMember = {
      id: newCode,
      memberCode: newCode,
      name,
      phone,
      email,
      joinedDate: joinedDate || getTodayString(),
      birthDate,
      address,
      source,
      status,
      activePackageId: '',
      packageName: 'Belum ada paket',
      remainingSessions: 0,
      totalSessions: 0,
      notes
    };
    appState.members.unshift(newMember);
    showToast(`Member baru ${name} (${newCode}) berhasil didaftarkan!`, 'success');
    if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushMember('saveMember', newMember);
  }

  saveState();
  closeMemberModal();
  renderMembersTable();
  updateAdminStats();
}

function deleteMember(memberId) {
  const m = appState.members.find(x => x.id === memberId);
  if (!m) return;
  if (!confirm(`Hapus member "${m.name}"? Riwayat presensi dan pembelian tetap tersimpan.`)) return;

  appState.members = appState.members.filter(x => x.id !== memberId);
  saveState();
  renderMembersTable();
  updateAdminStats();
  showToast(`Member ${m.name} telah dihapus.`, 'info');
  if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushMember('deleteMember', { id: memberId });
}

// =========================================================================
// 6. FITUR 2: PENDAFTARAN & PEMBELIAN PAKET MEMBER
// =========================================================================

function renderPurchasesTable() {
  const tbody = document.getElementById('purchasesTableBody');
  const searchVal = (document.getElementById('searchPurchaseInput')?.value || '').toLowerCase();
  if (!tbody) return;

  const filtered = appState.packagePurchases.filter(p => {
    if (!searchVal) return true;
    return (p.memberName && p.memberName.toLowerCase().includes(searchVal)) ||
           (p.memberId && p.memberId.toLowerCase().includes(searchVal)) ||
           (p.invoiceNo && p.invoiceNo.toLowerCase().includes(searchVal)) ||
           (p.packageName && p.packageName.toLowerCase().includes(searchVal));
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-8 text-gray-400">Belum ada transaksi pembelian paket yang sesuai.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const isLunas = (p.paymentStatus || 'Lunas').toLowerCase().includes('lunas');
    const statusPkg = p.status || ((p.remainingSessions || 0) <= 0 ? 'Habis' : 'Aktif');
    const isAktif = statusPkg.toLowerCase() === 'aktif';

    return `
      <tr class="hover:bg-gray-50/80 transition text-xs">
        <td class="py-3 px-4 font-mono font-bold text-purple-900">${p.invoiceNo || p.id}</td>
        <td class="py-3 px-3 text-gray-600">${p.date || '-'}</td>
        <td class="py-3 px-3">
          <div class="font-bold text-gray-900">${esc(p.memberName)}</div>
          <div class="text-[10px] font-mono text-gray-400">${p.memberId || '-'}</div>
        </td>
        <td class="py-3 px-3 font-medium text-gray-800">${esc(p.packageName)}</td>
        <td class="py-3 px-3 font-semibold text-sage-800">
          <div>${p.sessions} Sesi</div>
          <div class="text-[10px] text-gray-500 font-normal">Sisa: ${p.remainingSessions !== undefined ? p.remainingSessions : p.sessions}</div>
        </td>
        <td class="py-3 px-3 font-bold text-gray-900 font-mono">Rp ${formatIDR(p.price)}</td>
        <td class="py-3 px-3 text-gray-600">
          <div><span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium">${esc(p.paymentMethod || 'Transfer')}</span></div>
          <div class="mt-0.5"><span class="px-1.5 py-0.5 rounded text-[10px] font-semibold ${isLunas ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}">${p.paymentStatus || 'Lunas'}</span></div>
        </td>
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isAktif ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}">
            ${statusPkg}
          </span>
        </td>
        <td class="py-3 px-4 text-right">
          ${p.recordedInFinance ? `
            <span class="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-semibold inline-flex items-center gap-1" title="Tercatat di INCA Finance">
              <i data-lucide="check-circle" class="w-2.5 h-2.5"></i> Keuangan OK
            </span>
          ` : `
            <button onclick="syncPurchaseToFinance('${p.id}')" class="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-lg text-[10px] font-semibold transition inline-flex items-center gap-1 shadow-sm">
              <i data-lucide="receipt" class="w-3 h-3"></i> + Keuangan
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function filterPurchases() {
  renderPurchasesTable();
}

function openAddPurchaseModal() {
  populateMemberSelectOptions();
  populatePackageSelectOptions();
  document.getElementById('purchaseForm').reset();
  document.getElementById('ppmDate').value = getTodayString();
  document.getElementById('ppmRecordFinance').checked = true;
  updatePurchaseModalPrice();
  document.getElementById('purchaseModal').classList.remove('hidden');
  if (window.syncSearchableSelect) {
    window.syncSearchableSelect('ppmMemberId');
    window.syncSearchableSelect('ppmPackageId');
    window.syncSearchableSelect('ppmPaymentMethod');
  }
  if (window.lucide) lucide.createIcons();
}

function openPurchaseModalForMember(memberId) {
  openAddPurchaseModal();
  const select = document.getElementById('ppmMemberId');
  if (select) {
    select.value = memberId;
    if (window.syncSearchableSelect) window.syncSearchableSelect('ppmMemberId');
  }
}

function closePurchaseModal() {
  document.getElementById('purchaseModal').classList.add('hidden');
}

function populateMemberSelectOptions() {
  const sel = document.getElementById('ppmMemberId');
  if (!sel) return;
  sel.innerHTML = `<option value="">-- Pilih Member --</option>` + appState.members.map(m => `
    <option value="${m.id}" data-code="${m.memberCode}" data-phone="${m.phone}" data-remaining="${m.remainingSessions || 0}">${esc(m.name)} (${m.memberCode} · Sisa: ${m.remainingSessions || 0} Sesi)</option>
  `).join('');
  if (window.syncSearchableSelect) window.syncSearchableSelect('ppmMemberId');
}

function populatePackageSelectOptions() {
  const sel = document.getElementById('ppmPackageId');
  if (!sel) return;
  sel.innerHTML = `<option value="">-- Pilih Paket Member --</option>` + appState.packages.filter(p => p.active !== false).map(p => `
    <option value="${p.id}" data-price="${p.promoPrice || p.normalPrice}" data-sessions="${p.sessions}">${esc(p.name)} (${p.sessions} Sesi · Rp ${formatIDR(p.promoPrice || p.normalPrice)})</option>
  `).join('');
  if (window.syncSearchableSelect) window.syncSearchableSelect('ppmPackageId');
}

function updatePurchaseModalPrice() {
  const sel = document.getElementById('ppmPackageId');
  const priceInput = document.getElementById('ppmPrice');
  const sessionsInput = document.getElementById('ppmSessions');
  if (!sel || !priceInput || !sessionsInput) return;

  const opt = sel.options[sel.selectedIndex];
  if (opt && opt.dataset.price) {
    priceInput.value = opt.dataset.price;
    sessionsInput.value = opt.dataset.sessions;
  }
}

function savePurchasePackage(event) {
  event.preventDefault();
  const memberId = document.getElementById('ppmMemberId').value;
  const packageId = document.getElementById('ppmPackageId').value;
  const date = document.getElementById('ppmDate').value || getTodayString();
  const paymentMethod = document.getElementById('ppmPaymentMethod').value;
  const price = Number(document.getElementById('ppmPrice').value || 0);
  const sessions = Number(document.getElementById('ppmSessions').value || 0);
  const recordFinance = document.getElementById('ppmRecordFinance').checked;

  const member = appState.members.find(m => m.id === memberId);
  const pkg = appState.packages.find(p => p.id === packageId);

  if (!member || !pkg) {
    showToast('Pilih Member dan Paket yang valid!', 'warning');
    return;
  }

  const invoiceNo = 'INV-' + getTodayString().replace(/-/g, '').slice(0, 6) + '-' + String(appState.packagePurchases.length + 1).padStart(3, '0');

  const newPurchase = {
    id: 'pur-' + Date.now(),
    invoiceNo,
    memberId: member.id,
    memberName: member.name,
    packageId: pkg.id,
    packageName: pkg.name,
    sessions,
    price,
    paymentMethod,
    date,
    recordedInFinance: false,
    notes: 'Pembelian paket ' + pkg.name
  };

  // Top-up kuota sesi ke member
  member.remainingSessions = (member.remainingSessions || 0) + sessions;
  member.totalSessions = (member.totalSessions || 0) + sessions;
  member.activePackageId = pkg.id;
  member.packageName = pkg.name;

  // Catat otomatis ke Finance jika dicentang
  if (recordFinance && typeof window.addStudioIncomeToFinance === 'function') {
    const success = window.addStudioIncomeToFinance({
      finalPrice: price,
      className: `Paket ${pkg.name}`,
      bookingCode: invoiceNo,
      paymentOption: 'buy_pack',
      clientName: member.name,
      date: date
    });
    if (success) {
      newPurchase.recordedInFinance = true;
    }
  }

  appState.packagePurchases.unshift(newPurchase);
  if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushRecord('addPurchase', newPurchase);
  saveState();
  closePurchaseModal();
  renderPurchasesTable();
  renderMembersTable();
  updateAdminStats();

  showToast(`Pembelian paket untuk ${member.name} berhasil! Kuota bertambah +${sessions} sesi.`, 'success');
}

function syncPurchaseToFinance(purchaseId) {
  const p = appState.packagePurchases.find(x => x.id === purchaseId);
  if (!p) return;

  if (typeof window.addStudioIncomeToFinance === 'function') {
    const success = window.addStudioIncomeToFinance({
      finalPrice: p.price,
      className: `Paket ${p.packageName}`,
      bookingCode: p.invoiceNo,
      paymentOption: 'buy_pack',
      clientName: p.memberName,
      date: p.date
    });

    if (success) {
      p.recordedInFinance = true;
      saveState();
      renderPurchasesTable();
      showToast(`Transaksi ${p.invoiceNo} berhasil dicatat ke INCA Finance!`, 'success');
    }
  } else {
    alert('Modul INCA Finance belum siap.');
  }
}

// =========================================================================
// 7. FITUR 3: DAFTAR PAKET MEMBER
// =========================================================================

function renderPackagesTable() {
  const tbody = document.getElementById('packagesTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.packages.map(p => {
    const isPromo = p.promoPrice && p.promoPrice < p.normalPrice;
    return `
      <tr class="hover:bg-gray-50/80 transition text-xs">
        <td class="py-3 px-4 font-bold text-gray-900">${esc(p.name)}</td>
        <td class="py-3 px-3 uppercase text-[10px] font-bold text-sage-800">${p.category}</td>
        <td class="py-3 px-3 font-semibold text-gray-700">${p.sessions} Sesi</td>
        <td class="py-3 px-3 font-mono text-gray-500 ${isPromo ? 'line-through' : ''}">Rp ${formatIDR(p.normalPrice)}</td>
        <td class="py-3 px-3 font-mono font-bold text-gray-900">${isPromo ? 'Rp ' + formatIDR(p.promoPrice) : '-'}</td>
        <td class="py-3 px-3 text-gray-600">${p.validityDays} Hari</td>
        <td class="py-3 px-3">
          <button onclick="togglePackageStatus('${p.id}')" class="px-2 py-0.5 rounded text-[10px] font-semibold transition ${p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}">
            ${p.active ? 'Aktif' : 'Nonaktif'}
          </button>
        </td>
        <td class="py-3 px-4 text-right space-x-1">
          <button onclick="openEditPackageModal('${p.id}')" class="p-1 text-gray-500 hover:text-sage-700 hover:bg-gray-100 rounded" title="Edit">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="deletePackage('${p.id}')" class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Hapus">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddPackageModal() {
  document.getElementById('packageForm').reset();
  document.getElementById('pmPackageId').value = '';
  document.getElementById('pmModalTitle').textContent = 'Tambah Paket Baru';
  document.getElementById('packageModal').classList.remove('hidden');
  if (window.syncSearchableSelect) window.syncSearchableSelect('pmCategory');
  if (window.lucide) lucide.createIcons();
}

function openEditPackageModal(packageId) {
  const p = appState.packages.find(x => x.id === packageId);
  if (!p) return;

  document.getElementById('pmPackageId').value = p.id;
  document.getElementById('pmName').value = p.name;
  document.getElementById('pmCategory').value = p.category;
  document.getElementById('pmSessions').value = p.sessions;
  document.getElementById('pmNormalPrice').value = p.normalPrice;
  document.getElementById('pmPromoPrice').value = p.promoPrice || '';
  document.getElementById('pmValidityDays').value = p.validityDays;
  document.getElementById('pmFirstTimerOnly').checked = !!p.firstTimerOnly;
  document.getElementById('pmBenefits').value = p.benefits || '';
  document.getElementById('pmDescription').value = p.description || '';

  document.getElementById('pmModalTitle').textContent = 'Ubah Pengaturan Paket';
  document.getElementById('packageModal').classList.remove('hidden');
  if (window.syncSearchableSelect) window.syncSearchableSelect('pmCategory');
  if (window.lucide) lucide.createIcons();
}

function closePackageModal() {
  document.getElementById('packageModal').classList.add('hidden');
}

function savePackage(event) {
  event.preventDefault();
  const id = document.getElementById('pmPackageId').value;
  const name = document.getElementById('pmName').value.trim();
  const category = document.getElementById('pmCategory').value;
  const sessions = Number(document.getElementById('pmSessions').value);
  const normalPrice = Number(document.getElementById('pmNormalPrice').value);
  const promoPriceVal = document.getElementById('pmPromoPrice').value;
  const promoPrice = promoPriceVal ? Number(promoPriceVal) : normalPrice;
  const validityDays = Number(document.getElementById('pmValidityDays').value);
  const firstTimerOnly = document.getElementById('pmFirstTimerOnly').checked;
  const benefits = document.getElementById('pmBenefits').value.trim();
  const description = document.getElementById('pmDescription').value.trim();

  if (id) {
    const pkg = appState.packages.find(p => p.id === id);
    if (pkg) {
      Object.assign(pkg, { name, category, sessions, normalPrice, promoPrice, validityDays, firstTimerOnly, benefits, description });
      showToast('Paket berhasil diperbarui!', 'success');
      if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushPackage('savePackage', pkg);
    }
  } else {
    const newPkg = {
      id: 'pkg-' + Date.now(),
      name,
      category,
      sessions,
      normalPrice,
      promoPrice,
      validityDays,
      firstTimerOnly,
      benefits,
      description,
      active: true
    };
    appState.packages.push(newPkg);
    showToast('Paket baru berhasil ditambahkan!', 'success');
    if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushPackage('savePackage', newPkg);
  }

  saveState();
  closePackageModal();
  renderPackagesTable();
}

function togglePackageStatus(packageId) {
  const pkg = appState.packages.find(p => p.id === packageId);
  if (pkg) {
    pkg.active = !pkg.active;
    saveState();
    renderPackagesTable();
    showToast(`Status paket ${pkg.name} diubah menjadi ${pkg.active ? 'Aktif' : 'Nonaktif'}.`, 'info');
    if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushPackage('savePackage', pkg);
  }
}

function deletePackage(packageId) {
  const pkg = appState.packages.find(p => p.id === packageId);
  if (!pkg) return;
  if (!confirm(`Hapus paket "${pkg.name}"?`)) return;

  appState.packages = appState.packages.filter(p => p.id !== packageId);
  saveState();
  renderPackagesTable();
  showToast(`Paket ${pkg.name} telah dihapus.`, 'info');
  if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushPackage('deletePackage', { id: packageId });
}

// =========================================================================
// 8. FITUR 4: DAFTAR KELAS (MASTER JENIS KELAS)
// =========================================================================

function renderClassesTable() {
  const tbody = document.getElementById('classesTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.classes.map(c => {
    return `
      <tr class="hover:bg-gray-50/80 transition text-xs">
        <td class="py-3 px-4 font-bold text-gray-900">${esc(c.name)}</td>
        <td class="py-3 px-3 uppercase text-[10px] font-bold text-sage-800">${c.category}</td>
        <td class="py-3 px-3 font-semibold text-gray-700">${c.durationMinutes} Menit</td>
        <td class="py-3 px-3 font-semibold text-gray-700">${c.defaultCapacity || 4} Peserta (Maks. 4)</td>
        <td class="py-3 px-3 font-mono font-bold text-gray-900">Rp ${formatIDR(c.dropinPrice || 0)}</td>
        <td class="py-3 px-3 text-gray-500 max-w-xs truncate" title="${esc(c.description || '')}">${esc(c.description || '-')}</td>
        <td class="py-3 px-4 text-right space-x-1">
          <button onclick="openEditClassModal('${c.id}')" class="p-1 text-gray-500 hover:text-sage-700 hover:bg-gray-100 rounded" title="Edit">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="deleteClass('${c.id}')" class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Hapus">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddClassModal() {
  document.getElementById('classForm').reset();
  document.getElementById('cmClassId').value = '';
  document.getElementById('cmCapacity').value = '4';
  document.getElementById('classModalTitle').textContent = 'Tambah Jenis Kelas Baru (Maksimal 4 Peserta)';
  document.getElementById('classModal').classList.remove('hidden');
  if (window.syncSearchableSelect) {
    window.syncSearchableSelect('cmCategory');
    window.syncSearchableSelect('cmLevel');
  }
  if (window.lucide) lucide.createIcons();
}

function openEditClassModal(classId) {
  const c = appState.classes.find(x => x.id === classId);
  if (!c) return;

  document.getElementById('cmClassId').value = c.id;
  document.getElementById('cmName').value = c.name;
  document.getElementById('cmCategory').value = c.category;
  document.getElementById('cmLevel').value = c.level || 'All Levels';
  document.getElementById('cmDuration').value = c.durationMinutes;
  document.getElementById('cmCapacity').value = Math.min(4, c.defaultCapacity || 4);
  document.getElementById('cmDropinPrice').value = c.dropinPrice || 200000;
  document.getElementById('cmDescription').value = c.description || '';

  document.getElementById('classModalTitle').textContent = 'Ubah Jenis Kelas (Maksimal 4 Peserta)';
  document.getElementById('classModal').classList.remove('hidden');
  if (window.syncSearchableSelect) {
    window.syncSearchableSelect('cmCategory');
    window.syncSearchableSelect('cmLevel');
  }
  if (window.lucide) lucide.createIcons();
}

function closeClassModal() {
  document.getElementById('classModal').classList.add('hidden');
}

function saveClass(event) {
  event.preventDefault();
  const id = document.getElementById('cmClassId').value;
  const name = document.getElementById('cmName').value.trim();
  const category = document.getElementById('cmCategory').value;
  const level = document.getElementById('cmLevel').value.trim();
  const durationMinutes = Number(document.getElementById('cmDuration').value);
  const defaultCapacity = Math.min(4, Math.max(1, Number(document.getElementById('cmCapacity').value) || 4));
  const dropinPrice = Number(document.getElementById('cmDropinPrice').value);
  const description = document.getElementById('cmDescription').value.trim();

  if (id) {
    const c = appState.classes.find(x => x.id === id);
    if (c) {
      Object.assign(c, { name, category, level, durationMinutes, defaultCapacity, dropinPrice, description });
      showToast('Master kelas berhasil diperbarui!', 'success');
      if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushClass('saveClass', c);
    }
  } else {
    const newClass = {
      id: 'cls-' + Date.now(),
      name,
      category,
      level,
      durationMinutes,
      defaultCapacity,
      dropinPrice,
      description
    };
    appState.classes.push(newClass);
    showToast('Jenis kelas baru berhasil ditambahkan!', 'success');
    if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushClass('saveClass', newClass);
  }

  saveState();
  closeClassModal();
  renderClassesTable();
}

function deleteClass(classId) {
  const c = appState.classes.find(x => x.id === classId);
  if (!c) return;
  if (!confirm(`Hapus jenis kelas "${c.name}"?`)) return;

  appState.classes = appState.classes.filter(x => x.id !== classId);
  saveState();
  renderClassesTable();
  showToast(`Kelas ${c.name} telah dihapus.`, 'info');
  if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushClass('deleteClass', { id: classId });
}

// =========================================================================
// 9. FITUR 5: DAFTAR COACH / INSTRUKTUR
// =========================================================================

function renderCoachesGrid() {
  const container = document.getElementById('coachesGridContainer');
  if (!container) return;

  container.innerHTML = appState.coaches.map(coach => {
    return `
      <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
        <div class="flex items-start gap-4">
          <img src="${coach.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" alt="${esc(coach.name)}" class="w-14 h-14 rounded-full object-cover border border-gray-300 flex-shrink-0 shadow-sm">
          <div>
            <h4 class="font-bold text-gray-900 text-sm">${esc(coach.name)}</h4>
            <p class="text-xs text-sage-700 font-medium">${esc(coach.role)}</p>
            <div class="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
              <i data-lucide="phone" class="w-3 h-3 text-emerald-600"></i> ${esc(coach.phone || '-')}
            </div>
          </div>
        </div>

        <div class="my-3 text-xs text-gray-600 line-clamp-2">
          ${esc(coach.bio || coach.specialties || '-')}
        </div>

        <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span class="text-[10px] bg-sage-50 text-sage-800 font-semibold px-2 py-0.5 rounded">
            ${esc((coach.specialties || '').split(',')[0] || 'Pilates')}
          </span>
          <div class="space-x-1">
            <button onclick="openEditCoachModal('${coach.id}')" class="p-1 text-gray-500 hover:text-sage-700 hover:bg-gray-100 rounded" title="Edit">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="deleteCoach('${coach.id}')" class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Hapus">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openAddCoachModal() {
  document.getElementById('coachForm').reset();
  document.getElementById('cchCoachId').value = '';
  document.getElementById('coachModalTitle').textContent = 'Tambah Coach Baru';
  document.getElementById('coachModal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function openEditCoachModal(coachId) {
  const c = appState.coaches.find(x => x.id === coachId);
  if (!c) return;

  document.getElementById('cchCoachId').value = c.id;
  document.getElementById('cchName').value = c.name;
  document.getElementById('cchRole').value = c.role;
  document.getElementById('cchSpecialties').value = c.specialties || '';
  document.getElementById('cchPhone').value = c.phone || '';
  document.getElementById('cchBio').value = c.bio || '';
  document.getElementById('cchAvatar').value = c.avatar || '';

  document.getElementById('coachModalTitle').textContent = 'Ubah Profil Coach';
  document.getElementById('coachModal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeCoachModal() {
  document.getElementById('coachModal').classList.add('hidden');
}

function saveCoach(event) {
  event.preventDefault();
  const id = document.getElementById('cchCoachId').value;
  const name = document.getElementById('cchName').value.trim();
  const role = document.getElementById('cchRole').value.trim();
  const specialties = document.getElementById('cchSpecialties').value.trim();
  const phone = document.getElementById('cchPhone').value.trim();
  const bio = document.getElementById('cchBio').value.trim();
  const avatar = document.getElementById('cchAvatar').value.trim() || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80';

  if (id) {
    const c = appState.coaches.find(x => x.id === id);
    if (c) {
      Object.assign(c, { name, role, specialties, phone, bio, avatar });
      showToast('Profil coach berhasil diperbarui!', 'success');
      if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushCoach('saveCoach', c);
    }
  } else {
    const newCoach = {
      id: 'cch-' + Date.now(),
      name,
      role,
      specialties,
      phone,
      bio,
      avatar,
      active: true
    };
    appState.coaches.push(newCoach);
    showToast(`Coach ${name} berhasil ditambahkan!`, 'success');
    if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushCoach('saveCoach', newCoach);
  }

  saveState();
  closeCoachModal();
  renderCoachesGrid();
}

function deleteCoach(coachId) {
  const c = appState.coaches.find(x => x.id === coachId);
  if (!c) return;
  if (!confirm(`Hapus data coach "${c.name}"?`)) return;

  appState.coaches = appState.coaches.filter(x => x.id !== coachId);
  saveState();
  renderCoachesGrid();
  showToast(`Coach ${c.name} telah dihapus.`, 'info');
  if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushCoach('deleteCoach', { id: coachId });
}

// =========================================================================
// 10. FITUR 6: JADWAL KELAS, PLOTING COACH & KALENDER BULANAN (LAPTOP STYLE)
// =========================================================================

function renderSchedulesTab() {
  if (appState.calendarScheduleViewMode === 'table') {
    switchScheduleViewMode('table');
  } else {
    switchScheduleViewMode('calendar');
  }
}

function parseDateToISO(dateStr) {
  if (!dateStr) return '';
  const str = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  const slashMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (slashMatch) {
    const d = slashMatch[1].padStart(2, '0');
    const m = slashMatch[2].padStart(2, '0');
    const y = slashMatch[3];
    return `${y}-${m}-${d}`;
  }

  const textMatch = str.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (textMatch) {
    const d = textMatch[1].padStart(2, '0');
    const rawMonth = textMatch[2].toLowerCase();
    const y = textMatch[3];
    const monthMap = {
      'jan': '01', 'januari': '01', 'january': '01',
      'feb': '02', 'februari': '02', 'february': '02',
      'mar': '03', 'maret': '03', 'march': '03',
      'apr': '04', 'april': '04',
      'mei': '05', 'may': '05',
      'jun': '06', 'juni': '06', 'june': '06',
      'jul': '07', 'juli': '07', 'july': '07',
      'agu': '08', 'agustus': '08', 'aug': '08', 'august': '08',
      'sep': '09', 'september': '09',
      'okt': '10', 'oktober': '10', 'oct': '10', 'october': '10',
      'nov': '11', 'november': '11',
      'des': '12', 'desember': '12', 'dec': '12', 'december': '12'
    };
    const m = monthMap[rawMonth] || '10';
    return `${y}-${m}-${d}`;
  }

  try {
    const dt = new Date(str);
    if (!isNaN(dt.getTime())) {
      return dt.toISOString().split('T')[0];
    }
  } catch (e) {}

  return str;
}

function getClassColorTheme(category, className = '') {
  const cat = (category || '').toLowerCase();
  const name = (className || '').toLowerCase();

  if (cat.includes('reformer') || name.includes('reformer')) {
    return {
      bg: 'bg-sage-50/90 hover:bg-sage-100',
      border: 'border-l-[3px] border-sage-600',
      text: 'text-sage-950 font-bold',
      subtext: 'text-sage-700',
      badge: 'bg-sage-700 text-white',
      pill: 'bg-sage-100 text-sage-800'
    };
  }
  if (cat.includes('cadillac') || name.includes('cadillac')) {
    return {
      bg: 'bg-purple-50/90 hover:bg-purple-100',
      border: 'border-l-[3px] border-purple-600',
      text: 'text-purple-950 font-bold',
      subtext: 'text-purple-700',
      badge: 'bg-purple-700 text-white',
      pill: 'bg-purple-100 text-purple-800'
    };
  }
  if (cat.includes('tower') || name.includes('tower')) {
    return {
      bg: 'bg-amber-50/90 hover:bg-amber-100',
      border: 'border-l-[3px] border-amber-600',
      text: 'text-amber-950 font-bold',
      subtext: 'text-amber-700',
      badge: 'bg-amber-700 text-white',
      pill: 'bg-amber-100 text-amber-800'
    };
  }
  if (cat.includes('chair') || name.includes('chair')) {
    return {
      bg: 'bg-blue-50/90 hover:bg-blue-100',
      border: 'border-l-[3px] border-blue-600',
      text: 'text-blue-950 font-bold',
      subtext: 'text-blue-700',
      badge: 'bg-blue-700 text-white',
      pill: 'bg-blue-100 text-blue-800'
    };
  }
  if (cat.includes('wheel') || name.includes('wheel')) {
    return {
      bg: 'bg-rose-50/90 hover:bg-rose-100',
      border: 'border-l-[3px] border-rose-600',
      text: 'text-rose-950 font-bold',
      subtext: 'text-rose-700',
      badge: 'bg-rose-700 text-white',
      pill: 'bg-rose-100 text-rose-800'
    };
  }
  if (cat.includes('mat') || name.includes('mat')) {
    return {
      bg: 'bg-emerald-50/90 hover:bg-emerald-100',
      border: 'border-l-[3px] border-emerald-600',
      text: 'text-emerald-950 font-bold',
      subtext: 'text-emerald-700',
      badge: 'bg-emerald-700 text-white',
      pill: 'bg-emerald-100 text-emerald-800'
    };
  }
  if (cat.includes('props') || name.includes('props')) {
    return {
      bg: 'bg-indigo-50/90 hover:bg-indigo-100',
      border: 'border-l-[3px] border-indigo-600',
      text: 'text-indigo-950 font-bold',
      subtext: 'text-indigo-700',
      badge: 'bg-indigo-700 text-white',
      pill: 'bg-indigo-100 text-indigo-800'
    };
  }
  // Default / Yoga
  return {
    bg: 'bg-teal-50/90 hover:bg-teal-100',
    border: 'border-l-[3px] border-teal-600',
    text: 'text-teal-950 font-bold',
    subtext: 'text-teal-700',
    badge: 'bg-teal-700 text-white',
    pill: 'bg-teal-100 text-teal-800'
  };
}

function switchScheduleViewMode(mode) {
  appState.calendarScheduleViewMode = mode;
  const calContainer = document.getElementById('scheduleCalendarContainer');
  const tblContainer = document.getElementById('scheduleTableContainer');
  const btnCal = document.getElementById('btnViewModeCalendar');
  const btnTbl = document.getElementById('btnViewModeTable');

  if (mode === 'calendar') {
    if (calContainer) calContainer.classList.remove('hidden');
    if (tblContainer) tblContainer.classList.add('hidden');
    if (btnCal) {
      btnCal.className = 'px-3 py-1.5 rounded-lg bg-white text-sage-900 shadow-sm transition flex items-center gap-1.5 font-bold';
    }
    if (btnTbl) {
      btnTbl.className = 'px-3 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5';
    }
    renderCalendarGrid();
  } else {
    if (calContainer) calContainer.classList.add('hidden');
    if (tblContainer) tblContainer.classList.remove('hidden');
    if (btnCal) {
      btnCal.className = 'px-3 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5';
    }
    if (btnTbl) {
      btnTbl.className = 'px-3 py-1.5 rounded-lg bg-white text-sage-900 shadow-sm transition flex items-center gap-1.5 font-bold';
    }
    renderSchedulesTable();
  }
  if (window.lucide) lucide.createIcons();
}

function prevCalendarMonth() {
  let m = appState.calendarMonth - 1;
  let y = appState.calendarYear;
  if (m < 0) {
    m = 11;
    y--;
  }
  appState.calendarMonth = m;
  appState.calendarYear = y;
  renderCalendarGrid();
}

function nextCalendarMonth() {
  let m = appState.calendarMonth + 1;
  let y = appState.calendarYear;
  if (m > 11) {
    m = 0;
    y++;
  }
  appState.calendarMonth = m;
  appState.calendarYear = y;
  renderCalendarGrid();
}

function jumpToTodayCalendar() {
  const d = new Date();
  appState.calendarYear = d.getFullYear();
  appState.calendarMonth = d.getMonth();
  renderCalendarGrid();
}

function setCalendarMonth(year, monthIndex) {
  appState.calendarYear = year;
  appState.calendarMonth = monthIndex;
  renderCalendarGrid();
}

function renderCalendarGrid() {
  const grid = document.getElementById('calendarDaysGrid');
  const titleText = document.getElementById('calendarMonthYearText');
  const summaryBadge = document.getElementById('calendarMonthSummaryBadge');
  if (!grid) return;

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const year = appState.calendarYear || 2026;
  const month = appState.calendarMonth !== undefined ? appState.calendarMonth : 10;

  if (titleText) {
    titleText.textContent = `${monthNames[month]} ${year}`;
  }

  // Active filters
  const coachFilter = document.getElementById('calendarFilterCoach')?.value || 'all';
  const classFilter = document.getElementById('calendarFilterClass')?.value || 'all';

  // Calculate day cells
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = getTodayString();

  let html = '';
  let monthTotalSessions = 0;
  let monthTotalEnrolled = 0;

  // Helper to filter schedule by coach & class
  function matchesScheduleFilter(s) {
    if (coachFilter !== 'all' && s.coachId !== coachFilter) return false;
    if (classFilter !== 'all') {
      const cat = (s.category || '').toLowerCase();
      const clsName = (s.className || '').toLowerCase();
      if (!cat.includes(classFilter) && !clsName.includes(classFilter)) return false;
    }
    return true;
  }

  // 1. Trailing days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    const prevMonthNum = month === 0 ? 12 : month;
    const prevYearNum = month === 0 ? year - 1 : year;
    const prevISODate = `${prevYearNum}-${String(prevMonthNum).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`;
    
    const daySchedules = appState.schedules.filter(s => {
      return parseDateToISO(s.date) === prevISODate && matchesScheduleFilter(s);
    });

    html += renderCalendarCellHTML({
      dayNumber: prevDay,
      isoDate: prevISODate,
      isCurrentMonth: false,
      isToday: prevISODate === todayStr,
      schedules: daySchedules
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    
    const daySchedules = appState.schedules.filter(s => {
      return parseDateToISO(s.date) === isoDate && matchesScheduleFilter(s);
    });

    // Accumulate summary stats
    monthTotalSessions += daySchedules.length;
    daySchedules.forEach(s => {
      const enrolled = appState.classAttendances.filter(a => a.scheduleId === s.id && a.checkInStatus !== 'cancelled').length;
      monthTotalEnrolled += enrolled;
    });

    html += renderCalendarCellHTML({
      dayNumber: d,
      isoDate: isoDate,
      isCurrentMonth: true,
      isToday: isoDate === todayStr,
      schedules: daySchedules
    });
  }

  // 3. Leading days for next month to complete the 7-column grid
  const totalCellsSoFar = firstDayOfWeek + daysInMonth;
  const remainingCells = (7 - (totalCellsSoFar % 7)) % 7;
  for (let n = 1; n <= remainingCells; n++) {
    const nextMonthNum = month === 11 ? 1 : month + 2;
    const nextYearNum = month === 11 ? year + 1 : year;
    const nextISODate = `${nextYearNum}-${String(nextMonthNum).padStart(2, '0')}-${String(n).padStart(2, '0')}`;

    const daySchedules = appState.schedules.filter(s => {
      return parseDateToISO(s.date) === nextISODate && matchesScheduleFilter(s);
    });

    html += renderCalendarCellHTML({
      dayNumber: n,
      isoDate: nextISODate,
      isCurrentMonth: false,
      isToday: nextISODate === todayStr,
      schedules: daySchedules
    });
  }

  grid.innerHTML = html;

  if (summaryBadge) {
    summaryBadge.innerHTML = `
      <span class="text-sage-800 font-bold">Total ${monthTotalSessions} Sesi Kelas</span> di ${monthNames[month]} ${year} 
      <span class="text-gray-400">·</span> 
      <span class="text-gray-700">${monthTotalEnrolled} Peserta Terdaftar</span>
    `;
  }

  if (window.lucide) lucide.createIcons();
}

function renderCalendarCellHTML({ dayNumber, isoDate, isCurrentMonth, isToday, schedules }) {
  const bgClass = isCurrentMonth ? 'bg-white' : 'bg-gray-50/70 text-gray-400';
  const todayHighlight = isToday
    ? 'w-6 h-6 rounded-full bg-sage-700 text-white flex items-center justify-center font-bold text-xs shadow-xs'
    : (isCurrentMonth ? 'font-bold text-gray-800 text-xs' : 'font-medium text-gray-400 text-xs');

  // Schedules sorted by startTime
  const sorted = schedules.slice().sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  let scheduleCardsHTML = '';
  const maxDisplay = 3;
  const displayList = sorted.slice(0, maxDisplay);
  const extraCount = sorted.length - maxDisplay;

  displayList.forEach(s => {
    const enrolled = appState.classAttendances.filter(a => a.scheduleId === s.id && a.checkInStatus !== 'cancelled').length;
    const isFull = enrolled >= s.capacity;
    const theme = getClassColorTheme(s.category, s.className);

    const coachShort = (s.coachName || 'Coach').replace(/^Coach\s+/i, '');
    const classShort = (s.className || 'Kelas').replace(/^Pilates\s+/i, '').replace(/\s+Class$/i, '');

    scheduleCardsHTML += `
      <div onclick="openScheduleDetailModal('${s.id}')" title="Klik untuk lihat peserta & presensi: ${esc(s.className)} (${s.startTime} - ${s.endTime})" 
        class="group/card cursor-pointer p-1.5 rounded-lg border border-gray-200/90 ${theme.bg} ${theme.border} shadow-2xs hover:shadow-md transition transform hover:-translate-y-0.5 space-y-0.5 text-left select-none">
        <div class="flex items-center justify-between gap-1 leading-tight">
          <span class="font-mono font-bold text-[10px] text-gray-900">${s.startTime}</span>
          <span class="text-[9px] font-bold px-1 py-0.2 rounded ${isFull ? 'bg-red-500 text-white' : 'bg-white/90 text-sage-900 border border-gray-200'}">
            ${isFull ? 'Penuh' : enrolled + '/' + s.capacity}
          </span>
        </div>
        <div class="font-bold text-[10.5px] ${theme.text} truncate leading-tight">${esc(classShort)}</div>
        <div class="text-[9.5px] ${theme.subtext} font-medium flex items-center gap-0.5 truncate">
          <span>👤 ${esc(coachShort)}</span>
        </div>
      </div>
    `;
  });

  if (extraCount > 0) {
    scheduleCardsHTML += `
      <button type="button" onclick="openDaySchedulesView('${isoDate}')" class="w-full text-center py-0.5 text-[10px] font-bold text-sage-800 bg-sage-50 hover:bg-sage-100 rounded border border-sage-200 transition">
        +${extraCount} Sesi Lainnya
      </button>
    `;
  }

  return `
    <div class="min-h-[125px] p-1.5 flex flex-col justify-between ${bgClass} hover:bg-sage-50/20 transition group/cell border-r border-b border-gray-100">
      <div class="flex items-center justify-between mb-1">
        <span class="${todayHighlight}">${dayNumber}</span>
        <button type="button" onclick="openAddScheduleModalForDate('${isoDate}')" title="Tambah Sesi di ${isoDate}" class="opacity-0 group-hover/cell:opacity-100 p-0.5 rounded text-gray-400 hover:text-sage-800 hover:bg-sage-100 transition">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
        </button>
      </div>
      <div class="space-y-1 flex-1">
        ${scheduleCardsHTML}
      </div>
    </div>
  `;
}

function openAddScheduleModalForDate(isoDate) {
  openAddScheduleModal();
  const dateInput = document.getElementById('smDate');
  if (dateInput && isoDate) {
    dateInput.value = isoDate;
  }
}

function openScheduleDetailModal(scheduleId) {
  const sch = appState.schedules.find(s => s.id === scheduleId);
  if (!sch) return;

  appState.activeScheduleDetailId = scheduleId;

  // Header
  const catBadge = document.getElementById('sdmCategoryBadge');
  if (catBadge) {
    catBadge.textContent = (sch.category || 'REFORMER').toUpperCase();
  }
  const dateText = document.getElementById('sdmDateText');
  if (dateText) {
    dateText.textContent = sch.date;
  }
  const classNameEl = document.getElementById('sdmClassName');
  if (classNameEl) {
    classNameEl.textContent = sch.className;
  }
  const schedInfo = document.getElementById('sdmScheduleInfo');
  if (schedInfo) {
    schedInfo.textContent = `${sch.startTime} - ${sch.endTime} WIB · ${sch.room || 'Reformer Studio A'}`;
  }

  // Quick stats
  const coachEl = document.getElementById('sdmCoachName');
  if (coachEl) {
    coachEl.innerHTML = `<i data-lucide="user-check" class="w-3.5 h-3.5 text-sage-600 inline"></i> ${esc(sch.coachName)}`;
  }
  const capEl = document.getElementById('sdmCapacityText');
  if (capEl) {
    capEl.textContent = `${sch.capacity} Orang`;
  }

  // Participants
  const attendances = appState.classAttendances.filter(a => a.scheduleId === scheduleId && a.checkInStatus !== 'cancelled');
  const isFull = attendances.length >= sch.capacity;

  const countBadge = document.getElementById('sdmEnrolledCountBadge');
  if (countBadge) {
    countBadge.textContent = `${attendances.length} Peserta`;
  }
  const statusBadge = document.getElementById('sdmStatusBadge');
  if (statusBadge) {
    if (isFull) {
      statusBadge.textContent = 'PENUH';
      statusBadge.className = 'inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800';
    } else {
      statusBadge.textContent = 'TERSEDIA';
      statusBadge.className = 'inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800';
    }
  }

  const pCount = document.getElementById('sdmParticipantsCount');
  if (pCount) pCount.textContent = attendances.length;

  const tbody = document.getElementById('sdmParticipantsTableBody');
  if (tbody) {
    if (attendances.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-gray-400">Belum ada peserta yang didaftarkan ke sesi ini.</td></tr>`;
    } else {
      tbody.innerHTML = attendances.map((a, idx) => {
        const mem = appState.members.find(m => m.id === a.memberId) || { name: a.memberName, code: a.memberCode || '-' };
        const cleanPhone = (mem.phone || '').replace(/[^0-9]/g, '');
        const waLink = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}` : null;
        const isChecked = a.checkInStatus === 'checked_in';

        return `
          <tr class="hover:bg-gray-50/80 transition text-xs">
            <td class="py-2.5 px-3 font-mono text-gray-500">${idx + 1}</td>
            <td class="py-2.5 px-3">
              <div class="font-bold text-gray-900">${esc(a.memberName)}</div>
              <div class="text-[10px] text-gray-500 font-mono">${esc(a.memberCode || mem.code || '-')}</div>
            </td>
            <td class="py-2.5 px-3">
              ${waLink ? `
                <a href="${waLink}" target="_blank" class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded transition">
                  <i data-lucide="message-circle" class="w-3 h-3"></i> WhatsApp
                </a>
              ` : '<span class="text-gray-400">-</span>'}
            </td>
            <td class="py-2.5 px-3">
              ${isChecked ? `
                <span class="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  <i data-lucide="check" class="w-3 h-3"></i> Hadir (${a.checkInTime || 'Selesai'})
                </span>
              ` : `
                <span class="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                  <i data-lucide="clock" class="w-3 h-3"></i> Belum Presensi
                </span>
              `}
            </td>
            <td class="py-2.5 px-3 text-right">
              ${isChecked ? `
                <button onclick="undoCheckInMemberFromModal('${a.id}', '${sch.id}')" class="px-2 py-1 text-gray-500 hover:text-red-600 rounded text-[10px] font-semibold transition">
                  Batal Hadir
                </button>
              ` : `
                <button onclick="checkInMemberFromModal('${a.id}', '${sch.id}')" class="px-2.5 py-1 bg-sage-700 hover:bg-sage-800 text-white rounded text-[10px] font-bold shadow-xs transition flex items-center gap-1 ml-auto">
                  <i data-lucide="check" class="w-3 h-3"></i> Check-In
                </button>
              `}
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Disable enroll button if class is full
  const btnEnroll = document.getElementById('sdmBtnEnrollMember');
  if (btnEnroll) {
    if (isFull) {
      btnEnroll.disabled = true;
      btnEnroll.className = 'px-3 py-1.5 bg-gray-300 text-gray-500 rounded-xl font-semibold text-xs cursor-not-allowed';
    } else {
      btnEnroll.disabled = false;
      btnEnroll.className = 'px-3 py-1.5 bg-sage-700 hover:bg-sage-800 text-white rounded-xl font-semibold transition text-xs flex items-center gap-1 shadow-xs';
    }
  }

  document.getElementById('scheduleDetailModal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeScheduleDetailModal() {
  document.getElementById('scheduleDetailModal').classList.add('hidden');
}

function openEnrollFromDetailModal() {
  const schId = appState.activeScheduleDetailId;
  closeScheduleDetailModal();
  if (schId) {
    openEnrollMemberModal(schId);
  }
}

function goToPresensiFromDetailModal() {
  const schId = appState.activeScheduleDetailId;
  closeScheduleDetailModal();
  if (schId) {
    goToPresensiForSchedule(schId);
  }
}

function checkInMemberFromModal(attendanceId, scheduleId) {
  const att = appState.classAttendances.find(a => a.id === attendanceId);
  if (!att) return;

  att.checkInStatus = 'checked_in';
  const now = new Date();
  att.checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  saveState();
  openScheduleDetailModal(scheduleId);
  renderCalendarGrid();
  updateAdminStats();
  showToast(`Check-In berhasil untuk ${att.memberName}!`, 'success');
  if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushRecord('addAttendance', att);
}

function undoCheckInMemberFromModal(attendanceId, scheduleId) {
  const att = appState.classAttendances.find(a => a.id === attendanceId);
  if (!att) return;

  att.checkInStatus = 'registered';
  att.checkInTime = null;

  saveState();
  openScheduleDetailModal(scheduleId);
  renderCalendarGrid();
  updateAdminStats();
  showToast(`Status kehadiran ${att.memberName} direset.`, 'info');
  if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushAttendance(att);
}

function openDaySchedulesView(isoDate) {
  switchScheduleViewMode('table');
  const dateInput = document.getElementById('filterScheduleDate');
  if (dateInput) {
    dateInput.value = isoDate;
    filterSchedules();
  }
}

function renderSchedulesTable() {
  const tbody = document.getElementById('schedulesTableBody');
  const dateFilter = document.getElementById('filterScheduleDate')?.value || '';
  if (!tbody) return;

  const filtered = appState.schedules.filter(s => {
    if (!dateFilter) return true;
    return parseDateToISO(s.date) === dateFilter || s.date === dateFilter;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">Tidak ada jadwal sesi kelas pada tanggal ini.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    // Count attendances booked
    const currentBooked = appState.classAttendances.filter(a => a.scheduleId === s.id && a.checkInStatus !== 'cancelled').length;
    const isFull = currentBooked >= s.capacity;
    const capacityBadge = isFull
      ? `<span class="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px]">Penuh (${currentBooked}/${s.capacity})</span>`
      : `<span class="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px]">${currentBooked} / ${s.capacity} Terisi</span>`;

    return `
      <tr class="hover:bg-gray-50/80 transition text-xs">
        <td class="py-3 px-4 font-mono">
          <div class="font-bold text-gray-900">${s.date}</div>
          <div class="text-[11px] text-gray-500">${s.startTime} - ${s.endTime} WIB</div>
        </td>
        <td class="py-3 px-3">
          <div class="font-bold text-gray-900">${esc(s.className)}</div>
          <span class="text-[10px] uppercase font-semibold text-sage-700 bg-sage-50 px-1.5 py-0.2 rounded">${s.category || 'reformer'}</span>
        </td>
        <td class="py-3 px-3 font-semibold text-gray-800">
          <i data-lucide="user-check" class="w-3.5 h-3.5 inline text-sage-600"></i> ${esc(s.coachName)}
        </td>
        <td class="py-3 px-3 text-gray-600">${esc(s.room || 'Studio A')}</td>
        <td class="py-3 px-3">${capacityBadge}</td>
        <td class="py-3 px-4 text-right space-x-1.5">
          <button onclick="openScheduleDetailModal('${s.id}')" class="px-2.5 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition inline-flex items-center gap-1 text-[11px]">
            <i data-lucide="eye" class="w-3 h-3"></i> Detail
          </button>
          <button onclick="goToPresensiForSchedule('${s.id}')" class="px-2.5 py-1 rounded bg-sage-700 text-white font-semibold hover:bg-sage-800 transition inline-flex items-center gap-1 text-[11px]">
            <i data-lucide="check-square" class="w-3 h-3"></i> Presensi (${currentBooked})
          </button>
          <button onclick="deleteSchedule('${s.id}')" class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Hapus Jadwal">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterSchedules() {
  renderSchedulesTable();
}

function openAddScheduleModal() {
  populateScheduleClassSelect();
  populateScheduleCoachSelect();
  document.getElementById('scheduleForm').reset();
  document.getElementById('smScheduleId').value = '';
  document.getElementById('smDate').value = getTodayString();
  document.getElementById('scheduleModalTitle').textContent = 'Ploting Sesi Kelas & Coach Baru';
  autoFillClassCapacity();
  document.getElementById('scheduleModal').classList.remove('hidden');
  if (window.syncSearchableSelect) {
    window.syncSearchableSelect('smClassId');
    window.syncSearchableSelect('smCoachId');
  }
  if (window.lucide) lucide.createIcons();
}

function closeScheduleModal() {
  document.getElementById('scheduleModal').classList.add('hidden');
}

function populateScheduleClassSelect() {
  const sel = document.getElementById('smClassId');
  if (!sel) return;
  sel.innerHTML = appState.classes.map(c => `
    <option value="${c.id}" data-category="${c.category}" data-capacity="${c.defaultCapacity}">${esc(c.name)} (${c.category.toUpperCase()})</option>
  `).join('');
  if (window.syncSearchableSelect) window.syncSearchableSelect('smClassId');
}

function populateScheduleCoachSelect() {
  const sel = document.getElementById('smCoachId');
  if (!sel) return;
  sel.innerHTML = appState.coaches.map(c => `
    <option value="${c.id}" data-role="${c.role}">${esc(c.name)} (${esc(c.role)})</option>
  `).join('');
  if (window.syncSearchableSelect) window.syncSearchableSelect('smCoachId');
}

function autoFillClassCapacity() {
  const sel = document.getElementById('smClassId');
  const capInput = document.getElementById('smCapacity');
  if (!sel || !capInput) return;
  const opt = sel.options[sel.selectedIndex];
  if (opt && opt.dataset.capacity) {
    capInput.value = Math.min(4, Math.max(1, Number(opt.dataset.capacity) || 4));
  } else {
    capInput.value = '4';
  }
}

function saveSchedule(event) {
  event.preventDefault();
  const classId = document.getElementById('smClassId').value;
  const coachId = document.getElementById('smCoachId').value;
  const date = document.getElementById('smDate').value;
  const startTime = document.getElementById('smStartTime').value;
  const endTime = document.getElementById('smEndTime').value;
  const room = document.getElementById('smRoom').value.trim() || 'Reformer Studio A';
  const capacity = Math.min(4, Math.max(1, Number(document.getElementById('smCapacity').value) || 4));

  const cls = appState.classes.find(c => c.id === classId);
  const coach = appState.coaches.find(c => c.id === coachId);

  if (!cls || !coach || !date) {
    showToast('Lengkapi data kelas, coach dan tanggal!', 'warning');
    return;
  }

  const newSchedule = {
    id: 'sch-' + Date.now(),
    classId: cls.id,
    className: cls.name,
    category: cls.category,
    date,
    startTime,
    endTime,
    coachId: coach.id,
    coachName: coach.name,
    room,
    capacity,
    bookedCount: 0,
    status: 'active'
  };

  appState.schedules.unshift(newSchedule);
  saveState();
  closeScheduleModal();
  renderSchedulesTab();
  updateAdminStats();
  if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushSchedule('saveSchedule', newSchedule);

  showToast(`Sesi ${cls.name} bersama ${coach.name} pada ${date} berhasil dijadwalkan!`, 'success');
}

function deleteSchedule(scheduleId) {
  const s = appState.schedules.find(x => x.id === scheduleId);
  if (!s) return;
  if (!confirm(`Hapus jadwal sesi "${s.className}" (${s.date} ${s.startTime})?`)) return;

  appState.schedules = appState.schedules.filter(x => x.id !== scheduleId);
  saveState();
  renderSchedulesTab();
  updateAdminStats();
  showToast(`Sesi kelas telah dihapus.`, 'info');
  if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushSchedule('deleteSchedule', { id: scheduleId });
}

// =========================================================================
// 11. FITUR 7: PLOTING MEMBER KE KELAS & CHECK-IN (PRESENSI)
// =========================================================================

function renderCheckInView() {
  populateCheckInScheduleDropdown();
  
  // If no schedule selected yet, pick first available schedule for today or first in array
  if (!appState.attendanceSelectedScheduleId && appState.schedules.length > 0) {
    const todaySchedule = appState.schedules.find(s => s.date === getTodayString()) || appState.schedules[0];
    appState.attendanceSelectedScheduleId = todaySchedule.id;
  }

  const select = document.getElementById('checkinScheduleSelect');
  if (select && appState.attendanceSelectedScheduleId) {
    select.value = appState.attendanceSelectedScheduleId;
    if (window.syncSearchableSelect) window.syncSearchableSelect('checkinScheduleSelect');
  }

  renderSelectedScheduleDetails();
  renderAttendanceParticipantsTable();
}

function populateCheckInScheduleDropdown() {
  const sel = document.getElementById('checkinScheduleSelect');
  if (!sel) return;

  sel.innerHTML = appState.schedules.map(s => {
    const count = appState.classAttendances.filter(a => a.scheduleId === s.id && a.checkInStatus !== 'cancelled').length;
    return `
      <option value="${s.id}" data-coach="${s.coachName}" data-date="${s.date}" data-class="${s.className}">${s.date} · ${s.startTime} WIB — ${esc(s.className)} (${esc(s.coachName)}) [${count}/${s.capacity}]</option>
    `;
  }).join('');
  if (window.syncSearchableSelect) window.syncSearchableSelect('checkinScheduleSelect');
}

function switchCheckInSubView(subview) {
  const btnSchedule = document.getElementById('btnSubViewSchedule');
  const btnAllLogs = document.getElementById('btnSubViewAllLogs');
  const viewSchedule = document.getElementById('checkInSubViewSchedule');
  const viewAllLogs = document.getElementById('checkInSubViewAllLogs');

  if (subview === 'schedule') {
    if (btnSchedule) {
      btnSchedule.classList.add('bg-white', 'text-sage-800', 'shadow-sm');
      btnSchedule.classList.remove('text-gray-500');
    }
    if (btnAllLogs) {
      btnAllLogs.classList.remove('bg-white', 'text-sage-800', 'shadow-sm');
      btnAllLogs.classList.add('text-gray-500');
    }
    if (viewSchedule) viewSchedule.classList.remove('hidden');
    if (viewAllLogs) viewAllLogs.classList.add('hidden');
  } else {
    if (btnAllLogs) {
      btnAllLogs.classList.add('bg-white', 'text-sage-800', 'shadow-sm');
      btnAllLogs.classList.remove('text-gray-500');
    }
    if (btnSchedule) {
      btnSchedule.classList.remove('bg-white', 'text-sage-800', 'shadow-sm');
      btnSchedule.classList.add('text-gray-500');
    }
    if (viewSchedule) viewSchedule.classList.add('hidden');
    if (viewAllLogs) viewAllLogs.classList.remove('hidden');
    renderAllAttendancesTable();
  }
  if (window.lucide) lucide.createIcons();
}

function renderAllAttendancesTable() {
  const tbody = document.getElementById('allAttendancesTableBody');
  if (!tbody) return;

  const searchVal = (document.getElementById('searchAttendanceInput')?.value || '').toLowerCase();
  const coachFilter = document.getElementById('filterAttendanceCoach')?.value || 'all';
  const statusFilter = document.getElementById('filterAttendanceStatus')?.value || 'all';

  const list = (appState.classAttendances || []).filter(a => {
    // Coach filter
    if (coachFilter !== 'all') {
      const cName = (a.coachName || '').toUpperCase();
      if (!cName.includes(coachFilter)) return false;
    }
    // Status filter
    if (statusFilter !== 'all') {
      const st = a.attendanceStatus || (a.checkInStatus === 'no_show' ? 'No Show' : 'Hadir');
      if (!st.toLowerCase().includes(statusFilter.toLowerCase())) return false;
    }
    // Search
    if (searchVal) {
      const mName = (a.memberName || '').toLowerCase();
      const mId = (a.memberId || '').toLowerCase();
      const txId = (a.transactionId || '').toLowerCase();
      const cls = (a.className || '').toLowerCase();
      const notes = (a.notes || '').toLowerCase();
      if (!mName.includes(searchVal) && !mId.includes(searchVal) && !txId.includes(searchVal) && !cls.includes(searchVal) && !notes.includes(searchVal)) {
        return false;
      }
    }
    return true;
  });

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-8 text-gray-400">Tidak ada log absensi yang sesuai filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((a, idx) => {
    const isNoShow = (a.attendanceStatus || '').toLowerCase().includes('no show') || a.checkInStatus === 'no_show';
    return `
      <tr class="hover:bg-gray-50/80 transition text-xs">
        <td class="py-2.5 px-3 font-medium text-gray-800 whitespace-nowrap">${a.classDate || a.date || '-'}</td>
        <td class="py-2.5 px-2 font-mono text-gray-600">${a.classTime || a.time || '-'}</td>
        <td class="py-2.5 px-3 font-semibold text-sage-900">${esc(a.className || a.packageName || '-')}</td>
        <td class="py-2.5 px-3 font-medium text-gray-700">${esc(a.coachName || '-')}</td>
        <td class="py-2.5 px-3">
          <div class="font-bold text-gray-900">${esc(a.memberName)}</div>
          <div class="text-[10px] font-mono text-gray-400">${a.memberId || '-'}</div>
        </td>
        <td class="py-2.5 px-3 font-mono text-purple-800">${a.transactionId || '-'}</td>
        <td class="py-2.5 px-3">
          ${isNoShow ? `
            <span class="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-bold text-[10px]">No Show (Potong Sesi)</span>
          ` : `
            <span class="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px] inline-flex items-center gap-1">
              <i data-lucide="check" class="w-3 h-3"></i> Hadir
            </span>
          `}
        </td>
        <td class="py-2.5 px-2 text-center font-bold text-gray-700">${a.sessionsDeducted || 1}</td>
        <td class="py-2.5 px-3 text-gray-500 text-[11px]">${esc(a.notes || '-')}</td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function onCheckInScheduleChange() {
  const sel = document.getElementById('checkinScheduleSelect');
  if (!sel) return;
  appState.attendanceSelectedScheduleId = sel.value;
  renderSelectedScheduleDetails();
  renderAttendanceParticipantsTable();
  if (window.lucide) lucide.createIcons();
}

function goToPresensiForSchedule(scheduleId) {
  appState.attendanceSelectedScheduleId = scheduleId;
  switchAdminTab('checkin');
}

function renderSelectedScheduleDetails() {
  const container = document.getElementById('selectedScheduleCard');
  if (!container) return;

  const sch = appState.schedules.find(s => s.id === appState.attendanceSelectedScheduleId);
  if (!sch) {
    container.innerHTML = `<div class="p-4 text-center text-gray-400">Pilih sesi kelas di atas untuk melihat rincian peserta.</div>`;
    return;
  }

  const attendances = appState.classAttendances.filter(a => a.scheduleId === sch.id && a.checkInStatus !== 'cancelled');
  const checkedInCount = attendances.filter(a => a.checkInStatus === 'checked_in').length;
  const isFull = attendances.length >= sch.capacity;

  container.innerHTML = `
    <div class="bg-gradient-to-r from-sage-900 via-gray-900 to-gray-800 text-white rounded-2xl p-5 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="bg-sage-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">${sch.category || 'reformer'}</span>
            <span class="text-xs text-sage-300 font-mono"><i data-lucide="map-pin" class="w-3 h-3 inline"></i> ${sch.room || 'Reformer Room'}</span>
          </div>
          <h3 class="font-serif text-xl sm:text-2xl font-bold">${esc(sch.className)}</h3>
          <p class="text-xs text-gray-300 mt-1 flex items-center gap-3">
            <span><i data-lucide="calendar" class="w-3 h-3 inline text-amber-400"></i> ${sch.date}</span>
            <span><i data-lucide="clock" class="w-3 h-3 inline text-amber-400"></i> ${sch.startTime} - ${sch.endTime} WIB</span>
            <span><i data-lucide="user" class="w-3 h-3 inline text-emerald-400"></i> Coach: <strong>${esc(sch.coachName)}</strong></span>
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-white/10 rounded-xl px-4 py-2.5 text-center border border-white/10">
            <p class="text-[10px] text-gray-300 uppercase font-semibold">Kapasitas</p>
            <h4 class="text-lg font-bold font-mono text-white">${attendances.length} / ${sch.capacity}</h4>
          </div>
          <div class="bg-white/10 rounded-xl px-4 py-2.5 text-center border border-white/10">
            <p class="text-[10px] text-emerald-300 uppercase font-semibold">Telah Hadir</p>
            <h4 class="text-lg font-bold font-mono text-emerald-400">${checkedInCount}</h4>
          </div>
          <button onclick="openEnrollMemberModal('${sch.id}')" ${isFull ? 'disabled' : ''} class="${isFull ? 'bg-gray-700 cursor-not-allowed opacity-60' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-semibold text-xs px-4 py-3 rounded-xl shadow transition flex items-center gap-1.5 flex-shrink-0">
            <i data-lucide="user-plus" class="w-4 h-4"></i> + Daftarkan Member ke Sesi Ini
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderAttendanceParticipantsTable() {
  const tbody = document.getElementById('attendanceParticipantsTableBody');
  if (!tbody) return;

  const schId = appState.attendanceSelectedScheduleId;
  const list = appState.classAttendances.filter(a => a.scheduleId === schId);

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">Belum ada member yang terdaftar di sesi kelas ini. Klik tombol "+ Daftarkan Member ke Sesi Ini" di atas.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((a, idx) => {
    const isCheckedIn = a.checkInStatus === 'checked_in';
    const isCancelled = a.checkInStatus === 'cancelled';

    return `
      <tr class="hover:bg-gray-50/80 transition text-xs ${isCancelled ? 'opacity-40 bg-gray-50' : ''}">
        <td class="py-3 px-4 font-mono text-gray-400 font-bold">${idx + 1}</td>
        <td class="py-3 px-3">
          <div class="font-bold text-gray-900">${esc(a.memberName)}</div>
          <div class="text-[11px] text-gray-500 font-mono">${esc(a.memberPhone || '-')}</div>
        </td>
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${a.paymentType === 'package' ? 'bg-sage-100 text-sage-800' : 'bg-amber-100 text-amber-800'}">
            ${a.paymentType === 'package' ? 'Potong Kuota Paket' : 'Single Drop-in'}
          </span>
          <div class="text-[10px] text-gray-500 mt-0.5">${esc(a.packageName || '-')}</div>
        </td>
        <td class="py-3 px-3">
          ${isCheckedIn ? `
            <span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 text-[11px]">
              <i data-lucide="check" class="w-3 h-3"></i> Hadir (${a.checkInTime ? a.checkInTime.split(' ')[1] : 'Check-In'})
            </span>
          ` : isCancelled ? `
            <span class="bg-gray-200 text-gray-700 font-semibold px-2 py-0.5 rounded text-[11px]">Dibatalkan</span>
          ` : `
            <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 text-[11px]">
              <i data-lucide="clock" class="w-3 h-3"></i> Menunggu Hadir
            </span>
          `}
        </td>
        <td class="py-3 px-3 text-gray-500 text-[11px]">${esc(a.notes || '-')}</td>
        <td class="py-3 px-4 text-right space-x-1">
          ${!isCheckedIn && !isCancelled ? `
            <button onclick="performCheckIn('${a.id}')" class="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition inline-flex items-center gap-1 text-[11px] shadow-sm">
              <i data-lucide="check" class="w-3 h-3"></i> Check-In
            </button>
            <button onclick="cancelAttendance('${a.id}')" class="px-2 py-1 rounded bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 text-[11px] transition" title="Batalkan & Kembalikan Kuota Paket">
              Batal
            </button>
          ` : isCheckedIn ? `
            <span class="text-emerald-700 font-bold text-[11px] inline-flex items-center gap-1">
              <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i> Selesai
            </span>
          ` : `
            <span class="text-gray-400 text-[11px]">Batal</span>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function openEnrollMemberModal(scheduleId) {
  const sch = appState.schedules.find(s => s.id === scheduleId);
  if (!sch) return;

  document.getElementById('enrollScheduleId').value = sch.id;
  document.getElementById('enrollScheduleInfo').textContent = `${sch.className} · ${sch.date} (${sch.startTime} - ${sch.endTime}) bersama ${sch.coachName}`;

  populateEnrollMemberDropdown();
  document.getElementById('enrollMemberModal').classList.remove('hidden');
  onEnrollMemberChange();
  if (window.syncSearchableSelect) window.syncSearchableSelect('enrollMemberSelect');
  if (window.lucide) lucide.createIcons();
}

function closeEnrollMemberModal() {
  document.getElementById('enrollMemberModal').classList.add('hidden');
}

function populateEnrollMemberDropdown() {
  const sel = document.getElementById('enrollMemberSelect');
  if (!sel) return;

  sel.innerHTML = `<option value="">-- Pilih Member dari Database --</option>` + appState.members.map(m => `
    <option value="${m.id}" data-code="${m.memberCode}" data-phone="${m.phone}" data-remaining="${m.remainingSessions || 0}" data-package="${esc(m.packageName || '')}">
      ${esc(m.name)} (${m.memberCode} · Sisa: ${m.remainingSessions || 0} Sesi)
    </option>
  `).join('');
  if (window.syncSearchableSelect) window.syncSearchableSelect('enrollMemberSelect');
}

function onEnrollMemberChange() {
  const sel = document.getElementById('enrollMemberSelect');
  const infoBox = document.getElementById('enrollMemberQuotaInfo');
  if (!sel || !infoBox) return;

  const opt = sel.options[sel.selectedIndex];
  if (opt && opt.value) {
    const remaining = Number(opt.dataset.remaining || 0);
    const pkgName = opt.dataset.package;
    if (remaining > 0) {
      infoBox.innerHTML = `
        <div class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-xs flex items-center justify-between">
          <span>Paket Aktif: <strong>${pkgName}</strong></span>
          <span class="font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Sisa ${remaining} Sesi</span>
        </div>
      `;
    } else {
      infoBox.innerHTML = `
        <div class="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl text-xs">
          ⚠️ Kuota sesi paket member ini sudah habis. Keikutsertaan akan dicatat sebagai <strong>Single Drop-in</strong>.
        </div>
      `;
    }
  } else {
    infoBox.innerHTML = '';
  }
}

function submitEnrollMember(event) {
  event.preventDefault();
  const scheduleId = document.getElementById('enrollScheduleId').value;
  const memberId = document.getElementById('enrollMemberSelect').value;
  const notes = document.getElementById('enrollNotes').value.trim();
  const sch = appState.schedules.find(s => s.id === scheduleId);
  const member = appState.members.find(m => m.id === memberId);

  if (!sch || !member) {
    showToast('Pilih member yang valid!', 'warning');
    return;
  }

  // Check capacity
  const currentCount = appState.classAttendances.filter(a => a.scheduleId === sch.id && a.checkInStatus !== 'cancelled').length;
  if (currentCount >= sch.capacity) {
    alert('Kapasitas alat pada sesi kelas ini sudah penuh!');
    return;
  }

  // Check duplicate enrollment
  const alreadyIn = appState.classAttendances.some(a => a.scheduleId === sch.id && a.memberId === member.id && a.checkInStatus !== 'cancelled');
  if (alreadyIn) {
    alert('Member ini sudah terdaftar di sesi kelas ini!');
    return;
  }

  const hasQuota = (member.remainingSessions || 0) > 0;
  const paymentType = hasQuota ? 'package' : 'dropin';
  
  // Potong kuota sesi jika ada paket
  if (hasQuota) {
    member.remainingSessions -= 1;
  }

  const newAttendance = {
    id: 'att-' + Date.now(),
    scheduleId: sch.id,
    memberId: member.id,
    memberName: member.name,
    memberPhone: member.phone,
    paymentType,
    packageName: member.packageName || 'Drop-in',
    amount: hasQuota ? 0 : 200000,
    checkInStatus: 'booked',
    checkInTime: '',
    notes: notes || (hasQuota ? 'Potong 1 sesi paket' : 'Drop-in bayar di tempat')
  };

  appState.classAttendances.unshift(newAttendance);
  sch.bookedCount = (sch.bookedCount || 0) + 1;

  saveState();
  closeEnrollMemberModal();
  renderAttendanceParticipantsTable();
  renderSelectedScheduleDetails();
  renderMembersTable();
  if (appState.adminActiveTab === 'schedules') {
    renderSchedulesTab();
  }
  updateAdminStats();

  showToast(`${member.name} berhasil didaftarkan ke sesi kelas!`, 'success');
  if (window.GoogleSheetsSync) {
    window.GoogleSheetsSync.pushAttendance(newAttendance);
    if (member && member.id) {
      window.GoogleSheetsSync.pushRecord('updateMemberQuota', { memberId: member.id, remainingSessions: member.remainingSessions });
    }
  }
}

function performCheckIn(attendanceId) {
  const att = appState.classAttendances.find(a => a.id === attendanceId);
  if (!att) return;

  const now = new Date();
  const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  att.checkInStatus = 'checked_in';
  att.checkInTime = `${getTodayString()} ${timeStr}`;

  saveState();
  renderAttendanceParticipantsTable();
  renderSelectedScheduleDetails();
  if (appState.adminActiveTab === 'schedules') renderSchedulesTab();
  updateAdminStats();

  showToast(`Check-In Berhasil: ${att.memberName} hadir pada ${timeStr} WIB!`, 'success');
  if (window.GoogleSheetsSync) window.GoogleSheetsSync.pushAttendance(att);
}

function cancelAttendance(attendanceId) {
  const att = appState.classAttendances.find(a => a.id === attendanceId);
  if (!att) return;
  if (!confirm(`Batalkan pendaftaran ${att.memberName}? Kuota 1 sesi akan dikembalikan ke akun member.`)) return;

  // Kembalikan kuota sesi ke member jika tipe paket
  let member = null;
  if (att.paymentType === 'package' && att.memberId) {
    member = appState.members.find(m => m.id === att.memberId);
    if (member) {
      member.remainingSessions = (member.remainingSessions || 0) + 1;
    }
  }

  att.checkInStatus = 'cancelled';
  saveState();
  renderAttendanceParticipantsTable();
  renderSelectedScheduleDetails();
  renderMembersTable();
  if (appState.adminActiveTab === 'schedules') renderSchedulesTab();
  updateAdminStats();

  showToast(`Pendaftaran ${att.memberName} dibatalkan. Kuota 1 sesi telah dikembalikan.`, 'info');
  if (window.GoogleSheetsSync) {
    window.GoogleSheetsSync.pushAttendance(att);
    if (member && member.id) {
      window.GoogleSheetsSync.pushRecord('updateMemberQuota', { memberId: member.id, remainingSessions: member.remainingSessions });
    }
  }
}

// =========================================================================
// 12. FITUR 8: LEADS PENAWARAN (SHEET1 EXCEL)
// =========================================================================

function renderLeadsTable() {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  const searchVal = (document.getElementById('searchLeadsInput')?.value || '').toLowerCase();
  const list = (appState.leads || []).filter(l => {
    if (!searchVal) return true;
    return (l.name && l.name.toLowerCase().includes(searchVal)) ||
           (l.phone && l.phone.includes(searchVal)) ||
           (l.source && l.source.toLowerCase().includes(searchVal));
  });

  const badge = document.getElementById('badgeTotalLeads');
  if (badge) badge.textContent = `${list.length} / ${(appState.leads || []).length} Prospek`;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-gray-400">Tidak ada data penawaran / leads yang sesuai.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((l, idx) => {
    return `
      <tr class="hover:bg-gray-50/80 transition text-xs">
        <td class="py-3 px-4 font-mono text-gray-400">${idx + 1}</td>
        <td class="py-3 px-3 font-bold text-gray-900">${esc(l.name)}</td>
        <td class="py-3 px-3 font-mono">
          <a href="https://wa.me/${(l.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '62')}" target="_blank" class="text-emerald-700 hover:underline inline-flex items-center gap-1 font-medium">
            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> ${esc(l.phone || '-')}
          </a>
        </td>
        <td class="py-3 px-3 text-gray-600">${esc(l.offeredDate || '-')}</td>
        <td class="py-3 px-3">
          <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium">${esc(l.source || '-')}</span>
        </td>
        <td class="py-3 px-4 text-right">
          <button onclick="convertLeadToMember('${l.id}')" class="bg-sage-700 hover:bg-sage-800 text-white px-3 py-1.5 rounded-xl font-semibold transition inline-flex items-center gap-1 text-[11px] shadow-sm">
            <i data-lucide="user-plus" class="w-3 h-3"></i> + Jadikan Member
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function convertLeadToMember(leadId) {
  const lead = (appState.leads || []).find(l => l.id === leadId);
  if (!lead) return;

  openAddMemberModal();
  document.getElementById('mmName').value = lead.name || '';
  document.getElementById('mmPhone').value = lead.phone || '';
  if (document.getElementById('mmSource')) {
    document.getElementById('mmSource').value = lead.source || '';
  }
}

// =========================================================================
// 13. FITUR 9: MASTER EXCEL, CADANGAN DATA & RESET (BACKUP)
// =========================================================================

function exportStudioToExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Library SheetJS belum terpasang!', 'warning');
    return;
  }
  const wb = XLSX.utils.book_new();

  // 1. DATA MEMBER
  const memberRows = [
    ['ID Member', 'Nama Member', 'No WhatsApp', 'Tanggal Daftar', 'Email', 'Tanggal Lahir', 'Alamat', 'Sumber Member', 'Catatan']
  ];
  appState.members.forEach(m => {
    memberRows.push([
      m.memberCode || m.id,
      m.name || '',
      m.phone || '',
      m.joinedDate || '',
      m.email || '',
      m.birthDate || '',
      m.address || '',
      m.source || '',
      m.notes || ''
    ]);
  });
  const wsMembers = XLSX.utils.aoa_to_sheet(memberRows);
  XLSX.utils.book_append_sheet(wb, wsMembers, 'DATA MEMBER');

  // 2. PEMBELIAN PAKET
  const purchaseRows = [
    ['ID Transaksi Paket', 'Tanggal Beli', 'ID Member', 'Nama Member (otomatis)', 'Jenis Paket (otomatis)', 'Total Sesi (otomatis)', 'Harga Paket (Rp) otomatis', 'Diskon (Rp)', 'Total Bayar (Rp)', 'Metode Bayar', 'Status Pembayaran', 'Tanggal Mulai', 'Tanggal Expired (otomatis)', 'Sesi Terpakai (otomatis)', 'Sisa Sesi (otomatis)', 'Status Paket (otomatis)', 'Catatan']
  ];
  appState.packagePurchases.forEach(p => {
    purchaseRows.push([
      p.invoiceNo || p.id,
      p.date || '',
      p.memberId || '',
      p.memberName || '',
      p.packageName || '',
      p.sessions || 0,
      p.normalPrice || p.price || 0,
      p.discount || 0,
      p.price || 0,
      p.paymentMethod || 'Transfer',
      p.paymentStatus || 'Lunas',
      p.startDate || '',
      p.expireDate || '',
      p.usedSessions || 0,
      p.remainingSessions || 0,
      p.status || 'Aktif',
      p.notes || ''
    ]);
  });
  const wsPurchases = XLSX.utils.aoa_to_sheet(purchaseRows);
  XLSX.utils.book_append_sheet(wb, wsPurchases, 'PEMBELIAN PAKET');

  // 3. ABSENSI KELAS
  const attendanceRows = [
    ['Tanggal Kelas', 'ID Transaksi Paket', 'ID Member (otomatis)', 'Nama Member (otomatis)', 'Jenis Kelas', 'Jam Kelas', 'Instruktur', 'Status Kehadiran', 'Sesi Terhitung (otomatis)', 'Catatan']
  ];
  appState.classAttendances.forEach(a => {
    attendanceRows.push([
      a.classDate || a.date || '',
      a.transactionId || '',
      a.memberId || '',
      a.memberName || '',
      a.className || a.packageName || '',
      a.classTime || a.time || '',
      a.coachName || '',
      a.attendanceStatus || (a.checkInStatus === 'no_show' ? 'No Show (potong sesi)' : 'Hadir'),
      a.sessionsDeducted || 1,
      a.notes || ''
    ]);
  });
  const wsAttendance = XLSX.utils.aoa_to_sheet(attendanceRows);
  XLSX.utils.book_append_sheet(wb, wsAttendance, 'ABSENSI KELAS');

  // 4. TARIF PAKET
  const tariffRows = [
    ['Jenis Paket', 'Jumlah Sesi', 'Harga Paket (isi admin)', 'Masa Aktif (hari)', 'Keterangan']
  ];
  appState.packages.forEach(pkg => {
    tariffRows.push([
      pkg.name,
      pkg.sessions,
      'Rp ' + (pkg.normalPrice || 0).toLocaleString('id-ID'),
      pkg.validityDays,
      pkg.benefits || pkg.description || ''
    ]);
  });
  const wsTariff = XLSX.utils.aoa_to_sheet(tariffRows);
  XLSX.utils.book_append_sheet(wb, wsTariff, 'TARIF PAKET');

  // 5. LEADS PENAWARAN (Sheet1)
  const leadsRows = [
    ['No', 'Nama', 'No Telp', 'Tgl Pertama Penawaran', 'Sumber']
  ];
  (appState.leads || []).forEach((l, idx) => {
    leadsRows.push([
      idx + 1,
      l.name || '',
      l.phone || '',
      l.offeredDate || '',
      l.source || ''
    ]);
  });
  const wsLeads = XLSX.utils.aoa_to_sheet(leadsRows);
  XLSX.utils.book_append_sheet(wb, wsLeads, 'Sheet1');

  // 6. JADWAL KELAS (CALENDAR / SCHEDULES)
  const scheduleRows = [
    ['ID Jadwal', 'Tanggal Sesi', 'Jam Mulai', 'Jam Selesai', 'Nama Kelas', 'Kategori', 'Coach Instruktur', 'Ruangan', 'Kapasitas Peserta', 'Status']
  ];
  appState.schedules.forEach(s => {
    scheduleRows.push([
      s.id,
      s.date || '',
      s.startTime || '',
      s.endTime || '',
      s.className || '',
      s.category || '',
      s.coachName || '',
      s.room || 'Reformer Studio A',
      s.capacity || 6,
      s.status || 'active'
    ]);
  });
  const wsSchedules = XLSX.utils.aoa_to_sheet(scheduleRows);
  XLSX.utils.book_append_sheet(wb, wsSchedules, 'JADWAL KELAS');

  // 7. DASHBOARD
  const totRev = appState.packagePurchases.reduce((acc, p) => acc + (p.price || 0), 0);
  const usedSess = appState.packagePurchases.reduce((acc, p) => acc + (p.usedSessions || 0), 0);
  const remSess = appState.packagePurchases.reduce((acc, p) => acc + (p.remainingSessions || 0), 0);
  const activePkgs = appState.packagePurchases.filter(p => (p.remainingSessions || 0) > 0).length;
  const expiredPkgs = appState.packagePurchases.filter(p => (p.remainingSessions || 0) <= 0).length;

  const dashboardRows = [
    ['INDIKATOR', 'NILAI'],
    ['Jumlah Member', appState.members.length],
    ['Transaksi Paket', appState.packagePurchases.length],
    ['Total Tagihan Paket', 'Rp ' + totRev.toLocaleString('id-ID')],
    ['Pembayaran Lunas', 'Rp ' + totRev.toLocaleString('id-ID')],
    ['Sesi Terpakai', usedSess],
    ['Sisa Sesi Aktif', remSess],
    ['Paket Aktif', activePkgs],
    ['Paket Habis / Expired', expiredPkgs],
    ['Pembayaran Belum Lunas', 0]
  ];
  const wsDashboard = XLSX.utils.aoa_to_sheet(dashboardRows);
  XLSX.utils.book_append_sheet(wb, wsDashboard, 'DASHBOARD');

  XLSX.writeFile(wb, 'Data_Admin_Studio_INCA.xlsx');
  showToast('Berkas Data_Admin_Studio_INCA.xlsx berhasil diekspor!', 'success');
}

function importStudioFromExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (window.processMasterExcelUpload) {
    window.processMasterExcelUpload(file);
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array' });

      // 1. DATA MEMBER
      if (wb.SheetNames.includes('DATA MEMBER')) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets['DATA MEMBER']);
        if (rows.length > 0) {
          appState.members = rows.filter(r => r['Nama Member'] || r['ID Member']).map(r => ({
            id: r['ID Member'] || 'INC' + Math.floor(Math.random() * 1000),
            memberCode: r['ID Member'] || '',
            name: r['Nama Member'] || '',
            phone: r['No WhatsApp'] || '',
            email: r['Email'] || '',
            joinedDate: r['Tanggal Daftar'] || '',
            birthDate: r['Tanggal Lahir'] || '',
            address: r['Alamat'] || '',
            source: r['Sumber Member'] || '',
            notes: r['Catatan'] || '',
            status: 'active',
            packageName: 'Paket Terdaftar',
            remainingSessions: 0,
            totalSessions: 0
          }));
        }
      }

      // 2. PEMBELIAN PAKET
      if (wb.SheetNames.includes('PEMBELIAN PAKET')) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets['PEMBELIAN PAKET']);
        if (rows.length > 0) {
          appState.packagePurchases = rows.map((r, idx) => {
            const inv = r['ID Transaksi Paket'] || r['mey'] || ('ID' + String(idx + 1).padStart(3, '0'));
            const sess = parseInt(r['Total Sesi (otomatis)'] || r['Total Sesi'] || 1, 10);
            const used = parseInt(r['Sesi Terpakai (otomatis)'] || 0, 10);
            const rem = parseInt(r['Sisa Sesi (otomatis)'] || (sess - used), 10);
            const price = parseInt(String(r['Total Bayar (Rp)'] || r['Harga Paket (Rp) otomatis'] || 0).replace(/[^0-9]/g, '') || 0, 10);

            return {
              id: inv,
              invoiceNo: inv,
              date: r['Tanggal Beli'] || '',
              memberId: r['ID Member'] || '',
              memberName: r['Nama Member (otomatis)'] || r['Nama Member'] || '',
              packageName: r['Jenis Paket (otomatis)'] || r['Jenis Paket'] || '',
              sessions: sess,
              price: price,
              discount: parseInt(String(r['Diskon (Rp)'] || 0).replace(/[^0-9]/g, '') || 0, 10),
              paymentMethod: r['Metode Bayar'] || 'Transfer',
              paymentStatus: r['Status Pembayaran'] || 'Lunas',
              startDate: r['Tanggal Mulai'] || '',
              expireDate: r['Tanggal Expired (otomatis)'] || '',
              usedSessions: used,
              remainingSessions: rem,
              status: r['Status Paket (otomatis)'] || (rem <= 0 ? 'Habis' : 'Aktif'),
              notes: r['Catatan'] || '',
              recordedInFinance: true
            };
          });
        }
      }

      // 3. ABSENSI KELAS
      if (wb.SheetNames.includes('ABSENSI KELAS')) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets['ABSENSI KELAS']);
        if (rows.length > 0) {
          appState.classAttendances = rows.map((r, idx) => {
            const st = r['Status Kehadiran'] || 'Hadir';
            const isNoShow = st.toLowerCase().includes('no show');
            return {
              id: 'att-' + (idx + 1),
              transactionId: r['ID Transaksi Paket'] || '',
              memberId: r['ID Member (otomatis)'] || r['ID Member'] || '',
              memberName: r['Nama Member (otomatis)'] || r['Nama Member'] || '',
              className: r['Jenis Kelas'] || '',
              classDate: r['Tanggal Kelas'] || '',
              classTime: String(r['Jam Kelas'] || ''),
              coachName: r['Instruktur'] || '',
              attendanceStatus: st,
              checkInStatus: isNoShow ? 'no_show' : 'checked_in',
              sessionsDeducted: parseInt(r['Sesi Terhitung (otomatis)'] || 1, 10),
              notes: r['Catatan'] || ''
            };
          });
        }
      }

      // 4. TARIF PAKET
      if (wb.SheetNames.includes('TARIF PAKET')) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets['TARIF PAKET']);
        if (rows.length > 0) {
          appState.packages = rows.map((r, idx) => {
            const name = r['Jenis Paket'] || ('Paket ' + (idx + 1));
            const price = parseInt(String(r['Harga Paket (isi admin)'] || 0).replace(/[^0-9]/g, '') || 0, 10);
            return {
              id: 'pkg-' + (idx + 1),
              name: name,
              category: name.toLowerCase().includes('cadillac') ? 'cadillac' : name.toLowerCase().includes('yoga') ? 'yoga' : 'reformer',
              sessions: parseInt(r['Jumlah Sesi'] || 1, 10),
              normalPrice: price,
              promoPrice: price,
              validityDays: parseInt(r['Masa Aktif (hari)'] || 7, 10),
              active: true,
              firstTimerOnly: name.toLowerCase().includes('promo') || name.toLowerCase().includes('triall'),
              benefits: r['Keterangan'] || '',
              description: name + ' - ' + (r['Keterangan'] || '')
            };
          });
        }
      }

      // 5. LEADS PENAWARAN (Sheet1)
      const sheet1Name = wb.SheetNames.find(n => n.toLowerCase().includes('sheet1') || n.toLowerCase().includes('leads'));
      if (sheet1Name) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet1Name]);
        if (rows.length > 0) {
          appState.leads = rows.filter(r => r['Nama']).map((r, idx) => ({
            id: 'lead-' + (idx + 1),
            name: r['Nama'] || '',
            phone: r['No Telp'] || '',
            offeredDate: r['Tgl Pertama Penawaran'] || '',
            source: r['Sumber'] || '',
            status: 'Prospek'
          }));
        }
      }

      // Recalculate member sessions
      appState.members.forEach(m => {
        const purchases = appState.packagePurchases.filter(p => p.memberId === m.memberCode || p.memberId === m.id);
        if (purchases.length > 0) {
          m.packageName = purchases[purchases.length - 1].packageName;
          m.remainingSessions = purchases.reduce((sum, p) => sum + (p.remainingSessions || 0), 0);
          m.totalSessions = purchases.reduce((sum, p) => sum + (p.sessions || 0), 0);
        }
      });

      saveState();
      renderAdminCurrentTab();
      updateAdminStats();
      showToast(`Berhasil mengimpor ${appState.members.length} Member, ${appState.packagePurchases.length} Transaksi, dan ${appState.classAttendances.length} Absensi dari Excel!`, 'success');
    } catch (err) {
      console.error(err);
      alert('Gagal membaca berkas Excel: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function resetStudioDataToExcel() {
  if (confirm('Apakah Anda yakin ingin memuat ulang seluruh data asli dari Excel INCA Pilates? Data akan disinkronkan kembali ke 234 member, 279 transaksi, 222 absensi, dan 18 paket otentik.')) {
    const defaults = getDefaultStudioData();
    appState.members = JSON.parse(JSON.stringify(defaults.members));
    appState.packagePurchases = JSON.parse(JSON.stringify(defaults.packagePurchases));
    appState.packages = JSON.parse(JSON.stringify(defaults.packages));
    appState.classes = JSON.parse(JSON.stringify(defaults.classes));
    appState.coaches = JSON.parse(JSON.stringify(defaults.coaches));
    appState.schedules = JSON.parse(JSON.stringify(defaults.schedules));
    appState.classAttendances = JSON.parse(JSON.stringify(defaults.classAttendances));
    appState.leads = JSON.parse(JSON.stringify(defaults.leads || []));
    appState.indicators = JSON.parse(JSON.stringify(defaults.indicators || {}));
    
    saveState();
    renderAdminCurrentTab();
    updateAdminStats();
    showToast('Data studio berhasil di-reset ke master Excel otentik!', 'success');
  }
}

// =========================================================================
// 14. CADANGAN DATA JSON (BACKUP)
// =========================================================================

function exportStudioDataJSON() {
  const dataStr = JSON.stringify(appState, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `INCA_Studio_Backup_${getTodayString()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Cadangan data studio berhasil diunduh.', 'success');
}

function importStudioDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed && Array.isArray(parsed.members) && Array.isArray(parsed.classes)) {
        if (confirm(`Ganti seluruh data studio dengan cadangan dari ${file.name}?`)) {
          appState = { ...appState, ...parsed };
          saveState();
          renderAdminCurrentTab();
          showToast('Data studio berhasil dipulihkan dari cadangan!', 'success');
        }
      } else {
        alert('Format file JSON tidak valid untuk Sistem Studio INCA.');
      }
    } catch (err) {
      alert('Gagal membaca file JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function resetToDefaultStudioData() {
  if (confirm('Kembalikan semua data studio ke contoh awal bawaan? Data saat ini akan digantikan.')) {
    const defaults = getDefaultStudioData();
    appState = {
      ...appState,
      ...defaults
    };
    saveState();
    renderAdminCurrentTab();
    showToast('Data studio telah direset ke data contoh awal.', 'info');
  }
}

function saveNewAdminPassword(event) {
  event.preventDefault();
  const newPass = document.getElementById('newAdminPasswordInput').value.trim();
  if (!newPass || newPass.length < 4) {
    showToast('Password baru minimal 4 karakter!', 'warning');
    return;
  }
  appState.adminAuth.password = newPass;
  saveState();
  document.getElementById('newAdminPasswordInput').value = '';
  showToast('Password baru admin studio berhasil disimpan!', 'success');
}

function adminLogout() {
  showToast('Anda mengunci sistem studio.', 'info');
}

// =========================================================================
// 13. UTILITIES & TOAST NOTIFICATION
// =========================================================================

function formatIDR(num) {
  return (num || 0).toLocaleString('id-ID');
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// esc utility (reuse window.esc from finance-app.js, fallback otherwise)
if (typeof window.esc !== 'function') {
  window.esc = function(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  };
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-800 text-white border-emerald-700',
    warning: 'bg-amber-800 text-white border-amber-700',
    info: 'bg-gray-900 text-white border-gray-800'
  };
  
  toast.className = `px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 pointer-events-auto transition-all transform duration-300 translate-y-2 opacity-0 ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// =========================================================================
// 14. INITIAL BOOTSTRAP
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadState();

  // Inisialisasi Auth Gate & Role Access Control Portal
  if (typeof initAuthGate === 'function') {
    const isLoggedIn = initAuthGate();
    if (!isLoggedIn) {
      if (window.lucide) lucide.createIcons();
      return;
    }
  } else {
    switchViewMode('admin');
    switchAdminTab('dashboard');
  }

  if (window.lucide) {
    lucide.createIcons();
  }
  
  // Inisialisasi Seluruh Searchable Dropdown di Modul Admin Studio
  if (window.initAllStudioSearchableSelects) {
    window.initAllStudioSearchableSelects();
  }

  // Inisialisasi Dropzone Drag & Drop Master Excel
  if (window.initExcelDropzone) {
    window.initExcelDropzone();
  }

  setTimeout(() => {
    updateMasterTopBannerStats();
  }, 300);
});
