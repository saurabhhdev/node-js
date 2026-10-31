const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3001;

app.use(express.json()); // Middleware
app.use('/api/users', userRoutes); // Route prefix




// Connect to MongoDB

mongoose
  .connect('mongodb://127.0.0.1:27017/saurabh-db-1')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });
