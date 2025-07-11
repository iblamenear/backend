const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: [
    {
      _id: false,
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      berat: Number,
      quantity: Number,
      price: Number,
      unit: String,
    }
  ],
  shippingAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  total: { type: Number, required: true },
  midtransToken: { type: String, required: true },
  midtransOrderId: { type: String, required: true, unique: true },
  transactionStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'settlement', 'cancel', 'deny', 'expire', 'failure', 'refund']
  },
  statusPengiriman: {
    type: String,
    enum: ['pesanan_diterima', 'diproses', 'dikirim', 'sampai'],
    default: 'pesanan_diterima'
  },
  selesaiOlehUser: {
    type: Boolean,
    default: false
  },

  // ✅ Tambahan untuk fitur komplain
  komplain: {
    type: Boolean,
    default: false
  },
  returDisetujui: {
    type: Boolean,
    default: undefined
  },
   returStatus: {
    type: String,
    enum: ['disetujui', 'kurir_menjemput', 'diperiksa', 'selesai'],
    default: undefined
  }

}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
