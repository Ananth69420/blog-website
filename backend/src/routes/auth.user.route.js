const express = require("express");
const { userRegister, userLogin } = require("../controllers/auth.controller");
const {
  userRegisterValidation,
  userLoginValidation,
} = require("../configs/validation/auth.validation");
const router = express.Router();
const validate = require("../middlewares/validate");

router.post("/register", validate(userRegisterValidation), userRegister);
router.post("/login", validate(userLoginValidation), userLogin);

module.exports = router;
