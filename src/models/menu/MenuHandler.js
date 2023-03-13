import ColorGenerator from "../color/ColorGenerator";
import particleDynamics from "../painting/particleDynamics";
import brushPresets from "../../presets/brushes";
import palettePresets from "../../presets/palettes.json";
import KeyHandler from "../inputs/KeyHandler";

import { colorFromHex, colorToHex } from "../../utils/color";
import { randomChoice, randomNum, randomInt } from "../../utils/random";

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
    this.paintingModel = paintingModel;
    this.brush = paintingModel.brush;

    this.brushPresets = brushPresets;
    this.userBrushPresets = this.getUserPresets();

    this.initializeMenu();
    this.applyDefaultPreset();
    this.addAllEventHandlers();

    this.keys = new KeyHandler({
      " ": () => this.handlePause(),
      d: () => this.paintingModel.debugView.toggle(),
      backspace: () => this.paintingModel.clear(),
      delete: () => this.paintingModel.clear(),
      escape: () => this.deselectAllPanels(),
      r: () => this.randomizeBrush(),
    });
  }

  applyDefaultPreset() {
    const defaultPreset = brushPresets["brownian fungus"];
    this.applyBrushPreset(defaultPreset);
  }

  initializeMenu() {
    this.createMenuTabbing();
    this.addSelectOptions();
  }

  addAllEventHandlers() {
    this.addInputEventListeners();
    this.addPresetSelectHandlers();
    this.addIconButtonHandlers();

    document.querySelector(".close-welcome-modal").onclick = () => {
      this.hideWelcomeModal();
    };
    document.querySelector(".close-save-modal").onclick = () => {
      document.querySelector(".save-modal").style.display = "none";
      this.keys.block = false;
    };
    document.getElementById("save-preset-form").onsubmit = (event) => {
      event.preventDefault();
      const presetName = event.target[0].value.trim();
      if (presetName) {
        this.handleSavePreset(presetName);
      }
    };
  }

  getUserPresets() {
    const userPresets = JSON.parse(localStorage.getItem("presets"));
    if (!userPresets) {
      return {};
    }
    return userPresets;
  }

  hideWelcomeModal() {
    document.querySelector(".welcome-modal").style.display = "none";
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
        this.hideWelcomeModal();
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
    const optGroup = document.createElement("optgroup");
    optGroup.label = "Presets";
    for (let preset of Object.keys(this.brushPresets)) {
      const option = document.createElement("option");
      option.value = preset;
      option.innerHTML = preset;
      optGroup.appendChild(option);
    }
    brushPresetSelect.appendChild(optGroup);

    if (Object.keys(this.userBrushPresets).length > 0) {
      const optGroup = document.createElement("optgroup");
      optGroup.label = "Saved Presets";
      optGroup.id = "user-preset-options";

      for (let preset of Object.keys(this.userBrushPresets)) {
        const option = document.createElement("option");
        option.value = preset;
        option.innerHTML = preset;
        optGroup.appendChild(option);
      }
      brushPresetSelect.appendChild(optGroup);
    }
    
  }

  /**
   * Adds onchange event listeners to input elements that apply changes to painting.
   */
  addInputEventListeners() {
    const settings = this.getSettingsFromPainting();
    for (let setting of Object.keys(settings)) {
      const element = document.querySelector(`[name=${setting}]`);
      if (element) {
        element.onchange = this.createOnChangeHandler(setting);
      }
    }
  }

  /**
   * Returns an event handler function that applies the respective settings change to the painting.
   * Unseemly switch statement to handle different input element types.
   * @returns {function}
   */
  createOnChangeHandler(setting) {
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
      let preset = this.brushPresets[event.target.value];
      if (!preset) {
        preset = this.userBrushPresets[event.target.value];
      }
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
    saveButton.onclick = () => this.handleOpenSave();

    const deleteButton = document.getElementById("delete-button");
    deleteButton.onclick = () => this.paintingModel.clear();

    const shuffleButton = document.getElementById("shuffle-button");
    shuffleButton.onclick = () => this.randomizeBrush();
  }

  /**
   * Handles pausing/unpausing the paintbrush movement and swapping the pause/resume buttons.
   */
  handlePause() {
    const pauseButton = document.getElementById("pause-button");
    const resumeButton = document.getElementById("resume-button");
    if (!this.brush.settings.pauseMovement) {
      this.brush.settings.pauseMovement = true;
      pauseButton.style.display = "none";
      resumeButton.style.display = "flex";
      return;
    }
    this.brush.settings.pauseMovement = false;
    pauseButton.style.display = "flex";
    resumeButton.style.display = "none";
  }

  handleOpenSave() {
    this.keys.block = true;
    document.querySelector(".save-modal").style.display = "flex";
    document.querySelector(".welcome-modal").style.display = "none";
  }

  handleSavePreset(presetName) {
    console.log(presetName);
    this.userBrushPresets[presetName] = this.getBrushPreset();
    localStorage.setItem("presets", JSON.stringify(this.userBrushPresets));
    this.addPresetToDropdown(presetName);
    document.querySelector(".save-modal").style.display = "none";
  }

  addPresetToDropdown(presetName) {
    let optGroup = document.getElementById("user-preset-options");
    if (!optGroup) {
      optGroup = document.createElement('optgroup');
      optGroup.id = 'user-preset-options';
      optGroup.label = "Saved presets";
    }
    const option = document.createElement("option");
    option.value = presetName;
    option.innerHTML = presetName;
    optGroup.appendChild(option);

    document.querySelector("[name=brush-preset]").value = presetName;
  }

  /**
   * Randomizes certain paintbrush settings and applies them.
   */
  randomizeBrush() {
    const settings = this.getSettingsFromPainting();
    settings["brush-style"] = randomChoice(Object.keys(particleDynamics));
    settings["brush-speed"] = randomNum(0.2, 5);
    settings["brush-size"] = randomInt(1, 50);
    settings["brush-growth"] = randomNum(-1, 1);
    settings["brush-outline"] = randomInt(1, 10) > 9 ? true : false;
    settings["brush-bounce"] = randomInt(0, 1) ? true : false;
    settings["brush-gravity-mouse"] = randomInt(1, 6) > 5 ? true : false;
    const reflectionChoice = randomInt(0, 10);
    if (reflectionChoice > 4) {
      settings["reflection-type"] = "polar";
    }
    if (reflectionChoice > 6) {
      settings["reflection-type"] = "horizontal";
    }
    if (reflectionChoice > 8) {
      settings["reflection-type"] = "vertical";
    }
    settings["reflection-amount"] = randomInt(2, 6);

    this.applySettingsToPainting(settings);
    this.applySettingsToDOM(settings);
  }

  /**
   * Returns an object whose property names match the names of their respective html input elements.
   * @returns {object}
   */
  getSettingsFromPainting() {
    console.log("getting settings");
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

      "performance-particle-quality": this.brush.settings.shape,
      "performance-particle-lifespan": this.brush.settings.lifespan,
      "performance-interpolate-mouse": this.brush.settings.interpolateMouse,
      "performance-interpolate-particles":
        this.brush.settings.interpolateParticles,
      "performance-dynamic-particle-removal":
        this.paintingModel.settings.dynamicallyRemoveParticles,

      "color-background": colorToHex(
        this.paintingModel.settings.backgroundColor
      ),
    };
  }

  /**
   * Applies any specified settings properties to the PaintingModel.
   * @param {object} settings
   */
  applySettingsToPainting(settings) {
    console.log("applying settings: ", settings);
    const newSettings = { ...this.getSettingsFromPainting(), ...settings };
    this.brush.settings.movement = newSettings["brush-style"];
    this.brush.settings.speed = newSettings["brush-speed"];
    this.brush.settings.size = newSettings["brush-size"];
    this.brush.settings.growth = newSettings["brush-growth"];
    this.brush.settings.outline = newSettings["brush-outline"];
    this.brush.settings.bounce = newSettings["brush-bounce"];
    this.brush.settings.followMouse = newSettings["brush-gravity-mouse"];

    this.brush.settings.brushColor = colorFromHex(newSettings["color-brush"]);
    this.brush.settings.dynamicBrushColor = newSettings["color-brush-dynamic"];

    this.brush.brushColorGenerator.speed =
      newSettings["color-brush-dynamic-speed"];
    this.brush.brushColorGenerator.interval =
      newSettings["color-brush-dynamic-interval"];
    this.brush.settings.useBrushColor = newSettings["color-brush-apply"];

    this.brush.settings.dynamicParticleColor =
      newSettings["color-particle-dynamic"];
    this.brush.particleColorGenerator.speed =
      newSettings["color-particle-dynamic-speed"];
    this.brush.particleColorGenerator.interval =
      newSettings["color-particle-dynamic-interval"];

    this.brush.settings.reflection.type = newSettings["reflection-type"];
    this.brush.settings.reflection.amount = newSettings["reflection-amount"];

    this.brush.settings.shape = newSettings["performance-particle-quality"];
    this.brush.settings.lifespan = newSettings["performance-particle-lifespan"];
    this.brush.settings.interpolateMouse =
      newSettings["performance-interpolate-mouse"];
    this.brush.settings.interpolateParticles =
      newSettings["performance-interpolate-particles"];
    this.paintingModel.settings.dynamicallyRemoveParticles =
      newSettings["performance-dynamic-particle-removal"];

    this.paintingModel.settings.backgroundColor = colorFromHex(
      newSettings["color-background"]
    );
  }

  /**
   * Returns a stringified array of brush settings.
   * @returns {string}
   */
  getBrushPreset() {
    return [
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
    ];
  }

  /**
   * Applies the preset array (which is generated in JSON form with getBrushPresetJSON) to the PaintBrush
   * and the DOM inputs.
   */
  applyBrushPreset(preset) {
    const settingNames = [
      "brush-style",
      "brush-speed",
      "brush-size",
      "brush-growth",
      "brush-outline",
      "brush-bounce",
      "brush-gravity-mouse",

      "color-brush",
      "color-brush-dynamic",
      "color-brush-dynamic-speed",
      "color-brush-dynamic-interval",
      "color-brush-apply",

      "color-particle-dynamic",
      "color-particle-dynamic-speed",
      "color-particle-dynamic-interval",

      "reflection-type",
      "reflection-amount",

      "color-brush-generator",
      "color-particle-generator",
    ];

    const presetSettings = {};
    settingNames.map((name, index) => {
      presetSettings[name] = preset[index];
    });
    this.applySettingsToPainting(presetSettings);
    this.applySettingsToDOM(presetSettings);
  }

  /**
   * Applies the settings properties to DOM inputs.
   * @param {object} newSettings
   */
  applySettingsToDOM(settings) {
    console.log("applying settings to DOM:", settings);
    const newSettings = { ...this.getSettingsFromPainting(), ...settings };
    for (let name of Object.keys(newSettings)) {
      const inputElement = document.querySelector(`[name=${name}]`);
      if (inputElement) {
        switch (inputElement.type) {
          case "checkbox":
            inputElement.checked = newSettings[name];
            break;
          case "color":
            inputElement.value = colorToHex(newSettings[name]);
            break;
          default:
            inputElement.value = newSettings[name];
        }
      }
    }
    this.toggleColorBoxes(
      "color-brush-dynamic",
      newSettings["color-brush-dynamic"]
    );
    this.toggleColorBoxes(
      "color-particle-dynamic",
      newSettings["color-particle-dynamic"]
    );
    this.toggleReflectionAmountBox(newSettings["reflection-amount"]);
  }
}

export default MenuHandler;
