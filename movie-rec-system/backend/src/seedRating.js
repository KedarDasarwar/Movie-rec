const db = require('./config/db');
const { User, Rating, Movie } = require('./models');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    await db.authenticate();
    console.log('✅ Database connected successfully!');

    const users = [];

    // Create 20 test users (test21 - test40)
    for (let i = 21; i <= 40; i++) {
      const email = `test${i}@gmail.com`;

      // Skip if already exists
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        console.log(`⚠️  Skipping existing user: ${email}`);
        users.push(existing);
        continue;
      }

      const passwordHash = await bcrypt.hash('password123', 10);
      const user = await User.create({
        name: `TestUser${i}`,
        email,
        passwordHash, // ensure your User model has 'passwordHash' field
      });
      users.push(user);
    }

    console.log('✅ Users created/skipped successfully!');

    // Fetch all movie IDs that actually exist
    const movies = await Movie.findAll({ attributes: ['id'] });
    const movieIds = movies.map(m => m.id);

    if (movieIds.length === 0) {
      throw new Error('No movies found in the database! Please seed movies first.');
    }

    // Add 10 random ratings per user
    for (const user of users) {
      const selected = new Set();

      while (selected.size < 10 && selected.size < movieIds.length) {
        const randomMovie = movieIds[Math.floor(Math.random() * movieIds.length)];
        selected.add(randomMovie);
      }

      const ratingsData = Array.from(selected).map(movieId => ({
        userId: user.id,
        movieId,
        rating: Math.floor(Math.random() * 5) + 1, // 1 to 5
      }));

      await Rating.bulkCreate(ratingsData);
      console.log(`🎬 Added ${ratingsData.length} ratings for ${user.email}`);
    }

    console.log('✅ All users and ratings inserted successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
}

seed();