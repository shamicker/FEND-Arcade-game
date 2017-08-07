// Some numbers:
// canvas.width = 505
// comprised of 5 columns of 101 width

// canvas.height = 606
// comprised of 6 rows of 83 height,
// meaning 18 (height) of each row is unusable!

// SO: each canvas box:
// boxWidth = 101
// boxHeight = 83

// Each game piece has its actual as well as its border dimensions. So:
// x, y (upper left corner of actual dimensions),
// left, right (left and right borders),
// width, height (upper and lower borders).


var sprites = [
    {sprite: 'images/enemy-bug.png', width: 99, height: 67},
    {sprite: 'images/char-pink-girl.png', width: 76, height: 78}
    ]

var enemySprite = sprites[0];
var playerSprite = sprites[1];


// Superclass of game pieces
var GamePiece = function() {
    // Variables that apply to all game pieces (enemies and Player)
    var obj = {
            sprite: spriteChoice.sprite,
            width: spriteChoice.width,
            height: spriteChoice.height
        };
    obj.render = function(colour) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
            this.left = this.x + 1;
            this.top = this.y + 77;
            drawBorder(this.left, this.top, this.width, this.height, "red");
        };
    return obj;
};

