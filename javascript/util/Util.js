
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

function drawCircle(canvasContext, x, y, radius, color) {
    canvasContext.fillStyle = color;
    if (radius == 0) {
        canvasContext.fillRect(x, y, 1, 1);
        return;
    }
    canvasContext.strokeStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, 6.283184);
    canvasContext.stroke();
    canvasContext.fill();
}

/** Returns an array of num points on a line between p1 and p2. Points are represented by an array */
function interpolatePoints(p1, p2, num) {
    points = [];
    xdif = p1[0] - p2[0];
    ydif = p1[1] - p2[1];
    dist = Math.sqrt
}