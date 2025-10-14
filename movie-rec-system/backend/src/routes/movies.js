const express = require('express');
const { Movie } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * GET /api/movies
 * Regular paginated listing
 */
router.get('/', async (req, res) => {
  const q = req.query.q || '';
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const offset = (page - 1) * limit;

  const where = {};
  if (q) where.title = { [Op.like]: `%${q}%` }; // Works for SQLite
  if (req.query.genre) where.genres = { [Op.like]: `%${req.query.genre}%` };
  if (req.query.year) where.year = req.query.year;

  try {
    const { rows, count } = await Movie.findAndCountAll({
      where,
      limit,
      offset,
      order: [['ratingCount', 'DESC']],
    });

    res.json({
      page,
      limit,
      total: count,
      movies: rows,
    });
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

/**
 * GET /api/movies/search
 * For search-as-you-type dropdown (max 5 results)
 */
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  if (!q.trim()) {
    return res.json({ movies: [] });
  }

  try {
    const movies = await Movie.findAll({
      where: {
        title: { [Op.like]: `%${q}%` } // Case-insensitive LIKE works in SQLite
      },
      attributes: ['id', 'title', 'year', 'genres'],
      limit: 5, // top 5 for dropdown
      order: [['ratingCount', 'DESC']],
    });

    res.json({ movies });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
