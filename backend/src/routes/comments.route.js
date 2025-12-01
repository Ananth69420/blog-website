const express = require("express");
const {
  createComment,
  getComment,
  patchComment,
  deleteComment,
} = require("../controllers/comment.controller");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/posts/:id/comments", auth, createComment);
router.get("/posts/:id/comments", auth, getComment);
router.patch("/comments/:id", auth, patchComment);
router.delete("/comments/:id", auth, deleteComment);

module.exports = router;
