const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware utama: proteksi login
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Simpan data user dari token
      req.userId = decoded.userId;
      req.user = decoded; // ✅ akses role, email, dsb
      return next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Tidak terautentikasi' });
    }
  }

  return res.status(401).json({ message: 'Tidak terautentikasi, token tidak ditemukan' });
};

// ✅ Middleware: hanya admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Tidak diizinkan, hanya admin yang bisa mengakses' });
  }
};

// ✅ Middleware: hanya kurir
exports.courier = (req, res, next) => {
  if (req.user && req.user.role === 'kurir') {
    return next();
  } else {
    return res.status(403).json({ message: 'Tidak diizinkan, hanya kurir yang bisa mengakses' });
  }
};

// ✅ Middleware: admin atau kurir boleh
exports.adminOrCourier = (req, res, next) => {
  const role = req.user?.role;
  if (role === 'admin' || role === 'kurir') {
    return next();
  } else {
    return res.status(403).json({ message: 'Tidak diizinkan, hanya admin atau kurir yang bisa mengakses' });
  }
};
