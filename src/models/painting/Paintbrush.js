import ColorGenerator from "../color/ColorGenerator";
import Color from "../color/Color";
import Particle from "./Particle";

import getReflectionPoints from "./getReflectionPoints";

/** Handles particle behavior and drawing. */
class Paintbrush {
  constructor() {
    this.particles = [];
    this.settings = {
      pauseMovement: false,

      size: 6,
      growthSpeed: 1,
      shape: "circle",
      outline: false,

      speed: 1,
      movement: "none",

      color: new Color(194, 100, 50),
      dynamicColor: true,
      usePaintbrushColor: false,
      grayscale: false,

      reflection: {
        type: "polar",
        amount: 3,
      },

      lifespan: Math.floor(10 * 30),

      interpolateMouse: true,
      interpolateParticles: true,
    };

    this.colorGen = new ColorGenerator(this.settings.color);

    this.updates = 0;
  }

  /**
   * Updates particles and draws them on the given 2d canvas context.
   * @param {CanvasGrid} grid
   * @param {boolean} pauseMovement Pauses movement of particles if true.
   */
  updateAndDraw(grid) {
    this.updateColor(grid);
    grid.setColor(this.settings.color);

    this.updateAndDrawParticles(grid);
    this.addNewParticlesAndLines(grid);

    this.updates += 1;
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
   * Updates particle positions according to current movement style and draws them
   * to the canvas grid.
   */
  updateAndDrawParticles(grid) {
    for (let particle of this.particles) {
      if (!this.settings.pauseMovement) {
        particle.update(
          this.settings.movement,
          this.settings.speed,
          this.settings.growthSpeed
        );
        this.senesceInvalidParticle(particle, grid);
      }
      this.drawParticle(particle, grid);
      if (this.settings.reflection.style !== "none") {
        this.drawParticleReflections(particle, grid);
      }
    }
    this.removeDeadParticles();
  }

  /** 
   * Increases the age of particles particles that are invalid such that they exceed this brush's
   * lifespan. Particles are invalid if their position is too far out of bounds or their
   * size too small/large. 
   */
  senesceInvalidParticle(particle, grid) {
    const shouldParticleDie =
      Math.abs(particle.position.x) > grid.width ||
      Math.abs(particle.position.y) > grid.height ||
      particle.size <= 0 ||
      Math.max(grid.width, grid.height) < particle.size;
    if (shouldParticleDie) {
      particle.age = this.settings.lifespan;
    }
  }

  /**
   * Draws the particle onto the grid and interpolates its movement with a line.
   * @param {Particle} particle
   * @param {CanvasGrid} grid
   */
  drawParticle(particle, grid) {
    particle.draw(
      grid,
      this.settings.shape,
      !this.settings.outline,
      this.settings.usePaintbrushColor,
      this.settings.interpolateParticles
    );
  }

  /** FIXME:
   * Draws reflections of particle.
   * @param {Particle} particle
   * @param {CanvasGrid} grid
   */
  drawParticleReflections(particle, grid) {
    const points = getReflectionPoints(
      particle.position,
      this.settings.reflection
    );
    
    // Interpolate reflected particle movements per setting. 
    let prevPoints = null;
    if (this.settings.interpolateParticles) {
      prevPoints = getReflectionPoints(
        particle.prevPosition,
        this.settings.reflection
      );
    }

    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      this.drawParticleCopy(particle, point, grid);

      if (prevPoints) {
        const prevPoint = prevPoints[i];
        grid.drawLine(prevPoint.x, prevPoint.y, point.x, point.y, particle.size);
      }
    }
  }

  /**
   * Draws copy of the particle to the given point location.
   * @param {Particle} particle 
   * @param {Point} point 
   * @param {CanvasGrid} grid 
   */
  drawParticleCopy(particle, point, grid) {
    grid.drawShape(
      this.settings.shape,
      point.x,
      point.y,
      particle.size,
      !this.settings.outline
    );
  }

  /**
   * Adds new particles based on mouse state and interpolates between them, if needed.
   */
  addNewParticlesAndLines(grid) {
    if (grid.mousePressed()) {
      this.addParticle(grid.mouseX(), grid.mouseY());

      if (this.shouldInterpolateMouse(grid)) {
        this.drawMouseInterpolation(grid);
        this.addParticleInterpolations(grid);
      }
    }
  }

  /**
   * Returns true if the mouse movements should be interpolated.
   * @param {CanvasGrid}
   */
  shouldInterpolateMouse(grid) {
    return this.settings.interpolateMouse && grid.mouse.previous.pressed;
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

  

  /**
   * Removes particles whose ages are greater than the paintbrush lifespan.
   */
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

  

  /** Adds a particle centered at (x, y) to this paintbrush. */
  addParticle(x, y) {
    const particle = new Particle(x, y);
    particle.color = this.settings.color;
    particle.size = this.settings.size;
    this.particles.push(particle);
  }

  removeParticles(num) {
    this.particles.splice(0, num);
  }
}

export default Paintbrush;
