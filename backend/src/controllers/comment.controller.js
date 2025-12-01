const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

async function deleteCommentWithChildren(commentId) {
  await Comment.findByIdAndUpdate(commentId, { deleted: true });
  const children = await Comment.find({
    parentCommentId: commentId,
    deleted: { $ne: true },
  });
  for (let child of children) {
    await deleteCommentWithChildren(child._id);
  }
}

const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment, parentCommentId } = req.body;

    const post = await Post.findById(postId);
    if (!post || post.deleted) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent || parent.deleted) {
        return res.status(400).json({
          success: false,
          message: "Parent comment not found",
        });
      }
    }
    const newComment = await Comment.create({
      content: comment,
      userId: req.user.userId,
      postId,
      parentCommentId: parentCommentId || null,
    });

    const populated = await Comment.findById(newComment._id)
      .populate("userId", "username")
      .populate("parentCommentId", "content userId");

    return res.status(201).json({
      success: true,
      comment: populated,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
const getComment = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post || post.deleted) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

const patchComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;
    if (!content || content.trim() == "") {
      return res.status(400).json({
        success: false,
        message: "Content cannot be empty",
      });
    }
    const comment = await Comment.findById(commentId);

    if (!comment || comment.deleted) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (String(comment.userId) !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    comment.content = content;
    await comment.save();

    const updated = await Comment.findById(commentId)
      .populate("userId", "username")
      .populate("parentCommentId", "content userId");

    return res.json({
      success: true,
      comment: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    if (!comment || comment.deleted) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    await deleteCommentWithChildren(commentId);
    return res.json({
      success: true,
      message: "Comment and its replies deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

module.exports = { createComment, getComment, patchComment, deleteComment };
