function getRandomTwoDigitNumber() {
  return Math.floor(Math.random() * 90) + 10; // 10 to 99
}

function getRandomTwoDigitNumber() {
  return Math.floor(Math.random() * 90) + 10; // 10 to 99
}

function generateProblem(flashcard, callback) {
  if (!flashcard) return;

  const minuendEl = flashcard.querySelector('.minuend');
  const subtrahendEl = flashcard.querySelector('.subtrahend');
  const answerEl = flashcard.querySelector('.answer');

  if (!minuendEl || !subtrahendEl) return;

  // Step 1: Fade out
  minuendEl.classList.remove('fade-in');
  minuendEl.classList.add('fade-out');

  subtrahendEl.classList.remove('fade-in');
  subtrahendEl.classList.add('fade-out');

  // Step 2: Wait for fade-out animation to finish
  setTimeout(() => {
    const minuend = getRandomTwoDigitNumber();
    const subtrahend = getRandomTwoDigitNumber();
    const larger = Math.max(minuend, subtrahend);
    const smaller = Math.min(minuend, subtrahend);

    flashcard.dataset.answer = larger - smaller;

    minuendEl.textContent = String(larger).padStart(2, ' ');
    subtrahendEl.textContent = String(smaller).padStart(2, ' ');

    // Set answer text but keep it hidden
    if (answerEl) {
      answerEl.textContent = flashcard.dataset.answer;
      answerEl.style.opacity = '0'; // Instantly hide the answer
    }

    // Force reflow to restart animation
    void minuendEl.offsetWidth;
    void subtrahendEl.offsetWidth;

    // Step 3: Fade in
    minuendEl.classList.remove('fade-out');
    minuendEl.classList.add('fade-in');

    subtrahendEl.classList.remove('fade-out');
    subtrahendEl.classList.add('fade-in');

    // Optional: run a callback after animation
    if (callback) callback();

  }, 300); // Match CSS transition duration
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