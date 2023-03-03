
/**
 * A ColorGenerator object is capable of creating dynamic color changes through update calls.
 */

class ColorGenerator {

    constructor() {
        this.updates = 0;

        this.rgb = [139, 230, 234];
        this.periods = [10, 9, 8]; 
        this.displacements = [0, 1, 2];
        this.speed = 5.0;

        this.style = "waves";

        //** Formula functions will process color channels according to this.style. */
        this.formulas = {
            "waves": () => {
                for (let i = 0; i < 3; i += 1) {
                    this.rgb[i] = Math.floor(
                        127 * Math.sin(this.updates / this.periods[i] / this.speed + this.displacements[i]) + 127
                    );
                }
            },
            "random": () => {
                for (let i = 0; i < 3; i += 1) {
                    this.rgb[i] = randomInt(0, 255);
                }
            }    
        };
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
        return "rgb(" + this.red() + "," + this.green() + "," + this.blue() + ")";
    }

    /** Returns the luminosity weighted grayscale of the current color. */
    grayscaleColor() {
        let lr = Math.floor(0.2126 * this.red());
        let lg = Math.floor(0.7152 * this.green());
        let lb = Math.floor(0.0722 * this.blue());
        let weightedAvg = lr + lg + lb;
        return "rgb(" + weightedAvg + ", " + weightedAvg + ", " + weightedAvg + ")";
    }

    /** Updates color channel values according to formula. */
    update() {
        this.formulas[this.style]();
        this.updates += 1;
    }
}