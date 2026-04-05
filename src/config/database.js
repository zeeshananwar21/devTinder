

// getting-started.js
const mongoose = require('mongoose');

const connectDB= async()=> {
    await mongoose.connect('mongodb+srv://namastedev:6GUHgaMIQQrH7ks1@nodejs.wbrirvl.mongodb.net/devTinder');
  }

module.exports = connectDB;

