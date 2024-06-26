const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
} = require("../controllers/user");
const authorize = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getuser", authorize, getUser);
router.get("/loginstatus", loginStatus);
router.patch("/updateuser", authorize, updateUser);

module.exports = router;
