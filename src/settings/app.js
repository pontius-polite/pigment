import ColorGenerator from "../models/ColorGenerator";

const app = {
  paused: false,

  targetFPS: 30,
  targetDelta: Math.floor(1000 / 30),
  previousDeltas: [],
  addDelta: (delta) => {},

  frameTimingData: {
    frameStartTime: Date.now(),
    actualFrameDelta: 0,
    /** The amount of time that the next updateAndDraw call should be delayed. */
    updateTimeoutDelay: 0,
    /** The number of previous frames included in the averageFrameDelta calculation. */
    averageFrameDeltaSampleSize: 30,
    /** The average amount of time for update and drawing completion. */
    averageFrameDelta: 0,
    previousFrameDeltas: [],
  },

  reflectionStyles: ["none", "polar", "horizontal", "vertical", "grid"],
  reflectionStyle: "none",
  numReflections: 2, // 1-8

  interpolateMouseMovements: true,
  interpolateParticleMovements: true,

  staticGlobalColor: false,
  globalParticleColorGen: new ColorGenerator(),
  globalParticleColorSpeed: 1,
  grayscale: false,

  backgroundColor: "#181621",
  staticBackgroundColor: true,
  backgroundColorGen: new ColorGenerator(),
};

export default app;
