import { Ship } from "./ship.js";

// Local state variables (no imports from index.js)
let isSelected = false;
let startX, startY;
let initialLeft, initialTop;
let shipLengthSelected = 0;
let shipOrientation = "horizontal";

// Constants for grid
const CELL_SIZE = 40;
const GRID_PADDING = 16;
const GRID_COLS = 10;
const GRID_ROWS = 10;

// Store ship elements and references
let two_ship, three_ship, four_ship, five_ship;
let currentPlayer, currentPlayerShipBoard, currentPlayArea;

// Counter object for ship count
let shipCounts = {
  2: { placed: 0, max: 2 },
  3: { placed: 0, max: 1 },
  4: { placed: 0, max: 1 },
  5: { placed: 0, max: 1 },
};

export function resetShipDraggingState() {
  // Reset selection state
  isSelected = false;
  startX = undefined;
  startY = undefined;
  initialLeft = undefined;
  initialTop = undefined;
  shipLengthSelected = 0;
  shipOrientation = "horizontal";

  // Reset ship counts
  for (let key in shipCounts) {
    shipCounts[key].placed = 0;
  }

  // Reset current player references
  currentPlayer = null;
  currentPlayerShipBoard = null;
  currentPlayArea = null;

  // Clear any remaining previews
  clearSnapPreview();
}

export function renderPlayerArea(shipBoard, attackBoard, container) {
  const playerArea = document.createElement("div");
  playerArea.className = "player-area";
  container.appendChild(playerArea);

  const playerShipBoard = document.createElement("div");
  playerShipBoard.className = "player-ship-board";

  const playerAttackBoard = document.createElement("div");
  playerAttackBoard.className = "player-attack-board";

  playerArea.append(playerShipBoard, playerAttackBoard);

  renderPlayerBoard(shipBoard, playerShipBoard);
  renderPlayerBoard(attackBoard, playerAttackBoard);
}

export function renderPlayerBoard(board, container) {
  if (!container.querySelector(".cells-layer")) {
    const cellsLayer = document.createElement("div");
    cellsLayer.className = "cells-layer";
    const shipsLayer = document.createElement("div");
    shipsLayer.className = "ships-layer";
    container.append(cellsLayer, shipsLayer);
  }

  const cellsLayer = container.querySelector(".cells-layer");
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.dataset.row = rowIndex;
      cellElement.dataset.col = colIndex;
      cellsLayer.appendChild(cellElement);
    });
  });
}

export function placeShipOnBoard(container, result) {
  const gc = (n) => n + 1;
  const shipsLayer = container.querySelector(".ships-layer");
  let el = document.createElement("div");
  el.className = "ship";

  if (result.dir === "horizontal") {
    el.style.gridColumn = `${gc(result.column)} / span ${result.len}`;
    el.style.gridRow = `${gc(result.row)} / span 1`;
  } else {
    el.style.gridColumn = `${gc(result.column)} / span 1`;
    el.style.gridRow = `${gc(result.row)} / span ${result.len}`;
  }

  shipsLayer.appendChild(el);
}

export function displayBoard(shipBoard, container) {}

export function receiveAttackOnBoard(row, column, shipBoardContainer) {
  const gc = (n) => n + 1;
  let el = document.createElement("div");
  el.className = "highlight";
  el.style.gridColumn = `${gc(column)} / span 1`;
  el.style.gridRow = `${gc(row)} / span 1`;

  shipBoardContainer.appendChild(el);
}

function createShip(shipLength) {
  const ship = document.createElement("div");
  ship.className = "shipArtifact";
  ship.style.display = "grid";
  ship.style.width = `${shipLength * 40}px`;
  ship.style.height = "40px";
  ship.style.gridTemplateColumns = `repeat(${shipLength}, 40px)`;
  ship.style.gridTemplateRows = `repeat(1, 40px)`;

  // Add squares inside
  for (let i = 0; i < shipLength; i++) {
    const sq = document.createElement("div");
    sq.style.width = "40px";
    sq.style.height = "40px";
    sq.style.background = "black";
    sq.style.border = "1px solid white";
    ship.appendChild(sq);
  }

  ship.addEventListener("click", (e) => {
    if (shipCounts[shipLength].placed >= shipCounts[shipLength].max) {
      console.log(`Ship of length ${shipLength} already placed`);
      return;
    }
    e.preventDefault();
    shipLengthSelected = shipLength;
    isSelected = true;
    ship.setPointerCapture(e.pointerId);

    const rect = ship.getBoundingClientRect();
    const parentRect = currentPlayArea.getBoundingClientRect();

    initialLeft = rect.left - parentRect.left;
    initialTop = rect.top - parentRect.top;
    startX = e.clientX;
    startY = e.clientY;
  });

  return ship;
}

export function createShipContainer() {
  const playArea = document.querySelector(".app");
  const ship_container = document.createElement("div");
  ship_container.className = "ship-container";

  two_ship = createShip(2);
  three_ship = createShip(3);
  four_ship = createShip(4);
  five_ship = createShip(5);

  ship_container.appendChild(two_ship);
  ship_container.appendChild(three_ship);
  ship_container.appendChild(four_ship);
  ship_container.appendChild(five_ship);

  playArea.appendChild(ship_container);
}

function snapToGrid(x, y, gridContainer) {
  const gridRect = gridContainer.getBoundingClientRect();
  const containerRect = currentPlayArea.getBoundingClientRect();

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
    const ship = new Ship(shipLengthSelected);
    const previewResult = currentPlayer.shipBoard.placeShipPreview(
      snap.row,
      snap.col,
      shipOrientation,
      ship,
    );

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
        preview.style.background = "rgba(0, 255, 0, 0.3)";
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

function getShipElement(length) {
  switch (length) {
    case 2:
      return two_ship;
    case 3:
      return three_ship;
    case 4:
      return four_ship;
    case 5:
      return five_ship;
    default:
      return null;
  }
}

// Store the handler function so we can remove it later
let rightClickHandler = null;

export function attachRightClickRotation() {
  // Remove previous listener if it exists
  if (rightClickHandler) {
    document.removeEventListener("contextmenu", rightClickHandler);
  }

  // Create new handler
  rightClickHandler = (e) => {
    if (isSelected) {
      e.preventDefault();

      const oldOrientation = shipOrientation;
      // Toggle orientation
      shipOrientation =
        shipOrientation === "horizontal" ? "vertical" : "horizontal";

      console.log(
        `Orientation changed from ${oldOrientation} to ${shipOrientation}`,
      );

      clearSnapPreview();
    }
  };

  // Add the new listener
  document.addEventListener("contextmenu", rightClickHandler);
}

// Initialize dragging functionality - called from index.js
export function initializeShipDragging(
  playerShipBoard,
  playArea,
  player,
  onShipPlaced,
) {
  // Store references for use in other functions
  currentPlayerShipBoard = playerShipBoard;
  currentPlayArea = playArea;
  currentPlayer = player;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (isSelected) {
        isSelected = false;
        clearSnapPreview();
      }
    }
  });

  playerShipBoard.addEventListener("pointerenter", () => {
    if (isSelected) {
      currentPlayer = player;
    }
  });

  playerShipBoard.addEventListener("pointermove", (e) => {
    if (!isSelected) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newLeft = initialLeft + dx;
    const newTop = initialTop + dy;

    // Instead of passing ship position, pass mouse position
    const containerRect = playArea.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    showSnapPreview(mouseX, mouseY);
  });

  playerShipBoard.addEventListener("pointerleave", () => {
    clearSnapPreview();
  });

  playerShipBoard.addEventListener("click", (e) => {
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
    const snap = snapToGrid(centeredX, centeredY, playerShipBoard);

    if (snap.isOnGrid) {
      const ship = new Ship(shipLengthSelected);
      const result = player.shipBoard.placeShip(
        snap.row,
        snap.col,
        shipOrientation,
        ship,
      );

      if (result === "Enough Ships") {
        alert("Cannot place more ships - limit reached");
        isSelected = false;
        clearSnapPreview();
        return;
      }

      placeShipOnBoard(playerShipBoard, result);
      shipCounts[shipLengthSelected].placed++;

      const shipElement = getShipElement(shipLengthSelected);
      if (
        shipCounts[shipLengthSelected].placed >=
        shipCounts[shipLengthSelected].max
      ) {
        shipElement.style.opacity = "0.5";
        shipElement.style.cursor = "not-allowed";
        shipElement.style.pointerEvents = "none";
      }

      isSelected = false;
      clearSnapPreview();
      console.log("placing ship at coordinate ", snap.row, snap.col);

      if (onShipPlaced) {
        onShipPlaced(result, player);
      }
    }
  });
}
