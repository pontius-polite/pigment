import CanvasGrid from "../grid/CanvasGrid";
import KeyHandler from "../inputs/KeyHandler";
import Paintbrush from "./Paintbrush";
import Color from "../color/Color";
import FrameTimer from "../../timing/FrameTimer";
import DebugView from "../debug/DebugView";

/**
 * Abstraction of the user's drawing. Handles state, updates, and canvas drawing.
 */
class PaintingModel {
  constructor(canvasElement, backgroundElement) {
    this.grid = new CanvasGrid(canvasElement);
    this.backgroundElement = backgroundElement;
    this.brush = new Paintbrush(this.grid);

    this.debugView = new DebugView();
    this.debugSampleRate = 10;

    this.frameTimer = new FrameTimer(this.debugSampleRate);
    this.lastUpdate = 0;
    this.updateTimer = new FrameTimer(this.debugSampleRate);
    this.targetUPS = 30;
    this.targetDelta = 1000 / (this.targetUPS);
    this.updates = 0;

    this.settings = {
      backgroundColor: new Color(251, 33, 8),
      dynamicallyRemoveParticles: false,
    }

    this.keys = new KeyHandler({
      " ": () => this.handlePause(),
      d: () => this.debugView.toggle(),
      c: () => this.clear(),
    });
  }

  init() {
    this.resize();
    this.backgroundElement.style.backgroundColor =
      this.settings.backgroundColor.toString();
    this.updateAndRender();
  }

  /** The main update loop.  */
  updateAndRender() {
    window.requestAnimationFrame(() => this.updateAndRender());
    this.frameTimer.update();
    
    this.grid.updateMousePressed();
    
    const updateDelta = this.frameTimer.start - this.lastUpdate;
    if (updateDelta > this.targetDelta) {
      this.lastUpdate = Date.now();
      this.updateTimer.update();

      this.trimPaintbrushForPerformance();
      this.brush.updateAndDraw();
      this.grid.updateMousePosition();
      if (this.updates % this.debugSampleRate === 0) {
        this.updateDebugDisplay();
      }
      
      this.updates += 1;
    }     
  }

  handlePause() {
    this.brush.settings.pauseMovement = !this.brush.settings.pauseMovement;
  }

  trimPaintbrushForPerformance() {
    if (this.settings.dynamicallyRemoveParticles) {
      const diff = this.updateTimer.averageDelta() - this.targetDelta;
      if (diff > 15) {
        const amount = Math.floor(diff * 10 + 20);
        console.log(`Removing ${amount} particles impacting performance`);
        this.brush.particles.splice(0, amount);
      }
    }
  }

  /**
   * Updates the background color according to the background color generator.
   */
  updateBackgroundColor() {
    if (this.dynamicBackroundColor) {
      this.settings.backgroundColor = this.backgroundColorGen.newColor();
    }
  }

  updateDebugDisplay() {
    this.debugView.update({
      'speed': this.brush.settings.speed,
      FPS: Math.floor(1000 / this.frameTimer.averageDelta()),
      UPS: Math.floor(1000 / this.updateTimer.averageDelta()),
      'target time': Math.floor(this.targetDelta),
      "update time": this.updateTimer.averageDelta(),
      updates: this.brush.updates,
      paused: this.brush.settings.pauseMovement,
      dimensions: `${this.grid.width} x ${this.grid.height}`,
      "mouse pos": this.grid.mousePosition(),
      "mouse down": this.grid.mousePressed(),
      particles: this.brush.particles.length,
      "particle color": this.brush.settings.brushColor.toString(),
      "background color": this.settings.backgroundColor.toString(),
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
