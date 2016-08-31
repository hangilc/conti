"use strict";

var express = require("express");

var app = express();

app.get("/arr", function(req, res){
	res.json([1,2,3]);
});

app.get("/ok", function(req, res){
	res.send("ok");
});

app.use(express.static("."));

var port = 29123;
app.listen(port, function(){
	console.log("test server listening to port " + port);
	console.log("open http://localhost:" + port + "/test.html in browser");
})