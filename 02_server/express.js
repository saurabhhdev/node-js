// Express.js Framework
// Express.js is a minimal Node.js web framework that simplifies the process of creating servers and handling routes.
// It provides a more structured way to handle requests and responses, making it easier to build web applications.

const express = require('express');

const app = express();

app.get('/' , (req,res) => {
    return res.send('Hello from Home Page');
});

app.get('/about' , (req,res) => {
    return res.send('Hello from About Page');
});


app.listen(8000, () => console.log('Server running...'));


// No need to create the HTTP server manually
// Express handles server creation internally by calling `app.listen()`
// Express is just a framework, internally it uses Node.js HTTP module to create the server