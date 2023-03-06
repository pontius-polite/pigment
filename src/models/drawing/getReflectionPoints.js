import Point from "../grid/Point";

const TAU = 2 * Math.PI;

/**
 * Dictionary of functions that calculate reflections around the origin (0, 0) and return a 
 * list of Points.
 */
const reflectionFormulas = {
  none: (point) => [],
  vertical: (point) => [new Point(point.x * -1, point.y)],
  horizontal: (point) => [new Point(point.x, point.y * -1)],
  diagonal: (point) => [new Point(point.x * -1, point.y * -1)],
  polar: (point, count) => {
    if (count === 2) {
      return [new Point(point.x * -1, point.y * -1)];
    }
    const theta = TAU / count;
    const result = [];
    /** 2D rotation matrix multiplication. */
    for (let angle = theta; angle < TAU; angle += theta) {
      const px = point.x * Math.cos(angle) - point.y * Math.sin(angle);
      const py = point.x * Math.sin(angle) + point.y * Math.cos(angle);
      result.push(new Point(Math.floor(px), Math.floor(py)));
    }
    return result;
  },
};

/**
 * Utility function for reflecting points around an origin (0, 0).
 * @param {Point} point The point to reflect.
 * @param {Object} reflection Contains type and amount fields.  
 * @returns {Point[]} The reflected points.
 */
const getReflectionPoints = (point, reflection) => {
  return reflectionFormulas[reflection.type](point, reflection.amount);
};

export default getReflectionPoints;
