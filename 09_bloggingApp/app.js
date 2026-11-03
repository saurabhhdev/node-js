require('dotenv').config();

const path = require('path');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const blogController = require('./controllers/blogController');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {
  checkForAuthenticationCookie,
  requireAuth,
} = require('./middlewares/authMiddleware');

const app = express();

const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', blogController.getHome);

app.get('/login', (req, res) => {
  res.redirect('/user/login');
});

app.get('/dashboard', requireAuth, blogController.getDashboard);

app.use('/user', userRoutes);
app.use('/blog', blogRoutes);
app.use('/comment', commentRoutes);

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error('PORT must be a valid port number');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection failed. Check MONGODB_URI and database network access.');
    console.error(error.name);
    process.exit(1);
  }

  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(`Application startup failed: ${error.message}`);
  process.exit(1);
});