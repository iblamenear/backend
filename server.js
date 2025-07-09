const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// ======= IMPORT ROUTES =======
const midtransRoutes = require('./routes/midtransRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();


// ======= MIDDLEWARE =======
app.use(cors());
app.use(express.json()); // body parser JSON

// ======= ROUTES =======
app.use('/api/products', productRoutes);
app.use('/api/midtrans', midtransRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/transactions', transactionRoutes);

// ======= MONGODB CONNECTION =======
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
