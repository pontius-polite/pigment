import { randomInt } from "../../utils/random";

/**
 * Dictionary of particle movement functions.
 * Calling a movement function on a particle will modify its properties.
 */
const particleDynamics = {
  none: (p, speed) => {},
  creep: (p, speed) => {
    let s = speed * 2;
    p.velocity.x = randomInt(-1 * s, s);
    p.velocity.y = randomInt(-1 * s, s);
    p.velocity.floor();
    p.applyVelocity();
  },
  // "noodle": (particle) => {
  //     particle.velocity.x += randomInt(-1 * particle.speed, particle.speed);
  //     particle.velocity.y += randomInt(-1 * particle.speed, particle.speed);

  //     particle.velocity.x = constrainValueToRange(particle.velocity.x, -1 * particle.speed, particle.speed);
  //     particle.velocity.y = constrainValueToRange(particle.velocity.y, -1 * particle.speed, particle.speed);
  // },
  // "crystal": (particle) => {
  //     if (particle.timer == 0) {
  //         let coin = randomInt(0, 1);
  //         if (coin) {
  //             particle.velocity.x = particle.speed;
  //         } else {
  //             particle.velocity.x = -1 * particle.speed;
  //         }
  //         coin = randomInt(0, 1);
  //         if (coin) {
  //             particle.velocity.y = particle.speed;
  //         } else {
  //             particle.velocity.y = -1 * particle.speed;
  //         }

  //         particle.timer = randomInt(2, 5);
  //     }
  //     particle.timer -= 1;
  // },
  // "drip": (particle) => {
  //     particle.velocity.x *= 0.95;
  //     particle.velocity.y *= 0.95;

  //     if (Math.abs(particle.velocity.y < 0.05)) {
  //         particle.velocity.x = randomFloat(-0.5, 0.5);
  //         particle.velocity.y = randomInt(1, particle.speed);

  //     }
  // },
  // "bounce": (particle) => {
  //     if (particle.lifeTime == 0) {
  //         particle.velocity.x = randomFloat(-0.5 * particle.speed, 0.5 * particle.speed);
  //         particle.velocity.y = randomFloat(-1 * particle.speed, particle.speed);
  //     }

  //     if (particle.position.y > state.height) {
  //         particle.position.y = state.height - particle.size / 2.0;
  //         particle.velocity.y *= -0.75;
  //     }

  //     particle.velocity.y += particle.speed / 10.0;
  // },
  // "orbit": (particle) => {
  //     let rotationAngle = TAU * particle.speed / 360;
  //     let midX = state.width / 2.0;
  //     let midY = state.height / 2.0

  //     // TODO: make this a formula of the velocity, not the position
  //     particle.position.x = ((particle.position.x - midX) * Math.cos(rotationAngle))
  //             - ((particle.position.y - midY) * Math.sin(rotationAngle))
  //             + midX;
  //     particle.position.y = ((particle.position.x - midX) * Math.sin(rotationAngle))
  //         + ((particle.position.y - midY) * Math.cos(rotationAngle))
  //         + midY;
  // }
};

export default particleDynamics;
