/* Navbar: shrink on scroll */
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


/*Mobile drawer toggle*/
function toggleDrawer() {
  const drawer = document.getElementById('navDrawer');
  drawer.classList.toggle('open');
}

// Close drawer when clicking outside
document.addEventListener('click', (e) => {
  const drawer    = document.getElementById('navDrawer');
  const hamburger = document.getElementById('hamburger');
  if (drawer.classList.contains('open') &&
      !drawer.contains(e.target) &&
      !hamburger.contains(e.target)) {
    drawer.classList.remove('open');
  }
});


// -----------------------------------------------------------
// Scroll-reveal: fade in elements as they enter viewport
// -----------------------------------------------------------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
});

document.querySelectorAll('.hp-reveal').forEach(el => {
  revealObserver.observe(el);
});


// -----------------------------------------------------------
// Smooth scroll for nav anchor links
// -----------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 76; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// -----------------------------------------------------------
// Animated counter for hero stats (runs once when in view)
// -----------------------------------------------------------
function animateCounters() {
  // Stats are text-based (3 min, 100%, Free) so nothing to count.
  // Hook here if numeric stats are added later.
}

const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hp-hero-stats');
if (heroStats) heroObserver.observe(heroStats);