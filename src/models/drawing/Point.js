/**
 * Class for representing two dimensional coordinate points and providing calculation functions.
 */
class Point {
  /**
   * Represents a two dimensional point on a coordinate plane.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns the distance of this point from (0, 0).
   * @returns {number}
   */
  distanceFromOrigin() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns the distance of this point from the other point.
   * @param {Point} other
   * @returns {number}
   */
  distanceFrom(other) {
    const xdif = this.x - other.x;
    const ydif = this.y - other.y;
    return Math.sqrt(xdif * xdif + ydif * ydif);
  }

  /**
   * Adds the x and y coordinates of this point to the other point.
   * @param {Point} otherPoint
   * @returns
   */
  addTo(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  /**
   * Returns an array of points that interpolate the space between this point and the other point.
   * @param {Point} other
   * @param {number} count The number of points to interpolate.
   * @returns {Point[]}
   */
  interpolatePointsBetween(other, count) {
    const result = [];
    const xInterval = (other.x - this.x) / (count + 1);
    const yInterval = (other.y - this.y) / (count + 1);
    for (let i = 0; i < count; i += 1) {
      const px = xInterval * (i + 1) + this.x;
      const py = yInterval * (i + 1) + this.y;
      result.push(new Point(px, py));
    }
    return result;
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
  }

  toString() {
    return `{x: ${this.x}, y: ${this.y}}`;
  }
}

export default Point;
