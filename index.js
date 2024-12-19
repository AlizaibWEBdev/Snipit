require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser"); // Cookie parser middleware
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth")
const snippetsRoute = require("./routes/snippets")
const userRoute = require("./routes/User")
const allowedUrl = "http://localhost:5173";
const PORT = process.env.PORT || 3000;

// Rate-limiting and other security headers
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());  // Adds security headers
app.use(limiter);   // Rate limiting middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  // To parse cookies
app.use(cors({
  origin: allowedUrl,
  credentials: true,
}));


mongoose.connect(process.env.MONSOOSE_URI).then(() => {
  console.log("conntected to database");

}).catch(err => {
  console.log(err);
})

app.use("/api/snippets",snippetsRoute)
app.use("/api/users",userRoute)

app.get("/protected", require("./middlewares/isAuthenticated"), (req, res) => {
  res.json({
    message: "You have access to this protected route!",
    user: req.user,
  });
});
app.use("/api/auth", authRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
