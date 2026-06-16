const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET all transactions
app.get('/api/transactions', (req, res) => {
  try {
    const { month } = req.query;
    let rows = month
      ? db.prepare(`SELECT * FROM transactions WHERE strftime('%Y-%m', date) = ? ORDER BY date DESC`).all(month)
      : db.prepare('SELECT * FROM transactions ORDER BY date DESC').all();
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create transaction
app.post('/api/transactions', (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;
    if (!title || !amount || !type || !category || !date)
      return res.status(400).json({ error: 'Missing required fields' });
    const result = db.prepare(
      'INSERT INTO transactions (title, amount, type, category, date, notes) VALUES (?,?,?,?,?,?)'
    ).run(title, parseFloat(amount), type, category, date, notes || '');
    const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update transaction
app.put('/api/transactions/:id', (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;
    db.prepare(
      'UPDATE transactions SET title=?, amount=?, type=?, category=?, date=?, notes=? WHERE id=?'
    ).run(title, parseFloat(amount), type, category, date, notes || '', req.params.id);
    const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
    res.json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE transaction
app.delete('/api/transactions/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET stats
app.get('/api/stats', (req, res) => {
  try {
    const { month } = req.query;
    const filter = month ? `WHERE strftime('%Y-%m', date) = '${month}'` : '';

    const totals = db.prepare(`
      SELECT
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as total_expense
      FROM transactions ${filter}
    `).get();

    const byCategory = db.prepare(`
      SELECT category, type, SUM(amount) as total
      FROM transactions ${filter}
      GROUP BY category, type ORDER BY total DESC
    `).all();

    const byMonth = db.prepare(`
      SELECT strftime('%Y-%m', date) as month,
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
      FROM transactions GROUP BY month ORDER BY month ASC LIMIT 6
    `).all();

    const income = totals.total_income || 0;
    const expense = totals.total_expense || 0;
    res.json({
      total_income: income,
      total_expense: expense,
      balance: income - expense,
      by_category: byCategory,
      by_month: byMonth
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));