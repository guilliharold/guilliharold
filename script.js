/* ── script.js ─────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Custom Cursor ──────────────────────────────── */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Smooth lag for outer ring
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    // Near-instant for dot
    dotX += (mouseX - dotX) * 0.55;
    dotY += (mouseY - dotY) * 0.55;

    cursor.style.left    = cursorX + 'px';
    cursor.style.top     = cursorY + 'px';
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top  = dotY + 'px';

    rafId = requestAnimationFrame(animateCursor);
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    animateCursor();

    // Hover state for interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .project-card, .skill-group, .nav-hire'
    );
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── Sticky Nav ─────────────────────────────────── */
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── Scroll Reveal ──────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── Count-Up Animations ────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1400; // ms
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach((el) => countObserver.observe(el));

  /* ── Marquee Pause on Hover ─────────────────────── */
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    const wrap = marqueeTrack.parentElement;
    wrap.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    wrap.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ── Smooth Scroll for Nav Links ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Hire Button Easter Egg ─────────────────────── */
  const hireBtn = document.getElementById('hireBtn');
  if (hireBtn) {
    hireBtn.addEventListener('click', () => {
      const contact = document.getElementById('contact');
      if (contact) {
        const offset = 80;
        const top = contact.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }

  /* ── Active Nav Link Highlight ──────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.style.opacity = link.getAttribute('href') === '#' + id ? '1' : '0.6';
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* ── Parallax tilt on Hero Card ─────────────────── */
  const heroCard = document.querySelector('.hero-card-inner');
  if (heroCard) {
    const heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const tiltX =  dy * 8;
      const tiltY = -dx * 8;
      heroCard.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
      heroCard.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      setTimeout(() => { heroCard.style.transition = ''; }, 500);
    });
  }

})();
