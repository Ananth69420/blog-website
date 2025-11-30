const { z } = require("zod");

const userRegisterValidation = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
  bio: z.string().optional().default(""),
});
const userLoginValidation = z.object({
  username: z.string().optional(),
  email: z.email().optional(),
  password: z.string(),
});
const staffRegisterValidation = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
  role: z.literal(["admin", "moderator"]),
});
const staffLoginValidation = z.object({
  username: z.string().optional(),
  email: z.email().optional(),
  password: z.string(),
});

module.exports = {
  userRegisterValidation,
  userLoginValidation,
  staffRegisterValidation,
  staffLoginValidation,
};
