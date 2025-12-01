const express = require("express");
const auth = require("../middlewares/auth");
const createReport = require("../controllers/report.controller");
const router = express.Router();

router.post("/report", auth, createReport);

module.exports = router;