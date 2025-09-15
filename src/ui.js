export function renderPlayerArea(shipBoard, attackBoard, container) {
  const playerArea = document.createElement("div");
  playerArea.className = "player-area";
  container.appendChild(playerArea);

  const playerShipBoard = document.createElement("div");
  playerShipBoard.className = "player-ship-board";

  const playerAttackBoard = document.createElement("div");
  playerAttackBoard.className = "player-attack-board";

  playerArea.append(playerShipBoard, playerAttackBoard);
  container.appendChild(playerArea);

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
  container.appendChild(cellsLayer);
}

export function placeShipOnBoard(container, result) {
  console.log("UI placing ship on ", result.row, result.column);
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

export function receiveAttackOnBoard(row, column, shipBoardContainer) {
  const gc = (n) => n + 1;
  let el = document.createElement("div");
  el.className = "highlight";
  el.style.gridColumn = `${gc(column)} / span 1`;
  el.style.gridRow = `${gc(row)} / span 1`;

  shipBoardContainer.appendChild(el);
}
