const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // fail fast if MongoDB not available
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
