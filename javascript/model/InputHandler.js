
/** InputHandler requires DOM element 'wrapper' and Properties 'props' being instantiated in Main.js.
 * Modifies properties of state based on user input.
 */

/* Mouse event handling. */
wrapper.addEventListener('mousemove', function(event) {
    props.mousePos.x = event.clientX;
    props.mousePos.y = event.clientY;
});

wrapper.addEventListener('mousedown', function(event) {
    props.mouseDown = true;
});

wrapper.addEventListener('mouseup', function(event) {
    props.mouseDown = false;
});

/* Keyboard event handling. */
window.addEventListener('keydown', function(event) {
    let name = event.key;
    let code = event.code;
});

window.addEventListener('keyup', function(event) {
    let name = event.key;
    let code = event.code;

    console.log(name + " " + code);
    
    if (code == "KeyD") {
        props.showDebug = !props.showDebug;
        $("#debugWrapper").toggle();
    }

    if (code == "Space") {
        props.pausedMovement = !props.pausedMovement;
    }

    if (code == "Backspace") {
        clearParticles();
        clearForeground();
    }  

});
