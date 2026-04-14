/* =====================================================
   AXTONWALLET - MAIN JAVASCRIPT
   Complete interactive features for all sections
===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* =====================================================
     1. MOBILE MENU TOGGLE
  ===================================================== */
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuIcon = mobileMenuToggle ? mobileMenuToggle.querySelector('i') : null;

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('active');
      if (mobileMenuIcon) {
        mobileMenuIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        if (mobileMenuIcon) mobileMenuIcon.className = 'fas fa-bars';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
        if (mobileMenuIcon) mobileMenuIcon.className = 'fas fa-bars';
      }
    });
  }


  /* =====================================================
     2. STICKY HEADER - SHRINK ON SCROLL
  ===================================================== */
  const floatingHeader = document.querySelector('.floating-header');
  const headerInner = document.querySelector('.header-inner');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      headerInner.style.padding = '10px 28px';
      headerInner.style.background = 'rgba(255, 255, 255, 0.98)';
      headerInner.style.boxShadow = '0 10px 40px rgba(37, 99, 235, 0.2)';
    } else {
      headerInner.style.padding = '14px 28px';
      headerInner.style.background = 'rgba(255, 255, 255, 0.95)';
      headerInner.style.boxShadow = '0 20px 50px rgba(37, 99, 235, 0.15)';
    }
  });


  /* =====================================================
     3. ACTIVE NAV LINK ON SCROLL
  ===================================================== */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function setActiveNavLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active-nav');
      }
    });
  }

  // Add active nav style dynamically
  const activeNavStyle = document.createElement('style');
  activeNavStyle.textContent = `
    .nav-links a.active-nav {
      color: #2563eb !important;
      background: rgba(37, 99, 235, 0.1) !important;
      font-weight: 600;
    }
  `;
  document.head.appendChild(activeNavStyle);

  window.addEventListener('scroll', setActiveNavLink);


  /* =====================================================
     4. SMOOTH SCROLL FOR ALL ANCHOR LINKS
  ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = 100;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  /* =====================================================
     5. STATS COUNTER ANIMATION
  ===================================================== */
  const counters = document.querySelectorAll('.counter');
  let statsStarted = false;
  const statsSection = document.querySelector('.stats-section');

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2500;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOut * target);

        counter.textContent = current + 'K+';

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + 'K+';
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // App Section Counter (Downloads)
  const appCounters = document.querySelectorAll('.app-counter');
  let appCounterStarted = false;

  function animateAppCounter() {
    appCounters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2500;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOut * target);

        counter.textContent = current.toLocaleString() + '+';

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString() + '+';
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Scroll Observer for counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('stats-section') && !statsStarted) {
          statsStarted = true;
          animateCounters();
        }
        if (entry.target.classList.contains('app-download-section') && !appCounterStarted) {
          appCounterStarted = true;
          animateAppCounter();
        }
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) counterObserver.observe(statsSection);
  const appSection = document.querySelector('.app-download-section');
  if (appSection) counterObserver.observe(appSection);


  /* =====================================================
     6. TESTIMONIAL SLIDER
  ===================================================== */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-dots');
  const prevBtn = document.querySelector('.testimonial-arrows .prev');
  const nextBtn = document.querySelector('.testimonial-arrows .next');
  let currentSlide = 0;
  let autoSlideInterval;

  // Build dots dynamically
  if (dotsContainer && slides.length > 0) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('span') : [];
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  if (slides.length > 0) startAutoSlide();

  // Touch/Swipe support for slider
  const testimonialTrack = document.querySelector('.testimonial-track');
  let touchStartX = 0;
  let touchEndX = 0;

  if (testimonialTrack) {
    testimonialTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    testimonialTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetAutoSlide();
      }
    }, { passive: true });
  }


  /* =====================================================
     7. HOW IT WORKS - STEP CARDS INTERACTION
  ===================================================== */
  const stepCards = document.querySelectorAll('.step-card');

  stepCards.forEach((card, index) => {
    card.addEventListener('click', function () {
      stepCards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Auto cycle through steps
  let currentStep = 0;
  function cycleSteps() {
    stepCards.forEach(c => c.classList.remove('active'));
    stepCards[currentStep].classList.add('active');
    currentStep = (currentStep + 1) % stepCards.length;
  }

  if (stepCards.length > 0) {
    setInterval(cycleSteps, 3000);
  }


  /* =====================================================
     8. EMPOWERING SECTION - ACCORDION INTERACTION
  ===================================================== */
  const empowerItems = document.querySelectorAll('.empower-item');

  empowerItems.forEach(item => {
    item.addEventListener('click', function () {
      empowerItems.forEach(i => {
        i.classList.remove('active');
        const p = i.querySelector('p');
        if (p) {
          p.style.maxHeight = '0';
          p.style.opacity = '0';
        }
      });

      this.classList.add('active');
      const activeP = this.querySelector('p');
      if (activeP) {
        activeP.style.maxHeight = activeP.scrollHeight + 'px';
        activeP.style.opacity = '1';
      }
    });
  });

  // Add transition style for accordion
  const accordionStyle = document.createElement('style');
  accordionStyle.textContent = `
    .empower-item p {
      overflow: hidden;
      transition: max-height 0.4s ease, opacity 0.4s ease;
    }
    .empower-item:not(.active) p {
      max-height: 0;
      opacity: 0;
    }
    .empower-item.active p {
      max-height: 200px;
      opacity: 1;
    }
  `;
  document.head.appendChild(accordionStyle);


  /* =====================================================
     9. SCROLL REVEAL ANIMATIONS
  ===================================================== */
  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    .reveal-left {
      opacity: 0;
      transform: translateX(-40px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .reveal-left.revealed {
      opacity: 1;
      transform: translateX(0);
    }
    .reveal-right {
      opacity: 0;
      transform: translateX(40px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .reveal-right.revealed {
      opacity: 1;
      transform: translateX(0);
    }
    .reveal-scale {
      opacity: 0;
      transform: scale(0.85);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .reveal-scale.revealed {
      opacity: 1;
      transform: scale(1);
    }
  `;
  document.head.appendChild(revealStyle);

  // Add reveal classes to elements
  const revealTargets = [
    { selector: '.benefit-card', class: 'reveal', delay: true },
    { selector: '.stat-box', class: 'reveal', delay: true },
    { selector: '.how-content', class: 'reveal-right' },
    { selector: '.steps', class: 'reveal-left' },
    { selector: '.empower-image', class: 'reveal-left' },
    { selector: '.empower-content', class: 'reveal-right' },
    { selector: '.ai-bot-image', class: 'reveal-left' },
    { selector: '.ai-bot-content', class: 'reveal-right' },
    { selector: '.market-content', class: 'reveal-left' },
    { selector: '.market-chart', class: 'reveal-right' },
    { selector: '.testimonials-header', class: 'reveal' },
    { selector: '.app-text-content', class: 'reveal-left' },
    { selector: '.app-mockup', class: 'reveal-right' },
    { selector: '.benefits-header', class: 'reveal' },
    { selector: '.dashboard-wrapper', class: 'reveal-scale' },
    { selector: '.final-cta .cta-container', class: 'reveal' },
  ];

  revealTargets.forEach(({ selector, class: cls, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(cls);
      if (delay) {
        el.style.transitionDelay = `${i * 0.1}s`;
      }
    });
  });

  // Intersection Observer for reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });


  /* =====================================================
     10. BENEFIT CARD - 3D TILT EFFECT ON HOVER
  ===================================================== */
  const benefitCards = document.querySelectorAll('.benefit-card');

  benefitCards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });


  /* =====================================================
     11. PHONE MOCKUP - PARALLAX ON MOUSE MOVE
  ===================================================== */
  const appMockup = document.querySelector('.app-mockup');

  if (appMockup) {
    window.addEventListener('mousemove', function (e) {
      const appSection = document.querySelector('.app-download-section');
      if (!appSection) return;

      const rect = appSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (isInView) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        appMockup.style.transform = `translateX(${x}px) translateY(${y}px)`;
      }
    });
  }


  /* =====================================================
     12. STORE BUTTON - RIPPLE CLICK EFFECT
  ===================================================== */
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    .store-button {
      position: relative;
      overflow: hidden;
    }
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      width: 10px;
      height: 10px;
      transform: translate(-50%, -50%);
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events: none;
    }
    @keyframes rippleAnim {
      to {
        width: 300px;
        height: 300px;
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  document.querySelectorAll('.store-button').forEach(button => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });


  /* =====================================================
     13. FLOATING ICONS - INTERACTIVE HOVER
  ===================================================== */
  const floatingIcons = document.querySelectorAll('.floating-icon');

  floatingIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.3) rotate(360deg)';
      this.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      this.style.background = 'rgba(255, 255, 255, 0.25)';
    });

    icon.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1) rotate(0deg)';
      this.style.background = 'rgba(255, 255, 255, 0.1)';
    });
  });


  /* =====================================================
     14. PHONE SCREEN GLOW PULSE
  ===================================================== */
  const phoneScreen = document.querySelector('.phone-screen');

  if (phoneScreen) {
    let glowIn = true;

    setInterval(() => {
      if (glowIn) {
        phoneScreen.style.boxShadow = `
          0 0 30px rgba(37, 99, 235, 0.4),
          inset 0 0 20px rgba(37, 99, 235, 0.1)
        `;
      } else {
        phoneScreen.style.boxShadow = `
          0 0 15px rgba(37, 99, 235, 0.2),
          inset 0 0 10px rgba(37, 99, 235, 0.05)
        `;
      }
      phoneScreen.style.transition = 'box-shadow 1s ease';
      glowIn = !glowIn;
    }, 2000);
  }


  /* =====================================================
     15. HERO SECTION - FLOATING PARTICLES
  ===================================================== */
  const heroSection = document.querySelector('.hero-section');

  if (heroSection) {
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
      .hero-particle {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        animation: particleFloat linear infinite;
        opacity: 0.4;
      }
      @keyframes particleFloat {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 0.4; }
        90% { opacity: 0.4; }
        100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(particleStyle);

    function createParticle() {
      const particle = document.createElement('div');
      particle.classList.add('hero-particle');

      const size = Math.random() * 12 + 4;
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;

      const colors = [
        'rgba(37, 99, 235, 0.3)',
        'rgba(59, 130, 246, 0.3)',
        'rgba(147, 197, 253, 0.4)',
        'rgba(219, 234, 254, 0.5)'
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        background: ${color};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        box-shadow: 0 0 ${size}px ${color};
      `;

      heroSection.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) particle.remove();
      }, (duration + delay) * 1000);
    }

    // Create particles periodically
    for (let i = 0; i < 15; i++) {
      setTimeout(createParticle, i * 800);
    }
    setInterval(createParticle, 2000);
  }


  /* =====================================================
     16. BACK TO TOP BUTTON
  ===================================================== */
  const backToTopStyle = document.createElement('style');
  backToTopStyle.textContent = `
    .back-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 5px 20px rgba(37, 99, 235, 0.4);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      z-index: 999;
    }
    .back-to-top.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .back-to-top:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(37, 99, 235, 0.5);
    }
  `;
  document.head.appendChild(backToTopStyle);

  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* =====================================================
     17. LOADING SCREEN
  ===================================================== */
  const loadingStyle = document.createElement('style');
  loadingStyle.textContent = `
    .page-loader {
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      transition: opacity 0.5s ease, visibility 0.5s ease;
    }
    .page-loader.hidden {
      opacity: 0;
      visibility: hidden;
    }
    .loader-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 30px;
      animation: loaderPulse 1.5s ease-in-out infinite;
    }
    .loader-logo-icon {
      width: 60px;
      height: 60px;
      background: rgba(255,255,255,0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: white;
    }
    .loader-logo span {
      font-size: 24px;
      font-weight: 800;
      color: white;
    }
    .loader-bar-wrapper {
      width: 200px;
      height: 4px;
      background: rgba(255,255,255,0.2);
      border-radius: 999px;
      overflow: hidden;
    }
    .loader-bar {
      height: 100%;
      background: #fff;
      border-radius: 999px;
      animation: loaderFill 1.5s ease-in-out forwards;
    }
    .loader-text {
      margin-top: 16px;
      color: rgba(255,255,255,0.8);
      font-size: 14px;
      font-weight: 500;
    }
    @keyframes loaderPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes loaderFill {
      from { width: 0%; }
      to { width: 100%; }
    }
  `;
  document.head.appendChild(loadingStyle);

  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-logo">
      <div class="loader-logo-icon">
        <img src="assets/img/axton-favicon.svg" width="50px" height="50px">
      </div>
      <span>AXTONWALLET</span>
    </div>
    <div class="loader-bar-wrapper">
      <div class="loader-bar"></div>
    </div>
    <p class="loader-text">Loading your experience...</p>
  `;
  document.body.prepend(loader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600);
    }, 1500);
  });


  /* =====================================================
     18. CURSOR GLOW EFFECT (Desktop only)
  ===================================================== */
  if (window.innerWidth > 768) {
    const cursorGlowStyle = document.createElement('style');
    cursorGlowStyle.textContent = `
      .cursor-glow {
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: left 0.1s ease, top 0.1s ease;
      }
    `;
    document.head.appendChild(cursorGlowStyle);

    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }


  /* =====================================================
     19. FOOTER LINKS HOVER ANIMATION
  ===================================================== */
  document.querySelectorAll('.footer-col a').forEach(link => {
    link.addEventListener('mouseenter', function () {
      this.style.color = '#2563eb';
      this.style.paddingLeft = '8px';
      this.style.transition = 'all 0.3s ease';
    });

    link.addEventListener('mouseleave', function () {
      this.style.color = '';
      this.style.paddingLeft = '0px';
    });
  });


  /* =====================================================
     20. SECTION PROGRESS INDICATOR
  ===================================================== */
  const progressStyle = document.createElement('style');
  progressStyle.textContent = `
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
      z-index: 9999;
      transition: width 0.1s ease;
      border-radius: 0 999px 999px 0;
      box-shadow: 0 0 8px rgba(37, 99, 235, 0.6);
    }
  `;
  document.head.appendChild(progressStyle);

  const scrollProgress = document.createElement('div');
  scrollProgress.className = 'scroll-progress';
  document.body.prepend(scrollProgress);

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.width = progress + '%';
  });


  /* =====================================================
     21. IMAGE LAZY LOAD WITH FADE IN
  ===================================================== */
  const lazyStyle = document.createElement('style');
  lazyStyle.textContent = `
    img {
      transition: opacity 0.5s ease;
    }
    img.lazy-hidden {
      opacity: 0;
    }
    img.lazy-visible {
      opacity: 1;
    }
  `;
  document.head.appendChild(lazyStyle);

  const images = document.querySelectorAll('img:not([loading="lazy"])');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.remove('lazy-hidden');
        img.classList.add('lazy-visible');
        imageObserver.unobserve(img);
      }
    });
  }, { threshold: 0.1 });

  images.forEach(img => {
    img.classList.add('lazy-hidden');
    imageObserver.observe(img);
  });


  /* =====================================================
     22. TOOLTIP FOR NAV LINKS (Desktop)
  ===================================================== */
  if (window.innerWidth > 768) {
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
      .nav-tooltip {
        position: absolute;
        bottom: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: #0f172a;
        color: white;
        padding: 5px 10px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 100;
      }
      .nav-tooltip::before {
        content: '';
        position: absolute;
        top: -5px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #0f172a;
      }
      .nav-links a {
        position: relative;
      }
      .nav-links a:hover .nav-tooltip {
        opacity: 1;
      }
    `;
    document.head.appendChild(tooltipStyle);
  }


  /* =====================================================
     23. DYNAMIC YEAR IN FOOTER
  ===================================================== */
  const footerCopy = document.querySelector('.footer-copy');
  if (footerCopy) {
    const year = new Date().getFullYear();
    footerCopy.innerHTML = `
      <i class="fas fa-shield-alt"></i>
      AxtonWallet: The safety of your assets is our Priority. © ${year}
    `;
  }


  /* =====================================================
     24. PREVENT FLASH OF UNSTYLED CONTENT
  ===================================================== */
  document.documentElement.style.visibility = 'visible';


  /* =====================================================
     25. KEYBOARD NAVIGATION ACCESSIBILITY
  ===================================================== */
  document.addEventListener('keydown', function (e) {
    // ESC closes mobile menu
    if (e.key === 'Escape') {
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        if (mobileMenuIcon) mobileMenuIcon.className = 'fas fa-bars';
      }
    }

    // Arrow keys for testimonial slider
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });


  /* =====================================================
     CONSOLE WELCOME MESSAGE
  ===================================================== */
  console.log('%c🚀 AxtonWallet', 'color: #2563eb; font-size: 24px; font-weight: 800;');
  console.log('%cBuilt with ❤️ | axtonwallet@gmail.com', 'color: #64748b; font-size: 14px;');

});