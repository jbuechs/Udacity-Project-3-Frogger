//Adding sound objects using the howler library
var splash_sound = new Howl({
    urls: ['sounds/splash.mp3', 'sounds/splash.ogg', 'sounds/splash.wav']
});

var move_sound = new Howl({
    urls: ['sounds/move.mp3', 'sounds/move.ogg', 'sounds/move.wav']
});

var collision_sound = new Howl({
    urls: ['sounds/collision.mp3', 'sounds/collision.ogg', 'sounds/collision.wav']
});

//Helper function to generate random integers
function getRandomInt(min, max) {
  	return Math.floor(Math.random() * (max - min)) + min;
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
    this.y = rowY[getRandomInt(0, 3)];
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
	if(this.checkCollisions()) {
		this.reset();
        collision_sound.play();
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

Player.prototype.checkCollisions = function() {
    for (var i = 0; i < allEnemies.length; i++) {
	    if (player.y == allEnemies[i].y &&
	    	player.x >= allEnemies[i].x - 80 &&
	    	player.x <= allEnemies[i].x + 80) {
	        return true;
	    }
	}
	return false;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var rowY = [51, 132, 213, 294, 375];
var colX = [0, 101, 202, 303, 404];
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var allEnemies = [enemy1, enemy2];
var player = new Player();


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