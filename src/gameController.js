import { Player } from "./player.js";
import {
  renderPlayerArea,
  renderPlayerBoard,
  placeShipOnBoard,
  receiveAttackOnBoard,
  createShipContainer,
  initializeShipDragging,
  attachRightClickRotation,
} from "./ui.js";

export function initializeGame() {
  // Create and export players
  const player1 = new Player("player");
  const player2 = new Player("player");

  // Initialize boards
  player1.shipBoard.setUpBoard();
  player1.attackBoard.setUpBoard();
  player2.shipBoard.setUpBoard();
  player2.attackBoard.setUpBoard();

  const playArea = document.querySelector(".app");

  // Render player areas
  renderPlayerArea(
    player1.shipBoard.board,
    player1.attackBoard.board,
    playArea,
  );
  renderPlayerArea(
    player2.shipBoard.board,
    player2.attackBoard.board,
    playArea,
  );

  // Create the ship container for dragging
  createShipContainer();

  function handleShipPlaced(result, player) {
    console.log("Ship placed:", result);

    // Check if this player has placed all ships
    const allShipsPlaced = checkAllShipsPlaced(player);

    if (allShipsPlaced) {
      // Check if both players are done
      if (checkAllShipsPlaced(player1)) {
        alert("Player 1 Finished Placing");
      }
    }
  }

  // Initialize ship dragging functionality - pass players as parameters
  const shipBoards = document.querySelectorAll(".player-ship-board");
  const player1ShipBoard = shipBoards[0];
  const player2ShipBoard = shipBoards[1];

  // Pass the required objects to initialize dragging
  initializeShipDragging(player1ShipBoard, playArea, player1, handleShipPlaced);
  initializeShipDragging(player2ShipBoard, playArea, player2, handleShipPlaced);

  attachRightClickRotation();
}

function checkAllShipsPlaced(player) {
  return player.shipBoard.hasEnoughShips();
}

export function startShipPlacement() {}

export function startBattlePhase() {
  // Get DOM elements after they're created
  const shipLayers = document.querySelectorAll(".ships-layer");
  const playerAreas = document.querySelectorAll(".player-area");

  const player1Cells = playerAreas[0].querySelectorAll(
    ".player-attack-board .cells-layer .cell",
  );
  const player2Cells = playerAreas[1].querySelectorAll(
    ".player-attack-board .cells-layer .cell",
  );

  // Player 1 attack event listeners
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

  // Player 2 attack event listeners
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
}

export function endGame() {}
