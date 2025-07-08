const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Movie Booking API" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Port configuration
    const PORT = process.env.PORT || 5000;
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port  http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
