import ColorGenerator from "../color/ColorGenerator";
import Color from "../color/Color";
import particleDynamics from "../painting/particleDynamics";
import { colorFromHex, colorToHex } from "../../utils/color";

import brushPresets from "../../presets/brushes";
import palettePresets from "../../presets/palettes.json";
import KeyHandler from "../inputs/KeyHandler";

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

    this.createMenuTabbing();
    this.addSelectOptions();
    this.addInputEventListeners();

    
    this.defaultPreset = brushPresets["brownian fungus"];
    this.applyBrushPreset(this.defaultPreset);
    this.applySettingsToDOM(this.getSettingsFromPainting());

    //this.loadLocalStorage();
    
    this.keys = new KeyHandler({
      c: () => navigator.clipboard.writeText(this.getBrushPresetJSON()),
    });
  }

  /**
   * Adds onclick events to menu tab buttons for showing/hiding the respective menu panel.
   */
  createMenuTabbing() {
    const buttonContainer = document.querySelector(
      ".menu-tab-button-container"
    );
    const buttons = buttonContainer.children;
    for (let i = 0; i < buttons.length; i += 1) {
      const button = buttons[i];
      button.onclick = (event) => {
        const panel = document.getElementById(
          event.target.getAttribute("panel")
        );
        if (event.target.classList.contains("selected")) {
          this.deselectAllPanels();
          return;
        }
        this.deselectAllPanels();
        event.target.classList.add("selected");
        panel.style.display = "flex";
        if (panel.id === "color-panel") {
          panel.style.display = "block";
        }
      };
    }
  }

  /**
   * Deselects all menu panels and hides them.
   */
  deselectAllPanels() {
    const buttons = document.getElementsByClassName("selected");
    for (let button of buttons) {
      button.classList.remove("selected");
    }
    const panels = document.getElementsByClassName("menu-panel");
    for (let panel of panels) {
      panel.style.display = "none";
    }
  }

  /**
   * Adds onchange event listeners to input elements that apply changes to painting.
   * A method monstrosity.
   */
  addInputEventListeners() {
    const settings = this.getSettingsFromPainting();
    for (let setting of Object.keys(settings)) {
      const element = document.querySelector(`[name=${setting}]`);
      if (element) {
        element.onchange = (event) => {
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
      }
    }
    this.addPresetEventListeners();
  }

  /**
   * Toggles dynamic color options depending on whether the named element is checked.
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

  toggleReflectionAmountBox(value) {
    const showReflectionAmount = value === "polar";
    const amountElement = document.getElementsByClassName(
      "polar-reflection-true"
    )[0];
    amountElement.style.display = showReflectionAmount ? "flex" : "none";
  }

  addPresetEventListeners() {
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

    const brushPresetSelect = document.querySelector(
      "[name=brush-preset]"
    );
    brushPresetSelect.onchange = (event) => {
      const preset = brushPresets[event.target.value];
      this.applyBrushPreset(preset);
    }
  }

  /**
   * Adds select element options for brush presets and brush/particle color palettes.
   */
  addSelectOptions() {
    const styleSelect = document.querySelector("[name=brush-style]");
    const styles = Object.keys(particleDynamics);
    for (let style of styles) {
      const option = document.createElement("option");
      option.value = style;
      option.innerHTML = style;
      styleSelect.appendChild(option);
    }

    const brushPaletteSelect = document.querySelector(
      "[name=color-brush-palette]"
    );
    const particlePaletteSelect = document.querySelector(
      "[name=color-particle-palette]"
    );
    for (let palette of Object.keys(palettePresets)) {
      const brushOption = document.createElement("option");
      brushOption.value = palette;
      brushOption.innerHTML = palette;
      brushPaletteSelect.appendChild(brushOption);
      const particleOption = document.createElement("option");
      particleOption.value = palette;
      particleOption.innerHTML = palette;
      particlePaletteSelect.appendChild(particleOption);
    }

    const brushPresetSelect = document.querySelector("[name=brush-preset]");
    for (let preset of Object.keys(brushPresets)) {
      const option = document.createElement("option");
      option.value = preset;
      option.innerHTML = preset;
      brushPresetSelect.appendChild(option);
    }
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
