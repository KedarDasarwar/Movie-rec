const faker = require('faker'); // if you want - install faker
const { User, Movie, Rating, sequelize } = require('../models');

async function run() {
  await sequelize.sync();
  // create demo users if none
  let users = await User.findAll();
  if (users.length === 0) {
    users = [];
    for (let i = 0; i < 20; i++) {
      const u = await User.create({ email: `user${i}@test.com`, name: `User ${i}`, passwordHash: 'TEMP' });
      await u.setPassword('password');
      await u.save();
      users.push(u);
    }
  }

  // get movies (sample)
  const movies = await Movie.findAll({ limit: 2000 });
  for (const user of users) {
    // give each user 50 random ratings
    const picks = shuffle(movies).slice(0, 50);
    for (const m of picks) {
      const r = Math.floor(Math.random() * 5) + 1;
      await Rating.create({ userId: user.id, movieId: m.id, rating: r });
    }
  }
  console.log('random ratings seeded');
  process.exit(0);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

run().catch(e => { console.error(e); process.exit(1); });
