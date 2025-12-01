require("dotenv").config();
const express = require("express");
const connectDB = require("./configs/db/db");
const authUserRoutes = require("./routes/auth.user.route");
const authStaffRoutes = require("./routes/auth.staff.route");
const postRoutes = require("./routes/post.route");
const commentRoutes = require("./routes/comments.route");
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use("/api/auth/user", authUserRoutes);
app.use("/api/auth/staff", authStaffRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running in http://localhost:${PORT}`);
});
