import User from "../modals/user.modal.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { accessTokenGenerator, refreshTokenGenerator } from "../utils/jwt.js";
import { cookiValidation } from "../utils/constants.js";
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "../config/global.js";
import jwt from "jsonwebtoken";

dotenv.config();

// Sign up

export const handleSignup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //   check if user already exists
    const userExists = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (userExists) {
      console.log(userExists);
      let message = null;
      userExists.email === email
        ? (message = "Email already in use")
        : (message = "Username already in use");
      return res.status(409).json({ message });
    }
    //   hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //   create new user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    // generate token
    const accessToken = accessTokenGenerator(savedUser);
    const refreshToken = refreshTokenGenerator(savedUser);

    //   if information is valid
    res.cookie("refreshToken", refreshToken, cookiValidation);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    savedUser.refreshToken = hashedRefreshToken;
    await savedUser.save();
    console.log(
      "This is the saved user :",
      res.json({ ...savedUser.toObject(), accessToken }),
    );

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during signup:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Login

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    //   check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = accessTokenGenerator(user);
    const refreshToken = refreshTokenGenerator(user);

    res.cookie("refreshToken", refreshToken, cookiValidation);

    return res.status(200).json({
      user: { ...user.toObject(), accessToken },
      message: "Login successful",
    });
  } catch (err) {
    console.error("Error during login:", err);
  }
};

// Logout

export const handleLogOut = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    const decode = jwt.decode(refreshToken, JWT_REFRESH_TOKEN_SECRET);

    if (!refreshToken || !decode) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(decode.id).select("+refreshToken");
    
    if (!user) return res.status(403).json({ message: "User not found" });

    const decodedRefreshToken = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!decodedRefreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log("Error on logout :", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reset password

export const handleresetPassword = async (req, res) => {
  // TODO :
};
