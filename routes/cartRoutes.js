const express = require('express');
const router = express.Router();
const { getCartByUser, saveCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCartByUser);
router.put('/', protect, saveCart);

module.exports = router;
