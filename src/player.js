import { GameBoard } from "./gameboard.js";

export class Player {
  constructor(type) {
    this.playerType = type;
    this.shipBoard = new GameBoard();
    this.attackBoard = new GameBoard();
  }
}
