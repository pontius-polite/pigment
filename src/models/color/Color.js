/** Class for abstracting an hsla color. */
class Color {
  constructor(hue, saturation, lightness) {
    this.hue = hue !== undefined ? hue : 329;
    this.saturation = saturation !== undefined ? saturation : 100;
    this.lightness = lightness !== undefined ? lightness : 50;

    console.assert(this.hue >= 0 && this.hue <= 360);
    console.assert(this.saturation >= 0 && this.saturation <= 100);
    console.assert(this.lightness >= 0 && this.lightness <= 100);
  }

  /**
   * Returns true if colors have the same hue/saturation/lightness values.
   * @param {Color} color
   * @returns {boolean}
   */
  equals(color) {
    const isSameColor =
      this.hue === color.hue &&
      this.saturation === color.saturation &&
      this.lightness === color.lightness;
    return isSameColor;
  }

  /**
   * Adjusts color values to move towards target color by the increment amount.
   * @param {Color} targetColor
   * @param {number} [increment = 1]
   */
  moveTo(targetColor, increment = 1) {
    if (Math.abs(targetColor.hue - this.hue) < 180) {
      if (this.hue < targetColor.hue) {
        this.hue = Math.min(this.hue + increment, targetColor.hue);
      } else {
        this.hue = Math.max(this.hue - increment, targetColor.hue);
      }
    } else {
      if (this.hue < targetColor.hue) {
        this.hue -= increment;
      } else {
        this.hue += increment;
      }
    }

    if (this.saturation < targetColor.saturation) {
      this.saturation = Math.min(
        this.saturation + increment,
        targetColor.saturation
      );
    } else {
      this.saturation = Math.max(
        this.saturation - increment,
        targetColor.saturation
      );
    }

    if (this.lightness < targetColor.lightness) {
      this.lightness = Math.min(
        this.lightness + increment,
        targetColor.lightness
      );
    } else {
      this.lightness = Math.max(
        this.lightness - increment,
        targetColor.lightness
      );
    }

    this.applyHSLBounds();
  }

  /**
   * Adjusts HSL values if they are outside of valid bounds.
   */
  applyHSLBounds() {
    this.hue = (this.hue + 360) % 360;

    this.saturation = Math.min(this.saturation, 100);
    this.saturation = Math.max(this.saturation, 0);

    this.lightness = Math.min(this.lightness, 100);
    this.lightness = Math.max(this.lightness, 0);
  }

  /**
   * Returns a hard copy of this color.
   * @returns {Color}
   */
  copy() {
    return new Color(this.hue, this.saturation, this.lightness);
  }

  toHSLString() {
    const intHue = Math.floor(this.hue);
    const intSat = Math.floor(this.saturation);
    const intLit = Math.floor(this.lightness);
    return `hsl(${intHue}, ${intSat}%, ${intLit}%)`;
  }
}

export default Color;
