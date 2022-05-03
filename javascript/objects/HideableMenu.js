 
class HideableMenu {
    constructor(inputElement, wrapperElement, buttonElement) {
        this.inputElement = inputElement;
        this.wrapperElement = wrapperElement;
        this.buttonElement = buttonElement;
        this.hidden = true;
    }

    show() {
        this.hidden = false;
        this.wrapperElement.style.display = "inline";
    }

    hide() {
        this.hidden = true;
        this.wrapperElement.style.display = "none";
    }

    toggle() {
        if (this.hidden) {
            this.show();
        }
        this.hide();
    }

}