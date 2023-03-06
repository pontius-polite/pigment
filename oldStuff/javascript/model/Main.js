
/**
 * Load Order:
 *     model/Properties.js
 *     util/* 
 *     objects/ColorGenerator.js
 *     objects/Vector.js
 *     objects/Particle.js
 *     model/Main.js
 *     model/InputHandler.js 
 */

const foregroundCanvas = document.getElementById("foreground");
const fgcontext = foregroundCanvas.getContext('2d');

const backgroundCanvas = document.getElementById("background");
const bgcontext = backgroundCanvas.getContext('2d');

const wrapper = document.getElementById("displayWrapper");

// TODO: add hidden rendering canvas

let particleList = new DoubleLinkedList();  



const frameTimingData = {
    frameStartTime: Date.now(),
    actualFrameDelta: 0,
    /** The amount of time that the next updateAndDraw call should be delayed. */
    updateTimeoutDelay: 0,
    /** The number of previous frames included in the averageFrameDelta calculation. */
    averageFrameDeltaSampleSize: 30,
    /** The average amount of time for update and drawing completion. */
    averageFrameDelta: 0,
    previousFrameDeltas: []
}

// TODO: instead of deleting particles from last frameDelta, delete from average of many frames

// TODO: don't delete particles when window out of focus

const init = () => {
    
    resizeDisplay();

    fillBackground(state.backgroundColor);

    if (state.showDebug) {
        $("#debugWrapper").show();
    }

    applyStateToMenuFields();
    
    updateAndDraw();

};

function updateAndDraw() {

    if (frameTimingData.actualFrameDelta > state.targetDelta) {
        let factor = state.targetDelta / frameTimingData.actualFrameDelta;
        factor *= 0.9; // Apply a small buffer to make factor smaller.
        trimParticlesByFactor(factor);
    }

    frameTimingData.frameStartTime = Date.now();

    if (state.grayscale) {
        state.color = state.particleColorGen.grayscaleColor();
    } else {
        state.color = state.particleColorGen.color();
    }

    if (state.backgroundColorBehavior == "dynamic") {
        
    }

    if (state.mouseDown && state.interpolateMouseMovements && state.reflectionStyle == "none") {
        drawLine(fgcontext, state.prevMousePos.x, state.prevMousePos.y, state.mousePos.x, state.mousePos.y, state.particleSize, state.particleColorGen.color());
    }

    updateAndDrawParticles();

    /* Create particles if mouse is held down. */
    if (state.mouseDown) {
        createParticle();     
    }
    
    if (state.mouseDown || state.particleColorBehavior == "uniform") {
        state.particleColorGen.update();
    }

    if (state.showDebug) {
        updateDebugDisplay();
        $("#debugWrapper").show();
    } else {
        $("#debugWrapper").hide();
    }
    
    state.prevMousePos.x = state.mousePos.x;
    state.prevMousePos.y = state.mousePos.y;
    state.framesElapsed += 1;

    frameTimingData.actualFrameDelta = Date.now() - frameTimingData.frameStartTime;
    frameTimingData.updateTimeoutDelay = state.targetDelta - frameTimingData.actualFrameDelta;
    if (frameTimingData.updateTimeoutDelay < 0) {
        frameTimingData.updateTimeoutDelay = 0;
    }
    setTimeout(() => { updateAndDraw(); }, (frameTimingData.updateTimeoutDelay));    
}

// TODO Add an iterator to the double linked list class
function updateAndDrawParticles() {
    let currentNode = particleList.sentinel;
    for (let i = 0; i < particleList.size; i += 1) {
        currentNode = currentNode.next;
        if (!state.pausedMovement) {
            currentNode.item.update();
        }
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



/** Resizes wrapper and canvas elements to the current window size and 
 * centers current drawing in newly sized area. */
function resizeDisplay() {

    /* TODO (optional): use css transform instead of property change? Otherwize need to redraw frame? */

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

    fillBackground(state.backgroundColor);

}

function createParticle() {
    // TODO: particle reproduction?
    if (state.interpolateMouseMovements && state.reflectionStyle == "none") {
        points = state.prevMousePos.interpolatePoints(state.mousePos, state.particleSize - 2);
        for (let i = 0; i < points.length; i += 1) {
            p = new Particle(points[i], state);
            particleList.addLast(p);
        }
    }
    
    p = new Particle(state.mousePos, state);
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

function clearForeground() {
    fgcontext.clearRect(0, 0, state.width, state.height);
}

function clearAll() {
    fgcontext.clearRect(0, 0, state.width, state.height);
    bgcontext.fillStyle = state.backgroundColor;
    bgcontext.fillRect(0, 0, state.width, state.height);
}

function clearParticles() {
    particleList = new DoubleLinkedList();
}

/** Fills in data into debug table. */
function updateDebugDisplay() {
    if (state.framesElapsed % (state.targetFPS / state.debugSamplesPerSecond) == 0) {
        let currentFPS = state.targetFPS;
        document.getElementById("debugFPS").innerHTML = currentFPS;
        document.getElementById("debugDelta").innerHTML = frameTimingData.actualFrameDelta;
        document.getElementById("debugMousePos").innerHTML = state.mousePos.x + ", " + state.mousePos.y;
        document.getElementById("debugMouseDown").innerHTML = state.mouseDown;
        document.getElementById("debugNumParticles").innerHTML = particleList.size;
        document.getElementById("debugColor").innerHTML = state.particleColorGen.color();
    } 
}

$( document ).ready( init );