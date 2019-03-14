var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null;

var tics = 0;
var _timeToBeAlive = 30;
var gameOver = false;
var stageVictory = false;
var tableScore = [0,0,0,0,0,0,0,0];
var countScore = 0;
var stageNumber = 0;

//Canvas
var divArena;
var canArena;
var canScore;
var conArena;
var conScore;
var ArenaWidth = 500;
var ArenaHeight = 300;

//Background
var imgBackground;
var xBackgroundOffset = 0;
var xBackgroundSpeed = 1;
var backgroundWidth = 1782;
var backgroundHeight = 600;
//une modification

///////////////////////////////////
//Keys
var keys = {
	UP: 38,
	DOWN: 40,
	SPACE: 32,
	ENTER: 13,
	LEFT: 37,
	RIGHT: 39
};

var keyStatus = {};

function keyDownHandler(event) {
    "use strict"; 
    var keycode = event.keyCode, 
        key; 
    for (key in keys) {
        if (keys[key] === keycode) {
            keyStatus[keycode] = true;
            event.preventDefault();
        }
    }
}
function keyUpHandler(event) {
   var keycode = event.keyCode,
            key;
    for (key in keys) 
        if (keys[key] == keycode) {
            keyStatus[keycode] = false;
        }
        
    }

////////////////////


function updateScene() {
    "use strict"; 
    xBackgroundOffset = (xBackgroundOffset - xBackgroundSpeed) % backgroundWidth;
}
function updateItems() {
    "use strict"; 
    player.update();
		 tics++;
		  if(tics % 100 == 1) {
		      var rand1 = Math.floor(Math.random() * ArenaHeight);
				var rand2 = Math.floor(Math.random() * 10);
		
		     enemies.add(new Enemy(ArenaWidth, rand1, -rand2));
		 }
		 enemies.update();
	
}
function drawScene() {
    "use strict"; 
    canArena.style.backgroundPosition = xBackgroundOffset + "px 0px" ;
}
function drawItems() {
    "use strict"; 
    player.draw();
    enemies.draw();
}
function clearItems() {
    "use strict"; 
    player.clear(); 
    enemies.clear();
}

function clearScore() {
    conScore.clearRect(0,0,500,50);
}

function drawScore() {
    conScore.fillText("life : "+player.nbOfLives, 10, 25);
    conScore.fillText("score : "+player.projectileSet.score, 150,25);
	 conScore.fillText("stage :"+ stageNumber, 300, 25);
}
function updateGame() {
    "use strict"; 
    updateScene();
    updateItems();
}
function clearGame() {
    "use strict"; 
    clearItems();
    clearScore();
}

function drawGame() {
    "use strict"; 
    drawScene();
    drawScore();
    drawItems();    
}

//called when GameOver
function endGame(){
	var keycode;
	conArena.fillStyle = "white";
	conArena.fillText("press enter to restart", 210, 150);
	conArena.fillText("Scores : "+ tableScore, 210, 200); 
	for (keycode in keyStatus) {
                if(keyStatus[keycode] == true){
                    if(keycode == keys.ENTER) {
                        gameOver = false;
								conArena.clearRect(210,100,200,200);
								if(countScore<8){
									tableScore[countScore]=player.projectileSet.score;		
									countScore++;
									console.log(countScore + " countscore");
								}
								else{
									countScore = 0;
									tableScore[countScore]=player.projectileSet.score;
									countScore++;
								}
								if(!player.projectileSet.score<5){
									stageNumber++;
								}
								player.nbOfLives = 2;
								player.projectileSet.score = 0;	
								if(stageNumber<2){
									enemies.init();
								}
								clearScore();
								console.log(tableScore);
                    }
					}
	}
}


function mainloop () {
	if(!gameOver){
		 "use strict"; 
		 clearGame();
		if(player.projectileSet.score<5){
		 	updateGame();
		 	drawGame();
		}
		else{
			endGame();
		}
	}
	else{
		clearGame();
		endGame();
	}
}

function recursiveAnim () {
    "use strict"; 
    mainloop();
    animFrame( recursiveAnim );
}
 
function init() {
    "use strict";
    divArena = document.getElementById("arena");
    canArena = document.createElement("canvas");
    canArena.setAttribute("id", "canArena");
    canArena.setAttribute("height", ArenaHeight);
    canArena.setAttribute("width", ArenaWidth);
    conArena = canArena.getContext("2d");
    divArena.appendChild(canArena);

    canScore = document.createElement("canvas");
    canScore.setAttribute("id","canScore");
    canScore.setAttribute("height", ArenaHeight);
    canScore.setAttribute("width", ArenaWidth);
    conScore = canScore.getContext("2d");
    conScore.fillStyle = "rgb(200,0,0)";
    conScore.font = 'bold 12pt Courier';
    divArena.appendChild(canScore);

 
    player.init();
    enemies.init();
    
window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);
    
    animFrame( recursiveAnim );
    
}

window.addEventListener("load", init, false);
