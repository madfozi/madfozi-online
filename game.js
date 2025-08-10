const gridSize = 4;
let grid = [];
let score = 0;

function initGame() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  addRandomTile();
  addRandomTile();
  renderGrid();
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

function renderGrid() {
  const container = document.getElementById("grid-container");
  container.innerHTML = "";
  grid.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "grid-row";
    row.forEach(val => {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      if (val) cell.classList.add(`tile-${val}`);
      cell.textContent = val || "";
      rowDiv.appendChild(cell);
    });
    container.appendChild(rowDiv);
  });
  document.getElementById("score").textContent = score;
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
  if (moved) {
    addRandomTile();
    renderGrid();
  }
}

function moveRight() {
  let moved = false;
  for (let r = 0; r < gridSize; r++) {
    let original = grid[r].slice();
    let row = slide(grid[r].reverse()).reverse();
    grid[r] = row;
    if (row.toString() !== original.toString()) moved = true;
  }
  if (moved) {
    addRandomTile();
    renderGrid();
  }
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
  if (moved) {
    addRandomTile();
    renderGrid();
  }
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
  if (moved) {
    addRandomTile();
    renderGrid();
  }
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowLeft": moveLeft(); break;
    case "ArrowRight": moveRight(); break;
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break;
  }
});

initGame();