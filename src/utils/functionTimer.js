/**
 * Times how long the provided function takes to compute and prints result to console.
 * @param {string} label 
 * @param {function} f The function to time.
 */
const functionTimer = (label, f) => {
  const start = Date.now();
  f();
  console.log(`${label ? label : f.name}`);
  console.log(Date.now() - start);
}

module.exports = functionTimer;