import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected for aws-s3");
  } catch (err) {
    console.error("Mongo error ", err.message);
  }
};

export default connectDB;
