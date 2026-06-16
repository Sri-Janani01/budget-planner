const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id         SERIAL PRIMARY KEY,
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
}

initDb();
module.exports = pool;