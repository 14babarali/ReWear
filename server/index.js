const cors = require('cors');
const express = require('express');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const paymentRoute = require('./routes/paymentRoute');
const errorHandler = require('./utils/errorHandler');
const admin = require('./routes/admin');
const review = require('./routes/reviews');
const gigsRoute = require('./routes/gigs');

const path = require("path");
const morgan = require('morgan');
require('./database'); // Import the database connection

const app = express();

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to match the origin of your frontend app
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Add Authorization header
  credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(morgan('dev'));
// Mount the auth routes
app.use('/api', authRoutes);

app.use('/category', categoriesRoutes);

app.use('/payment', paymentRoute);

app.use('/admin',admin);

app.use('/gigs', gigsRoute);

app.use('/reviews',review);

// Register error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app;
