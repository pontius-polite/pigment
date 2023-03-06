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
    this.age = 0;
    this.timer = 0;
    this.color = new Color(0, 0, 0);
  }

  applyVelocity() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  update(movement, speed) {
    this.prevPosition.x = this.position.x;
    this.prevPosition.y = this.position.y;
    particleDynamics[movement](this, speed);
    this.age += 1;
  }

  /**
   * Draws the particle onto the specified canvas context.
   * @param {CanvasGrid} grid 
   * @param {string} shape The shape of the particle, either circle of square.
   * @param {number} size The size of the particle 
   * @param {boolean} fill Whether or not the particle should be outlined or filled in.
   */
  draw(grid, shape, size, fill, colorOverride) {
    if (!colorOverride) {
      grid.setColor(this.color);
    }
    grid.drawShape(shape, this.position.x, this.position.y, size, fill);
  }
}

export default Particle;