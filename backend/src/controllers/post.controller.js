const Moderation = require("../models/moderation.model");
const Post = require("../models/post.model");
const sluggify = require("../utils/sluggify");

const createPost = async (req, res) => {
  try {
    const id = req.user.userId;

    const { title, content, tags, status } = req.body;
    const post = await Post.findOne({ title });
    if (post) {
      res.status(400).json({
        success: false,
        message: "Post with the title already Exists",
      });
      return;
    }
    const slug = sluggify(title);

    const newPost = await Post.create({
      title,
      slug,
      content,
      tags,
      status,
      publishedAt: status === "published" ? new Date() : null,
      moderationStatus: "pending",
      authorId: id,
    });

    await Moderation.create({
      postId: newPost._id,
      status: "pending",
    });

    const finalPost = await Post.findById(newPost._id).populate(
      "authorId",
      "username email"
    );

    res.status(201).json({ success: true, post: finalPost });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
const getPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const tag = req.query.tag || null;

    let filter = {
      deleted: false,
      moderationStatus: "approved",
    };
    if (search) {
      filter.title = { $regex: search, $options: "i" }; // adds a regex for seach and makes it case insensitive
    }

    if (tag) {
      filter.tags = tag;
    }

    const posts = await Post.find(filter)
      .populate("authorId", "username")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

const getSlugPost = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug }).populate(
      "authorId",
      "username email"
    );
    // post = null or post.delete = true or moderationStatus == pending | rejected or author = someoneelse
    if (
      !post ||
      post.deleted ||
      (post.moderationStatus !== "approved" &&
        post.authorId._id.toString() !== req.user?.userId)
    ) {
      return res.status(404).json({
        success: false,
        message: "Post doesn't exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};
const patchPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, tags } = req.body;
    const post = await Post.findById(postId);

    if (!post || post.deleted) {
      return res.status(404).json({
        success: false,
        message: "Post doesn't exist",
      });
    }
    if (post.authorId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    if (post.title === title || post.content === content || post.tags == tags) {
      return res.status(400).json({
        success: false,
        message: "No new changes",
      });
    }
    post.versions.push({
      oldTitle: post.title,
      oldContent: post.content,
      editedAt: new Date(),
    });
    if (title) {
      post.title = title;
      post.slug = sluggify(title);
    }
    if (tags) post.tags = tags;
    if (content) post.content = content;

    post.moderationStatus = "pending";

    await post.save();
    const finalPost = await Post.findById(postId).populate(
      "authorId",
      "username email"
    );

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: finalPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post || post.deleted) {
      res.status(400).json({
        success: false,
        message: "Post doesnt exist",
      });
      return;
    }
    if (post.authorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    post.deleted = true;
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post deleted!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

module.exports = { createPost, getPosts, getSlugPost, patchPost, deletePost };
