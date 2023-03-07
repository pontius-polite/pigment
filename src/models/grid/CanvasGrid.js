import Point from "./Point";
import Color from "../color/Color";
import MouseHandler from "../inputs/MouseHandler";

/**
 * Class for maintaining and drawing to a canvas element as well as mouse state.
 * Interface functions for the mouse are provided to transform mouse coordinates the grid's.
 * The coordinate points are shifted such that drawing to (0, 0) is the center of the canvas.
 */
class CanvasGrid {
 
  /**
   * Create a new CanvasGrid.
   * @param {HTMLCanvasElement} canvasElement
   */
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.context = canvasElement.getContext("2d");
    this.width = canvasElement.width;
    this.height = canvasElement.height;
    this.offset = new Point(
      Math.floor(this.width / 2),
      Math.floor(this.height / 2)
    );

    this.mouse = new MouseHandler(canvasElement);
  }

  /**
   * Sets the fill and stroke color of the canvas context.
   * @param {Color} color
   */
  setColor(color) {
    this.context.fillStyle = color.toString();
    this.context.strokeStyle = color.toString();
  }

  /**
   * Sets the fill color of the canvas context.
   * @param {Color} color
   */
  setFillColor(color) {
    this.context.fillStyle = color.toString();
  }

  /**
   * Sets the stroke color of the canvas context.
   * @param {Color} color
   */
  setFillColor(color) {
    this.context.strokeStyle = color.toString();
  }

  /**
   * Draws a square centered at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {number} size The side length of the square.
   * @param {boolean} [fill = true] If true, the square will be filled in.
   */
  drawSquare(x, y, size, fill = true) {
    this.drawRect(x, y, size, size, fill);
  }

  /**
   * Draws a rectangle centered at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {boolean} [fill = true] If true, the rectangle will be filled in.
   */
  drawRect(x, y, width, height, fill = true) {
    if (fill) {
      this.context.fillRect(
        x + this.offset.x,
        y + this.offset.y,
        width,
        height
      );
      return;
    }
    this.context.strokeRect(
      x + this.offset.x,
      y + this.offset.y,
      width,
      height
    );
  }

  /**
   * Draws a circle centered at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {number} size The diameter of the circle.
   * @param {boolean} [fill = true] If true, the circle will be filled in.
   */
  drawCircle(x, y, size, fill = true) {
    if (size === 1) {
      this.context.fillRect(x + this.offset.x, y + this.offset.y, 1, 1);
      return;
    }
    this.context.beginPath();
    this.context.arc(
      x + this.offset.x,
      y + this.offset.y,
      size / 2,
      0,
      this.TAU
    );
    this.context.stroke();

    if (fill) {
      this.context.fill();
    }
  }

  /**
   * Draws the specified shape onto the canvas grid.
   * @param {string} shape circle or square
   * @param {number} x 
   * @param {number} y 
   * @param {number} size 
   * @param {boolean} fill 
   */
  drawShape(shape, x, y, size, fill = true) {
    if (shape === 'circle') {
      this.drawCircle(x, y, size, fill);
      return;
    }
    this.drawSquare(x, y, size, fill);
  }

  /**
   * Draws a line.
   * @param {number} startX
   * @param {number} startY
   * @param {number} endX
   * @param {number} endY
   * @param {number} thickness
   */
  drawLine(startX, startY, endX, endY, thickness) {
    this.context.lineWidth = thickness;
    this.context.lineCap = "round";
    this.context.beginPath();
    this.context.moveTo(startX + this.offset.x, startY + this.offset.y);
    this.context.lineTo(endX + this.offset.x, endY + this.offset.y);
    this.context.stroke();
    this.context.lineWidth = 1;
  }

  /** Clears all content on the canvas. */
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Resizes the canvas to the specifed width and height without removing the drawing.
   * @param {number} newWidth
   * @param {number} newHeight
   */
  resize(newWidth, newHeight) {
    const widthOffset = Math.round((newWidth - this.width) / 2);
    const heightOffset = Math.round((newHeight - this.height) / 2);

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = this.width;
    tempCanvas.height = this.height;
    tempCanvas.getContext("2d").drawImage(this.canvas, 0, 0);

    this.width = newWidth;
    this.height = newHeight;
    this.offset = new Point(
      Math.floor(newWidth / 2),
      Math.floor(newHeight / 2)
    );
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;

    this.context.clearRect(0, 0, newWidth, newHeight);
    this.context.drawImage(tempCanvas, widthOffset, heightOffset);
  }

  mousePosition() {
    return new Point(
      this.mouse.position.x - this.offset.x,
      this.mouse.position.y - this.offset.y
    );
  }

  mouseX() {
    return this.mouse.position.x - this.offset.x;
  }

  mouseY() {
    return this.mouse.position.y - this.offset.y;
  }

  mousePreviousPosition() {
    return new Point(
      this.mouse.previous.position.x - this.offset.x,
      this.mouse.previous.position.y - this.offset.y
    );
  }

  mousePreviousX() {
    return this.mouse.previous.position.x - this.offset.x;
  }

  mousePreviousY() {
    return this.mouse.previous.position.y - this.offset.y;
  }

  mousePressed() {
    return this.mouse.pressed;
  }

  mouseMoveDistance() {
    return this.mousePosition().distanceFrom(this.mousePreviousPosition());
  }

  updateMouse() {
    this.mouse.updatePreviousState();
  }

  
}

export default CanvasGrid;
