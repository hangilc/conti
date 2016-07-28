"use strict";

var conti = require("./index");

console.log("start");

conti.enqueue(function(done){
	setTimeout(done, 1000);
}, function(err){
	if( err ){
		throw new Exception(err);
	}
	console.log("first done");
});
conti.enqueue(function(done){
	console.log("second start");
	setTimeout(done, 1000);
}, function(err){
	if( err ){
		throw new Exception(err);
	}
	console.log("called after 2 seconds");
})