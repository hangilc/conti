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

function iterExecForEach(i, arr, fn, done){
	if( i >= arr.length ){
		done();
		return;
	}
	fn(arr[i], function(err){
		if( err ){
			done(err);
			return;
		}
		iterExecForEach(i+1, arr, fn, done);
	})
}

exports.forEach = function(arr, fn, done){
	arr = arr.slice();
	iterExecForEach(0, arr, fn, done);
};

