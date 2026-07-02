(function() {
  'use strict';

  /* =========================================
     Mobile Nav Toggle
     ========================================= */
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      nav.classList.toggle('open');
    });

    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
      }
    });
  }

  /* =========================================
     Header Shadow on Scroll
     ========================================= */
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  /* =========================================
     Active Nav Link on Scroll
     ========================================= */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');

  function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(function(section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('load', updateActiveLink);

  /* =========================================
     Close Nav on Link Click (mobile)
     ========================================= */
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('open');
      if (toggle) toggle.classList.remove('active');
    });
  });

  /* =========================================
     Scroll Animation (Fade In)
     ========================================= */
  const animateElements = document.querySelectorAll('.service-card, .product-card, .why-card, .stat-card, .mv-card, .cert-badge, .contact-card, .section__header');

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animateElements.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  /* =========================================
     Counter Animation for Stats
     ========================================= */
  const statNumbers = document.querySelectorAll('.stat-card__number');

  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function(el) {
    counterObserver.observe(el);
  });

  function animateCounter(el, target) {
    const duration = 1500;
    const frameRate = 16;
    const totalFrames = duration / frameRate;
    let frame = 0;

    function tick() {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = formatNumber(el, current);

      if (frame < totalFrames) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = formatNumber(el, target);
      }
    }
    function formatNumber(el, num) {
      if (el.getAttribute('data-format') === 'year') return num;
      if (num >= 1000) return num.toLocaleString() + '+';
      return num;
    }
    tick();
  }

  /* =========================================
     Contact Form Handler
     ========================================= */
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const data = {};
      formData.forEach(function(value, key) {
        data[key] = value;
      });

      // Replace with your form service endpoint (Formspree, EmailJS, etc.)
      console.log('Form submitted:', data);

      setTimeout(function() {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#10B981';
        submitBtn.style.borderColor = '#10B981';

        setTimeout(function() {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.disabled = false;
          form.reset();
        }, 3000);
      }, 1000);
    });
  }

  /* =========================================
     Smooth Anchor Scroll (fallback)
     ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerOffset = document.getElementById('site-header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
