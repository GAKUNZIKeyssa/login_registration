const express = require('express');
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('../controllers/productController');

// CREATE a product
router.post('/products', addProduct);

// READ all products
router.get('/products', getAllProducts);

// READ a single product by ID
router.get('/products/:id', getProductById);

// UPDATE a product by ID
router.put('/products/:id', updateProduct);

// DELETE a product by ID
router.get('/products/search', searchProducts);
router.delete('/products/:id', deleteProduct);


module.exports = router;
