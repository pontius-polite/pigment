/** Class for tracking frame compute time and keeping a running sample of previous times. */
class FrameTimer {
  constructor(sampleSize) {
    this.frameStartTime = Date.now();
    this.currentDelta = 0;
    this.frameSampleSize = sampleSize;
    this.sampleDeltas = [];
    this.updates = 0;
  }

  update() {
    const currentTime = Date.now();
    this.currentDelta = currentTime - this.frameStartTime;
    this.frameStartTime = currentTime;
    this.sampleDeltas[this.updates % this.frameSampleSize] = this.currentDelta;
    this.updates += 1;
  }

  averageDelta() {
    const sum = this.sampleDeltas.reduce((sum, current) => (sum + current), 0);
    return Math.floor(sum / this.frameSampleSize);
  }
}

export default FrameTimer;