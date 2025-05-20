const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Cek apakah ada header authorization yg dimulai dengan Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ambil user dari token dan simpan ke req.userId untuk digunakan di controller
      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Tidak terautentikasi' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Tidak terautentikasi, token tidak ditemukan' });
  }
};

// Middleware untuk cek role admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Tidak diizinkan, hanya admin yang bisa mengakses' });
  }
};