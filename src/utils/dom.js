/**
 * Returns an element of the specified type with the given class and id.
 * @param {string} type 
 * @param {string} className 
 * @param {string} className 
 * @returns {Element}
 */
export const createElement = (type, className, id) => {
  const element = document.createElement(type);
  if (className) {
    element.classList.add(className);
  }
  if (id) {
    element.id = id;
  }
  
  return element;
}

export const createInput = (type) => {
  const element = document.createElement('input');
  element.type = type;
  return element;
}

/**
 * Returns a div with the specified element type as its child. The child has the given class and id. 
 * @param {string} type 
 * @param {string} className 
 * @param {string} id 
 * @returns {Element}
 */
export const createContainedElement = (type, className, id) => {
  const container = document.createElement('div');
  const element = document.createElement(type);
  if (className) {
    element.classList.add(className);
  }
  if (id) {
    element.id = id;
  }
  return container;
}