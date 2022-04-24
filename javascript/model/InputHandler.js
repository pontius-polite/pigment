
/** InputHandler depends on display wrapper element and Appstate 'state' being instantiated in Main.js.
 * Modifies properties of state based on user input.
 */

let p = props;

/* Mouse event handling. */
wrapper.addEventListener('mousemove', function(event) {
    props.mouseX = event.clientX;
    props.mouseY = event.clientY;
});

wrapper.addEventListener('mousedown', function(event) {
    props.mouseDown = true;
    console.log(p.mouseX + " " + p.mouseY);
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

    console.log(name);
    
    if (name == "d") {
        props.showDebug = !props.showDebug;
        $("#debugWrapper").toggle();
    }

});
