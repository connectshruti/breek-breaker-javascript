let board;
let boardHeight = 500;
let boardWidth = 500;
let context;
//player
let playerHeight = 10;
let playerWidth = 80; //
let playerXVelocity = 10;
let player = {
  height: playerHeight,
  width: playerWidth,
  y: boardHeight - playerHeight - 5,
  x: boardWidth / 2 - playerWidth / 2,
  playerVelocity: playerXVelocity,
};
//ball
let ballWidth = 10;
let ballHeight = 10;
let ballX = boardWidth / 2;
let ballY = boardHeight / 2;
let ballXVelocity = 3; //
let ballYVelocity = 2; //
let ball = {
  height: 10,
  width: 10,
  x: ballX,
  y: ballY,
  velocityX: ballXVelocity,
  velocityY: ballYVelocity,
};
//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10; //
let blockColumn = 8;
let blockRow = 3;
let maxRows = 10;
let blockX = 10;
let blockY = 45;
let blockCount = 0;
let gameOver = false;
let score = 0;
window.onload = () => {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");
  requestAnimationFrame(update);
  createBlocks();
  window.addEventListener("keydown", movePlayer);
};
function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.font = "20px Arial";
  context.clearRect(0, 0, boardWidth, boardHeight);
  context.fillStyle = "lightgreen";
  context.fillRect(player.x, player.y, player.width, player.height);
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillStyle = "white";
  context.fillRect(ball.x, ball.y, ball.width, ball.height);
  context.fillStyle = "skyblue";
  context.fillText(score, 10, 30);
  if (topCollision(ball, player) || bottomCollision(ball, player)) {
    ball.velocityY *= -1;
  } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
    ball.velocityX *= -1;
  }
  if (ball.x <= 0 || ball.x + ball.width >= boardWidth) {
    ball.velocityX *= -1;
  }
  if (ball.y <= 0) {
    ball.velocityY *= -1;
  }
  if (ball.y >= boardHeight) {
    gameOver = true;
    context.font = "13px";
    context.fillStyle = "white";
    context.fillText(
      `GAME OVER : Enter space to play again`,
      50,
      boardHeight / 2
    );
  }

  for (var i = 0; i < blockColumn * blockRow; i++) {
    if (blockArray.length > 0 && blockCount == 0) {
      blockRow = Math.min(blockRow + 1, maxRows);
      score += 100 * blockColumn * blockRow;
      createBlocks();
    }
    let block = blockArray[i];
    context.fillStyle = "skyblue";
    if (!block.break) {
      if (topCollision(ball, block) || bottomCollision(ball, block)) {
        ball.velocityY *= -1;
        block.break = true;
      }
      if (leftCollision(ball, block) || rightCollision(ball, block)) {
        ball.velocityX *= -1;
        block.break = true;
      }
      context.fillRect(block.x, block.y, block.width, block.height);
      if (block.break == true) {
        score += 100;
        blockCount -= 1;
      }
    }
  }
}
function ValidPlayerPosition(xPosition) {
  return xPosition < 0 || xPosition + player.width > boardWidth;
}
function movePlayer(e) {
  if (gameOver) {
    if (e.code == "Space") {
      resetGame();
    }
    return;
  }
  if (e.code === "ArrowLeft") {
    let newPlayerX = player.x - playerXVelocity;
    if (!ValidPlayerPosition(newPlayerX)) {
      player.x = newPlayerX;
    }
  } else if (e.code === "ArrowRight") {
    let newPlayerX = player.x + playerXVelocity;
    if (!ValidPlayerPosition(newPlayerX)) {
      player.x = newPlayerX;
    }
  }
}
function detectCollision(a, b) {
  return (
    a.y + a.height > b.y &&
    b.y + b.height > a.y &&
    a.width + a.x > b.x &&
    b.x + b.width > a.x
  );
}
function topCollision(a, b) {
  return detectCollision(a, b) && b.y <= a.y + a.height;
}
function bottomCollision(a, b) {
  return detectCollision(a, b) && b.y + b.height >= a.y;
}
function leftCollision(a, b) {
  return detectCollision(a, b) && a.x + a.width >= b.x;
}
function rightCollision(a, b) {
  return detectCollision(a, b) && b.x + b.width >= a.x;
}
function createBlocks() {
  blockArray = [];
  for (var i = 0; i < blockRow; i++) {
    for (var j = 0; j < blockColumn; j++) {
      let block = {
        width: blockWidth,
        height: blockHeight,
        x: blockX + blockWidth * j + 10 * j,
        y: blockY + blockHeight * i + 10 * i,
        break: false,
      };
      blockArray.push(block);
    }
  }
  blockCount = blockArray.length;
}
function resetGame() {
  gameOver = false;
  score = 0;
  blockRow = 3;
  blockArray = [];
  player = {
    height: playerHeight,
    width: playerWidth,
    y: boardHeight - playerHeight - 5,
    x: boardWidth / 2 - playerWidth / 2,
    playerVelocity: playerXVelocity,
  };
  ball = {
    height: 10,
    width: 10,
    x: ballX,
    y: ballY,
    velocityX: ballXVelocity,
    velocityY: ballYVelocity,
  };
  createBlocks();
}
