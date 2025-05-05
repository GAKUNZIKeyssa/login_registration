const mysql = require('mysql2');

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

module.exports = db;
