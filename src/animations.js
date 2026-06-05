/* =====================================================
   North Aesthetic — Enhanced Animations & Interactions
   ===================================================== */

(function () {
  'use strict';

  /* ── 1. PAGE TRANSITION OVERLAY ── */
  function initPageTransition() {
    // Inject overlay element
    const overlay = document.createElement('div');
    overlay.id = 'page-transition';
    overlay.innerHTML = `<div class="pt-bar"></div>`;
    document.body.appendChild(overlay);

    // Reveal on load
    requestAnimationFrame(() => {
      overlay.classList.add('exit');
      setTimeout(() => overlay.remove(), 900);
    });

    // Intercept internal links
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
      e.preventDefault();
      const fresh = document.createElement('div');
      fresh.id = 'page-transition';
      fresh.innerHTML = `<div class="pt-bar"></div>`;
      fresh.classList.add('enter');
      document.body.appendChild(fresh);
      requestAnimationFrame(() => fresh.classList.add('active'));
      setTimeout(() => { window.location.href = href; }, 600);
    });
  }

  /* ── 2. CUSTOM CURSOR GLOW ── */
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices
    const cursor = document.createElement('div');
    cursor.id = 'cursor-glow';
    document.body.appendChild(cursor);

    let mx = -200, my = -200;
    let cx = -200, cy = -200;
    let raf;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function tick() {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(tick);
    }
    tick();

    // Scale on hoverable elements
    document.addEventListener('mouseover', e => {
      if (e.target.matches('a, button, .product-card, .distributor-cta, .view-details, .star, .dot, .prev, .next')) {
        cursor.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.matches('a, button, .product-card, .distributor-cta, .view-details, .star, .dot, .prev, .next')) {
        cursor.classList.remove('hover');
      }
    });
  }

  /* ── 3. SCROLL-REVEAL (enhanced) ── */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      'section, .product-card, .distributor-card, .feedback-form, .feedback-hero-content, .form-group'
    );
    if (!targets.length) return;

    targets.forEach((el, i) => {
      el.classList.add('sr-hidden');
      el.style.setProperty('--sr-delay', `${(i % 6) * 0.08}s`);
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sr-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => io.observe(el));
  }

  /* ── 4. MAGNETIC BUTTONS ── */
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const btns = document.querySelectorAll('.btn-primary, .submit-btn, .distributor-cta, .view-details');
    btns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── 5. FLOATING PARTICLES (hero / header areas) ── */
  function initParticles() {
    const hero = document.querySelector('.hero-slideshow, .feedback-hero, #distributor');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.35;';
    hero.style.position = hero.style.position || 'relative';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function resize() {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); });

    const COUNT = Math.min(60, Math.floor(W / 20));
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.15,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 105, ${p.alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── 6. PARALLAX HERO IMAGES ── */
  function initParallax() {
    const slides = document.querySelectorAll('.slide img');
    if (!slides.length) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      slides.forEach(img => {
        img.style.transform = `translateY(${y * 0.3}px) scale(1.08)`;
      });
    }, { passive: true });
  }

  /* ── 7. RIPPLE EFFECT ON BUTTONS ── */
  function initRipple() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('button, .btn-primary, .distributor-cta, .view-details');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      const size = Math.max(r.width, r.height) * 2;
      ripple.style.cssText = `
        width:${size}px;height:${size}px;
        left:${e.clientX - r.left - size / 2}px;
        top:${e.clientY - r.top - size / 2}px;
      `;
      btn.style.position = btn.style.position || 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  /* ── 8. TILT EFFECT ON PRODUCT CARDS ── */
  function initTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
        card.style.transition = 'transform 80ms linear';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
      });
    });
  }

  /* ── 9. TYPEWRITER HERO HEADLINE ── */
  function initTypewriter() {
    const el = document.querySelector('.slide.active .slide-content h1, #hero-headline');
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    el.style.visibility = 'visible';
    let i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(type, 45);
      }
    }
    setTimeout(type, 600);
  }

  /* ── 10. SMOOTH COUNTER ANIMATION ── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let start = 0;
        const duration = 1800;
        const step = timestamp => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          el.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  }

  /* ── 11. INJECT ALL CSS ── */
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Page transition */
      #page-transition {
        position: fixed; inset: 0; z-index: 99999;
        background: #0a0a0a; pointer-events: none;
        transform: scaleX(1); transform-origin: left;
        transition: transform 0.6s cubic-bezier(0.77,0,0.18,1);
      }
      #page-transition.exit { transform: scaleX(0); transform-origin: right; }
      #page-transition.enter { transform: scaleX(0); transform-origin: right; }
      #page-transition.enter.active { transform: scaleX(1); transform-origin: left; }
      .pt-bar {
        position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, #d4af69, #f5e4b0, #d4af69);
        background-size: 200% 100%;
        animation: ptShimmer 1s linear infinite;
      }
      @keyframes ptShimmer { to { background-position: 200% 0; } }

      /* Custom cursor */
      #cursor-glow {
        position: fixed; width: 24px; height: 24px;
        border-radius: 50%; pointer-events: none; z-index: 99998;
        background: radial-gradient(circle, rgba(212,175,105,0.55) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition: width 0.25s ease, height 0.25s ease, background 0.25s ease;
        mix-blend-mode: screen;
      }
      #cursor-glow.hover {
        width: 56px; height: 56px;
        background: radial-gradient(circle, rgba(212,175,105,0.35) 0%, transparent 70%);
      }

      /* Scroll reveal */
      .sr-hidden { opacity: 0; transform: translateY(36px); transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1) var(--sr-delay, 0s), transform 0.75s cubic-bezier(0.22,1,0.36,1) var(--sr-delay, 0s); }
      .sr-visible { opacity: 1 !important; transform: none !important; }

      /* Ripple */
      .ripple-effect {
        position: absolute; border-radius: 50%;
        background: rgba(255,255,255,0.25);
        transform: scale(0); animation: rippleAnim 0.55s ease-out forwards;
        pointer-events: none;
      }
      @keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }

      /* Product card entrance */
      .product-card {
        will-change: transform;
        transition: transform 0.5s ease, box-shadow 0.5s ease !important;
      }
      .product-card.sr-visible .product-image {
        animation: imgReveal 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
      }
      @keyframes imgReveal {
        from { clip-path: inset(100% 0 0 0); }
        to   { clip-path: inset(0% 0 0 0); }
      }

      /* Nav link underline animation */
      .nav-links a {
        position: relative;
        transition: color 0.3s ease !important;
      }
      .nav-links a::after {
        content: ''; position: absolute; bottom: -3px; left: 0;
        width: 0; height: 1px;
        background: currentColor;
        transition: width 0.35s cubic-bezier(0.22,1,0.36,1);
      }
      .nav-links a:hover::after,
      .nav-links a.active::after { width: 100%; }

      /* Button shimmer on hover */
      .btn-primary, .submit-btn, .distributor-cta {
        position: relative; overflow: hidden;
      }
      .btn-primary::before, .submit-btn::before, .distributor-cta::before {
        content: ''; position: absolute;
        top: 0; left: -100%; width: 60%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
        transform: skewX(-20deg);
        transition: left 0.6s ease;
        pointer-events: none;
      }
      .btn-primary:hover::before, .submit-btn:hover::before, .distributor-cta:hover::before {
        left: 160%;
      }

      /* View-details button pulse ring */
      .view-details {
        position: relative;
      }
      .view-details::after {
        content: ''; position: absolute; inset: -3px;
        border-radius: inherit; border: 1.5px solid currentColor;
        opacity: 0; transform: scale(0.92);
        transition: opacity 0.3s ease, transform 0.3s ease;
        pointer-events: none;
      }
      .view-details:hover::after { opacity: 0.4; transform: scale(1.05); }

      /* Logo entrance */
      .logo { animation: logoSlide 0.7s cubic-bezier(0.22,1,0.36,1) both; }
      @keyframes logoSlide { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: none; } }

      /* Nav links stagger */
      .nav-links li { animation: navFade 0.5s ease both; }
      .nav-links li:nth-child(1) { animation-delay: 0.1s; }
      .nav-links li:nth-child(2) { animation-delay: 0.18s; }
      .nav-links li:nth-child(3) { animation-delay: 0.26s; }
      .nav-links li:nth-child(4) { animation-delay: 0.34s; }
      @keyframes navFade { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }

      /* Feedback form fields focus ring animation */
      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        animation: focusPulse 0.35s ease forwards;
      }
      @keyframes focusPulse {
        0%   { box-shadow: 0 0 0 0 rgba(212,175,105,0.5); }
        100% { box-shadow: 0 0 0 5px rgba(212,175,105,0.15); }
      }

      /* Star rating pop */
      .star { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1) !important; }
      .star.active, .star:hover { transform: scale(1.3) !important; }

      /* Success message slide-in */
      .success-message.show {
        animation: successSlide 0.5s cubic-bezier(0.22,1,0.36,1) both !important;
      }
      @keyframes successSlide {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to   { opacity: 1; transform: none; }
      }

      /* Footer links hover */
      footer a {
        position: relative;
        transition: opacity 0.25s ease, color 0.25s ease;
      }
      footer a:hover { opacity: 0.75; }

      /* Slideshow slide transition */
      .slide { transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1) !important; }

      /* Modal entrance */
      #productModal.show .modal-content {
        animation: modalIn 0.4s cubic-bezier(0.22,1,0.36,1) both !important;
      }
      @keyframes modalIn {
        from { opacity: 0; transform: translateY(24px) scale(0.97); }
        to   { opacity: 1; transform: none; }
      }

      /* Distributor card hover lift */
      .distributor-card {
        transition: transform 0.45s ease, box-shadow 0.45s ease !important;
      }
      .distributor-card:hover {
        transform: translateY(-6px) !important;
        box-shadow: 0 24px 60px rgba(0,0,0,0.18) !important;
      }

      /* Scroll progress bar */
      #scroll-progress {
        position: fixed; top: 0; left: 0; height: 2px; z-index: 9999;
        background: linear-gradient(90deg, #d4af69, #f5e4b0);
        width: 0%; transition: width 0.1s linear;
        pointer-events: none;
      }

      /* Hero dot pulse */
      .dot.active {
        animation: dotPulse 1.8s ease-in-out infinite !important;
      }
      @keyframes dotPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,105,0.5); }
        50% { box-shadow: 0 0 0 5px rgba(212,175,105,0); }
      }

      /* Coming soon badge shimmer */
      .coming-soon {
        background-size: 200% 100% !important;
        animation: badgeShimmer 2.5s linear infinite !important;
      }
      @keyframes badgeShimmer {
        0% { background-position: 200% center; }
        100% { background-position: -200% center; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── 12. SCROLL PROGRESS BAR ── */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / total * 100) + '%';
    }, { passive: true });
  }

  /* ── INIT ALL ── */
  function init() {
    injectStyles();
    initPageTransition();
    initCursorGlow();
    initScrollReveal();
    initMagneticButtons();
    initParticles();
    initParallax();
    initRipple();
    initTilt();
    initCounters();
    initScrollProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();