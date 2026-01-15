import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    await mongoose.connect(process.env.MONGO_URI);

    return mongoose.connection;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

export default connectToDb;
