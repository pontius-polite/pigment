
/** InputHandler requires DOM element 'wrapper' in Main.js and state object being initialized.
 * Modifies state fields based on user input.
 */

/* Mouse event handling. */
wrapper.addEventListener('mousemove', function(event) {
    state.mousePos.x = event.clientX;
    state.mousePos.y = event.clientY;
});

wrapper.addEventListener('mousedown', function(event) {
    state.mouseDown = true;
});

wrapper.addEventListener('mouseup', function(event) {
    state.mouseDown = false;
});

// TODO figure out how to update mouseDown when mouse enters a menu element

/* Keyboard event handling. */
window.addEventListener('keydown', function(event) {
    let name = event.key;
    let code = event.code;
});

window.addEventListener('keyup', function(event) {
    
    let code = event.code;

    console.log("key press: " + code);
    
    switch (code) {
        case "Period": state.showDebug = !state.showDebug;
            break;

        case "Space": state.pausedMovement = !state.pausedMovement;
            break;

        case "KeyC": 
            clearParticles(); 
            clearForeground();
            break;

        case "KeyA": toggleMenu("generalMenu");
            break;

        case "KeyS": toggleMenu("particleMenu");
            break;

        case "KeyD": toggleMenu("particleColorMenu");
            break;

        case "KeyF": toggleMenu("backgroundColorMenu");
            break;
    }

});

