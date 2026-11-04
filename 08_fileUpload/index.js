// NOTES: This is the application entry point for the file-upload example.
// It configures Express, tells Multer where to save incoming files, renders
// the upload form, handles its POST request, and starts the HTTP server.
const path = require('path');
const express = require('express');
const multer = require('multer');

// Create the Express application instance. Middleware and routes are attached
// to this object before it begins listening for requests.
const app = express();
// The browser uses this port to reach the local development server.
const PORT = 3000;

// NOTES: Configure Multer's disk storage engine. Multer calls destination
// before writing a file and filename to determine the saved file's name.
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        // Save uploaded files in the uploads directory, relative to the
        // process's current working directory. That directory must exist.
        return cb(null,'./uploads');
    },
    filename: function(req,file,cb) {
        // Prefix the submitted filename with the current timestamp to reduce
        // collisions when files share the same original name.
        return cb(null,`${Date.now()}-${file.originalname}`);
    },
});

// Create a Multer middleware instance using the disk-storage configuration.
const upload = multer({storage:storage});

// Configure EJS as the template renderer and point Express at the directory
// containing the .ejs page. The views path is resolved from the working directory.
app.set('view engine' , 'ejs');
app.set('views',path.resolve('./views'));

// Parse URL-encoded fields submitted by ordinary HTML forms. Multipart file
// submissions are parsed by Multer on the upload route below.
app.use(express.urlencoded({ extended: false}));

// Also parse JSON request bodies for any API requests that send JSON.
app.use(express.json());

// NOTES: Display the upload form by rendering views/homepage.ejs. The template
// is returned as HTML for the browser to display.
app.get('/',(req,res) => {
    return res.render('homepage');
});

// NOTES: Handle the form submission. single('yourFile') tells Multer to accept
// one uploaded file from the field whose HTML name is "yourFile". On success,
// Multer makes file metadata available as req.file and text form fields as
// req.body. The current handler logs both objects and redirects to the form.
app.post('/upload', upload.single('yourFile'), (req,res) => {
    console.log(req.body);
    console.log(req.file);
    return res.redirect('/');
});

// Start accepting HTTP requests after the application has been configured.
app.listen(PORT,() => console.log(`Server Started at ${PORT}`));
