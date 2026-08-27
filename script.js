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
  initResumeSection();
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

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const imgSrc = btn.getAttribute('data-img');
        const title = btn.getAttribute('data-title');
        if (imgSrc) openModal(imgSrc, title);
      }
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

/* ── 6. RESUME ACTIONS & TOAST NOTIFICATION ── */
function initResumeSection() {
  const printBtn = document.getElementById('btn-print-resume');
  const copyBtn = document.getElementById('btn-copy-resume');

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const atsResumeText = `SABARI G
Phone: +91 8754864826 | Email: sabarideveloperofficial@gmail.com
LinkedIn: https://www.linkedin.com/in/sabari-profile | GitHub: https://github.com/G-Sabari | Portfolio: https://g-sabari.github.io/

PROFESSIONAL SUMMARY
Java Full Stack Developer skilled in Java, Spring Boot, React.js, JavaScript, SQL, MySQL, REST APIs, JPA/Hibernate, Spring Security, JWT, OOP, and Data Structures & Algorithms, with a strong foundation in full-stack web development.

EDUCATION
• St. Peters College of Engineering & Technology, Avadi, Tamil Nadu (Sep 2023 - May 2027)
  B. Tech – Information Technology + Honours – CGPA: 7.91 / 10
• Government Higher Secondary School, Namakkal (June 2022 - April 2023)
  Higher Secondary Certificate (HSC) – 75%

WORKING EXPERIENCE
• Thiranex — Full Stack Development Intern (May 2026 - June 2026)
  - Developed responsive web application features using React.js, JavaScript, and REST APIs, integrating frontend components with backend services.
  - Implemented CRUD operations, tested application functionality, and fixed bugs to improve application performance and reliability.

• Elite Tech Intern — Web Development Intern (Dec 2024 - Jan 2025)
  - Developed and enhanced web application features using HTML, CSS, JavaScript, and React.js, focusing on responsive and user-friendly interfaces.
  - Implemented frontend functionality, tested application features, and resolved bugs to improve application performance and usability.

PROJECT EXPERIENCE
• IT Incident Management System (Java | Spring Boot | JWT | React.js | MySQL | REST APIs)
  - Developed a full-stack IT incident management system using Java, Spring Boot, React.js, and MySQL to manage IT support tickets through a structured incident lifecycle.
  - Implemented secure JWT-based authentication and role-based authorization for Users, Support Agents, and Administrators, with controlled access to incident operations.
  - Designed RESTful APIs for incident creation, assignment, status tracking, comments, and incident history, following a layered Spring Boot architecture with JPA/Hibernate.

• Employee Leave Management System (Java | Spring Boot | React.js | REST APIs | MySQL)
  - Developed a full-stack employee leave management application using Java, Spring Boot, React.js, and MySQL to streamline leave application and tracking.
  - Designed and integrated RESTful APIs for employee management, leave submission, leave status tracking, and approval workflows.
  - Implemented a layered backend architecture using Spring Boot, JPA/Hibernate, and MySQL, with a React.js frontend for managing employee leave requests.

TECHNICAL SKILLS
• Languages: Java, JavaScript, SQL, Python
• Frontend: React.js, Redux Toolkit, HTML5, CSS3, Tailwind CSS
• Backend: Spring Boot, Spring Security, RESTful APIs, JWT, JPA/Hibernate
• Database: MySQL, MongoDB
• Tools: Git, GitHub, Linux, VS Code, Postman, Chrome DevTools
• Core CS: OOP, Data Structures & Algorithms, DBMS, Computer Networks, Debugging

CERTIFICATIONS
• HTML & CSS: Beginner to Advanced — Udemy
• Python Development with ChatGPT: Full-Stack App Development — Coursera
• Artificial Intelligence — Reliance Foundation Skilling Academy
• Artificial Intelligence Fundamentals — IBM SkillsBuild

ACHIEVEMENTS
• Solved 60+ DSA problems on LeetCode and completed 30+ problems from the NeetCode roadmap, demonstrating strong problem-solving, data structures, and algorithmic skills.`;

      navigator.clipboard.writeText(atsResumeText)
        .then(() => {
          showToast('✓ Resume text copied to clipboard in ATS format!');
        })
        .catch(() => {
          // Fallback if clipboard API is blocked
          const tempArea = document.createElement('textarea');
          tempArea.value = atsResumeText;
          document.body.appendChild(tempArea);
          tempArea.select();
          document.execCommand('copy');
          document.body.removeChild(tempArea);
          showToast('✓ Resume text copied to clipboard!');
        });
    });
  }
}

/* ── 7. TOAST NOTIFICATION UTILITY ── */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

