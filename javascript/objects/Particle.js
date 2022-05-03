
class Particle {
    constructor(position, state) {

        this.position = new Vector(position.x, position.y);
        this.prevPosition = new Vector(position.x, position.y);
        this.velocity = new Vector(0, 0);
        this.lifeTime = 0;

        /** Changes to global properties do not affect particle properties below. */
        this.size = state.particleSize;
        this.shape = state.particleShape;
        this.color = state.particleColorGen.color();
        this.speed = state.particleSpeed;
        this.colorBehaviour = state.particleColorBehavior;
        this.movementStyle = state.particleMovementStyle;
        this.growthSpeed = state.particleGrowthSpeed;
        this.lifeSpan = state.particleLifeSpan;
        this.reproduceTime = state.particleReproduceTime;
        this.timer = 0;
    }
    
    update() {

        this.updatePreviousPosition();

        this.applyParticleMovementFormula();

        this.applyParticleColorFormula();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y; 

        //this.size += this.growthSpeed;
        //console.log(this.growthSpeed);

        //this.lifeTime += (1 * this.state.fpsFactor);
    }

    draw(canvasContext) {

        // grab the correct method for drawing this particle
        let drawShape = particleDrawFormulas[this.shape];

        let reflectionPoints = particleReflectionFormulas[state.reflectionStyle](this);
        for (let i = 0; i < reflectionPoints.length; i += 1) {
            let p = reflectionPoints[i];
            drawShape(canvasContext, p[0], p[1], Math.floor(this.size / 2), this.color);
        }
        
        drawShape(canvasContext, this.position.x, this.position.y, Math.floor(this.size / 2), this.color);
        
        let shouldInterpolate = state.interpolateParticleMovements && state.reflectionStyle == "none";
        let difx = this.prevPosition.x - this.position.x;
        let dify = this.prevPosition.y - this.position.y;
        shouldInterpolate = shouldInterpolate && (Math.abs(difx) >= this.size || Math.abs(dify) >= this.size);
    
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

    updatePreviousPosition() {
        this.prevPosition.x = this.position.x;
        this.prevPosition.y = this.position.y;
    }

    applyParticleMovementFormula() {
        particleMovementFormulas[this.movementStyle](this);
    }

    applyParticleColorFormula() {
        particleColorFormulas[state.particleColorBehavior](this);
    }

}