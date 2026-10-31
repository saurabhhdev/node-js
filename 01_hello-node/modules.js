// Modules in NodeJS - A system for organizing and reusing code across files
// Modules allow you to split your code into separate files and import/export functionality
// Node.js uses CommonJS module system by default

// Method 1: Destructuring import (importing specific functions)
const { add, sub } = require('./math.js'); // Assuming math.js is in the same directory

console.log('=== Destructuring Import Examples ===');
console.log('add(5, 10) =', add(5, 10)); // 'add' is defined in math.js
console.log('sub(10, 5) =', sub(10, 5)); // 'sub' is defined in math.js

// Method 2: Import entire module as an object
const math = require('./math.js');

console.log('\n=== Entire Module Import Examples ===');
console.log('math.add(15, 25) =', math.add(15, 25));
console.log('math.sub(20, 8) =', math.sub(20, 8));

// Method 3: Creating and using your own module inline
const myModule = {
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
    greet: (name) => `Hello, ${name}!`
};

console.log('\n=== Inline Module Examples ===');
console.log('multiply(4, 6) =', myModule.multiply(4, 6));
console.log('divide(20, 4) =', myModule.divide(20, 4));
console.log('greet("Node.js") =', myModule.greet("Saurabh"));