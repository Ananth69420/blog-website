const Report = require("../models/report.model");

const createReport = async (req, res) => {
  try {
    const { postId, commentId, reason } = req.body;
    const reporterId = req.user.userId;

    if (!postId && !commentId) {
      return res.status(400).json({
        success: false,
        message: "Either postId or commentId must be provided"
      });
    }

    // Prevent duplicate reports by the same user for same content
    const existing = await Report.findOne({
      reporterId,
      ...(postId && { postId }),
      ...(commentId && { commentId })
    });

    if (existing) {
      return res.json({ success: true, alreadyExists: true });
    }

    await Report.create({
      reporterId,
      postId: postId || null,
      commentId: commentId || null,
      reason,
    });

    return res.json({ success: true, alreadyExists: false });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error
    });
  }
};


module.exports = createReport;
