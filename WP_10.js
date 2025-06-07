// WP_10.js 개선 버전 - 설정 버튼 문제 해결

// 게임 시작 플래그 (window 객체 사용으로 전역 공유)
if (typeof window.gameStarted === 'undefined') {
    window.gameStarted = false;
}

// 캔버스 및 그리기 컨텍스트 설정
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 난이도 변수 불러오기
const difficulty = localStorage.getItem('selectedDifficulty') || 'easy';
let temp_diff;
let diff_var;
console.log("현재 난이도 : %s", difficulty);

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
        console.log("임시 난이도 : %s", temp_diff);
        diff_var = 1;
        break;
}

// 공의 초기 위치와 이동 속도 설정
let x = canvas.width / 2;
let y = canvas.height * 0.4;
let dx = 0;
let dy = 0;
const ballRadius = 7;
let ballRotation = 0;
let ballRotationSpeed = 0;

// 공 초기상태 초기화 함수
function ball_init(){
    x = canvas.width / 2;
    y = canvas.height * 0.4;
    dx = 0;
    dy = diff_var * 2;
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

// 게임 상태 리셋 함수
function resetGameState() {
    ball_init();
    barPosX = (canvas.width - barWidth) / 2;
    lives = 6 - diff_var;
    score = 0;
    console.log("게임 상태 초기화 완료");
}

// 스테이지 준비 완료 콜백
window.onStageReady = function() {
    console.log("스테이지 준비 완료! 게임 시작");
    resetGameState();
    
    if (!window.gameStarted) {
        window.gameStarted = true;
        requestAnimationFrame(draw);
    }
};

// 게임 시작 준비 확인 (백업 방법)
function startGameWhenReady() {
    const imagesReady = window.barImage && window.ballImage;
    const blocksReady = window.blocks && window.blocks.length > 0;
    const stageReady = window.stageReady;
    
    console.log("로딩 상태 체크:", {
        imagesReady,
        blocksReady,
        stageReady,
        gameStarted: window.gameStarted
    });
    
    if (imagesReady && blocksReady && stageReady && !window.gameStarted) {
        console.log("모든 리소스 로딩 완료, 게임 시작");
        resetGameState();
        window.gameStarted = true;
        requestAnimationFrame(draw);
    } else if (!window.gameStarted) {
        // 500ms 후 다시 확인 (더 여유있게)
        setTimeout(startGameWhenReady, 500);
    }
}

// 초기 게임 시작 체크 (3초 후 시작)
setTimeout(startGameWhenReady, 1000);

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
    if (!window.blocks) return;
    
    for (let i = 0; i < window.blocks.length; i++) {
        const b = window.blocks[i];
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

// 회전 속도 함수
function updateBallRotation() {
    const speed = Math.sqrt(dx * dx + dy * dy);
    ballRotationSpeed = (dx / ballRadius) * 0.1;
    
    ballRotation += ballRotationSpeed;
    
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
        ctx.drawImage(window.ballImage, -ballRadius, -ballRadius, ballRadius * 2, ballRadius * 2);
    } else {
        ctx.beginPath();
        ctx.arc(0, 0, ballRadius, 0, Math.PI * 2);
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
    if (!window.blocks) return;
    
    window.blocks.forEach((block, index) => {
        if (block.status === 1) {
            // 내부 블럭 (Grass): imgSet 확인
            if (block.type === "grass" && window.blockImgs) {
                let hitsToIdx = Math.max(0, Math.min(2, block.hits - 1));
                const img = window.blockImgs[hitsToIdx];
                if (img && img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, block.x, block.y, block.width, block.height);
                } else {
                    ctx.fillStyle = "#00FF00";
                    ctx.fillRect(block.x, block.y, block.width, block.height);
                }
            }
            // 외곽 블럭 (General)
            else if (block.type === "general" && window.generalBlockImgs) {
                const img = window.generalBlockImgs[block.imgIdx];
                if (img && img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, block.x, block.y, block.width, block.height);
                } else {
                    ctx.fillStyle = "#222";
                    ctx.fillRect(block.x, block.y, block.width, block.height);
                }
            } else {
                // 기본 색상
                ctx.fillStyle = block.type === "grass" ? "#00FF00" : "#222";
                ctx.fillRect(block.x, block.y, block.width, block.height);
            }
            
            // 테두리
            ctx.strokeStyle = "#222";
            ctx.strokeRect(block.x, block.y, block.width, block.height);
        }
    });
}

function drawScoreAndLives() {
    // 점수표시 : 상단바
    const scoreContainer = document.querySelector(".score-container");
    if (scoreContainer) {
        scoreContainer.textContent = "Score: " + score;
    }
    
    // HP 이미지 표시
    const livesDiv = document.querySelector(".lives-container");
    if (livesDiv) {
        livesDiv.innerHTML = "";
        for (let i = 0; i < lives; i++) {
            const img = document.createElement("img");
            img.src = "res/gameImage/HP_ball.png";
            img.width = 26;
            img.height = 26;
            img.alt = "체력";
            livesDiv.appendChild(img);
        }
    }
}

let isPaused = false;

// 오버레이 show/hide 함수
function showPauseOverlay() {
    const overlay = document.getElementById("pauseOverlay");
    if (overlay) overlay.style.display = "flex";
}

function hidePauseOverlay() {
    const overlay = document.getElementById("pauseOverlay");
    if (overlay) overlay.style.display = "none";
}

// 설정 모달 show/hide 함수
function showSettingsModal() {
    console.log("설정 모달 표시");
    const settingsModal = document.getElementById("settingsModal");
    if (settingsModal) {
        settingsModal.classList.remove('hidden');
        hidePauseOverlay(); // pause overlay 숨기기
    } else {
        console.log("설정 모달을 찾을 수 없음");
    }
}

function hideSettingsModal() {
    console.log("설정 모달 숨기기");
    const settingsModal = document.getElementById("settingsModal");
    if (settingsModal) {
        settingsModal.classList.add('hidden');
        showPauseOverlay(); // pause overlay 다시 표시
    } else {
        console.log("설정 모달을 찾을 수 없음");
    }
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

// 이벤트 리스너 등록 함수 - DOM 상태에 관계없이 작동
function setupEventListeners() {
    console.log("이벤트 리스너 설정 시작");

    // 설정 버튼
    const settingsBtn = document.querySelector(".settings");
    if (settingsBtn) {
        console.log("설정 버튼 찾음, 이벤트 리스너 추가");
        settingsBtn.addEventListener("click", function() {
            console.log("설정 버튼 클릭됨");
            togglePause();
        });
    } else {
        console.log("설정 버튼을 찾을 수 없음");
    }

    // 재개하기 버튼
    const resumeBtn = document.getElementById("resumeBtn");
    if (resumeBtn) {
        console.log("재개 버튼 찾음, 이벤트 리스너 추가");
        resumeBtn.addEventListener("click", function() {
            console.log("재개 버튼 클릭됨");
            togglePause(true);
        });
    } else {
        console.log("재개 버튼을 찾을 수 없음");
    }

    // 다시시작 버튼
    const restartBtn = document.getElementById("restartBtn");
    if (restartBtn) {
        console.log("다시시작 버튼 찾음, 이벤트 리스너 추가");
        restartBtn.addEventListener("click", function() {
            console.log("다시시작 버튼 클릭됨");
            location.reload();
        });
    } else {
        console.log("다시시작 버튼을 찾을 수 없음");
    }

    // 메인 메뉴 버튼
    const mainMenuBtn = document.getElementById("mainMenu");
    if (mainMenuBtn) {
        console.log("메인메뉴 버튼 찾음, 이벤트 리스너 추가");
        mainMenuBtn.addEventListener("click", function() {
            console.log("메인메뉴 버튼 클릭됨");
            window.location.href = "index.html";
        });
    } else {
        console.log("메인메뉴 버튼을 찾을 수 없음");
    }

    // 세팅 버튼 (pause overlay 내부의 세팅 버튼)
    const settingBtn = document.getElementById("setting");
    if (settingBtn) {
        console.log("세팅 버튼 찾음, 이벤트 리스너 추가");
        settingBtn.addEventListener("click", function() {
            console.log("세팅 버튼 클릭됨");
            showSettingsModal();
        });
    } else {
        console.log("세팅 버튼을 찾을 수 없음");
    }

    // 설정 모달 닫기 버튼
    const modalClose = document.querySelector(".modal-close");
    if (modalClose) {
        console.log("모달 닫기 버튼 찾음, 이벤트 리스너 추가");
        modalClose.addEventListener("click", function() {
            console.log("모달 닫기 버튼 클릭됨");
            hideSettingsModal();
        });
    } else {
        console.log("모달 닫기 버튼을 찾을 수 없음");
    }
}

// DOM 상태 확인 후 이벤트 리스너 설정
function initEventListeners() {
    if (document.readyState === 'loading') {
        // 아직 로딩 중이면 DOMContentLoaded 대기
        document.addEventListener('DOMContentLoaded', setupEventListeners);
    } else {
        // 이미 로딩 완료된 경우 바로 실행
        setupEventListeners();
    }
}

// 이벤트 리스너 초기화 호출
initEventListeners();

// ESC 키 이벤트 (document에 바로 추가)
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        console.log("ESC 키 눌림");
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal && !settingsModal.classList.contains('hidden')) {
            console.log("설정 모달이 열려있음, 닫기");
            hideSettingsModal();
            return;
        }
        console.log("일반 pause 토글");
        togglePause();
    }
});

function draw() {
    if (isPaused) {
        console.log("게임이 일시정지 상태입니다");
        return;
    }
     
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBlocks();
    updateBallRotation();
    drawBall();
    drawBar();
    drawScoreAndLives();

    collisionDetection();
    
    // 바 충돌 조기 처리
    if (
        y + dy > barPosY - ballRadius &&
        x > barPosX &&
        x < barPosX + barWidth &&
        dy > 0
    ) {
        y = barPosY - ballRadius;
        const hitPos = (x - (barPosX + barWidth / 2)) / (barWidth / 2);
        const speed = Math.sqrt(dx * dx + dy * dy);
        const angle = hitPos * (Math.PI / 3);

        dx = speed * Math.sin(angle);
        dy = -Math.abs(speed * Math.cos(angle));

        ballRotationSpeed += hitPos * 0.2;
    }

    // 벽 충돌
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
    if (!window.blocks) return false;
    return window.blocks.every(block => block.status === 0 || block.hits === -1);
}

console.log("WP_10.js 로딩 완료");