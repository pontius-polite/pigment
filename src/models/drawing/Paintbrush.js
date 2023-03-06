import ColorGenerator from "../color/ColorGenerator";
import Color from "../color/Color";
import Particle from "./Particle";

import getReflectionPoints from "./getReflectionPoints";
import { randomInt } from "../../utils/random";

/** Handles particle behavior and drawing. */
class Paintbrush {
  constructor() {
    this.particles = [];
    this.settings = {
      size: 5,
      shape: "circle",
      outline: false,

      speed: 1,
      movement: "creep",
      growthSpeed: 0,

      color: new Color(194, 100, 50),
      dynamicColor: true,
      usePaintbrushColor: false,
      grayscale: false,

      reflection: {
        type: "polar",
        amount: 20,
      },

      lifespan: Math.floor(10 * 30),

      interpolateMouseMovements: true,
      interpolateParticleMovements: true,
    };

    this.colorGen = new ColorGenerator(this.settings.color);

    this.updates = 0;
  }

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
        particle.update(this.settings.movement, this.settings.speed); 
        this.killVagrantParticle(particle, grid);
      }
      this.drawParticle(particle, grid);
    }
    this.removeDeadParticles();
  }

  /**
   * Draws the particle onto the grid and interpolates its movement with a line.
   */
  drawParticle(particle, grid) {
    particle.draw(
      grid,
      this.settings.shape,
      this.settings.size,
      !this.outline,
      this.settings.usePaintbrushColor
    );

    if (this.settings.interpolateParticleMovements) {
      grid.drawLine(
        particle.prevPosition.x,
        particle.prevPosition.y,
        particle.position.x,
        particle.position.y,
        this.settings.size
      );
    }

    if (this.settings.reflection.style !== "none") {
      this.drawReflection(particle, grid);
    }
  }

  drawReflection(particle, grid) {
    const points = getReflectionPoints(
      particle.position,
      this.settings.reflection
    );
    let prevPoints = null;
    if (this.settings.interpolateParticleMovements) {
      prevPoints = getReflectionPoints(
        particle.prevPosition,
        this.settings.reflection
      );
    }
    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      grid.drawShape(
        this.settings.shape,
        point.x,
        point.y,
        this.settings.size,
        !this.settings.outline
      );
      if (prevPoints) {
        const prevPoint = prevPoints[i];
        grid.drawLine(
          prevPoint.x,
          prevPoint.y,
          point.x,
          point.y,
          this.settings.size
        );
      }
    }

  }

  /**
   * Adds new particles based on mouse state and interpolates between them, if needed.
   */
  addNewParticlesAndLines(grid) {
    if (grid.mousePressed()) {
      this.addParticle(grid.mouseX(), grid.mouseY());

      if (this.shouldInterpolate(grid.mouse)) {
        this.drawMouseInterpolation(grid);
        this.addParticleInterpolations(grid);
      }
    }
  }

  /** Draws a line between current and previous mouse positions. */
  drawMouseInterpolation(grid) {
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

  /** Increases the age of particles that have travelled too far out of the view bounds. */
  killVagrantParticle(particle, grid) {
    const shouldParticleDie =
      Math.abs(particle.position.x) > grid.width ||
      Math.abs(particle.position.y) > grid.height;
    if (shouldParticleDie) {
      particle.age = this.settings.lifespan;
    }
  }

  removeDeadParticles() {
    let i = 0;
    if (this.particles.length > 0) {
      while (
        i < this.particles.length &&
        this.particles[i].age >= this.settings.lifespan
      ) {
        i += 1;
      }
      this.particles.splice(0, i);
    }
  }

  /** Updates the paintbrush color according to color generator. */
  updateColor(grid) {
    if (this.settings.dynamicColor) {
      if (this.settings.usePaintbrushColor || grid.mousePressed()) {
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
