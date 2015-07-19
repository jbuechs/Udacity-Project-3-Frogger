// Adding sound objects using the howler library
var splash_sound = new Howl({
        urls: ['sounds/splash.mp3', 'sounds/splash.ogg', 'sounds/splash.wav']
    }),
    move_sound = new Howl({
        urls: ['sounds/move.mp3', 'sounds/move.ogg', 'sounds/move.wav']
    }),
    collision_sound = new Howl({
        urls: ['sounds/collision.mp3', 'sounds/collision.ogg', 'sounds/collision.wav']
    }),
    gem_sound = new Howl({
        urls: ['sounds/gem.mp3', 'sounds/gem.ogg', 'sounds/gem.wav']
    }),
    heart_sound = new Howl( {
        urls: ['sounds/heart.mp3', 'sounds/heart.ogg', 'sounds/heart.wav']
    }),
    game_over_sound = new Howl( {
        urls: ['sounds/game-over.mp3', 'sounds/game-over.ogg', 'sounds/game-over.wav']
    }),
// Variables
    rowY = [51, 132, 213, 294, 375],
    colX = [0, 101, 202, 303, 404],
    maxRow = 3,
    allEnemies = [],
    allHearts = [],
    allGems = [];

/**
  * @desc creates a countdown timer class for the game
  * @param seconds - the number of seconds the game will last
*/
var Timer = function(seconds) {
    this.seconds = seconds;
};

Timer.prototype.timer_handler = function() {
    this.seconds--;
};

Timer.prototype.create_timer = function() {
    this.intervalVar = setInterval(this.timer_handler.bind(this), 1000);
};

Timer.prototype.timer_update = function() {
    //Draws white rectangle on the right side of the canvas
    ctx.fillStyle = "white";
    ctx.fillRect(505, 0, 200, 475);
    if (this.seconds === 0) {
        clearInterval(this.intervalVar);
        return true;
    }
    ctx.font = "20px Arial";
    ctx.fillStyle = "Black";
    ctx.fillText("Time left:", 506, 175);
    //Draws seconds left. Change colors as time is running out
    if (this.seconds <= 30 && this.seconds > 5) {
        ctx.fillStyle = "Orange";
    }
    if (this.seconds <= 5) {
        ctx.fillStyle = "Red";
    }
    ctx.fillText(this.seconds, 506, 200);
    return false;
};

//Create second level with 60 seconds left by adding row
var levelUp = function() {
    if (timer.seconds <= 60) {
        maxRow = 4;
        return true;
    }
    else {
        return false;
    }
};

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

/**
  * @desc creates a heart class for collecting and increasing lives
*/
var Heart = function() {
    this.sprite = 'images/Heart.png';
    this.reset();
};

Heart.prototype.reset = function() {
    this.x = colX[getRandomInt(0, 5)];
    this.y = rowY[getRandomInt(0, maxRow)];
    clearInterval(this.intervalVar);
};

Heart.prototype.update = function() {
    this.render();
};

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x + 10, this.y + 60, 80, 100);
};

// After collision, creates 5 sec wait time before heart reappears
Heart.prototype.deactivate = function() {
    this.x = 5000;      // Moves heart off screen
    this.intervalVar = setInterval(this.reset.bind(this), 5000);
};

/**
  * @desc creates a gem class for collecting and increasing score
*/
var Gem = function() {
    this.sprite = 'images/Gem Blue.png';
    this.reset();
};

Gem.prototype.reset = function() {
    this.x = colX[getRandomInt(0, 5)];
    this.y = rowY[getRandomInt(0, maxRow)];
    while (this.check_repeat(allGems)) {
        this.reset();
    }

};

Gem.prototype.update = function() {
    this.render();
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x + 10, this.y + 60, 80, 100);
};

// Checks if this gem is on the same space as other gems
// to prevent multiple gems on the same space
Gem.prototype.check_repeat = function(objArray) {
    for (var i = 0, len = objArray.length; i < len; i++) {
        if (this !== objArray[i] &&
            this.x === objArray[i].x &&
            this.y === objArray[i].y) {
            return true;
        }
    }
    return false;
};

//Spawn a new gem every 15 seconds
var gem_handler = function() {
    var newGem = new Gem();
    allGems.push(newGem);
};

function create_gem_timer() {
    intervalVar = setInterval(gem_handler, 15000);
}

//Create scoring
var score = 0;

function score_update() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "Black";
    ctx.fillText("Score:", 506, 300);
    ctx.fillText(score, 580, 300);
}

/**
  * @desc creates an enemy class the player must avoid
*/
var Enemy = function() {
    this.reset();
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.reset = function() {
	this.x = getRandomInt(-200, -80);
    this.speed = getRandomInt(50, 250);
    this.y = rowY[getRandomInt(0, maxRow)];
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;
    if (this.x > 505) {
    	this.reset();
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Spawn a new enemy every 20 seconds
var spawn_handler = function() {
    var newEnemy = new Enemy();
    allEnemies.push(newEnemy);
};

function create_spawn_timer() {
    intervalVar = setInterval(spawn_handler, 20000);
}

/**
  * @desc creates a player class
*/
var Player = function() {
    this.reset();
    this.sprite = 'images/char-pink-girl.png';
    this.lives = 3;
};

Player.prototype.reset = function() {
    this.col = 2;
    this.row = 4;
    this.x = colX[this.col];
    this.y = rowY[this.row];
};

Player.prototype.update = function() {
    // Check enemy collisions
	var enemyCollisions = this.checkCollisions(allEnemies);
    if(enemyCollisions >= 0) {
		this.reset();
        this.lives--;
        collision_sound.play();
        if (this.lives === 0) {
            return true;
        }
	}
    // Check gem collisions
    var gemCollision = this.checkCollisions(allGems);
    if(gemCollision >=0) {
        score += 50;
        allGems[gemCollision].reset();
        gem_sound.play();
        if (score % 250 === 0 && allHearts.length < 3) {
            var newHeart = new Heart();
            allHearts.push(newHeart);
        }
    }
    // Check heart collisions
    var heartCollision = this.checkCollisions(allHearts);
    if (heartCollision >=0) {
        heart_sound.play();
        allHearts[heartCollision].deactivate();
        if (this.lives < 5) {
                this.lives++;
        }
    }
    return false;
};

// Shows number of lives by drawing hearts on screen
Player.prototype.lives_render = function() {
    ctx.fillStyle = "white";
    ctx.fillRect(505, 480, 700, 550);
    ctx.font = "20px Arial";
    ctx.fillStyle = "Black";
    ctx.fillText("Lives:", 506, 500);
    ctx.drawImage(Resources.get('images/heart_lives_small.png'), 0, 0, this.lives * 20, 20, 506, 500, this.lives * 20, 20);
};

// Draws player on the canvas
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.lives_render();
};

// Input handler for pressing arrow keys
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
                this.lives--;
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
};

// @desc Function checks whether player collides with other objects
// @param objArray an array of objects to check for collisions - enemies, gems, or hearts
Player.prototype.checkCollisions = function(objArray) {
    for (var i = 0, len = objArray.length; i < len; i++) {
        if (this.y === objArray[i].y &&
            this.x >= objArray[i].x - 80 &&
            this.x <= objArray[i].x + 80) {
            return i;
        }
    }
    return -1;
};

// Instantiating objects.
var timer = new Timer(120),
    gem = new Gem(),
    allGems = [gem],
    player = new Player();

for (var i = 0; i < 4; i++) {
    var newEnemy = new Enemy();
    allEnemies.push(newEnemy);
}

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});