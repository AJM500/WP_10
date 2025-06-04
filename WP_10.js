// WP_10.js 완성본 (블럭 깨기 게임, 점수, 체력 상세 주석 구현 및 이미지 커스텀 지원)

// 캔버스 및 그리기 컨텍스트 설정
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 공의 초기 위치와 이동 속도 설정
let x = canvas.width / 2;
let y = canvas.height * 0.4;
let dx = 0;
let dy = 3;
const ballRadius = 10;

//블럭 객체
class Block {
    constructor(x, y, hits = 99) {
        this.x = x;         // x좌표
        this.y = y;         // y좌표
        this.width = 32;    // 블럭 너비 (64로 맞춤)
        this.height = 32;   // 블럭 높이
        this.hits = hits;   // 블럭 체력(1~3)
        this.status = 1;    // 살아있으면 1, 깨지면 0
    }
}
// 자유 배치형 blocks 배열 (Block 인스턴스 리스트)
// 자유 배치형 blocks 배열 (Block 인스턴스 리스트)
// 체력(hits)은 원하는 값으로 넣어도 됨 (기본 3으로 지정)
const blocks = [];
// 위쪽 가로줄
for (let x = 0; x <= 1024; x += 32) blocks.push(new Block(x, 0, 100));
// 아래 가로줄
blocks.push(new Block(32, 448, 100));
blocks.push(new Block(64, 448, 100));
blocks.push(new Block(96, 448, 100));
blocks.push(new Block(872, 448, 100));
blocks.push(new Block(904, 448, 100));
blocks.push(new Block(936, 448, 100));
// 왼쪽 세로줄
for (let y = 32; y <= 470; y += 32) blocks.push(new Block(0, y, 100));
// 오른쪽 세로줄
for (let y = 32; y <= 470; y += 32) blocks.push(new Block(968, y, 100));
// 내부 위쪽 가로줄
for (let x = 160; x <= 800; x += 32) blocks.push(new Block(x, 64, 2));
for (let x = 160; x <= 800; x += 96) blocks.push(new Block(x, 128, 2));

// 내부 아래 가로줄
for (let x = 608; x <= 768; x += 32) blocks.push(new Block(x, 384, 2));
for (let x = 224; x <= 384; x += 32) blocks.push(new Block(x, 384, 2));
// 내부 왼쪽 세로줄
for (let y = 64; y <= 384; y += 32) blocks.push(new Block(160, y, 2));
for (let y = 160; y <= 320; y += 32) blocks.push(new Block(300, y, 2));

// 내부 오른쪽 세로줄
for (let y = 64; y <= 384; y += 32) blocks.push(new Block(832, y, 2));
for (let y = 160; y <= 320; y += 32) blocks.push(new Block(684, y, 2));




//공 초기상태 초기화 함수
function ball_init(){
    x = canvas.width / 2;
    y = canvas.height * 0.4;
    dx = 0;
    dy = 3;
}

// 바(패들)의 설정
const barWidth = 100;
const barHeight = 20;
let barPosX = (canvas.width - barWidth) / 2;
const barPosY = canvas.height - barHeight;
let barMoveSpeed = 10;

// 게임 상태 변수 설정
let lives = 5;
let score = 0;





const barImage = new Image();
const blockImage = new Image();
let imagesLoaded = 0;

barImage.src = "https://placehold.co/100x20/orange/white";
blockImage.src = "https://placehold.co/100x20/FF0000/FFFFFF";

// 이미지 로딩 상태 확인 함수
function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        requestAnimationFrame(draw);
    }
}

// 이미지 로딩 실패 시에도 게임 시작
function handleImageError() {
    console.warn("이미지 로딩 실패, 기본 스타일로 진행합니다.");
    requestAnimationFrame(draw);
}

// 이벤트 등록
barImage.onload = checkImagesLoaded;
blockImage.onload = checkImagesLoaded;

barImage.onerror = handleImageError;
blockImage.onerror = handleImageError;

// 이미지 로딩 상태 확인 후 강제로 게임 시작하는 타이머 설정 (5초 후 무조건 실행)
setTimeout(() => {
    if (imagesLoaded < 2) {
        console.warn("이미지 로딩 지연, 강제 게임 시작");
        requestAnimationFrame(draw);
    }
}, 5000);

// 마우스 이동 이벤트

canvas.addEventListener('mousemove', mouseMoveHandler);

function mouseMoveHandler(e) {
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    let nextBarPos = relativeX - barWidth / 2;

    if (nextBarPos < 0) nextBarPos = 0;
    if (nextBarPos > canvas.width - barWidth) nextBarPos = canvas.width - barWidth;
    barPosX = nextBarPos;
}





function collisionDetection() {
    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.status === 1) {
            // 충돌 여부 확인 (공 중심 + 반지름 고려)
            const collided =
                x + ballRadius > b.x &&
                x - ballRadius < b.x + b.width &&
                y + ballRadius > b.y &&
                y - ballRadius < b.y + b.height;

            if (collided) {
                // 블럭 체력 감소
                b.hits--;
                if (b.hits <= 0) {
                    b.status = 0;
                    score += 10;
                }

               // 충돌 방향 판별
                const prevX = x - dx;
                const prevY = y - dy;
                let reversed = false;
                if (prevY + ballRadius <= b.y) { // 위에서 충돌
                    dy = -Math.abs(dy);
                    reversed = true;
                } else if (prevY - ballRadius >= b.y + b.height) { // 아래에서 충돌
                    dy = Math.abs(dy);
                    reversed = true;
                }
                if (prevX + ballRadius <= b.x) { // 왼쪽에서 충돌
                    dx = -Math.abs(dx);
                    reversed = true;
                } else if (prevX - ballRadius >= b.x + b.width) { // 오른쪽에서 충돌
                    dx = Math.abs(dx);
                    reversed = true;
                }
                // 예외처리
                if (!reversed) {
                    dx = -dx;
                    dy = -dy;
                }

                return;
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function drawBar() {
    ctx.drawImage(barImage, barPosX, barPosY, barWidth, barHeight);
}

function drawBlocks() {
    blocks.forEach(block => {
        if (block.status === 1) {
            // 체력별 색상 구분 (3 이상: 검정, 3: 파랑, 2: 옅은파랑, 1: 주황)
            ctx.fillStyle = block.hits >= 3 ? "#222" :
                            block.hits === 2 ? "#60a5fa" : "#f59e42";
            ctx.fillRect(block.x, block.y, block.width, block.height);

            // 테두리
            ctx.strokeStyle = "#222";
            ctx.strokeRect(block.x, block.y, block.width, block.height);

            // 체력 숫자 표시
            ctx.fillStyle = "#fff";
            ctx.font = "18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(block.hits, block.x + block.width / 2, block.y + block.height / 2);
        }
    });
}
function drawScoreAndLives() {
    // 점수표시 : 상단바
    document.querySelector(".score-container").textContent = "Score: " + score;
    // HP 이미지 표시
    const livesDiv = document.querySelector(".lives-container");
    livesDiv.innerHTML = ""; // 초기화
    for (let i = 0; i < lives; i++) {
        const img = document.createElement("img");
        img.src = "res/Health_Point.png";
        img.width = 26;
        img.height = 26;
        img.alt = "체력";
        livesDiv.appendChild(img);
    }
}

let isPaused = false;

////////////////////////////설정관련 함수///////////////////////////////

// 오버레이 show/hide 함수
function showPauseOverlay() {
    $("#pauseOverlay").css("display", "flex");
}
function hidePauseOverlay() {
    $("#pauseOverlay").hide();
}

function togglePause(triggeredByOverlay = false) {
    isPaused = !isPaused;

    if (isPaused) {
        showPauseOverlay();
    } else {
        hidePauseOverlay();
        requestAnimationFrame(draw);
    }
}

$(".settings").on("click", function () {
    togglePause();
});

$(document).on("keydown", function (e) {
    if (isPaused && (e.key === "Escape" || e.key === "Esc")) {
        togglePause(true);
    }
    else if(!isPaused && (e.key === "Escape" || e.key === "Esc")){
        togglePause(false);
    }
});

// 재개하기 버튼
$("#resumeBtn").on("click", function () {
    togglePause(true);
});

// 다시시작 버튼
$("#restartBtn").on("click", function () {
    location.reload();
});

// 설정 버튼
$("#settingBtn").on("click", function () {
    //이후 추가
});

// 메인 메뉴로 돌아감
$("#mainMenu").on("click", function () {
    window.location.href = "index.html";
});

function draw() {
     if (isPaused) return; //일시정지관련

     
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBlocks();
    drawBall();
    drawBar();
    drawScoreAndLives();

    collisionDetection();
    //  바 충돌 조기 처리 (즉시 반응)
    if (
    y + dy > barPosY - ballRadius &&
    x > barPosX &&
    x < barPosX + barWidth &&
    dy > 0
    ) {
    y = barPosY - ballRadius; // 공을 바 위로 올려줌
    const hitPos = (x - (barPosX + barWidth / 2)) / (barWidth / 2);
    const speed = Math.sqrt(dx * dx + dy * dy);
    const angle = hitPos * (Math.PI / 3);

    dx = speed * Math.sin(angle);
    dy = -Math.abs(speed * Math.cos(angle));
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if (y + dy < ballRadius) dy = -dy;
    else if (y + dy > canvas.height - ballRadius) {
    
    lives--;
    if (!lives) {
        alert("GAME OVER");
        document.location.reload();
    } else {
        ball_init();
    }
}

 
    x += dx;
    y += dy;
     if (isAllBlocksCleared()) {
        setTimeout(() => {
            alert("STAGE CLEAR!");
            document.location.reload();
        }, 100);
        return;
    }

    requestAnimationFrame(draw);
}
function isAllBlocksCleared() {
    return blocks.every(block => block.status === 0);
}