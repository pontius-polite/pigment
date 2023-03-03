//  ALEATORY

var canvasElement = document.getElementById("mainCanvas");
var ctx = canvasElement.getContext('2d');

//Check when user changes window size, adjust canvas accordingly
$(window).resize(function(){resizeCanvas();});

var outOfFocus = false;

var FPS = 30;
var frameDelta = Math.floor(1000.0/FPS);
var framesElapsed = 0;

var backgroundColor = "#000000";
var globalAntColor;
var globalAntType = 0;
var globalAntSize = 3;
var globalAntSpeed = 5;
var antTypeUniformity = true;
var globalAntLifeTime = 20;

var mouseDown = false;
var mouseX, mouseY;

var canvasWidth, canvasHeight;

/*
ANT TYPES
0: fungus
1: caterpillar
2: wisp
3: pasta
4: slant
5: explosion

*/

//PRESETS
//[type, size, speed, uniformity, lifetime]
var pixiedust = [0, 3, 5, true, 40];
var tangerine = [1, 100, 10, true, 20];
var tangerineExtreme = [1, 1, 40, true, 30];
var classicFungus = [];

function loadPreset(preset){
    var p = preset;
    globalAntType = p[0];
    globalAntSize = p[1];
    globalAntSize = p[2];
    antTypeUniformity = p[3];
    globalAntLifeTime = p[4];
}

loadPreset(tangerineExtreme);

var ants = [];

window.main = function(){
    window.requestAnimationFrame( main );

}

function init(){
    resizeCanvas();
    clearCanvas();
    
    update();
}

function update(){

    if (mouseDown){
        //ants.push(new Ant(mouseX, mouseY, globalAntSize, oscillateColor(), globalAntType));
        //Rotation mirror
        if (true){
            var reflectionAngle = 45;
            var rx, ry = 0;
            var rotationSpeed = 0; //(framesElapsed / 50) % reflectionAngle;
            reflectionAngle = reflectionAngle / 180 * 3.14159;
            for (var i = 0; i < 6.28318; i += reflectionAngle){
                rx = (mouseX - canvasWidth / 2) * Math.cos(i + rotationSpeed) - (mouseY - canvasHeight / 2) * Math.sin(i + rotationSpeed) + canvasWidth / 2;
                ry = (mouseX - canvasWidth / 2) * Math.sin(i + rotationSpeed) + (mouseY - canvasHeight / 2) * Math.cos(i + rotationSpeed) + canvasHeight / 2;
                ants.push(new Ant(rx, ry, globalAntSize, oscillateColor(), globalAntType));
            }
        }
    }
    
    ants = updateAnts(ants);
    draw();  
}

function draw(){
    if (true){
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
        ctx.fillRect(0, 0, $("#mainCanvas").width(), $("#mainCanvas").height());
    }
    
    for (var i = 0; i < ants.length; i++) {
        ants[i].draw();
    }
    framesElapsed++;

    setTimeout(function(){ update(); }, frameDelta);
    
}

function Ant(x, y, size, color, type){
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.size = size;
    this.color = color;
    this.type = type;

    this.lifeTime = 0;

    this.draw = function(){
        ctx.beginPath();
        ctx.arc(Math.round(this.x), Math.round(this.y), this.size, 0, 6.283184);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function updateAnts(currentAnts){
    var newAnts = [];
    for (var i = 0; i < currentAnts.length; i++){
        currentAnts[i].lifeTime += 1;
        if (currentAnts[i].lifeTime < globalAntLifeTime){
            switch (currentAnts[i].type){
                //Fungus
                case 0:
                    currentAnts[i].dx = randomNum(-1 * globalAntSpeed, 1 * globalAntSpeed);
                    currentAnts[i].dy = randomNum(-1 * globalAntSpeed, 1 * globalAntSpeed);

                    currentAnts[i].x += currentAnts[i].dx;
                    currentAnts[i].y += currentAnts[i].dy;
                    break;
                //Caterpillar
                case 1:
                    currentAnts[i].size += globalAntSpeed;
                    break;
                //Wisp (need to redraw background)
                case 2:
                    if (currentAnts[i].size > 0){
                        currentAnts[i].size -= (2 * globalAntSpeed);
                    }
                    break;
                //Pasta
                case 3:
                    currentAnts[i].dx += randomNum(-1, 1);
                    currentAnts[i].dy += randomNum(-1, 1);
                            
                    if (currentAnts[i].dx > 3 * globalAntSpeed)
                        currentAnts[i].dx = 3 * globalAntSpeed;
                    if (currentAnts[i].dx < -3 * globalAntSpeed)
                        currentAnts[i].dx = -3 * globalAntSpeed;
                    if (currentAnts[i].dy > 3 * globalAntSpeed)
                        currentAnts[i].dy = 3 * globalAntSpeed;
                    if (currentAnts[i].dy < -3 * globalAntSpeed)
                        currentAnts[i].dy = -3 * globalAntSpeed;
                    
                    currentAnts[i].x += currentAnts[i].dx;
                    currentAnts[i].y += currentAnts[i].dy;
                    break;
                //Slant
                case 4:
                    currentAnts[i].x += globalAntSpeed;
                    currentAnts[i].y += globalAntSpeed;
                    break;
                //Explosion
                case 5:
                    currentAnts[i].dx *= 0.9;
                    currentAnts[i].dy *= 0.9;

                    if (currentAnts[i].dx < 0.05 && currentAnts[i].dx > -0.05)
                        currentAnts[i].dx += randomNum(-5 * globalAntSpeed, 5 * globalAntSpeed);
                    if (currentAnts[i].dy < 0.05 && currentAnts[i].dy > -0.05)
                        currentAnts[i].dy += randomNum(-5 * globalAntSpeed, 5 * globalAntSpeed);

                    currentAnts[i].x += currentAnts[i].dx;
                    currentAnts[i].y += currentAnts[i].dy;
                    break;
            }
            newAnts.push(currentAnts[i]);
        }
    }
    return newAnts;
}

//Remove Jquery maybe?
function resizeCanvas(){
    //Resize canvas element to window
    $("#mainCanvas").width($(window).width());
    $("#mainCanvas").height($(window).height());
    
    //Resize canvas displayport to window
    canvasElement.width = $(window).width();
    canvasElement.height = $(window).height();

    canvasWidth = $(window).width();
    canvasHeight = $(window).height()
}

function clearCanvas(){
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, $("#mainCanvas").width(), $("#mainCanvas").height());
}

function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomNum(min, max){
    return (Math.random() * (max - min) + min);
}

function colorToString(r, g, b){
    return "rgb(" + r + "," + g + "," + b + ")";
}

function rotatePoint(x, y, p){
    var newX = x * Math.cos(p) - y * Math.sin(p);
    var newY = x * Math.sin(p) + y * Math.cos(p);
}

function oscillateColor() {

    var r = Math.round(125 * Math.sin(framesElapsed/10 + 0) + 125);
    var g = Math.round(125 * Math.sin(framesElapsed/9 + 1) + 125);
    var b = Math.round(125 * Math.sin(framesElapsed/8 + 2) + 125);

    //console.log(r + " " + g + " " + b);

    return colorToString(r, g, b);
}

function getMousePos(evt) {
    var rect = canvasElement.getBoundingClientRect();
    mouseX = evt.clientX - rect.left,
    mouseY = evt.clientY - rect.top
}

canvasElement.addEventListener('mousemove', function(evt) {
    getMousePos(evt);
}, false);
canvasElement.addEventListener('mousedown', function(evt) {
    mouseDown=true;
}, false);
canvasElement.addEventListener('mouseup', function(evt){
    mouseDown=false;
});

// $(document).ready(function(){
//     $("#mainCanvas").mousedown(function(){
//         mouseDown = true;
//     });
//     $("#mainCanvas").mouseup(function(){
//         mouseDown = false;
//     });
//     $("#mainCanvas").mousemove(function( event ) {
//         mouseX = event.pageX;
//         mouseY = event.pageY;
//     });
// });