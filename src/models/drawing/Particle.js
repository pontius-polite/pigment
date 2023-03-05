import Point from "./Point";
import Color from '../color/Color';
import {drawCircle, drawSquare} from '../../utils/drawing';

/** Class representing a single pigment particle on the screen. Particles are created 
 * and manipulated by a Paintbrush.
 */
class Particle {
  constructor(x, y) {
    this.position = new Point(x, y);
    this.velocity = new Point(0, 0);
    this.lifeTime = 0;
    this.timer = 0;
    this.color = new Color();
  }

  applyVelocity() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  /**
   * Draws the particle onto the specified canvas context.
   * @param {CanvasRenderingContext2D} context 
   * @param {string} shape The shape of the particle, either circle of square.
   * @param {number} size The size of the particle 
   * @param {boolean} fill Whether or not the particle should be outlined or filled in.
   */
  draw(context, shape, size, fill) {
    if (shape === 'circle') {
      drawCircle(context, this.position.x, this.position.y, size, fill);
      return;
    }
    drawSquare(context, this.position.x, this.position.y, size, fill)
  }
}

export default Particle;