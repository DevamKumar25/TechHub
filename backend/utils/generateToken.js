import jwt from "jsonwebtoken";

/*
==========================
Generate Access Token
15 Minutes
==========================
*/

export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    {
      id: userId,
      role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );
};

/*
==========================
Generate Refresh Token
7 Days
==========================
*/

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    }
  );
};

/*
==========================
Cookie Options
==========================
*/

export const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};