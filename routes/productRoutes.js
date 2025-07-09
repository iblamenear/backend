const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect, admin } = require('../middleware/authMiddleware');

// ✅ Ambil semua produk (umum)
router.get('/', getAllProducts);

// ✅ Tambah produk (admin only)
router.post('/', protect, admin, createProduct);

// ✅ Edit produk (admin only)
router.put('/:id', protect, admin, updateProduct);

// ✅ Hapus produk (admin only)
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
