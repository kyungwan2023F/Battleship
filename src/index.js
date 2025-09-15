import "./styles/style.css";
import { Player } from "./player.js";
import {
  renderPlayerArea,
  renderPlayerBoard,
  placeShipOnBoard,
  receiveAttackOnBoard,
} from "./ui.js";
import { Ship } from "./ship.js";

const player1 = new Player("player");
const player2 = new Player("player");
const playArea = document.querySelector(".boards");

player1.shipBoard.setUpBoard();
player1.attackBoard.setUpBoard();
player2.shipBoard.setUpBoard();
player2.attackBoard.setUpBoard();
renderPlayerArea(player1.shipBoard.board, player1.attackBoard.board, playArea);
renderPlayerArea(player2.shipBoard.board, player2.attackBoard.board, playArea);

const shipBoards = document.querySelectorAll(".player-ship-board");
const player1ShipBoard = shipBoards[0];
const player2ShipBoard = shipBoards[1];

const shipLayers = document.querySelectorAll(".ships-layer");
const playerAreas = document.querySelectorAll(".player-area");

const player1Cells = playerAreas[0].querySelectorAll(
  ".player-attack-board .cells-layer .cell",
);

const player2Cells = playerAreas[1].querySelectorAll(
  ".player-attack-board .cells-layer .cell",
);

player1Cells.forEach((cell) => {
  cell.addEventListener("click", (event) => {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const result = player2.shipBoard.receiveAttack(row, col);

    if (result !== "Already Hit. Pick Another Coordinate.") {
      event.target.classList.add("attacked");
      receiveAttackOnBoard(row, col, shipLayers[2]);
      console.log("Sunken ships:", player2.shipBoard.sunkenShips);
    }
  });
});

player2Cells.forEach((cell) => {
  cell.addEventListener("click", (event) => {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const result = player1.shipBoard.receiveAttack(row, col);

    if (result !== "Already Hit. Pick Another Coordinate.") {
      event.target.classList.add("attacked");
      receiveAttackOnBoard(row, col, shipLayers[0]);
      console.log("Sunken ships:", player1.shipBoard.sunkenShips);
    }
  });
});

const ship_container = document.createElement("div");
ship_container.className = "ship-container";

const two_ship = document.createElement("div");
two_ship.className = "shipArtifact";
two_ship.style.display = "grid";
two_ship.style.width = "60px";
two_ship.style.height = "40px";
two_ship.style.gridTemplateColumns = `repeat(2, 40px)`;
two_ship.style.gridTemplateRows = `repeat(1, 40px)`;

// Add 2 squares inside
for (let i = 0; i < 2; i++) {
  const sq = document.createElement("div");
  sq.style.width = "40px";
  sq.style.height = "40px";
  sq.style.background = "black";
  sq.style.border = "1px solid white";
  two_ship.appendChild(sq);
}

const three_ship = document.createElement("div");
three_ship.className = "shipArtifact";
three_ship.style.display = "grid";
three_ship.style.width = "120px"; // 3 × 40px
three_ship.style.height = "40px";
three_ship.style.gridTemplateColumns = `repeat(3, 40px)`;
three_ship.style.gridTemplateRows = `repeat(1, 40px)`;

let shipOrientation = "horizontal";

// Add 3 squares inside
for (let i = 0; i < 3; i++) {
  const sq = document.createElement("div");
  sq.style.width = "40px";
  sq.style.height = "40px";
  sq.style.background = "black";
  sq.style.border = "1px solid white";
  three_ship.appendChild(sq);
}

const four_ship = document.createElement("div");
four_ship.className = "shipArtifact";
four_ship.style.display = "grid";
four_ship.style.width = "160px";
four_ship.style.height = "40px";
four_ship.style.gridTemplateColumns = `repeat(4, 40px)`;
four_ship.style.gridTemplateRows = `repeat(1, 40px)`;

// Add 4 squares inside
for (let i = 0; i < 4; i++) {
  const sq = document.createElement("div");
  sq.style.width = "40px";
  sq.style.height = "40px";
  sq.style.background = "black";
  sq.style.border = "1px solid white";
  four_ship.appendChild(sq);
}

const five_ship = document.createElement("div");
five_ship.className = "shipArtifact";
five_ship.style.display = "grid";
five_ship.style.width = "200px";
five_ship.style.height = "40px";
five_ship.style.gridTemplateColumns = `repeat(5, 40px)`;
five_ship.style.gridTemplateRows = `repeat(1, 40px)`;

// Add 5 squares inside
for (let i = 0; i < 5; i++) {
  const sq = document.createElement("div");
  sq.style.width = "40px";
  sq.style.height = "40px";
  sq.style.background = "black";
  sq.style.border = "1px solid white";
  five_ship.appendChild(sq);
}

ship_container.appendChild(two_ship);
ship_container.appendChild(three_ship);
ship_container.appendChild(four_ship);
ship_container.appendChild(five_ship);
playArea.appendChild(ship_container);

// Constants for your grid
const CELL_SIZE = 40; // Each grid cell is 40px
const GRID_PADDING = 16; // 1rem padding = 16px typically
const GRID_COLS = 10;
const GRID_ROWS = 10;

function snapToGrid(x, y, gridContainer) {
  const gridRect = gridContainer.getBoundingClientRect();
  const containerRect = playArea.getBoundingClientRect();

  const relativeX = x - (gridRect.left - containerRect.left);
  const relativeY = y - (gridRect.top - containerRect.top);

  const gridCol = Math.round((relativeX - GRID_PADDING) / CELL_SIZE);
  const gridRow = Math.round((relativeY - GRID_PADDING) / CELL_SIZE);

  // Clamp based on current orientation
  const clampedCol =
    shipOrientation === "horizontal"
      ? Math.max(0, Math.min(GRID_COLS - shipLengthSelected, gridCol))
      : Math.max(0, Math.min(GRID_COLS - 1, gridCol));

  const clampedRow =
    shipOrientation === "vertical"
      ? Math.max(0, Math.min(GRID_ROWS - shipLengthSelected, gridRow))
      : Math.max(0, Math.min(GRID_ROWS - 1, gridRow));

  // Convert back to absolute position
  const snappedX =
    gridRect.left - containerRect.left + GRID_PADDING + clampedCol * CELL_SIZE;
  const snappedY =
    gridRect.top - containerRect.top + GRID_PADDING + clampedRow * CELL_SIZE;

  return {
    x: snappedX,
    y: snappedY,
    row: clampedRow,
    col: clampedCol,
    isOnGrid:
      gridCol >= 0 &&
      gridCol < GRID_COLS &&
      gridRow >= 0 &&
      gridRow < GRID_ROWS,
  };
}

function checkShipFits(row, col, shipLength, orientation, gridCols, gridRows) {
  if (orientation === "horizontal") {
    return col + shipLength <= gridCols;
  } else {
    return row + shipLength <= gridRows;
  }
}

// Updated drag handlers with grid snapping
let isSelected = false;
let startX, startY;
let initialLeft, initialTop;

let shipLengthSelected = 0;

three_ship.addEventListener("click", (e) => {
  e.preventDefault();
  shipLengthSelected = 3;
  isSelected = true;
  three_ship.setPointerCapture(e.pointerId);

  const rect = three_ship.getBoundingClientRect();
  const parentRect = playArea.getBoundingClientRect();

  initialLeft = rect.left - parentRect.left;
  initialTop = rect.top - parentRect.top;
  startX = e.clientX;
  startY = e.clientY;
});

two_ship.addEventListener("click", (e) => {
  e.preventDefault();
  shipLengthSelected = 2;
  isSelected = true;
  two_ship.setPointerCapture(e.pointerId);

  const rect = two_ship.getBoundingClientRect();
  const parentRect = playArea.getBoundingClientRect();

  initialLeft = rect.left - parentRect.left;
  initialTop = rect.top - parentRect.top;
  startX = e.clientX;
  startY = e.clientY;
});

four_ship.addEventListener("click", (e) => {
  e.preventDefault();
  shipLengthSelected = 4;
  isSelected = true;
  four_ship.setPointerCapture(e.pointerId);

  const rect = four_ship.getBoundingClientRect();
  const parentRect = playArea.getBoundingClientRect();

  initialLeft = rect.left - parentRect.left;
  initialTop = rect.top - parentRect.top;
  startX = e.clientX;
  startY = e.clientY;
});

five_ship.addEventListener("click", (e) => {
  e.preventDefault();
  shipLengthSelected = 5;
  isSelected = true;
  five_ship.setPointerCapture(e.pointerId);

  const rect = five_ship.getBoundingClientRect();
  const parentRect = playArea.getBoundingClientRect();

  initialLeft = rect.left - parentRect.left;
  initialTop = rect.top - parentRect.top;
  startX = e.clientX;
  startY = e.clientY;
});

document.addEventListener("contextmenu", (e) => {
  if (isSelected) {
    e.preventDefault(); // Prevent default context menu

    // Toggle orientation
    shipOrientation =
      shipOrientation === "horizontal" ? "vertical" : "horizontal";

    clearSnapPreview();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (isSelected) {
      isSelected = false;
      clearSnapPreview();
    }
  }
});

player1ShipBoard.addEventListener("pointermove", (e) => {
  if (!isSelected) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  const newLeft = initialLeft + dx;
  const newTop = initialTop + dy;

  if (shipLengthSelected === 2) {
    two_ship.style.left = newLeft + "px";
    two_ship.style.top = newTop + "px";
  } else if (shipLengthSelected === 3) {
    // Update position while dragging (free movement)
    three_ship.style.left = newLeft + "px";
    three_ship.style.top = newTop + "px";
  } else if (shipLengthSelected === 4) {
    four_ship.style.left = newLeft + "px";
    four_ship.style.top = newTop + "px";
  }

  // Instead of passing ship position, pass mouse position
  const containerRect = playArea.getBoundingClientRect();
  const mouseX = e.clientX - containerRect.left;
  const mouseY = e.clientY - containerRect.top;

  showSnapPreview(mouseX, mouseY);
});

player1ShipBoard.addEventListener("pointerleave", () => {
  clearSnapPreview();
});

player1ShipBoard.addEventListener("click", (e) => {
  if (!isSelected) return;

  const containerRect = playArea.getBoundingClientRect();
  const containerX = e.clientX - containerRect.left;
  const containerY = e.clientY - containerRect.top;

  const centeredX =
    shipOrientation === "horizontal"
      ? containerX - CELL_SIZE * 1.5
      : containerX - CELL_SIZE * 0.5;
  const centeredY =
    shipOrientation === "vertical"
      ? containerY - CELL_SIZE * 1.5
      : containerY - CELL_SIZE * 0.5;
  const snap = snapToGrid(centeredX, centeredY, player1ShipBoard);

  if (snap.isOnGrid) {
    const ship = new Ship(shipLengthSelected);
    const result = player1.shipBoard.placeShip(
      snap.row,
      snap.col,
      shipOrientation,
      ship,
    );
    console.log(result);
    placeShipOnBoard(player1ShipBoard, result);
    isSelected = false;
    clearSnapPreview();
    console.log("placing ship at coordinate ", snap.row, snap.col);
  }
});

function showSnapPreview(x, y) {
  clearSnapPreview();

  const grids = document.querySelectorAll(".player-ship-board");
  grids.forEach((grid) => {
    // Adjust centering based on orientation
    const centeredX =
      shipOrientation === "horizontal"
        ? x - CELL_SIZE * 1.5
        : x - CELL_SIZE * 0.5;
    const centeredY =
      shipOrientation === "vertical"
        ? y - CELL_SIZE * 1.5
        : y - CELL_SIZE * 0.5;

    const snap = snapToGrid(centeredX, centeredY, grid);
    const previewStyle = {
      backgroundColor: "rgba(0, 255, 0, 0.3)",
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: "green",
    };
    const ship = new Ship(shipLengthSelected);
    const previewResult = player1.shipBoard.placeShipPreview(
      snap.row,
      snap.col,
      shipOrientation,
      ship,
    );
    console.log("Result after placing ship", previewResult);
    if (snap.isOnGrid) {
      const preview = document.createElement("div");
      preview.className = "ship-preview";
      preview.style.position = "absolute";
      preview.style.display = "grid";

      // Set grid properties based on orientation
      if (shipOrientation === "horizontal") {
        preview.style.gridColumn = `${snap.col + 1} / ${snap.col + 1 + shipLengthSelected}`;
        preview.style.gridRow = `${snap.row + 1} / ${snap.row + 2}`;
      } else {
        preview.style.gridColumn = `${snap.col + 1} / ${snap.col + 2}`;
        preview.style.gridRow = `${snap.row + 1} / ${snap.row + 1 + shipLengthSelected}`;
      }

      if (previewResult === "Already a ship there!") {
        preview.style.background = "rgba(255, 0, 0, 0.3)";
        preview.style.border = "2px solid red";
      } else {
        preview.style.background = previewStyle.backgroundColor;
        preview.style.border = "2px solid green";
      }
      preview.style.pointerEvents = "none";
      preview.style.zIndex = "999";
      preview.style.inset = "0";

      grid.appendChild(preview);
    }
  });
}

function clearSnapPreview() {
  const previews = document.querySelectorAll(".ship-preview");
  previews.forEach((preview) => preview.remove());
}

const rotationButton = document.createElement("button");
rotationButton.textContent = "Rotate!";

rotationButton.addEventListener("click", () => {});
