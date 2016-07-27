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
conti.forEach([1,2,3], function(ele, done){
  setTimeout(done, ele*1000);
}, function(err){
  if( err ){
    throw new Exception(err);
  }
  console.log("done after 3 seconds");
});
```

## License
This software is released under the MIT License, see [LICENSE.txt](LICENSE.txt).
