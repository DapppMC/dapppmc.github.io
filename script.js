// ============================================================================
// Ahmad Dafa Salam (DapppMC) — Interactive Pixel Portfolio Engine
// ============================================================================

let currentLang = 'en';
let currentExpIndex = 0;
let currentProjectIndex = 0;
let currentFilter = 'all';
const unlockedAchievements = new Set();

function unlockAchievement(title, desc) {
  const key = title + '|' + desc;
  if (unlockedAchievements.has(key)) return;
  unlockedAchievements.add(key);
  const toast = document.getElementById('achievement-toast');
  const tEl = document.getElementById('ach-title');
  const dEl = document.getElementById('ach-desc');
  if (!toast || !tEl || !dEl) return;
  tEl.textContent = 'Achievement Get! — ' + title;
  dEl.textContent = desc;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3600);
}

// 1. Multilingual Preloader + Lenis Smooth Scroll
window.addEventListener('DOMContentLoaded', () => {
  const greetings = ['Hello', 'Halo', 'Sugeng Rawuh', 'こんにちは', '안녕하세요', 'Bonjour', 'Welcome to DapppMC'];
  const greetingEl = document.getElementById('greeting-text');
  const preloader = document.getElementById('preloader');
  let gIdx = 0;

  const interval = setInterval(() => {
    gIdx++;
    if (gIdx < greetings.length && greetingEl) {
      greetingEl.textContent = greetings[gIdx];
    } else {
      clearInterval(interval);
      if (preloader) preloader.classList.add('fade-out');
      document.body.classList.remove('loading');
    }
  }, 190);

  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Scroll Reveal Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => observer.observe(el));

  renderExperience();
  renderCarousel();
  renderProjectsGrid();
  setupTerminal();
});

// 2. Bilingual Dictionary (EN / ID)
const i18n = {
  en: {
    nav_home: 'Home',
    nav_about: 'About',
    nav_exp: 'Experience',
    nav_proj: 'Projects (12)',
    nav_term: 'Terminal',
    hero_status: 'ONLINE · OPEN FOR INTERNSHIP & ENGINEERING ROLES',
    hero_greeting: 'Hello World, I am',
    hero_role: 'Full-Stack Software Engineer · Computer Vision & OCR · Embedded IoT',
    hero_desc: 'Computer Engineering undergraduate at Institut Teknologi Sepuluh Nopember (ITS, Latest Semester GPA 3.93/4.00) & Software Engineering Intern at PT PLN Nusantara Power Services and LAB M-IOT. I build deterministic systems across the stack—from 100%-accurate 80×25 DOS clinical vision engines and 82,989-file enterprise certification platforms to multi-agent swarms and ESP32 hardware.',
    kpi_1: 'Shipped Systems (2025–2026)',
    kpi_2: 'MMPI-2 DOS Grid Accuracy (250/250)',
    kpi_3: 'PLN NAS Archive Files Indexed',
    btn_cv: 'View CV (PDF)',
    btn_porto: 'Portfolio Book (PDF)',
    btn_explore: 'Explore 12 Projects',
    about_title: 'About & Engineering Arsenal',
    about_sub: 'How I Build Systems',
    about_p1: 'I am a third-year Computer Engineering student at Institut Teknologi Sepuluh Nopember (ITS), Surabaya (Cumulative GPA: 3.50/4.00 · Latest Semester GPA: 3.93/4.00). Most of what I know comes from taking noisy, manual, or brittle workflows and replacing them with deterministic software.',
    about_p2: 'At PT PLN Nusantara Power Services (Divisi TDC), I architected the Certification & Training Monitoring Platform (1,137 competency codes, Level 1–9 SKP, H-30/H-20 email reminders, 82,989-file Synology NAS index) and Certificate Manager v3.0 (cert-slicer). At LAB M-IOT, I diagnosed why the MMPI-2 clinical scoring pipeline only reached 74% OCR accuracy and replaced it with a 100%-accurate (250/250) 80×25 DOS character-grid bitmap matcher.',
    skills_heading: 'Core Tech Stack & Tooling',
    exp_title: 'Professional & Organizational Experience',
    proj_title: 'Featured Engineering Projects (12)',
    term_title: 'Interactive Command Block Terminal',
    term_sub: 'Type a command below or click a quick-command chip to inspect projects, metrics, and contact links.'
  },
  id: {
    nav_home: 'Beranda',
    nav_about: 'Tentang',
    nav_exp: 'Pengalaman',
    nav_proj: 'Proyek (12)',
    nav_term: 'Terminal',
    hero_status: 'ONLINE · TERBUKA UNTUK MAGANG & REKRUTMEN ENGINEER',
    hero_greeting: 'Halo Dunia, Saya',
    hero_role: 'Full-Stack Software Engineer · Computer Vision & OCR · Embedded IoT',
    hero_desc: 'Mahasiswa Teknik Komputer di Institut Teknologi Sepuluh Nopember (ITS, IPS Semester Terakhir 3.93/4.00) & Software Engineering Intern di PT PLN Nusantara Power Services serta LAB M-IOT. Membangun sistem deterministik dari hulu ke hilir—mulai dari mesin visi DOS 80×25 berakurasi 100% dan platform sertifikasi PLN 82.989 berkas hingga multi-agent swarm dan mikrokontroler ESP32.',
    kpi_1: 'Sistem Terbangun (2025–2026)',
    kpi_2: 'Akurasi Grid DOS MMPI-2 (250/250)',
    kpi_3: 'Arsip NAS PLN Terindeks',
    btn_cv: 'Lihat CV (PDF)',
    btn_porto: 'Buku Portofolio (PDF)',
    btn_explore: 'Jelajahi 12 Proyek',
    about_title: 'Tentang & Arsenal Rekayasa',
    about_sub: 'Cara Saya Membangun Sistem',
    about_p1: 'Saya mahasiswa tahun ketiga Teknik Komputer di Institut Teknologi Sepuluh Nopember (ITS), Surabaya (IPK: 3.50/4.00 · IPS Terakhir: 3.93/4.00). Sebagian besar keahlian saya dibangun dengan mengubah alur kerja manual yang rentan salah menjadi perangkat lunak deterministik.',
    about_p2: 'Di PT PLN Nusantara Power Services (Divisi TDC), saya merancang Platform Monitoring Sertifikasi & Pelatihan (1.137 kode kompetensi, Level 1–9 SKP, pengingat email H-30/H-20, indeks NAS Synology 82.989 file) serta Certificate Manager v3.0 (cert-slicer). Di LAB M-IOT, saya memperbaiki akurasi pembacaan skor klinis MMPI-2 dari 74% (Tesseract OCR) menjadi 100% (250/250 skala) menggunakan pencocok grid karakter DOS 80×25.',
    skills_heading: 'Teknologi & Perangkat Utama',
    exp_title: 'Pengalaman Profesional & Organisasi',
    proj_title: 'Proyek Rekayasa Unggulan (12)',
    term_title: 'Terminal Command Block Interaktif',
    term_sub: 'Ketik perintah di bawah atau klik chip perintah cepat untuk melihat proyek, metrik, dan kontak.'
  }
};

function setLanguage(lang) {
  currentLang = lang;
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
  document.getElementById('lang-id').classList.toggle('active', lang === 'id');
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang] && i18n[lang][key]) {
      el.textContent = i18n[lang][key];
    }
  });
  renderExperience();
  renderCarousel();
  renderProjectsGrid();
  unlockAchievement('Polyglot Switcher', 'Switched portfolio language to ' + lang.toUpperCase());
}

// 3. Experience Data (4 Rich Tabs)
const experiences = [
  {
    company: 'PT PLN Nusantara Power Services',
    role_en: 'Software Engineering & IT Intern — Human Capital & TDC Division',
    role_id: 'Software Engineering & IT Intern — Divisi Human Capital & TDC',
    period: 'Oct 2026 – Present · Surabaya / Sidoarjo',
    stack: ['FastAPI', 'PostgreSQL (Neon)', 'SQLAlchemy 2.0', 'Alembic', 'RapidOCR', 'PyMuPDF', 'OpenPyXL'],
    bullets_en: [
      'Architected and deployed the enterprise Certification & Training Monitoring Platform tracking 1,137 standardized competency codes (Resource Code & Level 1–9 SKP) across power generation units.',
      'Engineered an idempotent two-stage expiration notification service (H-30 & H-20 email reminders with automated CC to TDC Planning), a 4-format header-detecting corporate Excel importer, and monthly Ellipse HR mutation synchronization.',
      'Built Certificate Manager v3.0 (cert-slicer), an offline-first PDF slicer and 3-database O(1) employee matcher paired with an 82,989-file Synology NAS/FTP archive index.'
    ],
    bullets_id: [
      'Merancang dan men-deploy Platform Monitoring Sertifikasi & Pelatihan Pegawai yang memetakan 1.137 kode kompetensi standar (Resource Code & Level 1–9 SKP).',
      'Membangun layanan pengingat email 2-tahap idempoten (H-30 & H-20 dengan CC otomatis ke Tim Perencanaan TDC), importer Excel 4-format otomatis, dan sinkronisasi mutasi SDM Ellipse bulanan.',
      'Mengembangkan Certificate Manager v3.0 (cert-slicer), pemotong PDF offline-first dan pencocok pegawai 3-database O(1) yang terintegrasi dengan indeks katalog Synology NAS/FTP 82.989 berkas.'
    ]
  },
  {
    company: 'LAB M-IOT (ITS)',
    role_en: 'Software Engineering Intern — MMPI-2 Clinical Assessment Platform',
    role_id: 'Software Engineering Intern — Platform Asesmen Klinis MMPI-2',
    period: 'Sep 2026 – Present · Surabaya',
    stack: ['Python', 'OpenCV', '80×25 DOS Bitmap Grid Matcher', 'Win32 API', 'DOSBox', 'PostgreSQL', 'Docker'],
    bullets_en: [
      'Diagnosed and resolved a critical 74.0% (185/250 scales) scoring accuracy bottleneck caused by legacy Tesseract OCR digit confusion (8 vs 0, 6 vs 5) and narrow column slicing that truncated 3-digit clinical T-scores (> 100 and > 120).',
      'Engineered a deterministic 80×25 DOS character-cell bitmap matcher (baca_layar.py) with SetProcessDPIAware() calibration, achieving 100.0% scoring accuracy (250/250 clinical & research scales across 10 synthetic test patterns) with zero external OCR dependency.',
      'Implemented pre-commit 566-item +/- screen verification prior to Esc scoring, PID-bound Win32 window focus locking to prevent unfocused pyautogui keystroke leaks, and host.docker.internal bridge stabilization.'
    ],
    bullets_id: [
      'Mendiagnosis dan menyelesaikan masalah akurasi pembacaan skor klinis 74,0% (185/250 skala) akibat salah baca karakter Tesseract OCR (8 vs 0, 6 vs 5) dan pemotongan kolom sempit pada T-score > 100 dan > 120.',
      'Membangun pencocok bitmap sel karakter DOS 80×25 deterministik (baca_layar.py) dengan kalibrasi SetProcessDPIAware(), mencapai akurasi 100,0% (250/250 skala klinis & riset pada 10 pola uji) tanpa ketergantungan OCR eksternal.',
      'Menambahkan verifikasi layar 566 item +/- sebelum komit Esc, penguncian fokus jendela Win32 berbasis PID agar pyautogui tidak bocor ke aplikasi lain, serta perbaikan jembatan Docker host.docker.internal.'
    ]
  },
  {
    company: 'MAGE XI (Multimedia & Game Event ITS)',
    role_en: 'Expert Staff (Staf Ahli) — Event Division',
    role_id: 'Staf Ahli — Divisi Event',
    period: 'Mar 2025 – Nov 2025 · Surabaya',
    stack: ['National IT Competition', 'Robotics & IoT Tracks', 'Budgeting (RAB)', 'Operations'],
    bullets_en: [
      'Contributed as senior staff to MAGE XI, a national-scale IT competition organized by the Computer Engineering Department at ITS covering Multimedia, Game Dev, Robotics, and IoT categories.',
      'Coordinated project planning, budget allocation (RAB), and technical rundown execution across multiple sub-events while supervising assigned event staff.'
    ],
    bullets_id: [
      'Berkontribusi sebagai Staf Ahli pada MAGE XI, kompetisi TI tingkat nasional yang diselenggarakan oleh Departemen Teknik Komputer ITS (kategori Multimedia, Game, Robotika, dan IoT).',
      'Mengkoordinasikan perencanaan proyek, penyusunan anggaran (RAB), dan eksekusi rundown teknis lintas sub-acara serta membina staf divisi.'
    ]
  },
  {
    company: 'HIMATEKKOM ITS',
    role_en: 'Staff of Student Welfare Division (KESMA)',
    role_id: 'Staf Divisi Kesejahteraan Mahasiswa (KESMA)',
    period: '2025 · Surabaya',
    stack: ['Student Advocacy', 'JAVA Channel', 'Academic Liaison'],
    bullets_en: [
      'Served as student welfare liaison between Computer Engineering students and department faculty for academic, financial, and campus life concerns.',
      'Initiated and managed JAVA (Jaringan Advokasi), a structured online advocacy and feedback channel enabling students to report issues and track follow-ups.'
    ],
    bullets_id: [
      'Berperan sebagai penghubung kesejahteraan mahasiswa antara mahasiswa Teknik Komputer dan pihak departemen terkait urusan akademik maupun finansial.',
      'Menginisiasi dan mengelola JAVA (Jaringan Advokasi), kanal advokasi daring terstruktur bagi mahasiswa untuk menyampaikan aspirasi dan kendala.'
    ]
  }
];

function renderExperience() {
  const listEl = document.getElementById('exp-list');
  const detailEl = document.getElementById('exp-details-content');
  if (!listEl || !detailEl) return;

  listEl.innerHTML = experiences.map((exp, idx) => `
    <button class="exp-tab ${idx === currentExpIndex ? 'active' : ''}" onclick="selectExperience(${idx})">
      <div style="font-weight:700;font-size:1rem;">${exp.company}</div>
      <div style="font-family:var(--font-body);font-size:0.95rem;color:var(--text-muted);">${exp.period.split('·')[0]}</div>
    </button>
  `).join('');

  const active = experiences[currentExpIndex];
  const role = currentLang === 'id' ? active.role_id : active.role_en;
  const bullets = currentLang === 'id' ? active.bullets_id : active.bullets_en;

  detailEl.innerHTML = `
    <h3 class="exp-role" style="font-family:var(--font-heading);font-size:1.35rem;color:var(--mc-gold);margin-bottom:4px;">${role}</h3>
    <div style="font-family:var(--font-heading);font-size:1rem;color:var(--mc-diamond);margin-bottom:4px;">@ ${active.company}</div>
    <div style="font-family:var(--font-body);font-size:1.1rem;color:var(--text-muted);margin-bottom:14px;">${active.period}</div>
    <ul style="list-style:none;padding:0;margin:0 0 18px 0;">
      ${bullets.map(b => `<li style="font-family:var(--font-body);font-size:1.2rem;line-height:1.55;margin-bottom:10px;padding-left:20px;position:relative;"><span style="position:absolute;left:0;color:var(--mc-emerald);">▸</span>${b}</li>`).join('')}
    </ul>
    <div class="skill-tags">
      ${active.stack.map(s => `<span class="skill-tag highlight">${s}</span>`).join('')}
    </div>
  `;
}

function selectExperience(idx) {
  currentExpIndex = idx;
  renderExperience();
}

// 4. All 12 Projects Data
const projectsData = [
  {
    idx: '01',
    category: 'enterprise',
    catLabel: 'Enterprise Web & DB',
    title: 'PLN NPS — Certification & Training Monitoring Platform',
    year: '2026',
    image: 'assets/screenshots/pln_sertifikasi_table.png',
    image2: 'assets/screenshots/pln_dashboard.png',
    github: 'https://github.com/DapppMC/pln-nps-monitoring-web',
    stack: ['Python', 'FastAPI', 'PostgreSQL (Neon)', 'SQLAlchemy 2.0', 'Alembic', 'OpenPyXL', 'Vercel'],
    short_en: 'Enterprise platform for PT PLN Nusantara Power Services (Divisi TDC) tracking 1,137 competency codes (Resource Code & Level 1–9 SKP), H-30/H-20 email alerts, 4-format Excel imports, and an 82,989-file Synology NAS archive index.',
    short_id: 'Platform korporat PT PLN Nusantara Power Services (Divisi TDC) yang memantau 1.137 kode kompetensi (Resource Code & Level 1–9 SKP), pengingat email H-30/H-20, impor Excel 4-format, dan indeks arsip NAS Synology 82.989 berkas.',
    problem: 'Power plant personnel hold mandatory certifications (3/5-year validity) alongside non-expiring training records. Tracking thousands of rows in scattered spreadsheets risked missed renewals, while 82,989 historical PDFs sat unindexed on an internal Synology NAS.',
    built: 'Engineered the Fase 4 schema (Resource Code, Level 1–9 SKP, Peran SKP), idempotent two-stage email alerts (H-30 & H-20 with CC to TDC Planning), a 4-format header-detecting Excel importer, monthly Ellipse HR mutation sync, and the 82,989-file NAS search service.',
    result: '26/26 automated brownfield & integration tests PASS; zero-deadlock PostgreSQL advisory lock migrations; sub-50ms NAS archive lookup.'
  },
  {
    idx: '02',
    category: 'ai',
    catLabel: 'Vision, OCR & Data Engine',
    title: 'Certificate Manager v3.0 (cert-slicer) — PDF Slicer & 3-DB Matcher',
    year: '2026',
    image: 'assets/screenshots/cert_manager_studio.png',
    github: 'https://github.com/DapppMC/certificate-manager',
    stack: ['Python', 'PyMuPDF', 'RapidOCR', 'RapidFuzz', 'OpenPyXL', 'FastAPI', 'CustomTkinter', 'Gemini 2.5'],
    short_en: 'Offline-first multi-page PDF certificate slicer, hybrid 3-stage OCR extractor, and O(1) 3-database employee matcher that exports 4 standardized corporate Excel workbooks simultaneously.',
    short_id: 'Pemotong PDF sertifikat multi-halaman offline-first, ekstraktor OCR 3-tahap, dan pencocok pegawai 3-database O(1) yang mengekspor 4 format Excel korporat sekaligus.',
    problem: 'Staff previously split multi-page PDF certificate bundles by hand, manually looked up NIDs in Ellipse HR master sheets and Resource Codes in a 1,137-row catalog, and re-typed rows into 4 separate Excel formats.',
    built: 'Built the O(1) 3-database hash matcher (Master SDM, Komparasi Kode Baru NPS 0726, MSO765), 3-stage extraction pipeline (PyMuPDF vector -> RapidOCR multi-thread -> selective Gemini 2.5 Flash rescue), SKP Level 1–9 classifier, and Precision Studio v3.0 web/desktop workbench.',
    result: 'Reduced batch processing from hours of manual VLOOKUPs to seconds per bundle while operating 100% offline for standard scans.'
  },
  {
    idx: '03',
    category: 'ai',
    catLabel: 'Clinical Vision & Automation',
    title: 'MMPI-2 — 100% Deterministic 80×25 DOS Grid Vision Engine',
    year: '2026',
    image: 'assets/screenshots/mmpi_dos_grid.png',
    github: '#projects',
    stack: ['Python', 'OpenCV', '80×25 DOS Grid Matcher', 'Win32 API', 'DOSBox', 'PostgreSQL', 'Docker'],
    short_en: 'Upgraded the 566-item MMPI-2 clinical scoring pipeline from 74.0% (185/250) Tesseract OCR accuracy to 100.0% (250/250 scales across 10 test patterns) using a deterministic 80×25 DOS character-grid bitmap matcher.',
    short_id: 'Meningkatkan akurasi pembacaan skor klinis MMPI-2 (566 item) dari 74,0% (185/250) pada Tesseract OCR menjadi 100,0% (250/250 skala pada 10 pola uji) menggunakan pencocok grid karakter DOS 80×25 deterministik.',
    problem: 'Legacy Tesseract OCR misread DOS bitmap digits (8 vs 0, 6 vs 5), narrow crop boxes truncated 3-digit clinical T-scores (>100 and >120), unverified item-566 buffers dropped keystrokes before Esc, and unfocused windows leaked pyautogui typing.',
    built: 'Replaced Tesseract OCR in server/baca_layar.py with a deterministic 80×25 DOS character-cell segmenter, widened T-score extraction for >120 markers, added pre-Esc 566-item +/- screen verification, SetProcessDPIAware() scaling lock, and PID-bound Win32 focus guards.',
    result: 'Achieved 100.0% accuracy (250/250 clinical and research scales matched across K01–K10) with zero external OCR dependency.'
  },
  {
    idx: '04',
    category: 'ai',
    catLabel: 'Multi-Agent Swarm Architecture',
    title: 'Planner System 4.0 — Contract-First Multi-Agent Swarm Engine',
    year: '2026',
    image: 'assets/screenshots/planner4_golden_swarm.png',
    github: 'https://github.com/DapppMC/planner-system',
    stack: ['Python 3.12', 'SQLite WAL Blackboard', 'AST Mutation Gate', 'HMAC-SHA256 Oracles', 'APCA Contrast', 'Pytest'],
    short_en: 'Bicameral multi-agent software factory coordinating 8 parallel worker accounts with HMAC-SHA256 Sealed Oracles, AST Saboteur mutation testing (>=80% kill score), and SQLite WAL atomic ticket leasing.',
    short_id: 'Mesin orkestrasi multi-agen bikameral yang mengkoordinasikan 8 akun worker paralel dengan Sealed Oracle HMAC-SHA256, uji mutasi AST Saboteur (>=80% kill score), dan SQLite WAL blackboard.',
    problem: 'Coding agents that write both implementation and unit tests in one workspace often reward-hack by weakening assertions or writing tautological tests.',
    built: 'Built the 8-worker MASP port-isolation manager (3000–3799 / 8000–8799), HMAC-SHA256 .planner/sealed/ oracle vault, AST Saboteur mutation injector, APCA contrast auditor, and Chameleon quota hot-swap daemon.',
    result: '7/7 Golden Benchmark projects PASS and 158/158 automated unit & integration tests PASS.'
  },
  {
    idx: '05',
    category: 'ai',
    catLabel: 'Stealth Browser & Bot Automation',
    title: 'Hermes JobSeeker Bot — 1-Click Telegram Auto-Apply Engine',
    year: '2026',
    image: 'assets/screenshots/hermes_telegram_ui.png',
    github: 'https://github.com/DapppMC/hermes-jobseeker-bot',
    stack: ['Python', 'Asyncio', 'Stealth Playwright', 'Telegram Bot API', 'IMAP OTP Bridge', 'SQLite WAL', 'Streamlit'],
    short_en: 'Autonomous multi-portal job scraper (LinkedIn, JobStreet, Glints, Kalibrr, Dealls), semantic ATS skill matcher, and 1-click Telegram Auto-Apply bot with live 4-step stepper, IMAP OTP reader, and SHA-256 receipts.',
    short_id: 'Scraper lowongan multi-portal otonom, pencocok ATS semantik, dan bot Auto-Apply Telegram 1-klik dengan stepper progres 4-tahap, pembaca OTP IMAP otomatis, dan bukti SHA-256.',
    problem: 'Applying across 5 job portals requires repetitive form filling, email OTP lookups, and answering custom employer screening questions.',
    built: 'Engineered async portal scrapers with SQLite WAL deduplication, TF-IDF skill scoring, 1-click Telegram Auto-Apply with a zero-hallucination human-in-the-loop screening bridge, and automated IMAP 2FA code extraction.',
    result: '81/81 automated pytest unit and integration tests PASS.'
  },
  {
    idx: '06',
    category: 'enterprise',
    catLabel: 'Retail ERP, RBAC & Express POS',
    title: 'Warung Madura — 24-Hour Retail ERP & Express POS (DevSprint 3.0)',
    year: '2026',
    image: 'assets/screenshots/warung_dashboard.png',
    image2: 'assets/screenshots/warung_pos_receipt.png',
    github: 'https://github.com/DapppMC/DevSprint-Warung-Madura',
    stack: ['Node.js', 'Express.js', 'TypeScript', 'React 18', 'Tailwind CSS', '3-Tier RBAC'],
    short_en: 'Full-stack 24-hour FMCG retail ERP with multi-tier unit conversion (Karung/Dus/Slop/Pak/Pcs), Smart Restock Proposals, keyboard-first Kasir Express POS, 58mm thermal receipts, and wholesale cost RBAC masking.',
    short_id: 'ERP ritel FMCG 24 jam dengan konversi multi-satuan (Karung/Dus/Slop/Pak/Pcs), Rekomendasi Kulakan Cerdas, Kasir Express POS Sat-Set, struk termal 58mm, dan penyembunyian harga modal berbasis RBAC.',
    problem: '24-hour grocery stores buy in wholesale cartons and sell in single sachets across rotating shifts where temporary cashiers should not see wholesale cost prices (harga_beli).',
    built: 'Built the multi-unit conversion ledger, 3-tier RBAC serializer that strips harga_beli from non-owner API payloads, Smart Restock calculator, Purchase Order workflow, and Kasir Express POS with 1-click shift switching.',
    result: 'Passed all functional, concurrency, and RBAC security payload-isolation audits.'
  },
  {
    idx: '07',
    category: 'systems',
    catLabel: 'Network Security & Windows Daemon',
    title: 'Freedom v2.0 (Speed Edition) — USB Encrypted Tunneling Daemon',
    year: '2026',
    image: 'assets/screenshots/freedom_speed_edition.png',
    github: 'https://github.com/DapppMC/freedom-network-optimizer',
    stack: ['PowerShell', 'Windows Service (sc.exe)', 'Sing-box / Xray-Core', 'SMBIOS UUID SHA-256', 'Batch CLI'],
    short_en: '1-click USB-deployable Windows network tunneling provisioner that installs a self-healing SOCKS5/TLS 1.3 daemon locked to the host motherboard UUID via SHA-256.',
    short_id: 'Provisioner tunneling jaringan Windows berbasis USB 1-klik yang menginstal daemon SOCKS5/TLS 1.3 self-healing dengan kunci lisensi perangkat keras SHA-256 Motherboard UUID.',
    problem: 'Deploying encrypted tunnels on restrictive captive networks is tedious to configure manually, and unpacked service folders can be copied across unauthorized machines.',
    built: 'Engineered the PowerShell provisioner with WMI Win32_ComputerSystemProduct.UUID SHA-256 hardware binding, stripped 35 MB GeoIP startup bloat in v2.0 Speed Edition (cutting RAM by 68%), and built Status Check.bat diagnostics.',
    result: '94.8 Mbps downlink throughput with <35ms edge handshake latency and automatic recovery across reboots.'
  },
  {
    idx: '08',
    category: 'systems',
    catLabel: 'Cross-Platform Mobile & ONNX AI',
    title: 'SmartCoop — Poultry Health & Biosecurity Management System',
    year: '2026',
    image: 'assets/screenshots/smartcoop_dashboard.jpg',
    github: 'https://github.com/DapppMC/SMARTCOOP',
    stack: ['Flutter / Dart', 'Supabase (PostgreSQL/RLS)', 'FastAPI', 'ONNX Runtime', 'Docker', 'Railway', 'NFC'],
    short_en: 'Cross-platform Flutter mobile app and 3-model ONNX FastAPI backend that detects poultry diseases early and enforces an 8-phase biosecurity SOP with per-bird NFC medical records.',
    short_id: 'Aplikasi mobile Flutter dan backend FastAPI 3-model ONNX untuk deteksi dini penyakit unggas serta SOP biosekuriti 8-fase dengan rekam medis NFC per ekor.',
    problem: 'By the time poultry disease symptoms are obvious, infection has spread through the coop, and farms lack per-bird treatment and disinfection records.',
    built: 'Designed the 12-table Supabase PostgreSQL schema with Row Level Security (RLS) for multi-farm isolation, built the Flutter realtime service layer, and integrated the 3-model ONNX inference API.',
    result: 'Passed all 9 black-box test scenarios and validated on-site at a working poultry farm.'
  },
  {
    idx: '09',
    category: 'ai',
    catLabel: 'Pure OpenCV Computer Vision',
    title: 'Card Detective — Real-Time OpenCV Card Recognition Game',
    year: '2025',
    image: 'assets/screenshots/bigdata_dashboard.png',
    github: 'https://github.com/DapppMC/Card-Detective-Game',
    stack: ['Python', 'OpenCV', 'NumPy', 'Perspective Homography'],
    short_en: 'Real-time webcam playing-card recognition game written from scratch using pure OpenCV (Canny edges, contour filtering, 4-point homography warp, and pixel template matching) without ML libraries.',
    short_id: 'Game pengenalan kartu remi real-time via webcam menggunakan murni OpenCV (deteksi tepi Canny, kontur, transformasi perspektif 4-titik, dan pencocokan piksel) tanpa pustaka ML.',
    problem: 'Recognizing tilted playing cards in live video without relying on pre-trained neural networks.',
    built: 'Implemented the complete geometric vision pipeline and four-point perspective homography warp plus a NumPy HUD state machine (Menu, Playing, Feedback, Game Over).',
    result: 'Real-time 30+ FPS card recognition across arbitrary card tilt angles.'
  },
  {
    idx: '10',
    category: 'enterprise',
    catLabel: 'Big Data Pipeline & RAG Bot',
    title: 'Big Data Intelligence Analysis Pipeline & RAG Telegram Chatbot',
    year: '2025',
    image: 'assets/screenshots/bigdata_dashboard.png',
    github: 'https://github.com/DapppMC/Project-Epstein-FIle-on-Iran-Automasi-Big-Data-Analisis-Sentiment-Chatbot-AI',
    stack: ['Python', 'n8n', 'Apify', 'Groq API (Llama 3.3 70B)', 'Supabase', 'Chart.js', 'Telegram Bot API'],
    short_en: 'Automated web-crawling and LLM extraction pipeline (sentiment, 216 emotion labels, 1,771 key points across 590 documents) paired with a live Chart.js dashboard and Indonesian RAG Telegram chatbot.',
    short_id: 'Pipeline web-crawling dan ekstraksi LLM otomatis (sentimen, 216 label emosi, 1.771 poin kunci dari 590 dokumen) lengkap dengan dashboard Chart.js dan chatbot RAG Telegram.',
    problem: 'Synthesizing hundreds of lengthy public documents into queryable structured intelligence without manual reading.',
    built: 'Built the rate-limited n8n + Apify + Llama 3.3 70B extraction workflow writing into Supabase, the live Chart.js dashboard, and the grounded Telegram RAG bot.',
    result: 'Processed 590 documents into 1,771 structured key points with zero ungrounded answers.'
  },
  {
    idx: '11',
    category: 'iot',
    catLabel: 'Embedded Robotics & Sensor Fusion',
    title: 'Autonomous Driving Car — 270° Ultrasonic Obstacle Avoidance Robot',
    year: '2025',
    image: 'assets/screenshots/autonomous_car.jpg',
    github: 'https://github.com/DapppMC/Autonomous-Driving-Car',
    stack: ['ESP32', 'C++', '5× HC-SR04 Ultrasonic', 'L298N Dual H-Bridge', 'Differential Steering'],
    short_en: 'Four-wheeled autonomous robot with 270° spatial awareness across five sequentially-fired HC-SR04 ultrasonic sensors and smooth L298N differential-drive lane correction.',
    short_id: 'Robot otonom roda empat dengan kesadaran spasial 270° menggunakan lima sensor ultrasonik HC-SR04 berurutan dan kemudi diferensial L298N.',
    problem: 'Simultaneous ultrasonic pulses cause cross-talk echoes, and soft obstacles absorb single readings.',
    built: 'Assembled the dual-deck ESP32 chassis and wrote a sequential pulse-firing C++ control loop with multi-sample filtering and differential steering.',
    result: 'Navigated complex obstacle courses autonomously without wall collisions or sensor cross-talk.'
  },
  {
    idx: '12',
    category: 'iot',
    catLabel: 'Predictive IoT & Telemetry',
    title: 'SmartPot — Predictive 1-Hour-Ahead IoT Plant Watering System',
    year: '2025',
    image: 'assets/screenshots/smartpot_dashboard.jpg',
    github: 'https://github.com/DapppMC/SmartPot-Self-Watering-Plant',
    stack: ['ESP32', 'C++', 'Capacitive Soil Sensor', 'DHT11', 'LDR', 'Blynk IoT Dashboard'],
    short_en: 'ESP32 automated plant watering system featuring an evaporation-based prediction model that forecasts soil moisture 1 hour ahead and streams telemetry to a 7-channel Blynk dashboard.',
    short_id: 'Sistem penyiraman tanaman otomatis berbasis ESP32 dengan model prediksi penguapan 1 jam ke depan dan telemetri real-time pada dashboard Blynk 7-kanal.',
    problem: 'Reactive watering systems wait until soil is already dry before turning on the pump.',
    built: 'Engineered the ESP32 sensor fusion firmware (soil moisture, temperature, humidity, light), 1-hour evaporation forecast equation, and 7-channel Blynk dashboard.',
    result: 'Maintained optimal soil moisture proactively before plant stress thresholds were reached.'
  }
];

function renderCarousel() {
  const cardEl = document.getElementById('project-carousel-card');
  const indEl = document.getElementById('carousel-indicators');
  if (!cardEl || !indEl) return;

  const p = projectsData[currentProjectIndex];
  const desc = currentLang === 'id' ? p.short_id : p.short_en;
  const ghBtn = p.github.startsWith('http')
    ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding:10px 18px;font-size:0.9rem;">GitHub Repo ↗</a>`
    : `<span class="btn btn-secondary" style="padding:10px 18px;font-size:0.9rem;opacity:0.75;">Private Clinical Repo (NDA)</span>`;

  cardEl.innerHTML = `
    <div style="display:grid;grid-template-columns:1.05fr 1fr;gap:24px;align-items:center;" class="carousel-inner-grid">
      <div>
        <img src="${p.image}" alt="${p.title}" style="width:100%;height:300px;object-fit:cover;object-position:top center;border:2px solid var(--border-color);background:#050811;">
      </div>
      <div style="display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="proj-idx-badge">PROJECT #${p.idx} · ${p.year}</span>
            <span class="proj-cat-badge">${p.catLabel}</span>
          </div>
          <h3 style="font-family:var(--font-heading);font-size:1.55rem;color:#fff;margin-bottom:10px;line-height:1.25;">${p.title}</h3>
          <p style="font-family:var(--font-body);font-size:1.2rem;color:var(--text-muted);line-height:1.5;margin-bottom:16px;">${desc}</p>
          <div class="skill-tags" style="margin-bottom:18px;">
            ${p.stack.map(s => `<span class="skill-tag highlight">${s}</span>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-secondary" style="padding:10px 18px;font-size:0.9rem;" onclick="openCaseModal(${currentProjectIndex})">Read Architecture &amp; Case Study</button>
          ${ghBtn}
        </div>
      </div>
    </div>
  `;

  indEl.innerHTML = projectsData.map((item, idx) => `
    <span class="indicator-dot ${idx === currentProjectIndex ? 'active' : ''}" onclick="goToProject(${idx})" title="${item.title}"></span>
  `).join('');
}

function goToProject(idx) {
  currentProjectIndex = (idx + projectsData.length) % projectsData.length;
  renderCarousel();
}

document.addEventListener('click', (e) => {
  if (e.target.closest('#prev-project')) {
    goToProject(currentProjectIndex - 1);
  } else if (e.target.closest('#next-project')) {
    goToProject(currentProjectIndex + 1);
  }
});

function filterProjects(cat, btnEl) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderProjectsGrid();
}

function renderProjectsGrid() {
  const gridEl = document.getElementById('all-projects-grid');
  if (!gridEl) return;

  const filtered = currentFilter === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === currentFilter);

  gridEl.innerHTML = filtered.map((p) => {
    const origIdx = projectsData.findIndex(x => x.idx === p.idx);
    const desc = currentLang === 'id' ? p.short_id : p.short_en;
    const ghLink = p.github.startsWith('http')
      ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn-pixel-sm primary">GitHub Repo ↗</a>`
      : `<button class="btn-pixel-sm" onclick="openCaseModal(${origIdx})">Clinical Audit</button>`;

    return `
      <article class="proj-grid-card">
        <img src="${p.image}" alt="${p.title}" class="proj-grid-thumb" loading="lazy">
        <div class="proj-grid-body">
          <div class="proj-grid-top">
            <span class="proj-idx-badge">#${p.idx} · ${p.year}</span>
            <span class="proj-cat-badge">${p.catLabel}</span>
          </div>
          <h3 class="proj-grid-title">${p.title}</h3>
          <p class="proj-grid-desc">${desc}</p>
          <div class="skill-tags" style="margin-bottom:8px;">
            ${p.stack.slice(0, 4).map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
          <div class="proj-grid-actions">
            <button class="btn-pixel-sm" onclick="openCaseModal(${origIdx})">Case Study</button>
            ${ghLink}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function openCaseModal(idx) {
  const p = projectsData[idx];
  const modal = document.getElementById('case-modal-backdrop');
  const content = document.getElementById('case-modal-content');
  if (!modal || !content || !p) return;

  const ghBtn = p.github.startsWith('http')
    ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="margin-top:16px;display:inline-block;">Open GitHub Repository (${p.github.replace('https://', '')}) ↗</a>`
    : '';

  content.innerHTML = `
    <button class="case-modal-close" onclick="closeCaseModal()">✕ ESC</button>
    <div class="proj-idx-badge" style="display:inline-block;margin-bottom:8px;">PROJECT #${p.idx} · ${p.year} · ${p.catLabel}</div>
    <h3>${p.title}</h3>
    <div class="case-sub">${p.stack.join(' · ')}</div>
    <img src="${p.image}" alt="${p.title}">
    <div class="case-sec-title">1. The Problem We Started From</div>
    <p class="case-sec-body">${p.problem}</p>
    <div class="case-sec-title">2. The Part I Engineered</div>
    <p class="case-sec-body">${p.built}</p>
    <div class="case-sec-title">3. Verification &amp; How It Held Up</div>
    <p class="case-sec-body">${p.result}</p>
    ${ghBtn}
  `;
  modal.classList.add('open');
  unlockAchievement('System Architect', 'Inspected Case Study #' + p.idx);
}

function closeCaseModal() {
  const modal = document.getElementById('case-modal-backdrop');
  if (modal) modal.classList.remove('open');
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCaseModal();
});

// 5. Interactive CLI Terminal
function setupTerminal() {
  const input = document.getElementById('terminal-input');
  if (!input) return;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      input.value = '';
      executeTerminalCommand(cmd);
    }
  });
}

function runTerminalChip(cmd) {
  executeTerminalCommand(cmd);
}

function executeTerminalCommand(rawCmd) {
  const output = document.getElementById('terminal-output');
  const body = document.getElementById('terminal-body');
  if (!output) return;

  const cmd = rawCmd.toLowerCase().trim();
  if (cmd === 'clear') {
    output.innerHTML = '';
    return;
  }

  let response = '';
  switch (cmd) {
    case 'help':
      response = `Available Commands:
  • projects  — List all 12 engineering projects with GitHub links
  • pln       — Inspect PT PLN Nusantara Power Services internship systems
  • mmpi      — Inspect MMPI-2 100% (250/250) DOS Grid Vision breakthrough
  • planner   — Inspect Planner System 4.0 (8-Worker Bicameral Swarm)
  • hermes    — Inspect Hermes JobSeeker Bot (1-Click Telegram Auto-Apply)
  • freedom   — Inspect Freedom v2.0 Speed Edition (USB Hardware-Locked Daemon)
  • skills    — Display categorized technical stack
  • socials   — Show GitHub, LinkedIn, Email, and Instagram (@dafa_1013)
  • cv        — Open Ahmad Dafa Salam's latest CV & Portfolio PDFs
  • mine      — Mine a block of Redstone & unlock secret achievement
  • clear     — Clear terminal screen`;
      break;
    case 'projects':
      response = projectsData.map(p => `[#${p.idx}] ${p.title} (${p.year}) -> ${p.github}`).join('\n');
      break;
    case 'pln':
      response = `[PT PLN Nusantara Power Services — Divisi TDC]
  1. PLN NPS Training & Certification Monitoring Platform:
     • 1,137 Competency Codes (Resource Code & Level 1–9 SKP)
     • Two-stage idempotent H-30 & H-20 email reminders + CC to TDC Planning
     • 4-format Excel Importer + Monthly Ellipse HR Mutation Sync + 82,989-file Synology NAS Index
     • Repo: https://github.com/DapppMC/pln-nps-monitoring-web
  2. Certificate Manager v3.0 (cert-slicer):
     • 3-Database O(1) Employee Matcher + PyMuPDF/RapidOCR/Gemini 2.5 Flash + 4 Corporate Excel Exports
     • Repo: https://github.com/DapppMC/certificate-manager`;
      break;
    case 'mmpi':
      response = `[LAB M-IOT — MMPI-2 Clinical Psychometry Platform]
  • Legacy Pipeline: 74.0% accuracy (185/250 scales) due to Tesseract OCR digit confusion & >120 truncation.
  • New Engine (baca_layar.py): Deterministic 80×25 DOS Character-Cell Bitmap Matcher + 566-item pre-Esc check + PID Win32 focus lock.
  • Audit Result: 100.0% accuracy (250/250 clinical & research scales across K01–K10).`;
      break;
    case 'planner':
      response = `[Planner System 4.0 — Autonomous Multi-Agent Swarm]
  • 8-Worker MASP Port Isolation (3000–3799 / 8000–8799) + SQLite WAL Blackboard
  • HMAC-SHA256 Sealed Oracles (.planner/sealed/) + AST Saboteur Mutation Gate (>=80% kill rate)
  • Verification: 7/7 Golden Benchmarks PASS | 158/158 Tests PASS
  • Repo: https://github.com/DapppMC/planner-system`;
      break;
    case 'hermes':
      response = `[Hermes JobSeeker Bot — 1-Click Auto-Apply Engine]
  • Multi-portal scraper (LinkedIn, JobStreet, Glints, Kalibrr, Dealls) + TF-IDF ATS Matcher
  • 1-Click Telegram Auto-Apply + Live 4-Step Stepper + IMAP OTP Bridge + SHA-256 Proof
  • Verification: 81/81 pytest suite PASS
  • Repo: https://github.com/DapppMC/hermes-jobseeker-bot`;
      break;
    case 'freedom':
      response = `[Freedom v2.0 Speed Edition — USB Encrypted Tunneling Daemon]
  • 1-Click USB Provisioner + SMBIOS Motherboard UUID SHA-256 Hardware Lock
  • Stripped 35 MB GeoIP bloat -> 68% less RAM, <35ms edge handshake, 94.8 Mbps downlink
  • Repo: https://github.com/DapppMC/freedom-network-optimizer`;
      break;
    case 'skills':
      response = `• Languages : Python, TypeScript, JavaScript, C/C++, Dart, SQL, PowerShell, Bash
• Backend/UI: FastAPI, Node.js, Express, React 18, Flutter, Tailwind CSS
• Vision/AI : OpenCV, RapidOCR, 80×25 DOS Bitmap Matcher, ONNX Runtime, Playwright, Gemini 2.5
• Data/Infra: PostgreSQL (Neon/Supabase RLS), SQLite WAL, SQLAlchemy, Alembic, Docker, Vercel
• Hardware  : ESP32, Arduino, 5× HC-SR04 Ultrasonic Array, NFC, L298N Motor Control`;
      break;
    case 'socials':
    case 'contact':
      response = `• GitHub    : https://github.com/DapppMC
• LinkedIn  : https://www.linkedin.com/in/ahmad-dafa-salam-858b82287/
• Email     : Ahmaddafa1017@gmail.com
• Instagram : https://www.instagram.com/dafa_1013/ (@dafa_1013)
• Phone/WA  : 0822-1400-9950`;
      break;
    case 'cv':
    case 'portfolio':
      response = `Opening CV & Portfolio PDFs...
• CV (2 Pages)        : Ahmad_Dafa_Salam_CV.pdf
• Portfolio (25 Pages): AhmadDafaSalam_Portfolio.pdf`;
      window.open('Ahmad_Dafa_Salam_CV.pdf', '_blank');
      break;
    case 'whoami':
      response = `Ahmad Dafa Salam (DapppMC) — Computer Engineering @ ITS Surabaya (GPA 3.50 / Latest Semester 3.93).`;
      break;
    case 'mine':
      response = `⛏️ [DIAMOND PICKAXE] Mined 1× Command Block & 4× Redstone Dust! All systems operating at 20.0 TPS.`;
      unlockAchievement('Redstone Engineer', 'Ran the secret mine command in the terminal!');
      break;
    default:
      response = `Command not found: '${rawCmd}'. Type 'help' to see available commands.`;
  }

  const block = document.createElement('div');
  block.style.marginBottom = '12px';
  block.innerHTML = `
    <div><span class="prompt">guest@dapppmc:~$</span> <span style="color:#fff;">${rawCmd}</span></div>
    <pre style="font-family:var(--font-body);font-size:1.15rem;color:var(--mc-diamond);white-space:pre-wrap;margin:4px 0 0 0;">${response}</pre>
  `;
  output.appendChild(block);
  if (body) body.scrollTop = body.scrollHeight;
  unlockAchievement('Command Block Hacker', 'Executed "' + cmd + '" in the interactive terminal');
}
