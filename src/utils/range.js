/**
 * Returns a number that is either in the range, or the range boundary.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns
 */
export const constrainValueToRange = (value, min, max) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};
