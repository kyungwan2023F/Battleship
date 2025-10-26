import { GameBoard } from "./gameboard.js";

export class Player {
  constructor(type) {
    this.playerType = type;
    this.shipBoard = new GameBoard();
    this.attackBoard = new GameBoard();
  }

  randomlyPlaceShips() {
    return this.shipBoard.randomShipPlacement();
  }

  randomShipAttack(targetBoard) {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;

      // Generate random coordinates
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);

      // Check if this cell has already been attacked
      if (!targetBoard.board[row][col].getWasHit()) {
        // Attack this cell
        const result = targetBoard.receiveAttack(row, col);

        console.log("Hitting: ", row, col);

        return {
          row: row,
          col: col,
          result: result,
          hit: targetBoard.board[row][col].getHasShip(),
        };
      }
    }

    // If we couldn't find an unattacked cell after max attempts
    console.error("Could not find valid attack position");
    return null;
  }
}
