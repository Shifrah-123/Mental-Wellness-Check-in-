/**
 * USIU Wellness — Login / Sign-Up Page Logic
 * login.js
 */

// -----------------------------------------------------------
// Tab switching
// -----------------------------------------------------------

/**
 * Switch between Login and Sign-Up tabs.
 * @param {'login'|'signup'} tab
 */
function switchTab(tab) {
  const tabs   = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-panel');

  tabs.forEach(t => {
    const isActive = t.id === 'tab-' + tab;
    t.classList.toggle('auth-tab--active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  panels.forEach(p => {
    const isActive = p.id === 'panel-' + tab;
    p.classList.toggle('auth-panel--hidden', !isActive);
  });
}


// -----------------------------------------------------------
// Toggle password visibility
// -----------------------------------------------------------

/**
 * Toggle between password and plain text on an input.
 * @param {string}      inputId  - id of the password input
 * @param {HTMLElement} btn      - the eye button element
 */
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  // Swap icon opacity as a subtle hint
  btn.style.opacity = isHidden ? '1' : '0.5';
}


// -----------------------------------------------------------
// Password strength meter (sign-up)
// -----------------------------------------------------------

const strengthColors = {
  0: '',
  1: '#e74c3c',   // weak
  2: '#e67e22',   // fair
  3: '#f1c40f',   // good
  4: '#27ae60',   // strong
};

const strengthLabels = {
  0: '',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
};

/**
 * Score a password from 0–4.
 * @param {string} pw
 * @returns {number}
 */
function scorePassword(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^a-zA-Z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

/**
 * Update the 4-segment strength bar and label.
 */
function updateStrength() {
  const pw    = document.getElementById('signup-password').value;
  const score = scorePassword(pw);
  const color = strengthColors[score];
  const label = strengthLabels[score];

  for (let i = 1; i <= 4; i++) {
    const seg = document.getElementById('str-' + i);
    seg.style.background = i <= score ? color : 'var(--border)';
  }

  const lbl = document.getElementById('strength-label');
  lbl.textContent = pw.length ? label : '';
  lbl.style.color = color;
}

// Attach live listener after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const pwInput = document.getElementById('signup-password');
  if (pwInput) pwInput.addEventListener('input', updateStrength);
});


// -----------------------------------------------------------
// Validation helpers
// -----------------------------------------------------------

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors(...ids) {
  ids.forEach(id => showError(id, ''));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// -----------------------------------------------------------
// Login form
// -----------------------------------------------------------

/**
 * Handle login form submission.
 * @param {Event} e
 */
function handleLogin(e) {
  e.preventDefault();
  clearErrors('login-email-err', 'login-pw-err');

  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  let valid = true;

  if (!email) {
    showError('login-email-err', 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(email)) {
    showError('login-email-err', 'Please enter a valid email address.');
    valid = false;
  }

  if (!password) {
    showError('login-pw-err', 'Please enter your password.');
    valid = false;
  }

  if (!valid) return;

  // TODO: replace with real auth API call
  const btn = e.target.querySelector('.auth-submit-btn');
  btn.textContent = 'Signing in…';
  btn.disabled = true;

  setTimeout(() => {
    // Simulated success — redirect to check-in
    window.location.href = 'dashboard.html';
  }, 1200);
}


// -----------------------------------------------------------
// Sign-up form
// -----------------------------------------------------------

/**
 * Handle sign-up form submission.
 * @param {Event} e
 */
function handleSignup(e) {
  e.preventDefault();
  clearErrors('signup-email-err', 'signup-pw-err', 'signup-confirm-err');

  const fname    = document.getElementById('signup-fname').value.trim();
  const lname    = document.getElementById('signup-lname').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm  = document.getElementById('signup-confirm').value;
  const terms    = document.getElementById('signup-terms').checked;
  let valid = true;

  if (!email || !isValidEmail(email)) {
    showError('signup-email-err', 'Please enter a valid university email.');
    valid = false;
  }

  if (scorePassword(password) < 2) {
    showError('signup-pw-err', 'Password is too weak. Try adding numbers or symbols.');
    valid = false;
  }

  if (password !== confirm) {
    showError('signup-confirm-err', 'Passwords do not match.');
    valid = false;
  }

  if (!fname || !lname) {
    valid = false; // fields are required by HTML
  }

  if (!terms) {
    alert('Please agree to the Terms of Service and Privacy Policy to continue.');
    valid = false;
  }

  if (!valid) return;

  // TODO: replace with real registration API call
  const btn = e.target.querySelector('.auth-submit-btn');
  btn.textContent = 'Creating account…';
  btn.disabled = true;

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1200);
}


// -----------------------------------------------------------
// Google SSO
// -----------------------------------------------------------

function handleGoogle() {
  // TODO: initialise Google OAuth / Firebase Auth flow
  alert('Google sign-in coming soon.');
}


// -----------------------------------------------------------
// Forgot password
// -----------------------------------------------------------

function handleForgot() {
  const email = document.getElementById('login-email').value.trim();
  if (!email || !isValidEmail(email)) {
    showError('login-email-err', 'Enter your email above first, then click Forgot password.');
    return;
  }
  // TODO: trigger password-reset email via API
  alert('Password reset instructions have been sent to ' + email);
}