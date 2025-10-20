const express = require('express');
const auth = require('../middlewares/auth');
const { contentRecommend } = require('../services/recommenders/contentRecommender');
const { cfRecommend } = require('../services/recommenders/cfRecommender');
const { hybridRecommend } = require('../services/recommenders/hybrid');

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

// Hybrid: GET /api/recommendations/hybrid?limit=20&offset=0&alpha=0.6
router.get('/hybrid', auth, async (req, res) => {
  const limit = parseInt(req.query.limit || '20', 10);
  const offset = parseInt(req.query.offset || '0', 10);
  const alpha = Math.max(0, Math.min(1, parseFloat(req.query.alpha || '0.6')));
  try {
    const recs = await hybridRecommend(req.user.id, { limit, offset, alpha });
    res.json({ recommendations: recs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
