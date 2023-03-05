const settings = {
  size: 4,
  shape: "circle",
  outline: false,

  speed: 1,
  movementOptions: ["creep", "noodle", "crystal", "drip", "bounce", "orbit", "none"],
  movement: "creep",
  growthSpeed: 0,
  
  colorBehaviorOptions: ['global-dynamic', 'global-static', 'local-dynamic'],
  colorBehavior: 'global-dynamic',
  grayscale: false,

  reflectionStyleOptions: ["polar", "horizontal", "vertical", "none"],
  reflectionStyle: "none",
  numReflections: 2, // 1-8
  
  lifespan: -1, // TODO:
  
  interpolateMouseMovements: true,
  interpolateParticleMovements: true,
};

export default settings;