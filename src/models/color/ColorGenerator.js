import Color from "./Color";
import { randomInt } from "../../utils/random";

/**
 * Class for generating dynamic colors with each newColor() call according to a specified style.
 * Styles available: static, cycleHue, cycleSaturation, cycleLightness, path, random.
 * Other params: speed, grayscale, period.
 */
class ColorGenerator {
  /**
   * Creates a new ColorGenerator.
   * @param {Color=} initialColor
   */
  constructor(initialColor) {
    this.color = initialColor !== undefined ? initialColor : new Color();
    this.speed = 1;
    this.interval = 1;
    this.style = "cycleHue";

    this.cycleDirection = {
      hue: 1,
      saturation: 1,
      lightness: 1,
    };

    this.path = {
      current: 0,
      colors: [this.color],
    };

    this.tempColor = this.color.copy();

    this.updates = 0;
  }

  /**
   * Dictionary of color change functions. Calling applyDynamics[style] will adjust the
   * color generator's color value.
   */
  applyDynamics = {
    static: () => {},
    cycleHue: () => {
      this.color.hue -= this.speed;
      if (this.color.hue < 0) {
        this.color.hue = 360;
      }
    },
    cycleSaturation: () => {
      this.color.saturation += this.speed * this.cycleDirection.saturation;
      if (this.color.saturation > 100) {
        this.color.saturation = 100;
        this.cycleDirection.saturation = -1;
      }
      if (this.color.saturation < 0) {
        this.color.saturation = 0;
        this.cycleDirection.saturation = 1;
      }
    },
    cycleLightness: () => {
      this.color.lightness += this.speed * this.cycleDirection.lightness;
      if (this.color.lightness > 100) {
        this.color.lightness = 100;
        this.cycleDirection.lightness = -1;
      }
      if (this.color.lightness < 0) {
        this.color.lightness = 0;
        this.cycleDirection.lightness = 1;
      }
    },
    path: () => {
      if (this.path.colors.length > 1) {
        const targetIndex = (this.path.current + 1) % this.path.colors.length;
        const targetColor = this.path.colors[targetIndex];
        this.color.moveTo(targetColor, this.speed);
        if (this.color.equals(targetColor)) {
          this.path.current = (this.path.current + 1) % this.path.colors.length;
        }
      }
    },
    random: () => {
      this.color.hue = randomInt(0, 359);
      this.color.lightness = 50;
      this.color.saturation = randomInt(75, 100);
    },
  };

  /**
   * Returns a new  hsl or hsla color.
   * @returns {string}
   */
  newColor() {
    this.update();
    if (this.updates % this.interval !== 0) {
      return this.tempColor;
    }
    this.tempColor = this.color.copy();
    return this.color;
  }

  /** Applies color dynamic and increments updates. */
  update() {
    this.applyDynamics[this.style]();
    this.updates += 1;
  }

  /**
   * Returns a hard copy of this color generator.
   * @returns {ColorGenerator}
   */
  copy() {
    const result = new ColorGenerator(this.color.copy());
    result.speed = this.speed;
    result.interval = this.interval;
    result.style = this.style;
    result.path = this.path;
    return result;
  }

  serialize() {
    return JSON.stringify({
      color: this.color,
      speed: this.speed,
      interval: this.interval,
      path: this.path,
      style: this.style,
    });
  }

  static deserialize(props) {
    const initColor = new Color(
      props.color.hue,
      props.color.saturation,
      props.color.lightness
    );
    const generator = new ColorGenerator(initColor);
    generator.style = props.style;
    generator.speed = props.speed;
    generator.interval = props.interval;
    generator.path = props.path;
    generator.tempColor = { ...initColor };
    return generator;
  }

  compressToArray() {
    return [
      this.color.hue,
      this.color.saturation,
      this.color.lightness,
      this.style,
      this.speed,
      this.interval,
      this.path,
    ];
  }

  static decompress(compressedArray) {
    const initColor = new Color(compressedArray[0], compressedArray[1], compressedArray[2]);
    const result = new ColorGenerator(initColor);
    result.style = compressedArray[3];
    result.speed = compressedArray[4];
    result.interval = compressedArray[5];
    result.path = compressedArray[6];
    return result;
  }
}

export default ColorGenerator;
