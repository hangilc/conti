"use strict";

(function(exports){

function iterExec(i, funs, done){
	if( i >= funs.length ){
		done();
		return;
	}
	var f = funs[i];
	f(function(err){
		if( err ){
			done(err);
			return;
		}
		iterExec(i+1, funs, done);
	})
}

exports.exec = function(funs, done){
	funs = funs.slice();
	iterExec(0, funs, done);
};

exports.execPara = function(funs, done){
	if( funs.length === 0 ){
		done();
		return;
	}
	funs = funs.slice();
	var n = funs.length;
	var no_more = false;
	funs.forEach(function(f){
		if( no_more ){
			return;
		}
		f(function(err){
			if( no_more ){
				return;
			}
			if( err ){
				no_more = true;
				done(err);
				return;
			}
			n -= 1;
			if( n === 0 ){
				done();
			}
		})
	})
}

function iterForEach(i, arr, fn, done){
	if( i >= arr.length ){
		done();
		return;
	}
	fn(arr[i], function(err){
		if( err ){
			done(err);
			return;
		}
		iterForEach(i+1, arr, fn, done);
	})
}

exports.forEach = function(arr, fn, done){
	arr = arr.slice();
	iterForEach(0, arr, fn, done);
};

exports.forEachPara = function(arr, fn, done){
	if( arr.length === 0 ){
		done();
		return;
	}
	arr = arr.slice();
	var n = arr.length;
	var no_more = false;
	arr.forEach(function(ele){
		if( no_more ){
			return;
		}
		fn(ele, function(err){
			if( no_more ){
				return;
			}
			if( err ){
				no_more = true;
				done(err);
				return;
			}
			n -= 1;
			if( n === 0 ){
				done();
			}
		})
	});
};

function Queue(){
	this.queue = [];
}

Queue.prototype.push = function(fn, cb){
	this.queue.push({
		fn: fn,
		cb: cb
	});
	if( this.queue.length === 1 ){
		this.run();
	}
}

Queue.prototype.run = function(){
	if( this.queue.length === 0 ){
		return;
	}
	var entry = this.queue[0];
	var fn = entry.fn;
	var cb = entry.cb;
	var self = this;
	fn(function(){
		var args = [].slice.call(arguments);
		cb.apply(undefined, args);
		if( self.queue.length > 0 && self.queue[0] === entry ){
			self.queue.shift();
			self.run();
		}
	})
}

var theQueue = new Queue();

exports.enqueue = function(fn, cb){
	theQueue.push(fn, cb);
};

exports.mapPara = function(arr, fn, cb){
	var index = 0;
	var dataArr = arr.map(function(value){
		return {
			index: index++,
			value: value
		}
	});
	var retArr = [];
	exports.forEachPara(dataArr, function(data, done){
		var value = fn(data.value, function(err, result){
			if( err ){
				done(err);
				return;
			}
			retArr[data.index] = result;
			done();
		});
	}, function(err){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, retArr);
	})
};

exports.fetch = function(url, opt, op, cb){
	fetch(url, opt)
	.then(function(response){
		if( response.ok ){
			response[op]()
			.then(function(result){
				cb(undefined, result);
			})
			.catch(function(err){
				cb(err.message);
			})
		} else { 
			response.text()
			.then(function(text){
				cb(text);
			})
			.catch(function(err){
				cb(err.message);
			})
		}
	})
	.catch(function(err){
		cb(err.message);
	})
}

exports.fetchJson = function (url, opt, cb){
	exports.fetch(url, opt, "json", function(err, result){
		console.log("json cb");
		setImmediate(function(){
			cb(err, result);
		});
	});
}

exports.fetchText = function (url, opt, cb){
	exports.fetch(url, opt, "text", function(err, result){
		setImmediate(function(){
			cb(err, result);
		});
	});
}

})(typeof exports !== "undefined" ? exports : (window.conti = {}));
