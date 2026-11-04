// Express handles incoming HTTP requests; the URL model reads saved links from MongoDB.
const express = require('express');
const URL = require('./models/url');
const urlRoute = require('./routes/urlRoutes');
const {connectToMongoDB} = require('./connect');
const path = require('path');
const app = express();
const PORT = 8001;

// Parse JSON request bodies so handlers can read values such as req.body.url.
app.use(express.json());

// Configure EJS so Express can render HTML templates with server-side data.
app.set('view engine', 'ejs');
// Resolve views from this project directory, even if Node is started elsewhere.
app.set('views', path.resolve('./views'));

// The home page loads saved URL documents and passes them to the EJS template.
app.get('/', async (req, res) => {
   try {
      // Sorting by MongoDB's _id places recently created documents first.
      const urls = await URL.find().sort({ _id: -1 });
      res.render('index', { urls });
   } catch (error) {
      // A database or rendering failure should not look like a successful page load.
      console.error('Error loading URLs', error);
      res.status(500).send('Unable to load URLs');
   }
});


// Mount the same router under /url for creation and at / for short-link redirects.
app.use('/url' , urlRoute);
app.use('/',urlRoute);

// Start listening only after MongoDB is available, so requests can use the database.
connectToMongoDB('mongodb://127.0.0.1:27017/short-url-db')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server started at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });