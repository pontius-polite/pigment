
/**
 * Main.js is responsible for handling setup and update/drawing animation loop.
 * 
 * Embed Order:
 *     util/* 
 *     objects/*
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

let particleList = new DoubleLinkedList();

let particleColorGenerator = new ColorGenerator();
let backgroundColorGenerator = new ColorGenerator(); 

let frameStartTime = Date.now();

const init = (() => {
    resizeDisplay();

    fillBackground(state.backgroundColor);


    
    updateAndDraw();
})();

function updateAndDraw() {
    // Remove particles if framerate dips below target
    let actualDelta = Date.now() - frameStartTime;
    let factorBuffer = 1.0;

    // TODO: debug this to work correctly, and don't delete particles when window is unfocused
    if (Date.now() - frameStartTime > state.targetDelta + 10) {
        trimParticlesByFactor(factorBuffer * (1 - state.targetDelta / actualDelta));
    }
    frameStartTime = Date.now();

    particleColorGenerator.update();
    backgroundColorGenerator.update();

    if (state.mouseDown) {
        createParticle();
    }

    // TODO: update and draw particles in same loop, that way we don't have to do two for-loops.
    // We can combine update and draw into a single function

    updateParticles();

    draw();
}

function draw () {

    if (state.fade){
        fgcontext.fillStyle = "rgba(0, 0, 0, 0.05)"
        fgcontext.fillRect(0, 0, $("#mainCanvas").width(), $("#mainCanvas").height());
    }


    let currentNode = particleList.sentinel;
    for (let i = 0; i < particleList.size; i += 1) {
        currentNode = currentNode.next;
        currentNode.item.draw(fgcontext);   
    }


    state.framesElapsed += 1;
    setTimeout(() => { update(); }, state.targetDelta);
}

function trimParticlesByFactor(factor) {
    let numToRemove = Math.floor(particleList.size * factor);
    for (let i = 0; i < numToRemove; i += 1) {
        particleList.removeFirst(numToRemove);
    }
}

function updateParticles() {
    let currentNode = particleList.sentinel;
    for (let i = 0; i < particleList.size; i += 1) {
        currentNode = currentNode.next;
        currentNode.item.update();   
    }
}

function drawParticles() {

}

/** Resizes wrapper and canvas elements to the current window size and 
 * centers current drawing in newly sized area. */
function resizeDisplay() {

    /* TODO (optional): use css transform instead of property change? Otherwize need to redraw frame? */


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

}

function createParticle() {
    
    p = new Particle(state.mouseX, state.mouseY);
    p.color = particleColorGenerator.color();

    //TODO: make sure all state properties are applied to new particles
    p.size = state.particleSize;
    p.speed = state.particleSpeed;
    p.movementStyle = state.particleMovementStyle;

    particleList.addLast(p)
}

function fillBackground(color) {
    bgcontext.fillStyle = color;
    bgcontext.fillRect(0, 0, state.width, state.height);
}

function fillForeground(color) {
    fgcontext.fillStyle = color;
    fgcontext.fillRect(0, 0, state.width, state.height);
}
