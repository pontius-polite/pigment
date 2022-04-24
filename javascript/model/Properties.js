
/** 
 * Properties instance govern behavior of the application, provides 'global' variables
 * without polluting namespace.
 * 
 * The state of the application is entirely dictated by its Properties instance. 
 * 
 * Performance settings: particleShape = square, targetFPS, low reflection degree (<3)
 * 
 */

class Properties {
    
    constructor() {
        /* User Inputs updated by ./InputHandler.js event listeners. */
        this.mousePos = new Vector(0, 0);
        /** Old mouse coordinates are from previous frame. */
        this.prevMousePos = new Vector(0, 0);
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
        this.particleReproduceTime = -1;
        this.reflectionStyle = "vertical"; // none, polar, horizontal, vertical, grid?
        this.reflectionDegree = 2; // 1-10?


        this.particlesCreatedPerUpdate = 1;
        this.interpolateMouseMovements = true;

        /* Particle behavior. */
        this.particleSize = 4;
        this.particleShape = "circle"
        this.particleSpeed = 3;
        this.defaultParticleColor = "white";
        this.particleColorBehavior = "independent"; // uniform, cascade?
        this.particleMovementStyle = "ant";
        this.particleGrowthSpeed = 0;  
        this.particleLifeSpan = -1;
         
        this.showDebug = true;
        this.debugSampleRate = 1; // samples per second

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


