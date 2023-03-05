import initAppSettings from "../../settings/initAppSettings";

import DebugView from "../debug/DebugView";
import FrameTimer from '../timing/FrameTimer';
import MouseHandler from "../../inputs/MouseHandler";
import KeyHandler from "../../inputs/KeyHandler";

import Paintbrush from "./Paintbrush";
import Color from "../color/Color";
import ColorGenerator from "../color/ColorGenerator";

/**
 * Abstraction of the user's drawing. Handles state, updates, and canvas drawing.
 */
class PaintingModel {
  constructor(canvasElement, backgroundElement) {
    this.canvasElement = canvasElement;
    this.backgroundElement = backgroundElement;
    this.context = canvasElement.getContext("2d");
    this.context.lineWidth = 1;

    this.width = this.canvasElement.clientWidth;
    this.height = this.canvasElement.clientHeight;

    this.backgroundColor = new Color(251, 33, 8);
    this.backgroundColorGen = new ColorGenerator(new Color(251, 66, 33));

    this.settings = initAppSettings;
    this.paintbrush = new Paintbrush();
    this.debugView = new DebugView();
    this.frameTimer = new FrameTimer(10);

    this.mouse = new MouseHandler(canvasElement);
    this.keys = new KeyHandler({
      " ": () => {
        this.settings.paused = !this.settings.paused;
      },
      "/": () => {
        this.debugView.toggle();
      },
      'c': () => {
        this.clear();
      }
    });
  }

  start() {
    this.resize();
    this.backgroundElement.style.backgroundColor = this.backgroundColor.toString();

    this.update();
  }

  /** The main update loop.  */
  update() {
    this.frameTimer.update();

    setTimeout(() => {
      this.update();
    }, this.settings.targetDelta); 

    this.updatePaintbrush();

    this.updateBackgroundColor();

    this.mouse.updatePreviousState();
    this.updateDebugDisplay();
    
  }

  updatePaintbrush() {
    this.paintbrush.updateAndDraw(
        this.context,
        this.mouse,
        this.settings.paused,
    );
  }

  /**
   * Updates the background color according to the background color generator.
   */
  updateBackgroundColor() {
    if (this.settings.dynamicBackroundColor) {
      this.backgroundColor = this.backgroundColorGen.newColor();
      this.backgroundElement.style.backgroundColor = this.backgroundColor.toString();
    }
  }

  updateDebugDisplay() {
    const updateTime = this.frameTimer.averageDelta();
    this.debugView.update({
      updates: this.paintbrush.updates,
      "update time": updateTime,
      FPS: Math.floor(1000 / updateTime),
      width: this.width,
      height: this.height,
      "mouse pos": this.mouse.position,
      "mouse down": this.mouse.pressed,
      particles: this.paintbrush.particles.length,
      "particle color": this.paintbrush.color,
      "background color": this.backgroundColor,
    });
  }

  /**
   * Resizes the foreground and background canvases to fill the screen.
   * Also copies over previous canvas content and fills background.
   */
  resize() {
    const newWidth = document.body.clientWidth;
    const newHeight = document.body.clientHeight;

    this.width = newWidth;
    this.height = newHeight;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    tempCanvas.getContext("2d").drawImage(this.canvasElement, 0, 0);

    this.canvasElement.width = newWidth;
    this.canvasElement.height = newHeight;
    this.context.drawImage(tempCanvas, 0, 0);

    this.backgroundElement.width = newWidth;
    this.backgroundElement.height = newHeight;
  }

  clear() {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.width, this.height);
    this.paintbrush.particles = [];
  }
}

export default PaintingModel;
