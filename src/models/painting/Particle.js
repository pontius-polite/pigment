import Point from "../grid/Point";
import Color from '../color/Color';
import particleDynamics from "./particleDynamics"

/** Class representing a single pigment particle on the screen. Particles are created 
 * and manipulated by a Paintbrush.
 */
class Particle {
  constructor(x, y) {
    this.position = new Point(x, y);
    this.prevPosition = new Point(x, y);
    this.velocity = new Point(0, 0);
    this.color = new Color();
    this.colorGenerator = null;
    this.size = 5;
    this.age = 0;
    this.timer = 0;
  }

  applyVelocity() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  update(movement, speed, growthSpeed) {
    this.prevPosition.x = this.position.x;
    this.prevPosition.y = this.position.y;
    particleDynamics[movement](this, speed);
    this.size = Math.floor(this.size + growthSpeed);
    this.age += 1;
  }

  /**
   * Draws the particle onto the specified canvas context.
   * @param {CanvasGrid} grid 
   * @param {string} shape The shape of the particle, either circle of square.
   * @param {boolean} fill Whether or not the particle should be outlined or filled in.
   * @param {boolean} useParticleColor If true, the particle will be drawn with its own color and not the paintbrush's.
   * @param {boolean} interpolateMovement If true, a line will be filled in from the particle's previous to its current position.
   */
  draw(grid, shape, fill, useParticleColor, interpolateMovement) {
    if (useParticleColor) {
      if (this.colorGenerator) {
        this.color = this.colorGenerator.newColor();
      }
      grid.setColor(this.color);
    }
    grid.drawShape(shape, this.position.x, this.position.y, this.size, fill);
    
    if (interpolateMovement) {
      grid.drawLine(
        this.prevPosition.x,
        this.prevPosition.y,
        this.position.x,
        this.position.y,
        this.size
      );
    }
  }
    
}

export default Particle;