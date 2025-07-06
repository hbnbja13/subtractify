// --- Problem Generators ---

function getRandomTwoDigitNumber() {
  return Math.floor(Math.random() * 90) + 10; // 10 to 99
}

function generateNormalProblem() {
  let a = getRandomTwoDigitNumber();
  let b = getRandomTwoDigitNumber();
  if (a < b) [a, b] = [b, a]; // Ensure minuend >= subtrahend
  return { minuend: a, subtrahend: b };
}

function generateBorrowProblem() {
  while (true) {
    const tens1 = Math.floor(Math.random() * 9) + 1;
    const tens2 = Math.floor(Math.random() * 9) + 1;
    const onesSubtrahend = Math.floor(Math.random() * 9) + 1;
    const onesMinuend = Math.floor(Math.random() * onesSubtrahend);
    const minuend = tens1 * 10 + onesMinuend;
    const subtrahend = tens2 * 10 + onesSubtrahend;
    // Borrowing: ones(minuend) < ones(subtrahend) AND not negative
    if (onesMinuend < onesSubtrahend && minuend >= subtrahend) {
      return { minuend, subtrahend };
    }
  }
}

function generateNoBorrowProblem() {
  while (true) {
    const tens1 = Math.floor(Math.random() * 9) + 1;
    const tens2 = Math.floor(Math.random() * 9) + 1;
    const onesMinuend = Math.floor(Math.random() * 9) + 1;
    const onesSubtrahend = Math.floor(Math.random() * onesMinuend);
    const minuend = tens1 * 10 + onesMinuend;
    const subtrahend = tens2 * 10 + onesSubtrahend;
    // No borrowing: ones(minuend) > ones(subtrahend) AND not negative
    if (onesMinuend > onesSubtrahend && minuend >= subtrahend) {
      return { minuend, subtrahend };
    }
  }
}

// --- Mode Management ---
let currentMode = 'normal'; // default

function getProblemByMode() {
  if (currentMode === 'borrow') return generateBorrowProblem();
  if (currentMode === 'noborrow') return generateNoBorrowProblem();
  return generateNormalProblem();
}

function formatAnswer(answer) {
  const str = answer.toString();
  if (str.length === 1) {
    return '\u2002' + str; // Single-digit → "x5"
  } else {
    return str; // Two-digits → "42"
  }
}

// --- Flashcard Creation ---

function generateProblem(flashcard, callback) {
  if (!flashcard) return;

  const minuendEl = flashcard.querySelector('.minuend');
  const subtrahendEl = flashcard.querySelector('.subtrahend');
  const answerEl = flashcard.querySelector('.answer');

  if (!minuendEl || !subtrahendEl || !answerEl) return;

  // Fade out current numbers
  minuendEl.classList.remove('fade-in');
  minuendEl.classList.add('fade-out');
  subtrahendEl.classList.remove('fade-in');
  subtrahendEl.classList.add('fade-out');

  // Hide answer and border before resetting content
  answerEl.style.opacity = '0';
  answerEl.classList.remove('revealed');

  setTimeout(() => {
    const { minuend, subtrahend } = getProblemByMode();
    const answer = minuend - subtrahend;

    flashcard.dataset.answer = answer;
    minuendEl.textContent = String(minuend).padStart(2, ' ');
    subtrahendEl.textContent = String(subtrahend).padStart(2, ' ');

    answerEl.textContent = formatAnswer(answer);

    // Animation
    void minuendEl.offsetWidth;
    void subtrahendEl.offsetWidth;

    minuendEl.classList.remove('fade-out');
    minuendEl.classList.add('fade-in');
    subtrahendEl.classList.remove('fade-out');
    subtrahendEl.classList.add('fade-in');

    if (callback) callback();
  }, 300);
}

function toggleAnswer(flashcard) {
  if (!flashcard) return;
  if (!flashcard.dataset.answer) {
    generateProblem(flashcard);
  }
  const answerEl = flashcard.querySelector('.answer');
  if (!answerEl) return;
  if (answerEl.style.opacity === '1') {
    answerEl.style.opacity = '0';
    answerEl.classList.remove('revealed');
  } else {
    answerEl.style.opacity = '1';
    answerEl.classList.add('revealed');
  }
}

function createFlashcard() {
  const flashcard = document.createElement('div');
  flashcard.className = 'flashcard';

  flashcard.innerHTML = `
    <div class="grid">
      <div class="cell1"></div>
      <div class="minuend">__</div>
      <div class="cell3"></div>
      <div class="minus-sign">−</div>
      <div class="subtrahend">__</div>
      <div class="cell6"></div>
      <div class="answer">??</div>
    </div>
  `;

  generateProblem(flashcard);

  // Click toggles answer for this card
  flashcard.addEventListener('click', function (e) {
    e.stopPropagation(); // Avoid triggering body click
    toggleAnswer(flashcard);
  });

  return flashcard;
}

// --- Bootstrapping ---

document.addEventListener('DOMContentLoaded', function () {
  const flashcardsContainer = document.getElementById('flashcards');
  const modeSelect = document.getElementById('mode-select');
  if (!flashcardsContainer) return;

  function regenerateAll() {
    const cards = flashcardsContainer.querySelectorAll('.flashcard');
    cards.forEach(card => {
      generateProblem(card, () => {
        card.classList.remove('show-answer');
      });
    });
  }

  // Create 10 flashcards
  for (let i = 0; i < 10; i++) {
    const card = createFlashcard();
    flashcardsContainer.appendChild(card);
  }

  // Change mode when dropdown changes
  if (modeSelect) {
    modeSelect.addEventListener('change', function () {
      currentMode = this.value;
      regenerateAll();
    });
  }

  // Optional: clicking outside all flashcards refreshes all cards
  document.body.addEventListener('click', function (event) {
    if (!flashcardsContainer.contains(event.target)) {
      regenerateAll();
    }
  });
});
