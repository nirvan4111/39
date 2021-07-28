var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround;

var coinsGroup, coinImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;
var backgroundImg
var score=0;
var coinSound;

var gameOver, restart;


function preload(){
  coinSound = loadSound("coin.wav")
  
  backgroundImg = loadImage("backg.jpg")

  
  mario_running = loadAnimation("Capture1.png","Capture3.png","Capture4.png"); mario_collided = loadAnimation("mariodead.png");
  
  
  coinImage = loadImage("coin.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");

  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  mario = createSprite(50,height-70,20,50);
  
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.setCollider('circle',0,0,50)
  mario.scale = 0.5
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  

  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5; 

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  coinsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //mario.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    
    if((touches.length > 0 || keyDown("SPACE")) && mario.y  >= height-120) {
      coinSound.play()
      mario.velocityY = -10;
       touches = [];
    }
    
    mario.velocityY = mario.velocityY + 0.8
  
      
    mario.collide(invisibleGround);
    spawncoins();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    //ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    
    //change the mario animation
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawncoins() {
  //write code here to spawn the coins
  if (frameCount % 60 === 0) {
    var coin = createSprite(width+20,height-300,40,10);
    coin.y = Math.round(random(400,420));
    coin.addImage(coinImage);
    coin.scale = 0.2              ;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 300;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth+1;
    
    //add each coin to the group

}
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = mario.depth;
    mario.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  score = 0;
  
}
