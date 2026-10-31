const fs = require('fs');

// Blocking Request (Sync)... 
// console.log('1');
// const result = fs.readFileSync('./contacts.txt', 'utf8');
// console.log(result);
// console.log('2');

// Non-blocking Request (Async)...
console.log('1');
fs.readFile('./contact.txt', 'utf8', (err, result) => { 
	if (err) throw err;
    console.log(result);
});
console.log('2');

// Note: Node.js is designed to be non-blocking and asynchronous, allowing it to handle multiple operations concurrently without waiting for each one to complete before moving on to the next. 
// This is particularly useful for I/O operations like file reading/writing, network requests, etc.