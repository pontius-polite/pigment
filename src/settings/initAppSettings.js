import ColorGenerator from "../models/color/ColorGenerator";
import Color from "../models/color/Color";

const settings = {
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

  applyGlobalParticleColor: false,
  dynamicBackroundColor: false,
};

export default settings;