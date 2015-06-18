//Adding sound objects using the howler library
var splash_sound = new Howl({
        urls: ['sounds/splash.mp3', 'sounds/splash.ogg', 'sounds/splash.wav']
    }),
    move_sound = new Howl({
        urls: ['sounds/move.mp3', 'sounds/move.ogg', 'sounds/move.wav']
    }),
    collision_sound = new Howl({
        urls: ['sounds/collision.mp3', 'sounds/collision.ogg', 'sounds/collision.wav']
    })
    gem_sound = new Howl({
        urls: ['sounds/gem.mp3', 'sounds/gem.ogg', 'sounds/gem.wav']
    });

//Adding timer to game
var seconds = 40;
var timer_handler = function() {
//code for the timer
    seconds--;
}

function create_timer() {
    intervalVar = setInterval(timer_handler, 1000);
}

function timer_update() {
    //Draws white rectangle on the right side of the canvas
    ctx.fillStyle = "white";
    ctx.fillRect(505, 0, 110, 660);
    if (seconds === 0) {
        //TODO: add some kind of fail
        clearInterval(intervalVar);
        return;
    }
    ctx.font = "20px Arial";
    ctx.fillStyle = "Black";
    ctx.fillText("Time left:", 506, 175);
    if (seconds <= 30 && seconds > 5) {
        ctx.fillStyle = "Orange";
    }
    if (seconds <= 5) {
        ctx.fillStyle = "Red";
    }
    ctx.fillText(seconds, 506, 200);

}

//Create second level
var levelUp = function() {
    if (seconds <= 30) {
        maxRow = 4;
        return true;
    }
    else {
        return false;
    }
}

function level_update() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "Black";
    if (levelUp()) {
        ctx.fillText("Level 2", 506, 100);
    } else {
        ctx.fillText("Level 1", 506, 100);
    }
}


//Helper function to generate random integers
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//Add gems
var Gem = function() {
    this.sprite = 'images/Gem Blue.png';
    this.reset();
}

Gem.prototype.reset = function() {
    this.x = colX[getRandomInt(0, 4)]
    this.y = rowY[getRandomInt(1, maxRow)];
}

Gem.prototype.update = function() {
    this.render();
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x + 10, this.y + 60, 80, 100);
}

//Add lives
var lives = 3;


//Create scoring
var score = 0;

function score_update() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "Black";
    ctx.fillText("Score:", 506, 300);
    ctx.fillText(score, 580, 300);
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.reset();
    this.sprite = 'images/enemy-bug.png';
}

Enemy.prototype.reset = function() {
	this.x = getRandomInt(-200, -80);
    this.speed = getRandomInt(50, 250);
    this.y = rowY[getRandomInt(0, maxRow)];
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    if (this.x > 505) {
    	this.reset();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Spawn a new enemy every 15 seconds
var spawn_handler = function() {
//code for spawning a new enemy
    var newEnemy = new Enemy();
    allEnemies.push(newEnemy);
}

function create_spawn_timer() {
    intervalVar = setInterval(spawn_handler, 10000);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.reset();
    this.sprite = 'images/char-pink-girl.png';
}

Player.prototype.reset = function() {
    this.col = 2;
    this.row = 4;
    this.x = colX[this.col];
    this.y = rowY[this.row];
}

Player.prototype.update = function() {
	if(this.checkEnemyCollisions()) {
		this.reset();
        collision_sound.play();
	}
    if(this.checkGemCollisions()) {
        score += 50;
        gem.reset();
        gem_sound.play();
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.col > 0) {
                this.col--;
                this.x = colX[this.col];
                move_sound.play();
            }
            break;
        case 'up':
            if (this.row > 0) {
                this.row--;
                this.y = rowY[this.row];
                move_sound.play();
            } else {
                splash_sound.play();
            	this.reset();
            }
            break;
        case 'right':
            if (this.col < colX.length - 1) {
                this.col++;
                this.x = colX[this.col];
                move_sound.play();
            }
            break;
        case 'down':
            if (this.row < rowY.length - 1) {
                this.row++;
                this.y = rowY[this.row];
                move_sound.play();
            }
            break;
    }
}

Player.prototype.checkEnemyCollisions = function() {
    for (var i = 0; i < allEnemies.length; i++) {
	    if (player.y === allEnemies[i].y &&
	    	player.x >= allEnemies[i].x - 80 &&
	    	player.x <= allEnemies[i].x + 80) {
	        return true;
	    }
	}
	return false;
}

Player.prototype.checkGemCollisions = function() {
    if (player.y === gem.y &&
            player.x >= gem.x - 80 &&
            player.x <= gem.x + 80) {
            return true;
    }
    return false;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var rowY = [51, 132, 213, 294, 375],
    colX = [0, 101, 202, 303, 404],
    maxRow = 3,
    gem = new Gem(),
    allEnemies = [];
    allGems = [];
    player = new Player();

for (var i = 0; i < 5; i++) {
    var newEnemy = new Enemy();
    allEnemies.push(newEnemy);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});