// import mongoose from "mongoose";

// const dbConnect = async () => {
//   if (mongoose.connection.readyState >= 1) {
//     return;
//   } else {
//     console.log("Connected to MongoDB...");
//     return mongoose.connect(process.env.MONGODB_URI);
//   }
// };

// export default dbConnect;


import mongoose from "mongoose";

const dbConnect = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

export default dbConnect;