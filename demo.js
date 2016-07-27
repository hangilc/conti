var conti = require("./index");

conti.exec([
  function(done){
    setTimeout(done, 1000);
  },
  function(done){
    setTimeout(done, 1000);
  }
], function(err){
  if( err ){
    throw new Exception(err);
  }
  console.log("done after 2 seconds");
});

conti.execPara([
  function(done){
    setTimeout(done, 1000);
  },
  function(done){
    setTimeout(done, 1000);
  }
], function(err){
  if( err ){
    throw new Exception(err);
  }
  console.log("done after 1 second");
});

conti.forEach([1,2,3], function(ele, done){
  setTimeout(done, ele*1000);
}, function(err){
  if( err ){
    throw new Exception(err);
  }
  console.log("done after 6 seconds");
});

conti.forEachPara([1,2,3], function(ele, done){
  setTimeout(done, ele*1000);
}, function(err){
  if( err ){
    throw new Exception(err);
  }
  console.log("done after 3 seconds");
});

