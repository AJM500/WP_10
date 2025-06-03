const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;
const directions = { down: 0, left: 1, right: 2, up: 3 };


const playerImage = new Image();
playerImage.src = "res/player_boy.png";  // ← 새 파일명

const professorImage = new Image();
professorImage.src = "res/professor.png";

const markImage = new Image();
markImage.src = "res/mark.png";

const textboxImage = new Image();
textboxImage.src = "res/text.png";


let player_loop;
let professor_loop;


let player = {
  x: 0,
  y: 550,
  frame: 1,
  frameTick: 0,
  frameMax: 10,
  dir: 'down',
  speed: 2,
  width: 44,   // 기본값 (132 / 3)
  height: 46   // 기본값 (184 / 4)
};

let professor = {
  x: 800,
  y: 55,
  frame: 1,
  frameTick: 0,
  frameMax: 10,
  dir: 'left',
  speed: 0.5,
  width: 64,        // (192 / 3)
  height: 64,
  zone: undefined
};

let textbox = {
  x: 150,
  y: 400,
  width: 700,
  height: 200,

  visible: false,
  index: 0,
  text: ["대사 1", "대사 2", "대사 3"]
}


const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

$(document).on("keydown", e => {
  if((e.key == "e") && isInteractable()){
    cancelAnimationFrame(player_loop);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawProfessor();
    drawBox();
    let click_sound = new Audio("res/sound/클릭.mp3");
    click_sound.play();
  }

  if((e.key == 'e') && textbox.visible){

    if(textbox.index++ < textbox.text.length){
      let click_sound = new Audio("res/sound/클릭.mp3");
      click_sound.play();
    }else{
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPlayer();
      drawProfessor();
      requestAnimationFrame(pro_loop);
      textbox.visible = false;
    }
  }

});


function isBlocked(x, y, width, height) {
  // hitbox 패딩 설정
  const hitboxPadding = 8;
  const hbX = x + hitboxPadding;
  const hbY = y + hitboxPadding;
  const hbW = width - hitboxPadding * 2;
  const hbH = height - hitboxPadding * 2;

  return mapData.blockedZones.some(zone =>
    hbX < zone.x + zone.w &&
    hbX + hbW > zone.x &&
    hbY < zone.y + zone.h &&
    hbY + hbH > zone.y
  );
}

function isInteractable(){  //플레이어가 오박사를 보고있으면 true 반환
  let x = player.x;
  let y = player.y;
  let width = player.width;
  let height = player.height;
  let zone = professor.zone;

  switch(player.dir){
  case 'up':
    y -= player.speed;
    break;
  case 'down':
    y += player.speed;
    break;

  case 'left':
    x -= player.speed;
    break;

  case 'right':
    x += player.speed;
    break;
  }


  const hitboxPadding = 8;
  const hbX = x + hitboxPadding;
  const hbY = y + hitboxPadding;
  const hbW = width - hitboxPadding * 2;
  const hbH = height - hitboxPadding * 2;

  return (
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
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(player.x, player.y, player.width, player.height);
  movePlayer();
  drawPlayer();
  player_loop = requestAnimationFrame(gameLoop);      //변수에 대입하도록 수정
}

function drawBox(){
  textbox.visible = true;

  ctx.drawImage(
    textboxImage,
    textbox.x, textbox.y,
    textbox.width, textbox.height
    );


  ctx.font = 'italic 38pt Arial';
  ctx.fillText(textbox.text[textbox.index], textbox.x+100, textbox.y+100);
}

function pro_loop(){
  professor_loop = requestAnimationFrame(pro_loop);
  ctx.clearRect(professor.x, professor.y, professor.width, professor.height);
  exit_Professor();
  drawProfessor();
}

function exit_Professor(){
  let moving = false;

  if((professor.x < 870 && professor.y == 55) || (professor.x < 1000 && professor.y >= 70)) {
    professor.x += professor.speed; 
    professor.dir = 'right'; 
    moving = true;
  }
  else if (professor.x >= 870 && professor.y < 70) {
    professor.y += professor.speed; 
    professor.dir = 'down'; 
    moving = true;
  }
  else {
    cancelAnimationFrame(professor_loop);
    requestAnimationFrame(gameLoop);
  }
 
  if (moving) {
    if (professor.frameTick++ > professor.frameMax) {
      professor.frame = (professor.frame + 1) % 3;  // 3프레임
      professor.frameTick = 0;
    }
  } else {
    professor.frame = 1;
    professor.frameTick = 0;
  }
}

function drawProfessor(){
  const directions = { down: 0, left: 1, right: 2, up: 3 };
  const frameWidth = professorImage.width / 3;                 //이미지 파일 내에서 따올 너비
  const frameHeight = professorImage.height / 4;               //높이
  const sx = professor.frame * frameWidth;                     //이미지 파일 내의 x좌표
  const sy = directions[professor.dir] * frameHeight;          //y

  professor.width = frameWidth * 0.8;
  professor.height = frameHeight * 0.8;

  professor.zone.x = professor.x;
  professor.zone.y = professor.y;


  ctx.drawImage(
    professorImage,
    sx, sy, frameWidth, frameHeight,
    professor.x, professor.y,
    professor.width, professor.height
    );
}


professorImage.onload = () =>{
  mapData.blockedZones.push({
    "x": professor.x,
    "y": professor.y,
    "w":professor.width,
    "h":professor.height
  });
  professor.zone = mapData.blockedZones[mapData.blockedZones.length -1];

  drawProfessor();


  ctx.drawImage(  //느낌표 이미지 출력
    markImage,
    professor.x - 5, professor.y - 33,
    60, 50
    );
};


playerImage.onload = () => {
  const frameWidth = playerImage.width / 3;
  const frameHeight = playerImage.height / 4;
  player.width = frameWidth * 0.8;
  player.height = frameHeight * 0.8;
  console.log("✅ player image loaded", frameWidth, frameHeight);
  requestAnimationFrame(gameLoop);
};