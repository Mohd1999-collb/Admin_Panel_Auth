import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  isVerified: { type: Boolean, default: false },
});

export default models.User || model("User", UserSchema);
