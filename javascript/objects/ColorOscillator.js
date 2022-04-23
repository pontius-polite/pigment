
/**
 * A ColorGenerator object is capable of creating dynamic color oscillations through updates.
 * Seed affects behavior of the color oscillation.
 */

class ColorOscillator {
    /** Create a new ColorGenerator with a random starting color and seed. */
    constructor() {
        this.updates = 0;
        this.seed = 1;

        this.rgb = [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];

        /** Takes in values from 1 - 10: 1 being the slowest and 10 being the fastest. */
        this.velocity = [5, 5, 5] 

        this.blackAndWhite = false;
    }

    /** Create a new ColorGenerator with specified starting color. */
    constructor(red, green, blue, seed) {
        this.updates = 0;
        this.seed = seed;

        this.red = red;
        this.green = green;
        this.blue = blue;

        this.blackAndWhite = false;
        
    }

    update() {
        this.red = Math.floor(127 * Math.sin(this.updates/10 + 0) + 127);
        this.green = Math.floor(127 * Math.sin(this.updates/9 + 1) + 127);
        this.blue = Math.floor(127 * Math.sin(this.updates/8 + 2) + 127);
    }

    colorToString(r, g, b){
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    red() {
        return rgb[0];
    }

    green() {
        return rgb[1];
    }

    blue() {
        return rgb[2];
    }
}