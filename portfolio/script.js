/**
 * Norhan Elsayed - Personal Portfolio Website
 * Senior Flutter Developer | Software Engineer | Mobile App Developer
 * Clean, Modular Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER (Dark/Light Mode with localStorage & System Preference)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  /**
   * Determine initial theme:
   * 1. Saved localStorage value
   * 2. System preference via window.matchMedia
   */
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  /**
   * Apply theme and update button accessibility attributes
   */
  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (themeToggleBtn) {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      themeToggleBtn.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
      themeToggleBtn.setAttribute('title', `Switch to ${nextTheme} mode`);
    }
  };

  // Initialize theme
  applyTheme(getInitialTheme());

  // Handle Theme Toggle Click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // Listen for OS system theme change if no explicit preference saved
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });


  // --------------------------------------------------------------------------
  // 2. STICKY NAVBAR SCROLL STATE
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('site-header');

  const handleHeaderScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();


  // --------------------------------------------------------------------------
  // 3. MOBILE MENU TOGGLE & ACCESSIBILITY
  // --------------------------------------------------------------------------
  const menuToggleBtn = document.getElementById('menu-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = (forceState) => {
    const isOpen = typeof forceState === 'boolean' 
      ? forceState 
      : !primaryNav.classList.contains('is-open');

    primaryNav.classList.toggle('is-open', isOpen);
    menuToggleBtn.classList.toggle('is-active', isOpen);
    menuToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuToggleBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

    if (isOpen) {
      // Focus first link for keyboard accessibility
      const firstLink = primaryNav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  };

  if (menuToggleBtn && primaryNav) {
    menuToggleBtn.addEventListener('click', () => toggleMenu());

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('is-open')) {
          toggleMenu(false);
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (primaryNav.classList.contains('is-open')) {
        if (!primaryNav.contains(e.target) && !menuToggleBtn.contains(e.target)) {
          toggleMenu(false);
        }
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        toggleMenu(false);
        menuToggleBtn.focus();
      }
    });
  }


  // --------------------------------------------------------------------------
  // 4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }


  // --------------------------------------------------------------------------
  // 5. ANIMATED SKILL BARS
  // --------------------------------------------------------------------------
  const skillProgressBars = document.querySelectorAll('.progress-fill');
  const skillsSection = document.getElementById('skills');

  const animateSkills = () => {
    skillProgressBars.forEach((bar) => {
      const targetWidth = bar.getAttribute('data-progress');
      if (targetWidth) {
        bar.style.width = targetWidth;
      }
    });
  };

  if (skillsSection && 'IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkills();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    skillsObserver.observe(skillsSection);
  } else {
    animateSkills();
  }


  // --------------------------------------------------------------------------
  // 6. SCROLLSPY (Active Navigation Link Highlighting)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
  highlightNavOnScroll();


  // --------------------------------------------------------------------------
  // 7. ACCESSIBLE TESTIMONIALS SLIDER
  // --------------------------------------------------------------------------
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const sliderWrapper = document.querySelector('.testimonials-slider-wrapper');

  let currentSlide = 0;
  let autoplayTimer = null;
  const slideInterval = 5000;

  const updateSlideDisplay = (index) => {
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', !isActive);
      slide.tabIndex = isActive ? 0 : -1;
    });

    dots.forEach((dot, i) => {
      const isSelected = i === index;
      dot.classList.toggle('active', isSelected);
      dot.setAttribute('aria-selected', isSelected);
    });

    currentSlide = index;
  };

  const goToNextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    updateSlideDisplay(nextIndex);
  };

  const goToPrevSlide = () => {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    updateSlideDisplay(prevIndex);
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(goToNextSlide, slideInterval);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  if (slides.length > 0) {
    updateSlideDisplay(0);
    startAutoplay();

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToNextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToPrevSlide();
        startAutoplay();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(targetIndex)) {
          updateSlideDisplay(targetIndex);
          startAutoplay();
        }
      });
    });

    // Pause autoplay on mouse hover or focus within
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', stopAutoplay);
      sliderWrapper.addEventListener('mouseleave', startAutoplay);
      sliderWrapper.addEventListener('focusin', stopAutoplay);
      sliderWrapper.addEventListener('focusout', startAutoplay);

      // Keyboard navigation with Left & Right arrows
      sliderWrapper.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          goToPrevSlide();
          startAutoplay();
        } else if (e.key === 'ArrowRight') {
          goToNextSlide();
          startAutoplay();
        }
      });
    }
  }


  // --------------------------------------------------------------------------
  // 8. QUICK CONTACT FORM (Client-side validation & Mailto Trigger)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const subjectError = document.getElementById('subject-error');
      const messageError = document.getElementById('message-error');

      // Clear previous error messages
      [nameError, emailError, subjectError, messageError].forEach(el => {
        if (el) el.textContent = '';
      });
      if (formStatus) formStatus.textContent = '';

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email.';
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectError.textContent = 'Please provide a subject.';
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please write a message.';
        isValid = false;
      }

      if (!isValid) return;

      // Prepare mailto link
      const recipient = 'ahmedelsayednn9@gmail.com';
      const subject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()}`);
      const body = encodeURIComponent(
        `Hello Norhan,\n\n${messageInput.value.trim()}\n\nBest regards,\n${nameInput.value.trim()}\nContact: ${emailInput.value.trim()}`
      );

      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

      // Notify user and launch email client
      if (formStatus) {
        formStatus.textContent = 'Launching your default email client...';
        formStatus.style.color = 'var(--accent-light)';
      }

      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
        if (formStatus) {
          formStatus.textContent = 'Note prepared! You can also reach me directly on WhatsApp.';
        }
      }, 500);
    });
  }


  // --------------------------------------------------------------------------
  // 9. DYNAMIC CURRENT YEAR IN FOOTER
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
