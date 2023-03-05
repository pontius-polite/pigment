import './index.css';
import PaintingModel from './models/drawing/PaintingModel';

const canvasElement = document.getElementById("background-canvas");
const backgroundElement = document.querySelector(".canvas-container");
const paintingModel = new PaintingModel(canvasElement, backgroundElement);
// TODO: const menuHandler = new MenuHandler(paintingModel);
// The above will add onChange event listeners to the menu inputs, 
// changing settings of the painting model

window.onresize = function() {
  paintingModel.resize()
};

paintingModel.start();

