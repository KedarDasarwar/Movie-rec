const { cfRecommend } = require('./cfRecommend');
const { contentRecommend } = require('./contentRecommend');

/**
 * Hybrid Recommendation System
 * Combines Collaborative and Content-based filtering
 */
async function hybridRecommend(userId, { limit = 20, alpha = 0.6 } = {}) {
  // 1. Get both recommendation lists
  const cfResults = await cfRecommend(userId, { limit: limit * 2 }); // get extra to mix properly
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
    const score = alpha * v.cf + (1 - alpha) * v.cb;
    finalList.push({ id: v.id, title: v.title, score });
  }

  // 5. Sort and return top N
  finalList.sort((a, b) => b.score - a.score);
  return finalList.slice(0, limit);
}

module.exports = { hybridRecommend };