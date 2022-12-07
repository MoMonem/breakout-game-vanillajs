// UI elements & variables
const rulesBtn = document.getElementById("rules-btn"),
  closeBtn = document.getElementById("close-btn"),
  rules = document.getElementById("rules"),
  canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
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
  brickRowCount = 9,
  brickColCount = 5,
  brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true,
  },
  bricks = [],
  playGameBtn = document.getElementById("play-game-btn"),
  gameResultText = document.getElementById("game-result-text");

let score = 0;

// Event listeners
rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
playGameBtn.addEventListener("click", () => {
  canvas.classList.remove("hide-item");
  playGameBtn.classList.add("hide-item");
  update();
});

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

for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#9b34db" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
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
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
}

// moving game parts
function movePaddle() {
  paddle.x += paddle.dx;
  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
  if (paddle.x < 0) paddle.x = 0;
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

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0)
    ball.dx *= -1;
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0)
    ball.dy *= -1;
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

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
          increaseScore();
        }
      }
    });
  });
  if (ball.y + ball.size > canvas.height) {
    gameLost();
  }
}

function increaseScore() {
  score++;
  if (score % (brickRowCount * brickColCount) === 0) {
    showAllBricks();
  }
}

function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

function gameLost() {
  canvas.classList.add("hide-item");
  playGameBtn.classList.remove("hide-item");
  gameResultText.innerText = "You Lost. Game Over";
  ctx.font = "40px Arial";
  ctx.fillText("Game Over", 200, 300);
}
