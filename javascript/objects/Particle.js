
/**
 * Particles are initialized according to AppState properties, but will maintain their
 * own properties unless the particle instance is updated. 
 */

class Particle {
    
    constructor(x, y) {
        this.pos = [Math.floor(x), Math.floor(y)];
        this.velocity = [0, 0];

        this.size = 5;
        this.shape = "circle";
        this.color = "#FFFFFF";
        this.speed = 5;

        this.growthSpeed = 0;

        this.lifeTime = 0;
        this.reproduceTime = 0;

        this.movementStyle = "ant";
        this.movementFormulas = {
            "ant": () => {
                this.velocity[0] = randomInt(-1 * this.speed, this.speed);
                this.velocity[1] = randomInt(-1 * this.speed, this.speed);
            },
            "noodle": () => {
                
            }
        }
        
    }
    
    update() {
        this.movementFormulas[this.movementStyle]();

        this.pos[0] += this.velocity[0];
        this.pos[1] += this.velocity[1];

        this.reproduceTime -= 1;
        this.lifeTime = 0;
    }

    draw(canvasContext) {
        canvasContext.fillStyle = this.color;
        canvasContext.strokeStyle = this.color;
        canvasContext.beginPath();
        canvasContext.arc(
            Math.round(this.pos[0]), Math.round(this.pos[1]), this.size, 0, 6.283184);
        canvasContext.stroke();
        canvasContext.fill();
    }

    getX() {
        return this.pos[0];
    }

    getY() {
        return this.pos[1];
    }

    setX(x) {
        this.pos[0] = Math.floor(x);
    }

    setY(y) {
        this.pos[1] = Math.floor(y);
    }

    getVelocityX() {
        return this.velocity[0];
    }

    getVelocityY() {
        return this.velocity[1];
    }

    getAbsoluteSpeed() {
        return Math.sqrt(
            (this.velocity[0] * this.velocity[0]) + (this.velocity[1] * this.velocity[1]));
    }
    
    multiplyVelocityByFactor(factor) {
        this.velocity[0] *= factor;
        this.velocity[1] *= factor;
    } 

}