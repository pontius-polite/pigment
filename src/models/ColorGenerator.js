import Color from './Color';
import { randomInt } from "../utils/randomUtils";

// init: new Color(194, 100, 100

/**
 * Class that spits out dynamic colors with each update call according to a specified style.
 */
class ColorGenerator {
  styles = ['rainbow', 'path', 'random', 'static']
  /**
   * Creates a new ColorGenerator.
   * @param {Color} initialColor.
   * @param {string} style The color generation style
   */
  constructor(initialColor, style = "rainbow") {
    console.assert(this.styles.indexOf(style) !== -1);
    
    this.updates = 0;
    this.color = initialColor;
    this.colorDirections = [1, 1, 1];
    this.speed = 1;
    this.path = [];
    this.grayscale = false;
    this.style = style;
  }

  styleFormulas = {
    rainbow: () => {
      this.color.hue += this.speed * this.colorDirections[0];
      if (this.color.hue > 359) {
        this.color.hue = 0;
      }
    },
    //TODO:
    path: () => {}, 
    random: () => {
      const period = Math.floor(1 / this.speed) + 1;
      if (this.updates % period === 0) {
        this.color.hue = randomInt(0, 359);
        this.color.lightness = randomInt(50, 100);
        this.color.saturation = randomInt(50, 100);
      }
    },
    static: () => {}
  };

  /** Modifies the current color based on the current style. */
  applyStyleFormula() {
    this.styleFormulas[this.style]();
  }

  update() {
    this.applyStyleFormula();
    this.updates += 1;
  }

  /**
   * Returns a new stringified hsl or hsla color.
   * @returns {string}
   */
  newColor() {
    const result = `hsl(${this.color.hue}, ${this.grayscale ? 0 : this.color.saturation}%, ${this.color.lightness}%)`;
    this.update();
    return result;
  }
}

export default ColorGenerator;