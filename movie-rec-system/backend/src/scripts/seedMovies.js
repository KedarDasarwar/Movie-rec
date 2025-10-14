const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { Movie, sequelize } = require('../models');

async function run() {
  await sequelize.sync({ alter: false });

  const csvPath = process.env.SEED_CSV || path.join(__dirname, '..', '..', 'data', 'movies.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at', csvPath);
    process.exit(1);
  }

  const rows = [];
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => {
      const id = parseInt(data.movieId);
      const title = data.title;
      const genres = data.genres || null;
      const avgRating = parseFloat(data.avg_rating || 0);
      const ratingCount = parseInt(data.num_ratings || 0);

      // Extract year from title if present
      let year = null;
      const yearMatch = title.match(/\((\d{4})\)$/);
      if (yearMatch) year = parseInt(yearMatch[1]);

      if (!id || !title) return;
      rows.push({ id, title, genres, avgRating, ratingCount, year });
    })
    .on('end', async () => {
      console.log('Rows parsed:', rows.length);

      try {
        // Bulk insert / update duplicates
        await Movie.bulkCreate(rows, {
          updateOnDuplicate: ['title', 'genres', 'avgRating', 'ratingCount', 'year']
        });
        console.log('✅ Seeding complete');
      } catch (err) {
        console.error('Error during bulk insert:', err.message);
      }

      process.exit(0);
    });
}

run().catch(e => { console.error(e); process.exit(1); });
