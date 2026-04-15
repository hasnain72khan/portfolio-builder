const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected');

    // Keep connection alive — ping every 4 minutes to prevent Atlas free-tier sleep
    setInterval(() => {
      mongoose.connection.db?.admin().ping().catch(() => {});
    }, 240000);
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
