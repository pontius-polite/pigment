
/**
 * Class for representing two dimensional vectors and some utility functions. 
 */

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /** Returns the absolute length of the vector. */
    length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    /** Returns the distance to vector v. */
    distance(v) {
        let xdif = this.x - v.x;
        let ydif = this.y - v.y;
        return Math.sqrt((xdif * xdif) + (ydif * ydif));
    } 

    /** Returns an array of points on a line separated by interval between this vector and v2. 
     * Points are represented by vectors. */
    interpolatePoints(v, interval) {
        let points = [];
        let d = this.distance(v);
        let num = Math.floor(d / interval);
        for (let i = 1; i < num; i += 1) {
            let px = i * (v.x - this.x) / (num);
            let py = i * (v.y - this.y) / (num);
            points.push(new Vector(px, py));
        }
        return points;
    }

}