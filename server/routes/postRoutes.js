const express = require("express");
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadPost,
  getMyPosts,
  getPublicPost,
} = require("../controllers/postController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// Public post — NO LOGIN REQUIRED
router.get(
  "/public/:publicId",
  getPublicPost
);

// Get logged-in user's posts
router.get(
  "/my-posts",
  authMiddleware,
  getMyPosts
);

// Upload new post
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  uploadPost
);

module.exports = router;