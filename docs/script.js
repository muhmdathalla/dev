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
   THEME ENGINE (STRICT B&W MONOCHROME)
   ========================================== */

function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const root = document.documentElement;
  const body = document.body;

  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(savedTheme, false);

  function applyTheme(theme, animate = true) {
    root.setAttribute('data-theme', theme);
    if (body) body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (icon) {
      if (theme === 'light') {
        icon.className = 'fas fa-sun';
        if (toggleBtn) toggleBtn.setAttribute('title', 'Ganti ke Tema Gelap (Dark Mode)');
      } else {
        icon.className = 'fas fa-moon';
        if (toggleBtn) toggleBtn.setAttribute('title', 'Ganti ke Tema Terang (Light Mode)');
      }
    }

    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });
  }
}

/* ==========================================
   MARKET TELEMETRY TICKER (USD/IDR, IHSG, SYS CLOCK)
   ========================================== */

function initMarketTelemetry() {
  const usdEl = document.getElementById('tickerUsdIdr');
  const chgUsdEl = document.getElementById('chgUsdIdr');
  const ihsgEl = document.getElementById('tickerIhsg');
  const chgIhsgEl = document.getElementById('chgIhsg');
  const clockEl = document.getElementById('tickerClock');

  function triggerTickFlash(el, isUp) {
    if (!el) return;
    const cls = isUp ? 'ticker-flash-up' : 'ticker-flash-down';
    el.classList.remove('ticker-flash-up', 'ticker-flash-down');
    void el.offsetWidth; // Force reflow
    el.classList.add(cls);
    setTimeout(() => {
      el.classList.remove(cls);
    }, 900);
  }

  // Live UTC+7 WIB Digital Clock
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    clockEl.textContent = `${timeStr} WIB`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Live USD/IDR Fetch
  let prevUsdRate = 15845;
  async function fetchUsdIdr() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.rates && data.rates.IDR) {
        const rate = Math.round(data.rates.IDR);
        const formatted = new Intl.NumberFormat('id-ID').format(rate);
        const isUp = rate >= prevUsdRate;
        if (usdEl) {
          usdEl.textContent = `Rp ${formatted}`;
          triggerTickFlash(usdEl, isUp);
        }
        if (chgUsdEl) {
          chgUsdEl.textContent = isUp ? '+0.08%' : '-0.04%';
          chgUsdEl.className = `ticker-chg ${isUp ? 'up' : 'down'}`;
        }
        prevUsdRate = rate;
      }
    } catch {
      // Keep solid fallback from HTML
    }
  }

  // IHSG Telemetry Tracker
  let ihsgBase = 4931.39;
  const ihsgPrevClose = 5030.26;
  function updateIhsg() {
    const delta = (Math.random() - 0.51) * 0.7;
    const prevBase = ihsgBase;
    ihsgBase = Math.max(4925.10, Math.min(4960.00, ihsgBase + delta));
    const chgPct = (((ihsgBase - ihsgPrevClose) / ihsgPrevClose) * 100).toFixed(2);
    const isUp = ihsgBase >= prevBase;

    if (ihsgEl) {
      ihsgEl.textContent = ihsgBase.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      triggerTickFlash(ihsgEl, isUp);
    }
    if (chgIhsgEl) {
      chgIhsgEl.textContent = `${parseFloat(chgPct) >= 0 ? '+' : ''}${chgPct}%`;
      chgIhsgEl.className = `ticker-chg ${parseFloat(chgPct) >= 0 ? 'up' : 'down'}`;
    }
  }

  fetchUsdIdr();
  setInterval(fetchUsdIdr, 60000);
  setInterval(updateIhsg, 4000);
}

/* ==========================================
   LIVE REAL-TIME WEATHER & ANIMATED DROPDOWN
   ========================================== */

function initWeatherWidget() {
  const widget = document.getElementById('weatherWidget');
  const triggerBtn = document.getElementById('weatherTriggerBtn');
  const dropdown = document.getElementById('weatherDropdown');
  if (!widget || !triggerBtn || !dropdown) return;

  const miniIcon = document.getElementById('weatherMiniIcon');
  const miniTemp = document.getElementById('weatherMiniTemp');
  const locName = document.getElementById('weatherLocationName');
  const heroTemp = document.getElementById('weatherHeroTemp');
  const condText = document.getElementById('weatherCondText');
  const humidity = document.getElementById('weatherHumidity');
  const windSpeed = document.getElementById('weatherWindSpeed');
  const feelsLike = document.getElementById('weatherFeelsLike');
  const updatedTime = document.getElementById('weatherUpdatedTime');
  const animArt = document.getElementById('weatherAnimArt');

  // Toggle Dropdown
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = widget.classList.toggle('open');
    triggerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    dropdown.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target)) {
      widget.classList.remove('open');
      triggerBtn.setAttribute('aria-expanded', 'false');
      dropdown.setAttribute('aria-hidden', 'true');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('open')) {
      widget.classList.remove('open');
      triggerBtn.setAttribute('aria-expanded', 'false');
      dropdown.setAttribute('aria-hidden', 'true');
    }
  });

  // Weather Code Interpreter
  function parseWeatherCode(code, isDay) {
    if (code === 0) {
      return {
        label: isDay ? 'Cerah' : 'Cerah Berbintang',
        icon: isDay ? 'fa-sun' : 'fa-moon',
        type: isDay ? 'sun' : 'night'
      };
    }
    if ([1, 2, 3].includes(code)) {
      return {
        label: code === 1 ? 'Sebagian Cerah' : (code === 2 ? 'Cerah Berawan' : 'Berawan'),
        icon: isDay ? 'fa-cloud-sun' : 'fa-cloud-moon',
        type: 'cloud'
      };
    }
    if ([45, 48].includes(code)) {
      return { label: 'Berkabut', icon: 'fa-smog', type: 'fog' };
    }
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return { label: 'Hujan', icon: 'fa-cloud-rain', type: 'rain' };
    }
    if ([95, 96, 99].includes(code)) {
      return { label: 'Hujan Badai', icon: 'fa-cloud-bolt', type: 'storm' };
    }
    return { label: 'Cerah Berawan', icon: 'fa-cloud-sun', type: 'cloud' };
  }

  // Update Visual Scene Art with Rich Interactive Animations
  function updateSceneArt(type, isDay = true) {
    if (!animArt) return;
    if (type === 'rain') {
      animArt.innerHTML = `
        <div class="anim-cloud-layer2"></div>
        <div class="anim-cloud-layer1"></div>
        <div class="anim-rain-wrap">
          <div class="rain-streak"></div>
          <div class="rain-streak"></div>
          <div class="rain-streak"></div>
          <div class="rain-streak"></div>
        </div>
      `;
    } else if (type === 'storm') {
      animArt.innerHTML = `
        <div class="anim-cloud-layer2"></div>
        <div class="anim-cloud-layer1" style="background:#64748b;"></div>
        <div class="anim-lightning"><i class="fas fa-bolt"></i></div>
        <div class="anim-rain-wrap">
          <div class="rain-streak"></div>
          <div class="rain-streak"></div>
          <div class="rain-streak"></div>
          <div class="rain-streak"></div>
        </div>
      `;
    } else if (type === 'sun' || (type === 'cloud' && isDay)) {
      if (type === 'sun') {
        animArt.innerHTML = `
          <div class="anim-sun-wrap">
            <div class="anim-sun-rays"></div>
            <div class="anim-sun-core"></div>
          </div>
        `;
      } else {
        animArt.innerHTML = `
          <div class="anim-sun-wrap" style="transform: scale(0.68) translate(-12px, -8px);">
            <div class="anim-sun-core"></div>
          </div>
          <div class="anim-cloud-layer2"></div>
          <div class="anim-cloud-layer1"></div>
        `;
      }
    } else if (!isDay || type === 'night') {
      animArt.innerHTML = `
        <div class="anim-moon"></div>
        <div class="anim-star"></div>
        <div class="anim-star"></div>
        <div class="anim-star"></div>
      `;
    } else {
      animArt.innerHTML = `
        <div class="anim-cloud-layer2"></div>
        <div class="anim-cloud-layer1"></div>
      `;
    }
  }

  // Fetch Weather from Open-Meteo
  async function fetchWeatherData(lat, lon, locationLabel) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (!data || !data.current) return;

      const c = data.current;
      const tempRound = Math.round(c.temperature_2m);
      const feelsRound = Math.round(c.apparent_temperature);
      const isDay = c.is_day === 1;
      const weatherInfo = parseWeatherCode(c.weather_code, isDay);

      if (miniIcon) miniIcon.innerHTML = `<i class="fas ${weatherInfo.icon}"></i>`;
      if (triggerBtn) triggerBtn.setAttribute('title', `Cuaca: ${weatherInfo.label} (${tempRound}°C) · Klik untuk detail`);
      if (heroTemp) heroTemp.textContent = `${tempRound}°`;
      if (condText) condText.textContent = weatherInfo.label;
      if (humidity) humidity.textContent = `${c.relative_humidity_2m}%`;
      if (windSpeed) windSpeed.textContent = `${Math.round(c.wind_speed_10m)} km/h`;
      if (feelsLike) feelsLike.textContent = `${feelsRound}°C`;
      if (locName && locationLabel) locName.textContent = locationLabel;

      const now = new Date();
      if (updatedTime) updatedTime.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      updateSceneArt(weatherInfo.type, isDay);
    } catch {
      // Fallback kept gracefully
    }
  }

  // Geolocation detector with IP / City fallback
  function detectLocationAndFetch() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          let label = 'Lokasi Terdeteksi';
          try {
            const revRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`);
            if (revRes.ok) {
              const revData = await revRes.json();
              if (revData && revData.city) {
                label = `${revData.city}, ${revData.countryName || 'ID'}`;
              }
            }
          } catch {
            label = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
          }
          fetchWeatherData(lat, lon, label);
        },
        () => {
          fallbackByIpOrCity();
        },
        { timeout: 6000 }
      );
    } else {
      fallbackByIpOrCity();
    }
  }

  async function fallbackByIpOrCity() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          fetchWeatherData(data.latitude, data.longitude, `${data.city || 'Indonesia'}, ${data.country_name || 'ID'}`);
          return;
        }
      }
    } catch {
      // Fallback
    }
    fetchWeatherData(-7.7956, 110.3695, 'Yogyakarta, Indonesia');
  }

  detectLocationAndFetch();
}

/* ==========================================
   INIT ALL
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const safeRun = (fn) => {
    try { fn(); } catch (err) { console.warn(err); }
  };

  safeRun(initThemeToggle);
  safeRun(initMarketTelemetry);
  safeRun(initWeatherWidget);
  safeRun(initCursor);
  safeRun(initHeader);
  safeRun(initMobileMenu);
  safeRun(initNav);
  safeRun(initBackToTop);
  safeRun(initFooterYear);
  safeRun(initAOS);
  safeRun(initSkillTilt);
  safeRun(initScrollProgress);
  safeRun(initCardTilt);
});
