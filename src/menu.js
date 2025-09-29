import { initializeGame } from "./gameController.js";
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
    console.log("Play button clicked!");
    menu.classList.add("hidden");
    startGame();
  });
}

function startGame() {
  initializeGame();
}
