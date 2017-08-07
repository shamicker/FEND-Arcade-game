// board data
var numRows = 6,
    numCols = 5,
    rowHeight = 83,
    colWidth = 101;

// Where col is the desired column, this should calculate the actual pixel placement
function across(col) {
    return col * colWidth;
}

// Calculates the actual pixel placement per row
function down(row) {
    return row * rowHeight;
}

// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.width = 99;
    this.height = 67;

    // Initial setup column
    this.x = across(-1);
    // this.x = across(1);

    // Set bug in random stone-tile row
    // y adjustment is -20, to centre it
    var y = getRandom(1, 3);
    this.y = down(y) - 20;
    // this.y = down(y);

    // Set random speed
    var speed = getRandom(1, 4);
    // var speed = 0;
    this.speed = speed * colWidth;

    // Distance is how far an enemy goes (ie. how long to wait) before regenerating 
    var distance = getRandom( across(4), across(14) );
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

    // when end distance is reached, Enemy restarts
    if ( this.distance <= this.x ) {
        allEnemies.splice( allEnemies.indexOf(thisBug), 1 );
        allEnemies.push( new Enemy() );
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Calculate for borders
    this.left = this.x + 1;
    this.top = this.y + 77;

    drawBorder(this.left, this.top, this.width, this.height, "black");
};


// ****************************************************************************

// This class requires an update(), render() and
// a handleInput() method.
// Start at (5,2)
var Player = function(){
    this.sprite = 'images/char-pink-girl.png';
    this.x = across(2);
    // this.y = down(5) - 9;

    // y adjustment is -9, to centre it
    // this.y = down(5);
    this.y = 5 * rowHeight - 9;

    this.w = 76;
    this.h = 78;

    console.log("new Player");
};

Player.prototype.update = function(dt) {
    // blank since dependent not on automation, but on user input
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Calculate borders
    this.left = this.x + 13;
    this.top = this.y + 62;

    drawBorder(this.left, this.top, this.w, this.h, "purple");
};

Player.prototype.handleInput = function(key){
    var x = this.x / colWidth; // should be 0-5
    var y = (this.y + 9)/rowHeight; // should be 0-6
    var lastX = 4;
    var lastY = 5;
    var lowestX = 1;
    var lowestY = 0;

    // remaining on the board, player moves left, right, up, and down
    if ( key === "right" && x < lastX ) {
        this.x += colWidth;
    } else if ( key === 'left' && x > lowestX ) {
        this.x -= colWidth;
    } else if ( key === 'down' && y < lastY ) {
        this.y += rowHeight;
    } else if ( key === 'up' && y > lowestY ) {
        this.y -= rowHeight;
    } else if ( key === 'up' && y <= lowestY ) {
    // when water is reached, player auto-moves to bottom row (same col)
        this.y = 5 * rowHeight - 9;
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
initiateEnemies(10);

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

    // checkCollision here to test - on move, print out new location dimensions
    // to console.
    // playerPosition(player);

    // for (i in allEnemies){
    //     var bug = allEnemies[i];
    //     enemyPosition.call(bug);
    //     // checkCollision.call(bug);
    // }
});


// ****************************************************************************

// This function returns a whole number between 2 numbers, inclusively.
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// getRandom(0, 5);

// This function counts the number of times the water has been reached and displays it
function score() {
    scoreCount++;
    document.getElementById("count").innerHTML = scoreCount;
    // console.log("scoreCount: " + scoreCount);
    return scoreCount;
}

// This function should draw square border around each entity
function drawBorder(x, y, width, height, colour){
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = colour;
    ctx.stroke();
}

// This function should log the player's border box dimensions
function playerPosition(player){
    // we have x,y and dimensions of player and enemies. Define them as a box
    var playerLeft = player.x + 13,
        playerTop = player.y + 62,
        // this.w = 76;
        // this.h = 78;
        playerRight = playerLeft + 76,
        playerBottom = playerTop + 78;

    return [playerLeft, playerRight, playerTop, playerBottom];
}

// This function should log an enemy's border box dimensions
function enemyPosition(enemy){
    // we have x, y, and dimensions of enemies. Define them as a box
    var enemyLeft = enemy.x + 1,
        enemyTop = enemy.y + 77,
        enemyRight = enemyLeft + 99,
        enemyBottom = enemyTop + 67;

    return [enemyLeft, enemyRight, enemyTop, enemyBottom];
}

// This function should compare an enemy's box with the player's box. 
// If there's overlap, Collision! Game over! 
function checkCollision(player, enemy){
    var [playerLeft, playerRight, playerTop, playerBottom] = playerPosition(player);
    var [enemyLeft, enemyRight, enemyTop, enemyBottom] = enemyPosition(enemy);

    if (playerLeft < enemyRight &&
        playerRight > enemyLeft &&
        playerTop < enemyBottom &&
        playerBottom > enemyTop) {
        console.log("Collision! Game over!");
        enemy.speed = 0;
        return gameReset();
        // return true;
    } else {
        // console.log("Safe!");
        return false;
    }

}

//This function should reset the game.
function gameReset(){

    // Read best score
    var best = document.getElementById("best").innerHTML;

    if ( scoreCount > best ){
        document.getElementById("best").innerHTML = scoreCount;
    }

    allEnemies = [];
    player = new Player();
    scoreCount = 0;
    document.getElementById("count").innerHTML = scoreCount;
    initiateEnemies(10);


    return [allEnemies, player, scoreCount, initiateEnemies];
}

// ****************************************************************************















