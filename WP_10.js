// WP_10.js 완성본 (블럭 깨기 게임, 점수, 체력 상세 주석 구현 및 이미지 커스텀 지원)

// 캔버스 및 그리기 컨텍스트 설정
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 공의 초기 위치와 이동 속도 설정
let x = canvas.width / 2;
let y = canvas.height * 0.4;
let dx = 0;
let dy = 3;
const ballRadius = 7;


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


let lives = 5;
let score = 0;

//여기에 세팅값에 따른 공 속도 및 스테이지 설정 추가


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
        img.src = "res/gameImage/HP_ball.png";
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

// 설정 버튼 누를 시 일시정지 후 오버레이
$(".settings").on("click", function () {
    togglePause();
});

$(document).on("keydown", function (e) {
    if (!settingsModal.classList.contains('hidden') && (e.key === "Escape" || e.key === "Esc")) {
        settingsModal.classList.add('hidden');
        pauseOverlay.style.display = 'flex';
        return;
    }
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



// 메인 메뉴로 돌아감
$("#mainMenu").on("click", function () {
    window.location.href = "index.html";
});

// 설정 모달 요소 가져오기
const settingsModal = document.getElementById('settingsModal');
const settingBtn = document.getElementById('setting');   // '세팅' 버튼
const modalCloseBtn = document.querySelector('.modal-close');

// 설정 버튼
settingBtn.addEventListener('click', function () {
    pauseOverlay.style.display = 'none'; // 오버레이 숨기고
    settingsModal.classList.remove('hidden'); // 설정창 보이기
});

// 'X' 버튼 클릭 시 설정창 닫기
modalCloseBtn.addEventListener('click', function () {
    settingsModal.classList.add('hidden'); // 설정창 숨기고
    pauseOverlay.style.display = 'flex';   // 오버레이 다시 보이기
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