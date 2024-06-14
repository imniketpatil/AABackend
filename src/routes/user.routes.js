import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleaware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/register").post(verifyAdmin, registerUser);

router.route("/login").post(loginUser);

//* Secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
