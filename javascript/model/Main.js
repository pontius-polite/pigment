
/**
 * Script responsible for handling setup, application state, and update/drawing loops.
 * Dependencies:
 *  - DoubleLinkedList.js
 *  - Particle.js 
 */


const canvasElement = document.getElementById("pigmentCanvas");
const ctx = canvasElement.getContext('2d');

initInputHandling(canvasElement);

window.onload = function() {init()};
window.onresize = function() {resizeCanvas()};

let particleList = new DoubleLinkedList();

/* Globals controlled by InputHandler.js */
let mousePositionX = 0;
let mousePositionY = 0;
let mouseDown = false;
let spaceBarPressed = false;

console.log(particleList.size);
for (i = 0; i < 1000; i ++) {
    particleList.addLast(i);
}
console.log(particleList.size);
for (i = 0; i < 1000; i ++) {
    console.log(particleList.removeFirst(i));
}
console.log(particleList.size);

function init() {
    resizeCanvas();
}

/** Resizes canvas element and centers current drawing in newly sized area. */
function resizeCanvas() {

    let oldWidth = canvasElement.width;
    let oldHeight = canvasElement.height;

    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;

    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    centerDrawing(oldWidth, newWidth, oldHeight, newHeight);
}

function centerDrawing(oldWidth, newWidth, oldHeight, newHeight) {
    //TODO
    // for ant in ants, multiple x and y by proportion of new and old dimensions
    // move what's already drawn over? 
}

(function() {
    console.log(particleList.size);
    for (i = 0; i < 1000; i ++) {
        particleList.addLast(i);
    }
    console.log(particleList.size);
    for (i = 0; i < 1000; i ++) {
        console.log(particleList.removeFirst(i));
    }
    console.log(particleList.size);
});