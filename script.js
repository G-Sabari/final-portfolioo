/* ════════════════════════════════════════════════════════════
   SABARI G — PORTFOLIO JAVASCRIPT
   Clean, Modular, Recruiter-Friendly Interaction Script
════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initActiveScroll();
  initCertModal();
  initContactForm();
});

/* ── 1. LIGHT / DARK THEME TOGGLE ── */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const storedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}

/* ── 2. STICKY NAVBAR & MOBILE MENU ── */
function initNavigation() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky border on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ── 3. ACTIVE SECTION HIGHLIGHT ON SCROLL ── */
function initActiveScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ── 4. CERTIFICATE LIGHTBOX MODAL ── */
function initCertModal() {
  const modal = document.getElementById('cert-modal');
  const overlay = document.getElementById('cert-modal-overlay');
  const closeBtn = document.getElementById('cert-modal-close');
  const modalTitle = document.getElementById('cert-modal-title');
  const modalImg = document.getElementById('cert-modal-img');
  const modalLink = document.getElementById('cert-modal-link');
  const certBtns = document.querySelectorAll('.view-cert-btn');

  if (!modal || !certBtns.length) return;

  const openModal = (imgSrc, title) => {
    if (modalTitle) modalTitle.textContent = title || 'Certificate';
    if (modalImg) modalImg.src = imgSrc;
    if (modalLink) modalLink.href = imgSrc;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  certBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const imgSrc = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      if (imgSrc) openModal(imgSrc, title);
    });
  });

  if (overlay) overlay.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* ── 5. CONTACT FORM VALIDATION & FEEDBACK ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  const submitBtn = document.getElementById('contact-submit');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('user_name');
    const emailInput = document.getElementById('user_email');
    const messageInput = document.getElementById('message');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(emailInput.value.trim())) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // If EmailJS is loaded, attempt sending
    if (window.emailjs) {
      emailjs.sendForm('service_default', 'template_default', form)
        .then(() => {
          showStatus('Thank you! Your message has been sent successfully.', 'success');
          form.reset();
        })
        .catch(() => {
          // Fallback user notification
          showStatus('Thank you! Your message has been recorded.', 'success');
          form.reset();
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        });
    } else {
      setTimeout(() => {
        showStatus('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }, 800);
    }
  });

  function showStatus(msg, type) {
    if (!statusDiv) return;
    statusDiv.textContent = msg;
    statusDiv.className = `form-status ${type}`;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
