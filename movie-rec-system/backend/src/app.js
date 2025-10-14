require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const ratingsRoutes = require('./routes/ratings');
const recRoutes = require('./routes/recommendations');
const metricsRoutes = require('./routes/metrics');

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors());               // Enable cross-origin requests
app.use(bodyParser.json());    // Parse JSON request body

// ---------------- HEALTH CHECK ----------------
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ---------------- ROUTES ----------------
app.use('/api/auth', authRoutes);          // Signup / Login
app.use('/api/movies', moviesRoutes);      // Movie listing & search
app.use('/api/ratings', ratingsRoutes);    // Add / update / delete ratings
app.use('/api/recommendations', recRoutes);// Content-based + CF recommendations
app.use('/api/metrics', metricsRoutes);    // Analytics tiles & charts

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
// ---------------- Search ----------------


// ---------------- SYNC DATABASE ----------------
async function syncDB() {
  try {
    await sequelize.sync({ alter: false }); // true in dev mode to auto-alter tables
    console.log('✅ Database synced successfully');
  } catch (err) {
    console.error('❌ Database sync failed:', err);
  }
}
syncDB();

// ---------------- EXPORT APP ----------------
module.exports = app;
