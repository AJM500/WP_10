// WP_10.js 완성본 (블럭 깨기 게임, 점수, 체력 상세 주석 구현 및 이미지 커스텀 지원)

// 캔버스 및 그리기 컨텍스트 설정
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 공의 초기 위치와 이동 속도 설정
let x = canvas.width / 2;
let y = canvas.height * 0.6;
let dx = 0;
let dy = 2;
const ballRadius = 10;

// 바(패들)의 설정
const barWidth = 100;
const barHeight = 20;
let barPosX = (canvas.width - barWidth) / 2;
const barPosY = canvas.height - barHeight;
let barMoveSpeed = 10;

// 게임 상태 변수 설정
let lives = 5;
let score = 0;

// 블럭 설정
const blockRowCount = 3;
const blockColumnCount = 5;
const blockWidth = barWidth;
const blockHeight = barHeight;
const blockPadding = 10;
const blockOffsetTop = 50;
const blockOffsetLeft = 30;

// 블럭 배열 생성 및 초기화
const blocks = [];
for (let c = 0; c < blockColumnCount; c++) {
    blocks[c] = [];
    for (let r = 0; r < blockRowCount; r++) {
        blocks[c][r] = {
            x: 0, y: 0,
            hits: r === 0 ? 3 : 1,
            status: 1
        };
    }
}

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
    for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {
            const b = blocks[c][r];
            if (b.status === 1) {
                // 충돌 여부 확인 (공 중심 + 반지름 고려)
                const collided =
                    x + ballRadius > b.x &&
                    x - ballRadius < b.x + blockWidth &&
                    y + ballRadius > b.y &&
                    y - ballRadius < b.y + blockHeight;

                if (collided) {
                    // ✅ 블럭 체력 감소
                    b.hits--;
                    if (b.hits <= 0) {
                        b.status = 0;
                        score += 10;
                    }

                    // ✅ 충돌 방향 판별: 상하 vs 좌우
                    const prevX = x - dx;
                    const prevY = y - dy;

                    const hitFromLeft = prevX + ballRadius <= b.x;
                    const hitFromRight = prevX - ballRadius >= b.x + blockWidth;
                    const hitFromTop = prevY + ballRadius <= b.y;
                    const hitFromBottom = prevY - ballRadius >= b.y + blockHeight;

                    if (hitFromLeft || hitFromRight) {
                        dx = -dx;
                    } else if (hitFromTop || hitFromBottom) {
                        dy = -dy;
                    } else {
                        // fallback: 둘 다 바꿔버리기 (엣지 케이스)
                        dx = -dx;
                        dy = -dy;
                    }

                    return; // 한 블럭만 충돌 처리
                }
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
    for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {
            const block = blocks[c][r];
            if (block.status === 1) {
                const blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
                const blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;
                block.x = blockX;
                block.y = blockY;

                // 블럭 색상 (체력별 구분)
                if (block.hits === 3) {
                    ctx.fillStyle = "#3b82f6"; // 진한 파랑
                } else if (block.hits === 2) {
                    ctx.fillStyle = "#60a5fa"; // 옅은 파랑
                } else {
                    ctx.fillStyle = "#f59e42"; // 주황
                }
                ctx.fillRect(blockX, blockY, blockWidth, blockHeight);

                // 테두리 (옵션)
                ctx.strokeStyle = "#222";
                ctx.strokeRect(blockX, blockY, blockWidth, blockHeight);

                // 체력 숫자 (옵션)
                ctx.fillStyle = "#fff";
                ctx.font = "16px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(block.hits, blockX + blockWidth / 2, blockY + blockHeight / 2);
            }
        }
    }
}
function drawScoreAndLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, canvas.width - 50, 20);

    // 현재 체력 숫자 표시 (나중에 이미지로 교체할 경우 아래 코드 사용)
    ctx.fillText("Lives: " + lives, 40, 20);

    /* 이미지로 체력 표시하는 예시 코드 (나중에 이미지 사용 시 주석 해제)
    for(let i = 0; i < lives; i++) {
        const lifeImage = new Image();
        lifeImage.src = "path_to_life_image.png";
        ctx.drawImage(lifeImage, 10 + (i * 30), 5, 20, 20);
    }
    */
}

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
        x = canvas.width / 2;
        y = canvas.height * 0.6;
        dx = 0;
        dy = 2;
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
    for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {
            if (blocks[c][r].status === 1) {
                return false; // 아직 남은 블럭이 있으면 false
            }
        }
    }
    return true; // 모두 제거됐을 때만 true
}

//일시정지 
let isPaused = false;

document.getElementById("pauseBtn").addEventListener("click", function () {
    isPaused = !isPaused;
    this.textContent = isPaused ? " 다시 시작" : " 일시정지";

    if (!isPaused) {
        requestAnimationFrame(draw); // 다시 시작
    }
});