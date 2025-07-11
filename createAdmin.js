const mongoose = require('mongoose');
const readline = require('readline');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('\n🚚 Pembuatan Akun Admin\n');

    const name = await ask('Nama Admin: ');
    const email = await ask('Email: ');
    const password = await ask('Password: ');
    const address = await ask('Alamat: ');
    const phone = await ask('No. HP: ');

    const existingCourier = await User.findOne({ email });
    if (existingCourier) {
      console.log('\n❌ Admin dengan email ini sudah terdaftar.\n');
      rl.close();
      return;
    }

    const newCourier = new User({
      name,
      email,
      password,
      address,
      phone,
      role: 'admin'
    });

    await newCourier.save();
    console.log('\n✅ Akun kurir berhasil dibuat:', email);
  } catch (error) {
    console.error('\n❌ Gagal membuat kurir:', error.message);
  } finally {
    rl.close();
    mongoose.connection.close();
  }
};

main();
