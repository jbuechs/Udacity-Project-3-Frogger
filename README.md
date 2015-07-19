frontend-nanodegree-arcade-game
===============================
#How to access the game
There a few different ways to access my game:

1. Clone the game repository at https://github.com/jbuechs/Udacity-Project-3-Frogger.git and open index.html
2. Go to http://jbuechs.github.io/Udacity-Project-3-Frogger/

#How to play the game
Use the arrow keys to move the character around the game board while avoiding the killer ladybugs.

Careful! She doesn't know how to swim, so running into the water will lose a life.

Collect blue gems to increase your score and generally improve your self-confidence.

As time passes, the ladybugs become more abundant. Luckily, a higher score gives you more life.

#Reflecting on the process

##Trying to be "Udacious"
I created this Frogger-style arcade game for the Udacity Front End Web Developer Nanodegree. The rubrics for each project have an extra-cool level they call "Udacious," which I always try to achieve. I attemped to go beyond the minimum requirements of the project by adding:

- level up: On level 2, there is an additional row in the game board
- timer: The game has 120 seconds in it and it ends if the timer gets down to 0
- sounds: Moving the character, hitting an enemy, splashing into the water, and collecting gems and hearts all make sounds. It probably is annoying and not great game design, but I was more interested in the challenge of coding it.
- score: Collecting gems adds points to the score.
- hearts: For every 250 points, you have another heart added to the game board. You cannot have more than 5 hearts. When you reach 0 hearts, the game ends.
- restart button: Clicking on the button theoretically restarts the game, but this is unfortunately buggy.

#Challenges

##Adding Sounds
Adding sound to the game turned out to be more complicated than I expected. I did a lot of research on possible approaches and decided to use a javascript library, [Howler] (http://goldfirestudios.com/blog/104/howler.js-Modern-Web-Audio-Javascript-Library), which allowed me to include the sounds in the game.

##The Countdown Timer
I originally programmed the timer in the global scope, but a Udacity coach told me that it would be cleaner to make the timer an object. I refactored to make the timer an object and it stopped working. Using a few console.log()s, I could pinpoint where the time variable was undefined, but I did not understand why. It took a good deal of research, but I found that the [setInterval method](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval#The_this_problem) binds *this* to the global scope.  I was able to fix this with some snazzy code:
```
Timer.prototype.create_timer = function() {
    this.intervalVar = setInterval(this.timer_handler.bind(this), 1000);
}
```
I consider myself a beginner so I was pretty proud of myself for solving this problem.

##Restarting the game
I tried to introduce a restart button which would enable the player to also have a high score. This unfortunately is buggy and I have yet to figure out what is going on.

A few clues:
- Running out of lives sometimes ends the game and sometimes does not.
- When lives === 0, the game over sound plays, but the game sometimes continues to play.
- When you click restart, the bugs are all supposed to reset and start to the left of the screen. Sometimes, they start from the center (their previous position?)

I hope that someday I'll be able to return to this code and figure out how to fix it. Right now, I'm afraid I have to give up. I've stared at this for so long and the answer has yet to be illuminated.