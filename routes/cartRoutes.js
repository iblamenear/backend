const express = require('express');
const router = express.Router();
const { getCartByUser, saveCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');


router.get('/', protect, getCartByUser);
router.put('/', protect, saveCart);
router.delete('/clear', protect, clearCart);

module.exports = router;
