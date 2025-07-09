const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Ambil histori transaksi milik user login
const getUserTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (err) {
    console.error('❌ Gagal ambil histori transaksi:', err);
    res.status(500).json({ message: 'Gagal mengambil histori transaksi' });
  }
};

// Admin/Kurir update status pengiriman
const updateShippingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusPengiriman } = req.body;

    const allowedStatuses = ['pesanan_diterima', 'diproses', 'dikirim', 'sampai'];
    if (!allowedStatuses.includes(statusPengiriman)) {
      return res.status(400).json({ message: 'Status pengiriman tidak valid' });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { statusPengiriman },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    res.json(transaction);
  } catch (err) {
    console.error('❌ Gagal update status pengiriman:', err);
    res.status(500).json({ message: 'Gagal memperbarui status pengiriman' });
  }
};

// ✅ Admin ambil semua user beserta transaksi mereka
const getAllUsersWithTransactions = async (req, res) => {
  try {
    const users = await User.find({}, 'name email phone'); // ambil info dasar user

    const results = await Promise.all(
      users.map(async (user) => {
        const transactions = await Transaction.find({ userId: user._id }).sort({ createdAt: -1 });
        return {
          user,
          transactions
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error('❌ Gagal ambil data user & transaksi:', err);
    res.status(500).json({ message: 'Gagal memuat data user & transaksi' });
  }
};

module.exports = {
  getUserTransactions,
  updateShippingStatus,
  getAllUsersWithTransactions // ✅ Export baru untuk frontend admin
};
