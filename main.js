const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let gameSpeed = 120;
let dx = 10;
let dy = 0;

document.getElementById("start").addEventListener("click", getStarted);

function getStarted() {
  createFood();
  main();
}

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
];

document.getElementById("restart").addEventListener("click", restartGame);

function restartGame() {
  clearCanvas();
  score = 0;
  document.getElementById("score").innerHTML = score;
  dx = 10;
  dy = 0;
  snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 },
  ];
  drawSnake();
}

document.getElementById("score").innerHTML = score;

// EASY
document.getElementById("easy").addEventListener("click", setEasy);
function setEasy() {
  gameSpeed = 120;
}

// MEADIUM
document.getElementById("medium").addEventListener("click", setMedium);
function setMedium() {
  gameSpeed = 70;
}

// HARD
document.getElementById("hard").addEventListener("click", setHard);
function setHard() {
  gameSpeed = 40;
}

function drawSnakePart(snakePart) {
  ctx.fillStyle = "lightgreen";
  ctx.strokeStyle = "darkgreen";
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function advanceSnake() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy,
  };
  const tail = {
    x: snake[snake.length - 1].x,
    y: snake[snake.length - 1].y,
  };
  snake.unshift(head);
  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    score += 10;
    document.getElementById("score").innerHTML = score;
    createFood();
    playAudioBeep();
  } else {
    snake.pop();
  }
  if (didGameEnd()) {
    snake.push(tail);
    playAudioFail();
  }
}

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.strokStyle = "black";
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function main() {
  if (didGameEnd()) return;

  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();

    main();
  }, gameSpeed);
}
drawSnake();

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

// MOVEMENT FOR MOBILE MOSTLY, USING BOTTONS

document.getElementById("up").addEventListener("click", moveUp);
function moveUp() {
  if (dy !== 10) {
    dx = 0;
    dy = -10;
  }
}

document.getElementById("down").addEventListener("click", moveDown);
function moveDown() {
  if (dy !== -10) {
    dx = 0;
    dy = 10;
  }
}

document.getElementById("right").addEventListener("click", moveRight);
function moveRight() {
  if (dx !== -10) {
    dx = 10;
    dy = 0;
  }
}

document.getElementById("left").addEventListener("click", moveLeft);
function moveLeft() {
  if (dx !== 10) {
    dx = -10;
    dy = 0;
  }
}

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
  foodX = randomTen(0, gameCanvas.width - 10);
  foodY = randomTen(0, gameCanvas.height - 10);
  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY;
    if (foodIsOnSnake) createFood();
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.strokeStyle = "darkred";
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

function didGameEnd() {
  for (let i = 3; i < snake.length; i++) {
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (didCollide) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > gameCanvas.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > gameCanvas.height - 10;

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

//BTN STYLES

const tabItems = document.querySelectorAll(".difficulty-btn");

function selectItem(e) {
  removeActive();
  this.classList.add("active");
}

function removeActive() {
  tabItems.forEach((item) => item.classList.remove("active"));
}

tabItems.forEach((item) => item.addEventListener("click", selectItem));

//AUDIO
function playAudioBeep () {
  let audio = document.querySelector("#beep");
  audio.play();
}

function playAudioFail () {
  let audio = document.querySelector("#fail");
  audio.play();
}