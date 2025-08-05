export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunken = false;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    sunken = this.hits >= this.length;
    return sunken;
  }
}
