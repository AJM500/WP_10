// WP_10.js 완성본 (블럭 깨기 게임, 점수, 체력 상세 주석 구현 및 이미지 커스텀 지원)

// 게임 시작 플래그 (window 객체 사용으로 전역 공유)
if (typeof window.gameStarted === 'undefined') {
    window.gameStarted = false;
}
// 캔버스 및 그리기 컨텍스트 설정
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// 난이도 변수 불러오기
const difficulty = localStorage.getItem('selectedDifficulty');
let temp_diff;
let diff_var;
console.log("현재 난이도 : %s",difficulty);

// 난이도 별 난이도 변수 설정
switch(difficulty){
    case "easy":
        diff_var = 1;
        break;
    case "normal":
        diff_var = 2;
        break;
    case "hard":
        diff_var = 3;
        break;
    default:
        temp_diff = "easy"
        console.log("임시 난이도 : %s",temp_diff);
        diff_var = 1;
        break;
}

// 공의 초기 위치와 이동 속도 설정
let x = canvas.width / 2;
let y = canvas.height * 0.4;
let dx = 0;
let dy = 0;
const ballRadius = 7;
let ballRotation = 0; // 공의 현재 회전 각도 (라디안)
let ballRotationSpeed = 0; // 공의 회전 속도


//공 초기상태 초기화 함수
function ball_init(){
    x = canvas.width / 2;
    y = canvas.height * 0.4;
    dx = 0;
    dy = diff_var*2;
    ballRotation = 0; 
    ballRotationSpeed = 0; 
}
ball_init();

// 바(패들)의 설정
const barWidth = 100;
const barHeight = 20;
let barPosX = (canvas.width - barWidth) / 2;
const barPosY = canvas.height - barHeight;
let barMoveSpeed = 10;


let lives = 5;
let score = 0;

//여기에 세팅값에 따른 공 속도 및 스테이지 설정 추가



const blockImage = new Image();
let imagesLoaded = 0;


blockImage.src = "https://placehold.co/100x20/FF0000/FFFFFF";

// 이미지 로딩 상태 확인 함수 - gameStarted 플래그 확인 추가
function checkImagesLoaded() {
    imagesLoaded++;
    // temp_Stage.js에서 이미 게임이 시작되었는지 확인
    if (imagesLoaded === 2 && !window.gameStarted) {
        window.gameStarted = true;
        requestAnimationFrame(draw);
    }
}

// 이미지 로딩 실패 시에도 게임 시작 - gameStarted 플래그 확인 추가
function handleImageError() {
    console.warn("이미지 로딩 실패, 기본 스타일로 진행합니다.");
    if (!window.gameStarted) {
        window.gameStarted = true;
        requestAnimationFrame(draw);
    }
}

// 이벤트 등록
barImage.onload = checkImagesLoaded;
blockImage.onload = checkImagesLoaded;

barImage.onerror = handleImageError;
blockImage.onerror = handleImageError;

// 이미지 로딩 상태 확인 후 강제로 게임 시작하는 타이머 설정 (5초 후 무조건 실행)
setTimeout(() => {
    if (imagesLoaded < 2 && !window.gameStarted) {
        console.warn("이미지 로딩 지연, 강제 게임 시작");
        window.gameStarted = true;
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
             if (b.hits !== -1) {   // 체력이 -1이면 깎지마!
             b.hits--;
             if (b.hits <= 0) {
                  b.status = 0;
                 score += 10;
                 }
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

//회전 속도 함수
function updateBallRotation() {
    // dx가 양수면 시계방향, 음수면 반시계방향
    const speed = Math.sqrt(dx * dx + dy * dy); // 공의 전체 속도
    ballRotationSpeed = (dx / ballRadius) * 0.1; // 회전 속도는 수평 속도에 비례
    
    // 회전 각도 업데이트
    ballRotation += ballRotationSpeed;
    
    // 360도(2π) 넘어가면 초기화 (성능 최적화)
    if (ballRotation > Math.PI * 2) {
        ballRotation -= Math.PI * 2;
    } else if (ballRotation < -Math.PI * 2) {
        ballRotation += Math.PI * 2;
    }
}

function drawBall() {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ballRotation);
    if (window.ballImage && window.ballImage.complete && window.ballImage.naturalWidth > 0) {
        ctx.drawImage(window.ballImage, - ballRadius, - ballRadius, ballRadius * 2, ballRadius * 2);
    } else {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.closePath();
    }

    ctx.restore();
}

function drawBar() {
    if (window.barImage && window.barImage.complete && window.barImage.naturalWidth > 0) {
        ctx.drawImage(window.barImage, barPosX, barPosY, barWidth, barHeight);
    } else {
        ctx.fillStyle = "#ffa500";
        ctx.fillRect(barPosX, barPosY, barWidth, barHeight);
    }
}

function drawBlocks() {
    blocks.forEach((block, index) => {
        if (block.status === 1) {
            // 내부 블럭 (Grass): imgSet이 blockImgs
            if (block.imgSet === blockImgs) {
                // [★] hits(1~3)에 맞는 이미지를 매번 동적으로 고름!
                let hitsToIdx = Math.max(0, Math.min(2, block.hits - 1)); // 0,1,2
                const img = block.imgSet[hitsToIdx];
                if (img && img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, block.x, block.y, block.width, block.height);
                } else {
                    ctx.fillStyle = "#FF0000";
                    ctx.fillRect(block.x, block.y, block.width, block.height);
                }
            }
            // 외곽 블럭 (General): imgIdx를 고정적으로 사용
            else if (block.imgSet === generalBlockImgs) {
                const img = block.imgSet[block.imgIdx];
                if (img && img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, block.x, block.y, block.width, block.height);
                } else {
                    ctx.fillStyle = "#222";
                    ctx.fillRect(block.x, block.y, block.width, block.height);
                }
            }
            // 테두리와 숫자 표시는 항상
            ctx.strokeStyle = "#222";
            ctx.strokeRect(block.x, block.y, block.width, block.height);
            ctx.fillStyle = "#fff";
            ctx.font = "18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

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

    updateBallRotation();

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

        ballRotationSpeed += hitPos * 0.2;
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        ballRotationSpeed *= -0.8;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
        ballRotationSpeed *= 0.9;
    }
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