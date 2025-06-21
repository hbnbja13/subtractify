function getRandomTwoDigitNumber() {
  return Math.floor(Math.random() * 90) + 10; // 10 to 99
}

function formatAnswer(answer) {
  const str = answer.toString();
  if (str.length === 1) {
    return '\u2002' + str; // Single-digit → "x5"
  } else {
    return str; // Two-digits → "42"
  }
}

function generateProblem(flashcard, callback) {
  if (!flashcard) return;

  const minuendEl = flashcard.querySelector('.minuend');
  const subtrahendEl = flashcard.querySelector('.subtrahend');
  const answerEl = flashcard.querySelector('.answer');

  if (!minuendEl || !subtrahendEl) return;

  // Fade out current numbers
  minuendEl.classList.remove('fade-in');
  minuendEl.classList.add('fade-out');

  subtrahendEl.classList.remove('fade-in');
  subtrahendEl.classList.add('fade-out');

  // Wait for fade-out to complete
  setTimeout(() => {
    const minuend = getRandomTwoDigitNumber();
    const subtrahend = getRandomTwoDigitNumber();
    const larger = Math.max(minuend, subtrahend);
    const smaller = Math.min(minuend, subtrahend);
    const answer = larger - smaller;

    // Store actual numeric answer for correctness checks
    flashcard.dataset.answer = answer;

    // Format and display values
    minuendEl.textContent = String(larger).padStart(2, ' ');
    subtrahendEl.textContent = String(smaller).padStart(2, ' ');

    if (answerEl) {
      answerEl.textContent = formatAnswer(answer); // formatted answer here
      answerEl.style.opacity = '0'; // keep hidden initially
    }

    // Force reflow to restart animation
    void minuendEl.offsetWidth;
    void subtrahendEl.offsetWidth;

    // Fade in new numbers
    minuendEl.classList.remove('fade-out');
    minuendEl.classList.add('fade-in');

    subtrahendEl.classList.remove('fade-out');
    subtrahendEl.classList.add('fade-in');

    // Run optional callback after animation
    if (callback) callback();

  }, 300); // match CSS transition duration
}

function toggleAnswer(flashcard) {
  if (!flashcard) return;

  if (!flashcard.dataset.answer) {
    generateProblem(flashcard);
  }

  const answerEl = flashcard.querySelector('.answer');
  if (!answerEl) return;

  // Toggle visibility manually
  if (answerEl.style.opacity === '1') {
    answerEl.style.opacity = '0';
  } else {
    answerEl.style.opacity = '1';
  }
}

// Wait for DOM to load before accessing elements
document.addEventListener('DOMContentLoaded', function () {
  const flashcard = document.getElementById('flashcard');

  if (flashcard) {
    flashcard.addEventListener('click', function () {
      toggleAnswer(flashcard);
    });
  }

  // Handle outside click
  document.body.addEventListener('click', function (event) {
    if (!flashcard) return;

    if (!flashcard.contains(event.target)) {
      generateProblem(flashcard, () => {
        flashcard.classList.remove('show-answer');
      });
    }
  });

  // Generate initial problem
  generateProblem(flashcard);
});