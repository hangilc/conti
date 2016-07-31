"use strict";

var conti = require("../index");
var expect = require("chai").expect;

function Server(handler){
	this.handler = handler;
	this.tasks = [];
}

Server.prototype.request = function(query, cb){
	this.tasks.push({query: query, cb: cb});
};

Server.prototype.handle = function(n){
	while( n-- > 0 ){
		if( this.tasks.length <= 0 ){
			throw new Error("stack underflow");
		}
		var task = this.tasks.shift();
		var handler = this.handler;
		var ret = handler(task.query);
		var cb = task.cb;
		cb.apply(undefined, ret);
	}
};

Server.prototype.remain = function(){
	return this.tasks.length;
}

describe("Testing queue", function(){
	it("single", function(done){
		var server = new Server(function(query){
			return [undefined, query];
		});
		var out;
		conti.enqueue(function(done){
			server.request(1, function(err, result){
				if( err ){
					done(err);
					return;
				}
				out = result;
				done();
			})
		}, function(err){
			if( err ){
				done(err);
				return;
			}
			expect(out).equal(1);
			expect(server.remain()).equal(0);
			done();
		});
		server.handle(1);
	});

	it("three", function(done){
		var server = new Server(function(req){
			return [undefined, req*10];
		});
		var out = [];
		conti.enqueue(function(done){
			out.push(1);
			server.request(1, function(err, result){
				if( err ){
					done(err);
					return;
				}
				out.push(result);
				done();
			})
		}, function(err){
			if( err ){
				done(err);
				return;
			}
		});
		conti.enqueue(function(done){
			out.push(2);
			server.request(2, function(err, result){
				if( err ){
					done(err);
					return;
				}
				out.push(result);
				done();
			})
		}, function(err){
			if( err ){
				done(err);
				return;
			}
		});
		conti.enqueue(function(done){
			out.push(3);
			server.request(3, function(err, result){
				if( err ){
					done(err);
					return;
				}
				out.push(result);
				done();
			})
		}, function(err){
			if( err ){
				done(err);
				return;
			}
			expect(out).eql([1,10,2,20,3,30]);
			expect(server.remain()).equal(0);
			done();
		});
		server.handle(3);
	});

	it("three (error)", function(done){
		var server = new Server(function(req){
			switch(req){
				case 2: return ["error"];
				default: return [undefined, req*10];
			}
		});
		var out = [];
		conti.enqueue(function(done){
			out.push(1);
			server.request(1, function(err, result){
				if( err ){
					done(err);
					return;
				}
				out.push(result);
				done();
			})
		}, function(err){
			if( err ){
				done(err);
				return;
			}
		});
		conti.enqueue(function(done){
			out.push(2);
			server.request(2, function(err, result){
				if( err ){
					done(err);
					return;
				}
				out.push(result);
				done();
			})
		}, function(err){
			expect(err).equal("error");
		});
		conti.enqueue(function(done){
			out.push(3);
			server.request(3, function(err, result){
				if( err ){
					done(err);
					return;
				}
				out.push(result);
				done();
			})
		}, function(err){
			if( err ){
				done(err);
				return;
			}
			expect(out).eql([1,10,2,3,30]);
			expect(server.remain()).equal(0);
			done();
		});
		server.handle(3);
	});

});