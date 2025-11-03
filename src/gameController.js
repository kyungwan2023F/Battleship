import { Player } from "./player.js";
import {
  renderPlayerArea,
  renderPlayerBoard,
  placeShipOnBoard,
  receiveAttackOnBoard,
  createShipContainer,
  initializeShipDragging,
  attachRightClickRotation,
  resetShipDraggingState,
} from "./ui.js";

export function displayMainMenu() {
  // Create and show menu
  const menu = document.createElement("div");
  menu.id = "main-menu";
  menu.innerHTML = `
    <h1>Battleship</h1>
    <button id="play-btn">Play Game</button>
  `;

  const app = document.querySelector(".app");
  app.appendChild(menu);

  document.getElementById("play-btn").addEventListener("click", () => {
    app.innerHTML = "";
    initializeSinglePlayerGame();
  });
}

export function initializeSinglePlayerGame() {
  // Create and export players
  const player1 = new Player("player");
  const player2 = new Player("computer");

  // Initialize boards
  player1.shipBoard.setUpBoard();
  player1.attackBoard.setUpBoard();

  player2.shipBoard.setUpBoard();

  const playArea = document.querySelector(".app");

  // Render player areas
  renderPlayerArea(
    player1.shipBoard.board,
    player1.attackBoard.board,
    playArea,
  );

  // Create the ship container for dragging
  createShipContainer();

  function handleShipPlaced(result, player) {
    console.log("Ship placed:", result);

    // Check if this player has placed all ships
    const allShipsPlaced = checkAllShipsPlaced(player);

    if (allShipsPlaced) {
      const shipDock = document.querySelector(".ship-container");
      if (shipDock) {
        shipDock.style.display = "none";
      }
      const computerPlacements = player2.randomlyPlaceShips();

      startBattlePhase(player1, player2);
      showPhaseMessage("Battle Phase - Click enemy board to attack!", 3000);
    }
  }

  // Initialize ship dragging functionality
  const shipBoard = document.querySelector(".player-ship-board");
  const player1ShipBoard = shipBoard;

  showPhaseMessage(
    "Ship Placement Phase - Place your ships on the left board. Press right click to rotate and ESC to cancel.",
    3000,
  );

  // Pass the required objects to initialize dragging
  initializeShipDragging(player1ShipBoard, playArea, player1, handleShipPlaced);

  attachRightClickRotation();
  attachRetryButton();
}

export function initializeMultiPlayerGame() {
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
        startMultiBattlePhase();
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

  showPhaseMessage(
    "Ship Placement Phase - Player 1 will place their ships on the left board. Player 2 will place their ships on the right board. Press right click to rotate and ESC to cancel.",
    3000,
  );

  attachRightClickRotation();
}

function checkAllShipsPlaced(player) {
  return player.shipBoard.hasEnoughShips();
}

export function startShipPlacement() {}

export function startBattlePhase(player1, player2) {
  // Get DOM elements after they're created
  const shipLayer = document.querySelector(".ships-layer");
  const playerArea = document.querySelector(".player-area");

  const player1Cells = playerArea.querySelectorAll(
    ".player-attack-board .cells-layer .cell",
  );

  // Player 1 attack event listeners
  player1Cells.forEach((cell) => {
    cell.addEventListener("click", (event) => {
      const row = parseInt(event.target.dataset.row);
      const col = parseInt(event.target.dataset.col);
      const result = player2.shipBoard.receiveAttack(row, col);

      if (result !== "Already Hit. Pick Another Coordinate.") {
        // Check if it was a hit or miss
        if (result && result.attackRow !== undefined) {
          // It's a hit
          event.target.classList.add("hit");
        } else {
          // It's a miss
          event.target.classList.add("miss");
        }

        event.target.classList.add("attacked");
        console.log("Sunken ships:", player2.shipBoard.sunkenShips);

        if (player2.shipBoard.isAllShipSunk()) {
          showPhaseMessage("You Won!", 3000);
          return;
        }

        if (player1.attackBoard.isAllCellsAttacked()) {
          if (
            player1.shipBoard.sunkenShips.length >
            player2.shipBoard.sunkenShips.length
          ) {
            showPhaseMessage("You Won!", 3000);
          } else if (
            player1.shipBoard.sunkenShips.length <
            player2.shipBoard.sunkenShips.length
          ) {
            showPhaseMessage("You Lost!", 3000);
          } else {
            showPhaseMessage("Draw - All cells attacked!", 3000);
          }
          return;
        }

        // Computer's turn
        const attackResult = player2.randomShipAttack(player1.shipBoard);
        const playerShipBoard = document.querySelector(".player-ship-board");
        const attackedCell = playerShipBoard.querySelector(
          `.cell[data-row="${attackResult.row}"][data-col="${attackResult.col}"]`,
        );

        if (attackedCell) {
          attackedCell.classList.add("attacked");
          // Check if computer hit or missed
          if (
            player1.shipBoard.board[attackResult.row][
              attackResult.col
            ].getHasShip()
          ) {
            attackedCell.classList.add("hit");
          } else {
            attackedCell.classList.add("miss");
          }
        }

        if (player1.shipBoard.isAllShipSunk()) {
          showPhaseMessage("You Lost!", 3000);
          return;
        }
      }
    });
  });
}

export function startMultiBattlePhase(player1, player2) {
  let currentTurn = 1; // 1 for player1, 2 for player2

  // Get DOM elements after they're created
  const playerAreas = document.querySelectorAll(".player-area");
  const player1Area = playerAreas[0];
  const player2Area = playerAreas[1];

  const player1AttackCells = player1Area.querySelectorAll(
    ".player-attack-board .cells-layer .cell",
  );

  const player2AttackCells = player2Area.querySelectorAll(
    ".player-attack-board .cells-layer .cell",
  );

  // Show initial turn message
  showPhaseMessage("Player 1's Turn", 2000);

  // Disable player 2's board initially
  disableBoard(player2AttackCells);

  // Player 1 attack event listeners
  player1AttackCells.forEach((cell) => {
    cell.addEventListener("click", (event) => {
      if (currentTurn !== 1) return;

      const row = parseInt(event.target.dataset.row);
      const col = parseInt(event.target.dataset.col);
      const result = player2.shipBoard.receiveAttack(row, col);

      if (result !== "Already Hit. Pick Another Coordinate.") {
        // Check if it was a hit or miss
        if (result && result.hit) {
          event.target.classList.add("hit");
        } else {
          event.target.classList.add("miss");
        }

        event.target.classList.add("attacked");

        // Check if player 1 won
        if (player2.shipBoard.isAllShipSunk()) {
          showPhaseMessage("Player 1 Wins!", 3000);
          return;
        }

        // Check for stalemate
        if (player2.shipBoard.isAllCellsAttacked()) {
          if (
            player1.shipBoard.sunkenShips.length <
            player2.shipBoard.sunkenShips.length
          ) {
            showPhaseMessage("Player 1 Wins!", 3000);
          } else if (
            player1.shipBoard.sunkenShips.length >
            player2.shipBoard.sunkenShips.length
          ) {
            showPhaseMessage("Player 2 Wins!", 3000);
          } else {
            showPhaseMessage("Draw - It's a Tie!", 3000);
          }
          return;
        }

        // Switch turn to player 2
        currentTurn = 2;
        showPhaseMessage("Player 2's Turn", 2000);
        disableBoard(player1AttackCells);
        enableBoard(player2AttackCells);
      }
    });
  });

  // Player 2 attack event listeners
  player2AttackCells.forEach((cell) => {
    cell.addEventListener("click", (event) => {
      if (currentTurn !== 2) return; // Not player 2's turn

      const row = parseInt(event.target.dataset.row);
      const col = parseInt(event.target.dataset.col);
      const result = player1.shipBoard.receiveAttack(row, col);

      if (result !== "Already Hit. Pick Another Coordinate.") {
        // Check if it was a hit or miss
        if (result && result.hit) {
          event.target.classList.add("hit");
        } else {
          event.target.classList.add("miss");
        }

        event.target.classList.add("attacked");

        // Check if player 2 won
        if (player1.shipBoard.isAllShipSunk()) {
          showPhaseMessage("Player 2 Wins!", 3000);
          return;
        }

        // Check for stalemate
        if (player1.shipBoard.isAllCellsAttacked()) {
          if (
            player1.shipBoard.sunkenShips.length <
            player2.shipBoard.sunkenShips.length
          ) {
            showPhaseMessage("Player 1 Wins!", 3000);
          } else if (
            player1.shipBoard.sunkenShips.length >
            player2.shipBoard.sunkenShips.length
          ) {
            showPhaseMessage("Player 2 Wins!", 3000);
          } else {
            showPhaseMessage("Draw - It's a Tie!", 3000);
          }
          return;
        }

        // Switch turn to player 1
        currentTurn = 1;
        showPhaseMessage("Player 1's Turn", 2000);
        disableBoard(player2AttackCells);
        enableBoard(player1AttackCells);
      }
    });
  });
}

// Helper functions to enable/disable boards
function disableBoard(cells) {
  cells.forEach((cell) => {
    cell.style.pointerEvents = "none";
    cell.style.opacity = "0.5";
  });
}

function enableBoard(cells) {
  cells.forEach((cell) => {
    if (!cell.classList.contains("attacked")) {
      cell.style.pointerEvents = "auto";
      cell.style.opacity = "1";
    }
  });
}

export function endGame() {}

function showPhaseMessage(message, duration = 2000) {
  // Create message element
  const messageDiv = document.createElement("div");
  messageDiv.className = "phase-message";

  const isGameOver =
    message === "You Won!" ||
    message === "You Lost!" ||
    message === "Draw - All cells attacked!";

  if (isGameOver) {
    // Create container for game over screen
    messageDiv.innerHTML = `
      <h2 style="margin: 0 0 20px 0; font-size: 32px;">${message}</h2>
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button id="replay-btn" style="
          padding: 12px 24px;
          font-size: 18px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        ">Play Again</button>
        <button id="menu-btn" style="
          padding: 12px 24px;
          font-size: 18px;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        ">Main Menu</button>
      </div>
    `;

    messageDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 40px 60px;
      border-radius: 15px;
      font-size: 24px;
      z-index: 1000;
      text-align: center;
      animation: fadeIn 0.3s ease-in;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    `;

    document.body.appendChild(messageDiv);

    // Add event listeners to buttons
    const replayBtn = document.getElementById("replay-btn");
    const menuBtn = document.getElementById("menu-btn");

    replayBtn.addEventListener("mouseenter", () => {
      replayBtn.style.backgroundColor = "#45a049";
    });
    replayBtn.addEventListener("mouseleave", () => {
      replayBtn.style.backgroundColor = "#4CAF50";
    });

    menuBtn.addEventListener("mouseenter", () => {
      menuBtn.style.backgroundColor = "#1976D2";
    });
    menuBtn.addEventListener("mouseleave", () => {
      menuBtn.style.backgroundColor = "#2196F3";
    });

    replayBtn.addEventListener("click", () => {
      messageDiv.remove();
      // Clear the game area and restart
      resetShipDraggingState();
      const appContainer = document.querySelector(".app");
      appContainer.innerHTML = "";
      initializeSinglePlayerGame();
    });

    menuBtn.addEventListener("click", () => {
      messageDiv.remove();
      // Navigate to main menu
      resetShipDraggingState();
      const appContainer = document.querySelector(".app");
      appContainer.innerHTML = "";
      displayMainMenu();
    });

    // Don't auto-remove for game over messages
    return;
  }

  // Regular phase message (non-game over)
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px 40px;
    border-radius: 10px;
    font-size: 24px;
    z-index: 1000;
    text-align: center; 
    animation: fadeIn 0.3s ease-in;
  `;

  // Add to page
  document.body.appendChild(messageDiv);

  // Remove after duration
  setTimeout(() => {
    messageDiv.style.animation = "fadeOut 0.3s ease-out";
    setTimeout(() => messageDiv.remove(), 300);
  }, duration);
}

export function attachRetryButton() {
  const existingButton = document.querySelector(".menu-button");
  if (existingButton) {
    existingButton.remove();
  }

  const retryButton = document.createElement("button");
  retryButton.className = "retry-button";
  retryButton.innerHTML = "Replay";

  // Style the button
  retryButton.style.cssText = `
    position: fixed;
    top: 2rem;
    left: 2rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4);
    text-transform: uppercase;
    letter-spacing: 1px;
  `;

  const app = document.querySelector(".app");

  // Add hover effects
  retryButton.addEventListener("mouseenter", () => {
    retryButton.style.background =
      "linear-gradient(135deg, #0b5ed7 0%, #084298 100%)";
    retryButton.style.transform = "translateY(-2px)";
    retryButton.style.boxShadow = "0 6px 20px rgba(13, 110, 253, 0.6)";
  });

  retryButton.addEventListener("mouseleave", () => {
    retryButton.style.background =
      "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)";
    retryButton.style.transform = "translateY(0)";
    retryButton.style.boxShadow = "0 4px 15px rgba(13, 110, 253, 0.4)";
  });

  // Add click handler
  retryButton.addEventListener("click", () => {
    resetShipDraggingState();
    const appContainer = document.querySelector(".app");
    appContainer.innerHTML = "";
    initializeSinglePlayerGame();
  });

  // Append to container
  app.appendChild(retryButton);

  return retryButton;
}
