import appSettings from "../settings/app";
import debugSettings from "../settings/debug";

import MouseHandler from "../inputs/MouseHandler";
import KeyHandler from "../inputs/KeyHandler";

import Paintbrush from "./Paintbrush";

import { fillRect } from "../utils/drawing";

/**
 * Abstraction of the user's drawing. Handles state, updates, and canvas drawing.
 */
class DrawingModel {
  settings = { app: appSettings, debug: debugSettings };

  constructor(foregroundElement, backgroundElement) {
    this.foregroundElement = foregroundElement;
    this.backgroundElement = backgroundElement;
    this.foregroundContext = foregroundElement.getContext("2d");
    this.backgroundContext = backgroundElement.getContext("2d");

    this.width = foregroundElement.clientWidth;
    this.height = foregroundElement.clientHeight;

    this.mouse = new MouseHandler();
    this.initKeyFunctions()
    
    this.paintbrush = new Paintbrush();
  }

  start() {
    this.fillBackground(this.settings.app.backgroundColor);

    this.update();
  }

  update() {
    setTimeout(() => {
      this.update();
    }, this.settings.app.targetDelta);

    if (!this.settings.app.paused) {
      //this.paintbrush.updateAndDraw();
      console.log('going!', this.settings.app.targetDelta);
    }
    
  }

  resize() {
    this.width = this.foregroundElement.clientWidth;
    this.height = this.foregroundElement.clientHeight;
    console.log(this.width, this.height);
  }

  fillBackground(color) {
    fillRect(0, 0, this.width, this.height, this.backgroundContext, color)
  }

  initKeyFunctions() {
    const kh = new KeyHandler({
      ' ': () => {
        this.settings.app.paused = !this.settings.app.paused; 
      }
    })
  }
}

export default DrawingModel;
