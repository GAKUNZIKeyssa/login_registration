const db = require('../config/db');

// CREATE a category
exports.addCategory = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const sql = `INSERT INTO categories (name) VALUES (?)`;
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to add category' });
    }
    res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
  });
};

// READ all categories
exports.getCategories = (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to fetch categories' });
    }
    res.status(200).json(results);
  });
};

// READ single category by ID
exports.getCategoryById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to fetch category' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(results[0]);
  });
};

// UPDATE category
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const sql = `UPDATE categories SET name = ? WHERE id = ?`;
  db.query(sql, [name, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to update category' });
    }
    res.status(200).json({ message: 'Category updated successfully' });
  });
};

// DELETE category
exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM categories WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to delete category' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  });
};
