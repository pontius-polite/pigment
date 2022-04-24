
/** 
 * Properties instance govern behavior of the application.
 * 
 * Provides functionality for exporting and importing JSON data presets. 
 */

class Properties {
    
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

        this.particlesCreatedPerUpdate = 1;

        /* Particle behavior. */
        this.particleSize = 1;
        this.particleShape = "circle"
        this.particleSpeed = 3;
        this.defaultParticleColor = "white";
        this.particleColorBehavior = "independent"; // uniform, cascade?
        this.particleMovementStyle = "ant";
        this.particleGrowthSpeed = 0;  
        this.particleLifeSpan = -1;
        this.particleReproduceTime = -1;
         

        this.showDebug = true;

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


