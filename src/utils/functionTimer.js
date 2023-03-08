/**
 * Times how long the provided function takes to compute.
 * @param {function} f The function to time.
 * @returns {number} The time in milliseconds.
 */
const functionTimer = (f) => {
  const start = Date.now();
  f();
  const end = Date.now();
  console.log(`${f.name} - ${end - start}`);
  return (end - start);
}

module.exports = functionTimer;