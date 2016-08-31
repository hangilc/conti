"use strict";

var conti = (typeof conti !== "undefined") ? conti : require("../index");
var expect = (typeof expect !== "undefined") ? expect : require("chai").expect;

(function(){

function Server(){
	this.store = {};
}

Server.prototype.request = function(query, cb){
	this.store[query] = cb;
};

Server.prototype.handle = function(query, ret){
	this.store[query](ret[0], ret[1]);
}

describe("Testing execPara", function(){
	it("empty", function(done){
		conti.execPara([], function(err){
			expect(err).not;
			done();
		})
	});

	it("single", function(done){
		var server = new Server();
		var out;
		conti.execPara([
			function(done){
				server.request(1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					out = result;
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			expect(out).eql(2);
			done();
		})
		server.handle(1, [undefined, 2]);
	});

	it("single (error)", function(done){
		var server = new Server();
		var out;
		conti.execPara([
			function(done){
				server.request(1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					out = result;
					done();
				})
			}
		], function(err){
			expect(err).eql("error");
			expect(out).undefined;
			done();
		})
		server.handle(1, ["error"]);
	});

	it("three", function(done){
		var server = new Server();
		var inseq = [];
		var out = [];
		conti.execPara([
			function(done){
				inseq.push(1);
				server.request(1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					out.push(result);
					done();
				})
			},
			function(done){
				inseq.push(2);
				server.request(2, function(err, result){
					if( err ){
						done(err);
						return;
					}
					out.push(result);
					done();
				})
			},
			function(done){
				inseq.push(3);
				server.request(3, function(err, result){
					if( err ){
						done(err);
						return;
					}
					out.push(result);
					done();
				})
			},
		], function(err){
			if( err ){
				done(err);
				return;
			}
			expect(inseq).eql([1,2,3]);
			expect(out).eql([3,2,1]);
			done();
		});
		server.handle(3, [undefined, 3]);
		server.handle(2, [undefined, 2]);
		server.handle(1, [undefined, 1]);
	})

	it("three (error)", function(done){
		var server = new Server();
		var inseq = [];
		var out = [];
		var dummy;
		conti.execPara([
			function(done){
				inseq.push(1);
				server.request(1, function(err, result){
					dummy = 1;
					if( err ){
						done(err);
						return;
					}
					out.push(result);
					done();
				})
			},
			function(done){
				inseq.push(2);
				server.request(2, function(err, result){
					if( err ){
						done(err);
						return;
					}
					out.push(result);
					done();
				})
			},
			function(done){
				inseq.push(3);
				server.request(3, function(err, result){
					if( err ){
						done(err);
						return;
					}
					out.push(result);
					done();
				})
			},
		], function(err){
			expect(err).eql("error");
			expect(inseq).eql([1,2,3]);
			expect(out).eql([3]);
			expect(dummy).undefined;
			done();
		});
		server.handle(3, [undefined, 3]);
		server.handle(2, ["error"]);
		server.handle(1, [undefined, 1]);
	})

});

describe("Testing forEachPara", function(){
	it("empty", function(done){
		conti.forEachPara([], function(ele, done){
			done("unexpected funcall");
		}, function(err){
			expect(err).undefined;
			done();;
		})
	});

	it("single", function(done){
		var server = new Server();
		var out = [];
		conti.forEachPara([1], function(ele, done){
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
			expect(out).eql([1]);
			done();
		});
		server.handle(1, [undefined, 1]);
	});
	
	it("single (error)", function(done){
		var server = new Server();
		var out = [];
		conti.forEachPara([1], function(ele, done){
			server.request(1, function(err, result){
				if( err ){
					done(err);
					return;
				}
				out.push(result);
				done();
			})
		}, function(err){
			expect(err).eql("error");
			expect(out).eql([]);
			done();
		});
		server.handle(1, ["error"])
	});

	it("three", function(done){
		var server = new Server();
		var inseq = [];
		var out = [];
		conti.forEachPara([1,2,3], function(ele, done){
			inseq.push(ele);
			server.request(ele, function(err, result){
				if( err ){
					done(err);
					return;
				}
				out.push(result);
				done();
			});
		}, function(err){
			if( err ){
				done(err);
				return;
			}
			expect(inseq).eql([1,2,3]);
			expect(out).eql([30, 20, 10]);
			done();
		});
		server.handle(3, [undefined, 30]);
		server.handle(2, [undefined, 20]);
		server.handle(1, [undefined, 10]);
	});

	it("three (error)", function(done){
		var server = new Server();
		var inseq = [];
		var out = [];
		conti.forEachPara([1,2,3], function(ele, done){
			inseq.push(ele);
			server.request(ele, function(err, result){
				if( err ){
					done(err);
					return;
				}
				out.push(result);
				done();
			});
		}, function(err){
			expect(err).eql("error");
			expect(inseq).eql([1,2,3]);
			expect(out).eql([30]);
			done();
		});
		server.handle(3, [undefined, 30]);
		server.handle(2, ["error", 20]);
		server.handle(1, [undefined, 10]);
	});

});

})();
