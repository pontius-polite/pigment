class KeyHandler {
    constructor (keyFunctions) {
        this.keyFunctions = keyFunctions;
        this.addEventListeners();
    }

    addEventListeners(keyFunctions) {
        document.documentElement.addEventListener('keyup', function(e) {
            const key = e.key;
        
            console.log("Key Pressed:", key);

            this.keyFunctions[key]();
            
            //TODO:
            // switch (code) {
            //     case "Period": state.showDebug = !state.showDebug;
            //         break;
        
            //     case "Space": state.pausedMovement = !state.pausedMovement;
            //         break;
        
            //     case "KeyC": 
            //         clearParticles(); 
            //         clearForeground();
            //         break;
        
            //     case "KeyA": toggleMenu("generalMenu");
            //         break;
        
            //     case "KeyS": toggleMenu("particleMenu");
            //         break;
        
            //     case "KeyD": toggleMenu("particleColorMenu");
            //         break;
        
            //     case "KeyF": toggleMenu("backgroundColorMenu");
            //         break;
            // }
        
        });
    }
}

export default KeyHandler;



