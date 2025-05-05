const db = require('../config/db');

exports.getUsers = (req, res) => {
  db.query('SELECT id, first_name, last_name, email FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};
