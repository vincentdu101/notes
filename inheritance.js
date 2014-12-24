// OO languages support two types of inheritance
// interface - only method signatures are inherited
// implementation - actual methods are inherited
// Ecmascript supports only implementation inheritance

// Prototype Chaining
function SuperType(){
  this.property = true;
};

SuperType.prototype.getSuperValue = function(){
  return this.property;
};

function SubType(){
  this.subProperty = false;
};

SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function(){
  return this.subProperty;
};

var instance = new SubType();
alert(instance.getSuperValue());