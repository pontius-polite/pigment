class DebugView {
  constructor() {
    this.isVisible = process.env.NODE_ENV === "development" ? true : false;
    this.debugElement = document.querySelector(".debug-container");
    this.debugElement.style.display = this.isVisible ? 'static' : 'none';
    console.assert(this.debugElement !== null);
  }

  /**
   * Updates the debug element with provided info object.
   */
  update(info) {
    if (this.isVisible) {
      let htmlResult = "";
      for (let infoKey of Object.keys(info)) {
        htmlResult += `<div class="dubug-info">${infoKey}: ${info[infoKey]}</div>`;
      }
      this.debugElement.innerHTML = htmlResult;
    }
  }

  show() {
    this.isVisible = true;
    this.debugElement.style.display = "block";
  }

  hide() {
    this.isVisible = false;
    this.debugElement.style.display = "none";
  }

  /** Toggles whether the debug element is visible or not by changing display style. */
  toggle() {
    if (this.isVisible) {
      return this.hide();
    }
    return this.show();
  }
}

export default DebugView;
