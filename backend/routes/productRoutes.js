const express = require("express");
const authorize = require("../middlewares/auth");
const { upload } = require("../utils/fileUpload");
const {
  createProduct,
  updateProduct,
  getProducts,
  getProduct,
  deleteProduct,
} = require("../controllers/product");
const router = express.Router();

router.post("/", authorize, upload.single("image"), createProduct);
router.patch("/:id", authorize, upload.single("image"), updateProduct);
router.get("/", authorize, getProducts);
router.get("/:id", authorize, getProduct);
router.delete("/:id", authorize, deleteProduct);

module.exports = router;
