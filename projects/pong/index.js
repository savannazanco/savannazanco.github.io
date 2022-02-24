/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()

function runProgram(){
////////////////////////////////////////////////////////////////////////////////
//////////////////////////// SETUP /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Constant Variables
var FRAME_RATE = 60;
var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

var KEY = {
"UP": 38,
"DOWN": 40,

"W": 87,
"S": 83,

};
var BOARD_WIDTH = $("#board").width();
var BOARD_HEIGHT = $("#board").height();
// other var 
var score1 = 0;
var score2 = 0;

// Game Item Objects

function GameItem(x, y, speedX, speedY, id){
var gameItemInstance = {
x: x,
y: y,
h: $(id).height(),
w: $(id).width(),
speedX: speedX,
speedY: speedY,
id: id,
}
return gameItemInstance;
}
var paddleLeft = GameItem(20, 200, 0, 0, "#paddleLeft");  

var paddleRight = GameItem(BOARD_WIDTH - 20 - $("#paddleRight").width(), 200, 0, 0, "#paddleRight");

var ball = GameItem(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, (Math.random() > 0.5 ? -3 : 3), (Math.random() > 0.5 ? -3 : 3), "#ball");

// one-time setup
let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
$(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
$(document).on('keyup', handleKeyUp);                           // change 'eventType' to the type of event you want to handle

////////////////////////////////////////////////////////////////////////////////
///////////////////////// CORE LOGIC ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/* 
On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
by calling this function and executing the code inside.
*/
function newFrame() {
  drawScore();
  moveObject(paddleLeft);
  moveObject(paddleRight);
  moveObject(ball);
  wallCollison(paddleRight);
  wallCollison(paddleLeft);
  ballTopBottom();
  ballLeftRight();
  checkScore();
  handleBall();
  
}

/* 
Called in response to events.
*/
function handleKeyDown(event) {

  if (event.which === KEY.UP){
    paddleRight.speedY = -7;
  }
  if (event.which === KEY.DOWN){
  paddleRight.speedY = 7;
  }
  if (event.which === KEY.W){
    paddleLeft.speedY = 7;
  }
  if (event.which === KEY.S){
    paddleLeft.speedY = -7;
  }
}
function handleKeyUp(event) {

  if (event.which === KEY.UP || event.which === KEY.DOWN) {
    paddleRight.speedY = 0;
  }
  if (event.which === KEY.W || event.which === KEY.S) {
    paddleLeft.speedY = 0;
  }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function moveObject(obj){
obj.y += obj.speedY;
obj.x += obj.speedX;
$(obj.id).css("top", obj.y);
$(obj.id).css("left", obj.x);
}
function wallCollison(obj){
  if (obj.y > BOARD_HEIGHT - obj.h){
    obj.y = BOARD_HEIGHT - obj.h;
  }
  if (obj.y < 0){
    obj.y = 0;
  }
}  
function ballTopBottom(){
  if (ball.y > BOARD_HEIGHT - ball.h){
    ball.speedY = ball.speedY * -1;
  }
  if (ball.y < 0){
    ball.speedY = ball.speedY * -1;
  }
}
function ballLeftRight(){
  if (ball.x > BOARD_WIDTH - ball.w){
    score1 = score1 + 1;
    reset();
    
  }
  if (ball.x < 0){
    score2 = score2 + 1;
    reset();
  }
}
function drawScore(){
  $("#score1").text(score1);
  $("#score2").text(score2);
}
function reset(){ // game resets after score meets 10
  if (score1 !== 10 || score2 !== 10){
    paddleLeft = GameItem(20, 200, 0, 0, "#paddleLeft");

    paddleRight = GameItem(BOARD_WIDTH - 20 - $("#paddleRight").width(), 200, 0, 0, "#paddleRight");

    ball = GameItem(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, (Math.random() > 0.5 ? -3 : 3), (Math.random() > 0.5 ? -3 : 3), "#ball");
  }else {
    paddleLeft = GameItem(20, 200, 0, 0, "#paddleLeft");

    paddleRight = GameItem(BOARD_WIDTH - 20 - $("#paddleRight").width(), 200, 0, 0, "#paddleRight");

    ball = GameItem(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, 0, 0, "#ball");
  }
}
 function checkScore(){  // checks when the game meets 10 then it ends 
  if (score1 === 10 ){
    endGame();
    drawPlayAgainButtom();
  }
  if (score2 === 10 ){
    endGame();
    drawPlayAgainButtom();
  }
}
function doCollide(obj1, obj2) {  // colliding 
  
  obj1.leftX = obj1.x;
  obj1.topY = obj1.y;
  obj1.rightX = obj1.x + $(obj1.id).width();
  obj1.bottomY = obj1.y + $(obj1.id).height();

  obj2.leftX = obj2.x;
  obj2.topY = obj2.y;
  obj2.rightX = obj2.x + $(obj2.id).width();
  obj2.bottomY = obj2.y + $(obj2.id).height();

  if ((obj1.rightX > obj2.leftX) &&
      (obj1.leftX < obj2.rightX) &&
      (obj1.bottomY > obj2.topY) &&
      (obj1.topY < obj2.bottomY)){
    return true;
  } else {
    return false
  }
}
function handleBall(){  // balls speed an dwhat the ball collids with
  if (doCollide(ball, paddleRight)){
    ball.speedX = ball.speedX * -1.5;
  }
  if (doCollide(ball, paddleLeft)){
    ball.speedX = ball.speedX * -1.5;
  }
}

function drawPlayAgainButtom() {
  $("#playAgain").text("PLAY AGAIN");
  $("#playAgain").css("top", BOARD_HEIGHT - $("#playAgain").height() / 2);
  $("#playAgain").css("left", BOARD_WIDTH / 2 - $("#playAgain").width() / 2);

}
function endGame() {
// stop the interval timer
clearInterval(interval);

// turn off event handlers
$(document).off();
}

}