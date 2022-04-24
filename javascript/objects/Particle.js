
class Particle {
    
    constructor(x, y, properties) {
        this.pos = new Vector(Math.floor(x), Math.floor(y));
        this.velocity = new Vector(0, 0);
        this.lifeTime = 0;

        this.size = properties.particleSize;
        this.shape = properties.particleShape;
        this.color = properties.defaultParticleColor;
        this.speed = properties.particleSpeed;
        this.colorBehaviour = properties.particleColorBehavior;
        this.movementStyle = properties.particleMovementStyle;
        this.growthSpeed = properties.particleGrowthSpeed;
        this.lifeSpan = properties.particleLifeSpan;
        this.reproduceTime = properties.particleReproduceTime;

        this.movementStyle = "ant";
        this.movementFormulas = {
            "ant": () => {
                this.velocity.x = randomInt(-1 * this.speed, this.speed);
                this.velocity.y = randomInt(-1 * this.speed, this.speed);
            },
            "noodle": () => {
                
            }
        }
        
    }
    
    update() {
        this.movementFormulas[this.movementStyle]();

        this.pos.x += Math.floor(this.velocity.x);
        this.pos.y += Math.floor(this.velocity.y);

        this.reproduceTime -= 1;
        this.lifeTime = 0;
    }

    draw(canvasContext) {
        
        drawCircle(canvasContext, this.pos.x, this.pos.y, Math.floor(this.size / 2), this.color);

        if (props.mirrorType == "vertical") {

        }
    }
    
    multiplyVelocityByFactor(factor) {
        this.velocity.x *= factor;
        this.velocity.y *= factor;
    } 

    isDead() {
        if (this.lifeSpan > 0 && this.lifeTime > this.lifeSpan){
            return true;
        }
        return false;
    }

}