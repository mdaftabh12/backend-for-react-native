import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

import { getUser, updateUser } from "../controllers/user.controller";

import { updateUserSchema } from "../validations/user.validation";

const router = Router();

router.use(authMiddleware);

router.get("/me", getUser);

router.patch("/me", validate(updateUserSchema), updateUser);

export default router;
