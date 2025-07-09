const express = require('express');
const router = express.Router();
const {
  getUserTransactions,
  updateShippingStatus,
  getAllUsersWithTransactions
} = require('../controllers/transactionController');

const {
  protect,
  adminOrCourier,
  admin
} = require('../middleware/authMiddleware');

// ✅ Ambil histori transaksi user login
router.get('/history', protect, getUserTransactions);

// ✅ Update status pengiriman oleh admin atau kurir
router.put('/status/:id', protect, adminOrCourier, updateShippingStatus);

// ✅ Ambil semua user + transaksi mereka (khusus admin)
router.get('/all-users', protect, admin, getAllUsersWithTransactions);

module.exports = router;
