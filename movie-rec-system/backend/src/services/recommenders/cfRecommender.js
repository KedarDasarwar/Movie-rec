const { Rating, Movie } = require('../../models');
const { Op } = require('sequelize');

/**
 * Compute cosine similarity between two vectors represented as maps {movieId: rating}
 * Only consider overlapping keys to compute similarity.
 */
function cosineSim(mapA, mapB) {
  let dot = 0, na = 0, nb = 0;
  let overlap = 0;
  for (const k in mapA) {
    if (mapB[k] !== undefined) {
      overlap++;
      dot += mapA[k] * mapB[k];
    }
    na += mapA[k] * mapA[k];
  }
  for (const k in mapB) nb += mapB[k] * mapB[k];
  if (overlap === 0) return 0;
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  if (denom === 0) return 0;
  return dot / denom;
}

async function cfRecommend(userId, { limit = 20, k = 25 } = {}) {
  // 1. load all ratings (or maybe only recent subset)
  const allRatings = await Rating.findAll({});
  // build user->map and movie->set
  const userRatings = {};
  const movieSet = new Set();
  allRatings.forEach(r => {
    userRatings[r.userId] = userRatings[r.userId] || {};
    userRatings[r.userId][r.movieId] = r.rating;
    movieSet.add(r.movieId);
  });

  const target = userRatings[userId] || {};
  const ratedByTarget = new Set(Object.keys(target).map(x => parseInt(x)));

  // 2. compute similarity of target with other users
  const sims = [];
  for (const otherId in userRatings) {
    if (parseInt(otherId) === parseInt(userId)) continue;
    const sim = cosineSim(target, userRatings[otherId]);
    if (sim > 0) sims.push({ userId: otherId, sim });
  }

  // sort and keep top k
  sims.sort((a, b) => b.sim - a.sim);
  const topK = sims.slice(0, k);

  // 3. predict for each candidate movie not rated by user
  const scoreMap = {}; // movieId -> {num, den}
  for (const s of topK) {
    const otherMap = userRatings[s.userId];
    const sim = s.sim;
    for (const movieIdStr in otherMap) {
      const movieId = parseInt(movieIdStr);
      if (ratedByTarget.has(movieId)) continue; // exclude already rated
      scoreMap[movieId] = scoreMap[movieId] || { num: 0, den: 0, count: 0 };
      scoreMap[movieId].num += sim * otherMap[movieId];
      scoreMap[movieId].den += Math.abs(sim);
      scoreMap[movieId].count += 1;
    }
  }

  const candidates = [];
  for (const mid in scoreMap) {
    const { num, den } = scoreMap[mid];
    if (!den) continue;
    const pred = num / den;
    candidates.push({ movieId: parseInt(mid), score: pred });
  }

  // fetch movie titles and return top limit
  candidates.sort((a, b) => b.score - a.score);
  const top = candidates.slice(0, limit);
  const movieIds = top.map(t => t.movieId);
  const movies = await Movie.findAll({ where: { id: { [Op.in]: movieIds } } });
  const movieMap = {};
  movies.forEach(m => (movieMap[m.id] = m));

  return top.map(t => ({ id: t.movieId, title: movieMap[t.movieId]?.title || 'Unknown', score: t.score }));
}

module.exports = { cfRecommend };
