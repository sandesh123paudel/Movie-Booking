import express from "express";

import mongoose from "mongoose";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("API is working");
});











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
