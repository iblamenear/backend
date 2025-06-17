const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser'); // Tambahkan ini
require('dotenv').config();

// ======= ROUTES =======
const midtransRoutes = require('./routes/midtransRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// ======= MIDDLEWARE =======
// Parser biasa untuk semua endpoint JSON
app.use(cors());
app.use(express.json());

// ======= ROUTES =======
app.use('/api/products', productRoutes);
app.use('/api/midtrans', midtransRoutes);
app.use('/api/auth', authRoutes);

// ======= MONGODB CONNECTION =======
mongoose.connect(process.env.MONGO_URI, {
  // Kedua opsi ini sudah deprecated dan bisa dihapus jika ingin
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
