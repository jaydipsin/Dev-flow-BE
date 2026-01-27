import express from "express";
import connectToDb from "./utils/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Roustes import
import authRoutes from "./routes/auth.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();

// Middleware goes here
app.use(express.json());
app.use(cookieParser());

// Routes would go here
app.use("/auth", authRoutes);

// Auth middleware
app.use(authMiddleware);

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is running on port 8000");
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
