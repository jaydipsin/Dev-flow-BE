import jwt from "jsonwebtoken";
import User from "../modals/user.modal.js";
import bcrypt from "bcrypt";
import { JWT_REFRESH_TOKEN_SECRET } from "../config/global.js";
import { accessTokenGenerator } from "../utils/jwt.js";
import { cookiValidation } from "../utils/constants.js";

export const handleRefresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decode = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET);
    const user = await User.findById(decode.id);

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newRefreshToken = refreshTokenGenerator(user);
    const newAccessToken = accessTokenGenerator(user);

    res.cookies("refreshToken", newRefreshToken, cookiValidation);

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    user.refreshToken = hashedRefreshToken;
    // Update user
    await user.save();

    return res.status(200).json({
      accessToken: newAccessToken,
      message: "New access token generated successful",
    });
  } catch (err) {
    console.error("Error during refresh:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
