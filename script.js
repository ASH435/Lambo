/* ================================================
   LAMBORGHINI REVUELTO — SCROLLYTELLING
   GSAP Animations & Interactions
   ================================================ */

(function () {
    'use strict';

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // --- CUSTOM CURSOR ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' });
        });

        // Smooth ring follow
        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover states for interactive elements
        const interactiveEls = document.querySelectorAll('button, a, .glass-panel, .stat-card, .spec-item');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    } else {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
    }

    // --- SPEED-O-METER ---
    const speedFill = document.getElementById('speed-fill');
    const speedValue = document.getElementById('speed-value');

    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            const progress = self.progress;
            const speed = Math.round(progress * 350);
            if (speedFill) speedFill.style.height = (progress * 100) + '%';
            if (speedValue) speedValue.textContent = speed;
        }
    });

    // --- SECTION NAV DOTS ---
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = ['hero', 'aero', 'engine', 'performance'];

    sections.forEach((id, index) => {
        ScrollTrigger.create({
            trigger: '#' + id,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveNav(index),
            onEnterBack: () => setActiveNav(index),
        });
    });

    function setActiveNav(index) {
        navDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Nav dot click-to-scroll
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-section');
            const target = document.getElementById(targetId);
            if (target) {
                gsap.to(window, {
                    scrollTo: { y: target, offsetY: 0 },
                    duration: 1.5,
                    ease: 'power3.inOut'
                });
            }
        });
    });


    // ================================================
    // SECTION 1: HERO ANIMATIONS
    // ================================================

    const heroTl = gsap.timeline({ delay: 0.5 });

    // Letter stagger
    heroTl.to('.title-letter', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.07,
        ease: 'power4.out'
    })
    // Badge
    .from('.hero-badge', {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: 'power4.out'
    }, '-=0.7')
    // Accent line draw
    .to('.hero-accent-line', {
        scaleX: 1,
        duration: 1,
        ease: 'power3.inOut'
    }, '-=0.4')
    // Tagline
    .to('.hero-tagline', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power4.out'
    }, '-=0.5')
    // Scroll cue
    .to('.scroll-cue', {
        opacity: 1,
        duration: 1,
        ease: 'power4.out'
    }, '-=0.3');

    // Ken Burns zoom on hero car
    gsap.to('.hero-car-img', {
        scale: 1.08,
        duration: 12,
        ease: 'none',
        repeat: -1,
        yoyo: true
    });

    // Hero scroll: zoom into car + fade to headlights
    gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '80% top',
            scrub: 2,
            pin: false,
        }
    })
    .to('.hero-car-img', {
        scale: 2.2,
        opacity: 0,
        ease: 'power1.in'
    }, 0)
    .to('#hero-headlight-layer', {
        opacity: 1,
        ease: 'power1.inOut'
    }, 0.15)
    .to('.hero-content', {
        opacity: 0,
        y: -80,
        ease: 'power1.in'
    }, 0)
    .to('.scroll-cue', {
        opacity: 0,
        ease: 'power1.in'
    }, 0);

    // Headlights fade out at end of hero
    gsap.to('#hero-headlight-layer', {
        opacity: 0,
        scrollTrigger: {
            trigger: '#hero',
            start: '70% top',
            end: 'bottom top',
            scrub: 1,
        }
    });

    // Unpin hero layers once past hero section
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        onLeave: () => {
            gsap.set(['.hero-bg-layer', '#hero-headlight-layer', '.hero-content', '.scroll-cue'], {
                position: 'absolute'
            });
        },
        onEnterBack: () => {
            gsap.set(['.hero-bg-layer', '#hero-headlight-layer', '.hero-content', '.scroll-cue'], {
                position: 'fixed'
            });
        }
    });


    // ================================================
    // SECTION 2: AERODYNAMICS ANIMATIONS
    // ================================================

    // Car slides in
    gsap.to('.aero-car-img', {
        x: 0,
        opacity: 1,
        duration: 1.6,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '#aero',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });

    // Text block
    gsap.to('.aero-text-block', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '#aero',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        }
    });

    // Flow lines draw
    const flowLines = document.querySelectorAll('.flow-line');
    flowLines.forEach((line, i) => {
        const length = line.getTotalLength ? line.getTotalLength() : 1500;
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;

        gsap.to(line, {
            strokeDashoffset: 0,
            duration: 2,
            delay: i * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#aero',
                start: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Stat counters
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(el => {
        const target = parseFloat(el.getAttribute('data-target'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0');

        gsap.to(el, {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: decimals === 0 ? { textContent: 1 } : {},
            scrollTrigger: {
                trigger: '#aero',
                start: 'top 40%',
                toggleActions: 'play none none reverse'
            },
            onUpdate: function () {
                if (decimals > 0) {
                    el.textContent = parseFloat(el.textContent).toFixed(decimals);
                }
            }
        });
    });


    // ================================================
    // SECTION 3: ENGINE — EXPLODED VIEW
    // ================================================

    // Text entrance
    gsap.to('#engine-text', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#engine',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        }
    });

    // Engine: crossfade from full to exploded, then back
    const engineTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#engine',
            start: 'top 20%',
            end: 'bottom 60%',
            scrub: 1.5,
            // pin: true is too heavy, use scrub instead
        }
    });

    engineTl
        // Phase 1: full engine fades out, exploded fades in + scales up
        .to('#engine-full-img', {
            opacity: 0,
            scale: 1.1,
            duration: 1,
            ease: 'power2.inOut'
        })
        .to('#engine-exploded-img', {
            opacity: 1,
            scale: 1.05,
            duration: 1,
            ease: 'power2.inOut'
        }, '<')
        // Phase 2: hold
        .to({}, { duration: 0.5 })
        // Phase 3: exploded fades out, full comes back
        .to('#engine-exploded-img', {
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: 'power2.inOut'
        })
        .to('#engine-full-img', {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power2.inOut'
        }, '<');

    // Subtle float on engine visual
    gsap.to('#engine-assembly', {
        y: -15,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
    });


    // ================================================
    // SECTION 4: PERFORMANCE CHARTS
    // ================================================

    // Title
    gsap.to('.perf-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#performance',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        }
    });

    // Chart rows stagger in
    gsap.to('.chart-row', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#perf-charts',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });

    // Animate chart bars
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        const value = parseFloat(bar.getAttribute('data-value'));
        const max = parseFloat(bar.getAttribute('data-max'));
        const widthPercent = (value / max) * 100;
        const valueEl = bar.querySelector('.chart-value');
        const isDecimal = value % 1 !== 0;

        gsap.to(bar, {
            width: widthPercent + '%',
            duration: 2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#perf-charts',
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            }
        });

        // Counter animation
        const counter = { val: 0 };
        gsap.to(counter, {
            val: value,
            duration: 2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#perf-charts',
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            },
            onUpdate: () => {
                if (valueEl) {
                    valueEl.textContent = isDecimal
                        ? counter.val.toFixed(1)
                        : Math.round(counter.val).toLocaleString();
                }
            }
        });
    });

    // Background image parallax
    gsap.to('.perf-bg-img', {
        y: -80,
        ease: 'none',
        scrollTrigger: {
            trigger: '#performance',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        }
    });


    // ================================================
    // CLOSING SEQUENCE
    // ================================================

    // Words reveal
    gsap.to('.closing-word', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#closing',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });

    // Closing accent line
    gsap.to('.closing-line', {
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '#closing',
            start: 'top 55%',
            toggleActions: 'play none none reverse'
        }
    });

    // Closing sub text
    gsap.to('.closing-sub', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#closing',
            start: 'top 50%',
            toggleActions: 'play none none reverse'
        }
    });


    // ================================================
    // PERFORMANCE: CLEANUP & REFRESH
    // ================================================

    // Refresh ScrollTrigger after all images load
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });

})();
