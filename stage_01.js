window.bgImageSrc = "res/gameImage/stage1_2.png";
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
    blocks.push(new Block(x, 0, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
}

// === [2] 외곽 블럭 (좌/우측) ===
for (let y = 40; y < 600; y += 40) {
    blocks.push(new Block(0, y, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
    blocks.push(new Block(960, y, -1, Math.floor(Math.random()*3), "general", generalBlockImgs));
}

// === [3] 내부블럭 ===
for (let x = 180; x <= 350; x += 40)
    blocks.push(new Block(x, 160, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
for (let x = 440; x <= 560; x += 40)
    blocks.push(new Block(x, 160, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
for (let x = 650; x <= 820; x += 40)
    blocks.push(new Block(x, 160, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));

for (let x = 80; x <= 350; x += 40)
    blocks.push(new Block(x, 300, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));
for (let x = 660; x <= 930; x += 40)
    blocks.push(new Block(x, 300, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));

for (let x = 300; x <= 420; x += 40)
    blocks.push(new Block(x, 400, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));

for (let x = 520; x <= 640; x += 40)
    blocks.push(new Block(x, 400, Math.floor(Math.random()*3)+1, Math.floor(Math.random()*3), "grass", blockImgs));



// 여기 이하 코드 복붙(타이밍 이슈 해결용)
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