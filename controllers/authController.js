const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 🔐 REGISTER (khusus user biasa)
exports.register = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const newUser = new User({
      name,
      email,
      password,
      address,
      phone,
      role: 'user' // default
    });

    await newUser.save();
    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// 🔐 LOGIN USER (khusus role user)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email tidak ditemukan' });

    if (user.role !== 'user') {
      return res.status(403).json({ message: 'Akun ini bukan akun user biasa' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, role: user.role, email: user.email });
  } catch (error) {
    console.error('Login user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// 🔐 LOGIN ADMIN (khusus role admin)
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email tidak ditemukan' });

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Akun ini bukan admin' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, role: user.role, email: user.email });
  } catch (error) {
    console.error('Login admin error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// 👤 GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// ✏️ UPDATE ALAMAT & NOMOR HP
exports.updateAddress = async (req, res) => {
  try {
    const { address, phone } = req.body;

    if ((!address || address.trim() === '') && (!phone || phone.trim() === '')) {
      return res.status(400).json({ message: 'Alamat atau nomor HP harus diisi' });
    }

    const updateFields = {};
    if (address && address.trim() !== '') updateFields.address = address;
    if (phone && phone.trim() !== '') updateFields.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ message: 'Data berhasil diperbarui', user: updatedUser });
  } catch (error) {
    console.error('Gagal memperbarui data:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// 📧 CHECK EMAIL (untuk "lupa password")
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email tidak ditemukan' });

    res.json({ message: 'Email valid' });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ message: 'Gagal memeriksa email' });
  }
};

// 🔁 RESET PASSWORD (tanpa email verifikasi, untuk pengembangan)
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email dan password baru harus diisi' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email tidak ditemukan' });

    user.password = newPassword; // akan di-hash otomatis
    await user.save();

    res.json({ message: 'Password berhasil direset' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mereset password' });
  }
};

// ✅ GET ALL USERS + TRANSAKSINYA (admin only)
exports.getAllUsersWithTransactions = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    const userIds = users.map(user => user._id);
    const transactions = await Transaction.find({ userId: { $in: userIds } });

    const result = users.map(user => {
      const userTransactions = transactions.filter(
        t => t.userId.toString() === user._id.toString()
      );
      return {
        ...user._doc,
        transactions: userTransactions
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Gagal mengambil data user & transaksi:', err);
    res.status(500).json({ message: 'Gagal mengambil data user & transaksi' });
  }
};
