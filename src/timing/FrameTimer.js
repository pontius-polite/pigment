/** Class for tracking frame compute time and keeping a running sample of previous times. */
class FrameTimer {
  constructor(sampleSize) {
    this.start = Date.now();
    this.currentDelta = 0;
    this.sampleSize = sampleSize;
    this.sampleDeltas = [];
    this.updates = 0;
  }

  update() {
    const currentTime = Date.now();
    this.currentDelta = currentTime - this.start;
    this.start = currentTime;
    this.sampleDeltas[this.updates % this.sampleSize] = this.currentDelta;
    this.updates += 1;
  }

  averageDelta() {
    const sum = this.sampleDeltas.reduce((sum, current) => (sum + current), 0);
    return sum / this.sampleSize;
  }
}

export default FrameTimer;