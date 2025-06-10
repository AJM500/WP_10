window.bgImageSrc = "res/gameImage/stage1_1.png";
window.barImage = new Image();
window.ballImage = new Image();


// 안내 메시지 박스 표시 함수


//외곽 블럭 이미지셋 선언
const generalBlockImgs = [
    new Image(),
    new Image(),
    new Image()
];
generalBlockImgs[0].src = "res/gameImage/General_block1.png";
generalBlockImgs[1].src = "res/gameImage/General_block2.png";
generalBlockImgs[2].src = "res/gameImage/General_block3.png";

// [Stage1] grass block 이미지셋 선언 (blockImgs)
const blockImgs = [
    new Image(),
    new Image(),
    new Image()
];
blockImgs[0].src = "res/gameImage/Grass_block1_40.png";
blockImgs[1].src = "res/gameImage/Grass_block2_40.png";
blockImgs[2].src = "res/gameImage/Grass_block3_40.png";
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
        this.hits = hits;   // 블럭 체력(1~3)
        this.status = 1;    // 살아있으면 1, 깨지면 0
        this.imgIdx = imgIdx; // 내부 블럭만 랜덤 이미지
        this.type = type; // "grass" or "general"
        this.imgSet = imgSet;
    }
}
// 바 이미지 파일명으로 바의 속성 판단
function getBarType() {
    const src = window.barImage.src;
    if (src.includes("Fire_bar")) return "Fire";
    if (src.includes("Grass_bar")) return "Grass";
    if (src.includes("Water_bar")) return "Water";
    return "Basic";
}

// 데미지 계산 함수
function calculateDamage(barType, blockType) {
    const damageChart = {
        Basic: { grass: 1, fire: 1, water: 1 },
        Fire: { grass: 3, fire: 2, water: 1 },
        Grass: { water: 3, grass: 2, fire: 1 },
        Water: { fire: 3, water: 2, grass: 1 }
    };
    return damageChart[barType][blockType] || 1;
}

// Block 클래스에 hit 메소드 추가 (prototype 방식)
Block.prototype.hit = function() {
    const barType = getBarType();
    const damage = calculateDamage(barType, this.type);
    if (this.hits > 0) {  // 무한 블록(hits=-1)은 부서지지 않음
        this.hits -= damage;
        if (this.hits <= 0) {
            this.status = 0; // 블록 파괴됨
        }
    }
};




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
for(let x = 300; x <= 620; x += 40)
    blocks.push(new Block(x, 160, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
for(let x = 140; x <= 260; x += 40)
    blocks.push(new Block(x, 200, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
for(let x = 660; x <= 780; x += 40)
    blocks.push(new Block(x, 200, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));


for(let x = 140; x <= 260; x += 40)
    blocks.push(new Block(x, 350, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
for(let x = 660; x <= 780; x += 40)
    blocks.push(new Block(x, 350, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));

for(let x = 300; x <= 400; x += 80)
    blocks.push(new Block(x, 310, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
for(let x = 550; x <= 650; x += 80)
    blocks.push(new Block(x, 310, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));

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