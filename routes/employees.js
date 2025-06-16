const express = require("express");
const router = express.Router();
const mysql = require('mysql2');


// MySQL config - update if needed
const db = mysql.createConnection({
  host: 'localhost',
  user: 'user1',
  password: 'G00dW!11',
  database: 'gwforms_db'
});

//get all employees from db
router.get('/employees', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//add new employee
router.post('/employees', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  db.query('INSERT INTO employees (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, name });
  });
});

//delete employee
router.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM employees WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;