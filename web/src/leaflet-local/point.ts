export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number, round = false) {
    this.x = round ? Math.round(x) : x;
    this.y = round ? Math.round(y) : y;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  add(point: Point) {
    return new Point(this.x + point.x, this.y + point.y);
  }

  subtract(point: Point) {
    return new Point(this.x - point.x, this.y - point.y);
  }

  multiplyBy(num: number) {
    return new Point(this.x * num, this.y * num);
  }

  divideBy(num: number) {
    return new Point(this.x / num, this.y / num);
  }

  equals(point: Point) {
    return this.x === point.x && this.y === point.y;
  }

  toString() {
    return `Point(${this.x}, ${this.y})`;
  }
}
