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
    // 3. INTERACTIVE ARCADE NPC ENGINE (ABOVE-CARD TRANSLUCENT OVERLAY,
    //    BOX COLLISIONS/PATROLS & BOSS RAID ON DAFA'S AVATAR WITH HP REGEN)
    // ------------------------------------------------------------------------
    const spriteEls = Array.from(document.querySelectorAll(".roaming-sprite"));
    const attackBeamSvg = document.getElementById("npc-attack-beam-svg");
    const charCardEl = document.getElementById("character-card");
    const portraitStageEl = document.getElementById("id-portrait-stage");
    const portraitImgEl = document.getElementById("dafa-portrait-img");
    const avatarFxLayer = document.getElementById("avatar-fx-layer");
    const hpFillEl = document.getElementById("dafa-hp-fill");
    const hpTextEl = document.getElementById("dafa-hp-text");
    const combatStatusEl = document.getElementById("dafa-combat-status");
    const raidTriggerBtn = document.getElementById("trigger-npc-raid");

    let dafaHp = 100;
    let isUnderRaid = false;
    let isRegenerating = false;
    let regenTimer = null;
    let lastAutoRaidTime = Date.now() - 2500;

    function updateHpUI() {
        const clamped = Math.max(15, Math.min(100, Math.round(dafaHp)));
        if (hpFillEl) {
            hpFillEl.style.width = `${clamped}%`;
            hpFillEl.classList.remove("hp-warn", "hp-crit");
            if (clamped <= 40) {
                hpFillEl.classList.add("hp-crit");
            } else if (clamped <= 70) {
                hpFillEl.classList.add("hp-warn");
            }
        }
        if (hpTextEl) {
            hpTextEl.textContent = `${clamped}/100`;
        }
    }

    function spawnAvatarFloatingText(text, kind = "is-dmg") {
        if (!avatarFxLayer) return;
        const pop = document.createElement("div");
        pop.className = `avatar-dmg-pop ${kind}`;
        pop.textContent = text;
        const jitterX = 38 + Math.random() * 24;
        const jitterY = 18 + Math.random() * 20;
        pop.style.left = `${jitterX}%`;
        pop.style.top = `${jitterY}%`;
        avatarFxLayer.appendChild(pop);
        setTimeout(() => pop.remove(), 950);
    }

    function spawnAvatarHeadSparks(color = "#fbbf24") {
        if (!avatarFxLayer) return;
        for (let i = 0; i < 4; i++) {
            const sp = document.createElement("div");
            sp.className = "avatar-flame-spark";
            sp.style.background = i % 2 === 0 ? color : "#ef4444";
            sp.style.left = `${44 + (Math.random() - 0.5) * 18}%`;
            sp.style.top = `${20 + (Math.random() - 0.5) * 16}%`;
            sp.style.setProperty("--tx", `${(Math.random() - 0.5) * 65}px`);
            sp.style.setProperty("--ty", `${-15 - Math.random() * 40}px`);
            avatarFxLayer.appendChild(sp);
            setTimeout(() => sp.remove(), 520);
        }
    }

    function startHpRegenSequence() {
        if (regenTimer) clearInterval(regenTimer);
        isRegenerating = true;
        if (charCardEl) {
            charCardEl.classList.remove("is-under-attack");
            charCardEl.classList.add("is-regenerating");
        }
        if (combatStatusEl) {
            combatStatusEl.textContent = "💚 REGEN +HP";
            combatStatusEl.className = "hp-status-tag status-regen";
        }

        regenTimer = setInterval(() => {
            if (isUnderRaid) {
                clearInterval(regenTimer);
                return;
            }
            if (dafaHp < 100) {
                const healAmt = Math.min(100 - dafaHp, 14);
                dafaHp += healAmt;
                updateHpUI();
                spawnAvatarFloatingText(`+${healAmt} HP 💚`, "is-heal");
                if (portraitImgEl) {
                    portraitImgEl.classList.add("heal-flash");
                    setTimeout(() => portraitImgEl.classList.remove("heal-flash"), 220);
                }
            } else {
                clearInterval(regenTimer);
                regenTimer = null;
                isRegenerating = false;
                if (charCardEl) charCardEl.classList.remove("is-regenerating");
                if (combatStatusEl) {
                    combatStatusEl.textContent = "SHIELD: READY";
                    combatStatusEl.className = "hp-status-tag";
                }
            }
        }, 420);
    }

    if (spriteEls.length > 0) {
        const BONK_QUIPS = [
            "BONK! 💥",
            "OOF! SOLID BOX",
            "GPA 3.93?! 🔥",
            "NICE STACK 👀",
            "404 WALL!",
            "FULL-STACK ⚡",
            "PLN 82K FILES!",
            "100% MMPI!",
            "BOING! 🧱"
        ];
        const PATROL_QUIPS = [
            "PATROLLING 🛡️",
            "SCANNING BOX 🔍",
            "LOOT FOUND ★",
            "GUARDING UI 🤖",
            "INSPECTING..."
        ];
        const PHASE_QUIPS = [
            "👻 PHASING...",
            "~STEALTH MODE~",
            "GHOST PASS 👻",
            "TRANSLUCENT!"
        ];
        const RAID_QUIPS = [
            "🔥 SEMBURAN API!!",
            "⚡ PLASMA BEAM!",
            "👾 RAID DAFA!",
            "🔥 BURN HEAD!!",
            "🚀 LASER ATTACK!"
        ];

        const initialZones = [
            { xPct: 0.08, yPct: 0.18, vx: 1.05, vy: 0.58 },
            { xPct: 0.84, yPct: 0.22, vx: -0.95, vy: 0.64 },
            { xPct: 0.15, yPct: 0.62, vx: 1.12, vy: -0.54 },
            { xPct: 0.76, yPct: 0.68, vx: -0.92, vy: -0.60 },
            { xPct: 0.46, yPct: 0.26, vx: 0.98, vy: 0.66 },
            { xPct: 0.34, yPct: 0.78, vx: -1.04, vy: -0.56 }
        ];

        const roamers = spriteEls.map((el, idx) => {
            const z = initialZones[idx % initialZones.length];
            const speedMult = parseFloat(el.getAttribute("data-speed") || "0.6");
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const isMobile = vw <= 768;
            const scale = isMobile ? 0.74 : 1.0;
            const bubbleEl = el.querySelector(".npc-bubble");
            return {
                el,
                bubbleEl,
                name: el.getAttribute("data-npc-name") || `NPC-${idx + 1}`,
                attackType: el.getAttribute("data-attack") || "fire",
                w: parseFloat(el.style.width) || 74,
                h: parseFloat(el.style.height) || 68,
                x: z.xPct * Math.max(220, vw - 120),
                y: z.yPct * Math.max(220, vh - 120),
                vx: z.vx * (0.85 + speedMult * 0.45),
                vy: z.vy * (0.85 + speedMult * 0.45),
                phase: idx * 1.35,
                scale,
                squishX: 1,
                squishY: 1,
                facing: z.vx >= 0 ? 1 : -1,
                state: "ROAM", // "ROAM" | "PATROL" | "RAID"
                stateUntil: 0,
                patrolBox: null,
                lastBoxInteract: 0,
                bubbleUntil: 0,
                nextDamageTick: 0
            };
        });

        function showNpcBubble(r, text, durationMs = 1500) {
            if (!r.bubbleEl) return;
            r.bubbleEl.textContent = text;
            r.el.classList.add("show-bubble");
            r.bubbleUntil = Date.now() + durationMs;
        }

        // Cache interactive UI boxes on the screen ("tabel-tabel / kotak-kotaknya aku")
        let cachedBoxes = [];
        let lastBoxScan = 0;

        function refreshInteractiveBoxes(now) {
            if (now - lastBoxScan < 220) return;
            lastBoxScan = now;
            const selectors = [
                ".hero-stat-box",
                ".character-id-card",
                ".skill-category",
                ".cert-card-new",
                ".timeline-card",
                ".selector-tabs",
                ".selector-tab.active",
                ".selector-content-area",
                ".bento-card.carousel-card",
                ".terminal-window"
            ];
            const els = document.querySelectorAll(selectors.join(","));
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const list = [];
            for (let i = 0; i < els.length; i++) {
                const el = els[i];
                const rect = el.getBoundingClientRect();
                if (rect.width < 40 || rect.height < 30) continue;
                if (rect.bottom < 40 || rect.top > vh - 20 || rect.right < 10 || rect.left > vw - 10) continue;
                list.push({ el, rect });
            }
            cachedBoxes = list;
        }

        // Trigger a playful NPC Raid ("Semburan") targeting Dafa's Head on the Engineer ID Card!
        function triggerNpcRaidOnDafa(forcedRoamer = null, isManual = false) {
            if (!portraitStageEl) return false;
            if (isUnderRaid && !isManual) return false;
            if (!isManual && (isRegenerating || Date.now() - lastAutoRaidTime < 5500)) return false;

            const stageRect = portraitStageEl.getBoundingClientRect();
            // Ensure Dafa's portrait card is currently visible in the viewport
            if (stageRect.bottom < 80 || stageRect.top > window.innerHeight - 60) return false;

            // Ensure no other NPC remains in RAID state
            roamers.forEach((other) => {
                if (other.state === "RAID") {
                    other.state = "ROAM";
                    other.el.classList.remove("is-attacking");
                }
            });

            const attacker = forcedRoamer || roamers[Math.floor(Math.random() * roamers.length)];
            if (!attacker) return false;

            isUnderRaid = true;
            isRegenerating = false;
            lastAutoRaidTime = Date.now();
            if (regenTimer) {
                clearInterval(regenTimer);
                regenTimer = null;
            }

            attacker.state = "RAID";
            attacker.stateUntil = Date.now() + 2600;
            attacker.nextDamageTick = Date.now() + 350;
            attacker.el.classList.remove("is-overlapping-box", "is-patrolling");
            attacker.el.classList.add("is-attacking");

            // Position the NPC on either the left or right flank of Dafa's head
            const fromLeft = attacker.x < stageRect.left + stageRect.width * 0.5;
            attacker.raidSide = fromLeft ? -1 : 1;
            showNpcBubble(attacker, RAID_QUIPS[Math.floor(Math.random() * RAID_QUIPS.length)], 2500);

            if (charCardEl) {
                charCardEl.classList.remove("is-regenerating");
                charCardEl.classList.add("is-under-attack");
            }
            if (combatStatusEl) {
                combatStatusEl.textContent = `🔥 ${attacker.name} ATTACK!`;
                combatStatusEl.className = "hp-status-tag status-danger";
            }
            return true;
        }

        if (raidTriggerBtn) {
            raidTriggerBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                triggerNpcRaidOnDafa(null, true);
            });
        }
        if (portraitStageEl) {
            portraitStageEl.addEventListener("click", () => {
                triggerNpcRaidOnDafa(null, true);
            });
        }

        roamers.forEach((r) => {
            r.el.addEventListener("click", (e) => {
                e.stopPropagation();
                // If Dafa's portrait is visible and not currently under raid, clicking an NPC commands it to raid or scatter!
                if (!isUnderRaid && portraitStageEl) {
                    const sr = portraitStageEl.getBoundingClientRect();
                    if (sr.top >= 0 && sr.bottom <= window.innerHeight && Math.random() < 0.55) {
                        triggerNpcRaidOnDafa(r);
                        return;
                    }
                }
                r.state = "ROAM";
                r.el.classList.remove("is-attacking", "is-patrolling");
                r.el.classList.add("scared-mode");
                r.vx = (Math.random() < 0.5 ? -1 : 1) * 2.2;
                r.vy = -1.8;
                r.facing = r.vx >= 0 ? 1 : -1;
                showNpcBubble(r, "😱 +200 PTS!", 1400);

                const pop = document.createElement("div");
                pop.className = "arcade-score-pop";
                pop.textContent = "+200 PTS";
                pop.style.left = `${e.clientX - 24}px`;
                pop.style.top = `${e.clientY - 16}px`;
                document.body.appendChild(pop);
                setTimeout(() => pop.remove(), 900);
                setTimeout(() => {
                    r.el.classList.remove("scared-mode");
                    r.vx = Math.sign(r.vx) * 1.05;
                    r.vy = Math.sign(r.vy) * 0.65;
                }, 1500);
            });
        });

        function renderAttackStream(attacker, headX, headY, now) {
            if (!attackBeamSvg) return;
            const mouthX = attacker.x + (attacker.facing >= 0 ? attacker.w * attacker.scale * 0.88 : attacker.w * attacker.scale * 0.12);
            const mouthY = attacker.y + attacker.h * attacker.scale * 0.45;
            const jitter1 = Math.sin(now * 0.045) * 9;
            const jitter2 = Math.cos(now * 0.055) * 9;
            const midX = (mouthX + headX) * 0.5;
            const midY = (mouthY + headY) * 0.5 + jitter1;

            const isPlasma = attacker.attackType === "plasma" || attacker.attackType === "laser";
            const outerColor = isPlasma ? "#fbbf24" : "#ef4444";
            const innerColor = isPlasma ? "#10b981" : "#fbbf24";

            attackBeamSvg.innerHTML = `
                <path d="M ${mouthX.toFixed(1)} ${mouthY.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${(headX + jitter2 * 0.5).toFixed(1)} ${(headY + jitter1 * 0.4).toFixed(1)}"
                      stroke="${outerColor}" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.65" stroke-dasharray="10 6" />
                <path d="M ${mouthX.toFixed(1)} ${mouthY.toFixed(1)} Q ${midX.toFixed(1)} ${(midY - jitter2 * 0.6).toFixed(1)} ${headX.toFixed(1)} ${headY.toFixed(1)}"
                      stroke="${innerColor}" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.95" />
                <circle cx="${headX.toFixed(1)}" cy="${headY.toFixed(1)}" r="${12 + Math.abs(jitter1)}" fill="${outerColor}" opacity="0.75" />
                <circle cx="${headX.toFixed(1)}" cy="${headY.toFixed(1)}" r="7" fill="#f4f0ea" opacity="0.95" />
            `;
        }

        function tickRoamingArcade(now) {
            refreshInteractiveBoxes(now);
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const isMobile = vw <= 768;
            const padX = isMobile ? 75 : 95;
            const padY = isMobile ? 75 : 90;
            const nowMs = Date.now();

            // Periodically trigger an automatic NPC raid on Dafa's avatar every ~7.5s when Hero is in view
            if (!isUnderRaid && nowMs - lastAutoRaidTime > 7200) {
                triggerNpcRaidOnDafa();
            }

            let activeBeamRendered = false;

            for (let i = 0; i < roamers.length; i++) {
                const r = roamers[i];
                r.scale = isMobile ? 0.72 : 1.0;
                const rw = r.w * r.scale;
                const rh = r.h * r.scale;

                if (r.bubbleUntil > 0 && nowMs > r.bubbleUntil) {
                    r.el.classList.remove("show-bubble");
                    r.bubbleUntil = 0;
                }

                // Recover squish back to 1
                r.squishX += (1 - r.squishX) * 0.18;
                r.squishY += (1 - r.squishY) * 0.18;

                // STATE 1: RAIDING DAFA'S AVATAR ("Semburan" Flame/Laser Attack!)
                if (r.state === "RAID" && portraitStageEl) {
                    const stageRect = portraitStageEl.getBoundingClientRect();
                    const headX = stageRect.left + stageRect.width * 0.5;
                    const headY = stageRect.top + stageRect.height * 0.34;

                    // Hover on the flank of Dafa's head and face toward Dafa
                    const targetX = r.raidSide < 0 ? stageRect.left - rw * 0.55 : stageRect.right - rw * 0.45;
                    const targetY = headY - rh * 0.48 + Math.sin(now * 0.008) * 10;

                    r.x += (targetX - r.x) * 0.14;
                    r.y += (targetY - r.y) * 0.14;
                    r.facing = r.x + rw * 0.5 < headX ? 1 : -1;

                    // Draw live semburan flame/laser stream to Dafa's head
                    renderAttackStream(r, headX, headY, now);
                    activeBeamRendered = true;

                    // Inflict periodic HP damage ticks + sparks on Dafa's head
                    if (nowMs >= r.nextDamageTick) {
                        r.nextDamageTick = nowMs + 460;
                        const dmg = 11 + Math.floor(Math.random() * 7);
                        dafaHp = Math.max(22, dafaHp - dmg);
                        updateHpUI();
                        spawnAvatarFloatingText(`-${dmg} HP 🔥`, "is-dmg");
                        spawnAvatarHeadSparks(r.attackType === "fire" ? "#fbbf24" : "#10b981");
                        if (portraitImgEl) {
                            portraitImgEl.classList.add("hit-flash");
                            setTimeout(() => portraitImgEl.classList.remove("hit-flash"), 190);
                        }
                    }

                    // End of raid -> Dafa activates Counter-Shield & starts HP Regen!
                    if (nowMs >= r.stateUntil) {
                        r.state = "ROAM";
                        r.el.classList.remove("is-attacking");
                        r.el.classList.add("scared-mode");
                        r.vx = r.raidSide * 2.1;
                        r.vy = -1.35;
                        r.facing = r.vx >= 0 ? 1 : -1;
                        showNpcBubble(r, "😱 SHIELD ZAP!!", 1400);
                        setTimeout(() => {
                            r.el.classList.remove("scared-mode");
                            r.vx = Math.sign(r.vx) * 1.0;
                            r.vy = 0.6;
                        }, 1400);

                        spawnAvatarFloatingText("🛡️ COUNTER-SHIELD!", "is-shield");
                        isUnderRaid = false;
                        lastAutoRaidTime = nowMs;
                        setTimeout(startHpRegenSequence, 650);
                    }
                }
                // STATE 2: PATROLLING ALONG TOP BORDER OF A UI BOX
                else if (r.state === "PATROL" && r.patrolBox) {
                    const rect = r.patrolBox.el.getBoundingClientRect();
                    if (nowMs >= r.stateUntil || rect.bottom < 40 || rect.top > vh - 40) {
                        r.state = "ROAM";
                        r.el.classList.remove("is-patrolling");
                        r.vy = -0.85;
                    } else {
                        r.y = rect.top - rh + 6;
                        r.x += r.vx * 1.15;
                        if (r.x <= rect.left) {
                            r.x = rect.left;
                            r.vx = Math.abs(r.vx);
                            r.facing = 1;
                        } else if (r.x + rw >= rect.right) {
                            r.x = rect.right - rw;
                            r.vx = -Math.abs(r.vx);
                            r.facing = -1;
                        }
                    }
                }
                // STATE 3: FREE ROAMING + BOX COLLISIONS ("BONK"), PATROLS & TRANSLUCENT PHASING
                else {
                    const waveY = Math.sin(now * 0.0022 + r.phase) * 0.28;
                    r.x += r.vx;
                    r.y += r.vy + waveY;

                    if (r.x < 10) {
                        r.x = 10;
                        r.vx = Math.abs(r.vx);
                        r.facing = 1;
                    } else if (r.x > vw - padX) {
                        r.x = Math.max(10, vw - padX);
                        r.vx = -Math.abs(r.vx);
                        r.facing = -1;
                    }

                    if (r.y < 64) {
                        r.y = 64;
                        r.vy = Math.abs(r.vy);
                    } else if (r.y > vh - padY) {
                        r.y = Math.max(64, vh - padY);
                        r.vy = -Math.abs(r.vy);
                    }

                    // Check overlap with all visible UI boxes ("tabel-tabel / kotak-kotaknya aku")
                    const cx = r.x + rw * 0.5;
                    const cy = r.y + rh * 0.5;
                    let overlappingBox = null;

                    for (let b = 0; b < cachedBoxes.length; b++) {
                        const box = cachedBoxes[b];
                        const br = box.rect;
                        if (cx >= br.left - 8 && cx <= br.right + 8 && cy >= br.top - 8 && cy <= br.bottom + 8) {
                            overlappingBox = box;
                            break;
                        }
                    }

                    if (overlappingBox) {
                        const br = overlappingBox.rect;
                        // If this NPC just entered the box boundary and cooldown elapsed, pick a playful interaction!
                        if (nowMs - r.lastBoxInteract > 2600) {
                            r.lastBoxInteract = nowMs;

                            // Special case: if the box is Dafa's Engineer ID Card, 65% chance to trigger a Boss Raid!
                            if (overlappingBox.el.id === "character-card" && !isUnderRaid && Math.random() < 0.65) {
                                triggerNpcRaidOnDafa(r);
                            } else {
                                const roll = Math.random();
                                // Interaction A (42%): BONK off the box edge & flash the box border!
                                if (roll < 0.42) {
                                    const distLeft = Math.abs(cx - br.left);
                                    const distRight = Math.abs(cx - br.right);
                                    const distTop = Math.abs(cy - br.top);
                                    const distBottom = Math.abs(cy - br.bottom);
                                    const minDist = Math.min(distLeft, distRight, distTop, distBottom);

                                    if (minDist === distLeft || minDist === distRight) {
                                        r.vx = -r.vx;
                                        r.facing = r.vx >= 0 ? 1 : -1;
                                        r.x += r.vx * 6;
                                    } else {
                                        r.vy = -r.vy;
                                        r.y += r.vy * 6;
                                    }
                                    r.squishX = 1.28;
                                    r.squishY = 0.74;
                                    r.el.classList.add("is-bonking");
                                    setTimeout(() => r.el.classList.remove("is-bonking"), 380);

                                    overlappingBox.el.classList.add("npc-bonked-box");
                                    setTimeout(() => overlappingBox.el.classList.remove("npc-bonked-box"), 420);

                                    showNpcBubble(r, BONK_QUIPS[Math.floor(Math.random() * BONK_QUIPS.length)], 1350);
                                }
                                // Interaction B (26%): Land on top edge of the box and PATROL along its border!
                                else if (roll < 0.68 && br.top > 95 && br.width > 140) {
                                    r.state = "PATROL";
                                    r.patrolBox = overlappingBox;
                                    r.stateUntil = nowMs + 2100;
                                    r.el.classList.remove("is-overlapping-box");
                                    r.el.classList.add("is-patrolling");
                                    overlappingBox.el.classList.add("npc-bonked-box");
                                    setTimeout(() => overlappingBox.el.classList.remove("npc-bonked-box"), 360);
                                    showNpcBubble(r, PATROL_QUIPS[Math.floor(Math.random() * PATROL_QUIPS.length)], 1900);
                                }
                                // Interaction C (32%): Phase through the box translucently (opacity drops slightly)!
                                else {
                                    r.el.classList.add("is-overlapping-box");
                                    if (Math.random() < 0.55) {
                                        showNpcBubble(r, PHASE_QUIPS[Math.floor(Math.random() * PHASE_QUIPS.length)], 1300);
                                    }
                                }
                            }
                        } else {
                            // Currently walking over/through the box -> maintain translucent lowered opacity
                            r.el.classList.add("is-overlapping-box");
                        }
                    } else {
                        r.el.classList.remove("is-overlapping-box");
                    }
                }

                r.el.style.setProperty("--npc-flip", r.facing < 0 ? "-1" : "1");
                const flipX = r.facing * r.scale * r.squishX;
                const scaleY = r.scale * r.squishY;
                r.el.style.transform = `translate3d(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px, 0) scale(${flipX.toFixed(3)}, ${scaleY.toFixed(3)})`;
            }

            if (!activeBeamRendered && attackBeamSvg && attackBeamSvg.innerHTML !== "") {
                attackBeamSvg.innerHTML = "";
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
    // 8. SEAMLESS ONE-WAY INFINITE LOOP FEATURED PROJECTS CAROUSEL
    // ------------------------------------------------------------------------
    const carousel = document.getElementById("projects-carousel");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const filterPills = document.querySelectorAll(".filter-pill");
    const originalProjectTemplates = Array.from(document.querySelectorAll(".bento-card.carousel-card")).map((c) =>
        c.cloneNode(true)
    );

    let isCarouselPaused = false;
    let isDragging = false;
    let touchPauseUntil = 0;
    let startX = 0;
    let dragStartScroll = 0;
    let autoSlideDir = 1; // +1 continuous rightward flow, -1 continuous leftward flow (never bounces!)
    let virtualScroll = 0;
    let singleSetWidth = 0;
    let setCountPerLoop = originalProjectTemplates.length;
    let manualGlideRemaining = 0;

    function measureSingleSetWidth() {
        if (!carousel || setCountPerLoop <= 0) return;
        const cards = carousel.querySelectorAll(".bento-card.carousel-card");
        if (cards.length >= setCountPerLoop * 2) {
            const firstSet0 = cards[0];
            const firstSet1 = cards[setCountPerLoop];
            singleSetWidth = firstSet1.offsetLeft - firstSet0.offsetLeft;
        }
    }

    function wrapInfiniteScroll() {
        if (!carousel || singleSetWidth <= 0) return;
        if (virtualScroll >= singleSetWidth * 2) {
            virtualScroll -= singleSetWidth;
            carousel.scrollLeft = virtualScroll;
        } else if (virtualScroll <= singleSetWidth * 0.25) {
            virtualScroll += singleSetWidth;
            carousel.scrollLeft = virtualScroll;
        }
    }

    function rebuildInfiniteCarousel(filter = "all") {
        if (!carousel) return;
        const matching = originalProjectTemplates.filter((card) => {
            const cats = card.getAttribute("data-category") || "";
            return filter === "all" || cats.includes(filter);
        });
        setCountPerLoop = matching.length;
        carousel.innerHTML = "";
        if (setCountPerLoop === 0) return;

        // Build 3 contiguous sets ([Set 0] [Set 1] [Set 2]) for a seamless infinite loop in either direction
        for (let copyIdx = 0; copyIdx < 3; copyIdx++) {
            matching.forEach((tpl) => {
                const clone = tpl.cloneNode(true);
                if (copyIdx !== 1) {
                    clone.setAttribute("data-clone-set", String(copyIdx));
                }
                carousel.appendChild(clone);
            });
        }

        requestAnimationFrame(() => {
            measureSingleSetWidth();
            if (singleSetWidth > 0) {
                virtualScroll = singleSetWidth;
                carousel.scrollLeft = virtualScroll;
            }
        });
    }

    if (carousel) {
        rebuildInfiniteCarousel("all");
        window.addEventListener("resize", () => {
            measureSingleSetWidth();
        });

        carousel.addEventListener("mouseenter", () => {
            isCarouselPaused = true;
        });
        carousel.addEventListener("mouseleave", () => {
            isCarouselPaused = false;
            isDragging = false;
        });

        carousel.addEventListener("touchstart", () => {
            isCarouselPaused = true;
            touchPauseUntil = Date.now() + 3500;
            virtualScroll = carousel.scrollLeft;
        }, { passive: true });

        carousel.addEventListener("touchmove", () => {
            virtualScroll = carousel.scrollLeft;
            wrapInfiniteScroll();
        }, { passive: true });

        carousel.addEventListener("touchend", () => {
            virtualScroll = carousel.scrollLeft;
            wrapInfiniteScroll();
            touchPauseUntil = Date.now() + 3200;
            setTimeout(() => {
                if (Date.now() >= touchPauseUntil) {
                    isCarouselPaused = false;
                }
            }, 3300);
        }, { passive: true });

        carousel.addEventListener("mousedown", (e) => {
            isDragging = true;
            isCarouselPaused = true;
            startX = e.pageX - carousel.offsetLeft;
            dragStartScroll = virtualScroll;
        });
        carousel.addEventListener("mouseup", () => {
            isDragging = false;
        });
        carousel.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.5;
            virtualScroll = dragStartScroll - walk;
            carousel.scrollLeft = virtualScroll;
            wrapInfiniteScroll();
        });

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener("click", () => {
                autoSlideDir = -1; // Switch continuous loop direction to leftward
                const firstCard = carousel.querySelector(".bento-card.carousel-card");
                const stride = firstCard ? firstCard.offsetWidth + 24 : 420;
                manualGlideRemaining -= stride;
                touchPauseUntil = 0;
            });
            nextBtn.addEventListener("click", () => {
                autoSlideDir = 1; // Switch continuous loop direction to rightward
                const firstCard = carousel.querySelector(".bento-card.carousel-card");
                const stride = firstCard ? firstCard.offsetWidth + 24 : 420;
                manualGlideRemaining += stride;
                touchPauseUntil = 0;
            });
        }

        function tickCarousel() {
            if (singleSetWidth <= 0) {
                measureSingleSetWidth();
            }
            if (Math.abs(manualGlideRemaining) > 0.8) {
                const step = manualGlideRemaining * 0.16;
                virtualScroll += step;
                manualGlideRemaining -= step;
                carousel.scrollLeft = virtualScroll;
                wrapInfiniteScroll();
            } else if (!isCarouselPaused && !isDragging && Date.now() >= touchPauseUntil && singleSetWidth > 0) {
                virtualScroll += 1.05 * autoSlideDir;
                carousel.scrollLeft = virtualScroll;
                wrapInfiniteScroll();
            }
            requestAnimationFrame(tickCarousel);
        }
        requestAnimationFrame(tickCarousel);
    }

    filterPills.forEach((pill) => {
        pill.addEventListener("click", () => {
            const filter = pill.getAttribute("data-filter") || "all";
            filterPills.forEach((p) => p.classList.remove("active"));
            pill.classList.add("active");
            rebuildInfiniteCarousel(filter);
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

    // Delegated click handler so both original and cloned infinite-loop carousel cards open the Case Study Modal
    document.addEventListener("click", (e) => {
        if (e.target.closest("a[href]")) return;
        const projEl = e.target.closest("[data-project]");
        if (projEl) {
            const key = projEl.getAttribute("data-project");
            openProjectModal(key);
        }
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
