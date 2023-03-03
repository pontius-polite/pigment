
/** 
 * State object governs behavior of the application, provides 'global' variables
 * without polluting namespace.
 * 
 * The UI menu fields only interact with the state object. 
 */

const state = {
    /* User Inputs updated by ./InputHandler.js event listeners. */
    mousePos: new Vector(0, 0),
    prevMousePos: new Vector(0, 0),
    mouseDown: false,
    spaceBarPressed: false,

    showDebug: true,
    debugSamplesPerSecond: 1,
    targetFPS: 30,
    targetDelta: Math.floor(1000.0 / 30.0),
    fpsFactor: 1, // TODO: implement changeable fps
    framesElapsed: 0,
    pausedMovement: false,
    width: 0,
    height: 0,
    reflectionStyle: "none", // none, polar, horizontal, vertical, grid?
    reflectionDegree: 2, // 1-8
    particlesCreatedPerUpdate: 1, // TODO?
    interpolateMouseMovements: true,
    interpolateParticleMovements: true,
    particleColorGen: new ColorGenerator(),
    particleColorChangeSpeed: 5.0, // 1 to 10
    backgroundColor: "#191919",
    backgroundColorBehavior: "static", // static, dynamic
    backgroundColorGen: new ColorGenerator(),
    grayscale: false, // TODO implement this

    /* Particle behavior. */
    particleSize: 4, // radius in pixels
    particleShape: "circle",
    particleSpeed: 5,
    defaultParticleColor: "white",
    particleColorBehavior: "normal", // normal, uniform, TODO: cascade 
    particleColorCascadeFrequency: 20, // TODO change to period, not frequency 
    particleMovementStyle: "creep", // none, creep, noodle, crystal, drip, bounce, orbit
    particleGrowthSpeed: 0, // pixels per second
    particleLifespan: -1, // TODO
    particleReproduceTime: -1,

    // TODO: make sure this eventually works.
    setNewFPS: function(fps) {
        this.targetFPS = fps
        this.targetDelta = Math.floor(1000.0/fps);
        this.fpsFactor = 30.0 / fps;
    },
}
