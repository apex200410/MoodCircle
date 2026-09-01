const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");

// Upload Post
const uploadPost = async (req, res) => {
  try {
    const { note } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image",
      });
    }

    if (!note || !note.trim()) {
      return res.status(400).json({
        message: "Please enter a note",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "moodcircle",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(req.file.buffer);
    });

    const post = await Post.create({
      user: req.user.id,
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
      note: note.trim(),
    });

    res.status(201).json({
      message: "Post uploaded successfully",
      post,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to upload post",
    });
  }
};

// Get Logged-in User's Posts
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
};

// Get a single post using its public ID
const getPublicPost = async (req, res) => {
  try {
    const { publicId } = req.params;

    const post = await Post.findOne({
      publicId: publicId,
    }).select("imageUrl note createdAt");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      post,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch public post",
    });
  }
};

module.exports = {
  uploadPost,
  getMyPosts,
  getPublicPost,
};

