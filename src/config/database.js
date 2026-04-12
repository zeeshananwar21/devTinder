

// getting-started.js
const mongoose = require('mongoose');

const connectDB= async()=> {
    await mongoose.connect('mongodb+srv://namastedev:lqAODrIHCpNq7Pm5@nodejs.wbrirvl.mongodb.net/devTinder');
  }

module.exports = connectDB;

