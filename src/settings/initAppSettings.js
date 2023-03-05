import ColorGenerator from "../models/color/ColorGenerator";
import Color from "../models/color/Color";

const settings = {
  paused: false,

  targetFPS: 30,
  targetDelta: Math.floor(1000 / 30),
  
  addDelta: (delta) => {},

  frameTimingData: {
    
  },

  applyGlobalParticleColor: false,
  dynamicBackroundColor: false,
};

export default settings;