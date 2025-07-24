import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!userId) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
    return res.json({
      success: true,
      userData: {
        fullName: user.fullName,
        profile: user?.profilePicture,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      message: "User data fetched successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
