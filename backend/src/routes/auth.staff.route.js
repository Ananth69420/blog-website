const express = require("express");
const { staffRegister, staffLogin } = require("../controllers/auth.controller");
const {
  staffRegisterValidation,
  staffLoginValidation,
} = require("../configs/validation/auth.validation");
const router = express.Router();
const validate = require("../middlewares/validate");

router.post("/register", validate(staffRegisterValidation), staffRegister);
router.post("/login", validate(staffLoginValidation), staffLogin);

module.exports = router;
