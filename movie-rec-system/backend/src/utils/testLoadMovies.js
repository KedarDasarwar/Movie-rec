const { movies, loadMoviesCSV, attachPosters } = require('./loadMovies');

async function test() {
  await loadMoviesCSV();

  // Fetch posters for first 10 movies
  await attachPosters(10);

  console.log('First 10 movies with posters:', Object.values(movies).slice(0, 10));
}

test();
