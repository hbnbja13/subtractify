function getRandomTwoDigitNumber() {
  return Math.floor(Math.random() * 90) + 10; // 10 to 99
}

function generateProblem(flashcard) {
  if (!flashcard) return;

  const minuend = getRandomTwoDigitNumber();
  const subtrahend = getRandomTwoDigitNumber();
  const larger = Math.max(minuend, subtrahend);
  const smaller = Math.min(minuend, subtrahend);

  flashcard.dataset.answer = larger - smaller;

  const minuendEl = flashcard.querySelector('.minuend');
  const subtrahendEl = flashcard.querySelector('.subtrahend');
  const answerEl = flashcard.querySelector('.answer');

  if (minuendEl) minuendEl.textContent = String(larger).padStart(2, ' ');
  if (subtrahendEl) subtrahendEl.textContent = String(smaller).padStart(2, ' ');
  if (answerEl) answerEl.textContent = flashcard.dataset.answer;

  flashcard.classList.remove('show-answer');
}

function toggleAnswer(flashcard) {
  if (!flashcard) return;
  if (!flashcard.dataset.answer) {
    generateProblem(flashcard);
  }
  flashcard.classList.toggle('show-answer');
}

// Wait for DOM to load before accessing elements
document.addEventListener('DOMContentLoaded', function () {
  const flashcard = document.getElementById('flashcard');

  // Attach click handler to flashcard
  if (flashcard) {
    flashcard.addEventListener('click', function () {
      toggleAnswer(flashcard);
    });
  }

  // Handle outside click
  document.body.addEventListener('click', function (event) {
    if (!flashcard || !flashcard.contains(event.target)) {
      generateProblem(flashcard);
      flashcard.classList.remove('show-answer');
    }
  });

  // Generate initial problem
  generateProblem(flashcard);
});