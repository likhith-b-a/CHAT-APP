import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" })); // Allow all origins (temporary)


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { ApiError } from "./utils/ApiError.js";
app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;
