class Particle {
  constructor(point) {
    this.position = point;
    this.velocity = new Point(0, 0);
    this.lifeTime = 0;
    this.timer = 0;
  }
}

export default Particle;