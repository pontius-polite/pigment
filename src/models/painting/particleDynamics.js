import { randomInt, randomNum } from "../../utils/random";
import { constrainValueToRange } from "../../utils/range";

/**
 * Dictionary of particle movement functions.
 * Calling a movement function on a particle will modify its properties.
 */
const particleDynamics = {
  none: (p, speed) => {},
  creep: (p, speed) => {
    const s = speed;
    p.velocity.x = randomNum(-1 * s, s);
    p.velocity.y = randomNum(-1 * s, s);
    p.applyVelocity();
  },
  noodle: (p, speed) => {
    const s = speed / 4;
    p.velocity.x += randomNum(-1 * s, s);
    p.velocity.y += randomNum(-1 * s, s);
    p.applyVelocity();
  },
  crystal: (p, speed) => {
    const s = speed * 1;
    if (p.timer === 0) {
      let coin = randomInt(0, 1);
      if (coin) {
        p.velocity.x = s;
      } else {
        p.velocity.x = -1 * s;
      }
      coin = randomInt(0, 1);
      if (coin) {
        p.velocity.y = s;
      } else {
        p.velocity.y = -1 * s;
      }
      p.timer = randomInt(2, 5);
    }
    p.applyVelocity();
    p.timer -= 1;
  },
  tesseract: (p, speed) => {
    const s = speed * 1;
    if (p.timer === 0) {
      p.velocity.x = randomInt(-1, 1) * s;
      p.velocity.y = randomInt(-1, 1) * s;
      p.timer = randomInt(60, 70);
    }
    p.applyVelocity();
    p.timer -= 1;
  }, 
  drip: (p, speed) => {
    const s = speed * 5;
    p.velocity.y *= 0.95;
    if (Math.abs(p.velocity.y < 0.05)) {
      p.velocity.y = randomInt(1, s);
    }
    p.applyVelocity();
  },
  fountain: (p, speed) => {
    const s = speed * 3;
    if (p.age <= 1) {
      p.velocity.x = randomNum(s * -1, s);
      p.velocity.y = randomNum(s * -1, s);
    }
    p.velocity.y += s / 20;
    p.applyVelocity();
  },
  turntable: (p, speed) => {
    const s = speed;
    const theta = (Math.PI * 2 * s) / 360;
    p.position.x =
      p.position.x * Math.cos(theta) - p.position.y * Math.sin(theta);
    p.position.y =
      p.position.x * Math.sin(theta) + p.position.y * Math.cos(theta);
    p.applyVelocity();
  },
  tree: (p, speed) => {
    const s = speed;
    if (p.timer === 0) {
      const theta = randomNum(0, Math.PI * 2);
      p.velocity.x = s * Math.cos(theta);
      p.velocity.y = s * Math.sin(theta);
      p.timer = randomInt(20, 30);
    }
    p.applyVelocity();
    p.timer -= 1;
  }
};

export default particleDynamics;
