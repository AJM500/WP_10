//볼,바 이미지 선언
window.barImage = new Image();
window.barImage.src = "res/gameImage/Grass_bar.png";
window.ballImage = new Image();
window.ballImage.src = "res/gameImage/Grass_ball.png";
window.bgImageSrc = "res/gameImage/stage1_1.png";
//외곽 블럭 이미지셋 선언
const generalBlockImgs = [
    new Image(),
    new Image(),
    new Image()
];
generalBlockImgs[0].src = "res/gameImage/General_block1.png";
generalBlockImgs[1].src = "res/gameImage/General_block1.png";
generalBlockImgs[2].src = "res/gameImage/General_block2.png";

// [Stage1] grass block 이미지셋 선언 (blockImgs)
const blockImgs = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image()
];
blockImgs[0].src = "res/gameImage/Grass_block1_40.png";
blockImgs[1].src = "res/gameImage/Grass_block1_40.png";
blockImgs[2].src = "res/gameImage/Grass_block2_40.png";
blockImgs[3].src = "res/gameImage/Grass_block2_40.png";
blockImgs[4].src = "res/gameImage/Grass_block3_40.png";
blockImgs[5].src = "res/gameImage/Grass_block3_40.png";
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
        this.width = 40;    // 블럭 너비 (64로 맞춤)
        this.height = 40;   // 블럭 높이
        this.hits = hits;   // 블럭 체력(1~6)
        this.status = 1;    // 살아있으면 1, 깨지면 0
        this.imgIdx = imgIdx; // 내부 블럭만 랜덤 이미지
        this.type = type; // "grass" or "general"
        this.imgSet = imgSet;
    }
}


const blocks = [];

// === [1] 외곽 블럭 (상단만) ===
for (let x = 0; x <= 960; x += 40) {
    blocks.push(new Block(x, 0, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));      // 상단만!
}

// === [2] 외곽 블럭 (좌/우측) ===
for (let y = 40; y < 600; y += 40) {
    blocks.push(new Block(0, y, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));      // 좌측
    blocks.push(new Block(960, y, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));    // 우측
}

// === [3] 내부블럭 ===
for(let x = 460; x <= 490; x += 40)
    blocks.push(new Block(x, 160, 3, Math.floor(Math.random()*3), "grass", blockImgs));

for(let i = 1; i <= 6; i++) {
    blocks.push(new Block(200 + (i-1)*80, 200, i, Math.floor(Math.random()*3), "grass", blockImgs));
}

// window 객체에 할당
window.blocks = blocks;
window.blockImgs = blockImgs;
window.generalBlockImgs = generalBlockImgs;
window.grassBlockImgs = blockImgs;

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
