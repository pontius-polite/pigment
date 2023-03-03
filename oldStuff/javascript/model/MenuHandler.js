
/** IIFE for creating menu dropdowns from formula names. */
(function createDropDownMenus() {
    createParticleMovementStyleDropdown();
    createParticleShapeDropdown();
})()


/** Create dropdown options for the movement styles. */
function createParticleMovementStyleDropdown() {
    const styleSelector = document.getElementById("particleMovementStyle");
    for (let formulaName in particleMovementFormulas){
        let option = document.createElement("option");
        option.value = formulaName;
        option.text = formulaName;
        styleSelector.appendChild(option);
    }
}    


/** Create dropdown options for the shape selections. */
function createParticleShapeDropdown() {
    const shapeSelector = document.getElementById("particleShape");
    for (let formulaName in particleDrawFormulas){
        let option = document.createElement("option");
        option.value = formulaName;
        option.text = formulaName;
        shapeSelector.appendChild(option);
    }
}

/** Toggles the visibility of the specified menu, and hides all other menus. */
function toggleMenu(elementid) {
    let elems = document.getElementsByClassName("settingsMenu");
    for (let i = 0; i < elems.length; i += 1) {
        if (elems[i].id == elementid) {
            $("#" + elementid).toggle();
        } else {
            $("#" + elems[i].id).hide();
        }
    }
}

/** Adds  */
const addMenuEventListeners = (() => {
    for (let field in state) {
        let id = "#" + field;
        $( id ).on("change", function() {
            if ($( this ).attr("type") == "checkbox") {
                state[field] = $( this ).is(":checked");
            } else {
                state[field] = $( this ).val();
            }
            
        });
    }
})();

/** Sets the values of the settings menu fields to the current state values. */
function applyStateToMenuFields() {
    for (let field in state) {
        let id = "#" + field;
        if ($( id ).attr("type") == "checkbox") {
            $( this ).attr("checked", state[field]);
        } else {
            $( this ).val(state[field]);
        }
    }
}



