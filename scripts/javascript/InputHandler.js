
/** Keyboard event handling. */
document.addEventListener('keydown', function(event) {
    let name = event.key;
    let code = event.code;
    alert("Key pressed: " + name + " | " + code);
});

document.addEventListener('keydown', function(event) {
    let name = event.key;
    let code = event.code;
    alert("Key pressed: " + name + " | " + code);
});

/** Mouse event handling. */
document.addEventListener('mousemove', function(event) {
    mousePositionX = event.clientX;
    mousePositionY = event.clientY;
    console.log(mousePositionX);
});

document.addEventListener('mousedown', function(event) {
    mouseDown = true;
});

document.addEventListener('mousedown', function(event) {
    mouseDown = true;
});
