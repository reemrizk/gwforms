// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// MySQL config - update if needed
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rr!@MiS2024',
  database: 'evaluation_db'
});

db.connect(err => {
  if (err) throw err;
  console.log(' Connected to MySQL');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint for form submission
app.post('/submit-evaluation', (req, res) => {
  console.log(" Received submission:", req.body);

  const {
    employeeName, dressed, direction, performed, supervision, helpfulness,
    beyond, attitude, attendance, paperwork, organize, safety, total, grade
  } = req.body;

  const sql = `
    INSERT INTO evaluations (
      employee_name, dressed, direction, performed, supervision, helpfulness,
      beyond, attitude, attendance, paperwork, organize, safety, total_score, grade
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    employeeName, dressed, direction, performed, supervision, helpfulness,
    beyond, attitude, attendance, paperwork, organize, safety, total, grade
  ];

  console.log(" Inserting values:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(' DB insert failed:', err);
      return res.status(500).send('Database insert failed');
    }
    console.log(' Insert result:', result);
    res.status(200).send('Evaluation saved');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
