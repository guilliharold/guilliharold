/* ── script.js ─────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Notify Form ──────────────────────────────────── */
  const form     = document.getElementById('notifyForm');
  const input    = document.getElementById('emailInput');
  const formMsg  = document.getElementById('formMsg');

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function showMsg(text, type) {
    formMsg.textContent = text;
    formMsg.className   = 'form-msg ' + type;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!isValidEmail(input.value)) {
        showMsg('Please enter a valid email address.', 'error');
        input.focus();
        return;
      }

      // Simulate a successful submission
      const btn = form.querySelector('button');
      btn.textContent = '...';
      btn.disabled    = true;

      setTimeout(() => {
        showMsg("You're on the list — I'll be in touch soon.", 'success');
        input.value     = '';
        btn.textContent = 'Notify me';
        btn.disabled    = false;
      }, 900);
    });

    // Clear error on new input
    input.addEventListener('input', () => {
      if (formMsg.classList.contains('error')) showMsg('', '');
    });
  }

  /* ── Subtle Orb Mouse Parallax ────────────────────── */
  const orb = document.querySelector('.orb');

  if (orb && window.matchMedia('(pointer: fine)').matches) {
    let tx = 0, ty = 0;
    let cx = 0, cy = 0;

    document.addEventListener('mousemove', (e) => {
      // Map mouse to a gentle offset (-30px … +30px)
      tx = ((e.clientX / window.innerWidth)  - 0.5) * 60;
      ty = ((e.clientY / window.innerHeight) - 0.5) * 40;
    });

    (function lerp() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      orb.style.transform = `translateX(calc(-50% + ${cx}px)) translateY(${cy}px)`;
      requestAnimationFrame(lerp);
    })();
  }

})();
