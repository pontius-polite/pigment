/** Class for tracking frame compute time and keeping a running sample of previous times. */
class FrameTimer {
  constructor() {
    this.start = Date.now();
    this.currentDelta = 0;
    this.updates = 0;
  }

  update() {
    const currentTime = Date.now();
    this.currentDelta = currentTime - this.start;
    this.start = currentTime;
    this.updates += 1;
  }
}

export default FrameTimer;