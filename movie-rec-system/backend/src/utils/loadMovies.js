// backend/src/utils/loadMovies.js
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

// ESM equivalents of __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '../data/movies.csv');
const TMDB_API_KEY = '9e8bfc11001386dd9916373ca5f9a5b5';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper to fetch poster from TMDb
async function getPoster(title) {
  try {
    const fetch = (await import('node-fetch')).default;
    const urlTitle = encodeURIComponent(title);
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${urlTitle}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDb API error: ${res.status}`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].poster_path
        ? `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`
        : null;
    }
    return null;
  } catch (err) {
    console.error('TMDb fetch error:', err.message);
    return null;
  }
}

// Load movies from CSV
export async function loadMovies() {
  return new Promise((resolve, reject) => {
    const movies = [];
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (row) => {
        movies.push({
          id: row.movieId,
          title: row.title,
          genres: row.genres,
          avg_rating: parseFloat(row.avg_rating),
          num_rating: parseInt(row.num_rating) || 0,
          poster: null,
        });
      })
      .on('end', async () => {
        console.log(`Movies loaded from CSV: ${movies.length}`);

        // Fetch posters for first 50 movies
        for (let i = 0; i < Math.min(50, movies.length); i++) {
          const movie = movies[i];
          movie.poster = await getPoster(movie.title);
          console.log(`Fetched poster for: ${movie.title}`);
        }

        resolve(movies);
      })
      .on('error', (err) => reject(err));
  });
}

// Run standalone test
if (process.argv[2] === 'test') {
  (async () => {
    const movies = await loadMovies();
    console.log('Sample movies with posters:', movies.slice(0, 10));
  })();
}
