import { randomInt, randomNum } from "../../utils/random";
import { constrainValueToRange } from "../../utils/range";

/**
 * Dictionary of particle movement functions.
 * Calling a movement function on a particle will modify its properties.
 */
const particleDynamics = {
  
  creep: (p, speed) => {
    const s = speed * 4;
    p.velocity.x = randomNum(-1 * s, s);
    p.velocity.y = randomNum(-1 * s, s);
    p.applyVelocity();
  },
  spaghetti: (p, speed) => {
    const s = speed / 4;
    p.velocity.x += randomNum(-1 * s, s);
    p.velocity.y += randomNum(-1 * s, s);
    p.applyVelocity();
  },
  crystal: (p, speed) => {
    const s = speed * 2;
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
      p.timer = randomInt(80, 90);
    }
    p.applyVelocity();
    p.timer -= 1;
  }, 
  drip: (p, speed) => {
    const s = speed * 5;
    p.velocity.x = 0;
    p.velocity.y *= 0.95;
    if (Math.abs(p.velocity.y < 0.05)) {
      p.velocity.y = randomNum(1, s);
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
  firework: (p, speed) => {
    const s = speed * 20;
    if (p.age === 0) {
      p.velocity.x = randomNum(s * -1, s);
      p.velocity.y = randomNum(s * -1, s);
    }
    p.velocity.x *= 0.8;
    p.velocity.y *= 0.8;
    p.applyVelocity();
  },
  still: (p, speed) => {},
  //TODO:
  // tree: (p, speed) => {
  //   const s = speed;
  //   if (p.age <= 1) {
  //     p.velocity.y = s * -1;
  //     p.timer = 10;
  //   }
  //   if (p.timer === 0) {
  //     // const theta = 0.5
  //     // const phi = Math.PI - theta - Math.atan(p.velocity.x / p.velocity.y);
  //     // const v = p.velocity.distanceFromOrigin();
  //     // const coin = randomInt(0, 1);
  //     // if (coin) {
  //     //   p.velocity.x =  v * Math.sin(phi);
  //     //   p.velocity.y =  v * Math.cos(phi);
  //     // } else {
  //     //   p.velocity.x =  v * Math.cos(phi);
  //     //   p.velocity.y = -1 *v * Math.sin(phi);
  //     // }
  //     const coin = randomInt(0, 1);
  //     p.velocity.y += randomInt(-1, 1);
  //     p.velocity.x += randomInt(-1, 1);
  //     p.timer = 10;
  //   }
  //   p.timer -= 1;
  //   p.applyVelocity();
  // },
  // flame: (p, speed) => {
  //   const s = speed * 3;
  //   if (p.age <= 0) {
  //     p.velocity.x = randomNum(s * -1, s);
  //     p.velocity.y = randomNum(s * -1, 0);
  //   }

  //   p.velocity.x *= 0.9;

  //   p.velocity.y *= 0.95;
  //   p.velocity.y = Math.min(p.velocity.y, speed * -1);

  //   // if (p.velocity.x > 0) {
  //   //   p.velocity.x -= randomNum(-1, s);
  //   // }
  //   // if (p.velocity.x < 0) {
  //   //   p.velocity.x += randomNum(-1, s);
  //   // }
  //   // p.velocity.x += randomNum(-1, 1);
    
  //   p.applyVelocity();
  // }
};

export default particleDynamics;
