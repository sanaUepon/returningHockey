let padSnd = [];
let wallSnd = [];
let passSnd = [];
let bgm;

function preload() {
  padSnd[0] = loadSound('01.wav');
  padSnd[1] = loadSound('02.wav');
  wallSnd[0] = loadSound('03.wav');
  wallSnd[1] = loadSound('04.wav');
  wallSnd[2] = loadSound('05.wav');
  passSnd[0] = loadSound('06.wav');
  bgm = loadSound('bgm.mp3');
}

let balls = [];
let padPos;
let padSize;
let bgdCol;
let ballCol;
let stage;
let timestamp = 0;
let startTime;
let score = 0;
let resultTime = 30000;
let countdownStart = 0;
let countdownSeconds = 3;


function setup() {
  let c = createCanvas(300, 400);
  c.parent("game-wrapper");

  rectMode(CENTER);

  padPos = createVector(width / 2, 350);
  padSize = createVector(50, 6);
  bgdCol = color(50);
  ballCol = color(200, 200, 255);
  stage = 0;

  balls = [makeBall()];
  bgm.loop();
  bgm.amp(0.5);
}

function draw() {
  background(0);
  switch(stage) {
    case 0: titleScreen(); break;
    case 1: prepareScreen(); break;
    case 2: countdownScreen(); break;
    case 3:
      gameScreen();
      if (millis() - startTime > resultTime) stage = 4;
      break;
    case 4: resultScreen(); break;
  }

}

function titleScreen() {
  background(10);
  textFont('Futura');
  textAlign(CENTER);
  fill(255);
  textSize(30);
  text('Returning Hockey.', width / 2, height / 2 - 10);
  textSize(12);
  text('programmed by Sana Ueno', width / 2, height / 2 + 20);
  fill(255, 255, 0);
  textSize(16);
  text('CLICK TO START', width / 2, height / 1.5);

}

function prepareScreen() {
  background(20);
  textAlign(CENTER);
  fill(255);
  textSize(20);
  text('Prepare your mouse!', width / 2, height /3.5 );
  textSize(14);
  text('Move your mouse left and right\nto control the paddle.', width / 2, height / 2 - 30);
  text('Return the ball and\n score as high as you can!', width / 2, height / 2 + 30);
  fill(255, 255, 0);
  text('CLICK TO CONTINUE', width / 2, height / 1.5 + 40);
}



function countdownScreen() {
  background(10);
  textAlign(CENTER, CENTER);
  fill(255, 255, 0);
  textSize(60);
  let elapsed = floor((millis() - countdownStart) / 1000);
  let count = countdownSeconds - elapsed;
  if (count > 0) {
    text(count, width / 2, height / 2);
  } else {
    stage = 3;
    startTime = millis();
    score = 0;
    balls = [makeBall()];
  }
}

function gameScreen() {
  
  background(bgdCol);
  noFill();
  stroke(220);
  rect(width / 2, height / 2, width - 10, height);
  rect(width / 2, height / 2, width + 10, 200);
  line(0, height / 2, width, height / 2);
  ellipse(width / 2, height, 200, 100)
  ellipse(width / 2, 0, 200, 100)

  for (let b of balls) {
    b.pos.add(b.velo);
    noStroke();
    fill(ballCol);
    circle(b.pos.x, b.pos.y, b.dia);

    if (b.pos.x < b.dia / 2 || b.pos.x > width - b.dia / 2) {
      b.velo.x *= -1;
      random(wallSnd).play();
      bgdCol = color(random(100), random(100), 255);
      ballCol = color(random(255));
    }

    if (abs(b.pos.x - padPos.x) <= padSize.x / 2 &&
        abs(b.pos.y - padPos.y) <= padSize.y / 2 + b.dia / 2) {
      b.velo.y *= -1;
      random(padSnd).play();
      score++;
    }

    if (b.pos.y < -10 || b.pos.y > height + 10) {
      b.pos = createVector(width / 2, 0);
      b.velo = randomDirectionIn150Downward();
      b.velo.setMag(random(5, 8));
      passSnd[0].play();
    }
  }

  if (millis() - timestamp > 2000 && balls.length < 2) {
    balls.push(makeBall());
    timestamp = millis();
  }

  padPos.x = constrain(mouseX, padSize.x / 2, width - padSize.x / 2);
  fill(200, 200, 255);
  rect(padPos.x, padPos.y, padSize.x, padSize.y);

  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text(`SCORE: ${score}`, 10, 10);
  let timeLeft = max(0, floor((resultTime - (millis() - startTime)) / 1000));
  text(`TIME: ${timeLeft}s`, 10, 30);
}

function resultScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("SCORE", width / 2, height / 3);
  textSize(64);
  text(score, width / 2, height / 2);
  fill(255, 255, 0);
  textSize(16);
  text("CLICK TO RETURN", width / 2, height * 0.75);
}

function makeBall() {
  let pos = createVector(width / 2, height);
  let velo = randomDirectionIn150Downward();
  velo.setMag(random(4, 7));
  return { pos, velo, dia: 10 };
}

function randomDirectionIn150Downward() {
  let angle = PI / 2 + random(-PI * 75 / 180, PI * 75 / 180);
  return p5.Vector.fromAngle(angle);
}

function mousePressed() {
  if (stage === 0) stage = 1;
  else if (stage === 1) {
    countdownStart = millis();
    stage = 2;
  } else if (stage === 4) {
    stage = 0;
  }
}