function merge(left, right){
  console.log("merge");
  console.log("left ", left);
  console.log("right ", right);
  var result  = [],
      il      = 0,
      ir      = 0;

  while (il < left.length && ir < right.length){
    if (left[il] < right[ir]){
        result.push(left[il++]);
    } else {
        result.push(right[ir++]);
    }
  }

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

  return merge(mergeSort(left), mergeSort(right));
}

items = [12, 11, 9, 10, 6, 7, 4, 3];

items = mergeSort(items);

console.log("items ", items);