const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// GET all transactions
app.get('/api/transactions', (req, res) => {
  const { month } = req.query;
  let sql = 'SELECT * FROM transactions';
  let params = [];
  if (month) {
    sql += " WHERE strftime('%Y-%m', date) = ?";
    params.push(month);
  }
  sql += ' ORDER BY date DESC';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST create transaction
app.post('/api/transactions', (req, res) => {
  const { title, amount, type, category, date, notes } = req.body;
  if (!title || !amount || !type || !category || !date)
    return res.status(400).json({ error: 'Missing required fields' });

  db.run(
    'INSERT INTO transactions (title, amount, type, category, date, notes) VALUES (?,?,?,?,?,?)',
    [title, parseFloat(amount), type, category, date, notes || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM transactions WHERE id = ?', [this.lastID], (err, row) => {
        res.status(201).json(row);
      });
    }
  );
});

// PUT update transaction
app.put('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const { title, amount, type, category, date, notes } = req.body;
  db.run(
    'UPDATE transactions SET title=?, amount=?, type=?, category=?, date=?, notes=? WHERE id=?',
    [title, parseFloat(amount), type, category, date, notes || '', id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
        res.json(row);
      });
    }
  );
});

// DELETE transaction
app.delete('/api/transactions/:id', (req, res) => {
  db.run('DELETE FROM transactions WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted' });
  });
});

// GET stats
app.get('/api/stats', (req, res) => {
  const { month } = req.query;
  const filter = month ? `WHERE strftime('%Y-%m', date) = '${month}'` : '';

  db.get(`
    SELECT
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as total_income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as total_expense
    FROM transactions ${filter}
  `, [], (err, totals) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all(`
      SELECT category, type, SUM(amount) as total
      FROM transactions ${filter}
      GROUP BY category, type ORDER BY total DESC
    `, [], (err, byCategory) => {
      if (err) return res.status(500).json({ error: err.message });

      db.all(`
        SELECT strftime('%Y-%m', date) as month,
          SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
        FROM transactions GROUP BY month ORDER BY month ASC LIMIT 6
      `, [], (err, byMonth) => {
        if (err) return res.status(500).json({ error: err.message });

        const income = totals.total_income || 0;
        const expense = totals.total_expense || 0;
        res.json({
          total_income: income,
          total_expense: expense,
          balance: income - expense,
          by_category: byCategory,
          by_month: byMonth
        });
      });
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));