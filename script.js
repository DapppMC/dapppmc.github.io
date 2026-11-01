// ============================================================================
// Ahmad Dafa Salam — Portfolio Engine v4.0 (Terminal & Tungsten / Roaming Arcade Edition)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------------------------------------------
    // 1. OPENING MULTI-GREETING + PIXEL BOOT INTRO ANIMATION
    // ------------------------------------------------------------------------
    const preloader = document.getElementById("intro-preloader");
    const greetingText = document.getElementById("intro-greeting-text");
    const barFill = document.getElementById("intro-bar-fill");
    const skipBtn = document.getElementById("intro-skip");

    const greetings = [
        "HALO",
        "HELLO",
        "こんにちは",
        "BONJOUR",
        "안녕하세요",
        "¡HOLA!",
        "DAFA.OS READY"
    ];

    let greetIdx = 0;
    let introClosed = false;

    function finishIntro() {
        if (introClosed || !preloader) return;
        introClosed = true;
        if (barFill) barFill.style.width = "100%";
        preloader.classList.add("zoom-out");
        setTimeout(() => {
            preloader.style.display = "none";
        }, 750);
    }

    if (preloader && greetingText && barFill) {
        const stepMs = 230;
        const interval = setInterval(() => {
            if (introClosed) {
                clearInterval(interval);
                return;
            }
            greetIdx++;
            const pct = Math.min(100, Math.round((greetIdx / (greetings.length - 1)) * 100));
            barFill.style.width = `${pct}%`;

            if (greetIdx < greetings.length) {
                greetingText.textContent = greetings[greetIdx];
            } else {
                clearInterval(interval);
                setTimeout(finishIntro, 200);
            }
        }, stepMs);

        if (skipBtn) {
            skipBtn.addEventListener("click", finishIntro);
        }
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !introClosed) {
                finishIntro();
            }
        });
    }

    // ------------------------------------------------------------------------
    // 2. WARM HARDWARE PIXEL STARFIELD & CONSTELLATION BACKGROUND CANVAS
    // ------------------------------------------------------------------------
    const canvas = document.getElementById("bg-canvas");
    const mouse = { x: -9999, y: -9999 };
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    if (canvas) {
        const ctx = canvas.getContext("2d");
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        const colors = ["#f59e0b", "#fbbf24", "#ef4444", "#10b981", "#f4f0ea"];
        const particles = Array.from({ length: 42 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() < 0.3 ? 3 : 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));

        window.addEventListener("resize", () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });

        function drawBg() {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.fillStyle = p.color;
                ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);

                const dxm = p.x - mouse.x;
                const dym = p.y - mouse.y;
                const distMouse = Math.sqrt(dxm * dxm + dym * dym);
                if (distMouse < 145) {
                    ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - distMouse / 145) * 0.32})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
            requestAnimationFrame(drawBg);
        }
        drawBg();
    }

    // ------------------------------------------------------------------------
    // 3. ROAMING SEMI-TRANSPARENT PAC-MAN GHOSTS, INVADERS & PIXEL BOTS ENGINE
    // ------------------------------------------------------------------------
    const spriteEls = Array.from(document.querySelectorAll(".roaming-sprite"));
    if (spriteEls.length > 0) {
        const initialZones = [
            { xPct: 0.06, yPct: 0.14, vx: 0.55, vy: 0.28 },
            { xPct: 0.82, yPct: 0.18, vx: -0.48, vy: 0.32 },
            { xPct: 0.12, yPct: 0.58, vx: 0.62, vy: -0.26 },
            { xPct: 0.78, yPct: 0.64, vx: -0.44, vy: -0.30 },
            { xPct: 0.45, yPct: 0.25, vx: 0.50, vy: 0.35 },
            { xPct: 0.32, yPct: 0.80, vx: -0.52, vy: -0.28 }
        ];

        const roamers = spriteEls.map((el, idx) => {
            const z = initialZones[idx % initialZones.length];
            const speedMult = parseFloat(el.getAttribute("data-speed") || "0.5");
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const isMobile = vw <= 768;
            const scale = isMobile ? 0.62 : 1.0;
            return {
                el,
                x: z.xPct * Math.max(240, vw - 160),
                y: z.yPct * Math.max(240, vh - 160),
                vx: z.vx * (0.85 + speedMult * 0.5),
                vy: z.vy * (0.85 + speedMult * 0.5),
                phase: idx * 1.35,
                scale,
                facing: z.vx >= 0 ? 1 : -1,
                boostUntil: 0
            };
        });

        roamers.forEach((r) => {
            r.el.addEventListener("click", (e) => {
                e.stopPropagation();
                r.el.classList.add("scared-mode");
                r.vx = -r.vx * 1.8;
                r.vy = -r.vy * 1.8;
                r.facing = r.vx >= 0 ? 1 : -1;
                r.boostUntil = Date.now() + 1800;

                const pop = document.createElement("div");
                pop.className = "arcade-score-pop";
                pop.textContent = "+200 PTS";
                pop.style.left = `${e.clientX - 24}px`;
                pop.style.top = `${e.clientY - 16}px`;
                document.body.appendChild(pop);
                setTimeout(() => pop.remove(), 900);
                setTimeout(() => {
                    r.el.classList.remove("scared-mode");
                    r.vx = Math.sign(r.vx) * Math.min(Math.abs(r.vx), 0.75);
                    r.vy = Math.sign(r.vy) * Math.min(Math.abs(r.vy), 0.55);
                }, 1800);
            });
        });

        function tickRoamingArcade(now) {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const isMobile = vw <= 768;
            const padX = isMobile ? 90 : 150;
            const padY = isMobile ? 90 : 140;

            for (let i = 0; i < roamers.length; i++) {
                const r = roamers[i];
                r.scale = isMobile ? 0.58 : 1.0;

                // Gentle sine wave drift so movement feels organic & alive
                const waveY = Math.sin(now * 0.0016 + r.phase) * 0.22;
                r.x += r.vx;
                r.y += r.vy + waveY;

                // Bounce softly off viewport edges and turn around
                if (r.x < 12) {
                    r.x = 12;
                    r.vx = Math.abs(r.vx);
                    r.facing = 1;
                } else if (r.x > vw - padX) {
                    r.x = Math.max(12, vw - padX);
                    r.vx = -Math.abs(r.vx);
                    r.facing = -1;
                }

                if (r.y < 54) {
                    r.y = 54;
                    r.vy = Math.abs(r.vy);
                } else if (r.y > vh - padY) {
                    r.y = Math.max(54, vh - padY);
                    r.vy = -Math.abs(r.vy);
                }

                const flipX = r.facing * r.scale;
                const scaleY = r.scale;
                r.el.style.transform = `translate3d(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px, 0) scale(${flipX}, ${scaleY})`;
            }
            requestAnimationFrame(tickRoamingArcade);
        }
        requestAnimationFrame(tickRoamingArcade);
    }

    // ------------------------------------------------------------------------
    // 4. 3D-TILT INTERACTIVE HERO CHARACTER CARD
    // ------------------------------------------------------------------------
    const charCard = document.getElementById("character-card");
    if (charCard) {
        charCard.addEventListener("mousemove", (e) => {
            if (window.innerWidth <= 768) return;
            const rect = charCard.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotX = (-y / (rect.height / 2)) * 6;
            const rotY = (x / (rect.width / 2)) * 6;
            charCard.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
        });
        charCard.addEventListener("mouseleave", () => {
            charCard.style.transform = "";
        });
    }

    // ------------------------------------------------------------------------
    // 5. NAVBAR CLICK HIGHLIGHT + SCROLLSPY + MOBILE HAMBURGER MENU
    // ------------------------------------------------------------------------
    const navLinks = Array.from(document.querySelectorAll(".nav-links a.nav-link"));
    const sections = navLinks
        .map((link) => {
            const id = link.getAttribute("data-section") || link.getAttribute("href").replace("#", "");
            return document.getElementById(id);
        })
        .filter(Boolean);

    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-links");
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

    function closeMobileMenu() {
        if (navMenu) navMenu.classList.remove("active");
        if (hamburger) hamburger.classList.remove("active");
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("data-section") || link.getAttribute("href").replace("#", "");
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                setActiveNavById(targetId);
                clickScrollLockUntil = Date.now() + 800;
                const yOffset = -76;
                const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
                history.replaceState(null, "", `#${targetId}`);
            }
            closeMobileMenu();
        });
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    function updateActiveNavOnScroll() {
        if (Date.now() < clickScrollLockUntil) return;
        const scrollPos = window.scrollY + window.innerHeight * 0.35;
        let currentSectionId = sections[0] ? sections[0].id : "hero";

        for (const sec of sections) {
            if (sec.offsetTop <= scrollPos) {
                currentSectionId = sec.id;
            }
        }
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 60) {
            currentSectionId = sections[sections.length - 1].id;
        }
        setActiveNavById(currentSectionId);
    }

    window.addEventListener("scroll", updateActiveNavOnScroll, { passive: true });
    updateActiveNavOnScroll();

    // ------------------------------------------------------------------------
    // 6. HERO TYPEWRITER SUBTITLE
    // ------------------------------------------------------------------------
    const typewriterEl = document.getElementById("typewriter-text");
    const phrases = [
        "Fourth-year Computer Engineering student at ITS Surabaya specializing in Full-Stack Systems, Computer Vision & OCR, and Embedded IoT.",
        "Software Engineering & IT Intern at PT PLN Nusantara Power Services & LAB M-IOT ITS.",
        "Creator of Hermes JobSeeker Bot v2.5 (6-Pillar Deep-Link Harvester, Honest Salary Provenance & Live Auto-Apply Engine).",
        "Building production enterprise software, edge AI vision pipelines, and hardware-bound network automation."
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
            setTimeout(tickTypewriter, 25);
        } else {
            charIdx--;
            typewriterEl.textContent = currentPhrase.slice(0, charIdx);
            if (charIdx <= 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(tickTypewriter, 320);
                return;
            }
            setTimeout(tickTypewriter, 13);
        }
    }
    setTimeout(() => {
        isDeleting = true;
        tickTypewriter();
    }, 3800);

    // ------------------------------------------------------------------------
    // 7. SKILLS & EXPERIENCES TABS
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
    // 8. AUTO-SLIDING FEATURED PROJECTS CAROUSEL (DESKTOP HOVER + MOBILE TOUCH)
    // ------------------------------------------------------------------------
    const carousel = document.getElementById("projects-carousel");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const filterPills = document.querySelectorAll(".filter-pill");
    const projectCards = document.querySelectorAll(".bento-card.carousel-card");

    let isCarouselPaused = false;
    let isDragging = false;
    let touchPauseUntil = 0;
    let startX = 0;
    let scrollLeft = 0;
    let autoSlideDir = 1;

    if (carousel) {
        carousel.addEventListener("mouseenter", () => {
            isCarouselPaused = true;
        });
        carousel.addEventListener("mouseleave", () => {
            isCarouselPaused = false;
            isDragging = false;
        });

        carousel.addEventListener("touchstart", () => {
            isCarouselPaused = true;
            touchPauseUntil = Date.now() + 4500;
        }, { passive: true });

        carousel.addEventListener("touchend", () => {
            touchPauseUntil = Date.now() + 4500;
            setTimeout(() => {
                if (Date.now() >= touchPauseUntil) {
                    isCarouselPaused = false;
                }
            }, 4600);
        }, { passive: true });

        carousel.addEventListener("mousedown", (e) => {
            isDragging = true;
            isCarouselPaused = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        carousel.addEventListener("mouseup", () => {
            isDragging = false;
        });
        carousel.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.6;
            carousel.scrollLeft = scrollLeft - walk;
        });

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener("click", () => {
                touchPauseUntil = Date.now() + 3500;
                carousel.scrollBy({ left: -380, behavior: "smooth" });
            });
            nextBtn.addEventListener("click", () => {
                touchPauseUntil = Date.now() + 3500;
                carousel.scrollBy({ left: 380, behavior: "smooth" });
            });
        }

        function tickCarousel() {
            if (!isCarouselPaused && !isDragging && Date.now() >= touchPauseUntil) {
                const maxScroll = carousel.scrollWidth - carousel.clientWidth;
                if (maxScroll > 10) {
                    carousel.scrollLeft += 0.95 * autoSlideDir;
                    if (carousel.scrollLeft >= maxScroll - 2) {
                        autoSlideDir = -1;
                    } else if (carousel.scrollLeft <= 2) {
                        autoSlideDir = 1;
                    }
                }
            }
            requestAnimationFrame(tickCarousel);
        }
        requestAnimationFrame(tickCarousel);
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
            if (carousel) carousel.scrollLeft = 0;
        });
    });

    // ------------------------------------------------------------------------
    // 9. CASE STUDY MODAL WITH 100% VERIFIED GITHUB REPOSITORY LINKS
    // ------------------------------------------------------------------------
    const PROJECT_DATA = {
        pln: {
            badge: "PT PLN Nusantara Power Services (Divisi TDC) · Oct 2026 – Present",
            title: "PLN Cert-Mon: Enterprise Certification & Training Monitoring Platform",
            subtitle: "Python · FastAPI · PostgreSQL (Neon) · SQLAlchemy · RapidOCR · PyMuPDF · Synology NAS/FTP",
            images: [
                "assets/screenshots/pln_dashboard.png",
                "assets/screenshots/pln_sertifikasi_table.png",
                "assets/screenshots/pln_importer_ftp.png"
            ],
            arch: "Architected for PT PLN Nusantara Power Services (Divisi TDC) to track 1,137 standardized competency codes (Resource Code & Level 1–9 SKP), separating 3/5-year expiring technical certifications from non-expiring training records across generation units. Includes an idempotent H-30/H-20 email notification engine, a 4-format header-detecting corporate Excel importer, monthly Ellipse HR mutation reconciliation, and an 82,989-file Synology NAS/FTP index.",
            impact: "• 82,989 certificate & training files indexed across Synology NAS/FTP shares.\n• 1,137 standardized Resource Codes & Level 1–9 SKP competencies tracked.\n• Automated H-30 & H-20 expiration email alerts with CC to TDC Planning.",
            github: "https://github.com/DapppMC/pln-nps-monitoring-web"
        },
        mmpi: {
            badge: "LAB M-IOT · Psychological Assessment Platform · Sep 2026 – Present",
            title: "MMPI-2 Automated Psychological Assessment Platform",
            subtitle: "Python · OpenCV · Deterministic 80x25 DOS Grid Vision · Win32 API · PostgreSQL · Docker",
            images: [
                "assets/screenshots/mmpi_dos_grid.png",
                "assets/screenshots/mmpi_web_detail.png"
            ],
            arch: "Resolved a critical 74.0% (185/250 scales) scoring accuracy bottleneck in the 566-item MMPI-2 psychological assessment platform caused by legacy Tesseract OCR glyph confusion (8 vs 0, 6 vs 5) and narrow column slicing. Engineered a deterministic 80x25 DOS character-cell bitmap matcher (baca_layar.py) with SetProcessDPIAware() calibration and PID-bound Win32 window focus locking.",
            impact: "• 100.0% psychological scoring accuracy (250/250 clinical, validity, and research scales across 10 test patterns) with zero external OCR dependency.\n• Pre-scoring 566-item +/- screen buffer verification prior to Esc commit.",
            github: "https://github.com/DapppMC/MMPI_1_Website"
        },
        hermes: {
            badge: "Commercial Career & ATS Automation Engine · Phase 2 Overhaul (v2.5)",
            title: "Hermes JobSeeker Bot v2.5 (6-Pillar Deep-Link Harvester & Auto-Apply Engine)",
            subtitle: "Python · Playwright CDP · Gemini Vision OCR · Dealls/LinkedIn/Kalibrr APIs · myITS Entra ID 2FA Bridge · 3NF SQLite WAL",
            images: [
                "assets/screenshots/hermes_telegram_ui.png"
            ],
            arch: "Commercial-grade career intelligence & auto-apply ecosystem built on 6 core pillars: (1) 100% Honest Salary/Stipend Provenance Engine (zero fabricated numbers, strict API/ad provenance tagging); (2) Strict Deep-Link Policy (is_deep_job_url) & active deadline verification; (3) Multi-Portal Official API & Deep-Link Harvesters across ITS Career Center (careers.its.ac.id + @itscareercenter IG Gemini Vision Flyer OCR), Dealls API, LinkedIn Guest API, Kalibrr API, and Glints; (4) Live Paused-Tab Human Input Bridge (/fill), myITS Entra ID 2-digit Authenticator Number Matching (#idRichContext_DisplaySign), and Top-10 Batch Auto-Apply Queue (/apply_all); (5) In-Portal Status Tracker (portal_status_tracker.py + /portal_status) & Dual IMAP Inbox Monitor.",
            impact: "• 315+ verified deep-link job postings in 3NF SQLite WAL DB (219 High-Match >= 85%).\n• Commercial Managed Service: Public GitHub repository provides architecture documentation & showcase stubs to protect proprietary commercial automation modules.",
            github: "https://github.com/DapppMC/hermes-jobseeker-bot"
        },
        cert: {
            badge: "Enterprise Document Studio · PT PLN NPS Tooling · 2026",
            title: "Certificate Manager v3.0 (cert-slicer)",
            subtitle: "Python Flask · PyMuPDF Vector Parser · Multi-Threaded RapidOCR · Gemini 2.5 Flash · 3 SQLite DBs",
            images: [
                "assets/screenshots/cert_manager_studio.png",
                "assets/screenshots/cert_manager_analytics.png"
            ],
            arch: "Offline-first PDF certificate slicer and 3-database employee matcher (sertifikat, pegawai, diklat) combining PyMuPDF vector text parsing, multi-threaded RapidOCR, and Gemini 2.5 Flash fallback with interactive canvas rotation/cropping and 1-click export to 4 standardized corporate Excel templates.",
            impact: "• Exports 4 official Excel formats (Monitoring, Per-Folder, Master Simpel, Master Lengkap).\n• Directly integrated with the 82,989-file Synology NAS/FTP archive index.",
            github: "https://github.com/DapppMC/certificate-manager"
        },
        smartcoop: {
            badge: "Cross-Platform Mobile & Edge AI · 2026",
            title: "SmartCoop — Poultry Health & Biosecurity Management System",
            subtitle: "Flutter · Supabase (PostgreSQL / RLS) · FastAPI · 3-Model ONNX Runtime · Docker · NFC",
            images: [
                "assets/screenshots/smartcoop_dashboard.jpg",
                "assets/screenshots/smartcoop_disease.jpg"
            ],
            arch: "Cross-platform mobile application (Flutter + Supabase) that detects poultry diseases from droppings or physical condition photos through a three-model ONNX pipeline served by a containerized FastAPI backend. Backed by a 12-table PostgreSQL schema with Row Level Security (RLS) and per-bird medical records linked via unique NFC tags.",
            impact: "• 3-model ONNX inference pipeline for real-time poultry disease classification.\n• 8-phase guided biosecurity SOP with NFC tag scanning and strict multi-farm RLS isolation.",
            github: "https://github.com/DapppMC/SMARTCOOP"
        },
        planner: {
            badge: "Multi-Agent Swarm Orchestrator · 2026",
            title: "Planner System 4.0 — Contract-First 8-Worker Swarm & Verification Engine",
            subtitle: "Python · SQLite WAL Blackboard · AST Mutation Testing · HMAC-SHA256 Sealed Oracles · APCA Kinematics",
            images: [
                "assets/screenshots/planner4_golden_swarm.png"
            ],
            arch: "Deterministic multi-agent software engineering orchestrator coordinating 8 parallel worker accounts with strict port isolation (3000–3799 / 8000–8799), atomic SQLite WAL ticket leasing, and Chameleon quota failover. Enforces Bicameral Zero-Trust verification with HMAC-SHA256 Sealed Oracles and an AST Saboteur mutation testing gate.",
            impact: "• >= 80% AST mutation kill score enforced across 7/7 Golden Benchmarks.\n• Zero multi-agent port or file collisions across 8 parallel worker instances.",
            github: "https://github.com/DapppMC/planner-system"
        },
        warung: {
            badge: "24-Hour FMCG Retail ERP · DevSprint 3.0 Program · 2026",
            title: "Warung Madura Enterprise POS & Multi-Unit Inventory Manager",
            subtitle: "Node.js · Express · TypeScript · React 18 · Tailwind CSS · 3-Tier RBAC",
            images: [
                "assets/screenshots/warung_dashboard.png",
                "assets/screenshots/warung_pos_receipt.png"
            ],
            arch: "Developed as a capstone engineering project during the DevSprint 3.0 intensive software engineering program: a 24-hour FMCG retail ERP and keyboard-first Express POS (Sat-Set) supporting hierarchical packaging conversions (Eceran, Pak, Slop, Dus, Karung), atomic stock deduction, and 58mm thermal receipt printing. Enforces three-tier RBAC (Owner, Warehouse, Cashier) with API-level wholesale cost (harga_beli) masking.",
            impact: "• Sub-second keyboard-first cashier checkout with automatic multi-unit inventory conversion.\n• Complete Purchase Order lifecycle and smart safety-stock reorder proposals.",
            github: "https://github.com/DapppMC/DevSprint-Warung-Madura"
        },
        freedom: {
            badge: "Commercial Network & Encrypted Tunneling Suite · 2026",
            title: "Freedom v2.0 (Speed Edition) — DoH, Acrylic DNS & DPI Fragmentation",
            subtitle: "PowerShell · Windows Service Manager · Acrylic DNS · Green Tunnel · SMBIOS Hardware Crypto",
            images: [
                "assets/screenshots/freedom_speed_edition.png"
            ],
            arch: "Commercial 1-click USB-deployable network provisioning suite installing a self-healing Windows service and local Acrylic DNS proxy (127.0.0.1) paired with Windows 11 native DNS-over-HTTPS and Green Tunnel TLS ClientHello fragmentation, plus Status Check.bat real-time diagnostics.",
            impact: "• Sub-millisecond cached DNS lookups via 127.0.0.1 and 68% lower memory overhead.\n• Commercial Managed Service: Public GitHub repository provides architecture documentation & showcase interfaces to protect proprietary commercial provisioning scripts.",
            github: "https://github.com/DapppMC/freedom-network-optimizer"
        },
        bigdata: {
            badge: "LLM Sentiment Pipeline & RAG Chatbot · 2025",
            title: "Big Data Intelligence Analysis Pipeline & RAG Telegram Chatbot",
            subtitle: "Python · n8n · Apify · Groq API (Llama 3.3 70B) · Supabase PostgreSQL · Chart.js",
            images: [
                "assets/screenshots/bigdata_dashboard.png",
                "assets/screenshots/bigdata_n8n_flow.png"
            ],
            arch: "Automated end-to-end intelligence pipeline (web crawling -> LLM sentiment, emotion, and key-point extraction via Llama 3.3 70B -> Supabase PostgreSQL storage) paired with an interactive Telegram RAG chatbot and real-time Chart.js analytics dashboard.",
            impact: "• Automated multi-source sentiment and emotion classification into structured PostgreSQL tables.\n• Natural-language RAG querying directly from Telegram.",
            github: "https://github.com/DapppMC/Project-Epstein-FIle-on-Iran-Automasi-Big-Data-Analisis-Sentiment-Chatbot-AI"
        },
        autocar: {
            badge: "Embedded Robotics & Sensor Fusion · 2024",
            title: "Autonomous Obstacle-Avoiding Car (ESP32)",
            subtitle: "C / C++ · ESP32 Microcontroller · Ultrasonic HC-SR04 · Infrared Sensors · L298N PWM Motor Driver",
            images: [
                "assets/screenshots/autonomous_car.jpg"
            ],
            arch: "Self-navigating robotic vehicle powered by an ESP32 microcontroller integrating multi-directional ultrasonic and infrared obstacle detection with real-time PWM motor speed and steering control.",
            impact: "• Low-latency collision avoidance and autonomous path recovery in dynamic indoor corridors.\n• Modular C/C++ firmware architecture for rapid sensor calibration.",
            github: "https://github.com/DapppMC/Autonomous-Driving-Car"
        },
        smartpot: {
            badge: "Closed-Loop Embedded IoT · 2024",
            title: "SmartPot: Self-Regulating & Self-Maintaining IoT Plant System",
            subtitle: "C / C++ · ESP32 · Soil Moisture & DHT11 Sensors · Automated Relay Pump · Web Telemetry",
            images: [
                "assets/screenshots/smartpot_dashboard.jpg"
            ],
            arch: "Closed-loop IoT plant maintenance system built on ESP32 that continuously monitors soil moisture, ambient temperature, and humidity, triggering precision relay-controlled irrigation and streaming live telemetry to a web dashboard.",
            impact: "• Fully automated soil moisture regulation preventing over-watering and dehydration.\n• Real-time environmental telemetry dashboard.",
            github: "https://github.com/DapppMC/SmartPot-Self-Regulating-Self-Maintaining-Smart-Pot-System"
        },
        carddetective: {
            badge: "Real-Time Computer Vision · 2024",
            title: "Card Detective: Real-Time OpenCV Card Recognition Game",
            subtitle: "C++ · OpenCV · Contour Detection · Perspective Homography Warp · Template Matching",
            images: [
                "assets/screenshots/mmpi_dos_grid.png"
            ],
            arch: "Real-time computer vision system written in C++ and OpenCV that detects playing cards from a live camera feed, applies 4-point perspective homography transformation, and classifies rank and suit via corner glyph matching.",
            impact: "• Real-time 30+ FPS card contour isolation and perspective rectification under varying tilt angles.\n• Interactive game loop built natively in C++ OpenCV.",
            github: "https://github.com/DapppMC/Card-Detective-OpenCV-Card-Game"
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
            data.images.forEach((imgSrc, idx) => {
                const thumb = document.createElement("img");
                thumb.src = imgSrc;
                thumb.className = idx === 0 ? "modal-thumb active" : "modal-thumb";
                thumb.addEventListener("click", () => {
                    modalImg.src = imgSrc;
                    modalGallery.querySelectorAll(".modal-thumb").forEach((t) => t.classList.remove("active"));
                    thumb.classList.add("active");
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
    // 10. REAL INTERACTIVE CONTACT MESSENGER TERMINAL (NAME -> EMAIL -> MESSAGE)
    // ------------------------------------------------------------------------
    const termInput = document.getElementById("terminal-input");
    const termOutput = document.getElementById("terminal-output");
    const termBody = document.getElementById("terminal-body");
    const termPromptLabel = document.getElementById("terminal-prompt-label");
    const termPills = document.querySelectorAll(".term-pill");

    let msgState = {
        step: 1,
        name: "",
        email: "",
        message: ""
    };

    function appendTermLine(htmlContent) {
        if (!termOutput) return;
        const div = document.createElement("div");
        div.className = "term-line";
        div.innerHTML = htmlContent;
        termOutput.appendChild(div);
        if (termBody) termBody.scrollTop = termBody.scrollHeight;
    }

    function updatePromptUI() {
        if (!termInput || !termPromptLabel) return;
        if (msgState.step === 1) {
            termPromptLabel.textContent = "name@guest:~$";
            termInput.placeholder = "Type your name and press Enter...";
        } else if (msgState.step === 2) {
            termPromptLabel.textContent = "email@guest:~$";
            termInput.placeholder = "Type your email address and press Enter...";
        } else if (msgState.step === 3) {
            termPromptLabel.textContent = "msg@guest:~$";
            termInput.placeholder = "Type your message for Dafa and press Enter...";
        }
    }

    function resetMessenger() {
        msgState = { step: 1, name: "", email: "", message: "" };
        if (termOutput) {
            termOutput.innerHTML = "";
        }
        appendTermLine(`<span style="color:#a39e93;">Initializing secure connection to <strong>Ahmad Dafa Salam (dafa-os.vercel.app)</strong>...</span>`);
        appendTermLine(`<span style="color:#34d399;">[OK] Ready! Send a direct message step-by-step below (or type <span class="term-cmd">/help</span>).</span>`);
        appendTermLine(`<span class="term-prompt">? Step 1/3:</span> <strong>What is your name?</strong>`);
        updatePromptUI();
    }

    function handleSlashCommand(cmd) {
        appendTermLine(`<span class="term-prompt">cmd@guest:~$</span> <span class="term-cmd">${cmd}</span>`);
        if (cmd === "/reset" || cmd === "/clear" || cmd === "clear") {
            resetMessenger();
            return;
        }
        if (cmd === "/help" || cmd === "help") {
            appendTermLine(
                `Commands:\n` +
                `  • Type normally to send a direct message (Name -> Email -> Message)\n` +
                `  • <span class="term-cmd">/reset</span>    — Restart direct message wizard\n` +
                `  • <span class="term-cmd">/projects</span> — List all 12 engineering projects\n` +
                `  • <span class="term-cmd">/hermes</span>   — Open Hermes JobSeeker Bot v2.5 (Phase 2) Case Study\n` +
                `  • <span class="term-cmd">/pln</span>      — Open PT PLN Nusantara Power Services Case Study\n` +
                `  • <span class="term-cmd">/mmpi</span>     — Open LAB M-IOT MMPI-2 Assessment Case Study\n` +
                `  • <span class="term-cmd">/cv</span>       — Open Ahmad Dafa Salam's CV PDF`
            );
            return;
        }
        if (cmd === "/projects" || cmd === "projects") {
            appendTermLine(
                `[01] PLN Cert-Mon (pln-nps-monitoring-web)     | [02] MMPI-2 Assessment (MMPI_1_Website)\n` +
                `[03] Hermes JobSeeker v2.5 (6-Pillar Engine)   | [04] Certificate Manager v3.0 (certificate-manager)\n` +
                `[05] SmartCoop (Flutter + 3-Model ONNX + NFC)  | [06] Planner System 4.0 (planner-system)\n` +
                `[07] Warung Madura ERP (DevSprint 3.0 Program) | [08] Freedom v2.0 Speed Edition\n` +
                `[09] Big Data Llama 3.3 RAG Pipeline           | [10] Autonomous Driving Car (ESP32)\n` +
                `[11] SmartPot Closed-Loop IoT                  | [12] Card Detective (C++ OpenCV)`
            );
            return;
        }
        if (cmd === "/hermes" || cmd === "hermes") {
            openProjectModal("hermes");
            appendTermLine(`<span style="color:#34d399;">Opened Hermes JobSeeker Bot v2.5 (Phase 2) Case Study Modal.</span>`);
            return;
        }
        if (cmd === "/pln" || cmd === "pln") {
            openProjectModal("pln");
            appendTermLine(`<span style="color:#34d399;">Opened PLN Cert-Mon Case Study Modal.</span>`);
            return;
        }
        if (cmd === "/mmpi" || cmd === "mmpi") {
            openProjectModal("mmpi");
            appendTermLine(`<span style="color:#34d399;">Opened MMPI-2 Psychological Assessment Case Study Modal.</span>`);
            return;
        }
        if (cmd === "/cv" || cmd === "cv") {
            window.open("Ahmad_Dafa_Salam_CV.pdf", "_blank");
            appendTermLine(`<span style="color:#34d399;">Opened Ahmad_Dafa_Salam_CV.pdf in a new tab.</span>`);
            return;
        }
        appendTermLine(`<span style="color:#ef4444;">Unknown command '${cmd}'. Type /help or continue entering your message.</span>`);
    }

    function processTerminalInput(rawVal) {
        const val = rawVal.trim();
        if (!val) return;

        if (val.startsWith("/") || ["help", "clear", "projects", "pln", "mmpi", "hermes", "cv"].includes(val.toLowerCase())) {
            handleSlashCommand(val.toLowerCase());
            return;
        }

        if (msgState.step === 1) {
            msgState.name = val;
            appendTermLine(`<span class="term-prompt">name@guest:~$</span> ${val}`);
            appendTermLine(`<span style="color:#34d399;">✓ Nice to meet you, <strong>${val}</strong>!</span>`);
            appendTermLine(`<span class="term-prompt">? Step 2/3:</span> <strong>What is your email address?</strong>`);
            msgState.step = 2;
            updatePromptUI();
        } else if (msgState.step === 2) {
            msgState.email = val;
            appendTermLine(`<span class="term-prompt">email@guest:~$</span> ${val}`);
            appendTermLine(`<span style="color:#34d399;">✓ Email recorded: <strong>${val}</strong></span>`);
            appendTermLine(`<span class="term-prompt">? Step 3/3:</span> <strong>Type your message for Dafa:</strong>`);
            msgState.step = 3;
            updatePromptUI();
        } else if (msgState.step === 3) {
            msgState.message = val;
            appendTermLine(`<span class="term-prompt">msg@guest:~$</span> ${val}`);

            const subject = encodeURIComponent(`[Dafa.OS Portfolio Message] from ${msgState.name}`);
            const body = encodeURIComponent(
                `Hello Ahmad Dafa Salam,\n\nName: ${msgState.name}\nEmail: ${msgState.email}\n\nMessage:\n${msgState.message}`
            );
            const waText = encodeURIComponent(
                `Halo Dafa! Saya *${msgState.name}* (${msgState.email}).\n\n${msgState.message}`
            );

            appendTermLine(
                `<div style="margin-top:8px;padding:12px;background:rgba(245,158,11,0.1);border:1px solid #f59e0b;border-radius:8px;">` +
                `<div style="color:#fbbf24;font-weight:700;margin-bottom:6px;">🚀 [PACKET READY] Message formatted for Ahmad Dafa Salam!</div>` +
                `<div style="font-size:0.84rem;color:#e6e2dd;margin-bottom:10px;">From: <strong>${msgState.name}</strong> &lt;${msgState.email}&gt;<br/>"${msgState.message}"</div>` +
                `<div style="display:flex;gap:10px;flex-wrap:wrap;">` +
                `<a href="mailto:Ahmaddafa1017@gmail.com?subject=${subject}&body=${body}" style="background:#fbbf24;color:#0b0b0a;padding:6px 14px;border-radius:5px;text-decoration:none;font-weight:700;font-size:0.82rem;">📧 Send via Email App</a>` +
                `<a href="https://wa.me/6282214009950?text=${waText}" target="_blank" style="background:#10b981;color:#0b0b0a;padding:6px 14px;border-radius:5px;text-decoration:none;font-weight:700;font-size:0.82rem;">💬 Send via WhatsApp</a>` +
                `</div></div>`
            );

            msgState.step = 1;
            appendTermLine(`<div style="margin-top:8px;color:#a39e93;">Want to send another message? Enter your name below (or click <strong>✉️ New Message</strong>):</div>`);
            updatePromptUI();
        }
    }

    if (termInput) {
        termInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const v = termInput.value;
                termInput.value = "";
                processTerminalInput(v);
            }
        });
    }

    termPills.forEach((pill) => {
        pill.addEventListener("click", () => {
            const cmd = pill.getAttribute("data-cmd");
            handleSlashCommand(cmd);
        });
    });
});
