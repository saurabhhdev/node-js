// File Handling in NodeJS
// Node.js provides a built-in 'fs' module for file system operations
// It allows to read, write, and manipulate files and directories

// SYNCHRONOUS OPERATIONS (Blocking) - block the event loop until the operation completes
// ASYNCHRONOUS OPERATIONS (Non-blocking) - allow the event loop to continue running while the operation is in progress
// Note: Async operations are preferred in Node.js for better performance

const fs = require("fs");

// WRITE OPERATIONS

// .. Synchronous write

// fs.writeFileSync('./saurabh.txt' , 'Hey I am Saurabh');



// .. Asynchronous write

// fs.writeFile("./saurabh.txt" , "Hello Everyone Async" , (err)=> {})


// READ OPERATIONS

//  .. Synchronous read

// const result = fs.readFileSync("./contact.txt","utf-8");
// console.log(result);


// .. Asynchronous read

// fs.readFile("./contact.txt","utf-8" , (err,result)=>{
//     if (err) {
//         console.log('Error',err);
//     } else {
//         console.log(result);
//     }
// });



// APPEND OPERATIONS

// .. Synchronous

// fs.appendFileSync('./saurabh.txt','Hello this is a test\n');


// .. Asynchronous

// fs.appendFile('./saurabh.txt', '\nHello Append Async', (err) => {
//   if (err) {
//     console.error('Error appending to file:', err);
//     return;
//   }
//   console.log('File appended successfully');
// });




// COPY OPERATIONS

// .. Synchronous copy

// fs.copyFileSync('./saurabh.txt', './file_copy.txt');

//..  Asynchronous copy


// fs.copyFile('./saurabh.txt', './file_copy_async.txt', (err) => {
//   if (err) {
//     console.error('Error copying file:', err);
//     return;
//   }
//   console.log('File copied successfully');
// });


// DELETE OPERATIONS

// .. Synchronous delete

// fs.unlinkSync('./file_copy.txt');

//..  Asynchronous delete

// fs.unlink('./file_copy_async.txt', (err) => {
//   if (err) {
//     console.error('Error deleting file:', err);
//     return;
//   }
//   console.log('File deleted successfully');
// });



// STATISTICS OPERATIONS

// .. Synchronous stats
// const stats = fs.statSync('./saurabh.txt');
// console.log(stats);

// .. Asynchronous stats

// fs.stat('./saurabh.txt', (err, stats) => {
//   if (err) {
//     console.error('Error getting file stats:', err);
//     return;
//   }
//   console.log(stats);
// });

// DIRECTORY OPERATIONS


// ..  Create a directory

// fs.mkdirSync('./new_directory');
// fs.mkdirSync('./new_directory/sub_directory');

// fs.mkdirSync('./new_directory1/sub_directory1', { recursive: true });







