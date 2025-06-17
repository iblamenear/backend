const midtrans = require('../utils/Midtrans');
const Transaction = require('../models/Transaction');

// === Fungsi membuat transaksi Midtrans ===
const createTransaction = async (req, res) => {
  try {
    const { cart, shippingAddress, phoneNumber, total, user } = req.body;
    const orderId = 'ORDER-' + Date.now();

    console.log('📥 [CREATE TRANSACTION] Request Body:', req.body);

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(total),
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: phoneNumber,
      },
      callbacks: {
        finish: 'http://localhost:8080/', // ubah jika sudah deploy
      },
    };

    console.log('📦 Midtrans Parameter:', parameter);

    const midtransToken = await midtrans.snap.createTransaction(parameter);

    const newTransaction = new Transaction({
      userId: user._id,
      name: user.name,
      email: user.email,
      cart,
      shippingAddress,
      phoneNumber,
      total,
      midtransToken: midtransToken.token,
      midtransOrderId: orderId,
      transactionStatus: 'pending',
    });

    await newTransaction.save();
    console.log('💾 Transaksi berhasil disimpan ke DB:', newTransaction);

    res.json({ token: midtransToken.token });
  } catch (error) {
    console.error('❌ Error saat membuat transaksi:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat transaksi' });
  }
};

// === Fungsi menerima notifikasi Midtrans ===
const handleNotification = async (req, res) => {
  try {
    console.log('📨 MASUK KE HANDLE NOTIFICATION');

    const notif = req.body;
    console.log('📩 [NOTIFIKASI MASUK] Body:', JSON.stringify(notif, null, 2));

    const { order_id, transaction_status } = notif;

    const transaction = await Transaction.findOne({ midtransOrderId: order_id });

    if (!transaction) {
      console.warn(`⚠️ Transaksi dengan Order ID ${order_id} tidak ditemukan.`);
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.transactionStatus = transaction_status;
    await transaction.save();

    console.log(`✅ Transaksi ${order_id} diupdate ke status ${transaction_status}`);
    res.status(200).json({ message: 'Notification received and status updated' });
  } catch (error) {
    console.error('❌ Error saat memproses notifikasi Midtrans:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada notifikasi' });
  }
};

module.exports = {
  createTransaction,
  handleNotification,
};
