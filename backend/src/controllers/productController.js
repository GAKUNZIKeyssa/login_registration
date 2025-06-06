const db = require("../config/db");

// CREATE a new product
exports.addProduct = (req, res) => {
  const { name, price, items, category, expiryDate } = req.body;
  if (!name || !price || !items || !category || !expiryDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO products (name, price, items, category_id, expiry_date)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, price, items, category, expiryDate], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to add product" });
    }
    res
      .status(201)
      .json({
        message: "Product added successfully",
        productId: result.insertId,
      });
  });
};

// READ all products
exports.getAllProducts = (req, res) => {
  const sql = `
    SELECT
      products.id,
      products.name,
      products.price,
      products.items,
      products.expiry_date,
      products.category_id,
      products.created_at,
      categories.name AS category
    FROM
      products
    JOIN
      categories ON products.category_id = categories.id
  `;

  db.query(sql, (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Failed to fetch products due to a database issue.' });
      }
      res.status(200).json(results);
  });
};

// READ a single product
exports.getProductById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM products WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(results[0]);
  });
};

// UPDATE a product
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, items, category, expiryDate } = req.body;
  const sql = `
    UPDATE products SET name = ?, price = ?, items = ?, category_id = ?, expiry_date = ?
    WHERE id = ?
  `;
  db.query(
    sql,
    [name, price, items, category, expiryDate, id],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Failed to update product" });
      }
      res.status(200).json({ message: "Product updated successfully" });
    }
  );
};

// DELETE a product
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM products WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to delete product" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  });
};

exports.searchProducts = (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  // Updated SQL query to use LIKE for numeric IDs and category names
  const sql = `
      SELECT 
        products.id,
        products.name,
        products.price,
        products.items,
        products.expiry_date,
        categories.name AS category
      FROM 
        products
      JOIN 
        categories ON products.category_id = categories.id
      WHERE 
        products.name LIKE ? 
        OR CAST(products.id AS CHAR) LIKE ? 
        OR categories.name LIKE ?
    `;

  const likeQuery = `%${query}%`;
  db.query(sql, [likeQuery, likeQuery, likeQuery], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to search products" });
    }

    res.status(200).json(results);
  });
};

// GET /products/expiry-filter?type=month OR ?type=date&value=2025-05-10
exports.filterByExpiry = (req, res) => {
  const { type, value } = req.query;
  let sql = `
      SELECT 
          products.id,
          products.name,
          products.price,
          products.items,
          products.expiry_date,
          products.category_id,
          products.created_at,
          categories.name AS category
      FROM 
          products
      JOIN 
          categories ON products.category_id = categories.id
      WHERE 
  `;

  switch (type) {
      case 'today':
          sql += `DATE(products.expiry_date) = CURDATE()`;
          break;
      case 'week':
          sql += `YEARWEEK(products.expiry_date, 1) = YEARWEEK(CURDATE(), 1)`;
          break;
      case 'month':
          sql += `MONTH(products.expiry_date) = MONTH(CURDATE()) AND YEAR(products.expiry_date) = YEAR(CURDATE())`;
          break;
      case 'year':
          sql += `YEAR(products.expiry_date) = YEAR(CURDATE())`;
          break;
      case 'date':
          if (!value) return res.status(400).json({ message: 'Date value is required for custom date filter.' });
          sql += `DATE(products.expiry_date) = ?`;
          break;
      default:
          return res.status(400).json({ message: 'Invalid filter type.' });
  }

  db.query(sql, [value], (err, results) => {
      if (err) {
          console.error('Error filtering products:', err);
          return res.status(500).json({ message: 'Database error during expiry filter.' });
      }
      res.status(200).json(results);
  });
};
