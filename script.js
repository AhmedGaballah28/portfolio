/* ============================================================
   AHMED HISHAM — Portfolio Interactions
   Smooth scroll, scroll reveal, navbar effects, mobile menu,
   video toggles, and active nav highlighting
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Initial check

  // ===== MOBILE MENU =====
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function toggleMobileMenu() {
    mobileToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    mobileToggle.classList.remove('open');
    navLinks.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close menu on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.offsetTop - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  // ===== ACTIVE NAV LINK HIGHLIGHTING =====
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const activeLink = navLinks.querySelector(`a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ===== SCROLL REVEAL (Intersection Observer) =====
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all elements immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ===== COUNTER ANIMATION =====
  const statValues = document.querySelectorAll('.hero-stat-value');

  function animateCounters() {
    statValues.forEach(stat => {
      const text = stat.textContent.trim();
      const match = text.match(/^(\d+)/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = text.replace(/^\d+/, '');
      let current = 0;
      const duration = 1500;
      const increment = target / (duration / 16);

      stat.textContent = `0${suffix}`;

      function updateCounter() {
        current += increment;
        if (current >= target) {
          stat.textContent = `${target}${suffix}`;
          return;
        }
        stat.textContent = `${Math.floor(current)}${suffix}`;
        requestAnimationFrame(updateCounter);
      }

      // Use IntersectionObserver to trigger when visible
      if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                updateCounter();
                counterObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 }
        );
        counterObserver.observe(stat);
      } else {
        updateCounter();
      }
    });
  }

  animateCounters();

  // ===== KEYBOARD NAVIGATION =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

});

// ===== VIDEO TOGGLE (global function for inline onclick) =====
function toggleVideo(videoId) {
  const embed = document.getElementById(videoId);
  if (!embed) return;

  const isVisible = embed.classList.contains('visible');
  const toggle = embed.previousElementSibling;

  if (isVisible) {
    embed.classList.remove('visible');
    if (toggle) toggle.textContent = '▶ Show Demo Video';
  } else {
    embed.classList.add('visible');
    if (toggle) toggle.textContent = '▼ Hide Demo Video';
  }
}

// ===== GALLERY TOGGLE =====
function toggleGallery(galleryId) {
  const gallery = document.getElementById(galleryId);
  if (!gallery) return;

  const isVisible = gallery.classList.contains('visible');
  const toggleBtn = gallery.previousElementSibling;

  if (isVisible) {
    gallery.classList.remove('visible');
    if (toggleBtn) toggleBtn.textContent = '▶ View Screenshots';
  } else {
    gallery.classList.add('visible');
    if (toggleBtn) toggleBtn.textContent = '▼ Hide Screenshots';
  }
}

// ===== LIGHTBOX LOGIC =====
let currentImageIndex = 0;
let currentZoomLevel = 1;
let imagesList = [];

function openLightbox(element) {
  const grid = element.closest('.gallery-grid');
  if (!grid) return;
  
  const imgs = Array.from(grid.querySelectorAll('img'));
  imagesList = imgs.map(img => img.src);
  currentImageIndex = imgs.indexOf(element);
  
  currentZoomLevel = 1;
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  
  img.src = imagesList[currentImageIndex];
  img.style.transform = `scale(${currentZoomLevel})`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}



function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function changeImage(direction) {
  currentImageIndex += direction;
  if (currentImageIndex >= imagesList.length) {
    currentImageIndex = 0;
  } else if (currentImageIndex < 0) {
    currentImageIndex = imagesList.length - 1;
  }
  currentZoomLevel = 1; // Reset zoom
  const img = document.getElementById('lightboxImg');
  img.src = imagesList[currentImageIndex];
  img.style.transform = `scale(${currentZoomLevel})`;
}

function zoomLightbox(delta) {
  currentZoomLevel += delta;
  if (currentZoomLevel < 0.5) currentZoomLevel = 0.5;
  if (currentZoomLevel > 4) currentZoomLevel = 4;
  document.getElementById('lightboxImg').style.transform = `scale(${currentZoomLevel})`;
}

function resetZoom() {
  currentZoomLevel = 1;
  document.getElementById('lightboxImg').style.transform = `scale(${currentZoomLevel})`;
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (lightbox && lightbox.classList.contains('active')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') changeImage(1);
    if (e.key === 'ArrowLeft') changeImage(-1);
  }
});
