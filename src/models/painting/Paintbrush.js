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

      size: 4,
      growthSpeed: 1,
      shape: "circle",
      outline: false,

      speed: 1,
      movement: "none",

      brushColor: new Color(194, 100, 50),
      brushColorGen: {
        style: "cycleLightness",
        speed: 1,
        period: 1,
      },
      dynamicBrushColor: true,
      useBrushColor: false,

      particleColorGen: {
        style: "cycleHue",
        speed: 1,
        period: 1,
      },
      dynamicParticleColor: false, // Lowers performance

      reflection: {
        type: "polar",
        amount: 3,
      },

      lifespan: Math.floor(10 * 30),

      interpolateMouse: true,
      interpolateParticles: true,
    };

    this.brushColorGenerator = this.createBrushColorGenerator();
    this.updates = 0;
  }

  /** Creates a new ColorGenerator with parameters determined by this.settings.colorGen. */
  createBrushColorGenerator() {
    const colorGen = new ColorGenerator(this.settings.brushColor);
    colorGen.style = this.settings.brushColorGen.style;
    colorGen.speed = this.settings.brushColorGen.speed;
    colorGen.period = this.settings.brushColorGen.period;
    return colorGen;
  }

  /**
   * Updates particles and draws them on the given 2d canvas context.
   * @param {CanvasGrid} grid
   * @param {boolean} pauseMovement Pauses movement of particles if true.
   */
  updateAndDraw(grid) {
    this.updateColor(grid);
    grid.setColor(this.settings.brushColor);

    this.updateAndDrawParticles(grid);
    this.addNewParticlesAndInterpolations(grid);

    this.updates += 1;
  }

  /** Updates the paintbrush color according to color generator. */
  updateColor(grid) {
    if (this.settings.dynamicBrushColor) {
      if (grid.mousePressed()) {
        this.settings.brushColor = this.brushColorGenerator.newColor();
      }
    }
  }

  /**
   * Updates particle positions according to current movement style and draws them
   * to the canvas grid.
   */
  updateAndDrawParticles(grid) {
    for (let particle of this.particles) {
      this.updateParticle(particle, grid);
      this.drawParticle(particle, grid);
      if (this.settings.reflection.style !== "none") {
        this.drawParticleReflections(particle, grid);
        this.drawMouseReflections(grid);
      }
    }
    this.removeDeadParticles();
  }

  /**
   * Updates particle position and age.
   */
  updateParticle(particle, grid) {
    if (!this.settings.pauseMovement) {
      particle.update(
        this.settings.movement,
        this.settings.speed,
        this.settings.growthSpeed
      );
      this.senesceInvalidParticle(particle, grid);
    }
  }

  /**
   * Increases the age of particles particles that are invalid such that they exceed this brush's
   * lifespan. Particles are invalid if their position is too far out of bounds or their
   * size too small/large.
   */
  senesceInvalidParticle(particle, grid) {
    const shouldParticleDie =
      particle.size <= 0 ||
      Math.max(grid.width, grid.height) < particle.size ||
      Math.abs(particle.position.x) > grid.width ||
      Math.abs(particle.position.y) > grid.height;

    if (shouldParticleDie) {
      particle.age = this.settings.lifespan;
    }
  }

  /**
   * Draws the particle onto the grid and interpolates its movement with a line.
   * @param {Particle} particle
   * @param {CanvasGrid} grid
   */
  drawParticle(particle) {
    if (!this.settings.useBrushColor) {
      if (particle.colorGenerator) {
        particle.color = particle.colorGenerator.newColor();
      }
      this.grid.setColor(particle.color);
    }
    this.grid.drawShape(this.shape, particle.position.x, particle.position.y, particle.size, fill);
    this.drawParticleMovementInterpolation(particle);
  }

  drawParticleMovementInterpolation(particle) {
    if (this.settings.interpolateParticles) {
      this.grid.drawLine(
        particle.prevPosition.x,
        particle.prevPosition.y,
        particle.position.x,
        particle.position.y,
        particle.size
      );
    }
  }

  /**
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
        grid.drawLine(
          prevPoint.x,
          prevPoint.y,
          point.x,
          point.y,
          particle.size
        );
      }
    }
  }

  /**
   * Draws reflected interpolations of the mouse movement.
   * @param {CanvasGrid} grid
   */
  drawMouseReflections(grid) {
    if (this.shouldInterpolateMouse(grid)) {
      const points = getReflectionPoints(
        grid.mousePosition(),
        this.settings.reflection
      );
      const prevPoints = getReflectionPoints(
        grid.mousePreviousPosition(),
        this.settings.reflection
      );
      for (let i = 0; i < points.length; i += 1) {
        const point = points[i];
        const prevPoint = prevPoints[i];
        grid.drawLine(
          point.x,
          point.y,
          prevPoint.x,
          prevPoint.y,
          this.settings.size
        );
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
  addNewParticlesAndInterpolations(grid) {
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
    const newParticle = new Particle(x, y);
    newParticle.color = this.settings.brushColor;
    newParticle.size = this.settings.size;
    if (this.settings.dynamicParticleColor) {
      newParticle.colorGenerator = this.createBrushColorGenerator();
      newParticle.colorGenerator.style = "cycleHue";
    }
    this.particles.push(newParticle);
  }

  removeParticles(num) {
    this.particles.splice(0, num);
  }
}

export default Paintbrush;
