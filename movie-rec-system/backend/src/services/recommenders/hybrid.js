const { cfRecommend } = require('./cfRecommender');
const { contentRecommend } = require('./contentRecommender');
const { Movie, Rating } = require('../../models');

/**
 * Hybrid Recommendation System
 * Combines Collaborative and Content-based filtering
 */
async function hybridRecommend(userId, { limit = 20, alpha = 0.6, offset = 0 } = {}) {
  // 0. Determine how many ratings the user has to avoid CF for cold-start users
  const userRatingCount = await Rating.count({ where: { userId } });

  // 1. Get recommendation lists (avoid CF for brand-new users)
  const useCF = userRatingCount >= 3; // require at least 3 ratings before using CF
  const cfResults = useCF ? await cfRecommend(userId, { limit: limit * 2 }) : [];
  const contentResults = await contentRecommend(userId, limit * 2);

  // 2. Normalize both score sets to 0–1
  const normalize = (arr) => {
    if (arr.length === 0) return arr;
    const min = Math.min(...arr.map(a => a.score));
    const max = Math.max(...arr.map(a => a.score));
    return arr.map(a => ({
      ...a,
      normScore: max === min ? 0.5 : (a.score - min) / (max - min)
    }));
  };

  const cfNorm = normalize(cfResults);
  const cbNorm = normalize(contentResults);

  // 3. Merge both recommendation lists
  const combined = new Map();

  // Add collaborative results
  for (const rec of cfNorm) {
    combined.set(rec.id, { id: rec.id, title: rec.title, cf: rec.normScore, cb: 0 });
  }

  // Add/merge content results
  for (const rec of cbNorm) {
    if (combined.has(rec.id)) {
      combined.get(rec.id).cb = rec.normScore;
    } else {
      combined.set(rec.id, { id: rec.id, title: rec.title, cf: 0, cb: rec.normScore });
    }
  }

  // 4. Compute final hybrid score
  const finalList = [];
  for (const v of combined.values()) {
    // For users with fewer ratings, downweight or ignore CF entirely
    const effectiveAlpha = useCF ? alpha : 0; // 0 when not enough ratings
    const score = effectiveAlpha * v.cf + (1 - effectiveAlpha) * v.cb;
    finalList.push({ id: v.id, title: v.title, score });
  }

  // 5. Sort and return top N with offset for pagination
  finalList.sort((a, b) => b.score - a.score);
  const start = Math.max(0, parseInt(offset, 10) || 0);
  const end = start + limit;
  const page = finalList.slice(start, end);

  // enrich with movie details used by frontend cards
  const ids = page.map(p => p.id);
  const movies = await Movie.findAll({
    attributes: ['id', 'title', 'year', 'genres', 'avgRating'],
    where: { id: ids }
  });
  const movieMap = new Map(movies.map(m => [m.id, m]));

  return page.map(p => {
    const m = movieMap.get(p.id) || {};
    return {
      id: p.id,
      title: m.title || p.title,
      year: m.year || null,
      genre: m.genres || '',
      poster: m.poster || 'https://via.placeholder.com/300x450?text=No+Image',
      rating: p.score, // expose hybrid score as rating for UI badge
      score: p.score
    };
  });
}

module.exports = { hybridRecommend };