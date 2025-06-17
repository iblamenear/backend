const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct } = require('../controllers/productController');

// GET semua produk
router.get('/', getAllProducts);

// POST produk baru
router.post('/', createProduct); // ✅ PENTING

module.exports = router;
