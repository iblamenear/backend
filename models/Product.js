const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number, // harga per unit (misalnya per 100 gram)
    required: true
  },
  unit: {
    type: String,
    enum: ['gram', '100g', 'kg'],
    default: '100g',
    required: true
  },
  image: {
    type: String, // URL gambar
    required: true
  },
  category: {
    type: String,
    enum: ['Daging', 'Ayam & Bebek', 'Seafood', 'Produk Olahan'], // ✅ kategori dibatasi
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
