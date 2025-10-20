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
    menu.classList.add("hidden");
    showGameModeSelection();
  });
}

function showGameModeSelection() {
  const app = document.querySelector(".app");
  app.innerHTML = "";
  const playerOptionMenu = document.createElement("div");
  const singlePlayerOption = document.createElement("button");
  const multiPlayerOption = document.createElement("button");
  playerOptionMenu.id = "player-option-menu";
  singlePlayerOption.id = "single-player-button";
  singlePlayerOption.textContent = "Single Player";

  multiPlayerOption.id = "multi-player-button";
  multiPlayerOption.textContent = "Multi Player";

  playerOptionMenu.appendChild(singlePlayerOption);
  playerOptionMenu.appendChild(multiPlayerOption);
  app.appendChild(playerOptionMenu);

  singlePlayerOption.addEventListener("click", () => {
    app.innerHTML = "";
    initializeSinglePlayerGame();
  });

  multiPlayerOption.addEventListener("click", () => {
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
      const shipDock = document.querySelector(".ship-container");
      if (shipDock) {
        shipDock.style.display = "none";
      }
      const computerPlacements = player2.randomlyPlaceShips();

      computerPlacements.forEach((placement) => {
        const shipBoards = document.querySelectorAll(".player-ship-board");
        const player2ShipBoard = shipBoards[1];
        placeShipOnBoard(player2ShipBoard, placement);
      });
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
}

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
        startBattlePhase();
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
        event.target.classList.add("attacked");
        console.log("Sunken ships:", player2.shipBoard.sunkenShips);

        if (player2.shipBoard.isAllShipSunk()) {
          showPhaseMessage("You Won!", 3000);
        }
        const attackResult = player2.randomShipAttack(player1.shipBoard);
        const playerShipBoard = document.querySelector(".player-ship-board");
        const attackedCell = playerShipBoard.querySelector(
          `.cell[data-row="${attackResult.row}"][data-col="${attackResult.col}"]`,
        );

        if (attackedCell) {
          attackedCell.classList.add("attacked");
        }
        if (player1.shipBoard.isAllShipSunk()) {
          showPhaseMessage("You Lost!", 3000);
        }
      }
    });
  });
}

export function endGame() {}

function showPhaseMessage(message, duration = 2000) {
  // Create message element
  const messageDiv = document.createElement("div");
  messageDiv.className = "phase-message";

  const isGameOver = message === "You Won!" || message === "You Lost!";

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
