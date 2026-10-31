// ============================================================================
// Ahmad Dafa Salam — Portfolio Interactive Engine (Theo Monochrome Edition)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------------------------------------------
    // 1. NAVBAR CLICK HIGHLIGHT + SCROLLSPY (Active Highlight on Click & Scroll)
    // ------------------------------------------------------------------------
    const navLinks = Array.from(document.querySelectorAll(".nav-links a.nav-link"));
    const sections = navLinks
        .map((link) => {
            const id = link.getAttribute("data-section") || link.getAttribute("href").replace("#", "");
            return document.getElementById(id);
        })
        .filter(Boolean);

    const hamburger = document.getElementById("hamburger");
    const navMenu = document.querySelector(".nav-links");
    let clickScrollLockUntil = 0;

    function setActiveNavById(sectionId) {
        navLinks.forEach((link) => {
            const target = link.getAttribute("data-section") || link.getAttribute("href").replace("#", "");
            if (target === sectionId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    // Immediate highlight on click
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("data-section") || link.getAttribute("href").replace("#", "");
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                setActiveNavById(targetId);
                clickScrollLockUntil = Date.now() + 800;
                const yOffset = -80;
                const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
                history.replaceState(null, "", `#${targetId}`);
            }
            if (navMenu && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
            }
        });
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    // Dynamic highlight on scroll (ScrollSpy)
    function updateActiveNavOnScroll() {
        if (Date.now() < clickScrollLockUntil) return;

        const scrollPos = window.scrollY + window.innerHeight * 0.35;
        let currentSectionId = sections[0] ? sections[0].id : "hero";

        for (const sec of sections) {
            if (sec.offsetTop <= scrollPos) {
                currentSectionId = sec.id;
            }
        }

        // If scrolled all the way to bottom, highlight last section (contact)
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 60) {
            currentSectionId = sections[sections.length - 1].id;
        }

        setActiveNavById(currentSectionId);
    }

    window.addEventListener("scroll", updateActiveNavOnScroll, { passive: true });
    updateActiveNavOnScroll();

    // ------------------------------------------------------------------------
    // 2. HERO TYPEWRITER SUBTITLE
    // ------------------------------------------------------------------------
    const typewriterEl = document.getElementById("typewriter-text");
    const phrases = [
        "Fourth-year Computer Engineering student experienced in Full-Stack Systems, Computer Vision & OCR, and Embedded IoT.",
        "Architect of PT PLN Nusantara Power Services' 82,989-File Certificate Monitoring & OCR System.",
        "Lead Developer of RSJ Menur's MMPI-2 Clinical Diagnostic Engine with 100% Psychogram Accuracy.",
        "Building high-reliability web platforms, automated document pipelines, and edge IoT telemetry."
    ];
    let phraseIdx = 0;
    let charIdx = phrases[0].length;
    let isDeleting = false;

    function tickTypewriter() {
        if (!typewriterEl) return;
        const currentPhrase = phrases[phraseIdx];

        if (!isDeleting) {
            charIdx++;
            typewriterEl.textContent = currentPhrase.slice(0, charIdx);
            if (charIdx >= currentPhrase.length) {
                isDeleting = true;
                setTimeout(tickTypewriter, 3200);
                return;
            }
            setTimeout(tickTypewriter, 28);
        } else {
            charIdx--;
            typewriterEl.textContent = currentPhrase.slice(0, charIdx);
            if (charIdx <= 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(tickTypewriter, 350);
                return;
            }
            setTimeout(tickTypewriter, 14);
        }
    }
    setTimeout(() => {
        isDeleting = true;
        tickTypewriter();
    }, 3600);

    // ------------------------------------------------------------------------
    // 3. SKILLS & CERTIFICATIONS TABS
    // ------------------------------------------------------------------------
    const skillTabBtns = document.querySelectorAll(".skills-tab-btn");
    const skillTabContents = document.querySelectorAll(".skills-tab-content");

    skillTabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
            skillTabBtns.forEach((b) => b.classList.remove("active"));
            skillTabContents.forEach((c) => c.classList.remove("active"));
            btn.classList.add("active");
            const content = document.getElementById(target);
            if (content) content.classList.add("active");
        });
    });

    // ------------------------------------------------------------------------
    // 4. EXPERIENCES INTERACTIVE SPLIT SELECTOR
    // ------------------------------------------------------------------------
    const expTabs = document.querySelectorAll(".selector-tab");
    const expPanels = document.querySelectorAll(".selector-panel");

    expTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const targetId = tab.getAttribute("data-tab");
            expTabs.forEach((t) => t.classList.remove("active"));
            expPanels.forEach((p) => p.classList.remove("active"));
            tab.classList.add("active");
            const panel = document.getElementById(targetId);
            if (panel) panel.classList.add("active");
        });
    });

    // ------------------------------------------------------------------------
    // 5. FEATURED PROJECTS CAROUSEL (DRAG + ARROWS + FILTER PILLS)
    // ------------------------------------------------------------------------
    const carousel = document.getElementById("projects-carousel");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const filterPills = document.querySelectorAll(".filter-pill");
    const projectCards = document.querySelectorAll(".bento-card.carousel-card");

    if (prevBtn && nextBtn && carousel) {
        prevBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: -490, behavior: "smooth" });
        });
        nextBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: 490, behavior: "smooth" });
        });

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        carousel.addEventListener("mousedown", (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        carousel.addEventListener("mouseleave", () => {
            isDown = false;
        });
        carousel.addEventListener("mouseup", () => {
            isDown = false;
        });
        carousel.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.6;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }

    filterPills.forEach((pill) => {
        pill.addEventListener("click", () => {
            const filter = pill.getAttribute("data-filter");
            filterPills.forEach((p) => p.classList.remove("active"));
            pill.classList.add("active");

            projectCards.forEach((card) => {
                const cats = card.getAttribute("data-category") || "";
                if (filter === "all" || cats.includes(filter)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // ------------------------------------------------------------------------
    // 6. PROJECT CASE STUDY MODAL & SCREENSHOT GALLERY
    // ------------------------------------------------------------------------
    const PROJECT_DATA = {
        pln: {
            badge: "PT PLN Nusantara Power Services · 2025–2026",
            title: "PLN Cert-Mon: Enterprise Training & Certification Intelligence",
            subtitle: "Next.js 16 · React 19 · TypeScript · PostgreSQL · Prisma · Synology NAS/FTP · Hybrid OCR",
            images: [
                "assets/screenshots/pln_dashboard.png",
                "assets/screenshots/pln_matrix.png"
            ],
            arch: "Engineered for PT PLN Nusantara Power Services (Divisi TDC) to centralize and audit 82,989 raw PDF & image files across Synology NAS shares. Combines a hybrid Tesseract + RapidOCR document classifier (automatically sorting files into Sertifikat vs Pendukung folders) with monthly Ellipse HR mutation reconciliation and Level 1–9 SKP competency matrix tracking.",
            impact: "• 82,989 legacy and active training files indexed across 62 PLN service units.\n• 2,761 active personnel monitored with automated 90/60/30-day expiration alerts.\n• Reduced manual HR document verification time by 88%.",
            github: "https://github.com/DapppMC/pln-cert-mon"
        },
        mmpi: {
            badge: "RSJ Menur Surabaya × ITS Medical AI · 2025–2026",
            title: "MMPI-2 Clinical Diagnostic & DOSBox Bridge Engine",
            subtitle: "Python · OpenCV OMR · Web Patient Portal · Headless DOSBox 0.74-3 Bridge · ReportLab",
            images: [
                "assets/screenshots/mmpi_dos_grid.png",
                "assets/screenshots/mmpi_web_detail.png"
            ],
            arch: "Bridges modern clinical web workflows + OpenCV 4-corner perspective bubble-sheet (LJK) scanning with RSJ Menur's gold-standard 16-bit DOS scoring binary (MMPI.EXE). Injects 566 binary (+/-) responses into a headless DOSBox session and parses raw clinical psychogram tables directly into structured web charts.",
            impact: "• 100.0% clinical scoring accuracy (zero T-score deviation across all 3 validity scales, 10 clinical scales, and 13 research scales).\n• Cut end-to-end patient scoring time from ~25 minutes of manual entry to < 15 seconds.",
            github: "https://github.com/DapppMC/mmpi2-clinical-automation"
        },
        cert: {
            badge: "Enterprise Document Studio · 2025–2026",
            title: "Certificate Manager v3.0 (cert-slicer)",
            subtitle: "Python Flask · PDF.js Canvas Studio · OpenCV · RapidOCR · 3 SQLite DBs · OpenPyXL",
            images: [
                "assets/screenshots/cert_manager_studio.png",
                "assets/screenshots/cert_manager_analytics.png"
            ],
            arch: "Full-featured web application for slicing multi-page scanned PDF bundles into individual certificates, performing interactive canvas rotation/cropping, extracting participant name, NIP, competency title, and validity dates via multi-engine OCR, and persisting across 3 isolated SQLite databases (sertifikat, pegawai, diklat).",
            impact: "• Generates 4 standardized corporate Excel report formats (Monitoring, Per-Folder, Master Simpel, Master Lengkap) in 1 click.\n• Eliminated manual PDF splitting and Excel re-typing across thousands of scan pages.",
            github: "https://github.com/DapppMC/certificate-manager-v3"
        },
        hermes: {
            badge: "Autonomous Career Intelligence · 2025–2026",
            title: "Hermes JobSeeker Bot (Streamlit + Telegram Daemon)",
            subtitle: "Python · Streamlit Control Center · Telegram Bot API · Playwright/Camoufox · SQLite WAL",
            images: [
                "assets/screenshots/hermes_telegram_ui.png"
            ],
            arch: "Multi-portal job discovery and scoring daemon that scrapes LinkedIn, JobStreet, Glints, Kalibrr, Dealls, and KitaLulus using anti-detect browser sessions, deduplicates listings in a SQLite WAL database, computes a 0–100 weighted fit score against Dafa's CV profile, and dispatches instant alerts + tailored cover letters to Telegram and a live Streamlit Control Center.",
            impact: "• 210+ verified tech internship & fresh-graduate roles indexed across 26+ enterprise conglomerates.\n• Real-time Telegram commands (/scan, /top, /stats) paired with an interactive Plotly analytics dashboard.",
            github: "https://github.com/DapppMC/hermes-jobseeker-bot"
        },
        freedom: {
            badge: "Windows Network Stack · 2025–2026",
            title: "Freedom v2.0 — Speed Edition (DoH + Acrylic + DPI Bypass)",
            subtitle: "Windows Batch (Freedom.bat & Status Check.bat) · PowerShell · Acrylic DNS · Green Tunnel",
            images: [
                "assets/screenshots/freedom_speed_edition.png"
            ],
            arch: "Zero-configuration Windows 10/11 network optimization suite that chains a local Acrylic DNS proxy (127.0.0.1:53) with Windows 11 native DNS-over-HTTPS (Cloudflare 1.1.1.1 / Google 8.8.8.8), Green Tunnel TLS ClientHello fragmentation, and TCP/IP Nagle deactivation.",
            impact: "• Sub-millisecond (< 1ms) cached DNS resolution via localhost.\n• Includes 'Status Check.bat' real-time diagnostic console verifying service health, adapter bindings, ping latency, and DPI bypass status.",
            github: "https://github.com/DapppMC/freedom-network-optimizer"
        },
        planner: {
            badge: "Multi-Agent Orchestration · 2026",
            title: "Planner System 4.0 — Contract-First 8-Worker Swarm Engine",
            subtitle: "Python · SQLite WAL Blackboard · HMAC-SHA256 Sealed Oracles · AST Mutation Gates",
            images: [
                "assets/screenshots/planner_dag.png"
            ],
            arch: "Deterministic G0–G4 software specification and multi-agent execution engine that decomposes complex software requirements into wave-partitioned ticket DAGs, enforces strict allowed_paths file isolation, and validates worker output against HMAC-sealed test oracles.",
            impact: "• Prevents multi-agent file collisions and infinite retry loops across 8 concurrent AI worker profiles.\n• Automated AST complexity and mutation verification gates.",
            github: "https://github.com/DapppMC/planner-system-4"
        },
        smartcoop: {
            badge: "Embedded IoT & Edge ML · 2025",
            title: "SmartCoop IoT Telemetry & Poultry ML API",
            subtitle: "ESP32 Firmware (C++) · Python FastAPI · Scikit-Learn Random Forest · Docker · Flutter",
            images: [
                "assets/screenshots/smartcoop_architecture.png"
            ],
            arch: "End-to-end smart agriculture monitoring system integrating ESP32 environmental sensor nodes (ammonia NH3, temperature, humidity) with a containerized FastAPI machine learning inference server and mobile alert dashboard.",
            impact: "• Achieved 94.6% macro F1-score on poultry house environmental risk classification.\n• Sub-second anomaly alerts from edge microcontroller to cloud API.",
            github: "https://github.com/DapppMC/smartcoop-ml-iot"
        }
    };

    const modal = document.getElementById("project-modal");
    const modalClose = document.getElementById("modal-close");
    const modalBadge = document.getElementById("modal-badge");
    const modalTitle = document.getElementById("modal-title");
    const modalSubtitle = document.getElementById("modal-subtitle");
    const modalImg = document.getElementById("modal-img");
    const modalGallery = document.getElementById("modal-gallery");
    const modalArch = document.getElementById("modal-arch");
    const modalImpact = document.getElementById("modal-impact");
    const modalGithub = document.getElementById("modal-github");

    function openProjectModal(projKey) {
        const data = PROJECT_DATA[projKey];
        if (!data || !modal) return;
        modalBadge.textContent = data.badge;
        modalTitle.textContent = data.title;
        modalSubtitle.textContent = data.subtitle;
        modalImg.src = data.images[0];
        modalArch.textContent = data.arch;
        modalImpact.innerHTML = data.impact.replace(/\n/g, "<br>");
        modalGithub.href = data.github;

        modalGallery.innerHTML = "";
        if (data.images.length > 1) {
            data.images.forEach((imgSrc) => {
                const thumb = document.createElement("img");
                thumb.src = imgSrc;
                thumb.style.cssText = "height:64px;border-radius:6px;border:1px solid rgba(255,255,255,0.25);cursor:pointer;object-fit:cover;";
                thumb.addEventListener("click", () => {
                    modalImg.src = imgSrc;
                });
                modalGallery.appendChild(thumb);
            });
        }

        modal.classList.add("open");
    }

    document.querySelectorAll("[data-project]").forEach((el) => {
        el.addEventListener("click", () => {
            const key = el.getAttribute("data-project");
            openProjectModal(key);
        });
    });

    if (modalClose && modal) {
        modalClose.addEventListener("click", () => modal.classList.remove("open"));
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("open");
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") modal.classList.remove("open");
        });
    }

    // ------------------------------------------------------------------------
    // 7. MONOCHROME INTERACTIVE TERMINAL (guest@dapppmc:~)
    // ------------------------------------------------------------------------
    const termInput = document.getElementById("terminal-input");
    const termOutput = document.getElementById("terminal-output");
    const termBody = document.getElementById("terminal-body");
    const termPills = document.querySelectorAll(".term-pill");

    const COMMANDS = {
        help: () =>
            `Available commands:\n` +
            `  whoami    — Academic profile & GPA (4th-Year ITS Computer Engineering)\n` +
            `  projects  — List all 7 production engineering projects\n` +
            `  pln       — Inspect PT PLN Nusantara Power Services (82,989 files)\n` +
            `  mmpi      — Inspect RSJ Menur MMPI-2 Clinical Diagnostic Engine\n` +
            `  cert      — Inspect Certificate Manager v3.0 (cert-slicer)\n` +
            `  hermes    — Inspect Hermes JobSeeker Bot (Streamlit + Telegram)\n` +
            `  freedom   — Inspect Freedom v2.0 Speed Edition (CMD/PowerShell)\n` +
            `  cv        — Open Ahmad Dafa Salam's CV PDF in a new tab\n` +
            `  contact   — Display direct email, WhatsApp, and GitHub links\n` +
            `  clear     — Clear terminal history`,
        whoami: () =>
            `Ahmad Dafa Salam (@DapppMC)\n` +
            `• Role      : Fourth-Year Computer Engineering Student (Semester 7) @ ITS Surabaya\n` +
            `• Academic  : Cumulative GPA 3.50/4.00 | Latest Semester GPA 3.93/4.00 (144 SKS)\n` +
            `• Focus     : Full-Stack Web Systems, Computer Vision & OCR, Embedded IoT`,
        projects: () =>
            `Featured Production Projects:\n` +
            `  [1] PLN Cert-Mon (82,989 files indexed, Synology NAS + OCR)\n` +
            `  [2] MMPI-2 Clinical Diagnostic Engine (100% accuracy vs DOSBox @ RSJ Menur)\n` +
            `  [3] Certificate Manager v3.0 (3 SQLite DBs + 4 Excel report formats)\n` +
            `  [4] Hermes JobSeeker Bot (Live Streamlit Dashboard + Telegram Bot)\n` +
            `  [5] Freedom v2.0 Speed Edition (0.8ms Acrylic DNS + DoH + Green Tunnel)\n` +
            `  [6] Planner System 4.0 (8-Worker Contract-First Swarm Engine)\n` +
            `  [7] SmartCoop IoT & ML Telemetry (ESP32 + FastAPI 94.6% F1)`,
        pln: () => {
            openProjectModal("pln");
            return `Opening PLN Cert-Mon Case Study Modal (82,989 files indexed)...`;
        },
        mmpi: () => {
            openProjectModal("mmpi");
            return `Opening RSJ Menur MMPI-2 Clinical Diagnostic Engine Case Study...`;
        },
        cert: () => {
            openProjectModal("cert");
            return `Opening Certificate Manager v3.0 (cert-slicer) Case Study...`;
        },
        hermes: () => {
            openProjectModal("hermes");
            return `Opening Hermes JobSeeker Bot (Streamlit + Telegram) Case Study...`;
        },
        freedom: () => {
            openProjectModal("freedom");
            return `Opening Freedom v2.0 Speed Edition Case Study...`;
        },
        cv: () => {
            window.open("Ahmad_Dafa_Salam_CV.pdf", "_blank");
            return `Opened Ahmad_Dafa_Salam_CV.pdf in a new tab.`;
        },
        contact: () =>
            `Direct Contact Channels:\n` +
            `  • Email     : Ahmaddafa1017@gmail.com\n` +
            `  • WhatsApp  : +62 822-1400-9950\n` +
            `  • Instagram : @dafa_1013\n` +
            `  • GitHub    : https://github.com/DapppMC`
    };

    function runTerminalCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        if (cmd === "clear") {
            termOutput.innerHTML = "";
            return;
        }

        const promptLine = document.createElement("div");
        promptLine.className = "term-line";
        promptLine.innerHTML = `<span class="term-prompt">guest@dapppmc:~$</span> <span class="term-cmd">${rawCmd}</span>`;
        termOutput.appendChild(promptLine);

        const responseLine = document.createElement("div");
        responseLine.className = "term-line";
        responseLine.style.whiteSpace = "pre-wrap";
        responseLine.style.color = "#d4d4d8";

        if (COMMANDS[cmd]) {
            responseLine.textContent = COMMANDS[cmd]();
        } else {
            responseLine.textContent = `Command not found: '${cmd}'. Type 'help' for available commands.`;
        }

        termOutput.appendChild(responseLine);
        termBody.scrollTop = termBody.scrollHeight;
    }

    if (termInput) {
        termInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const val = termInput.value;
                termInput.value = "";
                runTerminalCommand(val);
            }
        });
    }

    termPills.forEach((pill) => {
        pill.addEventListener("click", () => {
            const cmd = pill.getAttribute("data-cmd");
            runTerminalCommand(cmd);
        });
    });
});
