const { Movie, Rating, MovieFeature } = require('../../models');
const { Op } = require('sequelize');

/**
 * Helper: build genre vocabulary and vectors in-memory.
 * If your movies have a `genres` column (comma separated), this function builds a vocabulary.
 * It returns { vocab: [genre], movieVectors: { movieId: {genre:1,...}}}
 */
async function buildGenreVectors() {
  const movies = await Movie.findAll({ attributes: ['id', 'genres'] });
  const vocab = new Set();
  const movieGenres = {};

  movies.forEach(m => {
    const genres = m.genres ? m.genres.split(',').map(g => g.trim().toLowerCase()) : [];
    movieGenres[m.id] = genres;
    genres.forEach(g => vocab.add(g));
  });

  const vocabArr = Array.from(vocab);
  const index = {};
  vocabArr.forEach((g, i) => index[g] = i);

  // make vectors as arrays (sparse arrays)
  const movieVectors = {};
  for (const id in movieGenres) {
    const gList = movieGenres[id];
    const vec = new Array(vocabArr.length).fill(0);
    gList.forEach(g => { if (index[g] !== undefined) vec[index[g]] = 1; });
    movieVectors[id] = vec;
  }

  return { vocab: vocabArr, index, movieVectors };
}

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += (a[i] || 0) * (b[i] || 0);
  return s;
}
function norm(a) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += (a[i] || 0) * (a[i] || 0);
  return Math.sqrt(s);
}

/**
 * contentRecommend: returns top N movies similar to user's preference.
 * Strategy:
 *   - Build genre vectors (if present).
 *   - Create user preference vector by summing (movieVector * (rating-2.5)) so weight below/above neutral matters.
 *   - Compute cosine between user vector and all movies not rated by user.
 * Fallback:
 *   - If no genres present (vocab empty), fallback to using avgRating & ratingCount distance (simple.)
 */
async function contentRecommend(userId, limit = 20) {
  // load user ratings
  const ratings = await Rating.findAll({ where: { userId }, include: [{ model: Movie }] });

  // build genre vectors
  const { vocab, index, movieVectors } = await buildGenreVectors();

  if (!vocab || vocab.length === 0) {
    // fallback: recommend top popular movies not rated by the user
    const ratedIds = ratings.map(r => r.movieId);
    const candidates = await Movie.findAll({
      where: { id: { [Op.notIn]: ratedIds } },
      order: [['ratingCount', 'DESC']],
      limit
    });
    return candidates.map(c => ({ id: c.id, title: c.title, score: c.ratingCount }));
  }

  // build user preference vector
  const userVec = new Array(vocab.length).fill(0);
  let seen = new Set();
  for (const r of ratings) {
    const mv = movieVectors[r.movieId];
    if (!mv) continue;
    seen.add(r.movieId);
    const weight = (r.rating - 3); // center: ratings >3 positive, <3 negative
    for (let i = 0; i < mv.length; i++) userVec[i] += (mv[i] || 0) * weight;
  }

  const userNorm = norm(userVec);
  if (userNorm === 0) {
    // no signal — fallback to popularity
    const ratedIds = Array.from(seen);
    const candidates = await Movie.findAll({
      where: { id: { [Op.notIn]: ratedIds } },
      order: [['ratingCount', 'DESC']],
      limit
    });
    return candidates.map(c => ({ id: c.id, title: c.title, score: c.ratingCount }));
  }

  // score all candidate movies
  // we will stream through movies in DB; for performance use limit/batching if dataset is huge.
  const allMovies = await Movie.findAll({ attributes: ['id', 'title'] });
  const scored = [];
  for (const m of allMovies) {
    if (seen.has(m.id)) continue;
    const mv = movieVectors[m.id];
    if (!mv) continue;
    const s = dot(userVec, mv) / (userNorm * norm(mv) + 1e-9);
    scored.push({ id: m.id, title: m.title, score: s });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

module.exports = { contentRecommend };
