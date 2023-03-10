import ColorGenerator from "../color/ColorGenerator";
import Color from "../color/Color";
import Particle from "./Particle";

import getReflectionPoints from "./getReflectionPoints";

import functionTimer from "../../utils/functionTimer";

/** Handles particle behavior and drawing. */
class Paintbrush {
  /**
   * Create a new PaintBrush.
   * @param {CanvasGrid} grid
   */
  constructor(grid) {
    this.grid = grid;
    this.particles = [];

    this.settings = {
      pauseMovement: false,

      size: 5,
      MAX_SIZE: 200,
      growth: 0,
      shape: "circle",
      outline: false,

      speed: 1,
      movement: "creep",
      bounce: false,
      followMouse: false,

      brushColor: new Color(194, 100, 50),
      brushColorGen: {
        style: "cycleHue",
        speed: 1,
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
        amount: 3,
      },

      lifespan: 240,

      interpolateMouse: true,
      interpolateParticles: true,
    };

    this.brushColorGenerator = this.createBrushColorGenerator();
    this.updates = 0;
  }

  /** Creates a new ColorGenerator with parameters determined by this.settings.colorGen. */
  createBrushColorGenerator() {
    const colorGen = new ColorGenerator({...this.settings.brushColor});
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
  updateAndDraw() {
    this.updateBrushColor();
    this.addNewParticles();
    this.drawMouseInterpolation();
    this.updateAndDrawParticles();

    this.updates += 1;
  }

  /**
   * Updates the paintbrush color if the mouse is pressed.
   */
  updateBrushColor() {
    if (this.settings.dynamicBrushColor && this.grid.mousePressed()) {
      this.settings.brushColor = this.brushColorGenerator.newColor();
      console.log(this.settings.brushColor)
      this.grid.setColor(this.settings.brushColor);
    }
  }

  /**
   * Adds new particles based on mouse state and interpolates between them, if needed.
   */
  addNewParticles() {
    if (this.grid.mousePressed()) {
      this.addParticle(this.grid.mousePosition());

      if (this.shouldInterpolateMouse()) {
        this.addParticleMouseInterpolations();
      }
    }
  }

  /**
   * Returns true if the mouse movements should be interpolated.
   */
  shouldInterpolateMouse() {
    return (
      this.settings.interpolateMouse &&
      this.grid.mousePressed() &&
      this.grid.mousePreviousPressed()
    );
  }

  /**
   * Adds a particle centered the given Point.
   * The particle will inherit the settings of this paintbrush.
   * @param {Point} point
   */
  addParticle(point) {
    const newParticle = new Particle(point.x, point.y);
    newParticle.color = {...this.settings.brushColor};
    newParticle.size = this.settings.size;
    if (this.settings.dynamicParticleColor) {
      newParticle.colorGenerator = this.createParticleColorGenerator();
      newParticle.colorGenerator.style = "cycleHue";
    }
    this.particles.push(newParticle);
  }

  /** Creates a new ColorGenerator with parameters determined by this.settings.colorGen. */
  createParticleColorGenerator() {
    const colorGen = new ColorGenerator({...this.settings.brushColor});
    colorGen.style = this.settings.particleColorGen.style;
    colorGen.speed = this.settings.particleColorGen.speed;
    colorGen.interval = this.settings.particleColorGen.interval;
    return colorGen;
  }

  /**
   * Adds particles between current and previous mouse positions.
   */
  addParticleMouseInterpolations() {
    const distance = this.grid.mouseMoveDistance();
    const numInterpolations = Math.floor(distance / this.settings.size) + 1;
    const points = this.grid
      .mousePosition()
      .interpolatePointsBetween(
        this.grid.mousePreviousPosition(),
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
  drawMouseInterpolation() {
    if (this.shouldInterpolateMouse() && !this.settings.outline) {
      this.grid.drawLine(
        this.grid.mouseX(),
        this.grid.mouseY(),
        this.grid.mousePreviousX(),
        this.grid.mousePreviousY(),
        this.settings.size
      );
      if (this.shouldReflectionBeDrawn()) {
        this.drawMouseInterpolationReflections();
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
   */
  drawMouseInterpolationReflections() {
    if (this.shouldInterpolateMouse()) {
      const points = getReflectionPoints(
        this.grid.mousePosition(),
        this.settings.reflection
      );
      const prevPoints = getReflectionPoints(
        this.grid.mousePreviousPosition(),
        this.settings.reflection
      );
      for (let i = 0; i < points.length; i += 1) {
        const point = points[i];
        const prevPoint = prevPoints[i];
        this.grid.drawLine(
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
   */
  updateAndDrawParticles() {
    for (let particle of this.particles) {
      this.updateParticle(particle);
      this.drawParticle(particle);
    }
    this.removeDeadParticles();
  }

  /**
   * Updates particle position and age.
   * @param {Particle} particle

   */
  updateParticle(particle) {
    if (!this.settings.pauseMovement) {
      particle.updatePrevPosition();
      particle.applyMovementDynamic(
        this.settings.movement,
        this.settings.speed
      );
      if (this.settings.bounce) {
        this.bounceParticle(particle);
      }
      if (this.settings.followMouse) {
        this.driftToMouse(particle);
      }

      particle.size += this.settings.growth;
      particle.size = Math.min(particle.size, this.settings.MAX_SIZE);
      particle.age += 1;

      this.senesceInvalidParticle(particle);
    }
  }

  /**
   * Adjust particle velocity if it hits the edge of the grid.
   * @param {Particle} particle
   * @param {CanvasGrid} grid
   */
  bounceParticle(particle) {
    const gridHorizontalBound = this.grid.width / 2;
    const gridVerticalBound = this.grid.height / 2;
    const offset = particle.size / 2;
    const efficieny = -0.9;
    if (particle.position.x > gridHorizontalBound) {
      particle.position.x = gridHorizontalBound;
      particle.velocity.x *= efficieny;
    }
    if (particle.position.x < gridHorizontalBound * -1) {
      particle.position.x = gridHorizontalBound * -1;
      particle.velocity.x *= efficieny;
    }
    if (particle.position.y > gridVerticalBound) {
      particle.position.y = gridVerticalBound;
      particle.velocity.y *= efficieny;
    }
    if (particle.position.y < gridVerticalBound * -1) {
      particle.position.y = gridVerticalBound * -1;
      particle.velocity.y *= efficieny;
    }
  }

  /**
   * Adjust particle velocity to move towards the mouse.
   * @param {Particle} particle
   */
  driftToMouse(particle) {
    const driftSpeed = this.settings.speed * 0.0005;
    const xDif = this.grid.mousePosition().x - particle.position.x;
    const yDif = this.grid.mousePosition().y - particle.position.y;
    particle.velocity.x += driftSpeed * xDif;
    particle.velocity.y += driftSpeed * yDif;
  }

  /**
   * Increases the age of particles particles that are invalid such that they exceed this brush's
   * lifespan. Particles are invalid if their position is too far out of bounds or their
   * size too small/large.
   * @param {Particle} particle
   */
  senesceInvalidParticle(particle) {
    const shouldParticleDie =
      particle.size <= 0 ||
      Math.abs(particle.position.x) > this.grid.width ||
      Math.abs(particle.position.y) > this.grid.height;

    if (shouldParticleDie) {
      particle.age = this.settings.lifespan;
    }
  }

  /**
   * Draws the particle onto the grid and interpolates its movement with a line.
   * @param {Particle} particle
   */
  drawParticle(particle) {
    if (!this.settings.useBrushColor) {
      this.applyParticleColorToGrid(particle);
    }
    this.grid.drawShape(
      this.settings.shape,
      particle.position.x,
      particle.position.y,
      particle.size,
      !this.settings.outline
    );
    this.drawParticleMovementInterpolation(particle);
    if (this.shouldReflectionBeDrawn()) {
      this.drawParticleReflections(particle);
    }
  }

  /**
   * Sets the color of the grid for drawing particles and reflections.
   * @param {Particle} particle
   */
  applyParticleColorToGrid(particle) {
    if (this.settings.dynamicParticleColor && particle.colorGenerator) {
      particle.color = particle.colorGenerator.newColor();
    }
    this.grid.setColor(particle.color);
  }

  /**
   * Draws a line between the particle's current and previous positions.
   * @param {Particle} particle
   */
  drawParticleMovementInterpolation(particle) {
    if (
      this.settings.interpolateParticles &&
      !this.settings.outline &&
      particle.hasMoved()
    ) {
      this.grid.drawLine(
        particle.prevPosition.x,
        particle.prevPosition.y,
        particle.position.x,
        particle.position.y,
        particle.size + 1,
      );
    }
  }

  /**
   * Draws reflections of particle.
   * @param {Particle} particle
   */
  drawParticleReflections(particle) {
    const points = getReflectionPoints(
      particle.position,
      this.settings.reflection
    );

    // Interpolate reflected particle movements per setting.
    let prevPoints = null;
    if (this.settings.interpolateParticles && particle.hasMoved()) {
      prevPoints = getReflectionPoints(
        particle.prevPosition,
        this.settings.reflection
      );
    }

    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      this.drawParticleCopy(particle, point);

      if (prevPoints) {
        const prevPoint = prevPoints[i];
        this.grid.drawLine(
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
   */
  drawParticleCopy(particle, point) {
    this.grid.drawShape(
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
    if (this.particles.length > 0) {
      let amount = 0;
      for (let particle of this.particles) {
        if (particle.age < this.settings.lifespan) {
          break;
        }
        amount += 1;
      }
      this.particles.splice(0, amount);
    }
  }

  removeParticles(num) {
    this.particles.splice(0, num);
  }
}

export default Paintbrush;
