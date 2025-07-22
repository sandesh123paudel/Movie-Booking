import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
  },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpiresAt: { type: Number, default: 0 },
  resetOtp: { type: String, default: "" },
  resetOtpExpiresAt: { type: Number, default: 0 },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
