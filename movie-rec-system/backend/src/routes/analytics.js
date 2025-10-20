const express = require('express');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const router = express.Router();

router.get('/genre-avg', async (req, res) => {
  try {
    const data = await sequelize.query(
      `
      SELECT genres AS genre, AVG(avg_Rating) AS avgRating
      FROM movies
      WHERE genres IS NOT NULL
      GROUP BY genres
      ORDER BY avgRating DESC;
      `,
      { type: QueryTypes.SELECT }
    );

    res.json({ ok: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
