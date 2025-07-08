// --- Problem Generators ---

function getRandomTwoDigitNumber() {
  return Math.floor(Math.random() * 90) + 10; // 10 to 99
}

function generateNormalProblem() {
  let a = getRandomTwoDigitNumber();
  let b = getRandomTwoDigitNumber();
  if (a < b) [a, b] = [b, a];
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
    return '\u2002' + str;
  } else {
    return str;
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
  const numCardsInput = document.getElementById('num-cards');
  if (!flashcardsContainer) return;

  // Helper to (re)create n flashcards
  function createNCards(n) {
    flashcardsContainer.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const card = createFlashcard();
      flashcardsContainer.appendChild(card);
    }
  }

  // Helper to update to the current number of cards input by user
  function updateNumCards() {
    let n = parseInt(numCardsInput.value, 10);
    if (isNaN(n) || n < 1) n = 1;
    if (n > 50) n = 50;
    createNCards(n);
  }

  // Keep current cards, but update their problems when mode changes or on global refresh
  // Keep current cards, but update their problems when mode changes or on global refresh
  function regenerateAllProblems() {
    const cards = flashcardsContainer.querySelectorAll('.flashcard');
    cards.forEach(card => {
      generateProblem(card, () => {
        card.classList.remove('show-answer');
      });
    });
  }

  // Initial cards
  updateNumCards();

  // React to mode changes
  if (modeSelect) {
    modeSelect.addEventListener('change', function () {
      currentMode = this.value;
      regenerateAllProblems();
    });
  }

  // React to number input changes (and also on blur for safety)
  if (numCardsInput) {
    numCardsInput.addEventListener('change', updateNumCards);
    numCardsInput.addEventListener('blur', updateNumCards);
  }

  // Optional: clicking outside all flashcards refreshes problems
  document.body.addEventListener('click', function (event) {
    if (!flashcardsContainer.contains(event.target)) {
      regenerateAllProblems();
    }
  });

});