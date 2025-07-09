const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateAddress,
  resetPassword,
  checkEmail,
  getAllUsersWithTransactions // ✅ fungsi tambahan
} = require('../controllers/authController');

const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/update-address', protect, updateAddress);
router.put('/reset-password', resetPassword);
router.post('/check-email', checkEmail);

// ✅ Admin ambil semua user + transaksinya
router.get('/all-users-with-transactions', protect, admin, getAllUsersWithTransactions);

module.exports = router;
