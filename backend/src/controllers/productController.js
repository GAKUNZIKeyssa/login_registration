const db = require('../config/db');

// CREATE a new product
exports.addProduct = (req, res) => {
    const { name, price, items, category, expiryDate } = req.body;

    if (!name || !price || !items || !category || !expiryDate) {
        return res.status(400).json({ message: 'All fields (name, price, items, category, expiryDate) are required' });
    }

    const sql = `
        INSERT INTO products (name, price, items, category_id, expiry_date)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [name, price, items, category, expiryDate], (err, result) => {
        if (err) {
            console.error('Error inserting product:', err);
            return res.status(500).json({ message: 'Database error while adding product' });
        }
        res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
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
            categories.name AS category
        FROM 
            products
        JOIN 
            categories ON products.category_id = categories.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ message: 'Database error while fetching products' });
        }
        res.status(200).json(results);
    });
};

// READ a single product
exports.getProductById = (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Valid product ID is required' });
    }

    const sql = `SELECT * FROM products WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ message: 'Database error while fetching product' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(results[0]);
    });
};

// UPDATE a product
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price, items, category, expiryDate } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Valid product ID is required' });
    }

    if (!name || !price || !items || !category || !expiryDate) {
        return res.status(400).json({ message: 'All fields are required for update' });
    }

    const sql = `
        UPDATE products SET name = ?, price = ?, items = ?, category_id = ?, expiry_date = ?
        WHERE id = ?
    `;
    db.query(sql, [name, price, items, category, expiryDate, id], (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ message: 'Database error while updating product' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully' });
    });
};

// DELETE a product
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Valid product ID is required' });
    }

    const sql = `DELETE FROM products WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ message: 'Database error while deleting product' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    });
};

// SEARCH products by name, id, or category name
exports.searchProducts = (req, res) => {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Search query (string) is required' });
    }

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
            console.error('Error searching products:', err);
            return res.status(500).json({ message: 'Database error while searching products' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No matching products found' });
        }

        res.status(200).json(results);
    });
};
