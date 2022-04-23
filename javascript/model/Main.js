
/**
 * Main.js is responsible for handling setup and update/drawing animation loop.
 * 
 * Embed Order:
 *     ./util/* 
 *     ./objects/*
 *     AppState.js
 *     Main.js
 *     InputHandler.js 
 */

const foregroundCanvas = document.getElementById("foreground");
const fgcontext = foregroundCanvas.getContext('2d');

const backgroundCanvas = document.getElementById("background");
const bgcontext = backgroundCanvas.getContext('2d');

const wrapper = document.getElementById("displayWrapper");


// TODO: add hidden rendering canvas

window.onresize = function() {
    resizeDisplay()
};

state = new AppState();

/* Data structure for storing particles. */
let particleList = new DoubleLinkedList();

let frameStartTime = Date.now();

init = (() => {
    resizeDisplay();

    fillBackground(state.backgroundColor);


    
    update();

})();

function update() {
    
    // Remove particles if framerate dips below target
    let actualDelta = Date.now() - frameStartTime;
    let factorBuffer = 1.1;
    if (Date.now() - frameStartTime > state.targetDelta) {
        trimParticlesByFactor(factorBuffer * actualDelta / state.targetDelta);
    }
    
    if (state.mouseDown) {
        console.log("held");
    }
    
    frameStartTime = Date.now();

    draw();
}

function draw () {

    
    if (state.fade){
        fgcontext.fillStyle = "rgba(0, 0, 0, 0.05)"
        fgcontext.fillRect(0, 0, $("#mainCanvas").width(), $("#mainCanvas").height());
    }

    

    fgcontext.fillStyle = "pink";
    fgcontext.fillRect(state.framesElapsed, 200, 50, 50);

    state.framesElapsed += 1;

    // Remove particles if frames dip below target
    let actualDelta = Date.now() - frameStartTime;
    let factorBuffer = 1.1;
    if (Date.now() - frameStartTime > state.targetDelta) {
        trimParticlesByFactor(factorBuffer * actualDelta / state.targetDelta);
    }
    setTimeout(() => { update(); }, state.targetDelta);
}

function trimParticlesByFactor(factor) {
    let numToRemove = Math.floor(particleList.size * factor);
    for (let i = 0; i < numToRemove; i += 1) {
        particleList.removeFirst(numToRemove);
    }
}

/** Resizes wrapper and canvas elements to the current window size and 
 * centers current drawing in newly sized area. */
function resizeDisplay() {

    //TODO (optional): use css transform instead of property change? 

    let oldWidth = wrapper.width;
    let oldHeight = wrapper.height;

    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;

    wrapper.width = newWidth;
    wrapper.height = newHeight;

    foregroundCanvas.width = newWidth;
    foregroundCanvas.height = newHeight;

    backgroundCanvas.width = newWidth;
    backgroundCanvas.height = newHeight;

    state.width = newWidth;
    state.height = newHeight;

    centerDrawing(oldWidth, newWidth, oldHeight, newHeight);
}

function fillBackground(color) {
    bgcontext.fillStyle = color;
    bgcontext.fillRect(0, 0, state.width, state.height);
}

function fillForeground(color) {
    fgcontext.fillStyle = color;
    fgcontext.fillRect(0, 0, state.width, state.height);
}
