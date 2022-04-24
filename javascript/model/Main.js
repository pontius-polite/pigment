
/**
 * Main.js is responsible for handling setup and update/drawing animation loop.
 * 
 * Embed Order:
 *     util/* 
 *     objects/ColorGenerator.js
 *     objects/Point.js
 *     objects/Particle.js
 *     model/Properties.js
 *     model/Main.js
 *     model/InputHandler.js 
 */

const foregroundCanvas = document.getElementById("foreground");
const fgcontext = foregroundCanvas.getContext('2d');

const backgroundCanvas = document.getElementById("background");
const bgcontext = backgroundCanvas.getContext('2d');

const wrapper = document.getElementById("displayWrapper");

// TODO: add hidden rendering canvas

const props = new Properties();

let particleList = new DoubleLinkedList();  

let particleColorGenerator = new ColorGenerator();
let backgroundColorGenerator = new ColorGenerator(); 

// Used for measuring animation times.
let frameStartTime = Date.now();
let actualFrameDelta = 0;
let updateTimeoutDelay = 0;

const init = (() => {

    if (!props.showDebug) {
        $("#debugWrapper").hide();
    }
    
    resizeDisplay();

    fillBackground(props.backgroundColor);

    
    updateAndDraw();
})();

function updateAndDraw() {

    if (actualFrameDelta > props.targetDelta) {
        let factor = props.targetDelta / actualFrameDelta;
        factor *= 0.9; // Apply a small buffer to make factor smaller.
        trimParticlesByFactor(factor);
    }

    frameStartTime = Date.now();

    backgroundColorGenerator.update();

    if (props.fade){
        fgcontext.fillStyle = "rgba(0, 0, 0, 0.05)"
        fgcontext.fillRect(0, 0, $("#mainCanvas").width(), $("#mainCanvas").height());
    }

    // TODO: interpolation function - creates line of points between two coordinates with specified interval

    if (props.mouseDown) {
        particleColorGenerator.update();
        for (let i = 0; i < props.particlesCreatedPerUpdate; i += 1){
            createParticle();
        }
    }

    updateAndDrawParticles();

    if (props.showDebug && props.framesElapsed % props.targetFPS == 0) {
        updateDebugDisplay();
    }

    props.framesElapsed += 1;

    // actualFrameDelta is the time in ms it took to draw and update everything. 
    actualFrameDelta = Date.now() - frameStartTime;

    // Adjust how long the next updateAndDraw() call is delayed based on the actualFrameDelta and the properties's target FPS.
    updateTimeoutDelay = props.targetDelta - actualFrameDelta;
    updateTimeoutDelay = (updateTimeoutDelay > 0) ? props.targetDelta - actualFrameDelta : 0;
    setTimeout(() => { updateAndDraw(); }, (updateTimeoutDelay));
}

function updateAndDrawParticles() {
    let currentNode = particleList.sentinel;
    for (let i = 0; i < particleList.size; i += 1) {
        currentNode = currentNode.next;
        currentNode.item.update();
        currentNode.item.draw(fgcontext);    
    }
}

/** Trims the particleList to be of size (particleList.size * factor) by removing first elements. */
function trimParticlesByFactor(factor) {
    let numToRemove = particleList.size - Math.floor(particleList.size * factor);
    for (let i = 0; i < numToRemove; i += 1) {
        particleList.removeFirst(numToRemove);
    }
}

window.onresize = function() {
    resizeDisplay()
};

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

    props.width = newWidth;
    props.height = newHeight;

}

/** Fills in data into debug table. */
function updateDebugDisplay() {
    let fps = Math.floor(1000.0/actualFrameDelta);
    fps = (fps > props.targetFPS) ? props.targetFPS : fps; 
    $("#debugFPS").html(fps);
    $("#debugDelta").html(actualFrameDelta + " ms");
    $("#debugNumParticles").html(particleList.size);
    $("#debugColor").html(particleColorGenerator.color());
}

function createParticle() {
    
    p = new Particle(props.mouseX, props.mouseY, props);
    p.color = particleColorGenerator.color();

    //TODO: make sure all properties are applied to new particles
    p.size = props.particleSize;
    p.speed = props.particleSpeed;
    p.movementStyle = props.particleMovementStyle;

    particleList.addLast(p)
}

function fillBackground(color) {
    bgcontext.fillStyle = color;
    bgcontext.fillRect(0, 0, props.width, props.height);
}

function fillForeground(color) {
    fgcontext.fillStyle = color;
    fgcontext.fillRect(0, 0, props.width, props.height);
}

function clearForeground() {
    fgcontext.clearRect(0, 0, props.width, props.height);
}

function clearAll() {
    fgcontext.clearRect(0, 0, props.width, props.height);
    bgcontext.clearRect(0, 0, props.width, props.height);
}
