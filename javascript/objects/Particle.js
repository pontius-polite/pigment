
/**
 * Particles are initialized according to AppState properties, but will maintain their
 * own properties unless the particle instance is updated. 
 */

class Particle {
    
    constructor(x, y) {
        this.pos = [0, 0]
        this.velocity = [0, 0];
        this.size = 5;
        this.shape = "circle";
        this.color = "#FFFFFF";

        this.lifeTime = 0;
        this.reproduceTime = 0;
        
    }
    
    update() {
        
    }

    draw() {
        
    }

    x() {
        return this.pos[0];
    }

    y() {
        return this.pos[1];
    }

    xVelocity() {
        return this.velocity[0];
    }

    yVelocity() {
        return this.velocity[1];
    }
    
}