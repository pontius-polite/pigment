import CanvasGrid from "../grid/CanvasGrid";
import KeyHandler from "../inputs/KeyHandler";
import Paintbrush from "./Paintbrush";
import Color from "../color/Color";
import ColorGenerator from "../color/ColorGenerator";
import FrameTimer from "../../timing/FrameTimer";
import DebugView from "../debug/DebugView";

/**
 * Abstraction of the user's drawing. Handles state, updates, and canvas drawing.
 */
class PaintingModel {
  constructor(canvasElement, backgroundElement) {
    this.grid = new CanvasGrid(canvasElement);
    this.backgroundElement = backgroundElement;
    this.brush = new Paintbrush();

    this.debugView = new DebugView();
    this.frameTimer = new FrameTimer(20);
    this.targetFPS = 30;
    this.targetDelta = Math.floor(1000 / this.targetFPS - 1);
    this.averageDelta = 0;

    this.backgroundColor = new Color(251, 33, 8);

    this.keys = new KeyHandler({
      " ": () => {
        const isPaused = this.brush.settings.pauseMovement;
        this.brush.settings.pauseMovement = !isPaused;
      },
      d: () => {
        this.debugView.toggle();
      },
      c: () => {
        this.clear();
      },
    });
  }

  start() {
    this.resize();
    this.backgroundElement.style.backgroundColor =
      this.backgroundColor.toString();
    this.update();
  }

  /** The main update loop.  */
  update() {
    setTimeout(() => {
      this.update();
    }, this.targetDelta);

    this.backgroundElement.style.backgroundColor =  this.backgroundColor.toString();
    this.brush.updateAndDraw(this.grid);
    this.trimPaintbrushForPerformance(100);
    this.grid.updateMouse();
    this.updateDebugDisplay();
    this.frameTimer.update();
    this.averageDelta = this.frameTimer.averageDelta();
  }

  trimPaintbrushForPerformance(amount) {
    if (this.averageDelta > 38) {
      this.brush.particles.splice(0, amount);
    }
  }

  /**
   * Updates the background color according to the background color generator.
   */
  updateBackgroundColor() {
    if (this.dynamicBackroundColor) {
      this.backgroundColor = this.backgroundColorGen.newColor();
      
    }
  }

  updateDebugDisplay() {
    this.debugView.update({
      paused: this.brush. settings.pauseMovement,
      updates: this.brush.updates,
      "update time": this.averageDelta,
      FPS: Math.floor(1000 / this.averageDelta),
      dimensions: `${this.grid.width} x ${this.grid.height}`,
      "mouse pos": this.grid.mousePosition(),
      "mouse down": this.grid.mousePressed(),
      particles: this.brush.particles.length,
      "particle color": this.brush.settings.brushColor.toString(),
      "background color": this.backgroundColor.toString(),
    });
  }

  resize() {
    const newWidth = document.body.clientWidth;
    const newHeight = document.body.clientHeight;

    this.backgroundElement.width = newWidth;
    this.backgroundElement.height = newHeight;
    this.grid.resize(newWidth, newHeight);
  }

  clear() {
    this.grid.clear();
    this.brush.particles = [];
  }
}

export default PaintingModel;
