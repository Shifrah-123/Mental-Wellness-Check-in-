
/*state*/
const answers = {
  mood:   null,
  stress: null,
  sleep:  null,
};


/* navigation and progress*/
/**
 * Show the given step and hide all others.
 * @param {number|'result'} n 
 */
function goToStep(n) {
  document.querySelectorAll('.wc-step').forEach(s => s.classList.remove('active'));

  const id = (n === 'result') ? 'stepResult' : 'step' + n;
  const el = document.getElementById(id);
  if (el) el.classList.add('active');

  updateProgress(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Update the progress bar and step counter text.
 * @param {number|'result'} step
 */
function updateProgress(step) {
  const num = (step === 'result') ? 6 : step;
  const pct = Math.round(((num - 1) / 6) * 100);

  const fill = document.getElementById('progressFill');
  fill.style.width = pct + '%';
  fill.parentElement.setAttribute('aria-valuenow', pct);

  document.getElementById('progressText').textContent =
    step === 'result' ? 'Complete ✓' : 'Step ' + num + ' of 6';
}


/* Input Handlers */

/**
 * Select a mood emoji button (Step 1).
 * @param {number} val - 1–5
 */
function selectMood(val) {
  answers.mood = val;

  document.querySelectorAll('.wc-mood-btn').forEach(b => {
    const selected = parseInt(b.dataset.val) === val;
    b.classList.toggle('selected', selected);
    b.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });

  document.getElementById('btn1').disabled = false;
}

/**
 * Select a value on a numbered scale (Step 2).
 * @param {string} key   - answers key, e.g. 'stress'
 * @param {number} val   - 1–5
 */
function selectScale(key, val) {
  answers[key] = val;

  document.getElementById(key + 'Scale').querySelectorAll('.wc-scale-btn').forEach(b => {
    const selected = parseInt(b.dataset.val) === val;
    b.classList.toggle('selected', selected);
    b.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });

  if (key === 'stress') document.getElementById('btn2').disabled = false;
}

/**
 * Select a single radio-style item from a list (Step 3).
 * @param {string}      key - answers key
 * @param {HTMLElement} el  - clicked item element
 * @param {number}      val - score value
 */
function selectSingle(key, el, val) {
  answers[key] = val;

  // Deselect all siblings
  el.closest('.wc-checkbox-list').querySelectorAll('.wc-checkbox-item').forEach(i => {
    i.classList.remove('selected');
    i.setAttribute('aria-checked', 'false');
    i.querySelector('.wc-check-box').textContent = '';
  });

  // Select the clicked one
  el.classList.add('selected');
  el.setAttribute('aria-checked', 'true');
  el.querySelector('.wc-check-box').textContent = '✓';

  if (key === 'sleep') document.getElementById('btn3').disabled = false;
}

/**
 * Toggle a multi-select checkbox item (Steps 4 & 5).
 * @param {HTMLElement} el
 */
function toggleMulti(el) {
  const nowSelected = !el.classList.contains('selected');
  el.classList.toggle('selected', nowSelected);
  el.setAttribute('aria-checked', nowSelected ? 'true' : 'false');
  el.querySelector('.wc-check-box').textContent = nowSelected ? '✓' : '';
}


/* Keyboard Support */
/**
 * Keyboard handler for radio-style items.
 */
function keySelect(e, key, el, val) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    selectSingle(key, el, val);
  }
}

/**
 * Keyboard handler for multi-select items.
 */
function keyToggle(e, el) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleMulti(el);
  }
}


/* UI Behaviors */

/**
 * Calculate the wellness score and render the results screen.
 */
function submitCheckin() {
  // Fall back to midpoint (3) if a question was skipped
  const mood      = answers.mood   || 3;
  const stress    = answers.stress || 3;
  const sleep     = answers.sleep  || 3;

  // Invert stress so higher = better
  const stressInv = 6 - stress;

  // Weighted average: mood×2 + stressInv×2 + sleep×1, max = 5
  const raw   = (mood * 2 + stressInv * 2 + sleep) / 5;
  const score = Math.round((raw / 5) * 100);

  // Collect selected concerns from Step 5
  const concerns = [...document.querySelectorAll('#step5 .wc-checkbox-item.selected')]
    .map(el => el.dataset.concern)
    .filter(Boolean);

  const hasCrisis = concerns.includes('crisis');

  // Navigate to results
  goToStep('result');

  // Animate score after a brief delay
  setTimeout(() => {
    document.getElementById('scoreNumber').textContent = score;
    document.getElementById('scoreBar').style.width = score + '%';

    let status;
    if (score >= 75)      status = 'Your wellness looks generally positive';
    else if (score >= 50) status = 'Some areas may need attention';
    else                  status = 'You may benefit from some support right now';

    document.getElementById('scoreStatus').textContent = status;
  }, 300);

  // Show crisis banner if needed
  if (hasCrisis) {
    document.getElementById('crisisBanner').style.display = 'block';
  }

  // Build insight cards
  const cards = [];

  if (mood <= 2) {
    cards.push({
      emoji:  '💛',
      accent: '#d4a017',
      title:  'Your mood is low',
      desc:   'Low mood is common for students under pressure. Consider reaching out to a friend, taking a walk, or booking a session at the Wellness Centre in Block C.',
    });
  }

  if (stress >= 4) {
    cards.push({
      emoji:  '🧘',
      accent: '#0a2240',
      title:  'High stress levels detected',
      desc:   'Chronic stress impacts focus, memory, and physical health. USIU hosts Mindfulness Sessions every Wednesday at 5 PM in the Main Hall — attendance is free.',
    });
  }

  if (sleep <= 2) {
    cards.push({
      emoji:  '🌙',
      accent: '#534AB7',
      title:  'Sleep quality needs attention',
      desc:   'Poor sleep affects grades and mood. Try limiting screens 1 hour before bed, keeping a consistent schedule, and avoiding caffeine after 3 PM.',
    });
  }

  if (concerns.includes('academic')) {
    cards.push({
      emoji:  '📚',
      accent: '#0F6E56',
      title:  'Academic support is available',
      desc:   'The Academic Skills Centre (Library, Level 2) offers tutoring, study groups, and exam coaching. Reach out before the pressure becomes overwhelming.',
    });
  }

  if (concerns.includes('financial')) {
    cards.push({
      emoji:  '💼',
      accent: '#854F0B',
      title:  'Financial assistance',
      desc:   'The Student Finance Office can discuss emergency bursaries, payment plans, and available scholarships. Visit the Admin Block.',
    });
  }

  if (concerns.includes('anxiety') || concerns.includes('depression')) {
    cards.push({
      emoji:  '💬',
      accent: '#993556',
      title:  'Professional counselling available',
      desc:   'Speaking with a trained counsellor can make a real difference. Sessions at the Wellness Centre are confidential and free for all registered USIU students.',
    });
  }

  if (concerns.includes('relationship')) {
    cards.push({
      emoji:  '🤝',
      accent: '#185FA5',
      title:  'Relationship & family support',
      desc:   'Navigating personal relationships while studying is hard. Counsellors at USIU are trained to help — walk in to Student Services or call +254 730 116 000.',
    });
  }

  // Positive fallback
  if (score >= 75 && cards.length === 0) {
    cards.push({
      emoji:  '✨',
      accent: '#3B6D11',
      title:  "You're doing well — keep it up!",
      desc:   "Great to hear you're in a good place. Stay connected, maintain your routines, and check in again next week.",
    });
  }

  // Render cards
  document.getElementById('resultCards').innerHTML = cards.map(c => `
    <div class="wc-result-card" style="border-left-color: ${c.accent};" role="listitem">
      <div class="wc-result-header">
        <div class="wc-result-icon" style="background: ${c.accent}22;">${c.emoji}</div>
        <div class="wc-result-title">${c.title}</div>
      </div>
      <div class="wc-result-desc">${c.desc}</div>
    </div>
  `).join('');
}


// -----------------------------------------------------------
// Reset
// -----------------------------------------------------------

/**
 * Reset all selections and return to Step 1.
 */
function restartCheckin() {
  // Clear answer state
  answers.mood   = null;
  answers.stress = null;
  answers.sleep  = null;

  // Clear button selections
  document.querySelectorAll('.wc-mood-btn, .wc-scale-btn').forEach(b => {
    b.classList.remove('selected');
    b.removeAttribute('aria-pressed');
  });

  // Clear checkbox items
  document.querySelectorAll('.wc-checkbox-item').forEach(el => {
    el.classList.remove('selected');
    el.setAttribute('aria-checked', 'false');
    const box = el.querySelector('.wc-check-box');
    if (box) box.textContent = '';
  });

  // Clear textarea
  document.getElementById('openNote').value = '';

  // Re-disable gated continue buttons
  ['btn1', 'btn2', 'btn3'].forEach(id => {
    document.getElementById(id).disabled = true;
  });

  // Hide crisis banner and reset score bar
  document.getElementById('crisisBanner').style.display = 'none';
  document.getElementById('scoreBar').style.width = '0%';

  goToStep(1);
}S