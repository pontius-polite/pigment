import CanvasGrid from "../grid/CanvasGrid";
import KeyHandler from "../../inputs/KeyHandler";
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
    this.paintbrush = new Paintbrush();
    this.debugView = new DebugView();
    this.frameTimer = new FrameTimer(20);

    this.settings = {
      paused: false,
      backgroundColor: new Color(251, 33, 8),
      targetFPS: 30,
      targetDelta: Math.floor(1000 / 30),
      dynamicBackroundColor: false,
    };

    this.backgroundColorGen = new ColorGenerator(new Color(251, 66, 33));

    this.keys = new KeyHandler({
      " ": () => {
        this.settings.paused = !this.settings.paused;
      },
      "/": () => {
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
      this.settings.backgroundColor.toString();
    this.update();
  }

  /** The main update loop.  */
  update() {
    setTimeout(() => {
      this.update();
    }, this.settings.targetDelta);

    this.updatePaintbrush();

    this.updateBackgroundColor();

    this.grid.updateMouse();
    this.updateDebugDisplay();
    this.frameTimer.update();
  }

  updatePaintbrush() {
    this.paintbrush.updateAndDraw(this.grid, this.settings.paused);
  }

  /**
   * Updates the background color according to the background color generator.
   */
  updateBackgroundColor() {
    if (this.settings.dynamicBackroundColor) {
      this.settings.backgroundColor = this.backgroundColorGen.newColor();
      this.backgroundElement.style.backgroundColor =
        this.settings.backgroundColor.toString();
    }
  }

  updateDebugDisplay() {
    const updateTime = this.frameTimer.averageDelta();
    this.debugView.update({
      updates: this.paintbrush.updates,
      "update time": updateTime,
      FPS: Math.floor(1000 / updateTime),
      dimensions: `${this.grid.width} x ${this.grid.height}`,
      "mouse pos": this.grid.mousePosition(),
      "mouse down": this.grid.mousePressed(),
      particles: this.paintbrush.particles.length,
      "particle color": this.paintbrush.settings.color,
      "background color": this.settings.backgroundColor,
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
    this.paintbrush.particles = [];
  }
}

export default PaintingModel;
