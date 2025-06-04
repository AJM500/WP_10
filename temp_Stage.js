//블럭 객체
class Block {
    constructor(x, y, hits = 99) {
        this.x = x;         // x좌표
        this.y = y;         // y좌표
        this.width = 32;    // 블럭 너비 (64로 맞춤)
        this.height = 32;   // 블럭 높이
        this.hits = hits;   // 블럭 체력(1~3)
        this.status = 1;    // 살아있으면 1, 깨지면 0
    }
}
// 자유 배치형 blocks 배열 (Block 인스턴스 리스트)
// 자유 배치형 blocks 배열 (Block 인스턴스 리스트)
// 체력(hits)은 원하는 값으로 넣어도 됨 (기본 3으로 지정)
const blocks = [];
// 위쪽 가로줄
for (let x = 0; x <= 1024; x += 32) blocks.push(new Block(x, 0, 100));
// 아래 가로줄
blocks.push(new Block(32, 448, 100));
blocks.push(new Block(64, 448, 100));
blocks.push(new Block(96, 448, 100));
blocks.push(new Block(872, 448, 100));
blocks.push(new Block(904, 448, 100));
blocks.push(new Block(936, 448, 100));
// 왼쪽 세로줄
for (let y = 32; y <= 470; y += 32) blocks.push(new Block(0, y, 100));
// 오른쪽 세로줄
for (let y = 32; y <= 470; y += 32) blocks.push(new Block(968, y, 100));
// 내부 위쪽 가로줄
for (let x = 160; x <= 800; x += 32) blocks.push(new Block(x, 64, 2));
for (let x = 160; x <= 800; x += 96) blocks.push(new Block(x, 128, 2));

// 내부 아래 가로줄
for (let x = 608; x <= 768; x += 32) blocks.push(new Block(x, 384, 2));
for (let x = 224; x <= 384; x += 32) blocks.push(new Block(x, 384, 2));
// 내부 왼쪽 세로줄
for (let y = 64; y <= 384; y += 32) blocks.push(new Block(160, y, 2));
for (let y = 160; y <= 320; y += 32) blocks.push(new Block(300, y, 2));

// 내부 오른쪽 세로줄
for (let y = 64; y <= 384; y += 32) blocks.push(new Block(832, y, 2));
for (let y = 160; y <= 320; y += 32) blocks.push(new Block(684, y, 2));