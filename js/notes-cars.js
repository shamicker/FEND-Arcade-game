// car 1
// var amy = {loc:1};
// amy.loc++;

// second car
// var ben = {loc:9};
// ben.loc++;

// let's condense these 2 previous:

// ******************************************************
// THIS SECTION IS FOR 'LIBRARY' OF FUNCTIONS

// This is a DECORATOR function. It decorates (describes) an  object
var carlike = function(obj, loc){
	obj.loc = loc;
	return obj;
};

var move = function(car){
	car.loc++;
};

// *******************************
// Next, rearrange to create put move inside carlike function
// and
// since each carlike creation is only passing in an empty object,
// we'll just create that in here. Therefore carlike becomes
// a class!
// This is a FUNCTIONAL CLASS:
// which are only objects with functions as properties

var Car = function(loc){
	obj = {loc:loc};
	obj.move = function(){
		obj.loc++;
	};
	return obj;
};

// and amy and ben are called like this now:
var amy = Car(1);
amy.move();

// However, now every invocation of move creates a new instance of
// the function. Can become memory-consuming.

// You could put functions outside the class, but then you have to
// refer to them in both the function creation AND in the class.
// Gets messy!

// *******************************
// Now we have FUNCTIONAL SHARED code
var Car = function(loc){
	var obj = {loc: loc};
	extend(obj, Car.methods);
	return obj;
};
Car.methods = {
	move: function(){
		this.loc++;
	},
	on: function(){/*...*/},
	off: function(){/*...*/}
};

// Instead of copying (or extending, which isn't JS native),
// let's delegate the methods to the .prototype
// *******************************

// DELEGATION RELATIONSHIPS
var Car = function(loc){
	// think of the next line as 'class object that we are creating
	// from'
	var obj = Object.create(Car.methods);
	obj.loc = loc;
	return obj;
};
Car.methods = {
	move: function(){
		this.loc++;
	}
};

// This is all and good. BUT
// because this Car.methods object is so common in JS, it's already
// set up for us! Except, instead of naming it 'methods' like we
// did, JS creators use 'prototype' (which has no end of confusion,
// but it's only a naming convention!).

// ************************************
// So new way of writing this is:
// PROTOTYPAL CLASSES
var Car = function(loc){
	var obj = Object.create(Car.prototype);
	obj.loc = loc;
	return obj;
};
Car.prototype.move = function(){
	this.loc++;
};
// .prototype has NO special rules! Think of it still as .methods
// .prototype vs .method is ALL COSMETIC!!!

// er, except that .prototype has a .constructor to see which
// constructor created any instance.

// **************************************************************

// Car constructs amy.
//
// - Car's prototype is Car.prototype. Here, prototype is as in
//   delegatiing declaration, not as in template. (Failed lookups
//   fall through to some function-prototype but NOT Car.prototype.)
// - amy's prototype is also Car.prototype, but this is prototype
//   as in template. (Failed lookups fall through to Car.prototype!)
// It is confusing...
// MAYBE (as per me), think of Car as a function; it isn't an
//   instance yet/ it doesn't exist yet. Car is just declaring that
//   when created, its instances should delegate/ be a prototype of
//   Car.prototype. So when amy is instantiated, its prototype/ template
//   actually IS Car.prototype.
// Maybe?

// *****************************************************************
// *****************************************************************
// *****************************************************************

// PSEUDOCLASSICAL CLASSES
// To mimic the way other coding languages use classes.

// Remove parts that will happen in every single class:
// - when instantiating, function is run in "constructor mode"
var Car = function(loc){
	// next line happens behind the scenes, with 'new' keyword
	//this = Object.create(Car.prototype);
	this.loc = loc;
	// next line happens behind the scenes, with 'new' keyword
	// return this;
};
Car.prototype.move = function(){
	this.loc++;
};
// instantiated like:
// var amy = new Car(1);
// var ben = new Car(9);











