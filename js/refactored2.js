// board data
var numRows = 6,
    numCols = 5,
    tileHeight = 83,
    tileWidth = 101,
	findPixelX = function(tileX){
    	return tileX * tileWidth;
	},
	findPixelY = function(tileY, adj){
    	return tileY * tileHeight - adj;
	};

var spriteList = [
		// Where tileX and tileY are the tile coordinates, adj is the y-axis adjustment to center the image
		{'name':'bug', 'img':'images/enemy-bug.png', 'width':99, 'height':67, 'tileX':1, 'tileY':getRandom, 'adj':20, 'bottomMargin': 77},
		{'name':'boy', 'img':'images/char-boy.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9, 'bottomMargin': 62},
		{'name':'cat-girl', 'img':'images/char-cat-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9, 'bottomMargin': 62},
		{'name':'horn-girl', 'img':'images/char-horn-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9, 'bottomMargin': 62},
		{'name':'pink-girl', 'img':'images/char-pink-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9, 'bottomMargin': 62},
		{'name':'princess-girl', 'img':'images/char-princess-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9, 'bottomMargin': 62}
		];


// SuperClass for all moving objects (enemies and player)
var Pawn = function(sprite){
	// console.log("sprite is: ", sprite);
	this.sprite = sprite.img;
	this.name = sprite.name;
	// console.log("sprite image is: ", sprite.img);
    this.imgWidth = sprite.width;
    this.imgHeight = sprite.height;
    // for human reading, tileX and tileY are the simple tile coordinates as the user sees them
    // this.tileX = sprite.tileX;
    // this.tileY = sprite.tileY;
    this.adjY = sprite.adj;
    // pixelX and pixelY are the calculations of the simple tile coords to pixel coords
    this.x = findPixelX(sprite.tileX);
    this.y = findPixelY(sprite.tileY, this.adjY);

    // Required to calculate image borders in checkCollision()
    this.bottomMargin = sprite.bottomMargin;
};
// Draw pawns on the screen. Required method for the game
Pawn.prototype.render = function() {
    var leftMargin = ((tileWidth - this.imgWidth) / 2) + 1;

    // we have x,y and dimensions of this. Define them as a box
    var borderLeft = this.x + leftMargin,
        borderTop = this.y + this.bottomMargin;
    drawBorder(borderLeft, borderTop, this.imgWidth, this.imgHeight, "red");

    // console.log("pixelX and Y: ", this.pixelX, this.pixelY);
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Enemy subclass
var Enemy = function(sprite) {
	Pawn.call(this, sprite);
	this.y = findPixelY(sprite.tileY(1, 3), this.adjY);

	// Each bug has a different speed
	// var speed = getRandom(1, 4);
	var speed = 0;
	this.speed = speed * tileWidth;

	// Distance is how far an enemy goes (ie. how long to wait) before regenerating
    var distance = getRandom( findPixelX(4), findPixelX(14) );
    this.distance = distance;


};
// create a prototype chain to superclass
Enemy.prototype = Object.create(Pawn.prototype);
// point constructor to subclass rather than superclass
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
	// dt is the delta from engine.js for smooth animation
	this.x += this.speed * dt;
	var thisBug = this;

	// when end distance is reached, Enemy restarts
	if (this.distance <= this.x ) {
		allEnemies.splice( allEnemies.indexOf(thisBug), 1 );
		allEnemies.push( new Enemy(enemy) );
	}
};


// Player subclass
var Player = function(sprite){
	Pawn.call(this, sprite);
};

Player.prototype = Object.create(Pawn.prototype);
Player.prototype.constructor = Player;

Player.prototype.handleInput = function(key){
	var firstX = 0;
	var firstY = 0;
    console.log("\ntile dimensions before: ", tileWidth, tileHeight);
    console.log("Before: tile w/h, pixels: ", tileWidth, tileHeight, player.x, player.y);

	// remaining on the board, player moves left, right, up, down
	if ( key === "right" && this.x < (numCols - 1) ) {
		this.pixelX += tileWidth;
		// this.tileX += 1;
        console.log("After: tiles, pixels: ", player.x, player.y, player.pixelX, player.pixelY);

	} else if ( key === 'left' && this.tileX > firstX ){
		this.x -= tileWidth;
		// this.tileX -= 1;
        console.log("After: tiles, pixels: ", player.x, player.y, player.x, player.y);

	} else if ( key === 'down' && this.tileY < (numRows - 1) ){
		// this.y += tileHeight;
		this.tileY += 1;
        console.log("After: tiles, pixels: ", player.x, player.y, player.x, player.y);

	} else if ( key === 'up' && this.tileY > firstY ){
		this.y -= tileHeight;
		this.tileY -= 1;
        console.log("After: tiles, pixels: ", player.x, player.y, player.x, player.y);

	} else if ( key === 'up' && this.tileY <= firstY ){
		// when water is reached, player auto-moves to bottom row (same col)
		// this.tileY = (numRows - 1);
		this.y = findPixelY( this.tileY, this.adjY );
        console.log("After: tiles, pixels: ", player.x, player.y, player.x, player.y);
y
		score();
	}

    console.log("tile dimensions after: ", tileWidth, tileHeight);
    // console.log("Player's box: ", playerLeft, playerRight, playerTop, playerBottom);
};

// **********************************************************************************

// Instantiate enemy objects in an array called allEnemies
var allEnemies = [];
// which enemy
var enemy = spriteList[0];
// which player character
var char = spriteList[4]

function initiateEnemies(howMany) {
	while( howMany > 0 ){
		allEnemies.push( new Enemy(enemy) );
		howMany -= 1;
	}
	// console.log(numEnemies, "enemies initiated!");
	return allEnemies;
}

// There should be always 10 enemies, but because of 'distance', they
// may not all be on the board
var numEnemies = 1;
initiateEnemies(numEnemies);


// Instantiate player in a variable called player
var player = new Player(char);

// Scorekeeper
var scoreCount = 0;

// *********************************************************************************

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
    // console.log("pressed: ", allowedKeys[e.keyCode]);
});


// This function return a whole number between 2 numbers, inclusively
function getRandom(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	var result = Math.floor(Math.random() * (max - min + 1)) + min;
	return result;
}

// This function counts the number of times the water has been reached and displays it
function score() {
    scoreCount++;
    document.getElementById("count").innerHTML = scoreCount;
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

// ************************************************************************************

// This function should log the pawn's border box dimensions
// FYI, bottomMargin cannot be calculated since the image varies vertically within its... image
function getBorders(pawn){
	var leftMargin = (tileWidth - pawn.imgWidth) / 2;

    // we have x,y and dimensions of pawn. Define them as a box
    var borderLeft = pawn.x + leftMargin,
        borderTop = pawn.y + pawn.bottomMargin;

    return [borderLeft, borderTop, pawn.imgWidth, pawn.imgHeight];
}

// This function should compare an enemy's box with the player's box.
// If there's overlap, it's a collision and Game Over
function checkCollision(player, bug) {
	var [playerLeft, playerRight, playerTop, playerBottom] = getBorders(player);
    var [enemyLeft, enemyRight, enemyTop, enemyBottom] = getBorders(bug);

    // console.log("Enemy's box: ", enemyLeft, enemyRight, enemyTop, enemyBottom);
    if (playerLeft < enemyRight &&
        playerRight > enemyLeft &&
        playerTop < enemyBottom &&
        playerBottom > enemyTop) {
        console.log("Collision! Game over!");
        bug.speed = 0;
        return gameReset();
    } else {
        // console.log("Safe!");
        return;
    }
}

// ************************************************************************************

// This function resets the game (rather suddenly!)
function gameReset(){

    // Read best score and log in HTML
    var best = document.getElementById("best").innerHTML;
    if ( best === "" ) {
    	best = 0;
    }
    // console.log("best is: ", best);
    // console.log("scoreCount is: ", scoreCount);
    if ( scoreCount > best ){
        document.getElementById("best").innerHTML = scoreCount;
    }

    // reset the instantiations and the current score
    allEnemies = [];
    player = new Player(char);
    scoreCount = 0;
    document.getElementById("count").innerHTML = scoreCount;
    initiateEnemies(numEnemies);


    return [allEnemies, player, scoreCount, initiateEnemies];
}
// gameReset();
