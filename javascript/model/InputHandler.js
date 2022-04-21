
/** 
 * Scripts for adding event listeners to canvasElement. Must be embedded
 * after Main.js for canvasElement assignment. 
 */

/* Keyboard event handling. */
canvasElement.addEventListener('keydown', function(event) {
    let name = event.key;
    let code = event.code;
    alert("Key pressed: " + name + " | " + code);
});

canvasElement.addEventListener('keydown', function(event) {
    let name = event.key;
    let code = event.code;
    alert("Key pressed: " + name + " | " + code);
});

/* Mouse event handling. */
canvasElement.addEventListener('mousemove', function(event) {
    mousePositionX = event.clientX;
    mousePositionY = event.clientY;
});

canvasElement.addEventListener('mousedown', function(event) {
    mouseDown = true;
});

canvasElement.addEventListener('mousedown', function(event) {
    mouseDown = true;
});

 