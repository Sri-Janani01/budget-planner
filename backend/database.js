const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'budget.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT    NOT NULL,
      amount     REAL    NOT NULL,
      type       TEXT    NOT NULL,
      category   TEXT    NOT NULL,
      date       TEXT    NOT NULL,
      notes      TEXT    DEFAULT '',
      created_at TEXT    DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

console.log('Database initialised.');
module.exports = db;