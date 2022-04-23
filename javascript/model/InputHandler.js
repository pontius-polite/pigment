
/* Mouse event handling. */
wrapper.addEventListener('mousemove', function(event) {
    state.mouseX = event.clientX;
    state.mouseY = event.clientY;
});

wrapper.addEventListener('mousedown', function(event) {
    state.mouseDown = true;
    console.log(state.mouseX + " " + state.mouseY);
});

wrapper.addEventListener('mouseup', function(event) {
    state.mouseDown = false;
});

/* Keyboard event handling. */
wrapper.addEventListener('keydown', function(event) {
    let name = event.key;
    let code = event.code;
});

wrapper.addEventListener('keyup', function(event) {
    let name = event.key;
    let code = event.code;

});
