
/** Dictates how the particles speed and position should be updated. */
const particleMovementFormulas = {
    "none": (particle) => {},
    "ant": (particle) => {
        particle.velocity.x = randomInt(-1 * particle.speed, particle.speed);
        particle.velocity.y = randomInt(-1 * particle.speed, particle.speed);
        particle.position.x += Math.floor(particle.velocity.x);
        particle.position.y += Math.floor(particle.velocity.y);
    },
    "noodle": () => {},
    "crystal": () => {},
    "tesseract": () => {},
    "firework": () => {},
    "gravity": () => {}
}

/** Returns an array of [x, y] coordinates resulting from reflection of particle's position. */
const particleReflectionFormulas = {
    "none": (particle) => {
        return [];
    },
    "vertical": (particle) => {
        let axis, distToAxis;
        let points = [];
        for (let i = 1; i <= particle.globalProperties.reflectionDegree; i +=1) {
            axis = i * Math.floor(particle.globalProperties.width / (particle.globalProperties.reflectionDegree + 1));
            distToAxis = axis - particle.position.x;
            points.push([axis + distToAxis, particle.position.y]);
        }
        return points;
    },
    "horizontal": (particle) => {
        let axis, distToAxis;
        let points = [];
        for (let i = 1; i <= particle.globalProperties.reflectionDegree; i +=1) {
            axis = i * Math.floor(particle.globalProperties.height / (particle.globalProperties.reflectionDegree + 1));
            distToAxis = axis - particle.position.y;
            points.push([particle.position.x, axis + distToAxis]);
        }
        return points;
    },
    "grid": (particle) => {
        let axis, distToAxis;
        let points = [];
        // Vertical axis reflections
        let reflectionDeg = particle.globalProperties.reflectionDegree;
        for (let i = 1; i <= reflectionDeg; i +=1) {
            axis = i * Math.floor(particle.globalProperties.width / (particle.globalProperties.reflectionDegree + 1));
            distToAxis = axis - particle.position.x;
            let px = axis + distToAxis;
            let py = particle.position.y;
            points.push([px, py]);
            
            // Horizontal axis reflections applied to each verticle reflection
            for (let k = 1; k <= reflectionDeg; k +=1 ) {
                axis = k * Math.floor(particle.globalProperties.height / (particle.globalProperties.reflectionDegree + 1));
                distToAxis = axis - py;
                points.push([px, axis + distToAxis]);
            }
        }
        // Horizontal reflection applied to original point
        for (let i = 1; i <= reflectionDeg; i +=1) {
            axis = i * Math.floor(particle.globalProperties.height / (particle.globalProperties.reflectionDegree + 1));
            distToAxis = axis - particle.position.y;
            points.push([particle.position.x, axis + distToAxis]);
        }
        
        return points;
    },
    "polar": (particle) => {
        
    }
}

const particleDrawFormulas = {
    "circle": drawCircle,
    "square": drawSquare
}