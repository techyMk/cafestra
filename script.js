/* =============================================================
   CAFESTRA — Premium Café Website
   Animations, scroll effects, counters, form handling
   ============================================================= */

(function () {
  'use strict';

  // ----- Loader -----
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('is-done');
    }, 1600);
  });

  // ----- Year in footer -----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Nav scroll state -----
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Mobile menu -----
  const burger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  if (burger && navMobile) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-open');
      navMobile.classList.toggle('is-open');
      document.body.style.overflow = navMobile.classList.contains('is-open') ? 'hidden' : '';
    });
    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('is-open');
        navMobile.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // ----- Smooth scroll for anchors -----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // ----- Reveal on scroll (IntersectionObserver) -----
  const revealEls = document.querySelectorAll('.reveal, .reveal-line, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Slight stagger for siblings in the same parent grid
          const siblings = Array.from(entry.target.parentElement?.children || [entry.target])
            .filter(c => c.classList.contains('reveal') || c.classList.contains('reveal-line'));
          const idx = siblings.indexOf(entry.target);
          const delay = idx >= 0 ? Math.min(idx * 80, 320) : 0;
          setTimeout(() => entry.target.classList.add('is-in'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  // ----- Animated counters in the hero -----
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const prefix = el.querySelector('.prefix');
    const suffix = el.querySelector('.suffix');
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.firstChild && (el.firstChild.nodeValue = '');
      let html = '';
      if (prefix) html += prefix.outerHTML;
      html += val;
      if (suffix) html += suffix.outerHTML;
      el.innerHTML = html;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  }

  // ----- Hero parallax (subtle) -----
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            heroBg.style.transform = `translateY(${y * 0.3}px) scale(${1 + y * 0.0003})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ----- Menu card cursor-follow glow -----
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  // ----- Reservation form -----
  const reserveForm = document.getElementById('reserveForm');
  const formSuccess = document.getElementById('formSuccess');
  if (reserveForm) {
    // Default date = today; min = today
    const dateInput = reserveForm.querySelector('input[name="date"]');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      if (!dateInput.value) dateInput.value = today;
    }
    const timeInput = reserveForm.querySelector('input[name="time"]');
    if (timeInput && !timeInput.value) timeInput.value = '19:00';

    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = reserveForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<span>Sending...</span>';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        if (formSuccess) {
          formSuccess.classList.add('is-shown');
          setTimeout(() => formSuccess.classList.remove('is-shown'), 5000);
        }
        reserveForm.reset();
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
        if (timeInput) timeInput.value = '19:00';
      }, 900);
    });
  }

  // ----- Newsletter form -----
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input.value && input.value.includes('@')) {
        newsletterMsg.textContent = 'Welcome — we\'ll be in touch.';
        input.value = '';
        setTimeout(() => { newsletterMsg.textContent = ''; }, 4000);
      } else {
        newsletterMsg.textContent = 'Please enter a valid email.';
        newsletterMsg.style.color = '#e89a9a';
      }
    });
  }

  // ----- Magnetic cursor on primary CTAs (subtle) -----
  if (!('ontouchstart' in window) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

})();
