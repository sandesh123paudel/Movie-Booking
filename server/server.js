import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

//API Endpoints
app.get("/", (req, res) => {
  res.send("API is working");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connected");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
