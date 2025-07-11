const express = require('express');
const router = express.Router();

const {
  getUserTransactions,
  updateShippingStatus,
  getAllUsersWithTransactions,
  getTransactionsForCourier,
  markTransactionAsCompletedByUser,
  approveReturn,
  rejectReturn,
  markTransactionAsComplain,
  updateReturStatus
} = require('../controllers/transactionController');

const {
  protect,
  admin,
  adminOrCourier
} = require('../middleware/authMiddleware');

// ✅ Ambil histori transaksi user login
router.get('/history', protect, getUserTransactions);

// ✅ Update status pengiriman oleh admin atau kurir
router.put('/status/:id', protect, adminOrCourier, updateShippingStatus);

// ✅ Ambil semua user + transaksi mereka (khusus admin)
router.get('/all-users', protect, admin, getAllUsersWithTransactions);

// ✅ Ambil transaksi aktif untuk kurir
router.get('/for-courier', protect, adminOrCourier, getTransactionsForCourier);

// ✅ User menandai transaksinya sebagai selesai
router.patch('/mark-complete/:id', protect, markTransactionAsCompletedByUser);

// ✅ Admin menyetujui retur komplain
router.patch('/approve-return/:id', protect, admin, approveReturn);

// ✅ Admin menolak retur komplain
router.patch('/reject-return/:id', protect, admin, rejectReturn);

// ✅ User mengajukan komplain
router.patch('/mark-complain/:id', protect, markTransactionAsComplain);

// ✅ Update status progres retur (admin/kurir)
router.patch('/retur-status/:id', protect, adminOrCourier, updateReturStatus);


module.exports = router;
