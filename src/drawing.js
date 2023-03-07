const TAU = 2 * Math.PI;

/**
 * Draws a circle onto the specified 2d rendering context centered at (x, y).
 * @param {CanvasRenderingContext2D} context
 * @param {number} x
 * @param {number} y
 * @param {number} size The diameter of the circle.
 * @param {boolean} [fill = true] If true, the circle will be filled in.
 */
export const drawCircle = (context, x, y, size, fill = true) => {
  if (size === 1) {
    context.fillRect(x, y, 1, 1);
    return;
  }
  context.beginPath();
  context.arc(x, y, size / 2, 0, TAU);
  context.stroke();

  if (fill) {
    context.fill();
  }
};

/**
 * Draws a square onto the specified 2d rendering context centered at (x, y).
 * @param {CanvasRenderingContext2D} context
 * @param {number} x
 * @param {number} y
 * @param {number} size The side length of the square.
 * @param {boolean} [fill = true] If true, the square will be filled in.
 */
export const drawSquare = (context, x, y, size, fill = true) => {
  if (fill) {
    context.fillRect(x, y, size, size);
    return;
  }
  context.strokeRect(x, y, size, size);
};

/**
 * Draws a line. 
 * @param {CanvasRenderingContext2D} context
 * @param {number} startX
 * @param {number} startY
 * @param {number} endX
 * @param {number} endY
 * @param {number} thickness
 */
export const drawLine = (context, startX, startY, endX, endY, thickness) => {
  context.lineWidth = thickness;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
  context.lineWidth = 1;
};
