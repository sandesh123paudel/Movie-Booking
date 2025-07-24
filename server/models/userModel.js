import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
  },
  // Add these new fields for Google authentication
  googleId: { type: String, unique: true, sparse: true }, // sparse allows multiple null values
  profilePicture: { type: String },

  verifyOtp: { type: String, default: "" },
  verifyOtpExpiresAt: { type: Number, default: 0 },
  resetOtp: { type: String, default: "" },
  resetOtpExpiresAt: { type: Number, default: 0 },
});
// Add a pre-save hook to handle password requirement
userSchema.pre("save", function (next) {
  // If it's a Google user (has googleId but no password), don't require password
  if (this.googleId && !this.password) {
    return next();
  }

  // For regular users, password is required
  if (!this.googleId && !this.password) {
    return next(new Error("Password is required for non-Google users"));
  }

  next();
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
