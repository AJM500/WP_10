// WP_10.js 개선 버전 - 설정 버튼 문제 해결

// 게임 시작 플래그 (window 객체 사용으로 전역 공유)
if (typeof window.gameStarted === 'undefined') {
    window.gameStarted = false;
}
//배경이미지 추가
let bgImage = null;
let bgImageLoaded = false;


if (window.bgImageSrc) {
    bgImage = new Image();
    bgImage.src = window.bgImageSrc;
    bgImage.onload = function() {
        console.log("배경 이미지 로드 완료:", bgImage.src);
        bgImageLoaded = true;
    };
    bgImage.onerror = function() {
        console.error("배경 이미지 로딩 실패!", bgImage.src);
         bgImageLoaded = false;
    };
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
let stageTime = 0;

// 게임 상태 리셋 함수
function resetGameState() {
    ball_init();
    barPosX = (canvas.width - barWidth) / 2;
    lives = 6 - diff_var;
    score = 0;
    stageTime = 0;
    console.log("게임 상태 초기화 완료");

    window.stageStartTime = Date.now();
    console.log("⏱ 게임 시작 시각:", window.stageStartTime);
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
        setTimeout(startGameWhenReady, 50);
    }
}

// 초기 게임 시작 체크 (3초 후 시작)
setTimeout(startGameWhenReady, 0);

// 마우스 이동 이벤트
canvas.addEventListener('mousemove', mouseMoveHandler);

function mouseMoveHandler(e) {
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    let nextBarPos = relativeX - barWidth / 2;

    // 바 이동 제한: 외곽 블럭 기준으로 한정
    const leftLimit = 40;
    const rightLimit = canvas.width - 40 - barWidth;

    if (nextBarPos < leftLimit) nextBarPos = leftLimit;
    if (nextBarPos > rightLimit) nextBarPos = rightLimit;

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
            if (b.status === 1) {
                b.hit(); // 🔷 Block의 hit 메소드 호출
                if (b.status === 0) { 
                     score += 10; // 블록이 깨졌으면 점수 추가
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
    
    window.blocks.forEach(block => {
        if (block.status === 1) {
            let imgSet;

            // 내부블럭 타입별 이미지셋 명확히 구분
            if (block.type === "grass" && window.grassBlockImgs) {
                imgSet = window.grassBlockImgs;
            } else if (block.type === "water" && window.waterBlockImgs) {
                imgSet = window.waterBlockImgs;
            } else if (block.type === "fire" && window.fireBlockImgs) {
                imgSet = window.fireBlockImgs;
            } else if (block.type === "general" && window.generalBlockImgs) {
                imgSet = window.generalBlockImgs;
            }

            let img;
            if (block.type !== "general" && imgSet) {
                let hitsToIdx = Math.max(0, Math.min(2, block.hits - 1));
                img = imgSet[hitsToIdx];
            } else if (block.type === "general" && imgSet) {
                img = imgSet[block.imgIdx];
            }

            // 이미지 존재 여부에 따라 렌더링 처리
            if (img && img.complete && img.naturalWidth > 0) {
                ctx.drawImage(img, block.x, block.y, block.width, block.height);
            } else {
                // 기본 색상 처리 (이미지 로딩 실패 대비)
                ctx.fillStyle = {
                    "grass": "#00FF00",
                    "water": "#30a6ff",
                    "fire": "#e44",
                    "general": "#222"
                }[block.type] || "#ccc";

                ctx.fillRect(block.x, block.y, block.width, block.height);
            }

            // 테두리 렌더링
            ctx.strokeStyle = "#222";
            ctx.strokeRect(block.x, block.y, block.width, block.height);
        }
    });
}

let isGameOver = false;

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

// 이걸로 첫 시작 일시정지
let isPaused = true;

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

//배경음악 관련 전역변수 선언
window.bgmStarted = false;
window.bgmAudio = null;

//배경음악 관련 코드 추가
function togglePause(triggeredByOverlay = false) {
  isPaused = !isPaused;

  if (isPaused) {
    showPauseOverlay();
    if (bgmAudio && !bgmAudio.paused) {
      bgmAudio.pause();
    }
  } else {
    hidePauseOverlay();

    // draw 재시작
    requestAnimationFrame(draw);

    // 배경음악도 다시 재생
    if (bgmAudio && bgmAudio.paused) {
      bgmAudio.play().catch(() => {});
    }
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
            localStorage.setItem("Scores", "0");
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


function showBlockMessage(parentBox, msg) {
    // 이미 표시된 메시지가 있다면 제거
    const old = parentBox.querySelector('.block-msg');
    if (old) old.remove();

    // 메시지 요소 생성 및 스타일 지정
    const msgDiv = document.createElement("div");
    msgDiv.innerText = msg;
    msgDiv.className = "block-msg";
    msgDiv.style.margin = "20px 0 0 0";
    msgDiv.style.padding = "16px 32px";
    msgDiv.style.background = "#fffbe8";
    msgDiv.style.border = "1px solid #ffd36e";
    msgDiv.style.borderRadius = "8px";
    msgDiv.style.fontSize = "1.1rem";
    msgDiv.style.color = "#c67c1f";
    msgDiv.style.textAlign = "center";
    msgDiv.style.boxShadow = "0 2px 8px #ffeb99a0";

    parentBox.appendChild(msgDiv);
}
function styleButton(btn, color="#539afc") {
    btn.style.padding = "12px 32px";
    btn.style.margin = "0 0 8px 0";
    btn.style.fontSize = "1.1rem";
    btn.style.border = "none";
    btn.style.borderRadius = "999px";
    btn.style.background = color;
    btn.style.color = "#fff";
    btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
    btn.style.cursor = "pointer";
    btn.style.transition = "background 0.2s, transform 0.2s";
    btn.onmouseover = () => {
        
        btn.style.transform = "translateY(-2px) scale(1.2)";
    };
    btn.onmouseout = () => {
        btn.style.background = color;
        btn.style.transform = "none";
    };
}

showBarSelectMenu();
function showBarSelectMenu() {
     
    // 메뉴 UI 생성
    const menu = document.createElement("div");
    menu.style.position = "absolute";
    menu.style.left = "0";
    menu.style.top = "0";
    menu.style.width = "100vw";
    menu.style.height = "100vh";
    menu.style.background = "rgba(0,0,0,0.6)";
    menu.style.display = "flex";
    menu.style.justifyContent = "center";
    menu.style.alignItems = "center";
    menu.style.zIndex = 9999;

    const box = document.createElement("div");
    box.style.background = "#fff";
    box.style.padding = "30px";
    box.style.borderRadius = "16px";
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.alignItems = "center";
    box.style.gap = "20px";


    box.innerHTML = "<h2>사용할 속성을 선택하세요</h2>";

    function completeSelection() {
        document.body.removeChild(menu);
        
        // 일시정지 해제 (토글이 아닌 직접 false 설정)
        if (typeof isPaused !== 'undefined') {
            isPaused = false;
        }
        
        // 게임 재개
        if (typeof requestAnimationFrame !== 'undefined' && typeof draw === 'function') {
            requestAnimationFrame(draw);
        }
        
        console.log("속성 선택 완료, 게임 재개");
    }

    // basic
    const btnBasic = document.createElement("button");
    btnBasic.innerText = "기본";
    styleButton(btnBasic, "#bdbdbd"); // 회색
    btnBasic.onclick = () => {

        window.barImage.src = "res/gameImage/basic_bar.png";
        window.ballImage.src = "res/gameImage/basic_ball.png";
        completeSelection()
         
        
    };
    box.appendChild(btnBasic);

    // fire
    const btnFire = document.createElement("button");
    if(sessionStorage.getItem('grasspocketmon')){
        btnFire.innerText = "🔥 불 속성";
        styleButton(btngrass, "#fd4949"); // 빨강
    }
    else{
        btnFire.innerText = "🔥 불 속성 (미획득)";
        styleButton(btnFire, "#855555"); // 빨간색
    }
    
    btnFire.onclick = () => {
        if (!sessionStorage.getItem("firepocketmon")){
            showBlockMessage(box, "불 타입 포켓몬이 없습니다");
            return;
        }
        window.barImage.src = "res/gameImage/Fire_bar.png";
        window.ballImage.src = "res/gameImage/Fire_ball.png";
        completeSelection()
        
    };
    box.appendChild(btnFire);

    // grass
    const btngrass = document.createElement("button");
    if(sessionStorage.getItem('grasspocketmon')){
        btngrass.innerText = "🌿 풀 속성";
        styleButton(btngrass, "#38d37a"); // 초록
    }
    else{
        btngrass.innerText = "🌿 풀 속성 (미획득)";
        styleButton(btngrass, "#739c84"); // 초록
    }
    
    btngrass.onclick = () => {
         if(!sessionStorage.getItem('grasspocketmon')){
            showBlockMessage(box, "풀 타입 포켓몬이 없습니다");
            return;
        }
        window.barImage.src = "res/gameImage/Grass_bar.png";
        window.ballImage.src = "res/gameImage/Grass_ball.png";
        completeSelection()
        
    };
    box.appendChild(btngrass);

    const btnwater = document.createElement("button");
    if(sessionStorage.getItem('grasspocketmon')){
        btnwater.innerText = "💧 물 속성";
        styleButton(btnwater, "#45b6ff"); // 파란색
    }
    else{
        btnwater.innerText = "💧 물 속성 (미획득)";
        styleButton(btnwater, "#59819c"); // 파란색
    }
    
    btnwater.onclick = () => {
        if(!sessionStorage.getItem('waterpocketmon')){
            showBlockMessage(box, "물 타입 포켓몬이 없습니다");
            return;
        }
        window.barImage.src = "res/gameImage/Water_bar.png";
        window.ballImage.src = "res/gameImage/Water_ball.png";
        completeSelection()
       
    };
    box.appendChild(btnwater);

    

    menu.appendChild(box);
    document.body.appendChild(menu);
}

function draw() {
   
    if (isPaused || isGameOver) return; //일시정지관련 + 게임 오버 변수 추가
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //배경 이미지 그리기
     if (bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } 

    

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
            //게임 오버 화면 추가
            isGameOver = true;
            showGameOverScreen();
            return; 
        }
        else {
            ball_init();
        }
    }

    x += dx;
    y += dy;
    
    if (isAllBlocksCleared()) {
    setTimeout(() => {
        // 점수 누적
        let totalScore = parseInt(localStorage.getItem("Scores") || "0", 10);
        totalScore += score;
        localStorage.setItem("Scores", totalScore.toString());

        // 시간 누적
        const stageTime = parseInt((Date.now() - window.stageStartTime) / 1000, 10);
        let totalTime = parseInt(localStorage.getItem("TotalClearTime") || "0", 10);
        totalTime += stageTime;
        localStorage.setItem("TotalClearTime", totalTime.toString());

        // 클리어 정보 표시
        document.getElementById("finalScoreText").textContent = `점수: ${score}`;
        document.getElementById("playTimeText").textContent = `플레이시간: ${stageTime}초`;

        // 버튼 변경 조건
        const isLastStage = localStorage.getItem("currentStage") === "3" &&
                            localStorage.getItem("selectedDifficulty") === "hard";

        // 기존 BGM 정지
        if (bgmAudio && !bgmAudio.paused) {
            bgmAudio.pause();
            bgmAudio.currentTime = 0;
        }

        // 클리어 음악 설정
        let clearBGMPath = "res/sound/clear.mp3"; // 기본
        if (isLastStage) {
            clearBGMPath = "res/sound/final_clear.mp3"; // 전체 클리어용
        }

        const clearBGM = new Audio(clearBGMPath);
        clearBGM.volume = parseFloat(localStorage.getItem("bgmVolume") || "0.3");
        clearBGM.play();               

        if (isLastStage) {
            document.querySelector('#showTotalResultBtn').classList.remove('hidden');
            document.querySelector('#stageClearOverlay button[onclick="goToNext()"]').classList.add('hidden');
        }

        // 오버레이 표시
        document.getElementById("stageClearOverlay").classList.remove("hidden");

    }, 100);
    return;
}

    requestAnimationFrame(draw);
}

function goToNext() {
  advanceToNextStageOrDifficulty(); // 기존 함수 호출
}

function isAllBlocksCleared() {
    if (!window.blocks) return false;
    return window.blocks.every(block => block.status === 0 || block.hits === -1);
}

console.log("WP_10.js 로딩 완료");


//게임 오버 관련 함수
function showGameOverScreen() {
    isGameOver = true;

    // 음악 정지
    if (bgmAudio && !bgmAudio.paused) {
        bgmAudio.pause();
    }
    // lives UI 명시적으로 비움
    const livesDiv = document.querySelector(".lives-container");
    if (livesDiv) {
        livesDiv.innerHTML = "";
    }

    document.getElementById('gameOverOverlay').classList.remove('hidden');
}

document.getElementById('retryBtn').addEventListener('click', function () {
    location.reload(); // 재도전
});

document.getElementById('homeBtn').addEventListener('click', function () {
    window.location.href = 'index.html'; // 홈으로
});

//스테이지 별 배경음악
const stage = localStorage.getItem("currentStage") || "1";

const bgmAudio = document.getElementById('bgmAudio');
bgmAudio.src = `res/sound/stage${stage}.mp3`; 
bgmAudio.loop = true;
bgmAudio.volume = parseFloat(localStorage.getItem('bgmVolume') || 0.3);

switch (difficulty) {
    case "easy":   bgmAudio.playbackRate = 1.0; break;
    case "normal": bgmAudio.playbackRate = 1.2; break;
    case "hard":   bgmAudio.playbackRate = 1.4; break;
}

//배경음악 재생
registerUserInteractionForBGM();  

//스테이지 난이도 자동 플레이
function advanceToNextStageOrDifficulty() {
    let stage = parseInt(localStorage.getItem("currentStage") || "1");
    let difficulty = localStorage.getItem("selectedDifficulty") || "easy";

    
    if (stage < 3) {
        let nextStageNum = stage; // 1-based
        let nextStageJs = "";
        if(difficulty == "easy"){
            nextStageJs = `stage_0${nextStageNum}.js`;
        }
        else if(difficulty == "normal"){
            nextStageJs = `stage_0${nextStageNum + 3}.js`;
        }
        else if(difficulty == "hard"){
            nextStageJs = `stage_0${nextStageNum + 6}.js`;
        }
        localStorage.setItem('nextStage', nextStageJs);

        // 스테이지 값 업데이트
        localStorage.setItem("currentStage", (stage + 1).toString());
        
        // 페이지 새로고침으로 다음 스테이지 로드
        //location.reload();
        redirectToMap(difficulty); // 스테이지 클리어 후 맵으로 이동
        return;
    }

    // stage == 3 → 난이도 전환
    switch (difficulty) {
        case "easy":
            difficulty = "normal"; 
            localStorage.setItem("nextStage","stage_03.js");
            break;
        case "normal":
            difficulty = "hard"; 
            localStorage.setItem("nextStage","stage_06.js")
            break;
        case "hard":

            window.location.href = "index.html";
            return;
    }

    localStorage.setItem("selectedDifficulty", difficulty);
    
    localStorage.setItem("currentStage", "1");
    sessionStorage.removeItem("STAGE");

    redirectToMap(difficulty);
}

function redirectToMap(difficulty) {
    switch (difficulty) {
        case "easy":
            window.location.href = "map.html"; break;
        case "normal":
            window.location.href = "watermap.html"; break;
        case "hard":
            window.location.href = "firemap.html"; break;
    }
}


//배경음악 재생 함수
function registerUserInteractionForBGM() {
  function tryStartBGM() {
    if (!window.bgmStarted && bgmAudio) {
      bgmAudio.play().then(() => {
        window.bgmStarted = true;
        console.log("🎵 BGM started");
      }).catch((err) => {
        console.warn("BGM play blocked:", err);
      });
    }
  }

  ['click', 'keydown'].forEach(eventType => {
    document.addEventListener(eventType, tryStartBGM, { once: true });
  });
}



window.setupBGMVolumeSlider = function() {
  // 꼭 DOM이 다 그려진 다음에 호출될 것!
  const bgmAudio = document.getElementById('bgmAudio');
  const bgmVolumeSlider = document.getElementById('bgmVolume');
  if (!bgmAudio || !bgmVolumeSlider) {
    console.log("bgmAudio 또는 bgmVolumeSlider를 찾지 못함!");
    return;
  }
  bgmVolumeSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    bgmAudio.volume = vol;
    localStorage.setItem('bgmVolume', vol);
    // console.log('슬라이더 작동:', vol, bgmAudio.volume);
  });
  // 저장값 반영
  const savedBGM = localStorage.getItem('bgmVolume');
  if (savedBGM !== null) {
    bgmVolumeSlider.value = savedBGM;
    bgmAudio.volume = parseFloat(savedBGM);
  }
}

// 효과음 볼륨 슬라이더 설정
function setupSFXVolumeSlider() {
  const hoverSound = document.getElementById('hoverSound');
  const clickSound = document.getElementById('clickSound');
  const sfxVolumeSlider = document.getElementById('sfxVolume');

  if (!sfxVolumeSlider || !hoverSound || !clickSound) {
    console.warn("효과음 요소 또는 슬라이더 누락");
    return;
  }

  sfxVolumeSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    hoverSound.volume = vol;
    clickSound.volume = vol;
    localStorage.setItem('sfxVolume', vol);
  });

  const savedSFX = localStorage.getItem('sfxVolume');
  if (savedSFX !== null) {
    sfxVolumeSlider.value = savedSFX;
    hoverSound.volume = parseFloat(savedSFX);
    clickSound.volume = parseFloat(savedSFX);
  }
}

// 버튼 사운드 효과 (hover / click)
function setupButtonSoundEffects() {
  const hoverSound = document.getElementById('hoverSound');
  const clickSound = document.getElementById('clickSound');

  const buttonIds = [
    "resumeBtn", "restartBtn", "setting", "mainMenu",
    "settingBtn", "modalClose"
  ];

  buttonIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`❌ [사운드 이벤트] ${id} 요소 없음`);
      return;
    }

    el.addEventListener('mouseenter', () => {
      console.log(`🟡 [hover] ${id}`);
      if (hoverSound) {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(err => console.warn(`hoverSound 실패: ${err}`));
      }
    });

    el.addEventListener('click', () => {
      console.log(`🔵 [click] ${id}`);
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => console.warn(`clickSound 실패: ${err}`));
      }

      if (id === "modalClose") {
        closeSettings();
      }
    });
  });
}

function closeSettings() {
  document.getElementById('settingsModal').classList.add('hidden');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupBGMVolumeSlider();
    setupSFXVolumeSlider();
    setupButtonSoundEffects();
  });
} else {
  setupBGMVolumeSlider();
  setupSFXVolumeSlider();
  setupButtonSoundEffects();
}

// 다음 상대 버튼 클릭
const nextStageBtn = document.getElementById("nextStageBtn");
if (nextStageBtn) {
  nextStageBtn.addEventListener("click", () => {
    advanceToNextStageOrDifficulty();
  });
}

// 나의 플레이 버튼 클릭
const showTotalBtn = document.getElementById("showTotalResultBtn");
if (showTotalBtn) {
  showTotalBtn.addEventListener("click", () => {
    const totalScore = localStorage.getItem("Scores") || "0";
    const totalTime = localStorage.getItem("TotalClearTime") || "0";

    document.getElementById("totalScoreText").textContent = `총 점수: ${totalScore}`;
    document.getElementById("totalTimeText").textContent = `총 플레이 시간: ${totalTime}초`;

    document.getElementById("stageClearOverlay").classList.add("hidden");
    document.getElementById("totalResultOverlay").classList.remove("hidden");

    const finalMusic = new Audio("res/sound/final_theme.mp3");
    finalMusic.volume = parseFloat(localStorage.getItem("bgmVolume") || 0.3);
    finalMusic.play().catch(console.warn);
  });
}


//강제 트리거 코드
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'k') {
    console.log("⚡ 강제 클리어 트리거됨");

    setTimeout(() => {
        // 점수 누적
        let totalScore = parseInt(localStorage.getItem("Scores") || "0", 10);
        totalScore += score;
        localStorage.setItem("Scores", totalScore.toString());

        // 시간 누적
        const stageTime = parseInt((Date.now() - window.stageStartTime) / 1000, 10);
        let totalTime = parseInt(localStorage.getItem("TotalClearTime") || "0", 10);
        totalTime += stageTime;
        localStorage.setItem("TotalClearTime", totalTime.toString());

        // 클리어 정보 표시
        document.getElementById("finalScoreText").textContent = `점수: ${score}`;
        document.getElementById("playTimeText").textContent = `플레이시간: ${stageTime}초`;

        // 버튼 변경 조건
        const isLastStage = localStorage.getItem("currentStage") === "3" &&
                            localStorage.getItem("currentDifficulty") === "hard";

        // 기존 BGM 정지
        if (bgmAudio && !bgmAudio.paused) {
            bgmAudio.pause();
            bgmAudio.currentTime = 0;
        }

        // 클리어 음악 설정
        let clearBGMPath = "res/sound/clear.mp3"; // 기본
        if (isLastStage) {
            clearBGMPath = "res/sound/final_clear.mp3"; // 전체 클리어용
        }

        const clearBGM = new Audio(clearBGMPath);
        clearBGM.volume = parseFloat(localStorage.getItem("bgmVolume") || "0.3");
        clearBGM.play();               

        if (isLastStage) {
            document.querySelector('#showTotalResultBtn').classList.remove('hidden');
            document.querySelector('#stageClearOverlay button[onclick="goToNext()"]').classList.add('hidden');
        }

        // 오버레이 표시
        document.getElementById("stageClearOverlay").classList.remove("hidden");

    }, 100);
    return;
  }
});