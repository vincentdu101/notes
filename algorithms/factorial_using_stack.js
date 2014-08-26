function factorial(n){

  var s = [];
  
  while(n > 1){
    s.push(n--);
  }

  var product = 1;
  while(s.length > 0){
    product *= s.pop();
  }

  return product;
}

console.log("factorial: ", factorial(5));
