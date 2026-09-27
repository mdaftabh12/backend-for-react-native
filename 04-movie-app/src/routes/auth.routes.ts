import { Router } from "express";

import { validate } from "../middleware/validate.middleware";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/auth.controller";

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from "../validations/auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), loginUser);

router.post("/refresh-token", validate(refreshTokenSchema), refreshAccessToken);

router.post("/logout", validate(logoutSchema), logoutUser);

export { router as authRouter };
