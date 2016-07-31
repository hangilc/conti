"use strict";

var conti = require("../index");
var expect = require("chai").expect;

function Server(){
	this.store = {};
}

Server.prototype.request = function(req, cb){
	this.store[req] = cb;
};

Server.prototype.handle = function(req, ret){
	var err = ret[0];
	var result = ret[1];
	this.store[req](err, result);
}

describe("Testing mapPara", function(){
	it("empty", function(done){
		conti.mapPara([], function(value, cb){
			cb("unexpected funcall");
		}, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([]);
			done();
		});
	});

	it("three", function(done){
		var server = new Server();
		conti.mapPara([1,2,3], function(value, cb){
			server.request(value, function(err, result){
				if( err ){
					cb(err);
					return;
				}
				cb(undefined, result);
			})
		}, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([10,20,30]);
			done();
		});
		server.handle(2, [undefined, 20]);
		server.handle(3, [undefined, 30]);
		server.handle(1, [undefined, 10]);
	});

	it("three (error)", function(done){
		var server = new Server();
		conti.mapPara([1,2,3], function(value, cb){
			server.request(value, function(err, result){
				if( err ){
					cb(err);
					return;
				}
				cb(undefined, result);
			})
		}, function(err, result){
			expect(err).equal("error");
			done();
		});
		server.handle(2, [undefined, 20]);
		server.handle(3, ["error"]);
		server.handle(1, [undefined, 10]);
	});
});