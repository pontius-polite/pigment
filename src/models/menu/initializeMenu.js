import palettePresets from '../../presets/palettes.json'
import brushPresets from "../../presets/brushes";
import particleDynamics from "../painting/particleDynamics";

/**
 * Deselects all menu panels and hides them.
 */
const deselectAllPanels = () => {
  const buttons = document.getElementsByClassName("selected");
  for (let button of buttons) {
    button.classList.remove("selected");
  }
  const panels = document.getElementsByClassName("menu-panel");
  for (let panel of panels) {
    panel.style.display = "none";
  }
};

/**
 * Adds onclick events to menu tab buttons for showing/hiding the respective menu panel.
 */
const createMenuTabbing = () => {
  const buttonContainer = document.querySelector(".menu-tab-button-container");
  const buttons = buttonContainer.children;
  for (let i = 0; i < buttons.length; i += 1) {
    const button = buttons[i];
    button.onclick = (event) => {
      const panel = document.getElementById(event.target.getAttribute("panel"));
      if (event.target.classList.contains("selected")) {
        this.deselectAllPanels();
        return;
      }
      deselectAllPanels();
      event.target.classList.add("selected");
      panel.style.display = "flex";
      if (panel.id === "color-panel") {
        panel.style.display = "block";
      }
    };
  }
};

/**
 * Adds select element options for brush presets and brush/particle color palettes.
 */
const addSelectOptions = () => {
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
};

const initializeMenu = () => {
  createMenuTabbing();
  addSelectOptions();
}

export default initializeMenu;