// src/tests/ship.test.js
import { Ship } from "../ship.js";

test("ship created", () => {
  const ship = new Ship(3);
  expect(ship).toBeInstanceOf(Ship);
  expect(ship.hits).toBe(0);
  expect(ship.sunken).toBe(false);
});

test("ship destroyed", () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();

  expect(ship.isSunk()).toBe(true);
});
