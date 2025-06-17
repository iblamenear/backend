require('dotenv').config();
const midtransClient = require('midtrans-client');

// Konfigurasi Midtrans Snap Client
const snap = new midtransClient.Snap({
  isProduction: false, // Sandbox mode
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Utility untuk mendapatkan notification_url secara otomatis (default localhost:5000)
const getNotificationUrl = () => {
  return process.env.NOTIFICATION_URL || 'http://localhost:5000/api/midtrans/notification';
};

module.exports = {
  snap,
  getNotificationUrl,
};
