import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verifyOtp: { type: Number, default: 0 },
  verifyOtpExpiresAt: { type: String, default: "" },
  resetOtp: { type: Number, default: 0 },
  resetOtpExpiresAt: { type: String, default: "" },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
