
/**
 * A ColorGenerator object is capable of creating dynamic color changes through update calls.
 */

class ColorGenerator {

    constructor() {
        this.updates = 0;

        this.rgb = [0, 0, 0];
        this.periods = [10, 9, 8]; 
        this.displacements = [0, 1, 2];

        /** If true, applies luminosity weighted black and white effect. */
        this.grayscale = false;

        this.style = "waves";

        //** Formula functions dictionary will process color channels according to this.style. */
        this.formulas = {
            "waves": () => {
                for (let i = 0; i < 3; i += 1) {
                    this.rgb[i] = Math.floor(
                        127 * Math.sin(this.updates/this.periods[i] + this.displacements[i]) + 127);
                }
            },
            "random": () => {
                for (let i = 0; i < 3; i += 1) {
                    this.rgb[i] = randomInt(0, 255);
                }
            }    
        };
    }

    applyGrayscale() {
        let avg = Math.floor((this.rgb[0] + this.rgb[1] + this.rgb[2]) / 3.0);
        this.rgb[0] = avg;
        this.rgb[1] = avg;
        this.rgb[2] = avg;
    }

    red() {
        return this.rgb[0];
    }

    green() {
        return this.rgb[1];
    }

    blue() {
        return this.rgb[2];
    }

    /** Returns a javascript interpretable rgb string of the current channel values. */
    color() {
        return "rgb(" + this.rgb[0] + "," + this.rgb[1] + "," + this.rgb[2] + ")";
    }

    /** Updates color channel values according to wave formula. */
    update() {
        this.formulas[this.style]();
        if (this.grayscale) {
            this.applyGrayscale();
        }
        this.updates += 1;
    }
}