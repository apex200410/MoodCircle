const mongoose = require("mongoose");
const crypto = require("crypto");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      required: true,
      trim: true,
    },

    // Unique ID used for public sharing
    publicId: {
      type: String,
      unique: true,
      required: true,
      default: () => crypto.randomUUID(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);