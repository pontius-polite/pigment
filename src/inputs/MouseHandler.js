import Point from "../models/drawing/Point";

/** Class for initializing mouse DOM event handlers and storing mouse state. */
class MouseHandler {
  constructor() {
    this.position = new Point(0, 0);
    this.prevPosition = new Point(0, 0);
    this.pressed = false;
    this.addEventHandlers();
  }

  addEventHandlers() {
    const canvasContainer = document.querySelector('.canvas-container');
    canvasContainer.addEventListener("mousemove", (e) => {
      this.position.x = e.offsetX;
      this.position.y = e.offsetY;
    });
    canvasContainer.addEventListener("mousedown", (e) => {
      this.pressed = true;
    });
    canvasContainer.addEventListener("mouseup", (e) => {
      this.pressed = false;
    });
  }

  updatePrevPosition() {
    this.prevPosition.x = this.position.x;
    this.prevPosition.y = this.position.y;
  }
}

export default MouseHandler;
