// Code goes here

var list = [9,1,7,3,4,2,8,0,5,6];
 
function chunk(list) {
    var chunks = [];
    for(var i=0; i<list.length; i++) {
        console.log("chunk list: ", list);
        console.log("odd check: ", list.length % 2 == 1 && i+1 == list.length);
        if(list.length % 2 == 1 && i+1 == list.length) {
          chunks.push(list[i]);
        } else {
            console.log("even check: ", i % 2 === 0);
            if(i % 2 === 0) {
             // pushes the max into chunk
              console.log("Even Push: ");
              chunks.push(Math.max(list[i], list[i+1]));
            }
        }
        console.log("after " + i + " chunks: ", chunks);
    }
   
    return chunks; 
}
 
function bubble(list) {
  var remainder = chunk(list),
    heap = [list];
  console.log("bubble start: ", remainder);
  heap.push(remainder);
  while(remainder.length != 1) {
    remainder = chunk(remainder);
    heap.push(remainder);
  }
 
  return heap;
}
 
function getTopIndex(thing) {
  var currentIndex = 0,
    value = thing[thing.length-1][0],
    i = thing.length -2;
 
  while(i != -1) {
    if(!thing[i].length % 2 && currentIndex > 0) {
      currentIndex--;
    }
 
    if(thing[i][currentIndex + 1] == value) {
      currentIndex++;
      currentIndex = i ? currentIndex << 1 : currentIndex;
    } else if(currentIndex) {
          currentIndex = i ? currentIndex << 1 : currentIndex;
 
    }
      
    i--;
  }
 
  return currentIndex;
}
 
function heapSort(list) {
  var sortedList = [],
    listCopy = list,
    heap = [],
    targetLength = list.length;
 
  while(sortedList.length != targetLength) {
    heap = bubble(listCopy);
    console.log("after bubble heap: ", heap);
    sortedList.push(heap[heap.length-1][0]);
    console.log("after sortedList push: ", sortedList);
    console.log("splice top index: ", getTopIndex(heap));
    listCopy.splice(getTopIndex(heap), 1);
  }   
 
  return sortedList;
}
 
console.log(heapSort(list));