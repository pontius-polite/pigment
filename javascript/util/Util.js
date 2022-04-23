
/**
 * Utility functions.
 */

/** Returns an rgb string with the specified values. */
function colorToString(r, g, b){
    return "rgb(" + r + "," + g + "," + b + ")";
}

function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min, max){
    return (Math.random() * (max - min) + min);
}

/** Rotates (x, y) counterclockwise around (sx, sy) by the angle p in radians.*/
function rotateCoordinate(x, y, sx, sy, p){
    // TODO: 
}
