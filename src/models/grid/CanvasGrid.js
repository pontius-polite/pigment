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
  setStrokeColor(color) {
    this.context.strokeStyle = color.toString();
  }

  dimensions() {
    return {width: this.width, height: this.height};
  }

  /**
   * Draws a square centered at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {number} size The side length of the square.
   * @param {boolean} fill If true, the square will be filled in.
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
   * @param {boolean} fill If true, the rectangle will be filled in.
   */
  drawRect(x, y, width, height, fill) {
    const realX = Math.floor(x + this.offset.x);
    const realY = Math.floor(y + this.offset.y);
    if (fill) {
      this.context.fillRect(
        realX - Math.floor(width / 2),
        realY - Math.floor(height / 2),
        Math.floor(width),
        Math.floor(height)
      );
      return;
    }
    this.context.strokeRect(
      realX - Math.floor(width / 2),
      realY - Math.floor(height / 2),
      Math.floor(width),
      Math.floor(height)
    );
  }

  /**
   * Draws a circle centered at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {number} size The diameter of the circle.
   * @param {boolean} fill If true, the circle will be filled in.
   */
  drawCircle(x, y, size, fill) {
    const realX = Math.floor(x + this.offset.x);
    const realY = Math.floor(y + this.offset.y);
    
    if (size === 1) {
      this.context.fillRect(realX, realY, 1, 1);
      return;
    }
    
    const radius = Math.floor(size / 2);
    this.context.beginPath();
    this.context.arc(realX, realY, radius, 0, Math.PI * 2);
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
  drawShape(shape, x, y, size, fill) {
    if (shape === "circle") {
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
    const realXS = Math.floor(startX + this.offset.x);
    const realYS = Math.floor(startY + this.offset.y);
    const realXE = Math.floor(endX + this.offset.x);
    const realYE = Math.floor(endY + this.offset.y);
    this.context.lineWidth = Math.floor(thickness);
    this.context.lineCap = "round";
    this.context.beginPath();
    this.context.moveTo(realXS, realYS);
    this.context.lineTo(realXE, realYE);
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
    this.context = this.canvas.getContext('2d');

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

  mousePreviousPressed() {
    return this.mouse.previous.pressed;
  }

  mouseMoveDistance() {
    return this.mousePosition().distanceFrom(this.mousePreviousPosition());
  }

  updateMousePosition() {
    this.mouse.updatePreviousPosition();
  }

  updateMousePressed() {
    this.mouse.updatePreviousPressed();
  }
}

export default CanvasGrid;
