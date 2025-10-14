const express = require('express');
const { User, Movie, Rating, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const router = express.Router();

router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalMovies = await Movie.count();
    const totalRatings = await Rating.count();
    const avgRatingsPerUser = totalUsers ? (totalRatings / totalUsers) : 0;

    // coverage % (movies rated at least once / total movies)
    const result = await sequelize.query(
      `SELECT COUNT(DISTINCT movieId) as cnt FROM ratings`,
      { type: QueryTypes.SELECT }
    );
    const ratedMovies = result[0].cnt || 0;
    const coverage = totalMovies ? (ratedMovies / totalMovies * 100) : 0;

    // optional: top genres (if genres present)
    const topGenres = await sequelize.query(
      `SELECT genres, COUNT(*) as cnt FROM movies WHERE genres IS NOT NULL GROUP BY genres ORDER BY cnt DESC LIMIT 10`,
      { type: QueryTypes.SELECT }
    );

    res.json({
      totalUsers, totalMovies, totalRatings, avgRatingsPerUser, coverage, topGenres
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
