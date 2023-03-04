import initAppSettings from "../../settings/initAppSettings";

import DebugView from "../debug/DebugView";
import MouseHandler from "../../inputs/MouseHandler";
import KeyHandler from "../../inputs/KeyHandler";

import Paintbrush from "./Paintbrush";

import { fillRect } from "../../utils/drawing";

/**
 * Abstraction of the user's drawing. Handles state, updates, and canvas drawing.
 */
class DrawingModel {

  constructor(foregroundElement, backgroundElement) {
    this.foregroundElement = foregroundElement;
    this.backgroundElement = backgroundElement;
    this.foregroundContext = foregroundElement.getContext("2d");
    this.backgroundContext = backgroundElement.getContext("2d");

    this.width = foregroundElement.clientWidth;
    this.height = foregroundElement.clientHeight;

    this.updates = 0;

    this.settings = initAppSettings;
    this.paintbrush = new Paintbrush();
    this.debugView = new DebugView();

    this.mouse = new MouseHandler();
    this.keys = new KeyHandler({
      ' ': () => {
        this.settings.paused = !this.settings.paused; 
      },
      '/': () => {
        this.debugView.toggle();
      }
    })     
  }

  start() {
    this.fillBackground(this.settings.backgroundColor);

    this.update();
  }

  update() {
    setTimeout(() => {
      this.update();
    }, this.settings.targetDelta);

    if (!this.settings.paused) {
      //this.paintbrush.updateAndDraw();
      
    }
    
    this.debugView.update({
      updates: this.updates,
      'mouse pos': this.mouse.position,
      'mouse down': this.mouse.pressed,
    });

    this.updates += 1;
  }

  resize() {
    this.width = this.foregroundElement.clientWidth;
    this.height = this.foregroundElement.clientHeight;
    console.log(this.width, this.height);
  }

  fillBackground(color) {
    fillRect(0, 0, this.width, this.height, this.backgroundContext, color)
  }
}

export default DrawingModel;
