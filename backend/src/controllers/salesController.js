const db = require("../config/db");

// CREATE a new sale
exports.createSale = (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: "userId, productId, and quantity are required" });
  }

  // Get product to check stock and price
  const getProductSql = `SELECT items, price FROM products WHERE id = ?`;
  db.query(getProductSql, [productId], (err, productResults) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    if (productResults.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResults[0];
    if (product.items < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const unitPrice = product.price;

    // Insert into sales table
    const insertSaleSql = `
      INSERT INTO sales (user_id, product_id, quantity, unit_price)
      VALUES (?, ?, ?, ?)
    `;
    db.query(insertSaleSql, [userId, productId, quantity, unitPrice], (err, saleResult) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Failed to record sale" });
      }

      // Update product stock
      const updateStockSql = `UPDATE products SET items = items - ? WHERE id = ?`;
      db.query(updateStockSql, [quantity, productId], (err, updateResult) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Failed to update product stock" });
        }

        res.status(201).json({
          message: "Sale recorded successfully",
          saleId: saleResult.insertId
        });
      });
    });
  });
};

// READ all sales with optional search
exports.getAllSales = (req, res) => {
    const search = req.query.search || '';
  
    let sql = `
      SELECT 
        sales.id,
        users.first_name,
        users.last_name,
        products.name AS product_name,
        sales.quantity,
        sales.unit_price,
        (sales.quantity * sales.unit_price) AS total_price,
        sales.sold_at
      FROM sales
      JOIN users ON sales.user_id = users.id
      JOIN products ON sales.product_id = products.id
    `;
  
    const params = [];
  
    if (search) {
      sql += `
        WHERE 
          CONCAT(users.first_name, ' ', users.last_name) LIKE ? 
          OR products.name LIKE ?
          OR (sales.quantity * sales.unit_price) = ?
      `;
      params.push(`%${search}%`, `%${search}%`, Number(search));
    }
  
    sql += ` ORDER BY sales.sold_at DESC`;
  
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Failed to fetch sales" });
      }
      res.status(200).json(results);
    });
  };
  
  exports.searchSales = (req, res) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
  
    const likeQuery = `%${query}%`;
  
    const sql = `
      SELECT 
        sales.id,
        users.first_name,
        users.last_name,
        products.name AS product_name,
        sales.quantity,
        sales.unit_price,
        sales.total_price,
        sales.sold_at
      FROM sales
      JOIN users ON sales.user_id = users.id
      JOIN products ON sales.product_id = products.id
      WHERE 
        users.first_name LIKE ?
        OR users.last_name LIKE ?
        OR CONCAT(users.first_name, ' ', users.last_name) LIKE ?
        OR products.name LIKE ?
        OR CAST(sales.total_price AS CHAR) LIKE ?
      ORDER BY sales.sold_at DESC
    `;
  
    db.query(sql, [likeQuery, likeQuery, likeQuery, likeQuery, likeQuery], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Failed to search sales" });
      }
  
      res.status(200).json(results);
    });
  };
  