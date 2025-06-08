const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;
const directions = { down: 0, left: 1, right: 2, up: 3 };


const playerImage = new Image();
const savedSprite = localStorage.getItem('playerSprite') || 'boy';
playerImage.src = `res/player_${savedSprite}.png`;

const professorImage = new Image();
professorImage.src = "res/professor.png";

const markImage = new Image();
markImage.src = "res/mark.png";

const textboxImage = new Image();
textboxImage.src = "res/text.png";

//포켓몬 위치
const pokemonSpot = {
  x: 714,
  y: 182,
  width: 40,
  height: 40,
  triggered: false
};

//박사, 1스테이지 등등 상호작용 가능한 위치
const stageSpot = {
  START: {  //시작했을 때(박사 위치)
    x: 800,
    y: 55,
    w: 64,
    h: 64
  },
  BEFORE_STAGE: { //첫번째 건물
    x: 264,
    y: 536,
    w: 40,
    h: 40
  },

  CLEAR_1: {  //두번째 건물
    x: 246,
    y: 150,
    w: 40,
    h: 40
  },

  CLEAR_2: {  //마지막 건물
    x: 56,
    y: 278,
    w: 40,
    h: 40
  }
}

let player_loop;
let professor_loop;

let move_loop;


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

const playerName = localStorage.getItem('playerName') || "플레이어";

let textbox = {
  x: 150,
  y: 400,
  width: 700,
  height: 200,
  visible: false,

  index: 0,
  text: [
    `${playerName}야(아), 왔구나!`,
    `이곳은 풀타입 포켓몬이 풍부한 도시란다.`,
    `이곳의 트레이너들도 풀타입 포켓몬을 주로 파트너로 둔다고 하지.`,
    `너가 잃어버린 불타입 포켓몬이 이 도시 어딘가에 있을 거란다.`,
    `챔피언이 되고 싶다면 파란색 건물을 먼저 찾아가보려무나.`
  ]
};

let textbox_check = {
  visible: false,
  index: 0,
  text: [
    '아직 맵에서 포켓몬을 찾지 못했습니다.',
    '이대로 도전하시겠습니까?   yes(e) / no(n)'
  ]
}


const keys = {};
const key_down = e =>{keys[e.key] = true};
const key_up = e => {keys[e.key] = false};

document.addEventListener('keydown', key_down);
document.addEventListener('keyup', key_up);

document.addEventListener("keydown", e => {
  if((e.key == "e") && isInteractable()){
    interact();
  }

  if((e.key == 'e') && textbox.visible){

    if(textbox.index >= textbox.text.length){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPlayer();
      drawProfessor();
      requestAnimationFrame(pro_loop);
      textbox.visible = false;
      sessionStorage.setItem("STAGE", 'BEFORE_STAGE');
    }
  }

  if(textbox_check.visible){

    if(e.key == 'e'){
      if(textbox_check.index >= textbox_check.text.length + 1){
        remove_check();
        challenge();
      }
    }else if(e.key == 'n'){
      if(textbox_check.index >= textbox_check.text.length){
        remove_check();
      }
    }

  }

  if(e.key == 'c'){  //체크용
    console.log("x:",player.x,"y:",player.y);
    console.log(sessionStorage.getItem("STAGE"));
  }

});

function check_stage(){ //포켓몬 없이 도전할 때 진행 여부를 확인하기 위해 텍스트 상자 출력
  cancelAnimationFrame(player_loop);
  textbox_check.visible = true;

  let click = new Audio("res/sound/클릭.mp3");
  click.volume = parseFloat(localStorage.getItem("sfxVolume"));
  click.play();

  ctx.drawImage(
    textboxImage,
    textbox.x, textbox.y,
    textbox.width, textbox.height
    );

  ctx.font = 'italic 13.5pt Arial';
  ctx.fillText(textbox_check.text[textbox_check.index++], textbox.x + 100, textbox.y + 100);
}

function remove_check(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  requestAnimationFrame(gameLoop);
  textbox_check.index = 0;
}

function challenge(){  //합칠 때 게임 로드 하도록 수정
  textbox_check.index = 0;

  switch(sessionStorage.getItem('STAGE')){
  case 'BEFORE_STAGE':
    localStorage.setItem("currentStage", "1");
    // alert("BEFORE_STAGE");
    // sessionStorage.setItem('STAGE', 'CLEAR_1');
    break;

  case "CLEAR_1":
    localStorage.setItem("currentStage", "2");
    // alert("CLEAR_1");
    // sessionStorage.setItem('STAGE', 'CLEAR_2');
    break;

  case "CLEAR_2":
    localStorage.setItem("currentStage", "3");
    // alert("CLEAR_2");
    // sessionStorage.setItem('STAGE', 'CLEAR_3');
    break;
  }

  window.location.href = "WP_10.html";
}

function interact(){
  switch(sessionStorage.getItem("STAGE")){
  case "START":
    cancelAnimationFrame(player_loop);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawProfessor();
    drawBox();
    break;

  case "BEFORE_STAGE":
    if(!sessionStorage.getItem('firepocketmon')){
      check_stage();
    }else{
      challenge();
    }
    break;

  case "CLEAR_1":
    if(!sessionStorage.getItem('firepocketmon')){
      check_stage();
    }else{
      challenge();
    }
    break;

  case "CLEAR_2":
    if(!sessionStorage.getItem('firepocketmon')){
      check_stage();
    }else{
      challenge();
    }
    break;
  }
}


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

function isInteractable(){  //플레이어가 상호작용 가능한 대상을 보고있으면 true 반환
  let x = player.x;
  let y = player.y;
  let width = player.width;
  let height = player.height;
  let zone = stageSpot[sessionStorage.getItem('STAGE')];

  if(zone == undefined) return false;

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
  
  //포켓몬 획득
  if (
  !pokemonSpot.triggered &&
  !textbox.visible &&  // ✅ 대화창이 닫힌 상태
  textbox.index >= textbox.text.length && // ✅ 대사 전부 끝난 상태
  player.x < pokemonSpot.x + pokemonSpot.width &&
  player.x + player.width > pokemonSpot.x &&
  player.y < pokemonSpot.y + pokemonSpot.height &&
  player.y + player.height > pokemonSpot.y
  ) {
    pokemonSpot.triggered = true;
  triggerPokemonCutscene();
  return;
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
  ctx.clearRect(player.x, player.y, player.width, player.height);
  movePlayer();
  drawPlayer();
  player_loop = requestAnimationFrame(gameLoop);      //변수에 대입하도록 수정
}

function drawBox(){
  textbox.visible = true;

  let click = new Audio("res/sound/클릭.mp3");
  click.volume = parseFloat(localStorage.getItem("sfxVolume"));
  click.play();

  ctx.drawImage(
    textboxImage,
    textbox.x, textbox.y,
    textbox.width, textbox.height
    );

  ctx.font = 'italic 13.5pt Arial'; // ✅ 이 줄을 수정하세요
  ctx.fillText(textbox.text[textbox.index++], textbox.x+100, textbox.y+100);
}



function pro_loop(){
  professor_loop = requestAnimationFrame(pro_loop);
  ctx.clearRect(professor.x, professor.y, professor.width, professor.height);
  drawProfessor();
  exit_Professor();
}

function exit_Professor(){
  let moving = false;

  if((professor.x < 870 && professor.y == 55) || (professor.x < 904 && professor.y >= 70)) {
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
    mapData.blockedZones.pop();
    ctx.clearRect(professor.x, professor.y, professor.width, professor.height);
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


professorImage.onload = () => {
  if(sessionStorage.getItem("STAGE") == 'START'){  //박사와 대화하기 전이라면
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
    professor.x + 5, professor.y - 15,
    30, 25
    );
}
};

function moveStage(){
  move_loop = requestAnimationFrame(moveStage);

  if(sessionStorage.getItem('STAGE') == 'CLEAR_1'){
    player.dir = 'down';

    if(player.x == 264 && player.y == 536){
      keys['ArrowRight'] = true;
    }else if(player.x == 314 && player.y == 536){
      keys['ArrowRight'] = false;
      keys['ArrowUp'] = true;
    }else if(player.x == 314 && player.y == 300){
      keys['ArrowUp'] = false;
      keys['ArrowLeft'] = true;
    }else if(player.x == 170 && player.y == 300){
      keys['ArrowLeft'] = false;
      keys['ArrowUp'] = true;
    }else if(player.x == 170 && player.y == 150){
      keys['ArrowUp'] = false;
      keys['ArrowRight'] = true;
    }else if(player.x == 242 && player.y == 150){
      keys['ArrowRight'] = false;
      player.dir = 'up';

      document.addEventListener('keyup', key_up);
      document.addEventListener('keydown', key_down);
      cancelAnimationFrame(move_loop);

      interact();
    }
  }else{
    player.dir = 'down';

    if(player.x == 246 && player.y == 150){
      keys['ArrowLeft'] = true;
    }else if(player.x == 160 && player.y == 150){
      keys['ArrowLeft'] = false;
      keys['ArrowDown'] = true;
    }else if(player.x == 160 && player.y == 294){
      keys['ArrowDown'] = false;
      keys['ArrowLeft'] = true;
    }else if(player.x == 50 && player.y == 294){
      keys['ArrowLeft'] = false;
      player.dir = 'up';

      document.addEventListener('keyup', key_up);
      document.addEventListener('keydown', key_down);
      cancelAnimationFrame(move_loop);

      interact();
    }

  }
}


playerImage.onload = () => {
  const frameWidth = playerImage.width / 3;
  const frameHeight = playerImage.height / 4;
  player.width = frameWidth * 0.7;
  player.height = frameHeight * 0.7;
  console.log("✅ player image loaded", frameWidth, frameHeight);

  requestAnimationFrame(gameLoop);

  switch(sessionStorage.getItem('STAGE')){
  case 'CLEAR_1':
    player.x = 264;
    player.y = 536;
    document.removeEventListener('keyup', key_up);
    document.removeEventListener('keydown', key_down);
    requestAnimationFrame(moveStage);
    break;

  case 'CLEAR_2':
    player.x = 246;
    player.y = 150;
    document.removeEventListener('keyup', key_up);
    document.removeEventListener('keydown', key_down);
    requestAnimationFrame(moveStage);
    break;
  }
  
};

document.addEventListener('DOMContentLoaded', () => { //스테이지 진행 상황에 따른 로드
  if(!sessionStorage.getItem("STAGE")){
    sessionStorage.setItem("STAGE", 'START');
  }
  else{
    switch(localStorage.getItem("currentStage")){
      case "1":
        sessionStorage.setItem("STAGE", 'BEFORE_STAGE');
        break;
      case "2":
        sessionStorage.setItem("STAGE", 'CLEAR_1');
        break;
      case "3":
        sessionStorage.setItem("STAGE", 'CLEAR_2');
        break;
    }
  }
  
  if(sessionStorage.getItem('STAGE') != 'START' && !sessionStorage.getItem("firepocketmon")){
    textbox.index = textbox.text.length;  //포켓몬을 못 얻었으면 얻을 수 있도록 해줌
  }
});

document.addEventListener('DOMContentLoaded', () =>{
  const hoverSound = document.getElementById('hoverSound');
  const clickSound = document.getElementById('clickSound');
  const settingsBtn = document.querySelector('.settings');
  const closeButton = document.querySelector('.modal-close');
  const modal = document.getElementById('settingsModal');
  const sfxSlider = document.getElementById('sfxVolume');

  // 설정된 값으로 볼륨 초기화
  const savedSFX = localStorage.getItem('sfxVolume');

  if (savedSFX) {
    sfxSlider.value = savedSFX;
    hoverSound.volume = parseFloat(savedSFX);
    clickSound.volume = parseFloat(savedSFX);
  }

  //  슬라이더 조정 → 실시간 저장
  sfxSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    hoverSound.volume = vol;
    clickSound.volume = vol;
    localStorage.setItem('sfxVolume', vol);
  });


  // 설정 버튼 hover/click 사운드 + 모달 열기
  if (settingsBtn) {
    settingsBtn.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play();
    });

    settingsBtn.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
      modal.classList.remove('hidden');
    });
  }

  // X 버튼 사운드 + 모달 닫기
  if (closeButton) {
    closeButton.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play();
    });

    closeButton.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
      modal.classList.add('hidden');
    });
  }
});

//포켓몬 컷신신
function triggerPokemonCutscene() {
  if (player_loop !== null) {
    cancelAnimationFrame(player_loop);
    player_loop = null;
  }

  // 기존 BGM 일시정지
  if (typeof bgmAudio !== "undefined" && bgmAudio && !bgmAudio.paused) {
    bgmAudio.pause();
  }

  // 컷신 전용 BGM 재생 
  const specialBGM = new Audio("res/sound/catch_theme.mp3"); // 
  specialBGM.volume = parseFloat(localStorage.getItem("bgmVolume") || 0.3);
  specialBGM.play();

  const mapContainer = document.querySelector('.map-container');

  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at center, #b8f0f0, #226666)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '30px'
  });

  const img = document.createElement('img');
  img.src = 'res/paili.png';
  Object.assign(img.style, {
    width: '200px',
    marginBottom: '80px'
  });

  const speechBoxWrapper = document.createElement('div');
  Object.assign(speechBoxWrapper.style, {
    position: 'relative',
    width: '700px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  });

  const speechBox = document.createElement('img');
  speechBox.src = 'res/text.png';
  Object.assign(speechBox.style, {
    width: '700px',
    height: '200px',
    position: 'absolute',
    top: 0,
    left: 0
  });

  const message = document.createElement('div');
  message.innerHTML = '포켓몬을 찾았다!<br><span style="font-size:18px">▼</span>';
  Object.assign(message.style, {
    position: 'relative',
    zIndex: 1,
    fontSize: '20px',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    lineHeight: '1.5'
  });

  speechBoxWrapper.appendChild(speechBox);
  speechBoxWrapper.appendChild(message);
  overlay.appendChild(img);
  overlay.appendChild(speechBoxWrapper);
  mapContainer.appendChild(overlay);

  const handleKeydown = (e) => {
    if (e.key.toLowerCase() === 'e') {
      const click = new Audio("res/sound/클릭.mp3");
      click.volume = parseFloat(localStorage.getItem("sfxVolume") || 1);
      click.play();

      //  불속성 포켓몬 획득 여부 저장
      sessionStorage.setItem("firepocketmon", "true");

      overlay.remove();
      document.removeEventListener('keydown', handleKeydown);

      //  BGM 다시 재생
      if (typeof bgmAudio !== "undefined" && bgmAudio && bgmAudio.paused) {
        bgmAudio.play();
      }

      if (player_loop !== null) cancelAnimationFrame(player_loop);
      player_loop = requestAnimationFrame(gameLoop);
    }
  };

  document.addEventListener('keydown', handleKeydown);
}
