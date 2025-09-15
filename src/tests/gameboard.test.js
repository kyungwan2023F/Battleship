// src/tests/gameboard.test.js

import { GameBoard } from "../gameboard";
import { Ship } from "../ship";

let gameboard;

beforeEach(() => {
  gameboard = new GameBoard();
  gameboard.setUpBoard();
});

test("Gameboard correctly setup", () => {
  expect(gameboard.board.length).toBe(10);

  gameboard.board.forEach((row) => {
    expect(row.length).toBe(10);
  });
});

test("Place Ship and test coordinate", () => {
  const ship = new Ship(3);
  gameboard.placeShip(0, 0, "horizontal", ship);

  expect(gameboard.board[0][0].getHasShip()).toBe(true);
  expect(gameboard.board[0][1].getHasShip()).toBe(true);
  expect(gameboard.board[0][2].getHasShip()).toBe(true);

  const anotherShip = new Ship(3);
  gameboard.placeShip(1, 1, "vertical", anotherShip);

  expect(gameboard.board[1][1].getHasShip()).toBe(true);
  expect(gameboard.board[2][1].getHasShip()).toBe(true);
  expect(gameboard.board[3][1].getHasShip()).toBe(true);
});

test("Test Missed Attack", () => {
  const ship = new Ship(3);
  gameboard.placeShip(0, 0, "horizontal", ship);

  gameboard.receiveAttack(0, 3);
  expect(gameboard.board[0][3].getHasShip()).toBe(false);
  expect(gameboard.board[0][3].getWasHit()).toBe(true);
});

test("Successful Attack", () => {
  const ship = new Ship(3);
  gameboard.placeShip(0, 0, "horizontal", ship);

  gameboard.receiveAttack(0, 0);
  expect(gameboard.board[0][0].getHasShip()).toBe(true);
  expect(gameboard.board[0][0].getWasHit()).toBe(true);
});

test("Sunken Ship", () => {
  const ship = new Ship(3);
  gameboard.placeShip(0, 0, "horizontal", ship);

  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(0, 1);
  gameboard.receiveAttack(0, 2);
  expect(gameboard.board[0][0].getShip().isSunk()).toBe(true);
});

test("Correctly Report Missed Attacks", () => {
  const ship = new Ship(3);
  gameboard.placeShip(0, 0, "horizontal", ship);

  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(0, 1);
  gameboard.receiveAttack(0, 3);

  const missedAttacksList = gameboard.getMissedAttacks();

  expect(missedAttacksList[0].row).toBe(0);
  expect(missedAttacksList[0].column).toBe(3);

  gameboard.receiveAttack(5, 5);

  expect(missedAttacksList[1].row).toBe(5);
  expect(missedAttacksList[1].column).toBe(5);
});

test("Placing Ships On Overlapping Coordinates", () => {
  const ship = new Ship(3);
  gameboard.placeShip(0, 0, "horizontal", ship);

  expect(gameboard.placeShip(0, 0, "horizontal", ship)).toBe(
    "Already a ship there!",
  );

  expect(gameboard.placeShip(0, 1, "horizontal", ship)).toBe(
    "Already a ship there!",
  );

  expect(gameboard.placeShip(0, 2, "vertical", ship)).toBe(
    "Already a ship there!",
  );
});

test("Is All Ship Sunk", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(1);
  const ship3 = new Ship(1);
  const ship4 = new Ship(1);
  const ship5 = new Ship(1);
  gameboard.placeShip(0, 0, "horizontal", ship1);
  gameboard.placeShip(1, 0, "horizontal", ship2);
  gameboard.placeShip(2, 0, "horizontal", ship3);
  gameboard.placeShip(3, 0, "horizontal", ship4);
  gameboard.placeShip(4, 0, "horizontal", ship5);

  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(1, 0);
  gameboard.receiveAttack(2, 0);
  gameboard.receiveAttack(3, 0);
  gameboard.receiveAttack(4, 0);

  expect(gameboard.isAllShipSunk()).toBe(true);
});

test("Has Enough Ships", () => {
  const ship1 = new Ship(1);
  const ship2 = new Ship(1);
  const ship3 = new Ship(1);
  const ship4 = new Ship(1);
  const ship5 = new Ship(1);
  gameboard.placeShip(0, 0, "horizontal", ship1);
  gameboard.placeShip(1, 0, "horizontal", ship2);
  gameboard.placeShip(2, 0, "horizontal", ship3);
  gameboard.placeShip(3, 0, "horizontal", ship4);
  gameboard.placeShip(4, 0, "horizontal", ship5);

  const ship6 = new Ship(1);
  expect(gameboard.placeShip(5, 0, "horizontal", ship6)).toBe("Enough Ships");
});
