function binarySearch(items, value) {

  var startIndex = 0;
      stopIndex = items.length - 1;
      middle = Math.floor((stopIndex + startIndex) / 2);

  while(items[middle] != value && startIndex < stopIndex) {

    // adjust search area
    if (value < items[middle]){
      stopIndex = middle - 1;
    } else {
      startIndex = middle + 1;
    }

    // recalculate the middle
    middle = Math.floor((stopIndex + startIndex) / 2);
  }

  return (items[middle] != value ) ? -1 : middle;
}

binarySearch([12, 4, 5, 8, 6, 7], 6); 