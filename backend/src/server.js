const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'social_media_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Social Media App Backend');
});

// 📝 Signup route
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).send('All fields are required');
  }

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    // Check if email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).send('Database error');
      if (result.length > 0) return res.status(409).send('Email already exists');

      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);

      const sql = `
        INSERT INTO users (first_name, last_name, email, password, confirm_password)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(sql, [firstName, lastName, email, hashedPassword, hashedConfirmPassword], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('User registered successfully');
      });
    });
  } catch (error) {
    res.status(500).send('Error while registering user');
  }
});

// 🔐 Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length === 0) return res.status(401).send({ message: 'Invalid email or password' });

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ message: 'Invalid email or password' });

    res.send({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  });
});

// 👥 View users route
app.get('/users', (req, res) => {
  db.query('SELECT id, first_name, last_name, email FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 🚀 Start server
app.listen(3001, () => 
  console.log('Server running on port 3001')
);
