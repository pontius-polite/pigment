class KeyHandler {
    constructor (keyFunctions) {
        this.block = false;
        this.addEventListeners(keyFunctions);
    }

    addEventListeners(keyFunctions) {
        document.documentElement.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (!this.block && Object.keys(keyFunctions).indexOf(key) !== -1) {
                keyFunctions[key]();
            }
        });
    }
}

export default KeyHandler;



