function merge(left, right){
  console.log("merge");
  console.log("left ", left);
  console.log("right ", right);
  var result  = [],
      il      = 0,
      ir      = 0;

  while (il < left.length && ir < right.length){
    // checks to see which side is larger, push the smaller one first
    if (left[il] < right[ir]){
        result.push(left[il++]);
    } else {
        result.push(right[ir++]);
    }
  }
  // merge what remains into the result
  console.log("result ", result.concat(left.slice(il)).concat(right.slice(ir)));
  return result.concat(left.slice(il)).concat(right.slice(ir));
}

function mergeSort(items){

  // Terminal case: 0 or 1 item arrays don't need sorting
  if (items.length < 2) {
      return items;
  }

  var middle = Math.floor(items.length / 2),
      left    = items.slice(0, middle),
      right   = items.slice(middle);

  // recursive merge of left and right side of array
  // base recursion is when there is only 1 element left in 
  // each merge sort
  return merge(mergeSort(left), mergeSort(right));
}

var items = [];

for(var i = 0; i < 10; ++i){
  items[i] = Math.floor((Math.random() * 100) + 1);
}

items = mergeSort(items);

console.log("items ", items);