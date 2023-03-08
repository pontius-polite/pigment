/** A class for managing the state of the page's menu elements and a PaintingModel. */
/**
 * Input elements will have class 'menu-option' and ids that are propnames.
 */

class MenuHandler {
  /**
   * Hooks the provided PaintingModel into the menu elements.
   * @param {PaintingModel}
   */
  constructor(paintingModel) {
    this.painting = paintingModel;
    this.brush = paintingModel.brush;

    this.tabs = {
      names: ['Paintbrush', 'Color', 'Reflections', 'Performance'],
      selected: -1,
    }

    this.createMenu();
    console.log(this.getPaintingPropsJSON());
  }

  createMenu() {
    const buttonContainer = document.querySelector('.menu-tab-button-container');
    const panelContainer = document.querySelector('.menu-panel-container');
    for (let i = 0; i < this.tabs.names.length; i += 1) {
      const tabName = this.tabs.names[i];

      const panel = document.createElement('div');
      panel.innerHTML = 'placeholder' + tabName;
      panel.classList.add('menu-panel');
      panel.id = `${tabName.toLowerCase()}-panel`;
      panel.style.display = 'none';
      panelContainer.appendChild(panel);

      const tabButton = document.createElement('div');
      tabButton.innerHTML = tabName;
      tabButton.index = i;
      tabButton.classList.add('menu-button');

      tabButton.onclick = (event) => {
        if (i === this.tabs.selected) {
          this.hideAllPanels();
          panel.style.display = 'none';
          this.tabs.selected = -1;
        } else {
          this.hideAllPanels();
          event.target.classList.add('selected');
          panel.style.display = 'block';
          this.tabs.selected = i;
        }
      }
      buttonContainer.appendChild(tabButton);
    }

    this.createMenuPanelInputs();
  }

  hideAllPanels() {
    const buttons = document.getElementsByClassName('selected');
    for (let button of buttons) {
      button.classList.remove('selected');
    }
    const panels = document.getElementsByClassName('menu-panel');
    for (let panel of panels) {
      panel.style.display = 'none';
    }
  }

  createMenuPanelInputs() {
    
  }


  getPaintingProps() {
    const props = {
      "brush-speed": this.brush.settings.speed,
      "brush-size": this.brush.settings.size,
      "brush-growth": this.brush.settings.growth,
      "brush-outline": this.brush.settings.outline,
      "brush-bounce": this.brush.settings.bounce,
      "brush-gravity-mouse": this.brush.settings.followMouse,
      "color-background": this.painting.settings.backgroundColor.toString(),
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
      "performance-particle-quality": this.brush.settings.shape,
      "performance-particle-lifespan": this.brush.settings.lifespan,
      "performance-interpolate-mouse": this.brush.settings.interpolateMouse,
      "performance-interpolate-particles":
        this.brush.settings.interpolateParticles,
      "performance-dynamic-particle-removal": this.painting.settings.dynamicallyRemoveParticles,
    };
    return props;
  }

  createOnChangeEvents() {
    for (let propName of Object.keys(this.getPaintingProps())) {
      const element = document.getElementById(propName);
      // create onChange handlers to change property
    }
  }

  applyPaintingPropsToMenu() {
    for (let propName of Object.keys(this.getPaintingProps())) {
      const element = document.getElementById(propName);
      // Set element value to property
    }
  }

  getPaintingPropsJSON() {
    return JSON.stringify(this.getPaintingProps());
  }
}

export default MenuHandler;
