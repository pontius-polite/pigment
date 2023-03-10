import { colorFromHex, colorToHex } from "../../utils/color";
import particleDynamics from "../painting/particleDynamics";
import palettes from '../../presets/palettes.json';
import ColorGenerator from "../color/ColorGenerator";

/** A class for managing the state of the page's menu elements and a PaintingModel. */
class MenuHandler {
  /**
   * Hooks the provided PaintingModel into the menu elements.
   * @param {PaintingModel}
   */
  constructor(paintingModel) {
    this.painting = paintingModel;
    this.brush = paintingModel.brush;

    this.createMenuTabbing();
    this.addInputEventListeners();
    this.addSelectOptions();

    this.applySettingsToDOM(this.getSettingsFromPainting());
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
   */
  addInputEventListeners() {
    const settings = this.getSettingsFromPainting();
    for (let setting of Object.keys(settings)) {
      const element = document.querySelector(`[name=${setting}]`);
      element.onchange = (event) => {
        switch (element.type) {
          case "number":
            const resultNum = Number(event.target.value);
            if (resultNum < Number(element.min)) {
              resultNum = Number(element.min);
              element.value = resultNum;
            }
            if (resultNum > Number(element.max)) {
              resultNum = Number(element.max);
              element.value = resultNum;
            }
            console.log(`${setting} changed to ${resultNum}`);
            settings[setting] = resultNum;
            break;
          case "checkbox":
            const resultBool = event.target.checked;
            settings[setting] = resultBool;
            console.log(`${setting} changed to ${resultBool}`);
            if (
              element.name === "color-brush-dynamic" ||
              element.name === "color-particle-dynamic"
            ) {
              this.toggleColorBoxes(element.name, resultBool);
            }
            break;
          case "color":
            const resultColor = event.target.value;
            settings[setting] = colorFromHex(resultColor);
            console.log(`${setting} changed to ${resultColor}`);
            break;
          default:
            settings[setting] = event.target.value;
            console.log(`${setting} changed to ${event.target.value}`);
        }
        if (element.name === "reflection-type") {
          this.toggleReflectionAmountBox(element.value);
        }
        console.log(JSON.stringify(settings));
        this.applySettingsToPainting(settings);
      };
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
    const brushPaletteSelect = document.querySelector("[name=color-brush-palette]");
    brushPaletteSelect.onchange = (event) => {
      const palette = palettes[event.target.value];
      this.brush.brushColorGenerator = ColorGenerator.deserialize(palette);
    }
    const particlePaletteSelect = document.querySelector("[name=color-particle-palette]");
    particlePaletteSelect.onchange = (event) => {
      const palette = palettes[event.target.value];
      this.brush.particleColorGenerator = ColorGenerator.deserialize(palette);
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

    const brushPaletteSelect = document.querySelector("[name=color-brush-palette]");
    const particlePaletteSelect = document.querySelector("[name=color-particle-palette]");
    for (let palette of Object.keys(palettes)) {
      const brushOption = document.createElement("option");
      brushOption.value = palette;
      brushOption.innerHTML = palette;
      brushPaletteSelect.appendChild(brushOption);
      const particleOption = document.createElement("option");
      particleOption.value = palette;
      particleOption.innerHTML = palette;
      particlePaletteSelect.appendChild(particleOption);
    }
  }

  applySettingsToBrush(settings) {
    this.brush.settings.movement = settings["brush-style"];
    this.brush.settings.speed = settings["brush-speed"];
    this.brush.settings.size = settings["brush-size"];
    this.brush.settings.growth = settings["brush-growth"];
    this.brush.settings.outline = settings["brush-outline"];
    this.brush.settings.bounce = settings["brush-bounce"];
    this.brush.settings.followMouse = settings["brush-gravity-mouse"];

    this.brush.settings.brushColor = settings["color-brush"];
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

  applySettingsToPainting(settings) {
    this.applySettingsToBrush(settings);
    this.painting.settings.backgroundColor = settings["color-background"];
    this.brush.settings.shape = settings["performance-particle-quality"];
    this.brush.settings.lifespan = settings["performance-particle-lifespan"];
    this.brush.settings.interpolateMouse =
      settings["performance-interpolate-mouse"];
    this.brush.settings.interpolateParticles =
      settings["performance-interpolate-particles"];
    this.painting.settings.dynamicallyRemoveParticles =
      settings["performance-dynamic-particle-removal"];
  }

  getBrushSettingsFromPainting() {
    return {
      "brush-style": this.brush.settings.movement,
      "brush-speed": this.brush.settings.speed,
      "brush-size": this.brush.settings.size,
      "brush-growth": this.brush.settings.growth,
      "brush-outline": this.brush.settings.outline,
      "brush-bounce": this.brush.settings.bounce,
      "brush-gravity-mouse": this.brush.settings.followMouse,

      "color-brush": this.brush.settings.brushColor,
      "color-brush-dynamic": this.brush.settings.dynamicBrushColor,
      "color-brush-dynamic-speed": this.brush.brushColorGenerator.speed,
      "color-brush-dynamic-interval":
        this.brush.brushColorGenerator.interval,
      "color-brush-apply": this.brush.settings.useBrushColor,

      "color-particle-dynamic": this.brush.settings.dynamicParticleColor,
      "color-particle-dynamic-speed":
        this.brush.particleColorGenerator.speed,
      "color-particle-dynamic-interval":
        this.brush.particleColorGenerator.interval,

      "reflection-type": this.brush.settings.reflection.type,
      "reflection-amount": this.brush.settings.reflection.amount,
    };
  }

  getBrushSettingsJSON() {
    return JSON.stringify(this.getBrushSettingsFromPainting());
  }

  getSettingsFromPainting() {
    return {
      ...this.getBrushSettingsFromPainting(),
      "color-background": this.painting.settings.backgroundColor,
      "performance-particle-quality": this.brush.settings.shape,
      "performance-particle-lifespan": this.brush.settings.lifespan,
      "performance-interpolate-mouse": this.brush.settings.interpolateMouse,
      "performance-interpolate-particles":
        this.brush.settings.interpolateParticles,
      "performance-dynamic-particle-removal":
        this.painting.settings.dynamicallyRemoveParticles,
    };
  }

  getSettingsJSON() {
    return JSON.stringify(this.getSettingsFromPainting());
  }

  applySettingsToDOM(settings) {
    for (let name of Object.keys(settings)) {
      const inputElement = document.querySelector(`[name=${name}]`);

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
    this.toggleColorBoxes(
      "color-brush-dynamic",
      settings["color-brush-dynamic"]
    );
    this.toggleColorBoxes(
      "color-particle-dynamic",
      settings["color-particle-dynamic"]
    );
    this.toggleReflectionAmountBox(settings['reflection-amount']);
  }
}

export default MenuHandler;
