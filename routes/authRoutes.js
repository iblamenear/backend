const express = require('express');
const router = express.Router();
const {
  register,
  loginUser,
  loginAdmin,
  loginCourier, // ✅ tambahkan ini
  getProfile,
  updateAddress,
  resetPassword,
  checkEmail,
  getAllUsersWithTransactions
} = require('../controllers/authController');

const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login-user', loginUser);     // ✅ login khusus user
router.post('/login-admin', loginAdmin);   // ✅ login khusus admin
router.post('/login-courier', loginCourier); // ✅ login khusus kurir
router.get('/profile', protect, getProfile);
router.put('/update-address', protect, updateAddress);
router.put('/reset-password', resetPassword);
router.post('/check-email', checkEmail);

// ✅ Admin ambil semua user + transaksinya
router.get('/all-users-with-transactions', protect, admin, getAllUsersWithTransactions);

module.exports = router;
