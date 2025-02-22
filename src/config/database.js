const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://study-buddy:study-buddy%40321@cluster0.hw1vu.mongodb.net/study-buddy"
  );
};
module.exports = connectDB;
