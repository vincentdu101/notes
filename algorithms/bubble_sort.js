function swap(arr, index1, index2) {
  var temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
}

function bubble_sort(dataStore) {
  var num_elements = dataStore.length; 

  var temp;

  for(var outer = num_elements; outer >= 2; --outer){
    console.log("Outer: ", outer);
    for(var inner = 0; inner <= outer -1; ++inner){
      console.log("Inner: ", inner);
      if(dataStore[inner] > dataStore[inner + 1]){
        swap(dataStore, inner, inner + 1);
      }
    }
  }

  return dataStore;
}

var elements = [12, 34, 2, 4, 6, 8, 9, 1];
console.log("Sorted Array: ", bubble_sort(elements));
