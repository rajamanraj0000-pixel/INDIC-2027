/* ============================================
   INDIC 2027 — Global Script
   Used by every page. Each block checks that its
   elements exist on the current page before running,
   so it is safe to load this one file everywhere.
   ============================================ */

(function () {
  // ---------- 0. Shared page motion ----------
  // Add motion behavior from one place so every page stays visually consistent.
  var sections = document.querySelectorAll('main section');
  var cards = document.querySelectorAll('main .rounded-2xl, main .rounded-xl');
  var actions = document.querySelectorAll('main a[href], header a[href], button');

  sections.forEach(function (section, index) {
    section.classList.add('motion-reveal');
    section.style.setProperty('--motion-delay', Math.min(index * 70, 280) + 'ms');
  });

  cards.forEach(function (card) {
    if (!card.querySelector('img') || card.closest('.hero-slide') === null) {
      card.classList.add('motion-card');
    }
  });

  actions.forEach(function (action) {
    if (!action.classList.contains('nav-link')) {
      action.classList.add('motion-action');
    }
  });

  var revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 }) : null;

  sections.forEach(function (section) {
    if (revealObserver) {
      revealObserver.observe(section);
    } else {
      section.classList.add('is-visible');
    }
  });

  // ---------- 0b. Responsive navigation ----------
  // The desktop nav hides at narrower widths, including browser zoom levels.
  var header = document.querySelector('header');
  var desktopNav = header ? header.querySelector('nav') : null;
  var headerRow = header ? header.firstElementChild : null;

  if (header && desktopNav && headerRow) {
    var mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle motion-action';
    mobileToggle.type = 'button';
    mobileToggle.setAttribute('aria-label', 'Open navigation menu');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.innerHTML = '<span class="material-symbols-outlined">menu</span>';

    var mobilePanel = document.createElement('nav');
    mobilePanel.className = 'mobile-menu-panel';
    mobilePanel.setAttribute('aria-label', 'Mobile navigation');

    desktopNav.querySelectorAll('a').forEach(function (link) {
      var mobileLink = link.cloneNode(true);
      mobileLink.className = '';
      mobilePanel.appendChild(mobileLink);
    });

    headerRow.appendChild(mobileToggle);
    header.appendChild(mobilePanel);

    mobileToggle.addEventListener('click', function () {
      var isOpen = mobilePanel.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      mobileToggle.querySelector('.material-symbols-outlined').textContent = isOpen ? 'close' : 'menu';
    });

    mobilePanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobilePanel.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation menu');
        mobileToggle.querySelector('.material-symbols-outlined').textContent = 'menu';
      });
    });
  }

  // ---------- 1. Highlight the active nav link ----------
  // Each <body> tag carries data-page="home|about|tracks|programme|registration|venue|contact"
  var currentPage = document.body.getAttribute('data-page');
  if (currentPage) {
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      if (link.getAttribute('data-nav') === currentPage) {
        link.classList.add('active');
      }
    });
  }

  // ---------- 2. Countdown Timer (home page only) ----------
  // INDIC 2027 Target Date: April 2, 2027 09:00:00 IST
  var targetDate = new Date("April 2, 2027 09:00:00").getTime();

  function updateCountdown() {
    var now = new Date().getTime();
    var distance = targetDate - now;

    if (distance > 0) {
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      var elDays = document.getElementById("timer-days");
      var elHours = document.getElementById("timer-hours");
      var elMins = document.getElementById("timer-minutes");
      var elSecs = document.getElementById("timer-seconds");

      if (elDays) elDays.innerText = String(days);
      if (elHours) elHours.innerText = String(hours).padStart(2, '0');
      if (elMins) elMins.innerText = String(minutes).padStart(2, '0');
      if (elSecs) elSecs.innerText = String(seconds).padStart(2, '0');
    }
  }

  if (document.getElementById("indic-countdown")) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ---------- 3. Dynamic Landmark Crossfade Slideshow (home page only) ----------
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.slide-dot');
  var label = document.getElementById('active-landmark-label');
  var currentSlide = 0;
  var slideInterval;

  window.goToSlide = function (index) {
    if (!slides.length || index === currentSlide || !slides[index]) return;
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.remove('bg-primary');
      dots[currentSlide].classList.add('bg-on-surface-variant/40');
    }

    currentSlide = index;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.remove('bg-on-surface-variant/40');
      dots[currentSlide].classList.add('bg-primary');
    }

    if (label) {
      label.style.opacity = '0';
      setTimeout(function () {
        label.textContent = slides[currentSlide].getAttribute('data-landmark');
        label.style.opacity = '1';
      }, 300);
    }
  };

  function nextSlide() {
    var nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  }

  function startSlideshow() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000);
  }

  if (slides.length) {
    startSlideshow();
  }

  // ---------- 4. Contact form (contact page only) ----------
  // No backend is wired up yet — this just confirms the message and resets the form.
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you for your inquiry! Our team will get back to you shortly.');
      contactForm.reset();
    });
  }
})();