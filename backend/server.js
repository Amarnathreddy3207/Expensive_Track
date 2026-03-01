const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '🚀 SpendSmart API is running!',
    database: 'MongoDB',
    version: '1.0.0'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
  ╔══════════════════════════════════════════╗
  ║   🚀 SpendSmart Backend is RUNNING!      ║
  ║                                          ║
  ║   URL:  http://localhost:${PORT}            ║
  ║   Mode: MongoDB (localhost:27017)        ║
  ║   Auth: JWT enabled                      ║
  ╚══════════════════════════════════════════╝
  `);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
