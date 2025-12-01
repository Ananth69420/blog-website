const express = require("express");
const auth = require("../middlewares/auth");
const { postLike, commentLike } = require("../controllers/like.controller");
const router = express.Router();

router.post("/posts/:id/like", auth, postLike);
router.post("/comments/:id/like", auth, commentLike);

module.exports = router;