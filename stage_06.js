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
        this.width = 25;    // 블럭 너비 (64로 맞춤)
        this.height = 25;   // 블럭 높이
        this.hits = hits;   // 블럭 체력(1~3)
        this.status = 1;    // 살아있으면 1, 깨지면 0
        this.imgIdx = imgIdx; // 내부 블럭만 랜덤 이미지
        this.type = type; // "grass" or "general"
        this.imgSet = imgSet;
    }
}

const blocks = [];

// === [1] 외곽 블럭 (상단만) ===
for (let x = 0; x <= 975; x += 25) {  // 1000 - 25 = 975
    blocks.push(new Block(x, 0, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
}

// === [2] 외곽 블럭 (좌/우측) ===
for (let y = 25; y <= 575; y += 25) { // 600 - 25 = 575
    blocks.push(new Block(0, y, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));     // 좌측
    blocks.push(new Block(975, y, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));   // 우측
}

// === [3] 내부블럭 (이미지 패턴 기반) ===

// [1] 위쪽 general 블럭 
for (let x = 250; x <= 330; x += 25)
    blocks.push(new Block(x, 100, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
for (let x = 450; x <= 530; x += 25)
    blocks.push(new Block(x, 100, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
for (let x = 650; x <= 730; x += 25)
    blocks.push(new Block(x, 100, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));

// [2] 중간 general 블럭 )
for (let x = 350; x <= 430; x += 25)
    blocks.push(new Block(x, 250, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
for (let x = 550; x <= 630; x += 25)
    blocks.push(new Block(x, 250, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));


// [3] 아래쪽 general 블럭
for (let x = 250; x <= 330; x += 25)
    blocks.push(new Block(x, 400, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
for (let x = 650; x <= 730; x += 25)
    blocks.push(new Block(x, 400, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));



// [6] 왼쪽 빨간(용암) grass 블럭 (위)
for (let x = 275; x <= 400; x += 25) {
    blocks.push(new Block(x, 160, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
}

// [7] 오른쪽 빨간(용암) grass 블럭 (위)
for (let x = 575; x <= 700; x += 25) {
    blocks.push(new Block(x, 160, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
}

// [8] 왼쪽 빨간(용암) grass 블럭 (아래)
for (let x = 275; x <= 400; x += 25) {
    blocks.push(new Block(x, 350, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
}

// [9] 오른쪽 빨간(용암) grass 블럭 (아래)
for (let x = 575; x <= 700; x += 25) {
    blocks.push(new Block(x, 350, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
}

for (let x = 150; x <= 230; x += 25) {
    blocks.push(new Block(x, 250, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
}

for (let x = 750; x <= 830; x += 25) {
    blocks.push(new Block(x, 250, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
}

// window 객체에 할당
window.blocks = blocks;
window.blockImgs = blockImgs;
window.generalBlockImgs = generalBlockImgs;

// 모든 이미지 로딩 완료 체크 및 게임 시작 신호
let totalImages = blockImgs.length + generalBlockImgs.length + 2;
let loadedImages = 0;

function checkAllImagesLoaded() {
    loadedImages++;
    
    if (loadedImages === totalImages) {
        window.stageReady = true;
        
        if (window.onStageReady) {
            window.onStageReady();
        }
    }
}

// 모든 이미지에 로딩 이벤트 추가
blockImgs.forEach(img => {
    if (img.complete) {
        checkAllImagesLoaded();
    } else {
        img.onload = checkAllImagesLoaded;
        img.onerror = checkAllImagesLoaded;
    }
});

generalBlockImgs.forEach(img => {
    if (img.complete) {
        checkAllImagesLoaded();
    } else {
        img.onload = checkAllImagesLoaded;
        img.onerror = checkAllImagesLoaded;
    }
});

// 바와 공 이미지 체크
if (window.barImage.complete) {
    checkAllImagesLoaded();
} else {
    window.barImage.onload = checkAllImagesLoaded;
    window.barImage.onerror = checkAllImagesLoaded;
}

if (window.ballImage.complete) {
    checkAllImagesLoaded();
} else {
    window.ballImage.onload = checkAllImagesLoaded;
    window.ballImage.onerror = checkAllImagesLoaded;
}