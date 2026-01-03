const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongodbUri = process.env.MONGO_URI;
    if (!mongodbUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    const conn = await mongoose.connect(mongodbUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
