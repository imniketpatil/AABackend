import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    console.log(
      `\n\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host} \n\n`
    );
  } catch (error) {
    console.log("\n\nMONGO Connection Error \n\n", error);
    process.exit(1);
  }
};

export default connectDB;
