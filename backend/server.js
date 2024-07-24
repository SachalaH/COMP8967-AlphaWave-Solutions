const express = require("express");
const app = express();

const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const errorHandler = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const path = require("path");
const contactRouter = require("./routes/contactRoute");

const PORT = process.env.PORT || 5000;

// app middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
  origin: ["http://localhost:3000", "https://pinvent-app.vercel.app"],
  credentials: true
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app routes
app.get("/", (req, res) => {
  res.send("ShelfWave backend home.");
});

// user route
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/contact", contactRouter);

app.use(errorHandler);
// connect to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // start the server
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
