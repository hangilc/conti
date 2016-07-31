# conti

A primitive JavaScript asynchronous function manager.

## Install

```
npm install conti
```

## Examples

```javascript
var conti = require("conti");
```

### sequential execution
```javascript
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
```

### parallel execution
```javascript
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
```

### sequential forEach
```javascript
conti.forEach([1,2,3], function(ele, done){
  setTimeout(done, ele*1000);
}, function(err){
  if( err ){
    throw new Exception(err);
  }
  console.log("done after 6 seconds");
});
```

### parallel forEach
```javascript
conti.forEachPara([1,2,3], function(ele, done){
  setTimeout(done, ele*1000);
}, function(err){
  if( err ){
    throw new Exception(err);
  }
  console.log("done after 3 seconds");
});
```

### dynamically add to a list of asynchronous calls that are invoked sequentially

I found this function to be useful while coding for single page applications.

```javascript
conti.enqueue(function(done){
  console.log("first start");
  setTimeout(done, 1000);
}, function(err){ console.log("first end"); });
conti.enqueue(function(done){
  console.log("second start");
  setTimeout(done, 1000);
}, function(err){ console.log("second end"); });

// first start
// first end (after 1 second)
// second start
// second end (after another 1 second)
```

## License
This software is released under the MIT License, see [LICENSE.txt](LICENSE.txt).
