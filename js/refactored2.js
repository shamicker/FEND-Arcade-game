// board data
var numRows = 6,
    numCols = 5,
    tileHeight = 83,
    tileWidth = 101,
	across = function(tileX){
    	return tileX * tileWidth;
	},
	down = function(tileY, adj){
    	return tileY * tileHeight - adj;
	};

var spriteList = [
		// Where tileX and tileY are the tile coordinates, adj is the y-axis adjustment to center the image
		{'name':'bug', 'img':'images/enemy-bug.png', 'width':99, 'height':67, 'tileX':-1, 'tileY':getRandom, 'adj':20},
		{'name':'boy', 'img':'images/char-boy.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9},
		{'name':'cat-girl', 'img':'images/char-cat-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9},
		{'name':'horn-girl', 'img':'images/char-horn-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9},
		{'name':'pink-girl', 'img':'images/char-pink-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9},
		{'name':'princess-girl', 'img':'images/char-princess-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9}
		];


// SuperClass for all moving objects (enemies and player)
var Pawn = function(sprite){
	// console.log("sprite is: ", sprite);
	this.sprite = sprite.img;
	// console.log("sprite image is: ", sprite.img);
    this.imgWidth = sprite.width;
    this.imgHeight = sprite.height;
    // for human reading, tileX and tileY are the simple tile coordinates as the user sees them
    this.tileX = sprite.tileX;
    this.tileY = sprite.tileY;
    this.adjY = sprite.adj;
    // pixelX and pixelY are the calculations of the simple tile coords to pixel coords
    this.pixelX = across(sprite.tileX);
    this.pixelY = down(sprite.tileY, sprite.adj);

}
// Draw pawns on the screen. Required method for the game
Pawn.prototype.render = function() {
	// console.log("this.sprite is: ", Resources.get(this.sprite));
	// console.log("this.pixelX is: ", Resources.get(this.pixelX));
	// console.log("this.pixelY is: ", Resources.get(this.pixelY));
	ctx.drawImage(Resources.get(this.sprite), this.pixelX, this.pixelY);
};


// Enemy subclass
var Enemy = function(sprite) {
	Pawn.call(this, sprite);
	this.pixelY = down(sprite.tileY(1, 3), sprite.adj);

	// Each bug has a different speed
	var speed = getRandom(1, 4);
	this.speed = speed * tileWidth;

	// Distance is how far an enemy goes (ie. how long to wait) before regenerating 
    var distance = getRandom( across(4), across(14) );
    this.distance = distance;
};
// create a prototype chain to superclass
Enemy.prototype = Object.create(Pawn.prototype);
// point constructor to subclass rather than superclass
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
	// dt is the delta from engine.js for smooth animation
	this.pixelX += this.speed * dt;
	var thisBug = this;

	// when end distance is reached, Enemy restarts
	if (this.distance <= this.pixelX ) {
		allEnemies.splice( allEnemies.indexOf(thisBug), 1 );
		allEnemies.push( new Enemy(enemy) );
	}
};


// Player subclass
var Player = function(sprite){
	Pawn.call(this, sprite);

	console.log("New ", sprite.name);
};

Player.prototype = Object.create(Pawn.prototype);
Player.prototype.constructor = Player;

Player.prototype.handleInput = function(key){
	var firstX = 0;
	var firstY = 0;
	
	// remaining on the board, player moves left, right, up, down
	if ( key === "right" && this.tileX < (numCols - 1) ) {
		this.pixelX += tileWidth;
		this.tileX += 1;
	} else if ( key === 'left' && this.tileX > firstX ){
		this.pixelX -= tileWidth;
		this.tileX -= 1;
	} else if ( key === 'down' && this.tileY < (numRows - 1) ){
		this.pixelY += tileHeight;
		this.tileY += 1;
	} else if ( key === 'up' && this.tileY > firstY ){
		this.pixelY -= tileHeight;
		this.tileY -= 1;
	} else if ( key === 'up' && this.tileY <= firstY ){
		// when water is reached, player auto-moves to bottom row (same col)
		this.tileY = (numRows - 1);
		this.pixelY = down( this.tileY, this.adjY );
		score();
	}
};

// **********************************************************************************

// Instantiate enemy objects in an array called allEnemies
var allEnemies = [];
var enemy = spriteList[0];

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
var numEnemies = 10;
initiateEnemies(numEnemies);


// Instantiate player in a variable called player
var player = new Player(spriteList[1]);

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

// ************************************************************************************

// This function should log the pawn's border box dimensions
// FYI, bottomMargin cannot be calculated since the image varies vertically within its... image
function getBorders(pawn, bottomMargin){
	var leftMargin = (tileWidth = pawn.imgWidth) / 2;

    // we have x,y and dimensions of pawn. Define them as a box
    var borderLeft = pawn.x + leftMargin,
        borderTop = pawn.y + bottomMargin,
        borderRight = borderLeft + pawn.imgWidth,
        borderBottom = borderTop + pawn.imgHeight;

    return [borderLeft, borderRight, borderTop, borderBottom];
}

// This function should compare an enemy's box with the player's box. 
// If there's overlap, it's a collision and Game Over
function checkCollision(player, bug) {
	var [playerLeft, playerRight, playerTop, playerBottom] = getBorders(player);
    var [enemyLeft, enemyRight, enemyTop, enemyBottom] = getBorders(bug);

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
    if ( scoreCount > best ){
        document.getElementById("best").innerHTML = scoreCount;
    }

    // reset the instantiations and the current score
    allEnemies = [];
    player = new Player(spriteList[1]);
    scoreCount = 0;
    document.getElementById("count").innerHTML = scoreCount;
    initiateEnemies(numEnemies);


    return [allEnemies, player, scoreCount, initiateEnemies];
}
