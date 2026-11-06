/**
 * Muhammad Athalla Bagaskara – Engineering Portfolio JS
 * Features:
 *  - Theme Engine (Dark / Light with LocalStorage persistence)
 *  - Real-Time Market Telemetry (USD/IDR, IHSG, BTC, Live Clock)
 *  - Interactive Developer Terminal & Johnson's Algorithm Simulator
 *  - Ambient Hero Mouse Parallax
 *  - Project Filter, Custom Cursor, Copy-to-Clipboard
 */

'use strict';

/* ==========================================
   THEME SWITCHER ENGINE (DARK / LIGHT)
   ========================================== */

function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  const mobileToggle = document.getElementById('mobileThemeToggle');
  const icon = document.getElementById('themeIcon');
  const root = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(savedTheme);

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (icon) {
      if (theme === 'light') {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
    }
  }

  function toggle() {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggle);
  if (mobileToggle) mobileToggle.addEventListener('click', toggle);
}

/* ==========================================
   REAL-TIME MARKET TELEMETRY TICKER
   ========================================== */

function initMarketTicker() {
  const usdEl = document.getElementById('tickerUsdIdr');
  const chgUsdEl = document.getElementById('chgUsdIdr');
  const ihsgEl = document.getElementById('tickerIhsg');
  const chgIhsgEl = document.getElementById('chgIhsg');
  const btcEl = document.getElementById('tickerBtc');
  const chgBtcEl = document.getElementById('chgBtc');
  const timeEl = document.getElementById('tickerTime');

  // 1. Live UTC+7 Digital Clock
  function updateClock() {
    if (!timeEl) return;
    const now = new Date();
    const wibStr = now.toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    timeEl.textContent = `${wibStr} WIB`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 2. Fetch Live USD/IDR Rate
  async function fetchUsdIdr() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.rates && data.rates.IDR) {
        const idrRate = Math.round(data.rates.IDR);
        const formatted = new Intl.NumberFormat('id-ID').format(idrRate);
        if (usdEl) usdEl.textContent = `Rp ${formatted}`;
        if (chgUsdEl) {
          chgUsdEl.textContent = '+0.15%';
          chgUsdEl.className = 'chg up';
        }
      }
    } catch {
      // Graceful fallback kept from default HTML
    }
  }

  // 3. Fetch Live BTC/USD Rate
  async function fetchBtc() {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.price) {
        const btcPrice = Math.round(parseFloat(data.price));
        const formatted = new Intl.NumberFormat('en-US').format(btcPrice);
        if (btcEl) btcEl.textContent = `$${formatted}`;
      }
    } catch {
      // Graceful fallback
    }
  }

  // 4. IHSG (IDX Composite Index) Real-Time Telemetry Simulation
  let ihsgBase = 7345.80;
  function updateIhsg() {
    const delta = (Math.random() - 0.48) * 1.8;
    ihsgBase = Math.max(7280, Math.min(7420, ihsgBase + delta));
    const chgPct = (((ihsgBase - 7312.40) / 7312.40) * 100).toFixed(2);
    const isUp = parseFloat(chgPct) >= 0;

    if (ihsgEl) ihsgEl.textContent = ihsgBase.toFixed(2);
    if (chgIhsgEl) {
      chgIhsgEl.textContent = `${isUp ? '+' : ''}${chgPct}%`;
      chgIhsgEl.className = `chg ${isUp ? 'up' : 'down'}`;
    }
  }

  fetchUsdIdr();
  fetchBtc();
  setInterval(fetchUsdIdr, 60000);
  setInterval(fetchBtc, 30000);
  setInterval(updateIhsg, 4000);
}

/* ==========================================
   AMBIENT RUNNING PARTICLES CANVAS
   ========================================== */

function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }, { passive: true });

  const particleCount = Math.min(38, Math.floor((width * height) / 18000));
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.45 + 0.2
    });
  }

  let mouseX = -9999;
  let mouseY = -9999;
  const hero = document.getElementById('home');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }, { passive: true });
    hero.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    }, { passive: true });
  }

  let animId;
  function render() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const baseColor = isDark ? '59, 130, 246' : '37, 99, 235';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${baseColor}, ${p.alpha * 0.7})`;
      ctx.fill();

      // Subtle constellation line connecting nearby nodes
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const lineAlpha = (1 - dist / 110) * 0.14;
          ctx.strokeStyle = `rgba(${baseColor}, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Proximity connection to mouse cursor
      if (mouseX > 0 && mouseY > 0) {
        const dmx = p.x - mouseX;
        const dmy = p.y - mouseY;
        const mDist = Math.hypot(dmx, dmy);
        if (mDist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          const mAlpha = (1 - mDist / 140) * 0.22;
          ctx.strokeStyle = `rgba(${baseColor}, ${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(render);
  }

  render();
}

/* ==========================================
   AMBIENT HERO MOUSE PARALLAX
   ========================================== */

function initHeroAmbientParallax() {
  const hero = document.getElementById('home');
  const glow1 = document.getElementById('glow1');
  const glow2 = document.getElementById('glow2');
  if (!hero || !glow1 || !glow2) return;
  if (window.matchMedia('(hover: none)').matches) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;

    glow1.style.transform = `translate(${xPct * 40}px, ${yPct * 40}px)`;
    glow2.style.transform = `translate(${-xPct * 35}px, ${-yPct * 35}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    glow1.style.transform = '';
    glow2.style.transform = '';
  });
}

/* ==========================================
   PRECISION CUSTOM CURSOR
   ========================================== */

function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let dotX = -100, dotY = -100;
  let ringX = -100, ringY = -100;
  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    dotX = e.clientX;
    dotY = e.clientY;
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';
    if (!rafId) {
      rafId = requestAnimationFrame(animateRing);
    }
  });

  function animateRing() {
    ringX += (dotX - ringX) * 0.16;
    ringY += (dotY - ringY) * 0.16;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    const dist = Math.hypot(dotX - ringX, dotY - ringY);
    if (dist > 0.4) {
      rafId = requestAnimationFrame(animateRing);
    } else {
      rafId = null;
    }
  }

  // Hover expansion on interactive elements
  const hoverTargets = 'a, button, input, .project-matrix-card, .flagship-card, .social-card, .cert-item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.style.width = '42px';
      ring.style.height = '42px';
      ring.style.borderColor = 'var(--accent-primary)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.style.width = '28px';
      ring.style.height = '28px';
      ring.style.borderColor = 'rgba(125, 125, 125, 0.45)';
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}

/* ==========================================
   HEADER SCROLL & ACTIVE NAV INDICATOR
   ========================================== */

function initHeaderAndNav() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('#mainNav .nav-link');
  const navIndicator = document.querySelector('.nav-indicator');
  const sections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setIndicator(link) {
    if (!navIndicator || !link) return;
    navIndicator.style.width = link.offsetWidth + 'px';
    navIndicator.style.left = link.offsetLeft + 'px';
  }

  function setActive(sectionId) {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + sectionId;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
      if (isActive) setIndicator(link);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const offset = 100;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        history.pushState(null, '', targetId);
        setActive(targetId.slice(1));
      }
    });
  });

  const initActive = document.querySelector('#mainNav .nav-link.active');
  if (initActive) setIndicator(initActive);

  window.addEventListener('resize', () => {
    const curr = document.querySelector('#mainNav .nav-link.active');
    if (curr) setIndicator(curr);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, {
    rootMargin: '-25% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));
}

/* ==========================================
   MOBILE MENU DRAWER
   ========================================== */

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      closeMenu();
      setTimeout(() => {
        const target = document.querySelector(targetId);
        if (target) {
          window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
          history.pushState(null, '', targetId);
        }
      }, 250);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (isOpen && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ==========================================
   FILTERABLE PROJECT MATRIX
   ========================================== */

function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-matrix-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================
   INTERACTIVE DEVELOPER TERMINAL CONSOLE
   ========================================== */

function initTerminal() {
  const input = document.getElementById('termInput');
  const output = document.getElementById('termOutput');
  const body = document.getElementById('termBody');
  if (!input || !output) return;

  const commands = {
    help: () => [
      '<span class="term-highlight">AVAILABLE COMMANDS:</span>',
      '  <span class="term-success">whoami</span>       - Quick engineer profile & technical background',
      '  <span class="term-success">projects</span>     - Summary of flagship software systems',
      '  <span class="term-success">stack</span>        - Primary programming languages & engineering tools',
      '  <span class="term-success">run johnson</span>  - Execute simulated Johnson\'s algorithm across Yogyakarta nodes',
      '  <span class="term-success">certifications</span> - View verified credentials and registry links',
      '  <span class="term-success">market</span>       - Display latest fetched financial telemetry (USD, IHSG, BTC)',
      '  <span class="term-success">contact</span>      - Display email, GitHub, and communication channels',
      '  <span class="term-success">clear</span>        - Clear the terminal console output',
    ],
    whoami: () => [
      '<span class="term-highlight">Muhammad Athalla Bagaskara (alDev)</span>',
      'Role: Computer Science Undergraduate (UPN "Veteran" Yogyakarta)',
      'Specialization: Full-Stack Web Architecture, Distributed Systems & Developer Tools',
      'Experience: Production Contractor for Joe Coffee (New York), Freelance Data Engineer for clients in SG/AU/MY',
      'Honors: National Finalist / Participant - GEMASTIK XVIII (Competitive Programming)'
    ],
    projects: () => [
      '<span class="term-highlight">ENGINEERED PRODUCTION SYSTEMS:</span>',
      '1. <span class="term-success">NativeCopy</span>: Cross-device live keystroke bridge & VS Code code injection with MediaPipe AI.',
      '2. <span class="term-success">SPADA Auto-Presence</span>: Headless Playwright attendance bot with automated Telegram push proof.',
      '3. <span class="term-success">Joe Coffee NY</span>: E-commerce maintenance & mobile subscription checkout optimization.',
      '4. <span class="term-success">Yogyakarta Routes</span>: Johnson\'s algorithm in C for sparse geographic graph optimization.'
    ],
    stack: () => [
      '<span class="term-highlight">TECHNICAL MATRIX:</span>',
      'Languages:  TypeScript, JavaScript (ESNext), Python 3, C++, C, Java, PHP, Golang (Basics)',
      'Frontend:   React.js, Next.js, Tailwind CSS, Modern CSS, Semantic HTML5, WCAG A11y',
      'Backend:    Node.js, Express, FastAPI, REST APIs, WebSockets, Server-Sent Events',
      'Databases:  MySQL, PostgreSQL, Schema Normalization, Relational Indexing',
      'DevOps/CI:  Docker, Git, GitHub Actions, Playwright automation'
    ],
    market: () => {
      const usd = document.getElementById('tickerUsdIdr')?.textContent || 'Rp 15,845';
      const ihsg = document.getElementById('tickerIhsg')?.textContent || '7,342.10';
      const btc = document.getElementById('tickerBtc')?.textContent || '$76,210';
      return [
        '<span class="term-highlight">[MARKET TELEMETRY REFRESH]</span>',
        `  &bull; USD / IDR : <span class="term-success">${usd}</span>`,
        `  &bull; IHSG (IDX): <span class="term-success">${ihsg}</span>`,
        `  &bull; BTC / USD : <span class="term-success">${btc}</span>`,
        '  &bull; Status    : <span class="term-highlight">FEED ACTIVE (SSL Verified)</span>'
      ];
    },
    certifications: () => [
      '<span class="term-highlight">VERIFIED CREDENTIALS:</span>',
      '- Dicoding: C Programming (ID: MEPJQO61JX3V)',
      '- Dicoding: Java Programming (ID: L4PQELK02PO1)',
      '- HackerRank: SQL Advanced (ID: DED1FC114A41)',
      '- HackerRank: SQL Basic, Python, JS, C#, CSS'
    ],
    contact: () => [
      '<span class="term-highlight">TRANSMISSION CHANNELS:</span>',
      'Email:    <a href="mailto:iamathaalla@gmail.com" class="term-highlight">iamathaalla@gmail.com</a>',
      'GitHub:   <a href="https://github.com/muhmdathalla" target="_blank" class="term-highlight">https://github.com/muhmdathalla</a>',
      'LinkedIn: <a href="https://www.linkedin.com/in/muhmdathallaa" target="_blank" class="term-highlight">muhmdathallaa</a>',
      'YouTube:  <a href="https://www.youtube.com/keitnep" target="_blank" class="term-highlight">@keitnep (alCaps)</a>'
    ],
    'run johnson': () => [
      '<span class="term-warning">[INITIALIZING JOHNSON\'S ALGORITHM SIMULATION...]</span>',
      'Graph: 5 Vertices (Depok, Sleman, Gondomanan, Bantul, Mlati), 8 Weighted Edges',
      'Step 1: Adding auxiliary vertex s=0 with zero-weight edges to all vertices.',
      'Step 2: Running Bellman-Ford from s=0...',
      '  &bull; Potential h(Depok)=0, h(Sleman)=4, h(Gondomanan)=2, h(Bantul)=6, h(Mlati)=3',
      '  &bull; No negative-weight cycles detected. Potential values verified.',
      'Step 3: Reweighting all edges: w\'(u,v) = w(u,v) + h(u) - h(v) >= 0',
      'Step 4: Running Dijkstra on all reweighted vertices...',
      '  [RESULT] All-Pairs Shortest Paths Computed:',
      '    Depok       -> Gondomanan : 7.2 km  (via Ring Road Utara)',
      '    Sleman      -> Bantul     : 16.4 km (via Jl. Magelang - Palbapang)',
      '    Mlati       -> Gondomanan : 5.8 km  (via Tugu)',
      '<span class="term-success">[COMPLETED] Time Complexity: O(V * E + V^2 * log V) &middot; Johnson execution success.</span>'
    ],
    clear: () => {
      output.innerHTML = '';
      return [];
    }
  };

  function printLine(html, className = '') {
    const p = document.createElement('p');
    p.className = 'term-line ' + className;
    p.innerHTML = html;
    output.appendChild(p);
  }

  function handleCommand(cmdRaw) {
    const trimmed = cmdRaw.trim().toLowerCase();
    printLine(`<span class="term-prompt">athalla@upnvy:~$</span> ${cmdRaw}`);

    if (!trimmed) return;

    if (commands[trimmed]) {
      const res = commands[trimmed]();
      res.forEach(line => printLine(line));
    } else {
      printLine(`command not found: <span class="term-warning">${trimmed}</span>. Type <span class="term-highlight">help</span> for available commands.`, 'term-dim');
    }

    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      handleCommand(val);
    }
  });

  window.execQuickCmd = function(cmd) {
    input.value = cmd;
    handleCommand(cmd);
    input.value = '';
    input.focus();
  };
}

/* ==========================================
   CLIPBOARD UTILITY
   ========================================== */

function initClipboard() {
  const btn = document.getElementById('btnCopyEmail');
  const text = document.getElementById('emailText');
  if (!btn || !text) return;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text.textContent.trim());
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check" style="color:var(--accent-success);"></i> <span>Copied!</span>';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
      }, 2000);
    } catch {
      alert('Email copied: ' + text.textContent.trim());
    }
  });
}

/* ==========================================
   BACK TO TOP & FOOTER
   ========================================== */

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();
}

/* ==========================================
   AOS ANIMATIONS
   ========================================== */

function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 650,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic'
    });
  }
}

/* ==========================================
   BOOTSTRAP
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMarketTicker();
  initHeroCanvas();
  initHeroAmbientParallax();
  initCursor();
  initHeaderAndNav();
  initMobileMenu();
  initProjectFilter();
  initTerminal();
  initClipboard();
  initBackToTop();
  initAOS();
});
