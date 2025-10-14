const express = require('express');
const auth = require('../middlewares/auth');
const { contentRecommend } = require('../services/recommenders/contentRecommender');
const { cfRecommend } = require('../services/recommenders/cfRecommender');

const router = express.Router();

// Content-based: GET /api/recommendations/content?limit=20
router.get('/content', auth, async (req, res) => {
  const limit = parseInt(req.query.limit || '20', 10);
  try {
    const recs = await contentRecommend(req.user.id, limit);
    res.json({ recommendations: recs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

// Collaborative filtering: GET /api/recommendations/cf?limit=20&k=10
router.get('/cf', auth, async (req, res) => {
  const limit = parseInt(req.query.limit || '20', 10);
  const k = parseInt(req.query.k || '25', 10);
  try {
    const recs = await cfRecommend(req.user.id, { limit, k });
    res.json({ recommendations: recs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
