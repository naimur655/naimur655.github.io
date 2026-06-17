/* ============================================================
   script.js – MD. Naimur Rahman Portfolio
   All interactions, animations & effects
   ============================================================ */

'use strict';

/* ── LOADER ── */
(function initLoader() {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 1600);
  });
  document.body.style.overflow = 'hidden';
})();

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a, button, .project-card, .achievement-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform   = 'translate(-50%,-50%) scale(2)';
      follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
      follower.style.borderColor = 'rgba(79,142,255,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform   = 'translate(-50%,-50%) scale(1)';
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.borderColor = 'rgba(79,142,255,0.45)';
    });
  });

  // Hide on mobile
  if ('ontouchstart' in window) {
    cursor.style.display   = 'none';
    follower.style.display = 'none';
  }
})();

/* ── NAVBAR ── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Active nav highlight
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));
})();

/* ── PARTICLES CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const count = Math.min(80, Math.floor((W * H) / 14000));

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.a  = Math.random() * 0.6 + 0.1;
      this.hue = 210 + Math.random() * 60; // blue-purple range
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < count; i++) particles.push(new Particle());

  // Draw connections
  function drawLines() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.strokeStyle = `rgba(79,142,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── TYPED TEXT ── */
(function initTyped() {
  const el     = document.getElementById('typed-text');
  if (!el) return;
  const words  = ['Software Developer', 'Backend Developer', 'AI Enthusiast', 'Problem Solver'];
  let wIdx = 0, cIdx = 0, deleting = false;
  const MIN_DELAY = 80, MAX_DELAY = 140, PAUSE = 1600, DEL_SPEED = 50;

  function tick() {
    const word = words[wIdx];
    el.textContent = deleting ? word.slice(0, cIdx--) : word.slice(0, cIdx++);

    let delay = deleting ? DEL_SPEED : MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);

    if (!deleting && cIdx > word.length) {
      delay = PAUSE;
      deleting = true;
    } else if (deleting && cIdx < 0) {
      deleting = false;
      cIdx = 0;
      wIdx = (wIdx + 1) % words.length;
      delay = 300;
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1000);
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── COUNTER ANIMATION ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const isFloat = String(target).includes('.');
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (isFloat ? value.toFixed(2) : Math.floor(value)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── TILT EFFECT ON PROJECT CARDS ── */
(function initTilt() {
  document.querySelectorAll('.project-card, .achievement-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── GLITCH / SHIMMER on HERO NAME ── */
(function initNameGlow() {
  const nameLines = document.querySelectorAll('.name-line');
  nameLines.forEach(line => {
    line.style.transition = 'text-shadow 0.3s ease';
    line.addEventListener('mouseenter', () => {
      line.style.textShadow = '0 0 40px rgba(79,142,255,0.5)';
    });
    line.addEventListener('mouseleave', () => {
      line.style.textShadow = '';
    });
  });
})();

/* ── SKILL PILL STAGGER ── */
(function initSkillStagger() {
  const categories = document.querySelectorAll('.skill-category');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const pills = entry.target.querySelectorAll('.skill-pill');
      pills.forEach((pill, i) => {
        pill.style.opacity = '0';
        pill.style.transform = 'translateY(10px)';
        setTimeout(() => {
          pill.style.transition = 'all 0.4s cubic-bezier(0.4,0,0.2,1)';
          pill.style.opacity = '1';
          pill.style.transform = 'translateY(0)';
        }, i * 60);
      });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  categories.forEach(c => io.observe(c));
})();

/* ── NAVBAR PROGRESS BAR ── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; z-index: 10001;
    background: linear-gradient(90deg, #4f8eff, #8b5cf6, #f472b6);
    width: 0; transition: width 0.15s ease;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / totalHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── BACK TO TOP ── */
(function initBackToTop() {
  const btn = document.createElement('button');
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>`;
  btn.setAttribute('aria-label', 'Back to top');
  btn.id = 'back-to-top';
  btn.style.cssText = `
    position: fixed; bottom: 28px; right: 28px; z-index: 999;
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, #4f8eff, #8b5cf6);
    color: #fff; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(79,142,255,0.4);
    cursor: pointer; border: none;
    opacity: 0; transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  `;
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity   = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
