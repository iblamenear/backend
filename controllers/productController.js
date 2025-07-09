const Product = require('../models/Product');

// 🔍 Ambil semua produk
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('❌ Error mengambil produk:', err);
    res.status(500).json({ message: 'Gagal mengambil data produk' });
  }
};

// ➕ Tambah produk
const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('❌ Gagal membuat produk:', err);
    res.status(500).json({ message: 'Gagal membuat produk' });
  }
};

// ✏️ Edit produk
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(updatedProduct);
  } catch (err) {
    console.error('❌ Gagal mengupdate produk:', err);
    res.status(500).json({ message: 'Gagal mengupdate produk' });
  }
};

// ❌ Hapus produk
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    console.error('❌ Gagal menghapus produk:', err);
    res.status(500).json({ message: 'Gagal menghapus produk' });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
