
/** Dictates how the particles speed and position should be updated. */
const particleMovementFormulas = {
    "none": (particle) => {},
    "ant": (particle) => {
        let s = particle.speed * 0.8;
        particle.velocity.x = randomInt(-1 * s, s);
        particle.velocity.y = randomInt(-1 * s, s);
        particle.position.x += particle.velocity.x;
        particle.position.y += particle.velocity.y;
    },
    "noodle": (particle) => {
        particle.velocity.x += randomInt(-1 * particle.speed, particle.speed);
        particle.velocity.y += randomInt(-1 * particle.speed, particle.speed);

        particle.velocity.x = constrainValueToRange(particle.velocity.x, -1 * particle.speed, particle.speed);
        particle.velocity.y = constrainValueToRange(particle.velocity.y, -1 * particle.speed, particle.speed);

    },
    "crystal": (particle) => {
        if (particle.timer == 0) {
            let coin = randomInt(0, 1);
            if (coin) {
                particle.velocity.x = particle.speed;
            } else {
                particle.velocity.x = -1 * particle.speed;
            }
            coin = randomInt(0, 1);
            if (coin) {
                particle.velocity.y = particle.speed;
            } else {
                particle.velocity.y = -1 * particle.speed;
            }
            
            particle.timer = randomInt(2, 5);
        }

        particle.position.x += particle.velocity.x;
        particle.position.y += particle.velocity.y; 

        particle.timer -= 1;
    },
    "threads": (particle) => {
        particle.velocity.x *= 0.95;
        particle.velocity.y *= 0.95;

        if (Math.abs(particle.velocity.x < 0.05) || Math.abs(particle.velocity.y < 0.05)) {
            particle.velocity.x = randomInt(0, particle.speed);
            particle.velocity.y = randomInt(-1, 1);
        }

        particle.position.x += particle.velocity.x;
        particle.position.y += particle.velocity.y; 
    },
    "gravity": (particle) => {
        
    }
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
        let rotationAngle = TAU / (particle.globalProperties.reflectionDegree + 1);
        let px, py;
        let points = [];
        let midX = particle.globalProperties.width / 2.0;
        let midY = particle.globalProperties.height / 2.0
        /** 2D rotation matrix calculation around midpoint of screen. */
        for (let i = rotationAngle; i < TAU; i += rotationAngle){
            px = ((particle.position.x - midX) * Math.cos(i)) 
                - ((particle.position.y - midY) * Math.sin(i)) 
                + midX;
            py = ((particle.position.x - midX) * Math.sin(i)) 
                + ((particle.position.y - midY) * Math.cos(i)) 
                + midY;
            
            points.push([px, py]);
        }
        return points;
    }
}

const particleDrawFormulas = {
    "circle": drawCircle,
    "square": drawSquare
}