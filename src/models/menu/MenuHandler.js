import ColorGenerator from "../color/ColorGenerator";
import particleDynamics from "../painting/particleDynamics";
import brushPresets from "../../presets/brushes";
import palettePresets from "../../presets/palettes.json";
import KeyHandler from "../inputs/KeyHandler";

import { colorFromHex, colorToHex } from "../../utils/color";
import { randomChoice, randomNum, randomInt } from "../../utils/random";

import initializeMenu from './initializeMenu';

/**
 * A class for managing the state of the page's menu elements and a PaintingModel.
 * The other files in this application *try* to follow principles of clean, maintainable code.
 * This file does not. But it does work.
 */
class MenuHandler {
  /**
   * Hooks the provided PaintingModel into the menu elements.
   * @param {PaintingModel}
   */
  constructor(paintingModel) {
    this.painting = paintingModel;
    this.brush = paintingModel.brush;
    initializeMenu();

    

    this.addAllEventHandlers();

    //this.loadLocalStorage();

    this.keys = new KeyHandler({
      " ": () => this.handlePause(),
      d: () => this.painting.debugView.toggle(),
      backspace: () => this.painting.clear(),
      delete: () => this.painting.clear(),
      escape: () => this.deselectAllPanels(),
      r: () => this.randomizeBrush()
    });
  }

  applyDefaultPreset() {
    const defaultPreset = brushPresets["brownian fungus"];
    this.applyBrushPreset(defaultPreset);
  }

  addAllEventHandlers() {
    this.addInputEventListeners();
    this.addPresetSelectHandlers();
    this.addIconButtonHandlers();
  }

  /**
   * Adds onchange event listeners to input elements that apply changes to painting.
   */
  addInputEventListeners() {
    const settings = this.getSettingsFromPainting();
    for (let setting of Object.keys(settings)) {
      const element = document.querySelector(`[name=${setting}]`);
      if (element) {
        element.onchange = this.createOnChangeHandler();
      }
    }
    
  }

  /**
   * Returns an event handler function that applies the respective settings change to the painting.
   * Unseemly switch statement to handle different input element types.
   * @returns {function}
   */
  createOnChangeHandler() {
    const onChange = (event) => {
      const newSettings = this.getSettingsFromPainting();
      switch (event.target.type) {
        case "number":
          let resultNum = Number(event.target.value);
          if (resultNum < Number(event.target.min)) {
            resultNum = Number(event.target.min);
            event.target.value = resultNum;
          }
          if (resultNum > Number(event.target.max)) {
            resultNum = Number(event.target.max);
            event.target.value = resultNum;
          }
          console.log(`${setting} changed to ${resultNum}`);
          newSettings[setting] = resultNum;
          break;
        case "checkbox":
          const resultBool = event.target.checked;
          newSettings[setting] = resultBool;
          console.log(`${setting} changed to ${resultBool}`);
          if (
            event.target.name === "color-brush-dynamic" ||
            event.target.name === "color-particle-dynamic"
          ) {
            this.toggleColorBoxes(event.target.name, resultBool);
          }
          break;
        case "color":
          const resultColor = event.target.value;
          newSettings[setting] = colorFromHex(resultColor);
          console.log(`${setting} changed to ${resultColor}`);
          break;
        default:
          newSettings[setting] = event.target.value;
          console.log(`${setting} changed to ${event.target.value}`);
      }
      if (event.target.name === "reflection-type") {
        this.toggleReflectionAmountBox(event.target.value);
      }
      this.applySettingsToPainting(newSettings);
    };

    return onChange;
  }

  /**
   * Toggles dynamic color options visibility based on whether the named checkbox input is checked.
   * @param {string} name
   * @param {boolean} value
   */
  toggleColorBoxes(name, value) {
    const trueBoxes = document.getElementsByClassName(`${name}-${value}`);
    for (let element of trueBoxes) {
      element.style.display = "flex";
    }
    const falseBoxes = document.getElementsByClassName(`${name}-${!value}`);
    for (let element of falseBoxes) {
      element.style.display = "none";
    }
  }

  /**
   * Toggles the reflection 'amount' input visibility depending on reflection type setting.
   * @param {*} value 
   */
  toggleReflectionAmountBox(value) {
    const showReflectionAmount = value === "polar";
    const amountElement = document.getElementsByClassName(
      "polar-reflection-true"
    )[0];
    amountElement.style.display = showReflectionAmount ? "flex" : "none";
  }

  /**
   * Adds onchange handlers to the color palette and brush preset dropdown inputs.
   */
  addPresetSelectHandlers() {
    const brushPaletteSelect = document.querySelector(
      "[name=color-brush-palette]"
    );
    brushPaletteSelect.onchange = (event) => {
      const palette = palettePresets[event.target.value];
      this.brush.brushColorGenerator = ColorGenerator.deserialize(palette);
    };
    const particlePaletteSelect = document.querySelector(
      "[name=color-particle-palette]"
    );
    particlePaletteSelect.onchange = (event) => {
      const palette = palettePresets[event.target.value];
      this.brush.particleColorGenerator = ColorGenerator.deserialize(palette);
    };

    const brushPresetSelect = document.querySelector("[name=brush-preset]");
    brushPresetSelect.onchange = (event) => {
      const preset = brushPresets[event.target.value];
      this.applyBrushPreset(preset);
    };
  }
  
  /**
   * Adds onclick handlers for the icon menu buttons.
   */
  addIconButtonHandlers() {
    const pauseButton = document.getElementById("pause-button");
    const resumeButton = document.getElementById("resume-button");
    pauseButton.onclick = () => this.handlePause();
    resumeButton.onclick = () => this.handlePause();
  
    const saveButton = document.getElementById("save-button");
    saveButton.onclick = () => this.handleSave();
  
    const deleteButton = document.getElementById("delete-button");
    deleteButton.onclick = () => this.painting.clear();
  
    const shuffleButton = document.getElementById("shuffle-button");
    shuffleButton.onclick = () => this.randomizeBrush();
  };
  
  /** 
   * Handles pausing/unpausing the paintbrush movement and swapping the pause/resume buttons.
   */
  handlePause() {
    const pauseButton = document.getElementById("pause-button");
    const resumeButton = document.getElementById('resume-button');
    if (!this.brush.settings.pauseMovement) {
      this.brush.settings.pauseMovement = true;
      pauseButton.style.display = 'none';
      resumeButton.style.display = 'flex';
      return;
    }
    this.brush.settings.pauseMovement = false;
    pauseButton.style.display = 'flex';
    resumeButton.style.display = 'none';
  }

  handleSave() {
    //open save window to input name
  }

  /**
   * Randomizes certain paintbrush settings and applies them.
   */
  randomizeBrush() {
    const settings = this.getBrushSettingsFromPainting();
    settings['brush-style'] = randomChoice(Object.keys(particleDynamics));
    settings['brush-speed'] = randomNum(0.2, 5);
    settings['brush-size'] = randomInt(1, 50);
    settings['brush-growth'] = randomNum(-1, 1);
    settings['brush-outline'] = randomInt(1, 10) > 9 ? true : false;
    settings['brush-bounce'] = randomInt(0, 1) ? true : false;
    settings['brush-gravity-mouse'] = randomInt(1, 6) > 5 ? true: false;
    const reflectionChoice = randomInt(0, 10);
    if (reflectionChoice > 4) {
      settings['reflection-type'] = "polar";
    }
    if (reflectionChoice > 6) {
      settings['reflection-type'] = "horizontal";
    }
    if (reflectionChoice > 8) {
      settings['reflection-type'] = "vertical";
    }
    settings['reflection-amount'] = randomInt(2, 6);


    this.applySettingsToBrush(settings);
    this.applySettingsToDOM(settings);
  }

  /**
   * Applies the settings object properties to the PaintingModel's PaintBrush.
   * @param {object} settings
   */
  applySettingsToBrush(settings) {
    this.brush.settings.movement = settings["brush-style"];
    this.brush.settings.speed = settings["brush-speed"];
    this.brush.settings.size = settings["brush-size"];
    this.brush.settings.growth = settings["brush-growth"];
    this.brush.settings.outline = settings["brush-outline"];
    this.brush.settings.bounce = settings["brush-bounce"];
    this.brush.settings.followMouse = settings["brush-gravity-mouse"];

    this.brush.settings.brushColor = colorFromHex(settings["color-brush"]);
    this.brush.settings.dynamicBrushColor = settings["color-brush-dynamic"];

    this.brush.brushColorGenerator.speed =
      settings["color-brush-dynamic-speed"];
    this.brush.brushColorGenerator.interval =
      settings["color-brush-dynamic-interval"];
    this.brush.settings.useBrushColor = settings["color-brush-apply"];

    this.brush.settings.dynamicParticleColor =
      settings["color-particle-dynamic"];

    this.brush.particleColorGenerator.speed =
      settings["color-particle-dynamic-speed"];
    this.brush.particleColorGenerator.interval =
      settings["color-particle-dynamic-interval"];

    this.brush.settings.reflection.type = settings["reflection-type"];
    this.brush.settings.reflection.amount = settings["reflection-amount"];
  }

  /**
   * Applies the settings object properties to the PaintingModel and its PaintBrush.
   * @param {object} settings
   */
  applySettingsToPainting(settings) {
    this.applySettingsToBrush(settings);
    this.painting.settings.backgroundColor = colorFromHex(
      settings["color-background"]
    );
    this.brush.settings.shape = settings["performance-particle-quality"];
    this.brush.settings.lifespan = settings["performance-particle-lifespan"];
    this.brush.settings.interpolateMouse =
      settings["performance-interpolate-mouse"];
    this.brush.settings.interpolateParticles =
      settings["performance-interpolate-particles"];
    this.painting.settings.dynamicallyRemoveParticles =
      settings["performance-dynamic-particle-removal"];
  }

  /**
   * Returns an object whose property names match the names of their respective html input elements.
   * @returns {object}
   */
  getBrushSettingsFromPainting() {
    return {
      "brush-style": this.brush.settings.movement,
      "brush-speed": this.brush.settings.speed,
      "brush-size": this.brush.settings.size,
      "brush-growth": this.brush.settings.growth,
      "brush-outline": this.brush.settings.outline,
      "brush-bounce": this.brush.settings.bounce,
      "brush-gravity-mouse": this.brush.settings.followMouse,

      "color-brush": colorToHex(this.brush.settings.brushColor),
      "color-brush-dynamic": this.brush.settings.dynamicBrushColor,

      "color-brush-dynamic-speed": this.brush.brushColorGenerator.speed,
      "color-brush-dynamic-interval": this.brush.brushColorGenerator.interval,
      "color-brush-apply": this.brush.settings.useBrushColor,

      "color-particle-dynamic": this.brush.settings.dynamicParticleColor,

      "color-particle-dynamic-speed": this.brush.particleColorGenerator.speed,
      "color-particle-dynamic-interval":
        this.brush.particleColorGenerator.interval,

      "reflection-type": this.brush.settings.reflection.type,
      "reflection-amount": this.brush.settings.reflection.amount,
    };
  }

  /**
   * Returns an object whose property names match the names of their respective html input elements.
   * @returns {object}
   */
  getSettingsFromPainting() {
    return {
      ...this.getBrushSettingsFromPainting(),
      "color-background": colorToHex(this.painting.settings.backgroundColor),
      "performance-particle-quality": this.brush.settings.shape,
      "performance-particle-lifespan": this.brush.settings.lifespan,
      "performance-interpolate-mouse": this.brush.settings.interpolateMouse,
      "performance-interpolate-particles":
        this.brush.settings.interpolateParticles,
      "performance-dynamic-particle-removal":
        this.painting.settings.dynamicallyRemoveParticles,
    };
  }

  /**
   * Returns a stringified array of brush settings.
   * @returns {string}
   */
  getBrushPresetJSON() {
    return JSON.stringify([
      this.brush.settings.movement,
      this.brush.settings.speed,
      this.brush.settings.size,
      this.brush.settings.growth,
      this.brush.settings.outline,
      this.brush.settings.bounce,
      this.brush.settings.followMouse,

      colorToHex(this.brush.settings.brushColor),
      this.brush.settings.dynamicBrushColor,
      this.brush.brushColorGenerator.speed,
      this.brush.brushColorGenerator.interval,
      this.brush.settings.useBrushColor,

      this.brush.settings.dynamicParticleColor,
      this.brush.particleColorGenerator.speed,
      this.brush.particleColorGenerator.interval,

      this.brush.settings.reflection.type,
      this.brush.settings.reflection.amount,
    ]);
  }

  /**
   * Applies the preset array (which is generated in JSON form with getBrushPresetJSON) to the PaintBrush
   * and the DOM inputs.
   */
  applyBrushPreset(preset) {
    const settings = {
      "brush-style": preset[0],
      "brush-speed": preset[1],
      "brush-size": preset[2],
      "brush-growth": preset[3],
      "brush-outline": preset[4],
      "brush-bounce": preset[5],
      "brush-gravity-mouse": preset[6],

      "color-brush": colorFromHex(preset[7]),
      "color-brush-dynamic": preset[8],
      "color-brush-dynamic-speed": preset[9],
      "color-brush-dynamic-interval": preset[10],
      "color-brush-apply": preset[11],

      "color-particle-dynamic": preset[12],
      "color-particle-dynamic-speed": preset[13],
      "color-particle-dynamic-interval": preset[14],

      "reflection-type": preset[15],
      "reflection-amount": preset[16],

      "color-brush-generator": undefined,
      "color-particle-generator": undefined,
    };

    console.log(settings);

    this.applySettingsToBrush(settings);
    this.applySettingsToDOM(settings);
  }

  /**
   * Applies the settings properties to DOM inputs.
   * @param {object} settings
   */
  applySettingsToDOM(settings) {
    for (let name of Object.keys(settings)) {
      const inputElement = document.querySelector(`[name=${name}]`);
      if (inputElement) {
        switch (inputElement.type) {
          case "checkbox":
            inputElement.checked = settings[name];
            break;
          case "color":
            inputElement.value = colorToHex(settings[name]);
            break;
          default:
            inputElement.value = settings[name];
        }
      }
    }
    this.toggleColorBoxes(
      "color-brush-dynamic",
      settings["color-brush-dynamic"]
    );
    this.toggleColorBoxes(
      "color-particle-dynamic",
      settings["color-particle-dynamic"]
    );
    this.toggleReflectionAmountBox(settings["reflection-amount"]);
  }
}

export default MenuHandler;
