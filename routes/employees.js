// routes/employees.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all employees
router.get("/employees", (req, res) => {
  db.query("SELECT id, name FROM employees", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST a new employee
router.post("/employees", (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: "Valid name is required" });
  }

  const query = "INSERT INTO employees (name) VALUES (?)";
  db.query(query, [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({ id: result.insertId, name });
  });
});

// DELETE employee by ID
router.delete("/employees/:name", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM employees WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ success: true });
  });
});

// UPDATE employee name
router.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: "Valid name is required" });
  }

  db.query("UPDATE employees SET name = ? WHERE id = ?", [name, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ success: true });
  });
});


module.exports = router;
