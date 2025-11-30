const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase:true,
    },
    tags: [{ type: String , trim: true }],
    status: {
      type: String,
      required: true,
      default: "draft",
      enum: { values: ["draft", "published"] },
    },
    versions: [
      {
        oldTitle: String,
        oldContent: String,
        editedAt: { type: Date, default: Date.now },
      },
    ],
    publishedAt: {
      type: Date,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
