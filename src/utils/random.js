/**
 * Returns a random integer between min and max (inclusive).
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export const randomInt = (min, max) => {
  console.assert(min < max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const randomNum = (min, max) => {
  console.assert(min < max);
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random item from an array.
 * @param {*[]} list 
 * @returns {*}
 */
export const randomChoice = (list) => {
  return list[randomInt(0, list.length - 1)];
}
