const registerUser = (req, res) => {
  // register user controller
  if (!req.body.email) {
    // res.send("Please enter an email");
    res.status(400);
    throw new Error("Please add an email");
  }
  res.send("Register User");
};

module.exports = { registerUser };
