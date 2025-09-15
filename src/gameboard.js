import { Ship } from "./ship.js";

export class GameBoard {
  constructor() {
    this.board = [];
    this.setUpBoard();
    this.numShips = 0;
    this.missedAttacks = [];
    this.sunkenShips = [];
  }

  setUpBoard() {
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i].push(Cell());
      }
    }
  }

  placeShipPreview(startRow, startCol, direction, ship) {
    for (let i = 0; i < ship.length; i++) {
      if (direction === "horizontal") {
        if (this.board[startRow][startCol + i].getHasShip()) {
          return "Already a ship there!";
        }
      } else {
        if (this.board[startRow + i][startCol].getHasShip()) {
          return "Already a ship there!";
        }
      }
    }
    return "Placeable";
  }

  placeShip(startRow, startCol, direction, ship) {
    if (this.hasEnoughShips()) return "Enough Ships";
    const previewResult = this.placeShipPreview(
      startRow,
      startCol,
      direction,
      ship,
    );
    if (previewResult !== "Placeable") {
      return "Already a ship there!";
    }
    for (let i = 0; i < ship.length; i++) {
      if (direction === "horizontal") {
        this.board[startRow][startCol + i].placeShip(ship);
      } else {
        this.board[startRow + i][startCol].placeShip(ship);
      }
    }
    this.numShips++;
    return {
      row: startRow,
      column: startCol,
      dir: direction,
      len: ship.length,
    };
  }

  receiveAttack(startRow, startCol) {
    if (this.board[startRow][startCol].getHasShip()) {
      if (!this.board[startRow][startCol].getWasHit()) {
        this.board[startRow][startCol].markHit();
        if (this.board[startRow][startCol].getShip().isSunk()) {
          this.sunkenShips.push(this.board[startRow][startCol].getShip());
        }
      } else {
        return "Already Hit. Pick Another Coordinate.";
      }
    } else {
      this.missedAttacks.push({ row: startRow, column: startCol });
      if (!this.board[startRow][startCol].getWasHit()) {
        this.board[startRow][startCol].markHit();
      } else {
        return "Already Hit. Pick Another Coordinate.";
      }
    }
  }

  hasEnoughShips() {
    return this.numShips >= 5;
  }

  getMissedAttacks() {
    this.missedAttacks.forEach((attack) => {
      console.log("Row: ", attack.row);
      console.log("Column: ", attack.column);
    });
    return this.missedAttacks;
  }

  isAllShipSunk() {
    return this.sunkenShips.length >= 5;
  }
}

function Cell() {
  let wasHit = false;
  let hasShip = false;
  let ship = null;

  const markHit = () => {
    if (hasShip) ship.hit();
    wasHit = true;
  };

  const placeShip = (newShip) => {
    hasShip = true;
    ship = newShip;
  };

  const getShip = () => ship;
  const getHasShip = () => hasShip;
  const getWasHit = () => wasHit;

  return {
    markHit,
    placeShip,
    getShip,
    getHasShip,
    getWasHit,
  };
}
