const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔗 Tersambung ke database.'))
  .catch(err => console.error('❌ Gagal konek:', err));

async function createAdmin() {
  try {
    const name = 'Nafilah Ndrella Dzaki';
    const email = 'lahlaki@gmail.com';
    const password = '1234567890';
    const role = 'admin';

    const phone = '081234567890';
    const address = 'Jl. Merdeka No.1';

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('⚠️ Admin sudah ada.');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address
    });

    console.log('✅ Admin berhasil dibuat:', newAdmin.email);
  } catch (err) {
    console.error('❌ Terjadi kesalahan:', err);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
