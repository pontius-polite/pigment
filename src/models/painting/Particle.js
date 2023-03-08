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

  applyMovementDynamic(movement, speed, grid) {
    particleDynamics[movement](this, speed, grid);
  }

  applyVelocity() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  updatePrevPosition() {
    this.prevPosition.x = this.position.x;
    this.prevPosition.y = this.position.y;
  }

  hasMoved() {
    return this.position.equals(this.prevPosition);
  }
}

export default Particle;