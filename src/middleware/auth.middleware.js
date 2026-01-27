import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET } from "../config/global.js";
import { generateError } from "../shared/helper.js";
import { errorObj } from "../shared/error-message.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decode = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);

    if (!decode) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw generateError(errorObj[401], 401);
      }

      const decodedRefreshToken = jwt.verify(
        refreshToken,
        JWT_REFRESH_TOKEN_SECRET,
      );
      if (!decodedRefreshToken) {
        throw generateError(errorObj[401], 401);
      }
      const newAccessToken = accessTokenGenerator(decodedRefreshToken);
      req.setHeaders("Authorization", `Bearer ${newAccessToken}`);
    }
    req.user = decode;
    next();
  } catch (err) {
    console.error(err);
    throw generateError(errorObj[401], 401);
  }
};
