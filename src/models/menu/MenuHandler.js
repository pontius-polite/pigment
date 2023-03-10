import { colorFromHex, colorToHex } from "../../utils/color";

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
    document.querySelector("[name=color-brush-dynamic]").checked = true;
    // TODO:
    // create presets JSON of brush
    // create presets JSON of color palettes
    // this.loadPresets()
    //  - Add preset onchanges and options

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
              "color-particle-dynamic"
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
        console.log(JSON.stringify(settings));
        this.applySettingsToPainting(settings);
      };
    }
  }

  toggleColorBoxes(id, value) {
    const trueBoxes = document.getElementsByClassName(`${id}-${value}`);
    for (let element of trueBoxes) {
      element.style.display = "flex";
    }
    const falseBoxes = document.getElementsByClassName(`${id}-${!value}`);
    for (let element of falseBoxes) {
      element.style.display = "none";
    }
  }

  applySettingsToBrush(settings) {
    this.brush.settings.speed = settings["brush-speed"];
    this.brush.settings.size = settings["brush-size"];
    this.brush.settings.growth = settings["brush-growth"];
    this.brush.settings.outline = settings["brush-outline"];
    this.brush.settings.bounce = settings["brush-bounce"];
    this.brush.settings.followMouse = settings["brush-gravity-mouse"];

    this.brush.settings.brushColor = settings["color-brush"];
    this.brush.settings.dynamicBrushColor = settings["color-brush-dynamic"];
    this.brush.settings.brushColorGen.speed =
      settings["color-brush-dynamic-speed"];
    this.brush.settings.brushColorGen.speed =
      settings["color-brush-dynamic-interval"];
    this.brush.settings.useBrushColor = settings["color-brush-apply"];

    this.brush.settings.dynamicParticleColor =
      settings["color-particle-dynamic"];
    this.brush.settings.particleColorGen.speed =
      settings["color-particle-dynamic-speed"];
    this.brush.settings.particleColorGen.interval =
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
      "brush-speed": this.brush.settings.speed,
      "brush-size": this.brush.settings.size,
      "brush-growth": this.brush.settings.growth,
      "brush-outline": this.brush.settings.outline,
      "brush-bounce": this.brush.settings.bounce,
      "brush-gravity-mouse": this.brush.settings.followMouse,

      "color-brush": this.brush.settings.brushColor,
      "color-brush-dynamic": this.brush.settings.dynamicBrushColor,
      "color-brush-dynamic-speed": this.brush.settings.brushColorGen.speed,
      //TODO:
      "color-brush-dynamic-interval":
        this.brush.settings.brushColorGen.interval,
      "color-brush-apply": this.brush.settings.useBrushColor,
      "color-particle-dynamic": this.brush.settings.dynamicParticleColor,
      "color-particle-dynamic-speed":
        this.brush.settings.particleColorGen.speed,
      "color-particle-dynamic-interval":
        this.brush.settings.particleColorGen.interval,

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
      "color-background": this.painting.settings.backgroundColor.toString(),
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
          console.log(colorToHex(settings[name]));
          inputElement.value = colorToHex(settings[name]);
          break;
        default:
          inputElement.value = settings[name];
      }
    }
  }
}

export default MenuHandler;
