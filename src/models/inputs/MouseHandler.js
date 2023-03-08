import Point from "../grid/Point";

/** Class for initializing mouse DOM event handlers and storing mouse state. */
class MouseHandler {
  constructor(element) {
    this.element = element;
    this.position = new Point(0, 0);
    this.pressed = false;
    this.previous = {
      position: new Point(0, 0),
      pressed: false,
    }
    this.addEventHandlers();
  }

  addEventHandlers() {
    this.element.addEventListener("mousemove", (e) => {
      this.position.x = e.offsetX;
      this.position.y = e.offsetY;
    });
    this.element.addEventListener("mousedown", (e) => {
      this.pressed = true;
    });
    this.element.addEventListener("mouseup", (e) => {
      this.pressed = false;
    });
  }

  updatePreviousPosition() {
    this.previous.position.x = this.position.x;
    this.previous.position.y = this.position.y;
  }

  updatePreviousPressed() {
    this.previous.pressed = this.pressed;
  }
}

export default MouseHandler;
