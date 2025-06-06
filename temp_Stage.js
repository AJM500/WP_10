//볼,바 이미지 선언
window.barImage = new Image();
window.barImage.src = "res/gameImage/Grass_bar.png";
window.ballImage = new Image();
window.ballImage.src = "res/gameImage/Grass_ball.png";
//외곽 블럭 이미지셋 선언
const generalBlockImgs = [
    new Image(),
    new Image(),
    new Image()
];
generalBlockImgs[0].src = "res/gameImage/General_block1_32.png";
generalBlockImgs[1].src = "res/gameImage/General_block2_32.png";
generalBlockImgs[2].src = "res/gameImage/General_block3_32.png";

// [Stage1] grass block 이미지셋 선언 (blockImgs)
const blockImgs = [
    new Image(),
    new Image(),
    new Image()
];
blockImgs[0].src = "res/gameImage/Grass_block1_32.png";
blockImgs[1].src = "res/gameImage/Grass_block2_32.png";
blockImgs[2].src = "res/gameImage/Grass_block3_32.png";
// 게임 시작 플래그 추가 (window 객체 사용으로 전역 공유)
if (typeof window.gameStarted === 'undefined') {
    window.gameStarted = false;
}
//이미지 불러오기전 draw실행 방지
let blockImgsLoaded = 0;
blockImgs.forEach(img => {
    img.onload = () => {
        blockImgsLoaded++;
        if (blockImgsLoaded === blockImgs.length && !window.gameStarted) {
            // 게임이 아직 시작되지 않았을 때만 draw() 시작
            window.gameStarted = true;
            //requestAnimationFrame(draw);
        }
    };
    img.onerror = () => {
        console.error("블럭 이미지 로딩 실패", img.src);
    };
});
//블럭 객체
class Block {
    constructor(x, y, hits = 99,imgIdx = null, type="grass", imgSet = blockImgs) {
        this.x = x;         // x좌표
        this.y = y;         // y좌표
        this.width = 32;    // 블럭 너비 (64로 맞춤)
        this.height = 32;   // 블럭 높이
        this.hits = hits;   // 블럭 체력(1~3)
        this.status = 1;    // 살아있으면 1, 깨지면 0
        this.imgIdx = imgIdx; // 내부 블럭만 랜덤 이미지
        this.type = type; // "grass" or "general"
        this.imgSet = imgSet;
    }
}


// 자유 배치형 blocks 배열 (Block 인스턴스 리스트)
// 자유 배치형 blocks 배열 (Block 인스턴스 리스트)
// 체력(hits)은 원하는 값으로 넣어도 됨 (기본 3으로 지정)
const blocks = [];
// 위쪽 가로줄
for (let x = 0; x <= 1024; x += 32) blocks.push(new Block(x, 0, -1, Math.floor(Math.random() * 3), "general",generalBlockImgs));
// 아래 가로줄
blocks.push(new Block(32, 448, -1, Math.floor(Math.random() * 3), "general",generalBlockImgs));
blocks.push(new Block(64, 448, -1, Math.floor(Math.random() * 3), "general",generalBlockImgs));
blocks.push(new Block(96, 448, -1, Math.floor(Math.random() * 3), "general",generalBlockImgs));
blocks.push(new Block(872, 448, -1, Math.floor(Math.random() * 3), "general",generalBlockImgs));
blocks.push(new Block(904, 448, -1, Math.floor(Math.random() * 3), "general",generalBlockImgs));
blocks.push(new Block(936, 448, -1, Math.floor(Math.random() * 3), "general",generalBlockImgs));
// 왼쪽 세로줄
for (let y = 32; y <= 470; y += 32)  blocks.push(new Block(0, y, -1, Math.floor(Math.random() * 3), "general",generalBlockImgs));
// 오른쪽 세로줄
for (let y = 32; y <= 470; y += 32)   blocks.push(new Block(968, y, -1, Math.floor(Math.random() * 3), "general",generalBlockImgs));
// 내부 위쪽 가로줄
for (let x = 160; x <= 800; x += 32) {
    const hits = Math.floor(Math.random() * 3) + 1; // 1~3
    blocks.push(new Block(x, 64, hits, hits - 1)); // imgIdx = hits-1
}
for (let x = 160; x <= 800; x += 96) {
    const hits = Math.floor(Math.random() * 3) + 1;
    blocks.push(new Block(x, 128, hits, hits - 1));
}
// 내부 아래 가로줄
for (let x = 608; x <= 768; x += 32) {
    const hits = Math.floor(Math.random() * 3) + 1;
    blocks.push(new Block(x, 384, hits, hits - 1));
}
for (let x = 224; x <= 384; x += 32) {
    const hits = Math.floor(Math.random() * 3) + 1;
    blocks.push(new Block(x, 384, hits, hits - 1));
}
// 내부 왼쪽 세로줄
for (let y = 64; y <= 384; y += 32) {
    const hits = Math.floor(Math.random() * 3) + 1;
    blocks.push(new Block(160, y, hits, hits - 1));
}
for (let y = 160; y <= 320; y += 32) {
    const hits = Math.floor(Math.random() * 3) + 1;
    blocks.push(new Block(300, y, hits, hits - 1));
}
// 내부 오른쪽 세로줄
for (let y = 64; y <= 384; y += 32) {
    const hits = Math.floor(Math.random() * 3) + 1;
    blocks.push(new Block(832, y, hits, hits - 1));
}
for (let y = 160; y <= 320; y += 32) {
    const hits = Math.floor(Math.random() * 3) + 1;
    blocks.push(new Block(684, y, hits, hits - 1));
}