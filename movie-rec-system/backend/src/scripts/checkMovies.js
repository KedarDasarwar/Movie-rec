const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) throw err;
});

db.serialize(() => {
  db.get('PRAGMA busy_timeout = 5000'); // wait 5 seconds if locked

  db.get('SELECT COUNT(*) AS count FROM movies', (err, row) => {
    if (err) throw err;
    console.log('✅ Total movies in DB:', row.count);
  });

  db.all('SELECT * FROM movies LIMIT 5', (err, rows) => {
    if (err) throw err;
    console.log('✅ First 5 movies:');
    rows.forEach((r) => console.log(r));
    db.close();
  });
});
