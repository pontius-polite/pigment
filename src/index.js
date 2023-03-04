import './index.css';
import DrawingModel from './models/drawing/DrawingModel';

const foregroundElement = document.getElementById("foreground-canvas");
const backgroundElement = document.getElementById("background-canvas");
const drawingModel = new DrawingModel(foregroundElement, backgroundElement);

window.onresize = function() {
  drawingModel.resize()
};

drawingModel.start();

