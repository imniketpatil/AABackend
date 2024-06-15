import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  updateAccountDetails,
  deleteAccount,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleaware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/register").post(verifyAdmin, registerUser);

router.route("/login").post(loginUser);

//* Secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/edit-user").patch(verifyJWT, updateAccountDetails);
router.route("/delete-user/:id").delete(verifyJWT, deleteAccount);

export default router;
