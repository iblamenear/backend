const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const midtransController = require('../controllers/midtransController');

// Buat transaksi dan dapatkan Snap token
router.post('/create-transaction', midtransController.createTransaction);

// Endpoint untuk menerima notifikasi dari Midtrans
router.post(
  '/notification',
  bodyParser.json({ type: 'application/json' }), // Penting!
  (req, res, next) => {
    console.log('🔥 NOTIFIKASI MASUK KE /api/midtrans/notification');
    console.log('📩 Payload:', JSON.stringify(req.body, null, 2));
    next();
  },
  midtransController.handleNotification
);

module.exports = router;
