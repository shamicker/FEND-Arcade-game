// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    var y = getRandom(1, 3);
    var speed = getRandom(100, 400);
    var distance = getRandom( (5 * 101), (15 * 101) );

    this.x = -101;
    this.y = y * 83 - 20;
    this.speed = speed;

    // how soon it will 'regenerate' - it runs to x-coordinate offscreen
    this.distance = distance;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    var thisBug = this;

    // when end distance is reached (as per Enemy()), Enemy restarts
    if ( this.distance <= this.x ) {
        allEnemies.splice( allEnemies.indexOf(thisBug), 1 );
        allEnemies.push( new Enemy() );
    }
    checkCollision();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // console.log("Enemy.render!");
};


// ****************************************************************************

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.sprite = 'images/char-pink-girl.png';
    this.x = 2 * 101;
    this.y = 5 * 83 - 9;
};
Player.prototype.update = function(dt) {
    // blank since dependent not on automation, but on user input
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // console.log("Player rendered!");
};
Player.prototype.handleInput = function(key){
    var x = this.x / 100; // should be 0-5
    var y = (this.y + 9)/83; // should be 0-6
    var upperX = 4;
    var upperY = 5;
    var lowest = 0;

    // remaining on the board, player moves left, right, up, and down
    if ( key === "right" && x < upperX ) {
        this.x += 100;
    } else if ( key === 'left' && x > lowest ) {
        this.x -= 100;
    } else if ( key === 'down' && y < upperY ) {
        this.y += 83;
    } else if ( key === 'up' && y > lowest ) {
        this.y -= 83;
    } else if ( key === 'up' && y <= lowest ) {
    // when water is reached, player auto-moves to bottom row (same col)
        this.y = 5 * 83 - 9;
        score();
    }

};





// ****************************************************************************

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// There should be always 10 enemies, but because of 'distance', they
// may not all be on the board
var allEnemies = [];
function initiateEnemies(howMany) {
    while ( howMany > 0 ) {
        allEnemies.push( new Enemy() );
        howMany -= 1;
    }
    console.log(allEnemies.length + " enemies initiated!");
    return allEnemies;
}
initiateEnemies(8);


// Place the player object in a variable called player
var player = new Player();

// Scorekeeper
var scoreCount = 0;

// ****************************************************************************

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


// ****************************************************************************

// This function returns a whole number between 2 numbers, inclusively.
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// getRandom(0, 5);

// This function counts the number of times the water has been reached
function score() {
    scoreCount++;
    document.getElementsByTagName("h4")[0].innerHTML = scoreCount;
    return scoreCount;
}

// This function should check which square Enemy and Player are on; if
// they are the same, end of game! (or 2 more tries?)
function checkCollision(){
    // get x,y for player
    // console.log("Player: " + player.x, player.y);
    // get x,y per enemy
    // console.log("Enemy0: " + allEnemies[0].x, allEnemies[0].y);
    // compare x,y of player against that of enemies
    allEnemies.forEach(function(enemy){
        if ( enemy.y === player.y || enemy.x === player.y ) {
            console.log("Collision!!!");
        }
    })
    // if overlap, reset
}



// ****************************************************************************















