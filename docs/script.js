/**
 * Muhammad Athalla Bagaskara – Portfolio JS
 * Version: 2.0 | Rebuilt for security & UX
 */

'use strict';

/* ==========================================
   UTILITY HELPERS
   ========================================== */

/**
 * Sanitize URL input to prevent open redirect / XSS
 * Only allows https:// URLs from whitelisted hostnames
 */
function sanitizeAppleMusicUrl(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:') return null;
    if (!['music.apple.com', 'embed.music.apple.com'].includes(url.hostname)) {
      return null;
    }
    // Convert regular Apple Music URL to embed URL
    const embedUrl = trimmed
      .replace('https://music.apple.com/', 'https://embed.music.apple.com/')
      .replace('https://embed.music.apple.com/embed/', 'https://embed.music.apple.com/');
    const embedParsed = new URL(embedUrl);
    // Only allow path segments without dangerous chars
    if (/[<>"'`\\]/.test(embedParsed.pathname)) return null;
    return embedParsed.href;
  } catch {
    return null;
  }
}


/* ==========================================
   CUSTOM CURSOR
   ========================================== */

function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;
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
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    const dist = Math.hypot(dotX - ringX, dotY - ringY);
    if (dist > 0.5) {
      rafId = requestAnimationFrame(animateRing);
    } else {
      rafId = null;
    }
  }

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}


/* ==========================================
   HEADER SCROLL EFFECT
   ========================================== */

function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ==========================================
   MOBILE MENU
   ========================================== */

function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
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
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68;
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
          history.pushState(null, '', targetId);
        }
      }, 320);
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });
}


/* ==========================================
   NAV INDICATOR + ACTIVE LINK
   ========================================== */

function initNav() {
  const navLinks    = document.querySelectorAll('nav .nav-link');
  const navIndicator= document.querySelector('.nav-indicator');
  const sections    = document.querySelectorAll('section[id]');
  if (!navLinks.length) return;

  function setIndicator(link) {
    if (!navIndicator || !link) return;
    navIndicator.style.width = link.offsetWidth + 'px';
    navIndicator.style.left  = link.offsetLeft + 'px';
  }

  function setActive(sectionId) {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + sectionId;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
      if (isActive) setIndicator(link);
    });
  }

  // Smooth scroll on nav click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target   = document.querySelector(targetId);
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        history.pushState(null, '', targetId);
        setActive(targetId.slice(1));
      }
    });
  });

  // Set initial indicator
  const initActive = document.querySelector('nav .nav-link.active');
  if (initActive) setIndicator(initActive);

  // Recalculate on resize
  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('nav .nav-link.active');
    if (currentActive) setIndicator(currentActive);
  });

  // Intersection Observer to update active section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));
}


/* ==========================================
   BACK TO TOP
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
}


/* ==========================================
   FOOTER YEAR
   ========================================== */

function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}


/* ==========================================
   AOS (Animate on Scroll)
   ========================================== */

function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic',
    });
  }
}


/* ==========================================
   APPLE MUSIC EMBED (SECURE)
   ========================================== */

/**
 * Exposed globally so the HTML onclick can call it.
 * Validates URL before setting iframe src.
 */
function updateAppleMusicEmbed() {
  const input = document.getElementById('appleMusicInput');
  const embed = document.getElementById('appleMusicEmbed');
  if (!input || !embed) return;

  const rawValue = input.value.trim();
  if (!rawValue) {
    showMusicError('Please paste an Apple Music URL.');
    return;
  }

  const safeUrl = sanitizeAppleMusicUrl(rawValue);
  if (!safeUrl) {
    showMusicError('Invalid URL. Please paste a valid Apple Music link (music.apple.com).');
    input.focus();
    return;
  }

  // All good – set the src
  embed.src = safeUrl;
  clearMusicError();
}

function showMusicError(msg) {
  let errEl = document.getElementById('musicError');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.id = 'musicError';
    errEl.setAttribute('role', 'alert');
    errEl.style.cssText = 'color:#fa243c;font-size:0.8rem;margin-top:4px;padding-left:4px;';
    const hint = document.querySelector('.music-hint');
    if (hint) hint.after(errEl);
  }
  errEl.textContent = msg;
}

function clearMusicError() {
  const errEl = document.getElementById('musicError');
  if (errEl) errEl.remove();
}

// Allow pressing Enter in music input
document.addEventListener('DOMContentLoaded', () => {
  const musicInput = document.getElementById('appleMusicInput');
  if (musicInput) {
    musicInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') updateAppleMusicEmbed();
    });
  }
});


/* ==========================================
   SKILL ITEMS – HOVER TILT
   ========================================== */

function initSkillTilt() {
  const items = document.querySelectorAll('.skill-item');
  items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 14;
      item.style.transform = `translateY(-3px) scale(1.03) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
}


/* ==========================================
   INIT ALL
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initHeader();
  initMobileMenu();
  initNav();
  initBackToTop();
  initFooterYear();
  initAOS();
  initSkillTilt();
});
