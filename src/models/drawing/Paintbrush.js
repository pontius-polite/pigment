import ColorGenerator from "../color/ColorGenerator";
import Color from "../color/Color";
import Particle from "./Particle";

import initPaintbrushSettings from "../../settings/initPaintbrushSettings";

import { randomInt } from "../../utils/random";
import { drawLine } from "../../utils/drawing";

/** Handles particle behavior and drawing. */
class Paintbrush {
  constructor() {
    this.particles = [];

    this.color = new Color(194, 100, 50);
    this.colorGen = new ColorGenerator(this.color);

    this.settings = initPaintbrushSettings;
    this.updates = 0;
  }

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
   * @param {CanvasRenderingContext2D} context The canvas context on which to draw.
   * @param {MouseHandler}
   * @param {boolean} pauseMovement Pauses movement of particles.
   * @param {number} width Width of the canvas element.
   * @param {number} height Height of the canvas element.
   */
  updateAndDraw(context, mouse, pauseMovement) {
    this.updateColor();
    context.fillStyle = this.color;
    context.strokeStyle = this.color;

    this.updateAndDrawParticles(context, pauseMovement);

    if (mouse.pressed) {
      this.addParticle(mouse.position.x, mouse.position.y);
      if (this.shouldInterpolate(mouse)) {
        drawLine(
          context,
          mouse.position.x,
          mouse.position.y,
          mouse.previous.position.x,
          mouse.previous.position.y,
          this.settings.size
        );

        const distance = mouse.position.distanceFrom(mouse.previous.position);
        const numInterpolations = Math.floor(distance / this.settings.size) - 1;
        for (let point of mouse.position.interpolatePointsBetween(
          mouse.previous.position,
          numInterpolations
        )) {
          console.log("here");
          this.addParticle(point.x, point.y);
        }
      }
    }

    this.updates += 1;
  }

  updateAndDrawParticles(context, pauseMovement) {
    for (let p of this.particles) {
      if (!pauseMovement) {
        this.applyMovementToParticle[this.settings.movement](p);
      }
      p.draw(context, this.settings.shape, this.settings.size, !this.outline);
    }
  }

  updateColor() {
    this.color = this.colorGen.newColor();
  }

  shouldInterpolate(mouse) {
    const shouldInterpolate =
      this.settings.interpolateMouseMovements && mouse.previous.pressed;
    return shouldInterpolate;
  }

  addParticle(x, y) {
    const particle = new Particle(x, y);
    this.particles.push(particle);
  }

  draw(canvasContext) {}
}

export default Paintbrush;
