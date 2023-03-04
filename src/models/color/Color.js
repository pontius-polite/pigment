/** Class for abstracting an hsla color. */
class Color {
  constructor(hue, saturation, lightness, alpha = 1) {
    console.assert(hue >= 0 && hue < 360);
    console.assert(saturation >= 0 && saturation <= 100);
    console.assert(lightness >= 0 && lightness <= 100);
    console.assert(alpha >= 0 && alpha <= 1);

    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
    this.alpha = alpha;
  }

  toString() {
    if (this.alpha < 1.0) {
      return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${
        this.alpha
      }%)`;
    }
    return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness})%`;
  }
}

export default Color;
