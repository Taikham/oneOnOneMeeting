const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // ไม่ต้องใช้ useNewUrlParser และ useUnifiedTopology แล้ว
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // ปิดโปรแกรมหากเชื่อมต่อไม่ได้
  }
};

module.exports = connectDB;