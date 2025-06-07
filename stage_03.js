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

const blocks = [];

// === [1] 외곽 블럭 (상단만) ===
for (let x = 0; x <= 992; x += 32) {
    blocks.push(new Block(x, 0, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
}

// === [2] 외곽 블럭 (좌/우측) ===
for (let y = 32; y <= 576; y += 32) {
    blocks.push(new Block(0, y, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));    // 좌측
    blocks.push(new Block(968, y, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));  // 우측
}

// === [3] 내부블럭 ===

// [1] 네 귀퉁이와 중앙 general 블럭
blocks.push(new Block(160, 80,  -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(800, 80,  -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(160, 400, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(800, 400, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(160, 240, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(800, 240, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));



// 왼쪽 날개 
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5 ; col++) {
        const x = 160 + col * 32 + row * 32;
        const y = 140 + row * 32;
        blocks.push(new Block(x, y, 2, Math.floor(Math.random()*3), "grass", blockImgs));
    }
}

// 오른쪽 날개 
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5 ; col++) {
        const x = 660 + col * 32 - row * 32;
        const y = 140 + row * 32;
        blocks.push(new Block(x, y, 2, Math.floor(Math.random()*3), "grass", blockImgs));
    }
}

// 아래 왼쪽 날개 
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5 ; col++) {
        const x = 160 + col * 32 + row * 32;
        const y = 300 + row * 32;
        blocks.push(new Block(x, y, 2, Math.floor(Math.random()*3), "grass", blockImgs));
    }
}

// 아래 오른쪽 날개
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5 ; col++) {
        const x = 660 + col * 32 - row * 32;
        const y = 300 + row * 32;
        blocks.push(new Block(x, y, 2, Math.floor(Math.random()*3), "grass", blockImgs));
    }
}