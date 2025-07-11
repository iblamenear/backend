const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCartByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) return res.json({ cart: [] });

    const detailedCart = cart.items
      .filter(item => item.productId !== null)
      .map(item => ({
        _id: item.productId._id,
        name: item.productId.name,
        image: item.productId.image,
        price: item.productId.price,
        unit: item.productId.unit,
        quantity: item.quantity,
        berat: item.berat
      }));

    res.json({ cart: detailedCart });
  } catch (err) {
    console.error('🔥 Gagal mengambil keranjang:', err);
    res.status(500).json({ message: 'Gagal mengambil keranjang' });
  }
};

const saveCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { cart } = req.body;

    const items = cart.map(item => ({
      productId: item._id,
      quantity: item.quantity || 1,
      berat: item.berat || 100
    }));

    const saved = await Cart.findOneAndUpdate(
      { userId },
      { items },
      { upsert: true, new: true }
    );

    res.json({ message: 'Keranjang disimpan', cart: saved });
  } catch (err) {
    console.error('🔥 Gagal menyimpan keranjang:', err);
    res.status(500).json({ message: 'Gagal menyimpan keranjang' });
  }
};

/// ✅ Fungsi ini dipindahkan ke luar
const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    await Cart.findOneAndUpdate({ userId }, { items: [] }); // Kosongkan item
    res.json({ message: 'Keranjang dikosongkan' });
  } catch (err) {
    console.error('🔥 Gagal mengosongkan keranjang:', err);
    res.status(500).json({ message: 'Gagal mengosongkan keranjang' });
  }
};

/// ✅ Ekspor semua fungsi di luar
module.exports = {
  getCartByUser,
  saveCart,
  clearCart
};
