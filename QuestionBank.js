// Question Bank
const questions = [
  { question: "What does HTTPS stand for?", answer: "HyperText Transfer Protocol Secure" },
  { question: "What is a strong password?", answer: "A mix of letters, numbers, and symbols" },
  { question: "What is phishing?", answer: "Fraudulent attempts to steal sensitive information" },
  { question: "What is a firewall?", answer: "A security system that monitors and controls incoming and outgoing network traffic" },
  { question: "What does VPN stand for?", answer: "Virtual Private Network" },
  { question: "What is two-factor authentication?", answer: "A security process that requires two forms of verification" },
  { question: "What is malware?", answer: "Malicious software designed to damage or disrupt systems" },
  { question: "What does SSL stand for?", answer: "Secure Sockets Layer" },
  { question: "What is encryption?", answer: "The process of converting information into a secure format" },
  { question: "What is a data breach?", answer: "An incident where sensitive data is accessed without authorization" }
];

// Game variables
let isJumping = false;
let isGameOver = false;
let score = 0;
let gameInterval;
const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const scoreElement = document.getElementById('score');
const gameOverText = document.getElementById('gameOverText');
const gameCanvas = document.getElementById('gameCanvas');

// Show time function
function showTime() {
  document.getElementById('currentTime').innerHTML = new Date().toUTCString();
}
showTime();
setInterval(function () {
  showTime();
}, 1000);

// Jumping function
function jump() {
  if (isJumping || isGameOver) return;
  isJumping = true;
  let position = 0;
  const jumpInterval = setInterval(() => {
    if (position >= 150) {
      clearInterval(jumpInterval);
      const fallInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(fallInterval);
          isJumping = false;
        }
        position -= 5;
        dino.style.bottom = position + 'px';
      }, 20);
    }
    position += 5;
    dino.style.bottom = position + 'px';
  }, 20);
}

// Move obstacle
function moveObstacle() {
  let obstaclePosition = 800;

  gameInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(gameInterval);
      return;
    }

    obstaclePosition -= 8;
    if (obstaclePosition < -30) {
      obstaclePosition = 800;
      score++;
      scoreElement.textContent = 'Score: ' + score;
    }

    obstacle.style.right = obstaclePosition + 'px';

    // Check for collision and trigger the quiz
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    if (
      dinoRect.right > obstacleRect.left &&
      dinoRect.left < obstacleRect.right &&
      dinoRect.bottom > obstacleRect.top
    ) {
      askQuestion();  // Trigger the quiz when collision occurs
    }
  }, 20);
}

// Ask Question
function askQuestion() {
  clearInterval(gameInterval);  // Pause the game

  const randomIndex = Math.floor(Math.random() * questions.length);
  const currentQuestion = questions[randomIndex];

  const userAnswer = prompt(currentQuestion.question);

  if (userAnswer === currentQuestion.answer) {
    resumeGame();  // Resume the game if the answer is correct
  } else {
    alert("Wrong answer! Game Over.");
    endGame();  // End the game if the answer is incorrect
  }
}

// Resume game function
function resumeGame() {
  gameInterval = setInterval(moveObstacle, 20);
}

// End game function
function endGame() {
  isGameOver = true;
  gameOverText.classList.remove('hidden');
  obstacle.style.animation = 'none';
}

// Restart game function
function restartGame() {
  if (!isGameOver) return;

  isGameOver = false;
  score = 0;
  scoreElement.textContent = 'Score: ' + score;
  gameOverText.classList.add('hidden');
  dino.style.bottom = '20px';
  obstacle.style.right = '0px';
  moveObstacle();
}

// Event listener for jumping
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (isGameOver) {
      restartGame();
    } else {
      jump();
    }
  }
});

// Start the game
moveObstacle();
