const Product = require('../models/Product');

// Ambil semua produk
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('❌ Error mengambil produk:', err);
    res.status(500).json({ message: 'Gagal mengambil data produk' });
  }
};

// Buat produk baru
const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('❌ Gagal membuat produk:', err);
    res.status(500).json({ message: 'Gagal membuat produk' });
  }
};

module.exports = {
  getAllProducts,
  createProduct
};
