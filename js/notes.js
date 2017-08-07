// Property Lookup

var gold = {a:1};

console.log("GOLD:");
console.log("gold.a: " + gold.a);
// logs 1

console.log("gold.z: " + gold.z);
// logs undefined

// ***************************

// var blue = extend({}, gold);
// extend() is part of many libraries, such as jQuery. Doesn't exist in vanilla JS.
// copies all properties of gold - a one-time thing
// BUT since I didn't link jQuery:
var extend = function(target, object){
	for (var e in object) {
		target[e] = object[e];
	};
	return target;
};

// ***************************

var blue = extend({}, gold);

blue.b = 2;
console.log("BLUE:");
console.log("blue.a: " + blue.a);
console.log("blue.b: " + blue.b);
console.log("blue.z: " + blue.z);

// Proof that extend only copied gold the one time!
console.log("gold.a: " + gold.a);
console.log("gold.b: " + gold.b);
console.log("gold.z: " + gold.z);

// ****************************
// ****************************

// Copy gold to pink using an ONGOING technique (not just the once)
var pink = Object.create(gold);
pink.b = 3;
console.log('pink.a: ' + pink.a);

// Test the copies by changing gold:
gold.z = 13;
console.log("gold.z: " + gold.z);
console.log("blue.z: " + blue.z);
console.log("pink.z: " + pink.z);

// Don't forget that ALL OBJECTS have prototype functions
// such as Object.prototype.constructor, Object.prototype.toString




function chunkArrayInGroups(arr, size) {

  var newArr = [];

  while (arr.length > 0) {
    var subArr = [];

    while (size > 0) {
      var item = arr.shift();
      subArr.push(item);
      size -= 1;
    }
    newArr.push(subArr);
    console.log( newArr);
    return arr.length;
  }
  // return newArr;
}

chunkArrayInGroups(["a", "b", "c", "d"], 2);


// *********************************************************************
// Understanding 'this' in subClasses!

// Here, 'a' and 'x' are totally different and totally understandable
var product = function(a, b){
	return a*b;
};

var double = function(x){
	return product(x, 2);
};

console.log("1) double 2: " + double(2));

// *******************

// Here, 'a' and 'x' are changed for 'num', which is the same, but slightly
// less understandable
var product = function(num, b){
	return num * b;
};

var double = function(num){
	return product(num, 2);
};

console.log("2) double 3: " + double(3));

// *******************

// Here, 'this' replaces 'x', and essentially, we 'call' 'this' to be 3!
var product = function(num, b){
	return num * b;
};

var double = function(){
	return product(this, 2);
};

console.log("3a) double.call 4: " + double.call(4));

// *******************

// And finally, 'this' also replaces 'num', and we have to 'call' the 'this'
// in the double function. This leads us to the full monty in our example.
var product = function(b){
	return this * b;
};

var double = function(){
	return product.call(this, 2);
};

console.log("3a) double.call 5: " + double.call(5));

// **************************
// **************************
var brian = {loc:12};
console.log(brian.valueOf());

