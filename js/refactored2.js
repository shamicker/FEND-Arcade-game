// board data
var numRows = 6,
    numCols = 5,
    rowHeight = 83,
    colWidth = 101,
	across = function(x){
    	return x * colWidth;
	},
	down = function(y){
    	return y * rowHeight;
	};


// SuperClass for all moving objects (enemies and player)
var Pawns = function(){

}