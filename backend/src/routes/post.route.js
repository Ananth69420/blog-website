const express = require("express");
const {
  createPost,
  getPosts,
  getSlugPost,
  patchPost,
  deletePost,
} = require("../controllers/post.controller");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/posts", auth, createPost);
router.get("/posts", auth, getPosts);
router.get("/posts/:slug", auth, getSlugPost);
router.patch("/posts/:id", auth, patchPost);
router.delete("/posts/:id", auth, deletePost);

module.exports = router;
