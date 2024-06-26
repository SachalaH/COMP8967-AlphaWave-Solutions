const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

// logic of user registration
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation on server side just in case if client bypass the frontend validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user email already exists and prompt to sign in
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email exists please sign in");
  }
  // if not then create the user
  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate JWT and send it as a cookie
  const token = generateToken(user._id);

  // Send HTTP-only cookie to the client
  res.cookie("token", token, {
    path: "/",
    httpOnly: true, // for development
    expires: new Date(Date.now() + 1000 * 86400), // 1 day in miliseconds
    sameSite: "none",
    // secure: true, // for production
  });

  if (user) {
    // send back the user data
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// logic of user login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Request on server side
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter both email and password");
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please register");
  }

  // User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (user && passwordIsCorrect) {
    // if password is correct then generate the token
    const token = generateToken(user._id);

    // Send HTTP-only cookie to user
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      // secure: true,
    });

    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    // secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

// function to get the user info of authorized user
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

// function to get the logged in status of a user
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, photo, phone, bio } = user;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
};
