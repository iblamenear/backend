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

// Admin ambil semua user beserta transaksi mereka
const getAllUsersWithTransactions = async (req, res) => {
  try {
    const users = await User.find({}, 'name email phone');

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

// Kurir ambil transaksi aktif (belum sampai) + transaksi retur disetujui
const getTransactionsForCourier = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { statusPengiriman: { $ne: 'sampai' } },
        { returStatus: { $in: ['disetujui', 'kurir_menjemput', 'diperiksa'] } }
      ]
    })
      .populate('userId', 'name email phone address')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error('❌ Gagal ambil transaksi kurir:', err);
    res.status(500).json({ message: 'Gagal memuat transaksi untuk kurir' });
  }
};

// ✅ User menandai transaksi sebagai selesai (manual)
const markTransactionAsCompletedByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId }, // hanya transaksi milik user sendiri yang boleh diupdate
      { selesaiOlehUser: true },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan atau bukan milik Anda' });
    }

    res.json({ message: 'Transaksi berhasil ditandai sebagai selesai', transaction });
  } catch (err) {
    console.error('❌ Gagal tandai transaksi selesai oleh user:', err);
    res.status(500).json({ message: 'Gagal menyelesaikan transaksi' });
  }
};

// ✅ User mengajukan komplain
const markTransactionAsComplain = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId }, // hanya transaksi milik user sendiri
      { komplain: true },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan atau bukan milik Anda' });
    }

    res.json({ message: 'Komplain berhasil diajukan', transaction });
  } catch (err) {
    console.error('❌ Gagal ajukan komplain:', err);
    res.status(500).json({ message: 'Gagal mengajukan komplain' });
  }
};

// ✅ Admin menyetujui retur komplain
const approveReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const trx = await Transaction.findById(id);
    if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });

    trx.returDisetujui = true;

    // 🟢 Tambahkan ini agar returStatus langsung berubah
    trx.returStatus = 'disetujui';

    await trx.save();

    res.status(200).json({ message: 'Retur telah disetujui dan status diperbarui.', transaction: trx });
  } catch (err) {
    console.error('❌ Gagal menyetujui retur:', err);
    res.status(500).json({ message: 'Gagal menyetujui retur.' });
  }
};

// ✅ Admin menolak retur komplain
const rejectReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const trx = await Transaction.findById(id);
    if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });

    trx.returDisetujui = false;
    await trx.save();

    res.status(200).json({ message: 'Retur telah ditolak.' });
  } catch (err) {
    console.error('❌ Gagal menolak retur:', err);
    res.status(500).json({ message: 'Gagal menolak retur.' });
  }
};

// ✅ Update status progres retur
const updateReturStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { returStatus } = req.body;

    const allowedStatuses = ['disetujui', 'kurir_menjemput', 'diperiksa', 'selesai'];
    if (!allowedStatuses.includes(returStatus)) {
      return res.status(400).json({ message: 'Status retur tidak valid' });
    }

    const trx = await Transaction.findById(id);
    if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });

    trx.returStatus = returStatus;
    await trx.save();

    res.status(200).json({ message: `Status retur diperbarui menjadi '${returStatus}'.`, transaction: trx });
  } catch (err) {
    console.error('❌ Gagal update status retur:', err);
    res.status(500).json({ message: 'Gagal memperbarui status retur.' });
  }
};


module.exports = {
  getUserTransactions,
  updateShippingStatus,
  getAllUsersWithTransactions,
  getTransactionsForCourier,
  markTransactionAsCompletedByUser,
  approveReturn,
  rejectReturn,
  markTransactionAsComplain,
  updateReturStatus

};
