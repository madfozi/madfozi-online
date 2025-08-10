const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let score = 0;
const gridSize = 4;
const tileSize = 80;
let grid = [];

function initGame() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  addRandomTile();
  addRandomTile();
  drawGrid();
}

function addRandomTile() {
  let emptyTiles = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === 0) emptyTiles.push({ r, c });
    }
  }
  if (emptyTiles.length > 0) {
    let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      drawTile(c * tileSize, r * tileSize, grid[r][c]);
    }
  }
  document.getElementById("score").textContent = score;
}

function drawTile(x, y, value) {
  ctx.fillStyle = value ? "#eee4da" : "#cdc1b4";
  ctx.fillRect(x + 5, y + 5, tileSize - 10, tileSize - 10);
  if (value) {
    ctx.fillStyle = "#776e65";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(value, x + tileSize / 2, y + tileSize / 2);
  }
}

function slide(row) {
  row = row.filter(v => v);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  row = row.filter(v => v);
  while (row.length < gridSize) row.push(0);
  return row;
}

function moveLeft() {
  let moved = false;
  for (let r = 0; r < gridSize; r++) {
    let original = grid[r].slice();
    let row = slide(grid[r]);
    grid[r] = row;
    if (row.toString() !== original.toString()) moved = true;
  }
  if (moved) { addRandomTile(); drawGrid(); }
}

function moveRight() {
  let moved = false;
  for (let r = 0; r < gridSize; r++) {
    let original = grid[r].slice();
    let row = slide(grid[r].reverse()).reverse();
    grid[r] = row;
    if (row.toString() !== original.toString()) moved = true;
  }
  if (moved) { addRandomTile(); drawGrid(); }
}

function moveUp() {
  let moved = false;
  for (let c = 0; c < gridSize; c++) {
    let col = [];
    for (let r = 0; r < gridSize; r++) col.push(grid[r][c]);
    let original = col.slice();
    col = slide(col);
    for (let r = 0; r < gridSize; r++) grid[r][c] = col[r];
    if (col.toString() !== original.toString()) moved = true;
  }
  if (moved) { addRandomTile(); drawGrid(); }
}

function moveDown() {
  let moved = false;
  for (let c = 0; c < gridSize; c++) {
    let col = [];
    for (let r = 0; r < gridSize; r++) col.push(grid[r][c]);
    let original = col.slice();
    col = slide(col.reverse()).reverse();
    for (let r = 0; r < gridSize; r++) grid[r][c] = col[r];
    if (col.toString() !== original.toString()) moved = true;
  }
  if (moved) { addRandomTile(); drawGrid(); }
}

// Keyboard controls
document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowLeft": moveLeft(); break;
    case "ArrowRight": moveRight(); break;
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break;
  }
});

// Touch controls
let startX, startY;
canvas.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});
canvas.addEventListener("touchend", e => {
  const touch = e.changedTouches[0];
  let dx = touch.clientX - startX;
  let dy = touch.clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) moveRight();
    else moveLeft();
  } else {
    if (dy > 0) moveDown();
    else moveUp();
  }
});

initGame();
