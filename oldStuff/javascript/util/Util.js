
/**
 * Utility variables and functions.
 */

const TAU = 2 * Math.PI;

/** Returns an rgb string with the specified values. */
function colorToString(r, g, b){
    return "rgb(" + r + "," + g + "," + b + ")";
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(rgb) {
    let hex = "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2])
    return hex.toUpperCase();
  }

function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min, max){
    return Math.random() * (max - min) + min;
}

/** Rotates (x, y) counterclockwise around (sx, sy) by the angle p in radians.*/
function rotateCoordinate(x, y, sx, sy, p){
    // TODO: 
}

function drawCircle(canvasContext, x, y, radius, color) {
    x = Math.floor(x);
    y = Math.floor(y);
    canvasContext.fillStyle = color;
    if (radius == 0) {
        canvasContext.fillRect(x, y, 1, 1);
        return;
    }
    canvasContext.lineWidth = 1;
    canvasContext.strokeStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, TAU);
    canvasContext.stroke();
    canvasContext.fill();
}

/** Draws a square centered at (x, y) with side length 2*radius. */
function drawSquare(canvasContext, x, y, radius, color) {
    x = Math.floor(x);
    y = Math.floor(y);
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

/** Draw a line from (bx, by) to (ex, ey). */
function drawLine(canvasContext, bx, by, ex, ey, thickness, color) {
    bx = Math.floor(bx);
    by = Math.floor(by);
    ex = Math.floor(ex);
    ey = Math.floor(ey);
    thickness = Math.floor(thickness);
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth = thickness;
    canvasContext.lineCap = "round";
    canvasContext.beginPath();
    canvasContext.moveTo(bx, by);
    canvasContext.lineTo(ex, ey);
    canvasContext.stroke();
    canvasContext.lineWidth = 1;
}

/** If val is outside of the range [min, max], constrains x to be either min or max. */
function constrainValueToRange(val, min, max) {
    if (val > min) {
        return Math.min(val, max);
    }
    return Math.max(val, min);
}