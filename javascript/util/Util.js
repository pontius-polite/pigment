
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

/** Draws a square centered at (x, y) with side length 2*radius. */
function drawSquare(canvasContext, x, y, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

