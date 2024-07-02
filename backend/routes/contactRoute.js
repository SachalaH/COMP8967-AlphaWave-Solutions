const express = require("express");

const authorize = require("../middlewares/auth");
const { contactUs } = require("../controllers/contact");
const router = express.Router();

router.post("/", authorize, contactUs);

module.exports = router;
