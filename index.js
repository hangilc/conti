"use strict";

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
	fn(function(err){
		cb(err);
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

