const express = require('express');
const router = express.Router();
const {
  createSale,
  getAllSales,
  searchSales
} = require('../controllers/salesController');

// CREATE a sale
router.post('/sales', createSale);

// READ all sales
router.get('/sales', getAllSales);
router.get('/sales/search', searchSales);

module.exports = router;
