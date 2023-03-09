import { createElement, createInput } from "../../utils/dom";

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
    //this.applySettingsToDOM(this.getSettingsFromApp());
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
        const panel = document.getElementById(event.target.getAttribute('panel'));
        if (event.target.classList.contains('selected')) {
          this.deselectAllPanels();
          return;
        }
        this.deselectAllPanels();
        event.target.classList.add('selected');
        panel.style.display = 'flex'; 
      }
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
      console.assert(element !== null);
      if (element) {
        element.onchange = (event) => {
          console.log(`${setting} changed to ${event.target.value}`)
          switch (element.type) {
            case 'number':
              settings[setting] = Number(event.target.value);
              break;
            default:
              settings[setting] = event.target.value;
          }  
          this.applySettingsToPainting(settings);
        }
      }
    }    
  }

  applySettingsToBrush(settings) {
    this.brush.settings.speed = settings['brush-speed'];
    this.brush.settings.size = settings['brush-size'];
    this.brush.settings.growth = settings['brush-growth'];
    this.brush.settings.outline = settings['brush-outline'];
    this.brush.settings.bounce = settings['brush-bounce'];
    this.brush.settings.followMouse = settings['brush-gravity-mouse'];
  }

  applySettingsToPainting(settings) {
    this.applySettingsToBrush(settings);
    
    // "color-background": this.painting.settings.backgroundColor.toString(),
    //   "performance-particle-quality": this.brush.settings.shape,
    //   "performance-particle-lifespan": this.brush.settings.lifespan,
    //   "performance-interpolate-mouse": this.brush.settings.interpolateMouse,
    //   "performance-interpolate-particles":
    //     this.brush.settings.interpolateParticles,
    //   "performance-dynamic-particle-removal":
    //     this.painting.settings.dynamicallyRemoveParticles,
  }

  // suppose we have a setting with property name brush-gravity-mouse
  //   Then the id of the input should be brush-gravity-mouse
  //   The label can be 'gravity mouse'
  //   When we do on change: 
  //     getElementByID(setting).onchange = (event) => (setting[event.target.id] = event.target.value)

  //   checkboxes with value true can be checked 

  getBrushSettingsFromPainting() {
    return {
      "brush-speed": this.brush.settings.speed,
      "brush-size": this.brush.settings.size,
      "brush-growth": this.brush.settings.growth,
      "brush-outline": this.brush.settings.outline,
      "brush-bounce": this.brush.settings.bounce,
      "brush-gravity-mouse": this.brush.settings.followMouse,
      "color-brush": this.brush.settings.color,
      "color-brush-dynamic-preset": null, //TODO: make presets for the color gen
      "color-brush-dynamic-speed": this.brush.settings.brushColorGen.speed,
      "color-brush-dynamic-interval":
        this.brush.settings.brushColorGen.interval,
      "color-brush-apply": this.brush.settings.useBrushColor,
      "color-particle-dynamic-preset": null, //TODO:
      "color-particle-dynamic-speed":
        this.brush.settings.particleColorGen.speed,
      "color-particle-dynamic-interval":
        this.brush.settings.particleColorGen.interval,
      "reflection-type": this.brush.settings.reflection.type,
      "reflection-amount": this.brush.settings.reflection.amount,
    };
  }

  applyBrushSettingsToDOM(settings) {
    for (let name of Object.keys(settings)) {
      document.getElementById(name).value = settings[name];
    }
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
      document.getElementById(name).value = settings[name];
    }
  }

  applyPaintingPropsToMenu() {
    for (let propName of Object.keys(this.getPaintingProps())) {
      const element = document.getElementById(propName);
      // Set element value to property
    }
  }
}

export default MenuHandler;
