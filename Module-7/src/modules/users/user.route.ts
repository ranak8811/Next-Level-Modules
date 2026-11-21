import { Router } from "express";
import { userController } from "./user.controller.js";
import authMiddleware from "../../middleware/auth.js";
import { USER_ROLE } from "../../types/index.js";

const router = Router();

router.post("/", userController.createUser);
router.get(
  "/",
  authMiddleware(USER_ROLE.admin, USER_ROLE.agent),
  userController.getAllUsers,
);
router.get(
  "/:id",
  authMiddleware(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  userController.getSingleUser,
);
router.put(
  "/:id",
  authMiddleware(USER_ROLE.admin, USER_ROLE.user),
  userController.updateUser,
);
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
