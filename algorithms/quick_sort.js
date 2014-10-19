function quick_sort(arr){
  console.log("Begin quick_sort: ", arr);

  // check for base case recursion
  if (arr.length == 0){
    return [];
  }

  // determine pivot point
  var left = [];
  var right = [];
  var pivot = arr[0];

  console.log("pivot: ", pivot);

  for (var i = 1; i < arr.length; i++){
    console.log("for arr[i]: ", arr[i]);
    console.log("arr[i] < pivot: ", arr[i] < pivot);
    if (arr[i] < pivot){
      left.push(arr[i]);
      console.log("after left push: ", left);
    } else {
      right.push(arr[i]);
      console.log("after right push: ", right);
    }
  }

  console.log("Concat the base recursion sorts", quick_sort(left).concat(pivot, quick_sort(right)));
  return quick_sort(left).concat(pivot, quick_sort(right));
}

var a = [];
for(var i = 0; i < 10; ++i){
  a[i] = Math.floor((Math.random() * 100) + 1);
}

console.log(quick_sort(a));