/*

Queue.js

A function to represent a queue

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue(){

  // initialise the queue and offset
  var queue  = [];
  var offset = 0;

  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  }

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length == 0);
  }

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item){
    queue.push(item);
  }

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function(){

    // if the queue is empty, return immediately
    if (queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;

  }

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  }

}

// collect numbers from queue exercise

function distribute(nums, queues, n, digit){
  for(var i = 0; i < n; ++i){
    if (digit == 1){
      queues[nums[i] % 10].enqueue(nums[i]);
    } 
    else {
      queues[Math.floor(nums[i] / 10)].enqueue(nums[i]);
    }
  }
  return queues;
}

function collect(queues, nums){
  var i = 0;
  for(var digit = 0; digit < 10; ++digit){
    while(queues[digit] != undefined){
      nums[i++] = queues[digit].dequeue();
    }
  }
  return nums;
}

function dispArray(arr){
  var output = "";
  for(var i = 0; i < arr.length; ++i){
    output += " " + arr[i];
  }
  console.log("output: ", output);
}

var queues = [];
for(var i = 0; i < 10; ++i){
  queues[i] = new Queue();
}

var nums = [];
for(var i = 0; i < 10; ++i){
  nums[i] = Math.floor(Math.floor(Math.random() * 101)); 
}

console.log("Before radix sort: ");
dispArray(nums);
queues = distribute(nums, queues, 10, 1);
nums = collect(queues, nums);
queues = distribute(nums, queues, 10, 10);
nums = collect(queues, nums);
console.log("After radix sort: ");
dispArray(nums)