const express = require('express');
const router = express.Router();
const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

router.post('/categories', addCategory);        // CREATE
router.get('/categories', getCategories);       // READ all
router.get('/categories/:id', getCategoryById); // READ one
router.put('/categories/:id', updateCategory);  // UPDATE
router.delete('/categories/:id', deleteCategory); // DELETE

module.exports = router;
