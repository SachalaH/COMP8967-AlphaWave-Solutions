const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");
const authorize = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getuser", authorize, getUser);
router.get("/loginstatus", loginStatus);
router.patch("/updateuser", authorize, updateUser);
router.patch("/updatepassword", authorize, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);

module.exports = router;
