// Building REST API's using Node and Express.js

/*
GET /users - fetch all users and render HTML page
GET /api/users → fetch all users (return as JSON)
GET /api/users/1 → fetch user with ID 1  
POST /api/users → create a new user  
PUT /api/users/1 → update user with ID 1  
PATCH /api/users/1 → partially update user with ID 1
DELETE /api/users/1 → delete user with ID 1  
*/


const express = require('express');
const users = require('./MOCK_DATA.json');
const fs = require('fs');


const app = express();

const PORT = 8001;

// MIDDLEWARE  -- Like a plug-in that adds functionality to the app

app.use(express.urlencoded({extended : false}));


app.use((req , res , next) => {
    fs.appendFile('log.txt' , `\n${Date.now()}: ${req.method}: ${req.path}` , (err , data) => {
        next();
    });
});

// Middleware - have access to request and response objects in the request-response cycle

app.use((req,res,next) => {
    console.log('Hello from middleware 1');
    req.myUserName = 'saurabhhdev'; 
    next();     //Call next middleware or route handler
});

// app.use((req, res, next) => {
//     console.log('Hello from middleware 2', req.myUserName);
//     // You can modify the response object here if needed
//     res.end('Hello from middleware 2'); // End the response here
//     // If you want to continue to the next middleware, use next()  // instead of res.end
//     next(); // Call next middleware or route handler
// });


// ROUTES

app.get('/users' , (req,res) => {
    const html = `
    <ul>
    ${users.map((user) => {
        return `<li>
        ${user.first_name}</li>`;
    }).join('')}
    </ul>`;
    res.send(html);
});

// REST API

// HERE ID IS A VARIABLE AND : IS DYNAMIC

app
.route('/api/users/:id')
.get((req,res) => {     
    const id = Number(req.params.id);
    const user = users.find((user) => user.id == id);
    return res.json(user);
})

.patch((req,res) => {})
.delete((req,res) => {});




app.get('/api/users' , (req,res) => {
    // res.setHeader('myName','Saurabh');  // Set custom header

    // Add prefix X- to custom headers to avoid conflicts with built-in headers 

    res.setHeader('X-My-Name', 'Saurabh Pandey');
    return res.json(users);
});


// app.post('/api/users',(req,res) => {
//     const body = req.body;
//     users.push({...body , id: users.length+1});
//     fs.writeFile('./MOCK_DATA.json' , JSON.stringify(users) , (err , data) => {
//         return res.json({ status: "success" , id: users.length+1 });
//     });
// });


// HTTP STATUS CODES...

// 201 >> Request Created

// app.post('/api/users',(req,res) => {
//     const body = req.body;
//     users.push({...body , id: users.length+1});
//     fs.writeFile('./MOCK_DATA.json' , JSON.stringify(users) , (err , data) => {
//         return res.status(201).json({ status: "success" , id: users.length+1 });
//     });
// });


// 400 Bad Request >>

app.post('/api/users',(req,res) => {
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || body.job_title) {
        return res.status(400).json({msg : 'All fields are required'});
    }

    users.push({...body , id: users.length+1});
    fs.writeFile('./MOCK_DATA.json' , JSON.stringify(users) , (err , data) => {
        return res.status(201).json({ status: "success" , id: users.length+1 });
    });
});




app.listen(PORT , () => console.log(`Server started at Port${PORT}`));