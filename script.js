function getRandomTwoDigitNumber() {
  return Math.floor(Math.random() * 90) + 10; // 10 to 99
}

function generateProblem(flashcard) {
  const minuend = getRandomTwoDigitNumber();
  const subtrahend = getRandomTwoDigitNumber();
  const larger = Math.max(minuend, subtrahend);
  const smaller = Math.min(minuend, subtrahend);

  flashcard.dataset.answer = larger - smaller;

  flashcard.querySelector('.minuend').textContent = String(larger).padStart(2, ' ');
  flashcard.querySelector('.subtrahend').textContent = String(smaller).padStart(2, ' ');
  flashcard.querySelector('.answer').textContent = flashcard.dataset.answer;

  flashcard.classList.remove('show-answer');
}

function toggleAnswer(flashcard) {
  if (!flashcard.dataset.answer) {
    generateProblem(flashcard);
  }
  flashcard.classList.toggle('show-answer');
}

window.onload = () => generateProblem(document.querySelector('.flashcard'));