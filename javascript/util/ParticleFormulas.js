
/** Map of names to functions which dictate how the particles speed and position should be updated. */
const particleMovementFormulas = {
    "none": (particle) => {},
    "creep": (particle) => {
        let s = particle.speed * 0.4;
        particle.velocity.x = randomInt(-1 * s, s);
        particle.velocity.y = randomInt(-1 * s, s);
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
        particle.timer -= 1;
    },
    "drip": (particle) => {
        particle.velocity.x *= 0.95;
        particle.velocity.y *= 0.95;

        if (Math.abs(particle.velocity.y < 0.05)) {
            particle.velocity.x = randomFloat(-0.5, 0.5);
            particle.velocity.y = randomInt(1, particle.speed);
            
        }
    },
    "bounce": (particle) => {
        if (particle.lifeTime == 0) {
            particle.velocity.x = randomFloat(-0.5 * particle.speed, 0.5 * particle.speed);
            particle.velocity.y = randomFloat(-1 * particle.speed, particle.speed);
        }

        if (particle.position.y > state.height) {
            particle.position.y = state.height - particle.size / 2.0;
            particle.velocity.y *= -0.75;
        }

        particle.velocity.y += particle.speed / 10.0;     
    },
    "orbit": (particle) => {
        let rotationAngle = TAU * particle.speed / 360;
        let midX = state.width / 2.0;
        let midY = state.height / 2.0 
        
        // TODO: make this a formula of the velocity, not the position
        particle.position.x = ((particle.position.x - midX) * Math.cos(rotationAngle)) 
                - ((particle.position.y - midY) * Math.sin(rotationAngle)) 
                + midX;
        particle.position.y = ((particle.position.x - midX) * Math.sin(rotationAngle)) 
            + ((particle.position.y - midY) * Math.cos(rotationAngle)) 
            + midY;
    }
}

/** Map of names to functions which return an array of [x, y] coordinates resulting from reflection of particle's position. */
const particleReflectionFormulas = {
    "none": (particle) => {
        return [];
    },
    "vertical": (particle) => {
        let axis, distToAxis;
        let points = [];
        for (let i = 1; i <= state.reflectionDegree; i +=1) {
            axis = i * Math.floor(state.width / (state.reflectionDegree + 1));
            distToAxis = axis - particle.position.x;
            points.push([axis + distToAxis, particle.position.y]);
        }
        return points;
    },
    "horizontal": (particle) => {
        let axis, distToAxis;
        let points = [];
        for (let i = 1; i <= state.reflectionDegree; i +=1) {
            axis = i * Math.floor(state.height / (state.reflectionDegree + 1));
            distToAxis = axis - particle.position.y;
            points.push([particle.position.x, axis + distToAxis]);
        }
        return points;
    },
    "grid": (particle) => {
        let axis, distToAxis;
        let points = [];
        // Vertical axis reflections
        let reflectionDeg = state.reflectionDegree;
        for (let i = 1; i <= reflectionDeg; i +=1) {
            axis = i * Math.floor(state.width / (state.reflectionDegree + 1));
            distToAxis = axis - particle.position.x;
            let px = axis + distToAxis;
            let py = particle.position.y;
            points.push([px, py]);
            
            // Horizontal axis reflections applied to each verticle reflection
            for (let k = 1; k <= reflectionDeg; k +=1 ) {
                axis = k * Math.floor(state.height / (state.reflectionDegree + 1));
                distToAxis = axis - py;
                points.push([px, axis + distToAxis]);
            }
        }
        // Horizontal reflection applied to original point
        for (let i = 1; i <= reflectionDeg; i +=1) {
            axis = i * Math.floor(state.height / (state.reflectionDegree + 1));
            distToAxis = axis - particle.position.y;
            points.push([particle.position.x, axis + distToAxis]);
        }
        
        return points;
    },
    "polar": (particle) => {
        let rotationAngle = TAU / (state.reflectionDegree + 1);
        let px, py;
        let points = [];
        let midX = state.width / 2.0;
        let midY = state.height / 2.0
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

/** Map of names to functions which will be used to draw a particle.  */
const particleDrawFormulas = {
    "circle": drawCircle,
    "square": drawSquare
}

const particleColorFormulas = {
    "normal": (particle) => {},
    "uniform": (particle) => {
        if (Math.floor(5.0 / state.fpsFactor) % state.framesElapsed == 0){
            state.particleColorGen.update()
        }
            
        particle.color = state.particleColorGen.color();
    }
}