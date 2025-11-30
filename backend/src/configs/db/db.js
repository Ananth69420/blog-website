const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connection Successfully : ${conn.connection.host} / ${conn.connection.name}`
    );
  } catch (error) {
    console.log(`Connection Failed : ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
