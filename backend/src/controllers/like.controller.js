const Comment = require("../models/comment.model");
const Like = require("../models/like.model");

const commentLike = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.userId;

    const existing = await Like.findOne({ userId, commentId });

    if (existing) {
      await Like.findByIdAndDelete(existing._id);
      return res.json({ success: true, liked: false });
    }

    await Like.create({ userId, commentId });
    return res.json({ success: true, liked: true });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

const postLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const existing = await Like.findOne({ userId, postId });
    if (existing) {
      await Like.findByIdAndDelete(existing._id);
      return res.json({ success: true, liked: false });
    }
    const count = await Like.countDocuments({ postId });

    await Like.create({ userId, postId });
    return res.json({ success: true, liked: true, count });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

module.exports = { commentLike, postLike };
