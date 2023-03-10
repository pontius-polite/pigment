import "./index.css";
import PaintingModel from "./models/painting/PaintingModel";
import MenuHandler from "./models/menu/MenuHandler";

const canvasElement = document.getElementById("foreground-canvas");
const backgroundElement = document.querySelector(".canvas-container");
console.log("Creating painting...");
const paintingModel = new PaintingModel(canvasElement, backgroundElement);
console.log("Creating menu...");
const menuHandler = new MenuHandler(paintingModel);

window.onresize = function () {
  paintingModel.resize();
};

paintingModel.init();
