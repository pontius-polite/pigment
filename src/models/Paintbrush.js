import ColorGenerator from "./ColorGenerator";
import Color from "./Color";

/** Handles particle behavior and drawing. */
class Paintbrush {
  colorBehaviorOptions = [
    "static-global",
    "dynamic-global",
    "periodic-global",
    "static",
    "dynamic",
  ];
  movementOptions = [
    "creep",
    "noodle",
    "crystal",
    "drip",
    "bounce",
    "orbit",
    "none",
  ];

  constructor() {
    this.particles = [];
    this.colorGenerator = new ColorGenerator(new Color(194, 100, 50));
    this.settings = {
      size: 4,
      shape: "circle",
      speed: 1,
      colorBehavior: this.colorBehaviorOptions[0],
      colorChangePeriod: "3", // in seconds
      movement: this.movementOptions[0],
      growthSpeed: 0, // pixels per second
      lifespan: -1, // TODO:
      reproduceTime: -1, // TODO:
    };
  }

  addParticle() {
    this.particles.push
  }

  update() {}

  draw(canvasContext) {}
}

export default Paintbrush;
