/**
 * WellMind — Dashboard Logic
 * dashboard.js
 */

// -----------------------------------------------------------
// Greeting & date
// -----------------------------------------------------------
(function setGreeting() {
  const hour = new Date().getHours();
  const greetings = {
    morning:   'Good morning',
    afternoon: 'Good afternoon',
    evening:   'Good evening',
  };
  const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const name   = 'Amina'; // TODO: pull from session / auth state

  const el = document.getElementById('topGreeting');
  if (el) el.textContent = `${greetings[period]}, ${name} 👋`;

  const dateEl = document.getElementById('topDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }
})();


// -----------------------------------------------------------
// Animated wellness score ring
// -----------------------------------------------------------
(function animateScore() {
  const SCORE       = 74;   // TODO: load from user's last check-in
  const CIRCUMF     = 251;  // 2π × r (r = 40)

  const ring    = document.getElementById('scoreRing');
  const valEl   = document.getElementById('scoreVal');

  if (!ring || !valEl) return;

  // Animate after short delay so the page has painted
  setTimeout(() => {
    const offset = CIRCUMF - (CIRCUMF * SCORE / 100);
    ring.style.strokeDashoffset = offset;

    // Count-up number
    let current = 0;
    const step  = Math.ceil(SCORE / 50);
    const timer = setInterval(() => {
      current = Math.min(current + step, SCORE);
      valEl.textContent = current;
      if (current >= SCORE) clearInterval(timer);
    }, 25);
  }, 400);
})();


// -----------------------------------------------------------
// Animate wellness breakdown bars
// -----------------------------------------------------------
(function animateBars() {
  const bars = [
    { id: 'bar-mood',   width: 80 },
    { id: 'bar-sleep',  width: 65 },
    { id: 'bar-stress', width: 50 },
    { id: 'bar-social', width: 72 },
  ];

  setTimeout(() => {
    bars.forEach((b, i) => {
      const el = document.getElementById(b.id);
      if (el) {
        setTimeout(() => {
          el.style.width = b.width + '%';
        }, i * 120);
      }
    });
  }, 600);
})();


// -----------------------------------------------------------
// Mobile sidebar toggle
// -----------------------------------------------------------
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});


// -----------------------------------------------------------
// Hide today's check-in CTA if already done today
// (stub — replace with real logic once backend exists)
// -----------------------------------------------------------
(function checkTodayStatus() {
  const lastCheckin = localStorage.getItem('wm_last_checkin_date');
  const today       = new Date().toDateString();

  if (lastCheckin === today) {
    const cta = document.getElementById('checkinCta');
    if (cta) cta.style.display = 'none';
  }
})();


// -----------------------------------------------------------
// Active nav highlight (in case of future SPA routing)
// -----------------------------------------------------------
(function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.db-nav-link').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === path) {
      link.classList.add('active');
    } else if (path !== 'dashboard.html') {
      link.classList.remove('active');
    }
  });
})();