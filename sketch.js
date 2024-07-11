/*
Extra features implemented:
- Added jet thrusters to the bottom of the spaceship
- Added a score count of how many asteroids the player has hit
- Player levels up every 30 seconds where asteroids are spawned more frequently
*/

var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];
let img;
var score = 0;
var scoreText;
var timer = 0;
var timerText;
var levelText;
var fade = 255;
let showText = true;

//////////////////////////////////////////////////
function setup() {
  createCanvas(1200,800);
  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  //location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width/2, height*2.9);
  atmosphereSize = new createVector(width*3, width*3);
  earthLoc = new createVector(width/2, height*3.1);
  earthSize = new createVector(width*3, width*3);
    
    img = loadImage('fire_1f525.gif');
}

//////////////////////////////////////////////////
function draw() {
  background(0);
  sky();

  spaceship.run();
  asteroids.run();

  drawEarth();

  checkCollisions(spaceship, asteroids); // function that checks collision between various elements

    if (frameCount % 60 == 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
        timer ++;
    }
    
    if (showText) {
        fill(255);
        textSize(20);
        scoreText = text("Score: " + score, 1130, 40);
        timerText = text("Timer: " + convertSeconds(timer), 1130, 70);
    }
    
    //makes the game get progressively harder by spawning more asteroids every 30 seconds
    if (frameCount % 1800 == 0 && asteroids.spawnRate < 1) {
        asteroids.spawnRate += 0.01;
        fade = 255;
    }
    
    fade --;
    
    fill(255, 255, 255, fade);
    textSize(80);
    textAlign(CENTER);
    levelText = text("LEVEL " + str(asteroids.spawnRate).charAt(str(asteroids.spawnRate).length - 1), width/2, height/2);
    
    if (asteroids.spawnRate > 0.01) {
        textSize(35);
        text("Asteroids will spawn faster!", width/2, 450);
    }
}

//////////////////////////////////////////////////
//draws earth and atmosphere
function drawEarth(){
  noStroke();
  //draw atmosphere
  fill(0,0,255,50);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x,  atmosphereSize.y);
  //draw earth
  fill(100,255);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids){
    
    //spaceship-2-asteroid collisions
    //YOUR CODE HERE (2-3 lines approx)
    for (var i=0; i<asteroids.locations.length; i++){
        if (isInside(asteroids.locations[i], asteroids.diams[i], spaceship.location, spaceship.size)){
            gameOver();
        }
    }
    
    //asteroid-2-earth collisions
    //YOUR CODE HERE (2-3 lines approx)
    for (var i=0; i<asteroids.locations.length; i++){
        if (isInside(asteroids.locations[i], asteroids.diams[i], earthLoc, earthSize.x)){
            gameOver();
        }
    }

    //spaceship-2-earth
    //YOUR CODE HERE (1-2 lines approx)
    if (isInside(spaceship.location, spaceship.size, earthLoc, earthSize.x)){
        gameOver();
    }
    
    //spaceship-2-atmosphere
    //YOUR CODE HERE (1-2 lines approx)
    if (isInside(spaceship.location, spaceship.size, atmosphereLoc, atmosphereSize.x)){
        spaceship.setNearEarth();
    }

    //bullet collisions
    //YOUR CODE HERE (3-4 lines approx)
    for (var i=0; i<asteroids.locations.length; i++){
        for (var j=0; j<spaceship.bulletSys.bullets.length; j++){
            if (isInside(asteroids.locations[i], 
                         asteroids.diams[i], 
                         createVector(spaceship.bulletSys.bullets[j].x, spaceship.bulletSys.bullets[j].y), 
                         spaceship.bulletSys.diam)){
                asteroids.destroy(i);
                spaceship.bulletSys.destroy(j);
                score += 1;
                break;
            }
        }
    }
}

//////////////////////////////////////////////////
//helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB){
    // YOUR CODE HERE (3-5 lines approx)
    if (dist(locA.x, locA.y, locB.x, locB.y) < (sizeA/2 + sizeB/2)){
        // objects are colliding
        return true;
    }
    
    else{
        return false;
    }
}

//////////////////////////////////////////////////
function keyPressed(){
  if (keyIsPressed && keyCode === 32){ // if spacebar is pressed, fire!
    spaceship.fire();
  }
}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver(){
  fill(255);
  textSize(80);
  textAlign(CENTER);
  text("GAME OVER", width/2, height/2);
  textSize(35);
  text("Total score: " + score, width/2, 450);
  noLoop();
  showText = false;
}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky(){
  push();
  while (starLocs.length<300){
    starLocs.push(new createVector(random(width), random(height)));
  }
  fill(255);
  for (var i=0; i<starLocs.length; i++){
    rect(starLocs[i].x, starLocs[i].y,2,2);
  }

  if (random(1)<0.3) starLocs.splice(int(random(starLocs.length)),1);
  pop();
}

function convertSeconds(s) {
  let min = Math.floor(s / 60);
  let sec = (s % 60);
  
let formatted = min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
  return formatted
}