// Factory Pattern
// very abstract and general approach to return an object
// does not identify the object in anyway
function createPerson(name, age, job){
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function(){
    alert(this.name);
  };

  return o;
}

var person = createPerson("Alex", "29", "Engineer");

// Constructor Pattern
// difference from factory: 
// creates specific type of object
// no object being created explicitly
// no return statement
// properties and methods assigned to this object
// 
// uses OO languages idea of constructor
// 
// steps that are occuring:
// 1. create a new object
// 2. assign this value of constructor to new object (this points to new object)
// 3. execute the code inside the constructor (adds properties to new object)
// 4. return the new object
// 
// disadvantages:
// methods of object are created once for each instance
// not equivalent even though methods are of the same name
function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function(){
    alert(this.name);
  }
}

var person = new Person("Alex", "29", "Engineer");

// Prototype Pattern
// properties and methods share the same object instance
// has internal pointer pointing to prototype's constructor
// solve issues of pure constructor pattern
// allows for inheritance based on setting the prototype's constructor to parent
// constructor
// by default constructor is pointed at object (original prototype for all objects)
// 
// problems of prototype:
// shared capability of prototype means all instances of the prototype pick up
// changes whether they want to or not
function Person(){
}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.sayName = function(){
  alert(this.name);
}

var person = new Person();
person.sayName();

// overrides prototype property by creating a shadow, but does not alter prototype version
person.name = "John"

// alternate prototype syntax
function Person(){
}

Person.prototype = {
  name: "Nicholas",
  age: 29,
  job: "Engineer",
  sayName: function(){
    alert(this.name);
  }
}

// same type, but point constructor at itself
function Person(){
}

Person.prototype = {
  constructor: Person, 
  name: "Nicholas",
  age: 29,
  sayName: function(){
    alert(this.name)
  }
}

// dynamic nature of prototypes
// changes to prototype picked up even though instances existed before change
// due to the fact method is a pointer not a copy
var friend = new Person();
Person.prototype.sayHi = function(){
  alert("Hi");
};
friend.sayHi();