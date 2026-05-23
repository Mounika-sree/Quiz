/* ══════════════════════════════════════════════════════════
   QuizMaster — Frontend Application Logic
   ══════════════════════════════════════════════════════════ */

// ── State ──────────────────────────────────────────────
let sessionId = null;
let currentQuestionIndex = 0;
let totalQuestions = 0;
let answered = false;

const API = '';  // Same origin — no prefix needed

// ── DOM Refs ───────────────────────────────────────────
const welcomeScreen  = document.getElementById('welcome-screen');
const quizScreen     = document.getElementById('quiz-screen');
const resultsScreen  = document.getElementById('results-screen');

const categoryBadge  = document.getElementById('quiz-category');
const questionCounter = document.getElementById('quiz-counter');
const progressBar    = document.getElementById('progress-bar');
const questionText   = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackBox    = document.getElementById('feedback-box');
const feedbackIcon   = document.getElementById('feedback-icon');
const feedbackText   = document.getElementById('feedback-text');
const btnNext        = document.getElementById('btn-next');

const scorePercent   = document.getElementById('score-percent');
const scoreLabel     = document.getElementById('score-label');
const scoreRingFill  = document.getElementById('score-ring-fill');
const gradeBadge     = document.getElementById('grade-badge');
const reviewList     = document.getElementById('review-list');

// ── Screen Management ──────────────────────────────────
function showScreen(screen) {
  [welcomeScreen, quizScreen, resultsScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

// ── Start Quiz ─────────────────────────────────────────
async function startQuiz() {
  try {
    const res = await fetch(`${API}/api/start`, { method: 'POST' });
    const data = await res.json();
    sessionId = data.sessionId;
    totalQuestions = data.total;
    currentQuestionIndex = 0;

    showScreen(quizScreen);
    loadQuestion(1);
  } catch (err) {
    console.error('Failed to start quiz:', err);
    alert('Failed to start quiz. Make sure the server is running.');
  }
}

// ── Load Question ──────────────────────────────────────
async function loadQuestion(id) {
  answered = false;
  btnNext.classList.add('hidden');
  feedbackBox.classList.add('hidden');
  feedbackBox.classList.remove('correct-feedback', 'wrong-feedback');

  try {
    const res = await fetch(`${API}/api/questions/${id}`);
    const q = await res.json();

    // Update header
    categoryBadge.textContent = q.category;
    questionCounter.textContent = `${q.questionNumber} / ${q.total}`;
    progressBar.style.width = `${(q.questionNumber / q.total) * 100}%`;

    // Update question
    questionText.textContent = q.question;

    // Build options
    const letters = ['A', 'B', 'C', 'D'];
    optionsContainer.innerHTML = '';

    q.options.forEach((option, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.id = `option-${i}`;
      btn.innerHTML = `
        <span class="option-letter">${letters[i]}</span>
        <span class="option-text">${option}</span>
      `;
      btn.addEventListener('click', () => submitAnswer(q.id, i));
      optionsContainer.appendChild(btn);
    });

    // Re-trigger animation
    document.getElementById('question-card').style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    document.getElementById('question-card').offsetHeight;  // force reflow
    document.getElementById('question-card').style.animation = '';

  } catch (err) {
    console.error('Failed to load question:', err);
  }
}

// ── Submit Answer ──────────────────────────────────────
async function submitAnswer(questionId, selectedOption) {
  if (answered) return;
  answered = true;

  // Disable all options
  const allBtns = optionsContainer.querySelectorAll('.option-btn');
  allBtns.forEach(btn => btn.classList.add('disabled'));

  // Highlight selected
  allBtns[selectedOption].classList.add('selected');

  try {
    const res = await fetch(`${API}/api/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, selectedOption, sessionId })
    });
    const data = await res.json();

    // Mark correct/wrong
    if (data.correct) {
      allBtns[selectedOption].classList.remove('selected');
      allBtns[selectedOption].classList.add('correct');
    } else {
      allBtns[selectedOption].classList.remove('selected');
      allBtns[selectedOption].classList.add('wrong');
      allBtns[data.correctIndex].classList.add('correct');
    }

    // Show feedback
    feedbackBox.classList.remove('hidden', 'correct-feedback', 'wrong-feedback');
    if (data.correct) {
      feedbackBox.classList.add('correct-feedback');
      feedbackIcon.textContent = '✓';
      feedbackText.innerHTML = `<strong>Correct!</strong> ${data.explanation}`;
    } else {
      feedbackBox.classList.add('wrong-feedback');
      feedbackIcon.textContent = '✗';
      feedbackText.innerHTML = `<strong>Incorrect.</strong> ${data.explanation}`;
    }

    // Show Next / Finish button
    btnNext.classList.remove('hidden');
    currentQuestionIndex++;

    if (currentQuestionIndex >= totalQuestions) {
      btnNext.innerHTML = 'See Results <span class="btn-arrow">→</span>';
    } else {
      btnNext.innerHTML = 'Next Question <span class="btn-arrow">→</span>';
    }

  } catch (err) {
    console.error('Failed to submit answer:', err);
  }
}

// ── Next Question / Finish ─────────────────────────────
async function nextQuestion() {
  if (currentQuestionIndex >= totalQuestions) {
    await showResults();
  } else {
    loadQuestion(currentQuestionIndex + 1);
  }
}

// ── Show Results ───────────────────────────────────────
async function showResults() {
  try {
    const res = await fetch(`${API}/api/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    const data = await res.json();

    showScreen(resultsScreen);

    // Animate score ring
    const circumference = 2 * Math.PI * 70; // r=70
    const offset = circumference - (data.percentage / 100) * circumference;

    // Inject SVG gradient (needs to be in the results SVG)
    const svg = document.querySelector('.score-ring');
    if (!svg.querySelector('#scoreGrad')) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      grad.setAttribute('id', 'scoreGrad');
      grad.setAttribute('x1', '0');
      grad.setAttribute('y1', '0');
      grad.setAttribute('x2', '1');
      grad.setAttribute('y2', '1');

      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', '#a78bfa');

      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', '#6366f1');

      grad.appendChild(stop1);
      grad.appendChild(stop2);
      defs.appendChild(grad);
      svg.insertBefore(defs, svg.firstChild);
    }

    scoreRingFill.style.strokeDasharray = circumference;
    scoreRingFill.style.strokeDashoffset = circumference;

    // Trigger animation after a tick
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scoreRingFill.style.strokeDashoffset = offset;
      });
    });

    // Animate counter
    animateCounter(scorePercent, 0, data.percentage, 1200, '%');
    scoreLabel.textContent = `${data.score} / ${data.total}`;
    gradeBadge.textContent = data.grade;

    // Build review list
    reviewList.innerHTML = '';
    data.results.forEach((r, i) => {
      const item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML = `
        <div class="review-header" onclick="toggleReview(this)">
          <div class="review-status ${r.correct ? 'correct' : 'wrong'}">
            ${r.correct ? '✓' : '✗'}
          </div>
          <span class="review-question">${i + 1}. ${r.question}</span>
          <span class="review-toggle">▾</span>
        </div>
        <div class="review-details">
          <div class="review-answer">
            <span class="label">Your answer:</span>
            <span class="value ${r.correct ? 'correct-val' : 'wrong-val'}">${r.yourAnswer !== null ? r.options[r.yourAnswer] : 'Not answered'}</span>
          </div>
          <div class="review-answer">
            <span class="label">Correct:</span>
            <span class="value correct-val">${r.options[r.correctIndex]}</span>
          </div>
          <div class="review-explanation">${r.explanation}</div>
        </div>
      `;
      reviewList.appendChild(item);
    });

  } catch (err) {
    console.error('Failed to load results:', err);
  }
}

// ── Animate Counter ────────────────────────────────────
function animateCounter(el, start, end, duration, suffix = '') {
  const startTime = performance.now();
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = `${current}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── Toggle Review Item ─────────────────────────────────
function toggleReview(header) {
  const item = header.parentElement;
  item.classList.toggle('open');
}

// ── Restart Quiz ───────────────────────────────────────
function restartQuiz() {
  sessionId = null;
  currentQuestionIndex = 0;
  totalQuestions = 0;
  answered = false;
  showScreen(welcomeScreen);
}
