import ColorGenerator from "../color/ColorGenerator";
import Color from "../color/Color";
import Particle from "./Particle";

import { randomInt } from "../../utils/random";

/** Handles particle behavior and drawing. */
class Paintbrush {
  constructor() {
    this.particles = [];
    this.settings = {
      size: 4,
      shape: "circle",
      outline: false,

      speed: 1,
      movement: "creep",
      growthSpeed: 0,

      color: new Color(194, 100, 50),
      dynamicColor: true,
      usePaintbrushColor: false,
      grayscale: false,

      reflectionStyleOptions: ["polar", "horizontal", "vertical", "none"],
      reflectionStyle: "none",
      numReflections: 2, // 1-8

      lifespan: 10, //seconds

      interpolateMouseMovements: true,
      interpolateParticleMovements: true,
    };

    this.colorGen = new ColorGenerator(this.settings.color);

    this.updates = 0;
  }

  /** 
   * Dictionary of particle movement functions.
   * Calling a movement function on a particle will modify its properties.
   */
  applyMovementToParticle = {
    none: (p) => {},
    creep: (p) => {
      let s = this.settings.speed * 2;
      p.velocity.x = randomInt(-1 * s, s);
      p.velocity.y = randomInt(-1 * s, s);
      p.velocity.floor();
      p.applyVelocity();
    },
    // "noodle": (particle) => {
    //     particle.velocity.x += randomInt(-1 * particle.speed, particle.speed);
    //     particle.velocity.y += randomInt(-1 * particle.speed, particle.speed);

    //     particle.velocity.x = constrainValueToRange(particle.velocity.x, -1 * particle.speed, particle.speed);
    //     particle.velocity.y = constrainValueToRange(particle.velocity.y, -1 * particle.speed, particle.speed);
    // },
    // "crystal": (particle) => {
    //     if (particle.timer == 0) {
    //         let coin = randomInt(0, 1);
    //         if (coin) {
    //             particle.velocity.x = particle.speed;
    //         } else {
    //             particle.velocity.x = -1 * particle.speed;
    //         }
    //         coin = randomInt(0, 1);
    //         if (coin) {
    //             particle.velocity.y = particle.speed;
    //         } else {
    //             particle.velocity.y = -1 * particle.speed;
    //         }

    //         particle.timer = randomInt(2, 5);
    //     }
    //     particle.timer -= 1;
    // },
    // "drip": (particle) => {
    //     particle.velocity.x *= 0.95;
    //     particle.velocity.y *= 0.95;

    //     if (Math.abs(particle.velocity.y < 0.05)) {
    //         particle.velocity.x = randomFloat(-0.5, 0.5);
    //         particle.velocity.y = randomInt(1, particle.speed);

    //     }
    // },
    // "bounce": (particle) => {
    //     if (particle.lifeTime == 0) {
    //         particle.velocity.x = randomFloat(-0.5 * particle.speed, 0.5 * particle.speed);
    //         particle.velocity.y = randomFloat(-1 * particle.speed, particle.speed);
    //     }

    //     if (particle.position.y > state.height) {
    //         particle.position.y = state.height - particle.size / 2.0;
    //         particle.velocity.y *= -0.75;
    //     }

    //     particle.velocity.y += particle.speed / 10.0;
    // },
    // "orbit": (particle) => {
    //     let rotationAngle = TAU * particle.speed / 360;
    //     let midX = state.width / 2.0;
    //     let midY = state.height / 2.0

    //     // TODO: make this a formula of the velocity, not the position
    //     particle.position.x = ((particle.position.x - midX) * Math.cos(rotationAngle))
    //             - ((particle.position.y - midY) * Math.sin(rotationAngle))
    //             + midX;
    //     particle.position.y = ((particle.position.x - midX) * Math.sin(rotationAngle))
    //         + ((particle.position.y - midY) * Math.cos(rotationAngle))
    //         + midY;
    // }
  };

  /**
   * Updates particles and draws them on the given 2d canvas context.
   * @param {CanvasGrid} grid
   * @param {boolean} pauseMovement Pauses movement of particles if true.
   */
  updateAndDraw(grid, pauseMovement) {
    this.updateColor(grid);
    grid.setColor(this.settings.color);

    this.updateAndDrawParticles(grid, pauseMovement);
    this.addNewParticlesAndLines(grid);

    this.updates += 1;
  }

  /**
   * Updates particle positions according to current movement style and draws them
   * to the canvas grid.
   */
  updateAndDrawParticles(grid, pauseMovement) {
    for (let particle of this.particles) {
      if (!pauseMovement) {
        this.applyMovementToParticle[this.settings.movement](particle);
      }
      particle.draw(
        grid,
        this.settings.shape,
        this.settings.size,
        !this.outline,
        !this.settings.usePaintbrushColor
      );
    }
  }

  /**
   * Adds new particles based on mouse state and interpolates between them, if needed.
   */
  addNewParticlesAndLines(grid) {
    if (grid.mousePressed()) {
      this.addParticle(grid.mouseX(), grid.mouseY());

      if (this.shouldInterpolate(grid.mouse)) {
        this.drawMouseLineInterpolation(grid);
        this.addParticleInterpolations(grid);
      }
    }
  }

  /** Draws a line between current and previous mouse positions. */
  drawMouseLineInterpolation(grid) {
    grid.drawLine(
      grid.mouseX(),
      grid.mouseY(),
      grid.mousePreviousX(),
      grid.mousePreviousY(),
      this.settings.size
    );
  }

  /** Adds particle interpolations between current and previous mouse positions. */
  addParticleInterpolations(grid) {
    const distance = grid
      .mousePosition()
      .distanceFrom(grid.mousePreviousPosition());
    const numInterpolations = Math.floor(distance / this.settings.size) - 1;
    for (let point of grid
      .mousePosition()
      .interpolatePointsBetween(
        grid.mousePreviousPosition(),
        numInterpolations
      )) {
      this.addParticle(point.x, point.y);
    }
  }

  /** Updates the paintbrush color according to color generator. */
  updateColor(grid) {
    if (this.settings.dynamicColor) {
      if (this.settings.usePaintbrushColor || grid.mousePressed()){
        this.settings.color = this.colorGen.newColor();
      }
    }
  }

  /**
   * Returns true if the mouse movements should be interpolated.
   * @param {MouseHandler} mouse
   */
  shouldInterpolate(mouse) {
    const shouldInterpolate =
      this.settings.interpolateMouseMovements && mouse.previous.pressed;
    return shouldInterpolate;
  }

  /** Adds a particle centered at (x, y) to this paintbrush. */
  addParticle(x, y) {
    const particle = new Particle(x, y);
    particle.color = this.settings.color;
    this.particles.push(particle);
  }
}

export default Paintbrush;
