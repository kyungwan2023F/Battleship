export class GameBoard {
  constructor() {
    this.board = [];
    this.setUpBoard();
    this.numShips = 0;
  }

  setUpBoard() {
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i].push(Cell());
      }
    }
  }

  placeShip(startRow, startCol, direction, ship) {
    for (let i = 0; i < ship.length; i++) {
      if (direction === "horizontal") {
        if (board[startRow][startCol + i].getHasShip()) {
          return "Already a ship there!";
        }
      } else {
        if (board[startRow + i][startCol].getHasShip()) {
          return "Already a ship there!";
        }
      }
    }
    for (let i = 0; i < ship.length; i++) {
      if (direction === "horizontal") {
        board[startRow][startCol + i].placeShip(ship);
      } else {
        board[startRow + i][startCol].placeShip(ship);
      }
    }
    this.numShips++;
    if (this.hasEnoughShips()) return "Enough Ships";
  }

  hasEnoughShips() {
    return numShips >= 5;
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

  return {
    markHit,
    placeShip,
    getShip,
    getHasShip,
  };
}
