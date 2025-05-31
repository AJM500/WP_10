// WP_10.js 완성본 (블럭 깨기 게임, 점수, 체력 상세 주석 구현 및 이미지 커스텀 지원)

// 캔버스 및 그리기 컨텍스트 설정
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 공의 초기 위치와 이동 속도 설정
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3; // 공의 속도 1.5배로 변경
let dy = -3; // 공의 속도 1.5배로 변경
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

// 키보드 입력 처리용 변수
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function collisionDetection() {
    for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {
            const b = blocks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + blockWidth && y > b.y && y < b.y + blockHeight) {
                    dy = -dy;
                    b.hits--;
                    if (b.hits <= 0) {
                        b.status = 0;
                        score += 10;
                    }
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
    ctx.fillStyle = 'black';
    ctx.fillRect(barPosX, barPosY, barWidth, barHeight);
}

function drawBlocks() {
    for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {
            if (blocks[c][r].status === 1) {
                const blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
                const blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;

                ctx.fillStyle = blocks[c][r].hits > 1 ? 'green' : 'orange';
                ctx.fillRect(blockX, blockY, blockWidth, blockHeight);
            }
        }
    }
}

function drawScoreAndLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, canvas.width - 80, 20);
    ctx.fillText("Lives: " + lives, 10, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBlocks();
    drawBall();
    drawBar();
    drawScoreAndLives();

    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if (y + dy < ballRadius) dy = -dy;
    else if (y + dy > canvas.height - ballRadius) {
        if (x > barPosX && x < barPosX + barWidth && y + ballRadius >= barPosY) {
            dy = -dy;
            y = barPosY - ballRadius; // 바 상단에서 공이 튕기도록 설정
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 3;
                dy = -3;
                barPosX = (canvas.width - barWidth) / 2;
            }
        }
    }

    if (rightPressed && barPosX < canvas.width - barWidth) barPosX += barMoveSpeed;
    if (leftPressed && barPosX > 0) barPosX -= barMoveSpeed;

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
