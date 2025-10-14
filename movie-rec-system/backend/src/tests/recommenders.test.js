const request = require('supertest');
const app = require('../src/app');
const { sequelize, User, Movie, Rating } = require('../src/models');

describe('recommenders', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // seed a few movies and ratings
    await Movie.bulkCreate([{ id: 1, title: 'A' }, { id: 2, title: 'B' }, { id: 3, title: 'C' }]);
    const u = await User.create({ email: 't@test.com', passwordHash: 'x' });
    await u.setPassword('password');
    await u.save();
    await Rating.create({ userId: u.id, movieId: 1, rating: 5 });
  });

  test('content recommender excludes rated movies', async () => {
    // call /api/recommendations/content using auth token and ensure movieId:1 is not in response
  });
});
