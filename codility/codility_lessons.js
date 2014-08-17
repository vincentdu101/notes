// A non-empty zero-indexed array A consisting of N integers is given.
// A permutation is a sequence containing each element from 1 to N once, and only once.
// For example, array A such that:
//     A[0] = 4
//     A[1] = 1
//     A[2] = 3
//     A[3] = 2
// is a permutation, but array A such that:
//     A[0] = 4
//     A[1] = 1
//     A[2] = 3
// is not a permutation.
// The goal is to check whether array A is a permutation.
// Write a function:
// function solution(A);
// that, given a zero-indexed array A, returns 1 if array A is a permutation and 0 if it is not.
// For example, given array A such that:
//     A[0] = 4
//     A[1] = 1
//     A[2] = 3
//     A[3] = 2
// the function should return 1.
// Given array A such that:
//     A[0] = 4
//     A[1] = 1
//     A[2] = 3
// the function should return 0.
// Assume that:
// N is an integer within the range [1..100,000];
// each element of array A is an integer within the range [1..1,000,000,000].
// Complexity:
// expected worst-case time complexity is O(N);
// expected worst-case space complexity is O(N), beyond input storage (not counting the storage required for input arguments).
// Elements of input arrays can be modified.

function solution(A) {
    // write your code in JavaScript (ECMA-262, 5th edition)
    var n = A.length;
    var count = [];
    for(i = 0; i < n; i++){
        if(count[i] != 1) count[i] = undefined;
        if(count[A[i]] === undefined) count[A[i]] = 1;
        else if(count[A[i]] == 1) return 0;
    }
    count[0] = 1;
    if(count.indexOf(undefined) != -1) return 0;
    return 1;
}


// A small frog wants to get to the other side of a river. The frog is currently located at position 0, and wants to get to position X. Leaves fall from a tree onto the surface of the river.
// You are given a non-empty zero-indexed array A consisting of N integers representing the falling leaves. A[K] represents the position where one leaf falls at time K, measured in minutes.
// The goal is to find the earliest time when the frog can jump to the other side of the river. The frog can cross only when leaves appear at every position across the river from 1 to X.
// For example, you are given integer X = 5 and array A such that:
//   A[0] = 1
//   A[1] = 3
//   A[2] = 1
//   A[3] = 4
//   A[4] = 2
//   A[5] = 3
//   A[6] = 5
//   A[7] = 4
// In minute 6, a leaf falls into position 5. This is the earliest time when leaves appear in every position across the river.
// Write a function:
// function solution(X, A);
// that, given a non-empty zero-indexed array A consisting of N integers and integer X, returns the earliest time when the frog can jump to the other side of the river.
// If the frog is never able to jump to the other side of the river, the function should return −1.
// For example, given X = 5 and array A such that:
//   A[0] = 1
//   A[1] = 3
//   A[2] = 1
//   A[3] = 4
//   A[4] = 2
//   A[5] = 3
//   A[6] = 5
//   A[7] = 4
// the function should return 6, as explained above. Assume that:
// N and X are integers within the range [1..100,000];
// each element of array A is an integer within the range [1..X].
// Complexity:
// expected worst-case time complexity is O(N);
// expected worst-case space complexity is O(X), beyond input storage (not counting the storage required for input arguments).
// Elements of input arrays can be modified.

function solution(X, A) {
    // write your code in JavaScript (ECMA-262, 5th edition)
    var n = A.length;
    var output = -1; 
    if(n > 0 && X > 0 && n < 100001 && X < 100001){
        for(i = 0; i < n; i++){
            if(A[i] == X){
                output = i;
                break;   
            }
        }        
    }
    return output;
}
