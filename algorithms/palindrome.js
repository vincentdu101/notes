function palindrome(word) {

  var s = [];

  for(var i = 0; i < word.length; ++i){
    s.push(word[i]);
  }

  var reverse_word = "";

  while(s.length > 0){
    reverse_word += s.pop();
  }

  if (word == reverse_word){
    return true;
  } else {
    return false;
  }

}


console.log("Palindrome?");
var word = "hello";
console.log("hello: ", palindrome(word));

var word = "racecar";
console.log("racecar: ", palindrome(word));