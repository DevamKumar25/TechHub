import jwt from "jsonwebtoken";

import User from "../models/user.js";

import {
  generateAccessToken,
  generateRefreshToken,
  accessCookieOptions,
  refreshCookieOptions,
} from "../utils/generateToken.js";

/*
========================
Register Admin
========================
*/

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists.",
      });
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    const accessToken = generateAccessToken(
      admin._id,
      admin.role
    );

    const refreshToken = generateRefreshToken(admin._id);

    admin.refreshToken = refreshToken;

    await admin.save();

    res.cookie(
      "accessToken",
      accessToken,
      accessCookieOptions
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      refreshCookieOptions
    );

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
========================
Login
========================
*/

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email }).select(
      "+password +refreshToken"
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const accessToken = generateAccessToken(
      admin._id,
      admin.role
    );

    const refreshToken = generateRefreshToken(admin._id);

    admin.refreshToken = refreshToken;

    await admin.save();

    res.cookie(
      "accessToken",
      accessToken,
      accessCookieOptions
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      refreshCookieOptions
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
========================
Logout
========================
*/

export const logoutAdmin = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const admin = await User.findOne({ refreshToken }).select(
        "+refreshToken"
      );

      if (admin) {
        admin.refreshToken = null;
        await admin.save();
      }
    }

    res.clearCookie("accessToken");

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/*
========================
Refresh Token
========================
*/

export const refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const admin = await User.findById(decoded.id).select(
      "+refreshToken"
    );

    if (!admin || admin.refreshToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token.",
      });
    }

    const newAccessToken = generateAccessToken(
      admin._id,
      admin.role
    );

    res.cookie(
      "accessToken",
      newAccessToken,
      accessCookieOptions
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed.",
    });
  } catch (error) {
    next(error);
  }
};

/*
========================
Profile
========================
*/

export const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};