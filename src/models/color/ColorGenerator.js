import Color from './Color';
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
    this.color = initialColor ? initialColor : new Color();
    this.speed = 1;
    this.style = 'static';
    this.period = 1;

    this.cycleDirection = {
      hue: 1,
      saturation: 1, 
      lightness: 1
    };

    this.path = {
      current: 0,
      colors: [this.color]
    };

    this.tempColor = this.color;
    
    this.updates = 0;
  }

  /** 
   * Dictionary of color change functions. Calling applyDynamics[style] will adjust the
   * color generator's color value.
   */
  applyDynamics = {
    static: () => {},
    cycleHue: () => {
      this.color.hue += this.speed;
      if (this.color.hue > 359) {
        this.color.hue = 0;
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
        this.color.moveTo(targetColor, this.speed / 3);
        if (this.color.equals(targetColor)) {
          this.path.current = (this.path.current + 1) % this.path.colors.length;
        }
      }
    }, 
    random: () => {
      const change = Math.floor(1 / this.speed) + 1;
      if (this.updates % change === 0) {
        this.color.hue = randomInt(0, 359);
        this.color.lightness = 50;
        this.color.saturation = randomInt(0, 100);
      }
    },
  };

  /**
   * Returns a new stringified hsl or hsla color.
   * @returns {string}
   */
  newColor() {
    const result = this.color;
    this.update();
    return result;
  }

  /** Applies color dynamic and increments updates. */
  update() {
    this.applyDynamics[this.style]();
    this.updates += 1;
  }

  presets = {
    rainbow: () => {
      this.color = new Color(194, 100, 50),
      this.style = 'cycleHue';
    }
  }

  applyPreset(preset) {
    presets[preset]();
  }
}

export default ColorGenerator;