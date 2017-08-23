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
		{'name':'bug', 'img':'images/enemy-bug.png', 'width':99, 'height':67, 'tileX':-1, 'tileY':getRandom, 'adj':20, 'bottomMargin': 77},
		{'name':'boy', 'img':'images/char-boy.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9, 'bottomMargin': 62},
		{'name':'cat-girl', 'img':'images/char-cat-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9, 'bottomMargin': 62},
		{'name':'horn-girl', 'img':'images/char-horn-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9, 'bottomMargin': 62},
		{'name':'pink-girl', 'img':'images/char-pink-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9, 'bottomMargin': 62},
		{'name':'princess-girl', 'img':'images/char-princess-girl.png', 'width':76, 'height':78, 'tileX':2, 'tileY':5, 'adj':9, 'bottomMargin': 62}
		];

// SuperClass for all moving objects (enemies and player)
var Pawn = function(sprite){
	this.sprite = sprite.img;
	this.name = sprite.name;
    this.imgWidth = sprite.width;
    this.imgHeight = sprite.height;

    // adjY is for vertical adjustment, per sprite
    this.adjY = sprite.adj;
    this.x = findPixelX(sprite.tileX);
    this.y = findPixelY(sprite.tileY, this.adjY);

    // Required to calculate image borders in checkCollision()
    this.bottomMargin = sprite.bottomMargin;
};
// Draw pawns on the screen. Required method for the game
Pawn.prototype.render = function() {
    var hMargin = ((tileWidth - this.imgWidth) / 2) + 1;

    // we have x,y and dimensions of this. Define them as a box
    // var borderLeft = this.x + hMargin,
    //     borderTop = this.y + this.bottomMargin;
    // drawBorder(borderLeft, borderTop, this.imgWidth, this.imgHeight, "red");

	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemy subclass
var Enemy = function(sprite) {
	Pawn.call(this, sprite);

    // 1 to 3 are the stone tiles of enemies
	this.y = findPixelY(sprite.tileY(1, 3), this.adjY);

	// Each bug has a different speed
	var speed = getRandom(1, 4);
    // var speed = 1;
	this.speed = speed * tileWidth;

	// Distance is how far an enemy goes (ie. how long to wait) before regenerating
    var distance = getRandom( findPixelX(numCols - 1), findPixelX(14) );
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
	var lowestRowAndCol = 0
        tileX = this.x / tileWidth,
        tileY = (this.y + this.adjY) / tileHeight;

    // remaining within board boundaries, player moves 1 tile
	if ( key === "right" && tileX < (numCols - 1) ) {
		this.x += tileWidth;
	} else if ( key === 'left' && tileX > lowestRowAndCol ){
		this.x -= tileWidth;
	} else if ( key === 'down' && tileY < (numRows - 1) ){
		this.y += tileHeight;
	} else if ( key === 'up' && tileY > lowestRowAndCol ){
		this.y -= tileHeight;
	} else if ( key === 'up' && tileY <= lowestRowAndCol ){
		// when water is reached, player auto-moves to bottom row (same col)
		this.y = findPixelY( (numRows - 1), this.adjY );
		score();
	}

};

// **********************************************************************************

// Instantiate enemy objects in an array called allEnemies
var allEnemies = [];
// which enemy
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

// which player character
var char = spriteList[4]
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
	var hMargin = (tileWidth - pawn.imgWidth) / 2;

    // we have x,y and dimensions of pawn. Define them as a box
    var borderLeft = pawn.x + hMargin,
        borderTop = pawn.y + pawn.bottomMargin,
        borderRight = borderLeft + pawn.imgWidth,
        borderBottom = borderTop + pawn.imgHeight;

    // clockwise from left
    return [borderLeft, borderTop, borderRight, borderBottom];
}

// This function should compare an enemy's box with the player's box.
// If there's overlap, it's a collision and Game Over
function checkCollision(player, bug) {
    // always clockwise from left
	var [playerLeft, playerTop, playerRight, playerBottom] = getBorders(player);
    var [enemyLeft, enemyTop, enemyRight, enemyBottom] = getBorders(bug);

    if (playerLeft < enemyRight &&
        playerRight > enemyLeft &&
        playerTop < enemyBottom &&
        playerBottom > enemyTop) {
        console.log("Collision! Game over!");
        bug.speed = 0;
        return gameReset();
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
