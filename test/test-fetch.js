"use strict";

var conti = (typeof conti !== "undefined") ? conti : require("../index");
var expect = (typeof expect !== "undefined") ? expect : require("chai").expect;

(function(){

if( !(typeof window !== "undefined" && window.fetch) ){
	return;
}
describe("Testing fetch", function(){
	it("test json", function(done){
		conti.fetchJson("./arr", {}, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).eql([1,2,3]);
			done();
		})
	});

	it("test text", function(done){
		conti.fetchText("./ok", {}, function(err, result){
			if( err ){
				done(err);
				return;
			}
			expect(result).equal("ok");
			done();
		})
	})
});

})();


