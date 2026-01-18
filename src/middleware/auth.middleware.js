import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET } from "../config/global";

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
      return res.status(401).json({ message: "Token not verified" });
    }
    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
