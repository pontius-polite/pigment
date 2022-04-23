
/** 
 * Properties of AppState instance govern behavior of the application.
 * 
 * Provides functionality for exporting and importing JSON data presets. 
 */

class AppState {
    
    constructor() {
        /* User Inputs updated by ./InputHandler.js event listeners. */
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        this.spaceBarPressed = false;

        /* Application behavior. */
        this.targetFPS = 30;
        this.framesElapsed = 0;
        this.targetDelta = this.calculateTargetDelta();
        
        this.paused = false;
        
        this.width = 0;
        this.height = 0;
        this.backgroundColor = "#191919";

        this.fade = false;
        this.mirrorType = "none"; // polar, horizontal, vertical
        this.polarMirrorDegree = 6;

        /* Particle behavior. */
        this.particleSize = 5;
        this.particleSpeed = 5;
        this.particleColor = "white";
        this.particleMovementStyle = "fungus"
        this.particleSize = 4;
        this.lifeTime = -1;
        this.growthSpeed = 0;   

    }

    /** Returns the number of milliseconds that should occur between updates/draws to 
     * maintain targetFPS.
    */
    calculateTargetDelta() {
        return Math.floor(1000.0/this.targetFPS);
    }

    loadPresetFromJSON(text) {

    }
}


