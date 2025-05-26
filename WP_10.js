// WP_10.js

// 캔버스와 2D 컨텍스트 가져오기
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 공의 위치와 반지름 설정
let x = canvas.width / 2; // 공의 최초 위치 x 좌표
let y = canvas.height - 30; // 공의 최초 위치 y 좌표
let dx = 2; // 공의 x축 이동 속도
let dy = -2; // 공의 y축 이동 속도
let ballRadius = 10; // 공의 반지름 크기


// 공 그리기 함수
function drawBall() {
    ctx.beginPath(); // 새로운 경로 시작
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2); // 원 그리기
    ctx.fillStyle = "#FF0000"; // 공의 색상
    ctx.fill(); // 원 채우기
    ctx.closePath(); // 경로 닫기
}

// 프레임마다 실행되는 함수
function draw() {
	//프레임 초기화화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 공 갱신
    drawBall();

    // 공의 위치 갱신
    x += dx;
    y += dy;

    // 다음 프레임 요청
    requestAnimationFrame(draw); 
}

draw(); // 첫 번째 프레임 실행