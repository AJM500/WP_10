const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 600;
const directions = { down: 0, left: 1, right: 2, up: 3 };


const playerImage = new Image();
playerImage.src = "res/player_boy.png";  // ← 새 파일명

let player = {
  x: 660,
  y: 5,
  frame: 1,
  frameTick: 0,
  frameMax: 10,
  dir: 'down',
  speed: 2,
  width: 44,   // 기본값 (132 / 3)
  height: 46   // 기본값 (184 / 4)
};

const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);


function isBlocked(x, y, width, height) {
  // hitbox 패딩 설정
  const hitboxPadding = 8;
  const hbX = x + hitboxPadding;
  const hbY = y + hitboxPadding;
  const hbW = width - hitboxPadding * 2;
  const hbH = height - hitboxPadding * 2;

  return FiremapData.blockedZones.some(zone =>
    hbX < zone.x + zone.w &&
    hbX + hbW > zone.x &&
    hbY < zone.y + zone.h &&
    hbY + hbH > zone.y
  );
}

function movePlayer() {
  let nextX = player.x;
  let nextY = player.y;
  let moving = false;

  if (keys['ArrowUp']) { nextY -= player.speed; player.dir = 'up'; moving = true; }
  if (keys['ArrowDown']) { nextY += player.speed; player.dir = 'down'; moving = true; }
  if (keys['ArrowLeft']) { nextX -= player.speed; player.dir = 'left'; moving = true; }
  if (keys['ArrowRight']) { nextX += player.speed; player.dir = 'right'; moving = true; }

  if (!isBlocked(nextX, nextY, player.width, player.height)) {
    player.x = nextX;
    player.y = nextY;
  }

  if (moving) {
    if (player.frameTick++ > player.frameMax) {
      player.frame = (player.frame + 1) % 3;  // 3프레임
      player.frameTick = 0;
    }
  } else {
    player.frame = 1;
    player.frameTick = 0;
  }
}

function drawPlayer() {
  const directions = { down: 0, left: 1, right: 2, up: 3 };
  const frameWidth = playerImage.width / 3;
  const frameHeight = playerImage.height / 4;
  const sx = player.frame * frameWidth;
  const sy = directions[player.dir] * frameHeight;

  ctx.drawImage(
    playerImage,
    sx, sy, frameWidth, frameHeight,
    player.x, player.y,
    player.width, player.height
  );
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

playerImage.onload = () => {
  const frameWidth = playerImage.width / 3;
  const frameHeight = playerImage.height / 4;
 player.width = frameWidth * 0.8;
player.height = frameHeight * 0.8;
  console.log("✅ player image loaded", frameWidth, frameHeight);
  requestAnimationFrame(gameLoop);
};


