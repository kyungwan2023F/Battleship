import {
  initializeGame,
  initializeSinglePlayerGame,
  initializeMultiPlayerGame,
  displayMainMenu,
} from "./gameController.js";
import "./styles/menu.css";

export function showMainMenu() {
  displayMainMenu();
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
    initializeMultiPlayerGame();
  });
}

function startGame() {
  initializeSinglePlayerGame();
}
