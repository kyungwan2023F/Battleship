import {
  initializeGame,
  initializeSinglePlayerGame,
  displayMainMenu,
} from "./gameController.js";
import "./styles/menu.css";

export function showMainMenu() {
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
    startGame();
  });

  multiPlayerOption.addEventListener("click", () => {
    app.innerHTML = "";
    startGame();
  });
}

function startGame() {
  initializeSinglePlayerGame();
}
