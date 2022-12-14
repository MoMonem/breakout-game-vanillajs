// UI elements & variables
const rulesBtn = document.getElementById("rules-btn"),
  closeBtn = document.getElementById("close-btn"),
  rules = document.getElementById("rules"),
  canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  playAgainBtn = document.getElementById("play-again-btn"),
  gameResultText = document.getElementById("game-result-text");

var score = 0,
  gameOver = false;

const brickRowCount = 9,
  brickColCount = 5,
  ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
  },
  paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
  },
  brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true,
  },
  bricks = [];

for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Canvas drawing
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#9b34db";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#9b34db";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function drawBricks() {
  let allBricksDestroyed = true;

  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#9b34db" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });

  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        allBricksDestroyed = false;
      }
    });
  });

  if (allBricksDestroyed) {
    gameWin();
  }
}

// moving game parts
function movePaddle() {
  paddle.x += paddle.dx;
  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
  if (paddle.x < 0) paddle.x = 0;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          score++;
        }
      }
    });
  });

  if (ball.y + ball.size > canvas.height) {
    gameLost();
  }
}

function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

function update() {
  if (!gameOver) {
    movePaddle();
    moveBall();
    draw();
    requestAnimationFrame(update);
  }
}

function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

function gameWin() {
  gameOver = true;
  canvas.classList.add("hide-item");
  gameResultText.innerText = "You win! Your score was: " + score;
  gameResultText.style.display = "block";
  playAgainBtn.classList.remove("hide-item");
}

function gameLost() {
  gameOver = true;
  canvas.classList.add("hide-item");
  gameResultText.innerText = "You lose! Your score was: " + score;
  gameResultText.style.display = "block";
  playAgainBtn.classList.remove("hide-item");
}

// Event listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));
playAgainBtn.addEventListener("click", () => {
  location.reload();
  gameOver = false;
});
window.addEventListener("load", () => {
  gameOver = false;
  update();
});
