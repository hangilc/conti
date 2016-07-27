"use strict";

var conti = require("../index");
var expect = require("chai").expect;

function Server(handler){
	this.handler = handler;
}

Server.prototype.request = function(arg, cb){
	var self = this;
	var ret = this.handler(arg);
	cb(ret[0], ret[1]);
};

describe("Testing exec", function(){
	it("empty", function(done){
		conti.exec([], function(err){
			expect(err).not
			done();
		})
	});

	it("single (success)", function(done){
		var server = new Server(function(arg){
			return [undefined, arg];
		});
		var out = [];
		conti.exec([
			function(done){
				server.request(1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					out.push(result);
					done();
				})
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			expect(out).eql([1]);
			done();
		});
	});

	it("single (error)", function(done){
		var server = new Server(function(arg){
			return ["error"];
		})
		var out = [];
		conti.exec([
			function(done){
				server.request(1, function(err, result){
					if( err ){
						done(err);
						return;
					}
					out.push(result);
					done();
				})
			}
		], function(err){
			expect(err).eql("error");
			expect(out).eql([]);
			done();
		});
	});

	it("three", function(done){
		var server = new Server(function(arg){
			return [undefined, arg];
		});
		var out = [];
		conti.exec([
			function(done){
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
			expect(out).eql([1,2,3]);
			done();
		});
	})

	it("three (error)", function(done){
		var server = new Server(function(arg){
			if( arg === 2 ){
				return ["error"];
			} else if( arg === 1 ){
				return [undefined, arg];
			} else {
				return ["third function called"];
			}
		})
		var out = [];
		conti.exec([
			function(done){
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
			expect(out).eql([1]);
			done();
		});
	})

});

describe("Testing forEach", function(){
	it("empty", function(done){
		var dummy;
		conti.forEach([], function(ele, done){
			dummy = 1;
			done();
		}, function(err){
			if( err ){
				done(err);
				return;
			}
			expect(dummy).undefined;
			done();
		})
	});

	it("single", function(done){
		var server = new Server(function(arg){
			return [undefined, arg+1];
		});
		var out = [];
		conti.forEach([1], function(ele, done){
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
			expect(out).eql([2]);
			done();
		})
	});

	it("single (error)", function(done){
		var server = new Server(function(arg){
			return ["error"];
		})
		var out = [];
		conti.forEach([1], function(ele, done){
			server.request(ele, function(err, result){
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
		})
	});

	it("three", function(done){
		var server = new Server(function(arg){
			return [undefined, arg+1];
		});
		var out = [];
		conti.forEach([1,2,3], function(ele, done){
			server.request(ele, function(err, result){
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
			expect(out).eql([2,3,4]);
			done();
		})
	});

	it("three (error)", function(done){
		var server = new Server(function(arg){
			if( arg === 1 ){
				return [undefined, arg+1];
			} else if( arg === 2 ){
				return ["error"];
			} else {
				return ["unexpected funcall"];
			}
		});
		var out = [];
		conti.forEach([1,2,3], function(ele, done){
			server.request(ele, function(err, result){
				if( err ){
					done(err);
					return;
				}
				out.push(result);
				done();
			})
		}, function(err){
			expect(err).eql("error");
			expect(out).eql([2]);
			done();
		})
	});

});
