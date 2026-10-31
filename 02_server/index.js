// Creating Servers in Node.js
// Handling URLs in Node.js
// HTTP Methods - GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

// GET => Retrieve data from the server
// POST => Send data to the server
// PUT => Update existing data on the server
// PATCH => Partially update existing data on the server
// DELETE => Remove data from the server
// HEAD => Retrieve headers only, no body
// OPTIONS => Retrieve supported HTTP methods for a resource


const http = require('http');
const fs = require('fs');
const url = require('url');

const myServer = http.createServer((req , res) => {
    if (req.url === '/favicon.ico') return res.end(); // Ignore favicon requests
	const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;

	const myUrl = url.parse(req.url, true);
	console.log(myUrl);
	
	fs.appendFile('log.txt', logEntry, (err, data) => {
		switch (myUrl.pathname) {
			case '/':
				res.end('Welcome to the Home Page');
				break;
			case '/about':
				const username = myUrl.query.username;
				res.end(`About Us Page - Hello, ${username}`);
				break;
			case '/contact':
				res.end('Contact Us Page');
				break;
			case '/search':
				const search = myUrl.query.search_query;
				res.end(`Search Results for: ${search}`);
				break;
			default:
				res.end('404 Not Found');
		}

    });
});

// https://www.youtube.com/results?search_query=atif+aslam
		// https:// -> Protocol
		// www.youtube.com -> Domain - human friendly name for IP address
		// /results -> Path - specific location on the server
		// ??search_query=arijit+singh -> Query parameter - additional data sent to the server

myServer.listen(8000 , () => console.log('Server Started!'));
