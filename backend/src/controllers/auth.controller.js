const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      bio,
    });

    const accessToken = jwt.sign(
      // req.user will get the id of the user which can be used to find his details
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(200).json({
      message: "User created successfully",
      user: {
        username: newUser.username,
        email: newUser.email,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      errors: error,
    });
  }
};
const userLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    //checks for existing user
    if (!user) return res.status(400).json({ message: "User doesnt exists" });

    //checks for same password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const accessToken = jwt.sign(
      // req.user will get the id of the user which can be used to find his details
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(200).json({
      message: "User login successfully",
      user: {
        username: user.username,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      errors: error,
    });
  }
};

const staffRegister = async (req, res) => {
  try {
    const { username, email, password, role, bio } = req.body;

    const staff = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (staff) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await User.create({
      username,
      password: hashedPassword,
      email,
      bio,
      role,
    });

    const accessToken = jwt.sign(
      // req.user will get the id of the user which can be used to find his details
      { staffId: newStaff._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(200).json({
      message: "Staff created successfully",
      user: {
        username: newStaff.username,
        email: newStaff.email,
        role: newStaff.role,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      errors: error,
    });
  }
};
const staffLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const staff = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    //checks for existing user
    if (!staff) return res.status(400).json({ message: "Staff doesnt exists" });

    //checks for same password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const accessToken = jwt.sign(
      // req.user will get the id of the user which can be used to find his details
      { staffId: staff._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(200).json({
      message: "Staff login successfully",
      staff: {
        username: staff.username,
        email: staff.email,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      errors: error,
    });
  }
};

module.exports = { userRegister, userLogin, staffRegister, staffLogin };
