import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "portfolio" });
    console.log("✅ Database Connected");
  } catch (error) {
    console.log("❌ Database connection error:", error.message);
  }
};

export default connectdb;