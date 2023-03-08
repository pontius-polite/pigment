import ColorGenerator from "../color/ColorGenerator";
import Color from "../color/Color";
import Particle from "./Particle";

import getReflectionPoints from "./getReflectionPoints";

import functionTimer from "../../utils/functionTimer";


/** Handles particle behavior and drawing. */
class Paintbrush {
  constructor() {
    this.particles = [];
    this.settings = {
      pauseMovement: false,

      size: 1,
      growthSpeed: 0,
      shape: "circle", 
      outline: false,

      speed: 1,
      movement: "creep",
      bounce: true,
      followMouse: false,

      brushColor: new Color(194, 100, 50),
      brushColorGen: {
        style: "cycleHue",
        speed: 2,
        interval: 1,
      },
      dynamicBrushColor: true,
      useBrushColor: false,

      particleColorGen: {
        style: "cycleHue",
        speed: 2,
        interval: 1,
      },
      dynamicParticleColor: false,

      reflection: {
        type: "none",
        amount: 8,
      },

      lifespan: Math.floor(10 * 30),

      interpolateMouse: true,
      interpolateParticles: false,
    };

    this.brushColorGenerator = this.createBrushColorGenerator();
    this.updates = 0;
  }

  /** Creates a new ColorGenerator with parameters determined by this.settings.colorGen. */
  createBrushColorGenerator() {
    const colorGen = new ColorGenerator(this.settings.brushColor.copy());
    colorGen.style = this.settings.brushColorGen.style;
    colorGen.speed = this.settings.brushColorGen.speed;
    colorGen.interval = this.settings.brushColorGen.interval;
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

    this.addNewParticles(grid);
    this.drawMouseInterpolation(grid);
    this.updateAndDrawParticles(grid);

    this.updates += 1;
  }

  /**
   * Updates the paintbrush color if the mouse is pressed.
   * @param {CanvasGrid} grid
   */
  updateColor(grid) {
    if (this.settings.dynamicBrushColor && grid.mousePressed()) {
      this.settings.brushColor = this.brushColorGenerator.newColor();
    }
  }

  /**
   * Adds new particles based on mouse state and interpolates between them, if needed.
   * @param {CanvasGrid} grid
   */
  addNewParticles(grid) {
    if (grid.mousePressed()) {
      this.addParticle(grid.mousePosition());

      if (this.shouldInterpolateMouse(grid)) {
        this.addParticleMouseInterpolations(grid);
      }
    }
  }

  /**
   * Returns true if the mouse movements should be interpolated.
   * @param {CanvasGrid} grid
   */
  shouldInterpolateMouse(grid) {
    return (
      this.settings.interpolateMouse &&
      grid.mouse.pressed &&
      grid.mouse.previous.pressed
    );
  }

  /**
   * Adds a particle centered the given Point.
   * The particle will inherit the settings of this paintbrush.
   * @param {Point} point
   */
  addParticle(point) {
    const newParticle = new Particle(point.x, point.y);
    newParticle.color = this.settings.brushColor.copy();
    newParticle.size = this.settings.size;
    if (this.settings.dynamicParticleColor) {
      newParticle.colorGenerator = this.createParticleColorGenerator();
      newParticle.colorGenerator.style = "cycleHue";
    }
    this.particles.push(newParticle);
  }

  /** Creates a new ColorGenerator with parameters determined by this.settings.colorGen. */
  createParticleColorGenerator() {
    const colorGen = new ColorGenerator(this.settings.brushColor.copy());
    colorGen.style = this.settings.particleColorGen.style;
    colorGen.speed = this.settings.particleColorGen.speed;
    colorGen.interval = this.settings.particleColorGen.interval;
    return colorGen;
  }

  /**
   * Adds particles between current and previous mouse positions.
   * @param {CanvasGrid} grid
   */
  addParticleMouseInterpolations(grid) {
    const distance = grid.mouseMoveDistance();
    const numInterpolations = Math.floor(distance / this.settings.size) + 1;
    const points = grid
      .mousePosition()
      .interpolatePointsBetween(
        grid.mousePreviousPosition(),
        numInterpolations
      );
    for (let point of points) {
      this.addParticle(point);
    }
  }

  /**
   * Draws a line between current and previous mouse positions.
   * @param {CanvasGrid} grid
   */
  drawMouseInterpolation(grid) {
    if (this.shouldInterpolateMouse(grid)) {
      grid.drawLine(
        grid.mouseX(),
        grid.mouseY(),
        grid.mousePreviousX(),
        grid.mousePreviousY(),
        this.settings.size
      );
      if (this.shouldReflectionBeDrawn()) {
        this.drawMouseInterpolationReflections(grid);
      }
    }
  }

  /**
   * Returns true if reflections should be drawn.
   * @returns {boolean}
   */
  shouldReflectionBeDrawn() {
    return this.settings.reflection.type !== "none";
  }

  /**
   * Draws reflected interpolations of the mouse movement.
   * @param {CanvasGrid} grid
   */
  drawMouseInterpolationReflections(grid) {
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
   * Updates particle positions according to current movement style and draws them
   * to the canvas grid.
   * @param {CanvasGrid} grid
   */
  updateAndDrawParticles(grid) {
    for (let particle of this.particles) {
      this.updateParticle(particle, grid);
      this.drawParticle(particle, grid);
    }
    this.removeDeadParticles();
  }

  /**
   * Updates particle position and age.
   * @param {Particle} particle
   * @param {CanvasGrid} grid
   */
  updateParticle(particle, grid) {
    if (!this.settings.pauseMovement) {
      particle.updatePrevPosition();
      particle.applyMovementDynamic(
        this.settings.movement,
        this.settings.speed,
        grid
      );
      if (this.settings.bounce) {
        this.bounceParticle(particle, grid);
      }
      if (this.settings.followMouse) {
        this.driftToMouse(particle, grid);
      }

      particle.size = particle.size + this.settings.growthSpeed;
      particle.age += 1;

      particle.applyVelocity();

      this.senesceInvalidParticle(particle, grid);
    }
  }

  /**
   * Adjust particle velocity if it hits the edge of the grid.
   * @param {Particle} particle
   * @param {CanvasGrid} grid
   */
  bounceParticle(particle, grid) {
    const gridW = grid.width / 2;
    const gridH = grid.height / 2;
    const efficieny = -0.9;
    if (particle.position.x > gridW) {
      particle.position.x = gridW;
      particle.velocity.x *= efficieny;
    }
    if (particle.position.x < gridW * -1) {
      particle.position.x = gridW * -1;
      particle.velocity.x *= efficieny;
    }
    if (particle.position.y > gridH) {
      particle.position.y = gridH;
      particle.velocity.y *= efficieny;
    }
    if (particle.position.y < gridH * -1) {
      particle.position.y = gridH * -1;
      particle.velocity.y *= efficieny;
    }
  }

  /**
   * Adjust particle velocity to move towards the mouse.
   * @param {Particle} particle 
   * @param {CanvasGrid} grid 
   */
  driftToMouse(particle, grid) {
    const driftSpeed = this.settings.speed * 0.0005;
    const xDif = grid.mousePosition().x - particle.position.x;
    const yDif = grid.mousePosition().y - particle.position.y;
    particle.velocity.x += driftSpeed * xDif;
    particle.velocity.y += driftSpeed * yDif;
  }

  /**
   * Increases the age of particles particles that are invalid such that they exceed this brush's
   * lifespan. Particles are invalid if their position is too far out of bounds or their
   * size too small/large.
   * @param {Particle} particle
   * @param {CanvasGrid} grid
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
  drawParticle(particle, grid) {
    this.setGridColor(particle, grid);
    grid.drawShape(
      this.settings.shape,
      particle.position.x,
      particle.position.y,
      particle.size,
      !this.settings.outline
    );
    this.drawParticleMovementInterpolation(particle, grid);
    if (this.shouldReflectionBeDrawn()) {
      this.drawParticleReflections(particle, grid);
    }
  }

  /**
   * Sets the color of the grid for drawing particles and reflections.
   * @param {Particle} particle
   * @param {CanvasGrid} grid
   */
  setGridColor(particle, grid) {
    if (!this.settings.useBrushColor) {
      if (this.settings.dynamicParticleColor && particle.colorGenerator) {
        particle.color = particle.colorGenerator.newColor();
      }
      grid.setColor(particle.color);
    }
  }

  /**
   * Draws a line between the particle's current and previous positions.
   * @param {Particle} particle
   * @param {CanvasGrid} grid
   */
  drawParticleMovementInterpolation(particle, grid) {
    if (this.settings.interpolateParticles) {
      grid.drawLine(
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

  removeParticles(num) {
    this.particles.splice(0, num);
  }
}

export default Paintbrush;
