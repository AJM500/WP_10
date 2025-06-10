window.bgImageSrc = "res/gameImage/stage3_3.png";
window.barImage = new Image();
window.ballImage = new Image();


// 안내 메시지 박스 표시 함수
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

    // basic
    const btnBasic = document.createElement("button");
    btnBasic.innerText = "기본";
    styleButton(btnBasic, "#bdbdbd"); // 회색
    btnBasic.onclick = () => {
        window.barImage.src = "res/gameImage/basic_bar.png";
        window.ballImage.src = "res/gameImage/basic_ball.png";
        document.body.removeChild(menu);
         
        
    };
    box.appendChild(btnBasic);

    // fire
    const btnFire = document.createElement("button");
    btnFire.innerText = "🔥 불 속성";
    styleButton(btnFire, "#fd4949"); // 빨간색
    btnFire.onclick = () => {
        if (!sessionStorage.getItem("firepocketmon")){
            showBlockMessage(box, "불 타입 포켓몬이 없습니다");
            return;
        }
        window.barImage.src = "res/gameImage/Fire_bar.png";
        window.ballImage.src = "res/gameImage/Fire_ball.png";
        document.body.removeChild(menu);
        
    };
    box.appendChild(btnFire);

    // grass
    const btngrass = document.createElement("button");
    btngrass.innerText = "🌿 풀 속성";
    styleButton(btngrass, "#38d37a"); // 초록
    btngrass.onclick = () => {
         if(!sessionStorage.getItem('grasspocketmon')){
            showBlockMessage(box, "풀 타입 포켓몬이 없습니다");
            return;
        }
        window.barImage.src = "res/gameImage/Grass_bar.png";
        window.ballImage.src = "res/gameImage/Grass_ball.png";
        document.body.removeChild(menu);
        
    };
    box.appendChild(btngrass);

    const btnwater = document.createElement("button");
    btnwater.innerText = "💧 물 속성";
    styleButton(btnwater, "#45b6ff"); // 파란색
    btnwater.onclick = () => {
        if(!sessionStorage.getItem('waterpocketmon')){
            showBlockMessage(box, "물 타입 포켓몬이 없습니다");
            return;
        }
        window.barImage.src = "res/gameImage/Water_bar.png";
        window.ballImage.src = "res/gameImage/Water_ball.png";
        document.body.removeChild(menu);
       
    };
    box.appendChild(btnwater);

    

    menu.appendChild(box);
    document.body.appendChild(menu);
}
//외곽 블럭 이미지셋 선언
const generalBlockImgs = [
    new Image(),
    new Image(),
    new Image()
];
generalBlockImgs[0].src = "res/gameImage/General_block1.png";
generalBlockImgs[1].src = "res/gameImage/General_block2.png";
generalBlockImgs[2].src = "res/gameImage/General_block3.png";

// [Stage8] fire block 이미지셋 선언 (blockImgs)
const blockImgs = [
    new Image(),
    new Image(),
    new Image()
];
blockImgs[0].src = "res/gameImage/Fire_block1_25.png";
blockImgs[1].src = "res/gameImage/Fire_block2_25.png";
blockImgs[2].src = "res/gameImage/Fire_block3_25.png";

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
    constructor(x, y, hits = 99,imgIdx = null, type="fire", imgSet = blockImgs) {
        this.x = x;         // x좌표
        this.y = y;         // y좌표
        this.width = 25;    // 블럭 너비 (64로 맞춤)
        this.height = 25;   // 블럭 높이
        this.hits = hits;   // 블럭 체력(1~6)
        this.status = 1;    // 살아있으면 1, 깨지면 0
        this.imgIdx = imgIdx; // 내부 블럭만 랜덤 이미지
        this.type = type; // "fire" or "general"
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
for (let x = 0; x <= 975; x += 25) {  // 1000 - 25 = 975
    blocks.push(new Block(x, 0, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
}

// === [2] 외곽 블럭 (좌/우측) ===
for (let y = 25; y <= 575; y += 25) { // 600 - 25 = 575
    blocks.push(new Block(0, y, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));     // 좌측
    blocks.push(new Block(975, y, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));   // 우측
}

// === [3] 내부블럭 (이미지 패턴 기반) ===






for (let x = 150; x <= 300; x += 25)
    blocks.push(new Block(x, 120, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
for (let x =350; x <= 500; x += 25)
    blocks.push(new Block(x, 120, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
for (let x = 550; x <= 700; x += 25)
    blocks.push(new Block(x, 120, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
for (let x = 750; x <= 875; x += 25)
    blocks.push(new Block(x, 120, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(325, 120, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "fire", blockImgs));
blocks.push(new Block(525, 120, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "fire", blockImgs));
blocks.push(new Block(725, 120, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "fire", blockImgs));


for (let x = 150; x <= 300; x += 25)
    blocks.push(new Block(x, 350, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
for (let x =350; x <= 450; x += 25)
    blocks.push(new Block(x, 350, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
for (let x = 550; x <= 700; x += 25)
    blocks.push(new Block(x, 350, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
for (let x = 750; x <= 875; x += 25)
    blocks.push(new Block(x, 350, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(325, 350, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "fire", blockImgs));
blocks.push(new Block(725, 350, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "fire", blockImgs));

blocks.push(new Block(150, 170, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(150, 195, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(150, 275, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(150, 300, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(875, 170, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(875, 195, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(875, 275, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(875, 300, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
blocks.push(new Block(150, 145, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "fire", blockImgs));
blocks.push(new Block(875, 325, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "fire", blockImgs));
blocks.push(new Block(150, 325, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "fire", blockImgs));
blocks.push(new Block(875, 145, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "fire", blockImgs));

for (let x = 200; x <= 800; x += 75)
    blocks.push(new Block(x, 240, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "fire", blockImgs));

// window 객체에 할당
window.blocks = blocks;
window.blockImgs = blockImgs;
window.generalBlockImgs = generalBlockImgs;
window.fireBlockImgs = blockImgs;

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
