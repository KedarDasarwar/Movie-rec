const express = require('express');
const auth = require('../middlewares/auth');
const { Rating, Movie } = require('../models');

const router = express.Router();

// Create or update rating (idempotent): if user already rated movie, update rating
// POST /api/ratings  { movieId, rating }
router.post('/', auth, async (req, res) => {
  const { movieId, rating } = req.body;
  if (!movieId || !rating) return res.status(400).json({ error: 'movieId and rating required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'rating must be 1-5' });

  try {
    const movie = await Movie.findByPk(movieId);
    if (!movie) return res.status(404).json({ error: 'movie not found' });

    let r = await Rating.findOne({ where: { userId: req.user.id, movieId } });
    if (r) {
      r.rating = rating;
      await r.save();
      return res.json({ ok: true, rating: r });
    } else {
      r = await Rating.create({ userId: req.user.id, movieId, rating });
      return res.json({ ok: true, rating: r });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

// Delete rating: DELETE /api/ratings?movieId=123
router.delete('/', auth, async (req, res) => {
  const movieId = req.query.movieId;
  if (!movieId) return res.status(400).json({ error: 'movieId required' });
  try {
    const rows = await Rating.destroy({ where: { userId: req.user.id, movieId } });
    res.json({ ok: true, deleted: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

// GET /api/ratings/me
router.get('/me', auth, async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { userId: req.user.id },
      include: [{ model: Movie }]
    });
    res.json({ ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
