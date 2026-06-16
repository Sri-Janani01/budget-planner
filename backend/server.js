const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const { month } = req.query;
    let result;
    if (month) {
      result = await pool.query(
        `SELECT * FROM transactions WHERE TO_CHAR(date::date, 'YYYY-MM') = $1 ORDER BY date DESC`,
        [month]
      );
    } else {
      result = await pool.query('SELECT * FROM transactions ORDER BY date DESC');
    }
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;
    if (!title || !amount || !type || !category || !date)
      return res.status(400).json({ error: 'Missing required fields' });
    const result = await pool.query(
      'INSERT INTO transactions (title, amount, type, category, date, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, parseFloat(amount), type, category, date, notes || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;
    const result = await pool.query(
      'UPDATE transactions SET title=$1, amount=$2, type=$3, category=$4, date=$5, notes=$6 WHERE id=$7 RETURNING *',
      [title, parseFloat(amount), type, category, date, notes || '', req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM transactions WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET stats
app.get('/api/stats', async (req, res) => {
  try {
    const { month } = req.query;
    const filter = month ? `WHERE TO_CHAR(date::date, 'YYYY-MM') = '${month}'` : '';

    const totals = await pool.query(`
      SELECT
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as total_expense
      FROM transactions ${filter}
    `);

    const byCategory = await pool.query(`
      SELECT category, type, SUM(amount) as total
      FROM transactions ${filter}
      GROUP BY category, type ORDER BY total DESC
    `);

    const byMonth = await pool.query(`
      SELECT TO_CHAR(date::date, 'YYYY-MM') as month,
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
      FROM transactions GROUP BY month ORDER BY month ASC LIMIT 6
    `);

    const income = parseFloat(totals.rows[0].total_income) || 0;
    const expense = parseFloat(totals.rows[0].total_expense) || 0;

    res.json({
      total_income: income,
      total_expense: expense,
      balance: income - expense,
      by_category: byCategory.rows,
      by_month: byMonth.rows
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));