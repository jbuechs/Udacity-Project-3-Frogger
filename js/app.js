//Adding sound objects using the howler library
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
    });

//Adding timer to game

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
    if (this.seconds <= 30 && this.seconds > 5) {
        ctx.fillStyle = "Orange";
    }
    if (this.seconds <= 5) {
        ctx.fillStyle = "Red";
    }
    ctx.fillText(this.seconds, 506, 200);
    return false;
};

//Create second level
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

//Add hearts
var Heart = function() {
    this.sprite = 'images/Heart.png';
    this.reset();
};

Heart.prototype.reset = function() {
    this.x = colX[getRandomInt(0, 5)];
    this.y = rowY[getRandomInt(0, maxRow)];
};

Heart.prototype.update = function() {
    this.render();
};

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x + 10, this.y + 60, 80, 100);
};

//Add gems
var Gem = function() {
    this.sprite = 'images/Gem Blue.png';
    this.reset();
};

Gem.prototype.reset = function() {
    this.x = colX[getRandomInt(0, 5)];
    this.y = rowY[getRandomInt(0, maxRow)];
/*
At this point in the program, I want to check to see whether there is already a gem
at this location. I have created this check_repeat function which I have tested in the
console and it works as I wanted - returns true if there is already a gem in that location
and false if there is not. The while loop is throwing an error. I think it has something to
do with the allGems array - maybe it's not defined yet, maybe something to do with scope?
I thought allGems was in the global scope but when I try to access it I get an error.
Not sure. Confused. Would appreciate help!

    while (this.check_repeat(allGems)) {
        this.reset();
    }
*/
};

Gem.prototype.update = function() {
    this.render();
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x + 10, this.y + 60, 80, 100);
};

//Checks if this gem is on the same space as other gems
/*
Should be called in the gem reset function
//I originally just had allGems in the function but I got an error that it wasn't
defined so I included allGems as a parameter. I don't understand why I couldn't
access allGems because it is a global object. Probably has to do with scope...
*/
Gem.prototype.check_repeat = function(allGems) {
    for (var i = 0, len = allGems.length; i < len; i++) {
        if (this !== allGems[i] &&
            this.x === allGems[i].x &&
            this.y === allGems[i].y) {
            return true;
        }
    }
    return false;
};

//Spawn a new gem every 15 seconds
var gem_handler = function() {
//code for spawning a new enemy
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

// Enemies our player must avoid
var Enemy = function() {
    this.reset();
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.reset = function() {
	this.x = getRandomInt(-200, -80);
    this.speed = getRandomInt(50, 250);
    this.y = rowY[getRandomInt(0, maxRow)];
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;
    if (this.x > 505) {
    	this.reset();
    }
};

// Draw the enemy on the screen, required method for game
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

//Player Class

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
	var enemyCollisions = this.checkCollisions(allEnemies);
    if(enemyCollisions >= 0) {
		this.reset();
        collision_sound.play();
        if (this.lives === 0) {
            return true;
        }
	}
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
    var heartCollision = this.checkCollisions(allHearts);
    if (heartCollision >=0) {
        allHearts[heartCollision].reset();
        if (this.lives < 5) {
                this.lives++;
        }
    }
    return false;
};

Player.prototype.lives_render = function() {
    ctx.fillStyle = "white";
    ctx.fillRect(505, 480, 700, 550);
    ctx.font = "20px Arial";
    ctx.fillStyle = "Black";
    ctx.fillText("Lives:", 506, 500);
    ctx.drawImage(Resources.get('images/heart_lives_small.png'), 0, 0, this.lives * 20, 20, 506, 500, this.lives * 20, 20);
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.lives_render();
};

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

/*
Attempt to refactor code to have one collision function. Not working yet.
*/
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var rowY = [51, 132, 213, 294, 375],
    colX = [0, 101, 202, 303, 404],
    maxRow = 3,
    timer = new Timer(120),
    gem = new Gem(),
    allEnemies = [],
    allHearts = [],
    allGems = [gem],
    player = new Player();

for (var i = 0; i < 4; i++) {
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