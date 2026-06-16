const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'budget.db'));

db.exec(`
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

console.log('Database initialised.');
module.exports = db;