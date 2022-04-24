
class Particle {
    
    constructor(position, properties) {
        this.position = new Vector(position.x, position.y);
        this.prevPosition = new Vector(position.x, position.y);
        this.velocity = new Vector(0, 0);
        this.lifeTime = 0;
        /** Reference to global properties. */
        this.globalProperties = properties;

        /** Changes to global properties do not affect particle properties below. */
        this.size = this.globalProperties.particleSize;
        this.shape = this.globalProperties.particleShape;
        this.color = this.globalProperties.defaultParticleColor;
        this.speed = this.globalProperties.particleSpeed;
        this.colorBehaviour = this.globalProperties.particleColorBehavior;
        this.movementStyle = this.globalProperties.particleMovementStyle;
        this.growthSpeed = this.globalProperties.particleGrowthSpeed;
        this.lifeSpan = this.globalProperties.particleLifeSpan;
        this.reproduceTime = this.globalProperties.particleReproduceTime;
        this.timer = 0;
    }
    
    update() {
        this.prevPosition.x = this.position.x;
        this.prevPosition.y = this.position.y;

        particleMovementFormulas[this.movementStyle](this);

        if (this.colorBehaviour == "uniform") {
            this.color = this.globalProperties.colorGen.color();
        }

        if (this.colorBehaviour == "cascade" && this.lifeTime % this.globalProperties.cascadeFrequency == 0) {
            this.color = this.globalProperties.colorGen.color();
        }

        this.size += this.growthSpeed;

        this.lifeTime += 1;
    }

    draw(canvasContext) {

        // grab the correct method for drawing this particle
        let drawShape = particleDrawFormulas[this.shape];

        let reflectionPoints = particleReflectionFormulas[this.globalProperties.reflectionStyle](this);
        let pt;
        for (let i = 0; i < reflectionPoints.length; i += 1) {
            pt = reflectionPoints[i];
            drawShape(canvasContext, pt[0], pt[1], Math.floor(this.size / 2), this.color);
        }
        
        drawShape(canvasContext, this.position.x, this.position.y, Math.floor(this.size / 2), this.color);

        let shouldInterpolate = this.globalProperties.interpolateParticleMovements && this.globalProperties.reflectionStyle == "none" && this.prevPosition.distance(this.position) > this.size;
        if (shouldInterpolate) {
            drawLine(canvasContext, this.prevPosition.x, this.prevPosition.y, this.position.x, this.position.y, this.size, this.color);
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